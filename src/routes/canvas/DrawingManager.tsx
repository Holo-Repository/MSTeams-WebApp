import React from 'react';
import { InkingManager, InkingTool } from "@microsoft/live-share-canvas";

import Tool from "./tools/Tool";


const tools: { [key: string]: InkingTool } = {
    "✒️": InkingTool.pen,
    "🖍️": InkingTool.highlighter,
    "🔴": InkingTool.laserPointer,
    "🧽": InkingTool.eraser,
};

class DrawingManager extends React.Component<{inkingManager?: InkingManager}> {
    state = {
        selectedTool: InkingTool.pen
    }

    setTool(tool: InkingTool) {
        this.props.inkingManager!.tool = tool;
        this.setState({ selectedTool: tool });
    }

    render(): React.ReactNode {
        const { selectedTool } = this.state;

        return (
            <div>
                {Object.keys(tools).map((tool: string) =>
                    <Tool
                        key={tool}
                        icon={tool}
                        isSelected={selectedTool === tools[tool]}
                        selectTool={() => this.setTool(tools[tool])}
                    />
                )}
            </div>
        );
    }
}

export default DrawingManager;