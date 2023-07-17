import React from "react";
import { Button } from "@fluentui/react-components";

/**
 * The size picker component.
 * This component implements a basic picker interface using buttons.
 * 
 * Handles click events and calls the setSize function passed as a prop.
 * 
 * @param setSize The function to call when a size is selected.
 */
class SizePicker extends React.Component<{defaultSize: number, setSize: (size: number) => void}> {
    sizes = [1, 5, 10, 25, 50]

    state = {
        selectedSize: this.props.defaultSize,
    };

    setColor(size: number) {
        this.setState({ selectedSize: size });
        this.props.setSize(size);
    }

    render(): React.ReactNode {
        return <div id="size-picker" className="tool-third-level">
            {this.sizes.map((size: number) => 
                <Button
                    key={size}
                    style={{
                        border: this.state.selectedSize === size ? '1px solid #444791' : '1px solid grey',
                        backgroundColor: this.state.selectedSize === size ? 'rgba(89, 95, 186, 0.9)' : 'rgba(36, 36, 36, 0.9)'}}
                    onClick={() => this.props.setSize(size)}
                >{size}</Button>
            )}
        </div>;
    }

}

export default SizePicker;