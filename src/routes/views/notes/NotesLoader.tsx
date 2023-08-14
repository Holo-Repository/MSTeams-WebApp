import { IFluidContainer, SharedString } from 'fluid-framework';
import {
    Button,
    Spinner,
} from '@fluentui/react-components';
import { ArrowUpload16Regular as Upload } from "@fluentui/react-icons";

import IFloaterObject from '../floaters/IFloaterObject';
import useFloaterLoader from '../floaters/FloaterLoader';

import commonStyles from "../../../styles/CommonSidePanelMeetingStage.module.css";
import styles from "../../../styles/NotesLoader.module.css";
import globalTime from '../utils/GlobalTime';


function NotesLoader(props: {container: IFluidContainer, setParentState: (tool: string) => void}) {
    const { floaters, loadFloater } = useFloaterLoader({
        container: props.container,
    });
    
    async function loadNote() {
        const note = {
            type: "note",
            pos: { x: -100, y: -75 },
            size: { width: 200, height: 150 },
            lastEditTime: (await globalTime()).ntpTimeInUTC,
            textHandle: (await props.container.create(SharedString)).handle,
        } as IFloaterObject;
        
        await loadFloater(note); 
        props.setParentState("Select");
    }

    if (!floaters) return <div className={commonStyles.loading}><Spinner labelPosition="below" label="Connecting..." /></div>;
    
    // Display a button to load a note
    return <div className={styles.body}>
        <Button icon={<Upload />} onClick={loadNote} className={styles.button} >New Note</Button>
    </div>;
}

export default NotesLoader;