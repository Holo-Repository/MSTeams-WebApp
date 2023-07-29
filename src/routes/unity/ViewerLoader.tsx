import { useEffect, useState } from 'react';
import { IFluidContainer, SharedMap } from 'fluid-framework';


function ViewerLoader(props: {container: IFluidContainer}) {
    const [floaters, setFloaters] = useState<SharedMap | undefined>(undefined);
    
    // /------/ Code related to issue described later in this file
    const [canLoad, setCanLoad] = useState(false);
    const isLoadEnabled = () => {
        setCanLoad((floaters && floaters.get("model") === undefined) as boolean)
    };
    useEffect(() => {isLoadEnabled()}, [floaters]);
    // /------/ End of code related to issue
    
    useEffect(() => {(async () => {
        // Connect to the active Fluid container
        const floaters = props.container.initialObjects.floaters as SharedMap;
        floaters.on("valueChanged", (changed) => { if (changed.key === "model") isLoadEnabled() });
        setFloaters(floaters);
    })()}, [props]);
    
    async function loadModel() {
        const model = {
            type: "model",
            pos: { x: 0, y: 0 },
        };

        // Generate a dynamic map object
        const floater = await props.container.create(SharedMap);
        // Add the model to the map
        Object.entries(model).forEach(([key, value]) => floater.set(key, value));

/* ========================================================================================
Due to [#22](https://github.com/jeffreylanters/react-unity-webgl/issues/22) we have to restrict ourselves to max one model displayed at a time. 
This is because when React unloads it deleted the unity canvas, which causes the unity engine to crash.
This is a known issue with Unity WebGL, and there is no official solution yet.
See the code in ModelViewer.tsx for more details on the workaround used.

Disabled code that would allow multiple models to be displayed at once:
        let randomId;
        do {
            randomId = Math.floor(Math.random() * 1000000).toString();
        } while (fluidObjects!.floaters.has(randomId));
        fluidObjects!.floaters.set(randomId, floater.handle);
======================================================================================== */

        // If no model is loaded, load the model
        if (canLoad) floaters!.set("model", floater.handle);
    }

    // Display a button to load a model
    if (!floaters) return <p>Loading...</p>;
    if (canLoad) return <button onClick={loadModel}>Load Model</button>;
    else return <p>Another model is already loaded</p>;
}

export default ViewerLoader;