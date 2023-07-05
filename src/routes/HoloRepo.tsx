import React from "react";
import { app } from "@microsoft/teams-js";

import SharedCanvas from "./canvas/SharedCanvas";

class HoloRepo extends React.Component {
    state = {
        // Expected values: "default", "content", "sidePanel", "meetingStage"
        view: "default",
    };

    async componentDidMount() {
        const context = await app.getContext();
        this.setState({ view: context.page.frameContext });
    }

    render() {
        const { view } = this.state;
        return (
            <div>
                {view === "default" && "Default view"}
                {view === "content" && "Content view"}
                {view === "sidePanel" && "Side panel view"}
                {view === "meetingStage" && <SharedCanvas/>}
            </div>
        );
    }
}

export default HoloRepo;
