import React from "react";
import { InkingTool, InkingManager } from "@microsoft/live-share-canvas";

export interface ToolProps {
    icon: string,
    tool: InkingTool,
    activeTool: InkingTool,
    isDoubleClick: boolean,
    selectTool: (tool: InkingTool) => void,
    ext: (callback: (inkingManager: InkingManager) => void) => void
}

class Tool<T extends ToolProps> extends React.Component<T> {
    render(): React.ReactNode {
        const isSelected = this.props.activeTool === this.props.tool;

        return (
            <div>
                <button 
                    style={{ backgroundColor: isSelected ? "lightgray" : "white" }}
                    onClick={() => this.props.selectTool(this.props.tool)}
                    >{this.props.icon}
                </button>
            </div>
        );
    }
}

export default Tool;