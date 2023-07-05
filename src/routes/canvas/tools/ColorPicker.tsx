import React from "react";

class ColorPicker extends React.Component<{setColor: (color: string) => void}> {
    colors = [
        "red",
        "orange",
        "yellow",
        "green",
        "blue",
        "purple",
        "black",
        "white"
    ]

    render(): React.ReactNode {
        return <div>
            {this.colors.map((color: string) => 
                <button
                    key={color}
                    onClick={() => this.props.setColor(color)}
                    style={{ backgroundColor: color }}
                >&#9726</button>
            )}
        </div>;
    }

}

export default ColorPicker;