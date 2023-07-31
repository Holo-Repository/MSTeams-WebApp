import React from "react";
// import html2canvas from "html2canvas";
import { InkingManager, LiveCanvas } from "@microsoft/live-share-canvas";
import './SharedCanvas.css'; 
import MyToolBar from "./toolbar/MyToolBar";

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
        myVisibleTool: undefined,
    }

    canvas = React.createRef<HTMLDivElement>();

    /**
     * Initializes the Fluid container and the inking manager once the component is mounted.
     */
    async componentDidMount() {
        // Connect to the active Fluid container
        const { container } = await this.props.containerManager.getContainer(this.props.container);
        const liveCanvas = container.initialObjects.liveCanvas as LiveCanvas;

        if (!this.canvas.current) throw new Error("Canvas host not found");
        const inkingManager = new InkingManager(this.canvas.current);
        
        // Begin synchronization for LiveCanvas
        await liveCanvas.initialize(inkingManager);
        
        this.setState({
            inkingManager
        });
    }

    async componentWillUnmount(){
        // TODO: Save the Base64 image into Azure blob?
        // if (this.canvas.current) {
        //     const canvasSnapshot = await html2canvas(this.canvas.current); 
        //     const imgData = canvasSnapshot.toDataURL();
        // }
        const containerMap= {time: new Date().toISOString()};
        await this.props.containerManager.updateContainerProperty(this.props.container, containerMap);
    }

    setVisibleTool = (event: any) => {
        this.setState({myVisibleTool: event.currentTarget.value})
    }

    getVisibleTool() {
        return this.state.myVisibleTool;
    }
    
    render(): React.ReactNode {
        const { inkingManager } = this.state;

        return (
            <div> 
                <div id="canvas-host" ref={this.canvas} onClick={this.setVisibleTool}></div>
                <MyToolBar ink={inkingManager}></MyToolBar>
            </div>
        );
    }
}

export default SharedCanvas;
