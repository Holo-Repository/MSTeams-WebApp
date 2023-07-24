import React from "react";
import { app } from "@microsoft/teams-js";

import SidePanel from "./views/sidePanel/SidePanel";
import MeetingStage from "./views/meetingStage/MeetingStage";
import ContainerManager from "./containers/ContainerManager";


/**
 * The HoloRepo component.
 * This component is responsible for rendering the correct view based on the context.
 * 
 * The view is determined by the context.page.frameContext value served by the Teams SDK.
 */
class HoloRepo extends React.Component {
    state = {
        // Expected values: "default", "content", "sidePanel", "meetingStage"
        // Represents the current view where the app is running.
        // Don't forget that multiple views can be running at the same time.
        view: "default",
    };

    containerManager = undefined as ContainerManager | undefined;

    async componentDidMount() {
        const context = await app.getContext();
        const view = context.page.frameContext;
        
        // Connect to the container manager
        const locationID = (context.channel ?? context.chat)?.id;
        const user = { userId: context.user?.id, userName: context.user?.userPrincipalName };
        this.containerManager = new ContainerManager(locationID, user);

        this.setState({ view });
    }

    render() {
        const { view } = this.state;

        if (!this.containerManager) return 'Loading...';

        return (
            <>
                {view === 'content' && 'Content'}
                {view === 'sidePanel' && <SidePanel containerManager={this.containerManager}/>}
                {view === 'meetingStage' && <MeetingStage containerManager={this.containerManager}/>}
            </>
        )
    }
}

export default HoloRepo;
