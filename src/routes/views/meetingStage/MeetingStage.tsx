import CommonSidePanelMeetingStage, { CommonSidePanelMeetingStageProps } from "../utils/CommonSidePanelMeetingStage";
import ContainerList from '../containerList/ContainerList';
import SharedCanvas from "../canvas/SharedCanvas";
import { Spinner } from "@fluentui/react-components";
import './MeetingStage.css'; 


export type MeetingStageProps = CommonSidePanelMeetingStageProps;

/**
 * The meeting stage view.
 */
class MeetingStage extends CommonSidePanelMeetingStage {
    render() {
        if (this.state.mounting)
            return(
                <div className="flex-loading">
                    <Spinner appearance="primary" size="small" label="Loading" />
                </div>
            );

        if (!this.state.activeContainerId)
            return(
                <div id="meeting-stage">
                    <ContainerList ref={this.contentRef}
                        containerManager={this.props.containerManager} 
                        canOpen={true} 
                        canCreate={true} 
                        openContainer={this.openContainer} 
                        createContainer={this.createContainer}
                        // closeContainer={this.closeContainer}
                    />
                </div>
            );

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