import { LiveEvent, LiveShareClient } from "@microsoft/live-share";
import { LiveShareHost } from "@microsoft/teams-js";
import { ContainerSchema, IFluidContainer, SharedMap } from "fluid-framework";


/**
 * AppContainer is a static class that provides a connection to the generic Fluid Container for this app.
 * The container is managed by Teams and is shared by all members of the team.
 * 
 * However, there can only exist one Teams-managed container per team, so this class is a singleton
 * and makes sure that the schema is consistent across all instances of the container.
 */
class AppContainer {
    static readonly schema = { 
        initialObjects: {
            newContainerEvent: LiveEvent,
            appState: SharedMap,
        } 
    } as ContainerSchema;

    private constructor() {}
    
    public static async connect(): Promise<IFluidContainer> {
        // Setup the Fluid container
        const host = LiveShareHost.create();
        const liveShare = new LiveShareClient(host);
        const { container } = await liveShare.joinContainer(this.schema);

        return container;
    }

}

export default AppContainer;