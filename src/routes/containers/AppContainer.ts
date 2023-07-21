import { LiveEvent, LiveShareClient } from "@microsoft/live-share";
import { LiveShareHost } from "@microsoft/teams-js";
import { ContainerSchema, IFluidContainer, SharedMap } from "fluid-framework";


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