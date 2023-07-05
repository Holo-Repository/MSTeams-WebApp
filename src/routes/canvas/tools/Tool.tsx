import React from "react";
import { InkingTool, InkingManager } from "@microsoft/live-share-canvas";
import { Button } from "@fluentui/react-components";

export interface ToolProps {
    children?: React.ReactNode,
    icon: string,
    tool: InkingTool,
    activeTool: InkingTool,
    isDoubleClick: boolean,
    selectTool: (tool: InkingTool) => void,
    ext: (callback: (inkingManager: InkingManager) => void) => void
}

class Tool extends React.Component<ToolProps> {
    render(): React.ReactNode {
        const isSelected = this.props.activeTool === this.props.tool;

        return (
            <div>
                <Button
                    style={{ backgroundColor: isSelected ? "lightgray" : "white" }}
                    onClick={() => this.props.selectTool(this.props.tool)}
                    >{this.props.icon}
                </Button>
                {this.props.children}
            </div>
        );
    }
}

export default Tool;