import React from "react";

import Container from "../../containers/Container";
import ContainerPreview from "./ContainerPreview";
import ContainerManager from "../../containers/ContainerManager";

export interface ContentProps {
    containerManager: ContainerManager;
    canOpen: boolean;
    canCreate: boolean;
    openContainer: (containerId: string) => void;
    createContainer: (name: string, desc: string) => void;
}

class Content extends React.Component<ContentProps> {
    state = {
        containers: [] as Container[],
    };

    constructor(props: ContentProps) {
        super(props);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.createContainer = this.createContainer.bind(this);
    }

    async componentDidMount() {
        const containers = await this.props.containerManager.listContainers();
        this.setState({ containers });
    }
    
    async createContainer(name: string, desc: string) {
        console.log('createContainer', name, desc);
        await this.props.createContainer(name, desc);
        console.log('createContainer', 'done');
        // this.setState({ containers: await this.props.containerManager.listContainers() });
    }


    render() {
        return (
            <div>
                <h1>Containers</h1>
                <ul>
                    {this.state.containers.map((container) => (
                        <li key={container.id}>
                            <ContainerPreview container={container} open={this.props.openContainer} canOpen={this.props.canOpen}/>
                        </li>
                    ))}
                    {this.props.canCreate && <li><ContainerPreview create={this.props.createContainer}/></li>}
                </ul>
            </div>
        );
    }
}

export default Content;
