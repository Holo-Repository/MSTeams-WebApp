import CommonSidePanelMeetingStage, { CommonSidePanelMeetingStageProps } from "../utils/CommonSidePanelMeetingStage";
import Content from '../content/Content';


export type SidePanelProps = CommonSidePanelMeetingStageProps;

class SidePanel extends CommonSidePanelMeetingStage {
    render() {
        if (this.state.mounting) return <div>Loading...</div>;

        if (!this.state.activeContainerId)
            return <Content ref={this.contentRef}
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