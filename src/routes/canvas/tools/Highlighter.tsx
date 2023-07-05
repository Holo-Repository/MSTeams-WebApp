import React from "react";
import { InkingTool, fromCssColor } from "@microsoft/live-share-canvas";

import Tool, { ToolProps } from "./Tool";
import ColorPicker from "./ColorPicker";

interface HighlighterProps extends ToolProps {
}

class Highlighter extends Tool<HighlighterProps> {
    static defaultProps = {
        icon: "🖍️",
        tool: InkingTool.highlighter
    }

    constructor(props: HighlighterProps) {
        super(props);
        this.setColor = this.setColor.bind(this);
    }

    setColor(color: string) {
        this.props.ext(inkingManager => {
            inkingManager.highlighterBrush.color = fromCssColor(color);
        });
    }

    render(): React.ReactNode {
        const isSelected = this.props.activeTool === this.props.tool;
        const isDoubleClick = this.props.isDoubleClick && isSelected;

        return (
            <div>
                <button 
                style={{ backgroundColor: isSelected ? "lightgray" : "white" }}
                onClick={() => this.props.selectTool(this.props.tool)}
                >{this.props.icon}
                </button>
                {!isDoubleClick ? <></> : <ColorPicker setColor={this.setColor} />}
            </div>
        );
    }
}

export default Highlighter;