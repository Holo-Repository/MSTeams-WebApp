import { useRef, useState } from 'react';
import { IFluidContainer, SharedMap } from 'fluid-framework';
import {
    Button,
    Field,
    Input,
    Spinner,
} from '@fluentui/react-components';
import { ArrowUpload16Regular as Upload } from "@fluentui/react-icons";

import IFloaterObject from '../views/floaters/IFloaterObject';
import useFloaterLoader from '../views/floaters/FloaterLoader';

import commonStyles from "../../styles/CommonSidePanelMeetingStage.module.css";
import styles from "../../styles/ViewerLoader.module.css";


function ViewerLoader(props: {container: IFluidContainer, setParentState: (tool: string) => void}) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [modelId, setModelId] = useState("");

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
    
    async function loadModel() {
        if (!inputRef.current) throw new Error("Input ref not set");

        const model = {
            type: "model",
            pos: { x: -200, y: -150 },
            size: { width: 400, height: 300 },
            modelRotation: { x: 0, y: 0, z: 0 },
            modelId: modelId,
        } as IFloaterObject;
/* ========================================================================================
Due to [#22](https://github.com/jeffreylanters/react-unity-webgl/issues/22) we have to restrict ourselves to max one model displayed at a time. 
This is because when React unloads it deleted the unity canvas, which causes the unity engine to crash.
This is a known issue with Unity WebGL, and there is no official solution yet.
See the code in ModelViewer.tsx for more details on the workaround used.
======================================================================================== */
        // If no model is loaded, load the model with the key "model"
        if (canLoad) {
            loadFloater(model, "model"); 
            props.setParentState("Select")
        }
    }

    // Display a button to load a model
    if (!floaters) return <div className={commonStyles.loading}><Spinner labelPosition="below" label="Connecting..." /></div>;
    
    return <div className={styles.body}>
        <Field
            label="Model ID"
            validationState='none'
            validationMessage={canLoad ? undefined : <div>Close current model to open a new one</div>}
        >
            <div className={styles.fieldBody}>
                <Input 
                    placeholder="E.g. lung1"
                    disabled={!canLoad}
                    ref={inputRef}
                    onChange={(e) => setModelId(e.target.value)}
                />
                <Button icon={<Upload />} appearance='primary' onClick={loadModel} disabled={!canLoad || modelId === ""} />
            </div>
        </Field>
    </div>;
}

export default ViewerLoader;