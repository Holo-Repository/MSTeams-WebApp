import React from "react";
import { Button } from "@fluentui/react-components";

/**
 * A color picker component.
 * This component shows a button for each color in the colors array
 * and handles the click event by calling the setColor callback function.
 * 
 * @param setColor A callback function that sets the color.
 */
class ColorPicker extends React.Component<{setColor: (color: string) => void}> {
    colors = [
        "#FF0000", // red
        "#FFA500", // orange
        "#FFFF00", // yellow
        "#008000", // green
        "#0000FF", // blue
        "#800080", // purple
        "#000000", // black
        "#FFFFFF"  // white
    ]

    render(): React.ReactNode {
        return <div id="color-picker" className="tool-third-level">
            {this.colors.map((color: string) => 
                <Button
                    key={color}
                    onClick={() => this.props.setColor(color)}
                    style={{ color: color }}
                >&#9632;</Button>
            )}
        </div>;
    }

}

export default ColorPicker;