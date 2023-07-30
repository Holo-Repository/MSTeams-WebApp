import CommonSidePanelMeetingStage, { CommonSidePanelMeetingStageProps } from "../utils/CommonSidePanelMeetingStage";
import ContainerList from '../containerList/ContainerList';
import SharedCanvas from "../canvas/SharedCanvas";
import { Spinner } from "@fluentui/react-components";

import commonStyles from '../../../styles/CommonSidePanelMeetingStage.module.css';


export type MeetingStageProps = CommonSidePanelMeetingStageProps;

/**
 * The meeting stage view.
 */
class MeetingStage extends CommonSidePanelMeetingStage {
    render() {
        if (this.state.mounting) return <div className={commonStyles.loading}><Spinner labelPosition="below" label="Connecting..." /></div>;

        if (!this.state.activeContainerId)
            return <ContainerList ref={this.contentRef}
                containerManager={this.props.containerManager} 
                canOpen={true} 
                canCreate={true} 
                openContainer={this.openContainer} 
                createContainer={this.createContainer}
            />;

        const canvasProps = {
            containerManager: this.props.containerManager,
            container: this.state.activeContainerId,
        }

        return (
            <div>
                <button onClick={this.closeContainer}>Close</button>
                <SharedCanvas {...canvasProps}/>
            </div>
        );
    }
}

export default MeetingStage;