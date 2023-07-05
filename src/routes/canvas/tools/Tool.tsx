import React from "react";
import { InkingTool, InkingManager } from "@microsoft/live-share-canvas";
import { Button } from "@fluentui/react-components";

/**
 * Properties for the tool component.
 */
export interface ToolProps {
    children?: React.ReactNode, // Used to render any additional children required by the tool. IE ColorPicker and SizePicker
    icon: string, // The icon to display for the tool.
    tool: InkingTool, // The tool to select when the tool is clicked.
    activeTool: InkingTool, // The currently selected tool.
    isDoubleClick: boolean, // Whether or not a tool was double clicked. When handling double clicks make sure to check that the active tool is the tool you want to handle.
    selectTool: (tool: InkingTool) => void, // The function to call when the tool is clicked. Triggers an update in the DrawingManager component.
    ext: (callback: (inkingManager: InkingManager) => void) => void // A generic function that simply calls the callback with the inkingManager from the DrawingManager component. Always triggers a rerender by setting the double click state to false.
}

/**
 * Base component for all tools.
 * This component draws a button showing the tool's icon
 * and handles the tool selection logic.
 * 
 * It is recommended to extend this component when creating a new tool.
 */
class Tool extends React.Component<ToolProps> {
    render(): React.ReactNode {
        const isSelected = this.props.activeTool === this.props.tool;

        return (
            <div>
                <Button
                    appearance={isSelected ? "primary" : undefined}
                    onClick={() => this.props.selectTool(this.props.tool)}
                    >{this.props.icon}
                </Button>
                {this.props.children}
            </div>
        );
    }
}

export default Tool;