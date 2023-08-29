import CommonSidePanelMeetingStage, { CommonSidePanelMeetingStageProps } from "../utils/CommonSidePanelMeetingStage";
import ContainerList from '../containerList/ContainerList';
import { Spinner } from "@fluentui/react-components";
import { meeting } from '@microsoft/teams-js';

import commonStyles from '../../../styles/CommonSidePanelMeetingStage.module.css';
import '../../../styles/MeetingStage.css'


export type SidePanelProps = CommonSidePanelMeetingStageProps;

/**
 * The side panel view.
 */
class SidePanel extends CommonSidePanelMeetingStage {
    openContainer(containerId: string, shareToMeetingStage: boolean = true): void {
        if (!this.appState) throw raiseGlobalError(new Error('App state not initialized'));

        const containerLink = `${window.location.origin}?containerID=${containerId}`;
        if (!shareToMeetingStage) this.appState!.set('activeContainerId', containerId);
        else meeting.shareAppContentToStage((error, result) => {
            if (error) raiseGlobalError(new Error(`Error opening container ${containerId}: ${error}`));
            if (result) this.appState!.set('activeContainerId', containerId);
        }, containerLink);
    }

    render() {
        if (this.state.mounting) return <div className={commonStyles.loading}><Spinner labelPosition="below" label="Connecting..." /></div>;

        return <ContainerList ref={this.contentRef}
            containerManager={this.props.containerManager} 
            activeContainerId = {this.state.activeContainerId}
            canOpen={true} 
            canCreate={true} 
            openContainer={this.openContainer} 
            closeContainer={this.closeContainer}
            createContainer={this.createContainer}
            deleteContainer={this.deleteContainer}
        />;
}
}

export default SidePanel;