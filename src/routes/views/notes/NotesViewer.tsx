import { SharedMap, SharedString } from "fluid-framework";
import { useEffect, useState } from "react";

import { CollaborativeTextArea } from "./textEditor/CollaborativeTextArea";
import { SharedStringHelper } from "./textEditor/SharedStringHelper";

import styles from "../../../styles/NotesViewer.module.css";
import { makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
    text: {
        fontFamily: tokens.fontFamilyBase,
    },
});

function NotesViewer(props: { objMap: SharedMap }) {
    const [sharedString, setSharedString] = useState<SharedString | undefined>(undefined);
    const textStyles = useStyles();

    useEffect(() => {
        if (!props.objMap) return;
        const textHandle = props.objMap.get('textHandle');
        if (!textHandle) return;
        textHandle.get().then((sharedString: SharedString) => {
            setSharedString(sharedString);
        });
    }, [props.objMap]);

    if (!sharedString) return <div>Loading...</div>;
    return <div className={styles.body}>
        <CollaborativeTextArea sharedStringHelper={new SharedStringHelper(sharedString)} className={styles.textArea} textStyle={textStyles.text} />
    </div>;
}

export default NotesViewer;