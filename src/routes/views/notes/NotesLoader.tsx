import { IFluidContainer, SharedString } from 'fluid-framework';
import {
    Button,
    Spinner,
} from '@fluentui/react-components';
import { ArrowUpload16Regular as Upload } from "@fluentui/react-icons";

import IFloaterObject from '../floaters/IFloater';
import useFloaterLoader from '../floaters/FloaterLoader';

import commonStyles from "../../../styles/CommonSidePanelMeetingStage.module.css";
import styles from "../../../styles/NotesLoader.module.css";


/**
 * Display a button to load a collaborative note.
 */
function NotesLoader(props: {container: IFluidContainer, setParentState: (tool: string) => void}) {
    const { floaters, loadFloater } = useFloaterLoader({
        container: props.container,
    });
    
    /**
     * Load a new note in the remote container.
     */
    async function loadNote() {
        const note = {
            type: "note",
            pos: { x: -100, y: -75 },
            size: { width: 200, height: 150 },
            // Create a new SharedString for the note and only store its handle in the remote container
            textHandle: (await props.container.create(SharedString)).handle,
        } as IFloaterObject;
        
        await loadFloater(note); 
        props.setParentState("Select"); // Deselect the note loader
    }

    if (!floaters) return <div className={commonStyles.loading}><Spinner labelPosition="below" label="Connecting..." /></div>;
    
    // Display a button to load a note
    return <div className={styles.body}>
        <Button icon={<Upload />} onClick={loadNote} className={styles.button} >New Note</Button>
    </div>;
}

export default NotesLoader;