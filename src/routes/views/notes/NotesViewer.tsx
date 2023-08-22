import { useEffect, useState } from "react";
import { SharedMap, SharedString } from "fluid-framework";
import { makeStyles, tokens } from '@fluentui/react-components';

import { CollaborativeTextArea } from "./textEditor/CollaborativeTextArea";
import { SharedStringHelper } from "./textEditor/SharedStringHelper";
import { NoteKeys } from "./INote";

import styles from "../../../styles/NotesViewer.module.css";


const useStyles = makeStyles({ text: { fontFamily: tokens.fontFamilyBase } });


/**
 * Display a collaborative note.
 */
function NotesViewer(props: { objMap: SharedMap }) {
    const [sharedStringHelper, setSharedStringHelper] = useState<SharedStringHelper>();
    const textStyles = useStyles();

    /**
     * Load the SharedStringHelper when the SharedMap is available.
     * Dispose of the SharedStringHelper when the component unloads.
     */
    useEffect(() => {
        if (!props.objMap) return;
        const textHandle = props.objMap.get(NoteKeys.textHandle);
        if (!textHandle) return;
        textHandle.get().then((sharedString: SharedString) => {
            const sharedStringHelper = new SharedStringHelper(sharedString);
            setSharedStringHelper(sharedStringHelper);
        });
        return () => { sharedStringHelper?.dispose() };
    }, [props.objMap, sharedStringHelper]);

    if (!sharedStringHelper) return <div>Loading...</div>;
    return <div className={styles.body}>
        <CollaborativeTextArea sharedStringHelper={sharedStringHelper} className={styles.textArea} textStyle={textStyles.text} />
    </div>;
}

export default NotesViewer;