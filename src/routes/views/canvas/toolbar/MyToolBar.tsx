import React from "react";
import { Toolbar, ToolbarRadioGroup } from "@fluentui/react-components";
import { LocationArrow28Filled, Pen24Filled } from "@fluentui/react-icons";
import { InkingManager } from "@microsoft/live-share-canvas";
import { BsBadge3DFill as ModelIcon } from "react-icons/bs";
import { DocumentAdd24Regular } from "@fluentui/react-icons";
import { IFluidContainer } from "fluid-framework";

import DrawingManager from "./DrawingManager";
import MyToolbarButton from "./MyToolBarButton";
import FileSharing from "../../fileSharing/FileSharing";
import ViewerLoader from "../../unity/ViewerLoader";



/**
 * Interface defining the properties for MyToolbar component
 * 
 * @property children: Optional React.ReactNode which represent the children elements of MyToolbar
 * @property ink: Optional instance of InkingManager from "@microsoft/live-share-canvas" package
 */
export interface MyToolbarProps {
    children?: React.ReactNode,
    ink: InkingManager | undefined,
    container: IFluidContainer,
    pointerSelected: (isSelected: boolean) => void,
}

/**
 * @class MyToolBar is a component that renders a toolbar with selectable tools.
 * Tools can be selected and the selection can have different effects.
 * 
 * - When a tool is selected, the corresponding content of the tool will be displayed.
 * - When a tool is not selected, the corresponding content will be hidden.
 */
class MyToolBar extends React.Component<MyToolbarProps>{
    // Define the state with selectedTool variable which stores the current selected tool
    // and the isDisplayed variable, which determines whether the content of the tool is displayed.
    state={
        selectedTool: "Select",
        isDisplayed: true,
    }

    /**
     * Function that sets the state's selectedTool value based on the event received, and
     * set the display status based on the current state. It also activates or deactivates
     *  the InkingManager depending on the selected tool.
     * @param event The click event which can be used to retrive the value of the current target
     */
    setSelectedTool = (event: any) => {
        const tool = event.currentTarget.value;

        this.props.pointerSelected(tool === "Select");
        
        // If the current tool is already selected, toggle its display status
        if (this.state.selectedTool === tool) {
            const isDisplayed = this.state.isDisplayed;
            this.setState({ isDisplayed: !isDisplayed })
        } else {
            // If a different tool is selected, update the selected tool and set isDisplayed to true.
            this.setState({selectedTool: tool, isDisplayed: true});
            
            // If there's an InkingManager instance provided via props, activate or deactivate 
            // the InkingManager based on whether the selected tool is "Annotation".
            if (this.props.ink) {
                if (tool === "Annotation") {
                    this.props.ink.activate();
                } else {
                    this.props.ink.deactivate();
                }
            }
        }    
    }

    /**
     * Function to get the current selected tool
     */
    getSelectedTool() {
        return this.state.selectedTool;
    }


    render(): React.ReactNode {
        const {ink} = this.props;
        
        return(
            <div>
                <Toolbar id="tool-first-level" aria-label="with-Tools"
                    defaultCheckedValues={{
                        tools: ["Select"]
                    }}
                >
                    <ToolbarRadioGroup>
                        <MyToolbarButton 
                            value="Select"
                            name="tools"
                            icon={<LocationArrow28Filled />}
                            onClick={this.setSelectedTool}
                        />

                        <MyToolbarButton 
                            value="Annotation"
                            name="tools"
                            icon={<Pen24Filled />}
                            onClick={this.setSelectedTool}
                        >
                            {this.getSelectedTool() === "Annotation" && this.state.isDisplayed && ink && 
                                <DrawingManager inkingManager={ink} display={this.getSelectedTool() === "Annotation" && this.state.isDisplayed ? 'block' : 'none'} />
                            }
                        </MyToolbarButton>

                        <MyToolbarButton 
                            value="ShareDocuments"
                            name="tools"
                            icon={<DocumentAdd24Regular/>}
                            onClick={this.setSelectedTool}
                        >
                            {<div 
                                className="tool-second-level"
                                style={{display : this.getSelectedTool() === "ShareDocuments" && this.state.isDisplayed ? 'block' : 'none'}}
                            > 
                                
                                <FileSharing />
                            </div>
                            }
                        </MyToolbarButton>

                        <MyToolbarButton
                            value="Model"
                            name="tools"
                            icon={<ModelIcon />}
                            onClick={this.setSelectedTool}
                        >
                            {this.getSelectedTool() === "Model" && this.state.isDisplayed && <div className="tool-second-level" >
                                <ViewerLoader container={this.props.container} />
                            </div>
                            }
                        </MyToolbarButton>
                        
                    </ToolbarRadioGroup>
                </Toolbar>
                
            </div>
        );
    }
}

export default MyToolBar;