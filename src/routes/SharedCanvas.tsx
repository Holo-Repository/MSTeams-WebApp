import React from "react";
import { LiveShareClient } from "@microsoft/live-share";
import { InkingManager, LiveCanvas } from "@microsoft/live-share-canvas";
import { LiveShareHost } from "@microsoft/teams-js";
import { ContainerSchema } from "fluid-framework";

class SharedCanvas extends React.Component {
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

        // Begin synchronization for LiveCanvas
        await liveCanvas.initialize(inkingManager);

        inkingManager.activate();
    }

    render() {
        return (
            <div>
                <div id="canvas-host"></div>
            </div>
        );
    }
}

export default SharedCanvas;
