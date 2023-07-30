import { useCallback, useMemo } from "react";
import { IFluidContainer, ISharedMapEvents, IValueChanged, SharedMap } from "fluid-framework";
import IFloaterObject from "./IFloaterObject";


export interface IFloaterLoader {
    container: IFluidContainer;
    valueChangedCallback?: (changed: IValueChanged, local: boolean, target: SharedMap) => void;
    postInitCallback?: (floaters: SharedMap) => void;
}

export type HookFloaterLoader = {
    floaters: SharedMap;
    loadFloater: (floater: IFloaterObject, id?: string) => Promise<void>;
};


function useFloaterLoader(props: IFloaterLoader): HookFloaterLoader {
    const floaters = useMemo(() => {
        const f = props.container.initialObjects.floaters as SharedMap;
        if (props.valueChangedCallback) f.on("valueChanged", props.valueChangedCallback);
        return f;
    }, [props.container]);

    const loadFloater = async (floater: IFloaterObject, id?: string) => {
        // Generate a dynamic map object
        const floaterMap = await props.container.create(SharedMap);
        // Add the model to the map
        Object.entries(floater).forEach(([key, value]) => floaterMap.set(key, value));
        // Generate a random id if none is provided
        let randomId = id;
        while (!randomId || floaters.has(randomId)) 
            randomId = Math.floor(Math.random() * 1000000).toString();
        // Add the map to the container
        floaters.set(randomId, floaterMap.handle);
    }

    // Never trigger a re-render in the callback
    props.postInitCallback?.(floaters);

    return {
        floaters,
        loadFloater,
    };
}

export default useFloaterLoader;