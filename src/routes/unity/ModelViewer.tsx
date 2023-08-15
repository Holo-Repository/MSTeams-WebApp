import React, { useEffect, forwardRef, useImperativeHandle } from "react";
import { Field, ProgressBar } from "@fluentui/react-components";
import { Unity, useUnityContext } from "react-unity-webgl";
import { UnityInstance } from "react-unity-webgl/declarations/unity-instance";
import { IValueChanged, SharedMap } from "fluid-framework";

import styles from "../../styles/ModelViewer.module.css";

const buildURL = "https://unityviewerbuild.blob.core.windows.net/model-viewer-build/WebGL/WebGL/Build";
const unityModelTarget = "Target Manager";

const ModelViewer = forwardRef((props: { objMap: { [key: string]: any } }, ref) => {
/* ========================================================================================
Due to [#22](https://github.com/jeffreylanters/react-unity-webgl/issues/22) we have to restrict ourselves to max one model displayed at a time. 
This is because when React unloads it deleted the unity canvas, which causes the unity engine to crash.
This is a known issue with Unity WebGL, and there is no official solution yet.

The workaround used here is to move the canvas to a hidden div when unloading, and then move it back when loading.
The code comes from https://github.com/jeffreylanters/react-unity-webgl/issues/22#issuecomment-1416897741
======================================================================================== */
    const [unityInstance, setUnityInstance] = React.useState(undefined as unknown as UnityInstance);
    const [canvasId, setCanvasId] = React.useState(undefined as unknown as string);

    const { 
        unityProvider, 
        UNSAFE__unityInstance, 
        loadingProgression, 
        isLoaded, 
        unload,
        takeScreenshot,
    } = useUnityContext({
        loaderUrl: `${buildURL}/WebGL.loader.js`,
        dataUrl: `${buildURL}/WebGL.data.gz`,
        frameworkUrl: `${buildURL}/WebGL.framework.js.gz`,
        codeUrl: `${buildURL}/WebGL.wasm.gz`,
        webglContextAttributes: {
            preserveDrawingBuffer: true,
        },
    });
    

    
    function downloadBase64Image(base64Data: string, filename: string) {
        const link = document.createElement("a");
        link.href = base64Data;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    function handleClickTakeScreenshot() {
        // Assuming takeScreenshot function returns the image data in 'data' variable
        const data = takeScreenshot("image/png", 1.0);
        
        console.log("data", data);
        if (data !== undefined) {
            downloadBase64Image(data, "screenshot.png");
        } else {
            console.log("Screenshot data is undefined. Unable to download.");
        }
    }
    

    useImperativeHandle(ref, () => ({
        handleClickTakeScreenshot,
    }))

    // Register functions that unity can call
    useEffect(() => {
        if (!isLoaded || !unityInstance) return;
        const globalThis = window as any;
        
        // Load actual model
        const modelURL = props.objMap.get('modelURL');
        if (modelURL) unityInstance.SendMessage(unityModelTarget, "Download3DModel", JSON.stringify({
            url: modelURL,
            rotation: props.objMap.get("modelRotation"),
            scale: props.objMap.get("modelScale"),
        }));
        
        // Register rotation sync
        globalThis.syncCurrentRotation = (x: number, y: number, z: number) => props.objMap.set("modelRotation", {x, y, z});

        // Register scale sync
        globalThis.syncCurrentScale = (x: number, y: number, z: number) => props.objMap.set("modelScale", {x, y, z});

        // Register texture sync
        // globalThis.syncCurrentTexture = (texture: string) => props.objMap.set("texture", {texture});

        const handleChange = (changed: IValueChanged, local: boolean) => {
            if (changed.key === "texture") console.log("texture changed", changed);
            if (local) return;
            if (changed.key === "modelRotation")
                unityInstance.SendMessage(unityModelTarget, "SetRotationJS", JSON.stringify(props.objMap.get(changed.key)));
            if (changed.key === "modelScale")
                unityInstance.SendMessage(unityModelTarget, "SetScaleJS", JSON.stringify(props.objMap.get(changed.key)));
            // if (changed.key === "texture")
            //     unityInstance.SendMessage(unityModelTarget, "SetTextureJS", JSON.stringify(props.objMap.get(changed.key)));
        }
        props.objMap.on("valueChanged", handleChange);

        return () => {
            props.objMap.off("valueChanged", handleChange);
            globalThis.syncCurrentRotation = undefined;
        }
    }, [unityInstance, isLoaded]);





    const observerRef = React.useRef<MutationObserver | null>(null);

    // UNSAFE__unityInstance turns null when unmounting, so we need to hold a reference to it
    // so we can call .Quit()
    React.useEffect(() => {
        if (UNSAFE__unityInstance) {
            setUnityInstance(UNSAFE__unityInstance)
            setCanvasId(UNSAFE__unityInstance.Module.canvas.id)
        }
    }, [UNSAFE__unityInstance])

    // Attach an observer to move the canvas when it's removed. This is a bit dangerous -- the
    // observer doesn't clean itself up until the Unity canvas is removed, so if the removal dodges
    // this observer, it'll stay attached forever.
    React.useEffect(() => {
        // If we've previously added an observer, disconnect it.
        observerRef.current?.disconnect()

        // We don't need to attach an observer if we don't have a Unity instance yet.
        if (!unityInstance) return;

        console.log('Removing canvas', canvasId)
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                for (const removedNode of mutation.removedNodes) {
                    // Look through subtrees of removed nodes for the Unity canvas
                    const canvas = unityInstance.Module.canvas as HTMLCanvasElement
                    if (removedNode.contains(canvas)) {
                        // We found the canvas, so we're done with the observer.
                        observer.disconnect()

                        // Next, hide the canvas and move it elsewhere. The document body will work.
                        canvas.style.display = 'none'
                        document.body.appendChild(canvas)

                        // Clean up the Unity instance. Once finished, remove the canvas from the body.
                        unload()
                            .then(() => {
                                document.body.removeChild(canvas)
                            })
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
    }, [unityInstance])

    return (
        <>
            {!isLoaded && <div className={styles.progressContainer}>
                <Field validationMessage={'Loading Unity Viewer...'} validationState="none" className={styles.progressBar}>
                    <ProgressBar thickness="large" value={loadingProgression} />
                </Field>
            </div>}
            <Unity
                unityProvider={unityProvider}
                style={{ visibility: isLoaded ? "visible" : "hidden" }}
                className={styles.unity}
            />
        </>
    );
});

export default ModelViewer;
