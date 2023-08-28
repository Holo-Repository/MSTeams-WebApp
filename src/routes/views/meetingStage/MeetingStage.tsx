import CommonSidePanelMeetingStage, { CommonSidePanelMeetingStageProps } from "../utils/CommonSidePanelMeetingStage";
import ContainerList from '../containerList/ContainerList';
import SharedCanvas from "../canvas/SharedCanvas";
import { Spinner } from "@fluentui/react-components";

import '../../../styles/MeetingStage.css'; 
import commonStyles from '../../../styles/CommonSidePanelMeetingStage.module.css';


export type MeetingStageProps = CommonSidePanelMeetingStageProps;

/**
 * The meeting stage view.
 */
class MeetingStage extends CommonSidePanelMeetingStage {
    openContainer(containerId: string): void {
        if (!this.appState) throw raiseGlobalError(new Error('App state not initialized'));
        this.appState.set('activeContainerId', containerId);
    }

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
                        deleteContainer={this.deleteContainer}
                    />
                </div>
            );

        const canvasProps = {
            containerManager: this.props.containerManager,
            container: this.state.activeContainerId,
            closeCanvas: this.closeContainer,
        }

        return (
            <div id="meeting-stage">
                <SharedCanvas {...canvasProps}/>
            </div>
        );
    }
}

export default MeetingStage;