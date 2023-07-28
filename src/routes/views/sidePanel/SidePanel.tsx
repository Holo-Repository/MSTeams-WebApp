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

        if (!this.state.activeContainerId)
            return <ContainerList ref={this.contentRef}
                containerManager={this.props.containerManager} 
                canOpen={true} 
                canCreate={true} 
                openContainer={this.openContainer} 
                createContainer={this.createContainer}
                // closeContainer={this.closeContainer}
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