import React from "react";
import { InkingTool } from "@microsoft/live-share-canvas";

import Tool, { ToolProps } from "./Tool";
import SizePicker from "./SizePicker";

/**
 * Properties for the standard eraser component.
 */
const eraserProps = {
    icon: "🧹",
    tool: InkingTool.eraser
}

/**
 * Properties for the point eraser component.
 * The point eraser is a special eraser that only erases the ink
 * at the point where the user clicks.
 */
const pointEraserProps = {
    icon: "🧽",
    tool: InkingTool.pointEraser
}


/**
 * The eraser component.
 * This component shows a button that allows the user to switch between
 * the standard eraser and the point eraser.
 * It also shows a slider that allows the user to change the size of the eraser.
 * 
 * It extends the Tool component, which handles the tool selection logic.
 */
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

    /**
     * Sets the size of the eraser in the DrawingManager component.
     * 
     * @param size The size of the eraser.
     */
    setSize(size: number) {
        this.props.ext(inkingManager => {
            inkingManager.eraserSize = size;
        });
    }

    /**
     * Sets the eraser type in the DrawingManager component.
     * Handles redrawing itself as well as communicating the change to the DrawingManager.
     * 
     * @param isPointEraser True if the point eraser should be selected, false otherwise.
     */
    setEraser(isPointEraser: boolean) {
        this.setState({ isPointEraser });
        this.props.ext(inkingManager => {
            inkingManager.tool = isPointEraser ? InkingTool.pointEraser : InkingTool.eraser;
        });
    }

    render(): React.ReactNode {
        const isDoubleClick = this.props.isDoubleClicked(this.props.tool)
        const eraser = this.state.isPointEraser ? pointEraserProps : eraserProps;

        return (
            <Tool {...this.props} icon={eraser.icon} tool={eraser.tool}>
                {/* Draw the button to select the other eraser */}
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