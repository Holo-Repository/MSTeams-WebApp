import React from "react";
import { InkingTool } from "@microsoft/live-share-canvas";

import Tool, { ToolProps } from "./Tool";
import SizePicker from "./SizePicker";


const eraserProps = {
    icon: "🧹",
    tool: InkingTool.eraser
}

const pointEraserProps = {
    icon: "🧽",
    tool: InkingTool.pointEraser
}

class Eraser extends Tool {
    static defaultProps = eraserProps;
    state = {
        isPointEraser: false
    }

    constructor(props: ToolProps) {
        super(props);
        this.setSize = this.setSize.bind(this);
        this.setEraser = this.setEraser.bind(this);
    }

    setSize(size: number) {
        this.props.ext(inkingManager => {
            inkingManager.eraserSize = size;
        });
    }

    setEraser(isPointEraser: boolean) {
        this.setState({ isPointEraser });
        this.props.ext(inkingManager => {
            inkingManager.tool = isPointEraser ? InkingTool.pointEraser : InkingTool.eraser;
        });
    }

    render(): React.ReactNode {
        const isSelected = (this.props.activeTool === this.props.tool)
            || (this.props.activeTool === InkingTool.eraser && this.props.tool === InkingTool.pointEraser)
            || (this.props.activeTool === InkingTool.pointEraser && this.props.tool === InkingTool.eraser);
        const isDoubleClick = this.props.isDoubleClick && isSelected;
        const eraser = this.state.isPointEraser ? pointEraserProps : eraserProps;

        return (
            <Tool {...this.props} icon={eraser.icon} tool={eraser.tool}>
                {!isDoubleClick ? <></> : <div>
                    <button onClick={() => this.setEraser(!this.state.isPointEraser)}>
                        {this.state.isPointEraser ? eraserProps.icon : pointEraserProps.icon}
                    </button>
                </div>}
                {!isDoubleClick ? <></> : <SizePicker setSize={this.setSize} />}
            </Tool>
        );
    }
}

export default Eraser;