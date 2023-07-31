import CommonSidePanelMeetingStage, { CommonSidePanelMeetingStageProps } from "../utils/CommonSidePanelMeetingStage";
import ContainerList from '../containerList/ContainerList';
import { Spinner } from "@fluentui/react-components";
import '../meetingStage/MeetingStage.css'


export type SidePanelProps = CommonSidePanelMeetingStageProps;

/**
 * The side panel view.
 */
class SidePanel extends CommonSidePanelMeetingStage {
    render() {
        if (this.state.mounting) 
            return(
                <div className="flex-loading">
                    <Spinner appearance="primary" size="small" label="Loading" />
                </div>
            );

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