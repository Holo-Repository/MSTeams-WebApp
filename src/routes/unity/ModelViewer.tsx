import React, { useEffect } from "react";
import { Field, ProgressBar } from "@fluentui/react-components";
import { Unity, useUnityContext } from "react-unity-webgl";
import { UnityInstance } from "react-unity-webgl/declarations/unity-instance";
import { IValueChanged, SharedMap } from "fluid-framework";

import styles from "../../styles/ModelViewer.module.css";


const buildURL = "https://unityviewerbuild.blob.core.windows.net/model-viewer-build/WebGL/WebGL/Build";

function ModelViewer(props: {objMap: SharedMap}) {
/* ========================================================================================
Due to [#22](https://github.com/jeffreylanters/react-unity-webgl/issues/22) we have to restrict ourselves to max one model displayed at a time. 
This is because when React unloads it deleted the unity canvas, which causes the unity engine to crash.
This is a known issue with Unity WebGL, and there is no official solution yet.

The workaround used here is to move the canvas to a hidden div when unloading, and then move it back when loading.
The code comes from https://github.com/jeffreylanters/react-unity-webgl/issues/22#issuecomment-1416897741
======================================================================================== */
    const [unityInstance, setUnityInstance] = React.useState(undefined as unknown as UnityInstance);
    const [canvasId, setCanvasId] = React.useState(undefined as unknown as string);

    const { unityProvider, UNSAFE__unityInstance, loadingProgression, isLoaded, unload } = useUnityContext({
        loaderUrl: `${buildURL}/WebGL.loader.js`,
        dataUrl: `${buildURL}/WebGL.data.gz`,
        frameworkUrl: `${buildURL}/WebGL.framework.js.gz`,
        codeUrl: `${buildURL}/WebGL.wasm.gz`,
    });
    
    // Register functions that unity can call
    useEffect(() => {
        if (!isLoaded || !unityInstance) return;
        const globalThis = window as any;
        
        // Register rotation sync
        globalThis.syncCurrentRotation = (x: number, y: number, z: number) => {
            props.objMap.set("modelRotation", {x, y, z});
        }
        // Sync initial rotation
        unityInstance.SendMessage("Target Manager", "SetRotationJS", JSON.stringify(props.objMap.get('modelRotation')));

        const handleChange = (changed: IValueChanged, local: boolean) => {
            if (local) return;
            if (changed.key === "modelRotation") {
                const rotation = props.objMap.get('modelRotation') as { x: number, y: number, z: number };
                unityInstance.SendMessage("Target Manager", "SetRotationJS", JSON.stringify(rotation));
            }
        }
        props.objMap.on("valueChanged", handleChange);

        return () => {
            globalThis.syncCurrentRotation = undefined;
            props.objMap.off("valueChanged", handleChange);
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
}

export default ModelViewer;