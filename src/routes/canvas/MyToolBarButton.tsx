import React from "react";
import { Tooltip, ToolbarRadioButton } from '@fluentui/react-components';

export interface MyToolbarButtonProps {
    children?: React.ReactNode,
    name: string,
    icon: JSX.Element,
    onClick: (event: any) => void
}

class MyToolbarButton extends React.Component<MyToolbarButtonProps> {
    render() {
      const { name, icon} = this.props;
  
      return (
          <Tooltip
            appearance="inverted"
            content={name}
            relationship="label"
            positioning="below"
          >
            <ToolbarRadioButton
              aria-label={name}
              size="medium"
              appearance="subtle"
              icon={icon}
              name="tools"
              value={name}
              onClick={this.props.onClick}
            >
            </ToolbarRadioButton>
          </Tooltip>
      );
    }
  }

  export default MyToolbarButton