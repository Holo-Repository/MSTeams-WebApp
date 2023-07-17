import React from "react";

import Container from "../../containers/Container";

export interface ContainerPreviewProps {
    container: Container | undefined;
    canOpen: boolean;
    open: (container: Container) => void;
    create: (name: string, desc: string) => void;
}

class ContainerPreview extends React.Component<ContainerPreviewProps> {
    static defaultProps = {
        container: undefined,
        create: undefined,
        open: () => {},
        canOpen: false,
    };

    render() {
        const { container, create, open, canOpen } = this.props;

        if (create === undefined && container === undefined) {
            throw new Error("ContainerPreview: Either container or create must be defined.");
        }

        return (
            <div>
                {container && <p>{container.name}</p>}
                {container && <p>{container.description}</p>}
                {container && canOpen && <button onClick={() => open(container)}>Open</button>}
                {!container && <button onClick={() => {create('Name', 'Desc')}}>+</button>}
            </div>
        );
    }
}

export default ContainerPreview;