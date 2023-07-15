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
class SizePicker extends React.Component<{setSize: (size: number) => void}> {
    sizes = [1, 5, 10, 25, 50]

    render(): React.ReactNode {
        return <div id="size-picker" className="tool-third-level">
            {this.sizes.map((size: number) => 
                <Button
                    key={size}
                    onClick={() => this.props.setSize(size)}
                >{size}</Button>
            )}
        </div>;
    }

}

export default SizePicker;