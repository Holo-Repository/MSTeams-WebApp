import React from "react";
import {app, pages} from "@microsoft/teams-js";

/**
 * The 'Config' component is used to display your group tabs
 * user configuration options.  Here you will allow the user to
 * make their choices and once they are done you will need to validate
 * their choices and communicate that to Teams to enable the save button.
 */
class AppConfig extends React.Component {
    render() { // Initialize the Microsoft Teams SDK
        app.initialize().then(() => { /**
            * When the user clicks "Save", save the url for your configured tab.
            * This allows for the addition of query string parameters based on
            * the settings selected by the user.
            */
            pages.config.registerOnSaveHandler((saveEvent) => {
                const baseUrl = `https://${window.location.hostname}:${window.location.port}`;
                pages.config.setConfig({
                    suggestedDisplayName: "HoloRepo",
                    entityId: "Test",
                    contentUrl: baseUrl + "/index.html#/holorepo",
                    websiteUrl: baseUrl + "/index.html#/holorepo"
                }).then(() => {
                    saveEvent.notifySuccess();
                });
            });

            /**
             * After verifying that the settings for your tab are correctly
             * filled in by the user you need to set the state of the dialog
             * to be valid.  This will enable the save button in the configuration
             * dialog.
             */
            pages.config.setValidityState(true);
        });

        return (
            <div>
                <h1>App Configuration</h1>
                <div>
                    This is where you will add your app configuration options the user can choose when the app is added to your meeting.
                </div>
            </div>
        );
    }
}

export default AppConfig;