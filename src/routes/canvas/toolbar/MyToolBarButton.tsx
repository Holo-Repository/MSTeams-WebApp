import React from "react";
import { Tooltip, ToolbarRadioButton } from '@fluentui/react-components';

export interface MyToolbarButtonProps {
    children?: React.ReactNode,
    value: string,
    name: string,
    icon: JSX.Element,
    onClick: (event: any) => void
}

class MyToolbarButton extends React.Component<MyToolbarButtonProps> {
    render() {
      const { value, name, icon} = this.props;
  
      return (
        <span>
          <Tooltip
            appearance="inverted"
            content={value}
            relationship="label"
            positioning="below"
          >
            <ToolbarRadioButton
              aria-label={value}
              size="medium"
              appearance="subtle"
              icon={icon}
              name={name}
              value={value}
              onClick={this.props.onClick}
            >
            </ToolbarRadioButton>
          </Tooltip>
        </span>
      );
    }
  }

  export default MyToolbarButton