import React from "react";
import { InkingTool, fromCssColor } from "@microsoft/live-share-canvas";

import Tool, { ToolProps } from "./Tool";
import ColorSelector from "./ColorSelector";
import SizeSelector from "./SizeSelector";

/**
 * Path of the image of icon
 */
const imgPath = require("../../../../../assets/ink-pen.png");

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

    state = {
        color: "#FF0000",
        size: 5,
    }

    constructor(props: ToolProps) {
        super(props);
        this.setColor = this.setColor.bind(this);
        this.setSize = this.setSize.bind(this);
        this.setColor(this.state.color);
        this.setSize(this.state.size);
    }

    /**
     * Sets the color of the pen in the DrawingManager component.
     * 
     * @param color The color of the pen.
     */
    setColor(color: string) {
        this.setState({color: color});
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
        this.setState({size: size})
        this.props.ext(inkingManager => {
            inkingManager.penBrush.tipSize = size;
        });
    }

    render(): React.ReactNode {
        const isDoubleClick = this.props.isDoubleClicked(this.props.tool);

        return (
            <Tool {...this.props} icon={ <img src={imgPath} alt={this.props.icon as string} />}>
                <div className="tool-third-level">
                    {isDoubleClick && <ColorSelector defaultColor = {this.state.color} setColor={this.setColor}></ColorSelector>}
                    {isDoubleClick && <SizeSelector defaultSize = {this.state.size} setSize={this.setSize} />}
                </div>
            </Tool>
        );
    }
}

export default Pen;