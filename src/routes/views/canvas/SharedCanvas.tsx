import React from "react";
import { InkingManager, LiveCanvas } from "@microsoft/live-share-canvas";
import { IFluidHandle } from "@fluidframework/core-interfaces";

import MyToolBar from "./toolbar/MyToolBar";
import ContainerManager from "../../containers/ContainerManager";
import '../../../styles/SharedCanvas.css'; 
import { SharedMap } from "fluid-framework";
import Floater from "../utils/Floater";



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
        inkingManager: undefined as InkingManager | undefined,
        myVisibleTool: undefined as string | undefined,
        floaterHandles: {} as { [key: string]: IFluidHandle },
    }

    canvas = React.createRef<HTMLDivElement>();
    floaters = undefined as SharedMap | undefined;

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
        
        this.floaters = container.initialObjects.floaters as SharedMap;
        const floaterHandles: { [key: string]: IFluidHandle } = {};
        for (const [key, value] of this.floaters.entries()) 
            if (value.get) floaterHandles[key] = value;
        this.floaters.on("valueChanged", this.handleFloaterChange);
        
        this.setState({
            inkingManager,
            floaterHandles,
        });
    }

    handleFloaterChange = (changed: any) => {
        this.setState({
            floaterHandles: {
                ...this.state.floaterHandles,
                [changed.key]: this.floaters!.get(changed.key),
            },
        });
    }

    setVisibleTool = (event: any) => {
        this.setState({myVisibleTool: event.currentTarget.value})
    }

    getVisibleTool() {
        return this.state.myVisibleTool;
    }
    
    render(): React.ReactNode {
        const { 
            inkingManager,
            floaterHandles
        } = this.state;

        return (
            <div>   
                <div id="canvas-host" ref={this.canvas} onClick={this.setVisibleTool}></div>
                <MyToolBar ink={inkingManager} containerManager={this.props.containerManager} containerId={this.props.container} />
                <div id='floaters' >
                    {Object.entries(floaterHandles).map(([key, value]) => <Floater key={key} handle={value} />)}
                </div>
            </div>
        );
    }
}

export default SharedCanvas;
