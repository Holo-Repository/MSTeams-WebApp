import CommonSidePanelMeetingStage, { CommonSidePanelMeetingStageProps } from "../utils/CommonSidePanelMeetingStage";
import ContainerList from '../containerList/ContainerList';
import { Spinner } from "@fluentui/react-components";

import commonStyles from '../../../styles/CommonSidePanelMeetingStage.module.css';


export type SidePanelProps = CommonSidePanelMeetingStageProps;

/**
 * The side panel view.
 */
class SidePanel extends CommonSidePanelMeetingStage {
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

        return (
            <div>
                <button onClick={this.closeContainer}>Close</button>
                Active Container: {this.state.activeContainerId}
            </div>
        );
    }
}

export default SidePanel;