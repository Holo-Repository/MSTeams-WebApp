import { useEffect, useRef, useState } from "react";
import { InkingManager, LiveCanvas } from "@microsoft/live-share-canvas";
import { IFluidContainer, SharedMap } from "fluid-framework";
import { Button, FluentProvider, Spinner, Tooltip, teamsLightTheme } from "@fluentui/react-components";
import { Dismiss24Filled } from "@fluentui/react-icons";

import MyToolBar from "./toolbar/MyToolBar";
import Floater from "../floaters/Floater";
import ContainerManager from "../../containers/ContainerManager";
import { exportImageString } from "../utils/CanvasExport";
import '../../../styles/SharedCanvas.css';


export interface SharedCanvasProps {
    container: string;
    containerManager: ContainerManager;
    closeCanvas: () => Promise<void>;
}

/**
 * The shared canvas component.
 * This component is responsible for setting up the Fluid container and the inking manager.
 * As well as rendering the drawing manager component in the newly created live canvas.
 */
function SharedCanvas(props: SharedCanvasProps) {
    const [container, setContainer] = useState<IFluidContainer>();
    const [inkingManager, setInkingManager] = useState<InkingManager>();
    const [floaterHandles, setFloaterHandles] = useState<SharedMap>();
    const [floatersList, setFloatersList] = useState<{key: string, value: { map: SharedMap, lastEditTime: number }}[]>([]);
    
    const canvasRef = useRef<HTMLDivElement>(null);
    const floaterContainerRef = useRef<HTMLDivElement>(null);
    const fluentProviderRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLDivElement>(null);
    const myToolBarDivRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Connect to the active Fluid container
        props.containerManager.getContainer(props.container).then((containerManager) => {
            setContainer(containerManager.container);
        }).catch((error) => { raiseGlobalError(error); });
    }, [props.containerManager, props.container]);
    
    useEffect(() => {
        if (!container || !canvasRef.current) return;
        
        const liveCanvas = container.initialObjects.liveCanvas as LiveCanvas;
        const inkingManager = new InkingManager(canvasRef.current);
        
        // Begin synchronization for LiveCanvas
        liveCanvas.initialize(inkingManager);
        inkingManager.referencePoint = 'center';
        setInkingManager(inkingManager);
        isPointerSelected(true);
        
        // Loading floaters
        const floaters = container.initialObjects.floaters as SharedMap;

        const handleChange = () => { handleFloaterChange(floaters) };
        floaters.on("valueChanged", handleChange);
        setFloaterHandles(floaters);

        return () => { floaters.off("valueChanged", handleChange) }; // !!
    }, [container, canvasRef]);

    useEffect(() => {
        handleFloaterChange(floaterHandles);
    }, [floaterHandles]);

    const isPointerSelected = (selected: boolean) => {
        if (canvasRef.current) canvasRef.current.style.pointerEvents = selected ? 'none' : 'auto';
    }

    const handleFloaterChange = async (handles?: SharedMap) => {
        if (!handles) return;
        const handleList = [];
        for (const [key, value] of handles.entries()) { 
            try {
                let map = await value.get() as SharedMap;
                handleList.push({ key, value: { map, lastEditTime: map.get('lastEditTime') as number } }) 
            } catch (error: any) { throw raiseGlobalError(error) };
        }
        setFloatersList(handleList);
    }

    const deleteFloater = (key: string) => {
        floaterHandles!.delete(key);
    }
    
    const downloadPNG = async () => {
        if (!inkingManager || !floatersList || !floaterContainerRef.current) return raiseGlobalError(new Error('Canvas not ready'));
        try {
            let imgStr = await exportImageString(floaterContainerRef.current, inkingManager, floatersList);
            const a = document.createElement('a');
            a.href = imgStr;
            a.download = 'canvas.png';
            a.click();
        } catch (error: any) { raiseGlobalError(error) };
    }
    
    const closeCanvas = async () => {
        if (!inkingManager || !floatersList || !floaterContainerRef.current) return raiseGlobalError(new Error('Canvas not ready'));
        try {
            const imgStr = await exportImageString(floaterContainerRef.current, inkingManager, floatersList, true);
            const containerMap = { time: new Date().toISOString(), previewImage: imgStr };
            await props.containerManager.updateContainerProperty(props.container, containerMap);
        } catch (error: any) { raiseGlobalError(error) };
        props.closeCanvas();
    }

    return (
        <FluentProvider id='canvas-background' theme={teamsLightTheme} ref={fluentProviderRef}>
            <div id="canvas-host" ref={canvasRef} />
            {!container && <div className='shared-canvas-loading'><Spinner labelPosition="below" label="Loading..." /></div>}
            {container && <MyToolBar innerDivRef={myToolBarDivRef}  ink={inkingManager} container={container} pointerSelected={isPointerSelected} exportCanvas={downloadPNG}/>}
            <div id='floaters' ref={floaterContainerRef} >
                {floaterHandles && floatersList.map(({key, value}) => {
                    return <Floater 
                        id={`floater-${key}`}
                        key={key} 
                        objMap={value.map}
                        delete={() => {deleteFloater(key)}}
                        inkingManager={inkingManager!}
                    />
                })}
            </div>
            <div ref={closeButtonRef} id="close-button">
                <Tooltip content="Close Collab Case" relationship="label">
                    <Button
                        icon={<Dismiss24Filled color="#424242"/>}
                        onClick={closeCanvas}/>
                </Tooltip>
            </div>
        </FluentProvider>
    );
}

export default SharedCanvas;
