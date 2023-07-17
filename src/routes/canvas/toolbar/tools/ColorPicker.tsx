import React from "react";
import { Button } from "@fluentui/react-components";

/**
 * A color picker component.
 * This component shows a button for each color in the colors array
 * and handles the click event by calling the setColor callback function.
 * 
 * @param setColor A callback function that sets the color.
 */
class ColorPicker extends React.Component<{defaultColor: string, setColor: (color: string) => void}> {
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

    state = {
        selectedColor: this.props.defaultColor,
    };

    setColor(color: string) {
        this.setState({ selectedColor: color });
        this.props.setColor(color);
    }


    render(): React.ReactNode {
        return <div id="color-picker" className="tool-third-level">
            {this.colors.map((color: string) => 
                <Button
                    key={color}
                    onClick={() => this.setColor(color)}
                    style={{ color: color, 
                        border: this.state.selectedColor === color ? '1px solid #444791' : '1px solid grey',
                        backgroundColor: this.state.selectedColor === color ? 'rgba(89, 95, 186, 0.9)' : 'rgba(36, 36, 36, 0.9)'}}
                >&#9632;</Button>
            )}
        </div>;
    }

}

export default ColorPicker;