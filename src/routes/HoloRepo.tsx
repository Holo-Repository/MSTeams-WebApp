import React from "react";
import { app } from "@microsoft/teams-js";

import SharedCanvas from "./canvas/SharedCanvas";


/**
 * The HoloRepo component.
 * This component is responsible for rendering the correct view based on the context.
 * It is the main component of the app and holds all the reactive logic.
 * 
 * The view is determined by the context.page.frameContext value served by the Teams SDK.
 */
class HoloRepo extends React.Component {
    state = {
        // Expected values: "default", "content", "sidePanel", "meetingStage"
        // Represents the current view where the app is running.
        // Don't forget that multiple views can be running at the same time.
        view: "default",
    };

    async componentDidMount() {
        const context = await app.getContext();
        this.setState({ view: context.page.frameContext });
    }

    render() {
        const { view } = this.state;
        return (
            // This is a simple conditional rendering based on the view state.
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
