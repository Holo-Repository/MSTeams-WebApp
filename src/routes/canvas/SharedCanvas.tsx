import React from "react";
import { LiveShareClient } from "@microsoft/live-share";
import { InkingManager, LiveCanvas } from "@microsoft/live-share-canvas";
import { LiveShareHost } from "@microsoft/teams-js";
import { ContainerSchema } from "fluid-framework";

import DrawingManager from "./DrawingManager";

class SharedCanvas extends React.Component {
    state = {
        inkingManager: undefined,
    }

    async componentDidMount() {
        // Setup the Fluid container
        const host = LiveShareHost.create();
        const liveShare = new LiveShareClient(host);
        const schema: ContainerSchema = {initialObjects: { liveCanvas: LiveCanvas }};
        const { container } = await liveShare.joinContainer(schema);
        const liveCanvas = container.initialObjects.liveCanvas as LiveCanvas;

        // Get the canvas host element
        const canvasHostElement = document.getElementById("canvas-host");
        const inkingManager = new InkingManager(canvasHostElement!);
        console.log("Inking manager", inkingManager);
        
        // Begin synchronization for LiveCanvas
        await liveCanvas.initialize(inkingManager);
        
        inkingManager.activate();
        this.setState({ inkingManager });
    }
    
    render(): React.ReactNode {
        const { inkingManager: ink } = this.state;
        console.log("Ink", ink);

        return (
            <div>
                <div id="canvas-host"
                    style={{width: "100vw", height: "90vh", border: "1px solid black", backgroundColor: "white"}}
                ></div>
                {!ink ? <></> : <DrawingManager inkingManager={ink}/>}
            </div>
        );
    }
}

export default SharedCanvas;
