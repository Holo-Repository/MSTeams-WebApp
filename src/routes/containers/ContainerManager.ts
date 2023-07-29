import { TableClient } from "@azure/data-tables";
import {
    getLiveShareContainerSchemaProxy,
    HostTimestampProvider,
    LiveShareRuntime,
} from "@microsoft/live-share";
import {
    ContainerSchema
} from "fluid-framework";
import {
    AzureClientProps,
    AzureClient
} from "@fluidframework/azure-client";
import { LiveCanvas } from "@microsoft/live-share-canvas";

import getTableClient from "./TableClient";
import ContainerMap from "./ContainerMap";
import FluidTokenProvider from "./FluidTokenProvider";
import HoloLiveShareHost from "./HoloLiveShareHost";


/**
 * This class provides a connection to the Azure Fluid Relay and the Table Storage where the
 * mapping between location IDs and Fluid container IDs is stored.
 * 
 * It abstracts the complexity of creating, connecting and managing the Fluid containers.
 */
class ContainerManager {
    locationId: string;
    private tableClient: TableClient;
    private client: AzureClient;

    constructor(locationId?: string, user?: any) {
        if (!locationId || locationId === "") throw new Error("Location ID is required");
        this.locationId = locationId;

        // Connect to the table storage
        this.tableClient = getTableClient();

        // Define a custom connection to the Azure Fluid Relay
        const options: AzureClientProps = {
            connection: {
                tenantId: 'a04ee05a-7649-44cc-a6ab-39a91f793bb8',
                tokenProvider: new FluidTokenProvider('https://fluid-jwt-provider.azurewebsites.net/api/JWTProvider', user),
                endpoint: 'https://eu.fluidrelay.azure.com',
                type: 'remote'
            }
        };
        this.client = new AzureClient(options) // Initialize AzureClient instance
    }

    /**
     * Get the entity from the table storage that represents this location
     * If the entity does not exist, it will be created
     * 
     * @param attempts Max number of attempts to get the entity
     * @throws Error if the entity could not be retrieved in the given number of attempts
     * @returns Promise<any> The entity
     * @private
     */
    private getEntity(attempts: number = 3): Promise<any> {
        return this.tableClient.getEntity(this.locationId, this.locationId)
            .then((entity) => entity)
            .catch((err) => {
                console.log(`Failed to retrieve entity, remaining attempt: ${attempts - 1}`, err);
                if (err.statusCode === 404) {
                    this.initializeEntity();
                    if (attempts > 0)
                        return this.getEntity(attempts - 1);
                    else throw new Error(`Could not get entity in less than ${attempts} attempts`);
                }
                throw err;
            });
    }
    
    /**
     * Initialize the entity in the table storage that represents this location
     * 
     * @returns Promise<any> The entity
     * @throws Error if the entity could not be created
     * @private
     */
    private initializeEntity() {
        console.log("Initializing location");
        return this.tableClient.createEntity({
            partitionKey: this.locationId,
            rowKey: this.locationId,
            containers: '[]'
        }).catch((err) => {
            console.log(err);
            throw err;
        });
    }

    /**
     * Get the list of containers in this location
     * 
     * @returns Promise<Container[]> The list of containers
     */
    async listContainers() {
        return JSON.parse((await this.getEntity()).containers as string) as ContainerMap[]
    }
    
    /**
     * Append a container to the list of containers in this location
     * 
     * @param container The container to append
     */
    async appendContainerId(container: ContainerMap) {
        const entity = await this.getEntity();
        entity.containers = JSON.stringify([...JSON.parse(entity.containers as string), container]);
        return this.tableClient.updateEntity(entity, 'Replace');
    }

    /**
     * Get the host and container schema
     * 
     * @returns { host: AzureLiveShareHost, injectedSchema: ContainerSchema }
     * @private
     */
    private getSchema() {
        const schema = { // Define Fluid schema
            initialObjects: {
                // presence: LivePresence,
                liveCanvas: LiveCanvas,
            }
        };
        
        // Create host
        const host = HoloLiveShareHost.create();
        // Manually supplying a started timestamp provider because otherwise it would give an error that the provider had not been started
        const tsp = new HostTimestampProvider(host); tsp.start();
        // Create the LiveShareRuntime, which is needed for `LiveDataObject` instances to work
        const runtime = new LiveShareRuntime(host, tsp);
        // Inject the LiveShareRuntime dependency into the ContainerSchema
        const injectedSchema: ContainerSchema = getLiveShareContainerSchemaProxy(schema, runtime);
        return { host, injectedSchema };
    }
    
    /**
     * Create a new Fluid container
     * Sets the AzureAudience into the AzureLiveShareHost returned
     * 
     * @param name The name of the container
     * @param description The description of the container
     * @returns The id of the container created
     */
    async createContainer(name: string, description: string) {
        const { host, injectedSchema } = this.getSchema();
        const { container, services } = await this.client.createContainer(injectedSchema);
        // host.setAudience(services.audience);

        const id = await container.attach();
        // await this.appendContainerId({ id, name, description, locationId: this.locationId } as Container);
        const now = new Date().toISOString();
        await this.appendContainerId({ id, name:name, description:description, locationId: this.locationId } as ContainerMap);

        // Detach container
        container.disconnect();

        return id;
    }

    /**
     * Get a Fluid container
     * Sets the AzureAudience into the AzureLiveShareHost returned
     * 
     * @param containerId The container to get
     * @returns { container: Container, services: any, host: AzureLiveShareHost }
     */
    async getContainer(containerId: string) {
        const { host, injectedSchema } = this.getSchema();
        const { container: c, services } = await this.client.getContainer(containerId, injectedSchema);
        host.setAudience(services.audience);
        
        return { container: c, services, host };
    }
}

export default ContainerManager;