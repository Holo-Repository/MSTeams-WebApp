import React from 'react';
import { IPointerMoveEvent, IPointerMovedEventArgs, InkingManager, InkingTool } from "@microsoft/live-share-canvas";
import {Toolbar} from "@fluentui/react-components";

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
class DrawingManager extends React.Component<{inkingManager: InkingManager, display: string}> {
    state = {
        selectedTool: InkingTool.pen,
        doubleClicked: false,
    }

    // Create a ref for the top-level div of the component
    drawingManagerRef = React.createRef<HTMLDivElement>();

    constructor(props: {inkingManager: InkingManager, display: string}) {
        super(props);
        this.isSelected = this.isSelected.bind(this);
        this.isDoubleClicked = this.isDoubleClicked.bind(this);
        this.setTool = this.setTool.bind(this);
        this.ext = this.ext.bind(this);
        this.handleBeginInking = this.handleBeginInking.bind(this);
    }

    /**
     * This method gets invoked right after a React component has been mounted.
     * Within this method, event listeners 'AddPoints' and 'StrokesRemoved' are being registered on the InkingManager.
     * When user is drawing or erasing on the canvas, @function handleBeginInking will be called
     */
    componentDidMount() {
        this.props.inkingManager.addListener('AddPoints', this.handleBeginInking)
        this.props.inkingManager.addListener('StrokesRemoved', this.handleBeginInking)
    }

    /**
     * This method gets invoked immediately prior to unmounting and destruction of a React component.
     * Within this method, the event listeners are being deregistered.
     * This is crucial to prevent potential memory leaks that might be caused by these unused event listeners.
     */
    componentWillUnmount() {
        this.props.inkingManager.removeListener('AddPoints', this.handleBeginInking);
        this.props.inkingManager.removeListener('StrokesRemoved', this.handleBeginInking);
    }

    /**
     * This method gets invoked immediately subsequent to the updating of a React component.
     * Within this function, it checks if the prop 'display' has undergone a change and whether
     * its new value is 'none'. If these conditions are satisfied, it updates the state
     * 'doubleClicked' to be false.
     * @param prevProps - Previous props before the component got updated.
     */
    componentDidUpdate(prevProps: {display: string}): void {
        if(prevProps.display !== this.props.display && this.props.display === 'none') {
            this.setState({doubleClicked: false});
        }

    }

    /**
     * This method will be called when the user begins adding strokes on the canvas
     */
    handleBeginInking() {
        this.setState({ doubleClicked: false });
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
        // this.setState({ doubleClicked: false });
    }



    render(): React.ReactNode {
        let toolProps = {
            isSelected: this.isSelected,
            isDoubleClicked: this.isDoubleClicked,
            selectTool: this.setTool,
            ext: this.ext,
        }

        return (
            <div className='tool-second-level' style={{display: this.props.display}}>
                <Toolbar className='popover'>
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