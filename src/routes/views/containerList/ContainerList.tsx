import React from "react";

import ContainerMap from "../../containers/ContainerMap";
import ContainerPreview from "./ContainerPreview";
import ContainerManager from "../../containers/ContainerManager";

import './ContainerList.css'

export interface ContainerListProps {
    containerManager: ContainerManager;
    activeContainerId: string | undefined;
    canOpen: boolean;
    canCreate: boolean;
    openContainer: (containerId: string) => void;
    closeContainer: (containerId: string) => void;
    createContainer: (name: string, desc: string) => Promise<void>;
}

/**
 * A list of fluid containers.
 */
class ContainerList extends React.Component<ContainerListProps> {

    static defaultProps = {
        activeContainerId: undefined,
        closeContainer: () => {},
    }

    state = {
        containers: [] as ContainerMap[],
        mounted: false,
    };

    constructor(props: ContainerListProps) {
        super(props);
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    /**
     * Called immediately after a component is mounted.
     * Fetches the list of containers for the current location from the Table Storage,
     * and sort the containers by the last edited time.
     */
    async componentDidMount() {
        // Get the list of containers for the current location from the Table Storage
        const containers = await this.props.containerManager.listContainers();
        containers.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
        this.setState({ containers: containers, mounted: true });
    }

    /**
     * Returns the active container based on the `activeContainerId` from the props.
     * @returns The container map of the active container
     */
    getActiveContainer() {
        const index = this.state.containers.findIndex(container => container.id === this.props.activeContainerId);
        return this.state.containers[index];
    }

    render() {
        return (
            <div>
                {!this.props.activeContainerId && this.state.mounted && <div>
                    <h3>Recent Collab Case</h3>
                    <div className="flex-container-list">
                        {this.state.containers.map((container) => (
                            <div className="flex-item" key={container.id}>
                                <ContainerPreview container={container} open={this.props.openContainer}
                                canOpen={this.props.canOpen}/>
                            </div>
                        ))}
                        {this.props.canCreate && <div className="flex-item"><ContainerPreview create={this.props.createContainer}/></div>}
                    </div>
                </div>}

                {this.props.activeContainerId && this.state.mounted && 
                    <div className="flex-container-list">
                        <ContainerPreview container={this.getActiveContainer()} close={this.props.closeContainer}
                        canClose={true}
                        ></ContainerPreview>
                    </div>
                }

            </div>
        );
    }
}

export default ContainerList;
