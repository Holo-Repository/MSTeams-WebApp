import React from "react";
import { InkingTool } from "@microsoft/live-share-canvas";

import Tool, { ToolProps } from "./Tool";

interface EraserProps extends ToolProps {
}

class Eraser extends Tool<EraserProps> {
    static defaultProps = {
        icon: "🧽",
        tool: InkingTool.eraser
    }
}

export default Eraser;