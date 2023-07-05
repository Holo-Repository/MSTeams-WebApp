import React from "react";
import { InkingTool, fromCssColor } from "@microsoft/live-share-canvas";

import Tool, { ToolProps } from "./Tool";
import ColorPicker from "./ColorPicker";
import SizePicker from "./SizePicker";

class Pen extends Tool {
    static defaultProps = {
        icon: "✒️",
        tool: InkingTool.pen
    }

    constructor(props: ToolProps) {
        super(props);
        this.setColor = this.setColor.bind(this);
        this.setSize = this.setSize.bind(this);
    }

    setColor(color: string) {
        this.props.ext(inkingManager => {
            inkingManager.penBrush.color = fromCssColor(color);
        });
    }

    setSize(size: number) {
        this.props.ext(inkingManager => {
            inkingManager.penBrush.tipSize = size;
        });
    }

    render(): React.ReactNode {
        const isSelected = this.props.activeTool === this.props.tool;
        const isDoubleClick = this.props.isDoubleClick && isSelected;

        return (
            <Tool {...this.props}>
                {!isDoubleClick ? <></> : <ColorPicker setColor={this.setColor} />}
                {!isDoubleClick ? <></> : <SizePicker setSize={this.setSize} />}
            </Tool>
        );
    }
}

export default Pen;