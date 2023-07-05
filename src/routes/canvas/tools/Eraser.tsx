import React from "react";
import { InkingTool } from "@microsoft/live-share-canvas";

import Tool, { ToolProps } from "./Tool";
import SizePicker from "./SizePicker";


class Eraser extends Tool {
    static defaultProps = {
        icon: "🧽",
        tool: InkingTool.eraser
    }

    constructor(props: ToolProps) {
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
            <Tool {...this.props}>
                {!isDoubleClick ? <></> : <SizePicker setSize={this.setSize} />}
            </Tool>
        );
    }
}

export default Eraser;