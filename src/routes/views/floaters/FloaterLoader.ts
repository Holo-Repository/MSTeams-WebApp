import { useEffect, useMemo } from "react";
import { IFluidContainer, IValueChanged, SharedMap } from "fluid-framework";
import { v4 as uuidv4 } from "uuid";

import IFloaterObject, { FloaterKeys } from "./IFloater";
import globalTime from "../utils/GlobalTime";


/**
 * Options of the useFloaterLoader hook.
 * @property container - The container to load the floaters into.
 * @property valueChangedCallback - A callback to be called when a value changes in the floaters map.
 * @property postInitCallback - A callback to be called after the hook is initialized.
 * 
 * @warning The valueChangedCallback and postInitCallback should not usually be needed as they are mostly a hack for the model loader, because there can only be one instance of it.
 * @warning The valueChangedCallback should not trigger a re-render as it will cause an infinite loop.
 */
export interface IFloaterLoader {
    container: IFluidContainer;
    valueChangedCallback?: (changed: IValueChanged, local: boolean, target: SharedMap) => void;
    postInitCallback?: (floaters: SharedMap) => void;
}

export type HookFloaterLoader = {
    floaters: SharedMap;
    loadFloater: (floater: IFloaterObject, id?: string) => Promise<void>;
};

/**
 * A hook to load floaters into a container.
 * It handles all the boilerplate of creating a SharedMap and adding it to the container.
 * It can also generate a random id for the floater if none is provided.
 * @param options - The options for the hook
 * @returns The floaters map and a function to load a floater.
 */
function useFloaterLoader(options: IFloaterLoader): HookFloaterLoader {
    const floaters = useMemo(() => {
        return options.container.initialObjects.floaters as SharedMap;
    }, [options.container]);

    /**
     * Register the valueChangedCallback if provided.
     */
    useEffect(() => {
        if (options.valueChangedCallback) floaters.on("valueChanged", options.valueChangedCallback);
        return () => { if (options.valueChangedCallback) floaters.off("valueChanged", options.valueChangedCallback) };
    }, [floaters, options.valueChangedCallback]);

    /**
     * Load a floater object into the remote container.
     * @param floater - The floater object to load
     * @param id - The id of the floater. If none is provided, a random id will be generated.
     */
    const loadFloater = async (floater: IFloaterObject, id?: string) => {
        try {
            // Generate a dynamic map object
            const floaterMap = await options.container.create(SharedMap);
            // Add the model to the map
            Object.entries(floater).forEach(([key, value]) => floaterMap.set(key, value));
            floaterMap.set(FloaterKeys.lastEditTime, (await globalTime()).ntpTimeInUTC);
            // Generate a random id if none is provided
            let randomId = id || uuidv4();
            // Add the map to the container
            floaters.set(randomId, floaterMap.handle);
        } catch (error: any) { raiseGlobalError(error) };
    }

    // Never trigger a re-render in the callback
    try { options.postInitCallback?.(floaters) } catch (error: any) { raiseGlobalError(error) };

    return {
        floaters,
        loadFloater,
    };
}

export default useFloaterLoader;