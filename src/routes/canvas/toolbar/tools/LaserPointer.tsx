import { InkingTool } from "@microsoft/live-share-canvas";

import Tool from "./Tool";

/**
 * The laser pointer component.
 * This component shows a button that allows the user to switch to the laser pointer.
 * 
 * It is very basic and simply extends the Tool component, which handles the tool selection logic.
 */
class LaserPointer extends Tool {
    static defaultProps = {
        icon: "🔴",
        tool: InkingTool.laserPointer
    }

    render(): React.ReactNode {

        return (
            <Tool {...this.props}>
            </Tool>
        );
    }
}

export default LaserPointer;