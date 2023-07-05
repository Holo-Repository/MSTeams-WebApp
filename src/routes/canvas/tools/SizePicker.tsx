import React from "react";

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