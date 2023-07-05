import React from "react";
import { InkingTool } from "@microsoft/live-share-canvas";

import Tool, { ToolProps } from "./Tool";

interface LaserPointerProps extends ToolProps {
}

class LaserPointer extends Tool<LaserPointerProps> {
    static defaultProps = {
        icon: "🔴",
        tool: InkingTool.laserPointer
    }
}

export default LaserPointer;