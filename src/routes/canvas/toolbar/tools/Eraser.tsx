import React from "react";
import { InkingTool } from "@microsoft/live-share-canvas";
import { Button, ToggleButton, Toolbar, ToolbarRadioButton, ToolbarRadioGroup } from "@fluentui/react-components";
import { Eraser20Regular, EraserSegment20Regular} from "@fluentui/react-icons"

import Tool, { ToolProps } from "./Tool";
import SizePicker from "./SizePicker";

/**
 * Properties for the standard eraser component.
 */
const eraserProps = {
    icon:<Eraser20Regular />,
    tool: InkingTool.eraser
}

/**
 * Properties for the point eraser component.
 * The point eraser is a special eraser that only erases the ink
 * at the point where the user clicks.
 */
const pointEraserProps = {
    icon: <EraserSegment20Regular />,
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
        size: 5,
        isPointEraser: false
    }

    constructor(props: ToolProps) {
        super(props);
        this.setSize = this.setSize.bind(this);
        this.setEraser = this.setEraser.bind(this);

        this.props.ext(inkingManager => {
            inkingManager.eraserSize = this.state.size;
        });
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
            <Tool {...this.props} icon={<img src={require("../../../../assets/eraser.png")} alt="Icon" />} tool={eraser.tool}>
                <div className="popover">
                    {/* Draw the button to select the other eraser */}
                    {isDoubleClick &&
                        <div id="eraser-picker" className="tool-third-level">
                            <Button onClick={() => this.setEraser(false)}
                                style={{
                                    border: !this.state.isPointEraser ? '1px solid #444791' : '1px solid grey',
                                    backgroundColor: !this.state.isPointEraser ? 'rgba(89, 95, 186, 0.9)' : 'rgba(36, 36, 36, 0.9)'}
                                }
                            >
                                {eraserProps.icon}
                            </Button>
                            <Button onClick={() => this.setEraser(true)}
                                style={{
                                    border: this.state.isPointEraser ? '1px solid #444791' : '1px solid grey',
                                    backgroundColor: this.state.isPointEraser ? 'rgba(89, 95, 186, 0.9)' : 'rgba(36, 36, 36, 0.9)'}
                                }
                            >
                                {pointEraserProps.icon}
                            </Button>
                        </div>
                    }
                    {isDoubleClick && <SizePicker defaultSize={this.state.size} setSize={this.setSize} />}
                </div>
            </Tool>
        );
    }
}

export default Eraser;