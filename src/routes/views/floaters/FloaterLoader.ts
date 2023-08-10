import { useMemo } from "react";
import { IFluidContainer, IValueChanged, SharedMap } from "fluid-framework";
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

function useFloaterLoader(options: IFloaterLoader): HookFloaterLoader {
    const floaters = useMemo(() => {
        const f = options.container.initialObjects.floaters as SharedMap;
        if (options.valueChangedCallback) f.on("valueChanged", options.valueChangedCallback);
        return f;
    }, [options.container, options.valueChangedCallback]);

    const loadFloater = async (floater: IFloaterObject, id?: string) => {
        // Generate a dynamic map object
        const floaterMap = await options.container.create(SharedMap);
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
    options.postInitCallback?.(floaters);

    return {
        floaters,
        loadFloater,
    };
}

export default useFloaterLoader;