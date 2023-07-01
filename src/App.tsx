// https://fluentsite.z22.web.core.windows.net/quick-start
import {
    FluentProvider,
    teamsLightTheme,
    teamsDarkTheme,
    teamsHighContrastTheme,
    tokens,
} from "@fluentui/react-components";
import { useEffect } from "react";
import { HashRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import { app } from "@microsoft/teams-js";
import { useTeamsUserCredential } from "@microsoft/teamsfx-react";

import config from "./config";
// import Privacy from "./routes/Privacy";
// import TermsOfUse from "./routes/TermsOfUse";
import HoloRepo from "./routes/HoloRepo";
import AppConfig from "./AppConfig";
import { TeamsFxContext } from "./Context";

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
    useEffect(() => {
        loading &&
            app.initialize().then(() => {
                // Hide the loading indicator.
                app.notifySuccess();
            });
    }, [loading]);

    return (
        <TeamsFxContext.Provider value={{ theme, themeString, teamsUserCredential }}>
            <FluentProvider
                theme={getTheme(themeString)}
                style={{ background: tokens.colorNeutralBackground3 }}
            >
                <Router>
                    {!loading && (
                        <Routes>
                            {/* <Route path="/privacy" element={<Privacy/>} />
                            <Route path="/termsofuse" element={<TermsOfUse/>} /> */}
                            <Route path="/holorepo" element={<HoloRepo/>}/>
                            <Route path="/config" element={<AppConfig/>} />
                            <Route path="*" element={<Navigate to={"/config"}/>}></Route>
                        </Routes>
                    )}
                </Router>
            </FluentProvider>
        </TeamsFxContext.Provider>
    );
}