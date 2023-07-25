import React from "react";
import { Slider, ISliderStyles } from "@fluentui/react"

/**
 * Styles for the Slider component from Fluent UI.
 */
const sizePickerStyles: Partial<ISliderStyles> = {
    container: {width: 230, marginTop: 0, marginBottom: 5},
    slideBox: {
        width: 200,
        padding: '0px 5px 0px 10px',
        ':hover .ms-Slider-active': {background: '#5155b6'},
        ':hover .ms-Slider-thumb': {border: '2px solid #5155b6'}
    },          
    lineContainer: {height: 5, borderRadius: 0},
    valueLabel : {marginRight: 2, paddingLeft:5},
    thumb: {height: 15, width: 15},
};

/**
 * A custom size picker component.
 * This component uses Fluent UI's Slider to allow the user to pick a size between a defined minimum and maximum.
 * The picked size is then passed up to the parent component through the setSize prop.
 */
class SizeSelector extends React.Component<{defaultSize: number, setSize: (size: number) => void}> {

    /**
     * The state of the component, which includes the currently selected size.
     */
    state = {
        selectedSize: this.props.defaultSize,
    };

    /**
     * A helper function to set the size both in the component's state and in the parent component.
     * 
     * @param size The size to be set.
     */
    setSize(size: number) {
        this.setState({ selectedSize: size });
        this.props.setSize(size);
    }

    render(): React.ReactNode {
        return (
            <div>
                <Slider
                    value={this.state.selectedSize}
                    min={1}
                    max={30}
                    onChange={(value: number) => this.setSize(value)}
                    onFocus={undefined}
                    styles={sizePickerStyles}
                />
            </div>
        );
    }

}

export default SizeSelector;