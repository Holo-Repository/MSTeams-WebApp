import {app, pages} from "@microsoft/teams-js";
import { PiArrowDownThin as Arrow } from "react-icons/pi";
import { Stack } from '@fluentui/react/lib/Stack';
import { Text, typographyStyles, makeStyles } from "@fluentui/react-components";

import styles from "./styles/AppConfig.module.css";

const useStyles = makeStyles({
    text: typographyStyles.title2,
});

/**
 * The 'Config' component is used to display your group tabs
 * user configuration options.  Here you will allow the user to
 * make their choices and once they are done you will need to validate
 * their choices and communicate that to Teams to enable the save button.
 */
function AppConfig() {
    const typo = useStyles();

    // Initialize the Microsoft Teams SDK
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
            <Arrow className={styles.arrow} />
            <Stack className={styles.stack} tokens={{childrenGap:'l2', padding:'l2'}} verticalAlign="center">
                <Stack.Item align="center">
                    <Text className={typo.text}>Nothing to setup</Text>
                </Stack.Item>
                <Stack.Item align="center">
                    <Text className={typo.text}>Press Save and let the ideas flow!</Text>
                </Stack.Item>
            </Stack>
        </div>
    );
}

export default AppConfig;