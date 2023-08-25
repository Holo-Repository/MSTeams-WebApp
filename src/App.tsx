// https://fluentsite.z22.web.core.windows.net/quick-start
import {
    FluentProvider,
    teamsLightTheme,
    teamsDarkTheme,
    teamsHighContrastTheme,
    tokens,
    Text,
} from "@fluentui/react-components";
import { useEffect, useMemo, useRef, useState } from "react";
import { HashRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import { app } from "@microsoft/teams-js";
import { useTeamsUserCredential } from "@microsoft/teamsfx-react";

import {
    Dialog,
    DialogSurface,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogTrigger,
    DialogBody,
    Button,
    useRestoreFocusTarget,
} from "@fluentui/react-components";

import config from "./config";
// import Privacy from "./routes/Privacy";
// import TermsOfUse from "./routes/TermsOfUse";
import HoloCollab from "./routes/HoloCollab";
import AppConfig from "./AppConfig";
import { TeamsFxContext } from "./Context";
import Fuse from "./routes/views/utils/Fuse";

function getTheme(themeString: string) {
    switch (themeString) {
        case "dark":
            return teamsDarkTheme;
        case "contrast":
            return teamsHighContrastTheme;
        default:
            return {...teamsLightTheme, colorNeutralBackground3: "#eeeeee"};
    }
}

/**
 * The main app which handles the initialization and routing
 * of the app.
 */
export default function App() {
    const { loading, theme, themeString, teamsUserCredential } = useTeamsUserCredential({
        initiateLoginEndpoint: config.initiateLoginEndpoint!,
        clientId: config.clientId!,
    });

    const queryParams = new URLSearchParams(window.location.search);
    const containerID = queryParams.get("containerID");
    const containerFuse = useMemo(() => { return containerID ? new Fuse(containerID) : undefined }, [containerID]);


    const globalError = useRef<Error | undefined>(undefined);
    const [open, setOpen] = useState(false);
    const restoreFocusTargetAttribute = useRestoreFocusTarget();

    globalThis.raiseGlobalError = (error: Error) => {
        globalError.current = error;
        setOpen(true);
        return error;
    };
    
    useEffect(() => {
        loading &&
            app.initialize().then(() => {
                // Hide the loading indicator.
                app.notifySuccess();
            });
    }, [loading]);

    const teamsFxContextValue = useMemo(() => ({ theme, themeString, teamsUserCredential }), [theme, themeString, teamsUserCredential]);

    return (
        <TeamsFxContext.Provider value={teamsFxContextValue}>
            <FluentProvider
                theme={getTheme(themeString)}
                style={{ background: tokens.colorNeutralBackground3 }}
            >
                <Router>
                    {!loading && (
                        <Routes {...restoreFocusTargetAttribute}>
                            {/* <Route path="/privacy" element={<Privacy/>} />
                            <Route path="/termsofuse" element={<TermsOfUse/>} /> */}
                            <Route path="/holocollab" element={<HoloCollab containerFuse={containerFuse} />}/>
                            <Route path="/config" element={<AppConfig/>}/>
                            <Route path="*" element={<Navigate to={"/holocollab"}/>}></Route>
                        </Routes>
                    )}
                </Router>
                <Dialog open={open} onOpenChange={(event, data) => { setOpen(data.open) }} >
                    <DialogSurface>
                        <DialogBody>
                            <DialogTitle>Error Occurred</DialogTitle>
                            <DialogContent>
                                <Text>An unknown error occurred, please retry...</Text><br/><br/>
                                <Text>{globalError.current?.stack}</Text>
                            </DialogContent>
                            <DialogActions>
                                <DialogTrigger disableButtonEnhancement>
                                    <Button appearance="secondary">Close</Button>
                                </DialogTrigger>
                            </DialogActions>
                        </DialogBody>
                    </DialogSurface>
                </Dialog>
            </FluentProvider>
        </TeamsFxContext.Provider>
    );
}