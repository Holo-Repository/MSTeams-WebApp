import React from "react";
import { LiveShareClient } from "@microsoft/live-share";
import { InkingManager, LiveCanvas } from "@microsoft/live-share-canvas";
import { LiveShareHost } from "@microsoft/teams-js";
import { ContainerSchema } from "fluid-framework";

import DrawingManager from "./DrawingManager";
import './SharedCanvas.css'; 

/**
 * The shared canvas component.
 * This component is responsible for setting up the Fluid container and the inking manager.
 * As well as rendering the drawing manager component in the newly created live canvas.
 */
class SharedCanvas extends React.Component {
    state = {
        inkingManager: undefined,
    }

    /**
     * Initializes the Fluid container and the inking manager once the component is mounted.
     */
    async componentDidMount() {
        // This code is taken directly from the live canvas documentation

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
        this.setState({ inkingManager });
    }
    
    render(): React.ReactNode {
        const { inkingManager: ink } = this.state;

        return (
            <div>   
                <div id="canvas-host"
                    style={{width: "100vw", height: "90vh", border: "1px solid black", backgroundColor: "white", zIndex: 1}}>
                    <div className="drawing-manager">{ink && <DrawingManager  inkingManager={ink}/>}</div>
                </div>
            </div>
        );
    }
}

export default SharedCanvas;
