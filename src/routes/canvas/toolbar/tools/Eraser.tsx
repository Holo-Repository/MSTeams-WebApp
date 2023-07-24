import React from "react";
import { InkingTool } from "@microsoft/live-share-canvas";
import { Button } from "@fluentui/react-components";
import { Eraser24Regular, EraserSegment24Regular} from "@fluentui/react-icons"

import Tool, { ToolProps } from "./Tool";
import SizeSelector from "./SizeSelector";
import EraserButton from "./EraserButton";

/**
 * Path of the image of icon
 */
const imgPath = require("../../../../assets/eraser.png");

/**
 * Properties for the standard eraser component.
 */
const eraserProps = {
    icon:<Eraser24Regular style={{color:'black', height: '22px'}}/>,
    tool: InkingTool.eraser
}

/**
 * Properties for the point eraser component.
 * The point eraser is a special eraser that only erases the ink
 * at the point where the user clicks.
 */
const pointEraserProps = {
    icon: <EraserSegment24Regular style={{color:'black', height: '22px'}}/>,
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
        size: 10,
        isPointEraser: false
    }

    constructor(props: ToolProps) {
        super(props);
        this.setSize = this.setSize.bind(this);
        this.setEraser = this.setEraser.bind(this);
        this.setSize(this.state.size);
    }

    /**
     * Sets the size of the eraser in the DrawingManager component.
     * 
     * @param size The size of the eraser.
     */
    setSize(size: number) {
        this.state.size = size;
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
            <Tool {...this.props} icon={<img src={imgPath} alt="Icon" />} tool={eraser.tool}>
                <div className="tool-third-level">
                    {/* Draw the button to select the other eraser */}
                    {isDoubleClick &&
                        <div>
                            <EraserButton isPointEraser={false} active={!this.state.isPointEraser} setEraser={this.setEraser} icon={eraserProps.icon}/>
                            <EraserButton isPointEraser={true} active={this.state.isPointEraser} setEraser={this.setEraser} icon={pointEraserProps.icon} />
                        </div>
                    }
                    {isDoubleClick && <SizeSelector defaultSize = {this.state.size} setSize={this.setSize} />}
                </div>
            </Tool>
        );
    }
}

export default Eraser;