import React, { Children } from "react";
import { Tooltip, ToolbarRadioButton } from '@fluentui/react-components';

/**
 * Interface for MyToolbarButton properties
 * 
 * @property {React.ReactNode} children - Optional children elements of MyToolbarButton
 * @property {string} value - The value of the toolbar button
 * @property {string} name - The name of the toolbar button
 * @property {JSX.Element} icon - The icon of the toolbar button
 * @property {JSX.Element | boolean | undefined} content - Optional additional content
 * @property {(event: any) => void} onClick - Function to be executed on button click
 */
export interface MyToolbarButtonProps {
    children?: React.ReactNode,
    value: string,
    name: string,
    icon: JSX.Element,
    onClick: (event: any) => void
}

/**
 * MyToolbarButton is a class component that renders a single button within a toolbar.
 * The button can be configured using several properties including: value, name, icon, content, and an onClick function.
 */
class MyToolbarButton extends React.Component<MyToolbarButtonProps> {
  
    render() {
      const { children, value, name, icon} = this.props;
  
      return (
        <span style={{position:"relative"}}>
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
          {children}
        </span>
      );
    }
  }

  export default MyToolbarButton