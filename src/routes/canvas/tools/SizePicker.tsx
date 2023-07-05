import React from "react";

/**
 * The size picker component.
 * This component implements a basic picker interface using buttons.
 * 
 * Handles click events and calls the setSize function passed as a prop.
 * 
 * @param setSize The function to call when a size is selected.
 */
class SizePicker extends React.Component<{setSize: (size: number) => void}> {
    sizes = [1, 5, 10, 25, 50]

    render(): React.ReactNode {
        return <div>
            {this.sizes.map((size: number) => 
                <button
                    key={size}
                    onClick={() => this.props.setSize(size)}
                >{size}</button>
            )}
        </div>;
    }

}

export default SizePicker;