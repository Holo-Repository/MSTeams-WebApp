import React from "react";
import { InkingTool } from "@microsoft/live-share-canvas";

import Tool, { ToolProps } from "./Tool";


class LaserPointer extends Tool {
    static defaultProps = {
        icon: "🔴",
        tool: InkingTool.laserPointer
    }
}

export default LaserPointer;