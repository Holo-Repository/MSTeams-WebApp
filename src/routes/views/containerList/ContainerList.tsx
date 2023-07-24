import React from "react";

import ContainerMap from "../../containers/ContainerMap";
import ContainerPreview from "./ContainerPreview";
import ContainerManager from "../../containers/ContainerManager";


export interface ContainerListProps {
    containerManager: ContainerManager;
    canOpen: boolean;
    canCreate: boolean;
    openContainer: (containerId: string) => void;
    createContainer: (name: string, desc: string) => Promise<void>;
}

/**
 * A list of fluid containers.
 */
class ContainerList extends React.Component<ContainerListProps> {
    state = {
        containers: [] as ContainerMap[],
    };

    constructor(props: ContainerListProps) {
        super(props);
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    async componentDidMount() {
        // Get the list of containers for the current location from the Table Storage
        const containers = await this.props.containerManager.listContainers();
        this.setState({ containers });
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

export default ContainerList;
