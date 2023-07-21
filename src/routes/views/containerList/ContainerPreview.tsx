import React from "react";

import ContainerMap from "../../containers/ContainerMap";


export interface ContainerPreviewProps {
    container: ContainerMap | undefined;
    canOpen: boolean;
    open: (containerId: string) => void;
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
        canOpen: false,
    };

    render() {
        const { container, create, open, canOpen } = this.props;

        if (create === undefined && container === undefined)
            throw new Error("ContainerPreview: Either container or create must be defined.");

        return (
            <div>
                {container && <p>{container.name}</p>}
                {container && <p>{container.description}</p>}
                {container && canOpen && <button onClick={() => open(container.id)}>Open</button>}
                {/* TODO: Add a form so that the button gets the name and desc of the new container from the user */}
                {!container && <button onClick={() => {create('Name', 'Desc')}}>+</button>}
            </div>
        );
    }
}

export default ContainerPreview;