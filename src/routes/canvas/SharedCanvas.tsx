import React from "react";
import { LiveShareClient } from "@microsoft/live-share";
import { InkingManager, LiveCanvas } from "@microsoft/live-share-canvas";
import { LiveShareHost } from "@microsoft/teams-js";
import { ContainerSchema } from "fluid-framework";
import { Toolbar, ToolbarRadioGroup} from "@fluentui/react-components";
import {LocationArrow28Filled, Pen24Filled} from "@fluentui/react-icons"

import MyToolbarButton  from "./MyToolBarButton";
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
        myVisibleTool: undefined,
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
        this.setState({
            inkingManager,
            myTool: 'select'
        });
    }

    setVisibleTool = (event: any) => {
        this.setState({myVisibleTool: event.currentTarget.value})
    }

    getVisibleTool() {
        return this.state.myVisibleTool;
    }
    
    render(): React.ReactNode {
        const { inkingManager: ink } = this.state;

        return (
            <div>   
                <div id="canvas-host" onClick={this.setVisibleTool}></div>
                <Toolbar id="tool-bar" aria-label="with-Tools"
                    defaultCheckedValues={{
                        tools: ["Select"],
                    }}
                >
                    <ToolbarRadioGroup>
                        <MyToolbarButton 
                            name="Select"
                            icon={<LocationArrow28Filled />}
                            onClick={this.setVisibleTool}
                        >   
                        </MyToolbarButton>
                        <MyToolbarButton 
                            name="Annotation"
                            icon={<Pen24Filled />}
                            onClick={this.setVisibleTool}
                        >
                        </MyToolbarButton>
                        {ink && this.getVisibleTool() === "Annotation" && <DrawingManager inkingManager={ink}/>}
                    </ToolbarRadioGroup>
                </Toolbar>
            </div>
        );
    }
}

export default SharedCanvas;
