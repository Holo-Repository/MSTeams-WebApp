import { Toolbar, ToolbarRadioGroup } from "@fluentui/react-components";
import React from "react";
import DrawingManager from "../DrawingManager";
import MyToolbarButton from "./MyToolBarButton";
import {LocationArrow28Filled, Pen24Filled} from "@fluentui/react-icons"
import { InkingManager } from "@microsoft/live-share-canvas";

export interface MyToolbarProps {
    children?: React.ReactNode,
    ink: InkingManager | undefined
}

class MyToolBar extends React.Component<MyToolbarProps>{
    state={
        selectedTool: "Select",
    }

    setSelectedTool = (event: any) => {
        this.setState({selectedTool: event.currentTarget.value})
    }

    getSelectedTool() {
        return this.state.selectedTool;
    }

    render(): React.ReactNode {
        const {ink} = this.props;

        return(
            <div>
                <Toolbar id="tool-bar" aria-label="with-Tools"
                    defaultCheckedValues={{
                        tools: ["Select"],
                    }}
                >
                    <ToolbarRadioGroup>
                        <MyToolbarButton 
                            value="Select"
                            name="tools"
                            icon={<LocationArrow28Filled />}
                            onClick={this.setSelectedTool}
                        >   
                        </MyToolbarButton>
                        <MyToolbarButton 
                            value="Annotation"
                            name="tools"
                            icon={<Pen24Filled />}
                            onClick={this.setSelectedTool}
                        >
                        </MyToolbarButton>
                    </ToolbarRadioGroup>
                </Toolbar>
                <div id="tool-first-level">
                    {ink && this.getSelectedTool() === "Annotation" && <DrawingManager inkingManager={ink}/>}
                </div>
            </div>
        );
    }
}

export default MyToolBar