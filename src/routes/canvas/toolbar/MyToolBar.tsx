import { Button, Popover, PopoverSurface, PopoverTrigger, Toolbar, ToolbarRadioGroup } from "@fluentui/react-components";
import React from "react";
import DrawingManager from "./DrawingManager";
import MyToolbarButton from "./MyToolBarButton";
import {LocationArrow28Filled, Pen24Filled, NoteEdit24Filled} from "@fluentui/react-icons";
import { InkingManager } from "@microsoft/live-share-canvas";

/**
 * Interface defining the properties for MyToolbar component
 * 
 * @property children: Optional React.ReactNode which represent the children elements of MyToolbar
 * @property ink: Optional instance of InkingManager from "@microsoft/live-share-canvas" package
 */
export interface MyToolbarProps {
    children?: React.ReactNode,
    ink: InkingManager | undefined
}

/**
 * @class MyToolBar is a component that renders a toolbar with selectable tools.
 * Tools can be selected and the selection can have different effects.
 * 
 * - When a tool is selected, the corresponding content of the tool will be displayed.
 * - When a tool is not selected, the corresponding content will be hidden.
 */
class MyToolBar extends React.Component<MyToolbarProps>{
    // Define the state with selectedTool variable which stores the current
    state={
        selectedTool: "Select",
    }

    /**
     * Function that sets the state's selectedTool value based on the event received
     * It also activates or deactivates the InkingManager depending on the selected tool
     * @param event The click event which can be used to retrive the value of the current target
     */
    setSelectedTool = (event: any) => {
        const tool = event.currentTarget.value;
        this.setState({selectedTool: tool});
    
        if (this.props.ink) {
            if (tool === "Annotation") {
                this.props.ink.activate();
            } else {
                this.props.ink.deactivate();
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
                            {ink && this.getSelectedTool() === "Annotation" 
                            && <DrawingManager inkingManager={ink}/>}
                        </MyToolbarButton>

                        <MyToolbarButton 
                            value="Notes"
                            name="tools"
                            icon={<NoteEdit24Filled />}
                            onClick={this.setSelectedTool}
                        >
                            {this.getSelectedTool() === "Notes" 
                            && <div className="tool-second-level">Add new component here</div>}
                        </MyToolbarButton>
                        
                    </ToolbarRadioGroup>
                </Toolbar>
            </div>
        );
    }
}

export default MyToolBar