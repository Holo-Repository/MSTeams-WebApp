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

    canvas: React.RefObject<HTMLDivElement>;

    constructor(props: SharedCanvasProps) {
        super(props);
        this.canvas = React.createRef<HTMLDivElement>();
    }

    /**
     * Initializes the Fluid container and the inking manager once the component is mounted.
     */
    async componentDidMount() {
        const { container } = await this.props.containerManager.getContainer(this.props.container);
        const liveCanvas = container.initialObjects.liveCanvas as LiveCanvas;

        if (!this.canvas.current) throw new Error("Canvas host not found");
        const inkingManager = new InkingManager(this.canvas.current);
        
        // Begin synchronization for LiveCanvas
        await liveCanvas.initialize(inkingManager);
        
        inkingManager.activate();
        this.setState({ inkingManager });
    }
    
    render(): React.ReactNode {
        const { inkingManager } = this.state;

        return (
            <div>
                <div id="canvas-host" ref={this.canvas}
                    style={{width: "100vw", height: "90vh", border: "1px solid black", backgroundColor: "white"}}
                ></div>
                {inkingManager && <DrawingManager inkingManager={inkingManager}/>}
            </div>
        );
    }
}

export default SharedCanvas;
