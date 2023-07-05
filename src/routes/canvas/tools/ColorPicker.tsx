import React from "react";

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
        return <div>
            {this.colors.map((color: string) => 
                <button
                    key={color}
                    onClick={() => this.props.setColor(color)}
                    style={{ color: color }}
                >&#9632;</button>
            )}
        </div>;
    }

}

export default ColorPicker;