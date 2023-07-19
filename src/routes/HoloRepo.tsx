import React from "react";
import { app, meeting } from "@microsoft/teams-js";
import { LiveEvent, LiveShareClient } from "@microsoft/live-share";
import { LiveShareHost } from "@microsoft/teams-js";

import SharedCanvas from "./views/canvas/SharedCanvas";
import ContainerManager from "./containers/ContainerManager";
import Content from "./views/content/Content";
import Container from "./containers/Container";

/**
 * The HoloRepo component.
 * This component is responsible for rendering the correct view based on the context.
 * It is the main component of the app and holds all the reactive logic.
 * 
 * The view is determined by the context.page.frameContext value served by the Teams SDK.
 */
class HoloRepo extends React.Component {
    state = {
        // Expected values: "default", "content", "sidePanel", "meetingStage"
        // Represents the current view where the app is running.
        // Don't forget that multiple views can be running at the same time.
        view: "default",
        containerManager: undefined as ContainerManager | undefined,
        containers: [] as Container[],
        activeContainerId: undefined as string | undefined,
    };

    liveNewContainerEvent: LiveEvent | undefined = undefined;

    constructor(props: any) {
        super(props);
        this.openContainer = this.openContainer.bind(this);
        this.createContainer = this.createContainer.bind(this);
    }

    async componentDidMount() {
        const context = await app.getContext();
        const locationID = (context.channel ?? context.chat)?.id;
        const view = context.page.frameContext;

        // Connect to a Fluid container handles by Teams
        // This acts a message queue to synchronize the state of the app across multiple views
        // Joining a container is only possible in the side panel and meeting stage views
        if (["sidePanel", "meetingStage"].includes(view)) {
            // Setup the Fluid container
            const host = LiveShareHost.create();
            const liveShare = new LiveShareClient(host);
            const schema = { initialObjects: {
                liveNewContainerEvent: LiveEvent,
            } };
            const { container } = await liveShare.joinContainer(schema);
            this.liveNewContainerEvent = container.initialObjects.liveNewContainerEvent as LiveEvent;
            // Set listeners for the Fluid container
            this.liveNewContainerEvent.on('received', () => {
                this.state.containerManager?.listContainers().then((containers) =>
                    this.setState({ containers })
                );
            });
            // Set the initial state
            await this.liveNewContainerEvent.initialize();
        }

        // Get URL parameters
        const params = new URLSearchParams(window.location.search);
        const activeContainerId = params.get("containerID");

        // Create a container manager to handle connections to remote containers
        const containerManager = new ContainerManager(locationID, { userId: context.user?.id, userName: context.user?.userPrincipalName })

        // Setup the container manager
        this.setState({ 
            view,
            containerManager,
            containers: await containerManager.listContainers(),
            activeContainerId,
        });
    }

    /**
     * Triggers the opening of a container in the current view.
     * Propagates the change to all other clients connected to the app Fluid container.
     * 
     * @param container The container to open.
     * @throws Error if the container cannot be opened in the current view.
     */
    openContainer(container: Container) {
        // Add the container ID to the parameter "containerID" in the URL
        const newURL = new URL(window.location.href);
        newURL.searchParams.set("containerID", container.id);
        // Open the container in the current view
        meeting.shareAppContentToStage((err, result) => {
            // Alert the user that something went wrong
            if (err)
                alert(`Error opening container ${container.id} in the meeting stage view
                Please try again.
                Error: ${err}`);
            // Update the view
            if (result) this.setState({ activeContainerId: container.id });
        }, newURL.href);
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
        if (!this.state.containerManager) throw new Error("Cannot create container without a container manager"); // This should never happen because the button should be disabled
        
        await this.state.containerManager.createContainer(name, description);
        this.liveNewContainerEvent?.send('received')
        this.setState({ containers: await this.state.containerManager.listContainers() });
    }

    render() {
        const { 
            view, 
            containerManager,
            activeContainerId,
        } = this.state;
        let content = null;

        const contentProps = {
            containers: this.state.containers,
            canCreate: containerManager !== undefined,
            openContainer: this.openContainer,
            createContainer: this.createContainer,
        };

        if (view === "default") 
            content = "Loading...";
        else if (view === "content") 
            content = <Content {...contentProps} canOpen={false}/>;
        else if (!activeContainerId && ["sidePanel", "meetingStage"].includes(view))
            content = <Content {...contentProps} canOpen={true}/>;
        else if (activeContainerId) {
            if (view === "sidePanel")
                content = "Side panel view";
            else if (view === "meetingStage")
                content = <SharedCanvas container={activeContainerId} containerManager={containerManager!}/>;
        } else
            content = "Unknown view";

        return (
            <div>
                {content}
            </div>
        );
    }
}

export default HoloRepo;
