import React from 'react';

import Content from '../content/Content';
import ContainerManager from '../../containers/ContainerManager';
import AppContainer from '../../containers/AppContainer';
import { IValueChanged, SharedMap } from 'fluid-framework';
import { LiveEvent } from '@microsoft/live-share';


export interface SidePanelProps {
    containerManager: ContainerManager
}


class SidePanel extends React.Component<SidePanelProps> {
    state = {
        mounting: true,
        activeContainerId: undefined as string | undefined,
    }

    appState = undefined as SharedMap | undefined;
    newContainerEvent = undefined as LiveEvent | undefined;
    contentRef = React.createRef<Content>();

    constructor(props: SidePanelProps) {
        super(props);
        this.openContainer = this.openContainer.bind(this);
        this.reactToAppStateChange = this.reactToAppStateChange.bind(this);
        this.reactNewContainerEvent = this.reactNewContainerEvent.bind(this);
        this.createContainer = this.createContainer.bind(this);
        this.closeContainer = this.closeContainer.bind(this);
    }

    async componentDidMount() {
        const appContainer = await AppContainer.connect()
        
        this.appState = appContainer.initialObjects.appState as SharedMap;
        this.appState.on('valueChanged', this.reactToAppStateChange);
        
        this.newContainerEvent = appContainer.initialObjects.newContainerEvent as LiveEvent;
        this.newContainerEvent.on('received', this.reactNewContainerEvent);
        await this.newContainerEvent.initialize();

        this.setState({ mounting: false });
    }

    /**
     * Reacts to changes in the app state.
     * 
     * @param changed The key of the changed value.
     * @param local Whether the change was local or remote.
     */
    reactToAppStateChange(changed: IValueChanged, local: boolean): void {
        if (changed.key === 'activeContainerId') {
            const container = this.appState!.get(changed.key) as string;
            console.log('sidePanel', 'valueChanged', container, local);
            this.setState({ activeContainerId: container });
        }
    }

    /**
     * Reacts to the creation of a new container.
     */
    reactNewContainerEvent() {
        if (this.state.activeContainerId) return;
        console.log('meetingStage', 'newContainerEvent', 'received');
        // Redraw the component to show the new container
        this.contentRef.current?.componentDidMount();
    }
    
        /**
         * Triggers the creation of a container in the current location.
         * Propagates the change to all other clients connected to the app Fluid container.
         * 
         * @param name The name of the container.
         * @param description The description of the container.
         * @throws Error if the container cannot be created in the current location.
         */
        async createContainer(name: string, description: string) {
            await this.props.containerManager.createContainer(name, description);
            console.log('sidePanel', 'createContainer', 'sending');
            this.newContainerEvent?.send('received');
        }

    /**
     * Triggers the opening of a container in the current view.
     * Propagates the change to all other clients connected to the app Fluid container.
     * 
     * @param container The container to open.
     * @throws Error if the container cannot be opened in the current view.
     */
    openContainer(containerId: string): void {
        if (!this.appState) return console.error('sidePanel', 'openContainer', 'appState is undefined');
        this.appState.set('activeContainerId', containerId);
    }

    closeContainer() {
        this.openContainer(undefined as unknown as string);
    }

    render() {
        if (this.state.mounting) return <div>Loading...</div>;

        if (!this.state.activeContainerId)
            return <Content ref={this.contentRef}
                containerManager={this.props.containerManager} 
                canOpen={true} 
                canCreate={true} 
                openContainer={this.openContainer} 
                createContainer={this.createContainer}
            />;

        return (
            <div>
                <button onClick={this.closeContainer}>Close</button>
                Active Container: {this.state.activeContainerId}
            </div>
        );
    }
}

export default SidePanel;