import React from 'react';
import { InkingManager, InkingTool } from "@microsoft/live-share-canvas";

import Pen from "./tools/Pen";
import Eraser from './tools/Eraser';
import Highlighter from './tools/Highlighter';
import LaserPointer from './tools/LaserPointer';


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

    isSelected(tool: InkingTool) {
        return (this.state.selectedTool === tool)
            // Ugly hack to make sure that the standard eraser and the point eraser are considered the same tool
            || (tool === InkingTool.eraser && this.state.selectedTool === InkingTool.pointEraser)
            || (tool === InkingTool.pointEraser && this.state.selectedTool === InkingTool.eraser);
    }

    isDoubleClicked(tool: InkingTool) {
        return this.state.doubleClicked && this.isSelected(tool);
    }

    setTool(tool: InkingTool) {
        this.props.inkingManager.tool = tool;
        
        let doubleClicked = this.isSelected(tool) ? !this.state.doubleClicked : false;

        this.setState({ 
            selectedTool: tool, 
            doubleClicked: doubleClicked,
        });
    }

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
                <Pen {...toolProps} />
                <Highlighter {...toolProps} />
                <Eraser {...toolProps} />
                <LaserPointer {...toolProps} />
            </div>
        );
    }
}

export default DrawingManager;