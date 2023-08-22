import { useEffect, forwardRef, useImperativeHandle, useState, useRef } from "react";
import { Field, ProgressBar } from "@fluentui/react-components";
import { Unity, useUnityContext } from "react-unity-webgl";
import { UnityInstance } from "react-unity-webgl/declarations/unity-instance";
import { IValueChanged, SharedMap } from "fluid-framework";
import { throttle } from 'lodash';

import styles from "../../../styles/ModelViewer.module.css";

const buildURL = "https://unityviewerbuild.blob.core.windows.net/model-viewer-build/WebGL/WebGL/Build";
const unityModelTarget = "Target Manager";

const throttleTime = 100;

const ModelViewer = forwardRef((props: { objMap: SharedMap }, ref) => {
/* ========================================================================================
Due to [#22](https://github.com/jeffreylanters/react-unity-webgl/issues/22) we have to restrict ourselves to max one model displayed at a time. 
This is because when React unloads it deleted the unity canvas, which causes the unity engine to crash.
This is a known issue with Unity WebGL, and there is no official solution yet.

The workaround used here is to move the canvas to a hidden div when unloading, and then move it back when loading.
The code comes from https://github.com/jeffreylanters/react-unity-webgl/issues/22#issuecomment-1416897741
======================================================================================== */
    const [unityInstance, setUnityInstance] = useState(undefined as unknown as UnityInstance);
    const [canvasId, setCanvasId] = useState(undefined as unknown as string);
    const [devicePixelRatio, setDevicePixelRatio] = useState(window.devicePixelRatio);
    const [texturesMap, setTexturesMap] = useState(undefined as unknown as SharedMap);
    const [modelLoaded, setModelLoaded] = useState(false);

    const { unityProvider, UNSAFE__unityInstance, loadingProgression, isLoaded: unityLoaded, unload, takeScreenshot } = useUnityContext({
        loaderUrl: `${buildURL}/WebGL.loader.js`,
        dataUrl: `${buildURL}/WebGL.data.gz`,
        frameworkUrl: `${buildURL}/WebGL.framework.js.gz`,
        codeUrl: `${buildURL}/WebGL.wasm.gz`,
        webglContextAttributes: { preserveDrawingBuffer: true },
    });

    /**
     * Load the SharedMap containing the textures.
     * It is a mapping from volume name to base64 encoded texture.
     * This could probably be improved by storing the strokes instead of the image.
     */
    useEffect(() => {
        props.objMap.get('modelTexturesHandle').get().then(setTexturesMap);
    }, [props.objMap]);


    /**
     * Register functions that unity can call
     */
    useEffect(() => {
        if (!texturesMap) return;
        // Register rotation sync
        (window as any).syncCurrentRotation = throttle((x: number, y: number, z: number) => {
            props.objMap.set("modelRotation", {x, y, z})
        }, throttleTime, { leading: true, trailing: true });

        // Register scale sync
        (window as any).syncCurrentScale = throttle((x: number, y: number, z: number) => {
            props.objMap.set("modelScale", {x, y, z});
        }, throttleTime, { leading: true, trailing: true });

        // Register texture sync
        (window as any).syncCurrentTexture = throttle((name: string, texture: string) => {
            texturesMap.set(name, texture);
        }, throttleTime, { leading: true, trailing: true });

        // Register model loaded
        (window as any).signalDownloadedModel = () => { 
            console.log('model loaded')
            setModelLoaded(true) 
        };

        return () => {
            (window as any).syncCurrentRotation = undefined;
            (window as any).syncCurrentScale = undefined;
            (window as any).syncCurrentTexture = undefined;
            (window as any).signalDownloadedModel = undefined;
        }
    }, [props.objMap, texturesMap]);



    /**
     * Signal Unity to download the 3D model from the direct URL.
     */
    useEffect(() => {
        if (!unityInstance || !texturesMap) return;
        const modelURL = props.objMap.get('modelURL');
        const rotation = props.objMap.get("modelRotation");
        const scale = props.objMap.get("modelScale").x;
        console.log('loading model', modelURL, rotation, scale)
        unityInstance.SendMessage(unityModelTarget, "Download3DModel", JSON.stringify({
            url: modelURL,
            rotation,
            scale
        }));
    }, [unityInstance, props.objMap, texturesMap]);


    /**
     * Once the model has loaded update the rotation and scale.
     * There is a 2 sec delay to allow the loaded model to be mounted properly.
     * During testing we could not find a reliable way to detect when the model has been mounted in the Unity scene
     * and 2 seconds of delay seemed to be a good compromise that works.
     */
    useEffect(() => {
        if (!unityInstance || !modelLoaded) return;
        const timeoutID = setTimeout(() => {
            const rotation = props.objMap.get("modelRotation");
            const scale = props.objMap.get("modelScale");
            unityInstance.SendMessage(unityModelTarget, "SetRotationJS", JSON.stringify(rotation));
            unityInstance.SendMessage(unityModelTarget, "SetScaleJS", JSON.stringify(scale));
        }, 2000);
        return () => { clearTimeout(timeoutID) };
    }, [unityInstance, props.objMap, modelLoaded]);


    /**
     * Register Fluid event handlers to sync model rotation, scale, etc...
     */
    useEffect(() => {
        if (!unityInstance || !texturesMap || !modelLoaded) return;
        const handleChange = (changed: IValueChanged, local: boolean) => {           
            if (local) return;
            if (changed.key === "modelRotation")
                unityInstance.SendMessage(unityModelTarget, "SetRotationJS", JSON.stringify(props.objMap.get(changed.key)));
            if (changed.key === "modelScale")
                unityInstance.SendMessage(unityModelTarget, "SetScaleJS", JSON.stringify(props.objMap.get(changed.key)));
        }
        props.objMap.on("valueChanged", handleChange);

        const handleTextureChange = (changed: IValueChanged, local: boolean) => {
            if (!local) unityInstance.SendMessage(changed.key, "SetTextureJS", JSON.stringify({texture: texturesMap.get(changed.key)}));
        }
        texturesMap.on("valueChanged", handleTextureChange);

        
        /**
         * Set initial texture values
         * There is a 2 sec delay to allow the loaded model to be mounted properly.
         */
        const timeoutID = setTimeout(() => {
            for (const [key, value] of texturesMap.entries()) {
                unityInstance.SendMessage(key, "SetTextureJS", JSON.stringify({texture: value}));
            }
        }, 2000);

        return () => {
            props.objMap.off("valueChanged", handleChange);
            texturesMap.off("valueChanged", handleTextureChange);
            clearTimeout(timeoutID);
        }
    }, [props.objMap, texturesMap, unityInstance, modelLoaded]);





    const observerRef = useRef<MutationObserver | null>(null);
    // UNSAFE__unityInstance turns null when unmounting, so we need to hold a reference to it
    // so we can call .Quit()
    useEffect(() => {
        if (UNSAFE__unityInstance) {
            setUnityInstance(UNSAFE__unityInstance)
            setCanvasId(UNSAFE__unityInstance.Module.canvas.id)
        }
    }, [UNSAFE__unityInstance])

    // Attach an observer to move the canvas when it's removed. This is a bit dangerous -- the
    // observer doesn't clean itself up until the Unity canvas is removed, so if the removal dodges
    // this observer, it'll stay attached forever.
    useEffect(() => {
        try {
            // If we've previously added an observer, disconnect it.
            observerRef.current?.disconnect()

            // We don't need to attach an observer if we don't have a Unity instance yet.
            if (!unityInstance) return;

            const observer = new MutationObserver((mutationsList) => {
                for (const mutation of mutationsList) {
                    for (const removedNode of mutation.removedNodes) {
                        // Look through subtrees of removed nodes for the Unity canvas
                        const canvas = unityInstance.Module.canvas as HTMLCanvasElement
                        if (removedNode.contains(canvas)) {
                            console.log('Removing canvas', canvasId)
                            // We found the canvas, so we're done with the observer.
                            observer.disconnect()

                            // Next, hide the canvas and move it elsewhere. The document body will work.
                            canvas.style.display = 'none'
                            document.body.appendChild(canvas)

                            // Clean up the Unity instance. Once finished, remove the canvas from the body.
                            unload()
                                .then(() => { document.body.removeChild(canvas) })
                                .catch((e: any) => {console.error(e)})
                        }
                    }
                }
            })

            // When switching pages, the removed node will be close to the DOM root, so it's safest to observe
            // the whole body. However, it's more performance-intensive.
            observer.observe(document.body, { subtree: true, childList: true })

            // Set the observer ref to the observer so it's cleaned up if the effect runs again.
            return () => {observerRef.current = observer}
        } catch (e: any) { raiseGlobalError(e) }
    }, [unityInstance, canvasId, unload])


    useEffect(() => {
        // A function which will update the device pixel ratio of the Unity
        // Application to match the device pixel ratio of the browser.
        const updateDevicePixelRatio = function () {
            setDevicePixelRatio(window.devicePixelRatio);
        };
        // A media matcher which watches for changes in the device pixel ratio.
        const mediaMatcher = window.matchMedia(
            `screen and (resolution: ${devicePixelRatio}dppx)`
        );
        // Adding an event listener to the media matcher which will update the
        // device pixel ratio of the Unity Application when the device pixel
        // ratio changes.
        mediaMatcher.addEventListener("change", updateDevicePixelRatio);
        return function () {
            // Removing the event listener when the component unmounts.
            mediaMatcher.removeEventListener("change", updateDevicePixelRatio);
        };
    }, [devicePixelRatio]);





    /**
     * Download a screenshot of the Unity scene.
     * @param base64Data - The base64 encoded image data.
     * @param filename - The name of the file that will be downloaded.
     */
    function downloadBase64Image(base64Data: string, filename: string) {
        const link = document.createElement("a");
        link.href = base64Data;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    /**
     * Take a screenshot of the Unity scene and download it.
     */
    function handleClickTakeScreenshot() {
        unityInstance.SendMessage(unityModelTarget, "ToggleUI");

        // Assuming takeScreenshot function returns the image data in 'data' variable
        const data = takeScreenshot("image/png", 1.0);
        
        if (data !== undefined) downloadBase64Image(data, "screenshot.png");
        else raiseGlobalError(new Error("Screenshot data is undefined. Unable to download."));

        unityInstance.SendMessage(unityModelTarget, "ToggleUI");
    }
    
    useImperativeHandle(ref, () => ({
        handleClickTakeScreenshot,
    }))







    return (
        <>
            {!unityLoaded && <div className={styles.progressContainer}>
                <Field validationMessage={'Loading Unity Viewer...'} validationState="none" className={styles.progressBar}>
                    <ProgressBar thickness="large" value={loadingProgression} />
                </Field>
            </div>}
            <Unity
                unityProvider={unityProvider}
                devicePixelRatio={devicePixelRatio}
                style={{ visibility: unityLoaded ? "visible" : "hidden" }}
                className={styles.unity}
            />
        </>
    );
});

export default ModelViewer;
