import CommonSidePanelMeetingStage, { CommonSidePanelMeetingStageProps } from "../utils/CommonSidePanelMeetingStage";
import ContainerList from '../containerList/ContainerList';
import SharedCanvas from "../canvas/SharedCanvas";
import { Button, Spinner, Tooltip } from "@fluentui/react-components";
import { Dismiss24Filled } from "@fluentui/react-icons";

import './MeetingStage.css'; 
import commonStyles from '../../../styles/CommonSidePanelMeetingStage.module.css';


export type MeetingStageProps = CommonSidePanelMeetingStageProps;

/**
 * The meeting stage view.
 */
class MeetingStage extends CommonSidePanelMeetingStage {
    render() {
        if (this.state.mounting) return <div className={commonStyles.loading}><Spinner labelPosition="below" label="Connecting..." /></div>;

        if (!this.state.activeContainerId)
            return(
                <div id="stage-container-list">
                    <ContainerList ref={this.contentRef}
                        containerManager={this.props.containerManager}
                        canOpen={true} 
                        canCreate={true} 
                        openContainer={this.openContainer} 
                        createContainer={this.createContainer}
                    />
                </div>
            );

        const canvasProps = {
            containerManager: this.props.containerManager,
            container: this.state.activeContainerId,
        }

        return (
            <div id="meeting-stage">
                <div id="close-button">
                    <Tooltip content="Close Collab Case" relationship="label">
                        <Button
                            icon={<Dismiss24Filled color="#424242"/>}
                            onClick={this.closeContainer}/>
                    </Tooltip>
                </div>
                <SharedCanvas {...canvasProps}/>
            </div>
        );
    }
}

export default MeetingStage;