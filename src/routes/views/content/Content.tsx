import React from "react";

import Container from "../../containers/Container";
import ContainerPreview from "./ContainerPreview";

export interface ContentProps {
    containers: Container[];
    canOpen: boolean;
    canCreate: boolean;
    openContainer: (container: Container) => void;
    createContainer: (name: string, description: string) => void;
}

class Content extends React.Component<ContentProps> {
    render() {
        return (
            <div>
                <h1>Containers</h1>
                <ul>
                    {this.props.containers.map((container) => (
                        <li key={container.id}><ContainerPreview container={container} open={this.props.openContainer} canOpen={this.props.canOpen}/></li>
                    ))}
                    {this.props.canCreate && <li><ContainerPreview create={this.props.createContainer}/></li>}
                </ul>
            </div>
        );
    }
}

export default Content;
