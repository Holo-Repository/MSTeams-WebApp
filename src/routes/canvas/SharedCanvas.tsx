import React from "react";
import {
    LiveShareClient,
    LivePresence,
    PresenceState,
    UserMeetingRole,
    LivePresenceUser,
} from "@microsoft/live-share";
import { InkingManager, InkingTool, LiveCanvas } from "@microsoft/live-share-canvas";
import { LiveShareHost } from "@microsoft/teams-js";
import { ContainerSchema } from "fluid-framework";

import DrawingManager from "./DrawingManager";
import './SharedCanvas.css';

/**
 * The shared canvas component.
 * This component is responsible for setting up the Fluid container and the inking manager.
 * As well as rendering the drawing manager component in the newly created live  canvas.
 */

// Declare interface for type of custom data for user
interface ICustomUserData {
    picture: string;
    readyToStart: boolean;
}


class SharedCanvas extends React.Component {
    state = {
        inkingManager: undefined as undefined | InkingManager,
        presence: undefined as unknown as LivePresence<ICustomUserData>,
    }

    /**
     * Initializes the Fluid container and the inking manager once the component is mounted.
     */
    async componentDidMount() {
        // This code is taken directly from the live canvas documentation

        // Setup the Fluid container
        const host = LiveShareHost.create();
        const liveShare = new LiveShareClient(host);
        const schema: ContainerSchema = { initialObjects: { liveCanvas: LiveCanvas, presence: LivePresence<ICustomUserData> } };
        const { container } = await liveShare.joinContainer(schema);
        const liveCanvas = container.initialObjects.liveCanvas as LiveCanvas;

        // Get the canvas host element
        const canvasHostElement = document.getElementById("canvas-host");
        const inkingManager = new InkingManager(canvasHostElement!);

        // Begin synchronization for LiveCanvas
        await liveCanvas.initialize(inkingManager);

        
        this.setState({ inkingManager });

        const presence = container.initialObjects.presence as LivePresence<ICustomUserData>;
        console.log('container.initialObjects:', container.initialObjects);
        console.log('presence:', presence);
        presence.on("presenceChanged", (user: LivePresenceUser<ICustomUserData>, local: boolean) => {
            console.log("A user presence changed:")
            console.log("- display name:", user.displayName);
            console.log("- custom data:", user.data);
            console.log("- state:", user.state);
            console.log("- roles", user.roles);
            console.log("- change from local client", local);
            console.log("- change impacts local user", user.isLocalUser);

            this.setState({ presence });
        });

        // Define the initial custom data for the local user (optional).
        const customUserData = {
            picture: "DEFAULT_PROFILE_PICTURE_URL",
            readyToStart: false,
        };
        // Start receiving incoming presence updates from the session.
        // This will also broadcast the user's `customUserData` to others in the session.
        await presence.initialize(customUserData);

        // Send a presence update, in this case once a user is ready to start an activity.
        // If using role verification, this will throw an error if the user doesn't have the required role.
        await presence.update({
            ...customUserData,
            readyToStart: true,
        });

        

    }

    componentDidUpdate(prevProps: any, prevState: any) {
        const { inkingManager: ink, presence } = this.state;
        const roles = presence?.localUser?.roles;
        
        // Check if roles array contains presenter, organizer, or attendee
        const showDrawingManager = roles?.includes(UserMeetingRole.presenter) || 
                                   roles?.includes(UserMeetingRole.organizer) || 
                                   roles?.includes(UserMeetingRole.attendee);
        
        // Check if the showDrawingManager has changed
        if (showDrawingManager !== prevState.showDrawingManager) {
            if (showDrawingManager) {
                // Reactivate the inkingManager if showDrawingManager is true
                ink?.activate();
            } else {
                // Deactivate the inkingManager if showDrawingManager is false
                ink?.deactivate();
            }
        }
    }

    //This function check the current user role, return true if user have the right to modify the canvas
    //(presenter, organizer). If not, return false.
    canShowDrawingManager = () => {
        const {  presence } = this.state;
        const roles = presence?.localUser?.roles;
    
        const showDrawingManager = roles?.includes(UserMeetingRole.presenter) || 
                                             roles?.includes(UserMeetingRole.organizer);
    
        return showDrawingManager;
    }
    
    

    saveCurrent = () => {
        const { presence } = this.state;
        if (presence) {
            console.log(presence.localUser?.roles);
        } else {
            console.log('Presence is not defined');
        }
    }

    render(): React.ReactNode {
        const { inkingManager: ink, presence } = this.state;
        const roles = presence?.localUser?.roles;
        
        // Check if roles array contains presenter, organizer, or attendee
        const showDrawingManager = roles?.includes(UserMeetingRole.presenter) || 
                                   roles?.includes(UserMeetingRole.organizer) || 
                                   roles?.includes(UserMeetingRole.attendee);

        
        return (
            <div>
                <button onClick={this.saveCurrent}>Test</button>
                <div id="canvas-host"
                    style={{ width: "100vw", height: "90vh", border: "1px solid black", backgroundColor: "white", zIndex: 1 }}>
                    {showDrawingManager && <div className="drawing-manager">{ink && <DrawingManager inkingManager={ink} />}</div>}
                </div>
            </div>
        );
    }
    
}

export default SharedCanvas;
