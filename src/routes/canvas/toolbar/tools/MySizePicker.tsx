import React from "react";
// import { Slider} from "@fluentui/react-components";
import { Slider, ISliderStyles } from "@fluentui/react"

const sizePickerStyles: Partial<ISliderStyles> = {
    container: {width: 230, marginTop: 0, marginBottom: 5},
    slideBox: {
        width: 200,
        padding: '0 5 0 10',
        ':hover .ms-Slider-active': {background: '#5155b6'},
        ':hover .ms-Slider-thumb': {border: '2px solid #5155b6'}
    },          
    lineContainer: {height: 5, borderRadius: 0},
    valueLabel : {marginRight: 2, paddingLeft:5},
    thumb: {height: 15, width: 15},
};


class MySizePicker extends React.Component<{defaultSize: number, setSize: (size: number) => void}> {

    state = {
        selectedSize: this.props.defaultSize,
    };

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
                    // onChange={(_, data) => this.setSize(data.value as number)}
                    styles={sizePickerStyles}
                />
            </div>
        );
    }

}

export default MySizePicker;