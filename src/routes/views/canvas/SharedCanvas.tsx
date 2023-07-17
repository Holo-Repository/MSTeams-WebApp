import React from "react";
import { InkingManager, LiveCanvas } from "@microsoft/live-share-canvas";

import DrawingManager from "./DrawingManager";
import ContainerManager from "../../containers/ContainerManager";


export interface SharedCanvasProps {
    container: string;
    containerManager: ContainerManager;
}

/**
 * The shared canvas component.
 * This component is responsible for setting up the Fluid container and the inking manager.
 * As well as rendering the drawing manager component in the newly created live canvas.
 */
class SharedCanvas extends React.Component<SharedCanvasProps> {
    state = {
        inkingManager: undefined,
    }

    /**
     * Initializes the Fluid container and the inking manager once the component is mounted.
     */
    async componentDidMount() {
        const { container } = await this.props.containerManager.getContainer(this.props.container);
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
                    style={{width: "100vw", height: "90vh", border: "1px solid black", backgroundColor: "white"}}
                ></div>
                {ink && <DrawingManager inkingManager={ink}/>}
            </div>
        );
    }
}

export default SharedCanvas;
