import React from "react";
import { InkingTool, fromCssColor } from "@microsoft/live-share-canvas";

import Tool, { ToolProps } from "./Tool";
import ColorPicker from "./ColorPicker";
import SizePicker from "./SizePicker";

/**
 * The highlighter component.
 * This component shows a interfaces that allows the user to pick
 * the color and size of the highlighter.
 * 
 * It extends the Tool component, which handles the tool selection logic.
 */
class Highlighter extends Tool {
    static defaultProps = {
        icon: "🖍️",
        tool: InkingTool.highlighter
    }

    state = {
        color: "#FFFF00",
        size: 10
    }

    constructor(props: ToolProps) {
        super(props);
        this.setColor = this.setColor.bind(this);
        this.setSize = this.setSize.bind(this);
        this.setColor(this.state.color);
        this.setSize(this.state.size);
    }

    /**
     * Sets the color of the highlighter in the DrawingManager component.
     * 
     * @param color The color of the highlighter.
     */
    setColor(color: string) {
        this.state.color = color;
        this.props.ext(inkingManager => {
            inkingManager.highlighterBrush.color = fromCssColor(color);
        });
    }

    /**
     * Sets the size of the highlighter in the DrawingManager component.
     * 
     * @param size The size of the highlighter.
     */
    setSize(size: number) {
        this.state.size = size;
        this.props.ext(inkingManager => {
            inkingManager.highlighterBrush.tipSize = size;
        });
    }

    render(): React.ReactNode {
        const isDoubleClick = this.props.isDoubleClicked(this.props.tool);

        return (
            <Tool {...this.props}>
                <div className="popover">
                    {isDoubleClick && <ColorPicker defaultColor={this.state.color} setColor={this.setColor} />}
                    {isDoubleClick && <SizePicker defaultSize={this.state.size} setSize={this.setSize} />}
                </div>
            </Tool>  
        );
    }
}

export default Highlighter;