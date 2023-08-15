import { InkingTool } from "@microsoft/live-share-canvas";
import Tool from "./Tool";

/**
 * Path of the image of icon
 */
const imgPath = require('../../../../../assets/laser.png');

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
            <Tool {...this.props} icon={ <img src={imgPath} alt={this.props.icon as string} />} />
        );
    }
}

export default LaserPointer;