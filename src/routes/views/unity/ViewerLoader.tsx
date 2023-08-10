import { useEffect, useState } from 'react';
import { IFluidContainer, SharedMap } from 'fluid-framework';
import IFloaterObject from '../floaters/IFloaterObject';

import useFloaterLoader from '../floaters/FloaterLoader';


function ViewerLoader(props: {container: IFluidContainer}) {
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
        const model = {
            type: "model",
            pos: { x: 0, y: 0 },
            size: { width: 100, height: 50 },
        } as IFloaterObject;
/* ========================================================================================
Due to [#22](https://github.com/jeffreylanters/react-unity-webgl/issues/22) we have to restrict ourselves to max one model displayed at a time. 
This is because when React unloads it deleted the unity canvas, which causes the unity engine to crash.
This is a known issue with Unity WebGL, and there is no official solution yet.
See the code in ModelViewer.tsx for more details on the workaround used.
======================================================================================== */
        // If no model is loaded, load the model with the key "model"
        if (canLoad) loadFloater(model, "model");
    }

    // Display a button to load a model
    if (!floaters) return <p>Loading...</p>;
    if (canLoad) return <button onClick={loadModel}>Load Model</button>;
    else return <p>Can load: {JSON.stringify(canLoad)}</p>;
}

export default ViewerLoader;