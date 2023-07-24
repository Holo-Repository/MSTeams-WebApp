import * as React from 'react';
import {
  ColorPicker,
  getColorFromString,
  IColor,
  IColorPickerStyles,
} from '@fluentui/react';

/**
 * Styles for the ColorPicker component from Fluent UI.
 */
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

/**
 * Props for the MyColorPicker component.
 */
export interface MyColorPickerProps {
  defaultColor: string,
  setColor: (color: string) => void,
}

/**
 * A custom color picker component.
 * This component uses Fluent UI's ColorPicker to allow the user to pick a color.
 * The picked color is then passed up to the parent component through the setColor prop.
 */
class MyColorPicker extends React.Component<MyColorPickerProps> {
  /**
   * The state of the component, which includes the currently selected color.
   */
  state = {
    color: getColorFromString(this.props.defaultColor)!,
    showPreview: true,
  };

  /**
   * A helper function to update the color both in the component's state and in the parent component.
   * 
   * @param ev The event that triggers the update.
   * @param colorObj The new color.
   */
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
