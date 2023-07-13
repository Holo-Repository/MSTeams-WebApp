import * as React from 'react';
import {
  ColorPicker,
  IChoiceGroupOption,
  getColorFromString,
  IColor,
  IColorPickerStyles,
  IColorPickerProps,
  updateA,
  mergeStyleSets,
} from '@fluentui/react';

const white = getColorFromString('#ffffff')!;
const alphaOptions: IChoiceGroupOption[] = [
  { key: 'alpha', text: 'Alpha' },
  { key: 'transparency', text: 'Transparency' },
  { key: 'none', text: 'None' },
];

const classNames = mergeStyleSets({
  wrapper: { display: 'flex' },
  column2: { marginLeft: 10 },
});

const colorPickerStyles: Partial<IColorPickerStyles> = {
  panel: { padding: 12 },
  root: {
    maxWidth: 352,
    minWidth: 352,
  },
  colorRectangle: { height: 268 },
};

export interface MyColorPickerProps {
  color: IColor;
  showPreview: boolean;
  alphaType: IColorPickerProps['alphaType'];
}

class MyColorPicker extends React.Component<{}, MyColorPickerProps> {
  state = {
    color: white,
    showPreview: true,
    alphaType: 'alpha' as IColorPickerProps['alphaType'],
  };

  updateColor = (ev: any, colorObj: IColor) => {
    this.setState({ color: colorObj });
  };

  onShowPreviewClick = (ev: any, checked?: boolean) => {
    this.setState({ showPreview: !!checked });
  };

  onAlphaTypeChange = (ev: any, option: IChoiceGroupOption = alphaOptions[0]) => {
    if (option.key === 'none') {
      // If hiding the alpha slider, remove transparency from the color
      this.setState((state) => ({ color: updateA(state.color, 100) }));
    }
    this.setState({ alphaType: option.key as IColorPickerProps['alphaType'] });
  };

  render() {
    const { color, showPreview, alphaType } = this.state;

    return (
      <div className={classNames.wrapper}>
        <ColorPicker
          color={color}
          onChange={this.updateColor}
          alphaType={alphaType}
          showPreview={showPreview}
          styles={colorPickerStyles}
          strings={{
            hueAriaLabel: 'Hue',
          }}
        />
      </div>
    );
  }
}

export default MyColorPicker;
