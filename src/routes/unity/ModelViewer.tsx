import { Unity, useUnityContext } from "react-unity-webgl";

const buildURL = "https://unityviewerbuild.blob.core.windows.net/model-viewer/WebGL/Build";

function ModelViewer(props: {objMap: { [key: string]: any }}) {
    const { unityProvider, loadingProgression, isLoaded } = useUnityContext({
        loaderUrl: `${buildURL}/WebGL.loader.js`,
        dataUrl: `${buildURL}/WebGL.data.gz`,
        frameworkUrl: `${buildURL}/WebGL.framework.js.gz`,
        codeUrl: `${buildURL}/WebGL.wasm.gz`,
    });

    return (
        <>
            {!isLoaded && (
                <p>Loading Application... {Math.round(loadingProgression * 100)}%</p>
            )}
            <Unity
                unityProvider={unityProvider}
                style={{ visibility: isLoaded ? "visible" : "hidden" }}
            />
        </>
    );
}

export default ModelViewer;