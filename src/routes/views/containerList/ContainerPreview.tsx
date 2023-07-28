import React from "react";
import { DefaultButton } from '@fluentui/react/lib/Button';

import ContainerMap from "../../containers/ContainerMap";
import './ContainerList.css'

const imgPath = require('../../../assets/preview.png')


export interface ContainerPreviewProps {
    container: ContainerMap | undefined;
    canOpen: boolean;
    open: (containerId: string) => void;
    // close: (containerId: string) => void;
    create: (name: string, desc: string) => void;
}

/**
 * A preview of a fluid container.
 */
class ContainerPreview extends React.Component<ContainerPreviewProps> {
    static defaultProps = {
        container: undefined,
        create: undefined,
        open: () => {},
        // close: () => {},
        canOpen: false,
    };

    // state = {
    //     opened: false,

    // };

    // toggleButton(containerId: string) {
    //     this.state.opened ? this.props.close(containerId):this.props.open(containerId);
    // }

    render() {
        const { container, create, open, canOpen } = this.props;

        if (create === undefined && container === undefined)
            throw new Error("ContainerPreview: Either container or create must be defined.");

        return (
            <div>
                {container &&
                    <div className="container">
                        <img src={imgPath} alt='preview' />
                        <div className="display-area">
                            <h4>{container.name}</h4>
                            <p>{container.description}</p>
                            {canOpen && <button onClick={() => open(container.id)}>Work Together</button>}
                        </div>
                    </div>
                }
                {/* TODO: Add a form so that the button gets the name and desc of the new container from the user */}
                {!container && <button onClick={() => {create('Name', 'Desc')}}>+</button>}
            </div>
        );
    }
}

export default ContainerPreview;