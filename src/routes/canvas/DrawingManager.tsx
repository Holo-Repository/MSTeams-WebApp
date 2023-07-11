import React from 'react';
import { InkingManager, InkingTool } from "@microsoft/live-share-canvas";

import {Toolbar} from "@fluentui/react-components";

import { Button } from '@fluentui/react-components';
import Pen from "./tools/Pen";
import Eraser from './tools/Eraser';
import Highlighter from './tools/Highlighter';
import LaserPointer from './tools/LaserPointer';

/**
 * The drawing manager component.
 * This component shows a toolbar with the different tools that can be used to draw on the canvas.
 * 
 * It also handles the tool selection logic:
 * - When a tool is selected, the selection is recorded in the state of the component and the inking manager is updated.
 * - When a tool already selected is clicked again, the double click is recorded in the state of the component and passed to the tool.
 * 
 * @param inkingManager The inking manager that is used to draw on the canvas.
 */
class DrawingManager extends React.Component<{inkingManager: InkingManager}> {
    state = {
        selectedTool: InkingTool.pen,
        doubleClicked: false,
    }

    constructor(props: {inkingManager: InkingManager}) {
        super(props);
        this.isSelected = this.isSelected.bind(this);
        this.isDoubleClicked = this.isDoubleClicked.bind(this);
        this.setTool = this.setTool.bind(this);
        this.ext = this.ext.bind(this);
    }

    /**
     * Checks if the given tool is the currently selected tool.
     * 
     * @param tool The tool to check.
     * @returns true if the tool is selected and false otherwise.
     */
    isSelected(tool: InkingTool) {
        return (this.state.selectedTool === tool)
            // Ugly hack to make sure that the standard eraser and the point eraser are considered the same tool
            || (tool === InkingTool.eraser && this.state.selectedTool === InkingTool.pointEraser)
            || (tool === InkingTool.pointEraser && this.state.selectedTool === InkingTool.eraser);
    }

    /**
     * Checks if the given tool is the currently selected tool and the user has double clicked on it.
     * 
     * @param tool The tool to check.
     * @returns true if the tool is selected and the user has double clicked on it, and false otherwise.
     */
    isDoubleClicked(tool: InkingTool) {
        return this.state.doubleClicked && this.isSelected(tool);
    }

    /**
     * Sets the given tool as the currently selected tool.
     * If the tool is already selected, the double click is recorded in the state of the component.
     * 
     * This method also updates the inking manager with the new tool and triggers a re-render.
     * 
     * @param tool The tool to select.
     */
    setTool(tool: InkingTool) {
        this.props.inkingManager.tool = tool;
        
        let doubleClicked = this.isSelected(tool) ? !this.state.doubleClicked : false;

        this.setState({ 
            selectedTool: tool, 
            doubleClicked: doubleClicked,
        });
    }

    /**
     * A generic function that simply calls the callback with the inkingManager from the DrawingManager component.
     * Always triggers a rerender by setting the double click state to false.
     * 
     * Useful for tools that need to access the inking manager as part of extended functionality.
     * For example, the eraser tool needs to access the inking manager to change the eraser size.
     * Or the pen tool needs to access the inking manager to change the pen color.
     * 
     * Instead of implementing specific functions for each tool, the tool itself can directly access the inking manager and implement the functionality.
     */
    ext(callback: (inkingManager: InkingManager) => void = () => {}) {
        callback(this.props.inkingManager);
        this.setState({ doubleClicked: false });
    }



    render(): React.ReactNode {
        const { selectedTool, doubleClicked } = this.state;
        let toolProps = {
            isSelected: this.isSelected,
            isDoubleClicked: this.isDoubleClicked,
            selectTool: this.setTool,
            ext: this.ext,
        }
        return (
            <div>
                
                <Toolbar aria-label="Vertical Button" {...toolProps}>
                    <Pen {...toolProps} />
                    <Highlighter {...toolProps} />
                    <Eraser {...toolProps} />
                    <LaserPointer {...toolProps} />
                </Toolbar>
            </div>
        );
    }
}

export default DrawingManager;