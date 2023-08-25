import React from 'react';

import ContainerList from '../containerList/ContainerList';
import ContainerManager from '../../containers/ContainerManager';
import AppContainer from '../../containers/AppContainer';
import { IValueChanged, SharedMap } from 'fluid-framework';
import { LiveEvent } from '@microsoft/live-share';
import Fuse from './Fuse';


export interface CommonSidePanelMeetingStageProps {
    containerManager: ContainerManager,
    children?: React.ReactNode,
    containerFuse?: Fuse<string>,

}

/**
 * This component exists only because the code for the SidePanel and MeetingStage components is almost identical.
 * The main difference is the render method, which is why it is abstracted away.
 * 
 * If int he future the two components become more different, this component should be removed.
 */
abstract class CommonSidePanelMeetingStage extends React.Component<CommonSidePanelMeetingStageProps> {
    state = {
        mounting: true,
        activeContainerId: undefined as string | undefined,
    }

    appState = undefined as SharedMap | undefined; // Global app state
    newContainerEvent = undefined as LiveEvent | undefined; // Event that triggers when a new container is created
    contentRef = React.createRef<ContainerList>();

    constructor(props: CommonSidePanelMeetingStageProps) {
        super(props);
        this.openContainer = this.openContainer.bind(this);
        this.reactToAppStateChange = this.reactToAppStateChange.bind(this);
        this.reactNewContainerEvent = this.reactNewContainerEvent.bind(this);
        this.createContainer = this.createContainer.bind(this);
        this.closeContainer = this.closeContainer.bind(this);
    }

    async componentDidMount() {
        // Set up connection to the global Fluid container for the app
        const appContainer = await AppContainer.connect()
        
        this.appState = appContainer.initialObjects.appState as SharedMap;
        this.appState.on('valueChanged', this.reactToAppStateChange);
        
        this.newContainerEvent = appContainer.initialObjects.newContainerEvent as LiveEvent;
        this.newContainerEvent.on('received', this.reactNewContainerEvent);
        await this.newContainerEvent.initialize();

        this.setState({ mounting: false, activeContainerId: this.props.containerFuse?.value });
    }

    componentWillUnmount() {
        if (this.appState) this.appState.off('valueChanged', this.reactToAppStateChange);
        if (this.newContainerEvent) this.newContainerEvent.off('received', this.reactNewContainerEvent);
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
            this.setState({ activeContainerId: container });
        }
    }

    /**
     * Reacts to the creation of a new container.
     */
    reactNewContainerEvent() {
        // If there is already an active container, as we should not be showing the list of containers anymore
        if (this.state.activeContainerId) return;
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
    async createContainer(name: string, description: string): Promise<void> {
        await this.props.containerManager.createContainer(name, description);
        // Signal to other clients that a new container has been created
        this.newContainerEvent?.send('received');
    }
    
    /**
     * Triggers the closing of the current container.
     * Propagates the change to all other clients connected to the app Fluid container.
     */
    async closeContainer() {
        // Save the last edit time
        this.openContainer(undefined as unknown as string);
        // Redraw the component to update edit time
        this.contentRef.current?.componentDidMount();
    }
    
        /**
         * Triggers the opening of a container in the current view.
         * Propagates the change to all other clients connected to the app Fluid container.
         * 
         * @param container The container to open.
         * @throws Error if the container cannot be opened in the current view.
         */
        abstract openContainer(containerId: string): void;
    
    abstract render(): React.ReactNode;
}

export default CommonSidePanelMeetingStage;