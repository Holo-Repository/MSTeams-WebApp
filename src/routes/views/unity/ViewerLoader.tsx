import { useRef, useState } from 'react';
import { IFluidContainer, SharedMap } from 'fluid-framework';
import {
    Button,
    Field,
    Input,
    Spinner,
} from '@fluentui/react-components';
import { ArrowUpload16Regular as Upload } from "@fluentui/react-icons";

import IFloaterObject from '../floaters/IFloaterObject';
import useFloaterLoader from '../floaters/FloaterLoader';

import commonStyles from "../../../styles/CommonSidePanelMeetingStage.module.css";
import styles from "../../../styles/ViewerLoader.module.css";


function ViewerLoader(props: {container: IFluidContainer, setParentState: (tool: string) => void}) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [modelURL, setModelURL] = useState("");

    // /------/ Code related to issue described later in this file
    let [canLoad, setCanLoad] = useState(false);
    const checkLoad = (map: SharedMap) => map.get("model") === undefined;
    // /------/ End of code related to issue

    const { floaters, loadFloater } = useFloaterLoader({
        container: props.container,
    // /------/ Code related to issue described later in this file
        valueChangedCallback: (changed, local, target) => { if (changed.key === "model") setCanLoad(checkLoad(target)) },
        postInitCallback: (map) => { canLoad = checkLoad(map) },
    // /------/ End of code related to issue
    });
    
    /**
     * Load a new model in the remote container.
     */
    async function loadModel() {
        if (!inputRef.current) throw new Error("Input ref not set");

        const model = {
            type: "model",
            pos: { x: -200, y: -150 },
            size: { width: 400, height: 300 },
            modelRotation: { x: 0, y: 0, z: 0 },
            modelScale: { x: 0.003, y: 0.003, z: 0.003 },
            modelURL: modelURL,
            modelTexturesHandle: (await props.container.create(SharedMap)).handle,
        } as IFloaterObject;
/* ========================================================================================
Due to [#22](https://github.com/jeffreylanters/react-unity-webgl/issues/22) we have to restrict ourselves to max one model displayed at a time. 
This is because when React unloads it deleted the unity canvas, which causes the unity engine to crash.
This is a known issue with Unity WebGL, and there is no official solution yet.
See the code in ModelViewer.tsx for more details on the workaround used.
======================================================================================== */
        // If no model is loaded, load the model with the key "model"
        if (canLoad) {
            await loadFloater(model, "model"); // Key is fixed so that we can check if a model is loaded
            props.setParentState("Select")
        }
    }

    // Display a button to load a model
    if (!floaters) return <div className={commonStyles.loading}><Spinner labelPosition="below" label="Connecting..." /></div>;
    
    return <div className={styles.body}>
        <Field
            label="Model URL"
            validationState='none'
            validationMessage={canLoad ? undefined : <div>Close current model to open a new one</div>}
        >
            <div className={styles.fieldBody}>
                <Input 
                    placeholder="E.g. https://example.com/model.glb"
                    disabled={!canLoad}
                    ref={inputRef}
                    onChange={(e) => setModelURL(e.target.value)}
                />
                <Button icon={<Upload />} appearance='primary' onClick={loadModel} disabled={!canLoad || modelURL === ""} />
            </div>
        </Field>
    </div>;
}

export default ViewerLoader;