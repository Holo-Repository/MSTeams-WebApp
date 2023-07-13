import React from "react";
import { InkingTool, fromCssColor } from "@microsoft/live-share-canvas";

import Tool, { ToolProps } from "./Tool";
import ColorPicker from "./ColorPicker";
import SizePicker from "./SizePicker";

/**
 * The pen component.
 * This component shows a interfaces that allows the user to pick
 * the color and size of the pen.
 * 
 * It extends the Tool component, which handles the tool selection logic.
 */
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

    /**
     * Sets the color of the pen in the DrawingManager component.
     * 
     * @param color The color of the pen.
     */
    setColor(color: string) {
        this.props.ext(inkingManager => {
            inkingManager.penBrush.color = fromCssColor(color);
        });
    }

    /**
     * Sets the size of the pen in the DrawingManager component.
     * 
     * @param size The size of the pen.
     */
    setSize(size: number) {
        this.props.ext(inkingManager => {
            inkingManager.penBrush.tipSize = size;
        });
    }

    render(): React.ReactNode {
        const isDoubleClick = this.props.isDoubleClicked(this.props.tool);

        return (
            <Tool {...this.props}>
                {isDoubleClick && <ColorPicker setColor={this.setColor} />}
                {isDoubleClick && <SizePicker setSize={this.setSize} />}
            </Tool>
        );
    }
}

export default Pen;