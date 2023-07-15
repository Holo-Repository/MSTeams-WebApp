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

    constructor(props: ToolProps) {
        super(props);
        this.setColor = this.setColor.bind(this);
        this.setSize = this.setSize.bind(this);
    }

    /**
     * Sets the color of the highlighter in the DrawingManager component.
     * 
     * @param color The color of the highlighter.
     */
    setColor(color: string) {
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
        this.props.ext(inkingManager => {
            inkingManager.highlighterBrush.tipSize = size;
        });
    }

    render(): React.ReactNode {
        const isDoubleClick = this.props.isDoubleClicked(this.props.tool);

        return (
            <Tool {...this.props}>
                <div className="popover">
                    {isDoubleClick && <ColorPicker setColor={this.setColor} />}
                    {isDoubleClick && <SizePicker setSize={this.setSize} />}
                </div>
            </Tool>  
        );
    }
}

export default Highlighter;