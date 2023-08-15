import React from "react";
import { app } from "@microsoft/teams-js";
import { Spinner } from "@fluentui/react-components";

import SidePanel from "./views/sidePanel/SidePanel";
import MeetingStage from "./views/meetingStage/MeetingStage";
import ContainerManager from "./containers/ContainerManager";
import commonStyles from "../styles/CommonSidePanelMeetingStage.module.css";

/**
 * The HoloCollab component.
 * This component is responsible for rendering the correct view based on the context.
 * 
 * The view is determined by the context.page.frameContext value served by the Teams SDK.
 */
class HoloCollab extends React.Component {
    state = {
        // Expected values: "default", "content", "sidePanel", "meetingStage"
        // Represents the current view where the app is running.
        // Don't forget that multiple views can be running at the same time.
        view: "default",
    };

    containerManager = undefined as ContainerManager | undefined;

    async componentDidMount() {
        try {
            const context = await app.getContext();
            const view = context.page.frameContext;
            
            // Connect to the container manager
            const locationID = (context.channel ?? context.chat)?.id;
            const user = { userId: context.user?.id, userName: context.user?.userPrincipalName };
            this.containerManager = new ContainerManager(locationID, user);

            this.setState({ view });
        } catch (error: any) { raiseGlobalError(error) };
    }

    render() {
        const { view } = this.state;

        if (!this.containerManager) return <div className={commonStyles.loading}><Spinner labelPosition="below" label="Connecting..." /></div>;

        return (
            <>
                {view === 'content' && 'Content'}
                {view === 'sidePanel' && <SidePanel containerManager={this.containerManager}/>}
                {view === 'meetingStage' && <MeetingStage containerManager={this.containerManager}/>}
            </>
        )
    }
}

export default HoloCollab;
