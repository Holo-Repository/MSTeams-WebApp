import React from "react";

import ContainerMap from "../../containers/ContainerMap";
import ContainerPreview from "./ContainerPreview";
import ContainerManager from "../../containers/ContainerManager";

import './ContainerList.css'


export interface ContainerListProps {
    containerManager: ContainerManager;
    canOpen: boolean;
    canCreate: boolean;
    openContainer: (containerId: string) => void;
    createContainer: (name: string, desc: string) => Promise<void>;
    // closeContainer: (containerId: string) => void
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
                <h3>Recent Collab Case</h3>
                <div className="flex-container-list">
                    {this.state.containers.map((container) => (
                        <div className="flex-item" key={container.id}>
                            <ContainerPreview container={container} open={this.props.openContainer}
                            /*close={this.props.closeContainer}*/ canOpen={this.props.canOpen}/>
                        </div>
                    ))}
                    {this.props.canCreate && <div className="flex-item"><ContainerPreview create={this.props.createContainer}/></div>}
                </div>
            </div>
        );
    }
}

export default ContainerList;
