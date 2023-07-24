import * as React from 'react';
import {
  ColorPicker,
  getColorFromString,
  IColor,
  IColorPickerStyles,
} from '@fluentui/react';

const white = getColorFromString('#ffffff')!;

const colorPickerStyles: Partial<IColorPickerStyles> = {
  panel: { padding: '10px 15px 0px 15px'},
  root: {
    minWidth: 200,
    width: 230,
    backgroundColor: 'rgba(255, 255, 255, 0.7)'
  },
  colorRectangle: { minHeight: 160, minWidth: 200},
  table: {display: 'none'},
  colorSquare: {height: 20, width: 25, marginLeft: 10}
};

export interface MyColorPickerProps {
  color: IColor;
}

class MyColorPicker extends React.Component<{defaultColor: string, setColor: (color: string) => void}, MyColorPickerProps> {
  state = {
    color: getColorFromString(this.props.defaultColor)!,
    showPreview: true,
  };

  updateColor = (ev: any, colorObj: IColor) => {
    this.setState({ color: colorObj });
    this.props.setColor(colorObj.str);
  };

  render() {
    const { color } = this.state;

    return (
      <div>
        <ColorPicker
          color={color}
          onChange={this.updateColor}
          alphaType={"none"}
          showPreview={true}
          styles={colorPickerStyles}
        />
      </div>
    );
  }
}

export default MyColorPicker;
