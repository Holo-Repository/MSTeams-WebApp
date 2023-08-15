import { Button } from "@fluentui/react-components";
import React from "react";

/**
 * Interface to define the required properties for the EraserButton component.
 * 
 * @property {boolean} isPointEraser - Flag to indicate whether this button corresponds to the point eraser.
 * @property {boolean} active - Flag to indicate whether the button should be marked as active.
 * @property {JSX.Element | string} icon - The icon to be used on the button.
 * @property {(active: boolean) => void} setEraser - The function to be called when the button is clicked. 
 */
export interface EraserButtonProps {
    isPointEraser: boolean,
    active: boolean,
    icon: JSX.Element | string,
    setEraser: (active: boolean) => void
}

/**
 * EraserButton component.
 * 
 * It's a custom button component which is used to select the type of eraser in a drawing application.
 * The component receives as properties an icon, a flag to indicate if the button is active,
 * a function to be called when the button is clicked and a flag to indicate whether this button 
 * corresponds to the point eraser.
 */
class EraserButton extends React.Component<EraserButtonProps> {
    render(): React.ReactNode {
        return (
            <Button
                id="eraser-button"
                className={this.props.active ? 'picker-selected' : 'picker-unselected'}
                onClick={() => this.props.setEraser(this.props.isPointEraser)}
            >
            {this.props.icon}    
            </Button>
        )
    }

}

export default EraserButton;