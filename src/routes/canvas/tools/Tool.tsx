import React from "react";
import { InkingTool } from "@microsoft/live-share-canvas";

type ToolProps = {
    icon: string,
    isSelected: boolean,
    selectTool: () => void
}

class Tool extends React.Component<ToolProps> {
    render(): React.ReactNode {
        return <button 
            style={{ backgroundColor: this.props.isSelected ? "lightgray" : "white" }}
            onClick={() => this.props.selectTool()}
            >{this.props.icon}
            </button>;
    }
}

export default Tool;