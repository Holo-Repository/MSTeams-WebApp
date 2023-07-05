import React from "react";
import { InkingTool } from "@microsoft/live-share-canvas";

import Tool, { ToolProps } from "./Tool";
import SizePicker from "./SizePicker";

interface EraserProps extends ToolProps {
}

class Eraser extends Tool<EraserProps> {
    static defaultProps = {
        icon: "🧽",
        tool: InkingTool.eraser
    }

    constructor(props: EraserProps) {
        super(props);
        this.setSize = this.setSize.bind(this);
    }

    setSize(size: number) {
        this.props.ext(inkingManager => {
            inkingManager.eraserSize = size;
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
                {!isDoubleClick ? <></> : <SizePicker setSize={this.setSize} />}
            </div>
        );
    }
}

export default Eraser;