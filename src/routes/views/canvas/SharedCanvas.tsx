import React from "react";
// import html2canvas from "html2canvas";
import { InkingManager, LiveCanvas } from "@microsoft/live-share-canvas";
import { IFluidHandle } from "@fluidframework/core-interfaces";
import { FluentProvider, teamsLightTheme } from "@fluentui/react-components";

import MyToolBar from "./toolbar/MyToolBar";
import ContainerManager from "../../containers/ContainerManager";
import '../../../styles/SharedCanvas.css'; 
import { IFluidContainer, SharedMap } from "fluid-framework";
import Floater from "../floaters/Floater";



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
    container = undefined as IFluidContainer | undefined

    /**
     * Initializes the Fluid container and the inking manager once the component is mounted.
     */
    async componentDidMount() {
        // Connect to the active Fluid container
        this.container = (await this.props.containerManager.getContainer(this.props.container)).container;
        const liveCanvas = this.container.initialObjects.liveCanvas as LiveCanvas;
        
        if (!this.canvas.current) throw new Error("Canvas host not found");
        const inkingManager = new InkingManager(this.canvas.current);
        
        // Begin synchronization for LiveCanvas
        await liveCanvas.initialize(inkingManager);
        inkingManager.referencePoint = 'center';
        
        this.floaters = this.container.initialObjects.floaters as SharedMap;
        // this.floaters.clear();
        const floaterHandles: { [key: string]: IFluidHandle } = {};
        for (const [key, value] of this.floaters.entries()) 
            if (value?.get) floaterHandles[key] = value;
        this.floaters.on("valueChanged", this.handleFloaterChange);

        this.isPointerSelected(true);
        
        this.setState({
            inkingManager,
            floaterHandles,
        });
    }

    async componentWillUnmount() {
        // TODO: Save the Base64 image into Azure blob?
        // if (this.canvas.current) {
        //     const canvasSnapshot = await html2canvas(this.canvas.current); 
        //     const imgData = canvasSnapshot.toDataURL();
        // }
        
        // const containerMap= {time: new Date().toISOString()};
        // await this.props.containerManager.updateContainerProperty(this.props.container, containerMap);
    }

    handleFloaterChange = (changed: any) => {
        const newValue = this.floaters!.get(changed.key);
        if (newValue)
            this.setState({
                floaterHandles: {
                    ...this.state.floaterHandles,
                    [changed.key]: newValue
                },
            });
        else
            this.setState({
                floaterHandles: Object.fromEntries(
                    Object.entries(this.state.floaterHandles).filter(([key, value]) => key !== changed.key)
                ),
            });
    }

    deleteFloater = (key: string) => {
        this.floaters!.delete(key);
    }

    setVisibleTool = (event: any) => {
        this.setState({myVisibleTool: event.currentTarget.value})
    }

    getVisibleTool() {
        return this.state.myVisibleTool;
    }

    isPointerSelected = (selected: boolean) => {
        if (this.canvas.current) this.canvas.current.style.pointerEvents = selected ? 'none' : 'auto';
    }

    render(): React.ReactNode {
        const { 
            inkingManager,
            floaterHandles,
        } = this.state;

        return (
            <FluentProvider id='canvas-background' theme={teamsLightTheme}>
                <div id="canvas-host" ref={this.canvas} onClick={this.setVisibleTool} />
                {this.container && <MyToolBar ink={inkingManager} container={this.container} pointerSelected={this.isPointerSelected}/>}
                <div id='floaters' >
                    {inkingManager && Object.entries(floaterHandles).map(([key, value]) => 
                        <Floater 
                            key={key} 
                            handle={value} delete={() => {this.deleteFloater(key)}}
                            inkingManager={inkingManager}
                        />
                    )}
                </div>
            </FluentProvider>
        );
    }
}

export default SharedCanvas;
