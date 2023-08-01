import CommonSidePanelMeetingStage, { CommonSidePanelMeetingStageProps } from "../utils/CommonSidePanelMeetingStage";
import ContainerList from '../containerList/ContainerList';
import { Spinner } from "@fluentui/react-components";

import commonStyles from '../../../styles/CommonSidePanelMeetingStage.module.css';
import '../meetingStage/MeetingStage.css'


export type SidePanelProps = CommonSidePanelMeetingStageProps;

/**
 * The side panel view.
 */
class SidePanel extends CommonSidePanelMeetingStage {
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
        />;
}
}

export default SidePanel;