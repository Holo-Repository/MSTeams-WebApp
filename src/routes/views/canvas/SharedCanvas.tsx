import { useEffect, useRef, useState } from "react";
import { InkingManager, LiveCanvas } from "@microsoft/live-share-canvas";
import { IFluidHandle } from "@fluidframework/core-interfaces";
import { IFluidContainer, SharedMap } from "fluid-framework";
import { Button, FluentProvider, Spinner, Tooltip, teamsLightTheme } from "@fluentui/react-components";
import { Dismiss24Filled } from "@fluentui/react-icons";
import html2canvas from "html2canvas";

import MyToolBar from "./toolbar/MyToolBar";
import Floater from "../floaters/Floater";
import ContainerManager from "../../containers/ContainerManager";
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
    const [floatersList, setFloatersList] = useState<{key: string, value: IFluidHandle}[]>([]);
    
    const canvasRef = useRef<HTMLDivElement>(null);
    const fluentProviderRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLDivElement>(null);
    const myToolBarDivRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Connect to the active Fluid container
        props.containerManager.getContainer(props.container).then((containerManager) => {
            setContainer(containerManager.container);
        });
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

        const handleChange = () => handleFloaterChange(floaters);
        floaters.on("valueChanged", handleChange);
        setFloaterHandles(floaters);

        return () => {
            floaters!.off("valueChanged", handleChange);
        };
    }, [container, canvasRef]);

    useEffect(() => {
        handleFloaterChange(floaterHandles);
    }, [floaterHandles]);

    const isPointerSelected = (selected: boolean) => {
        if (canvasRef.current) canvasRef.current.style.pointerEvents = selected ? 'none' : 'auto';
    }

    const handleFloaterChange = (handles?: SharedMap) => {
        if (!handles) return;
        const handleList = [];
        for (const [key, value] of handles.entries()) handleList.push({key, value});
        setFloatersList(handleList);
    }

    const deleteFloater = (key: string) => {
        floaterHandles!.delete(key);
    }

    const canvasToDataUrl = async (scale: number = 1) => {
        const fluentProviderElement = fluentProviderRef.current;
        let dataUrl = '';
        if (fluentProviderElement) {
            const ignoredNodes = [myToolBarDivRef.current, closeButtonRef.current];
            const canvas = await html2canvas(fluentProviderElement as HTMLElement, {
                ignoreElements: (node) => {
                    return ignoredNodes.includes(node as HTMLDivElement);
                }, scale: window.devicePixelRatio * scale
            });
            dataUrl = canvas.toDataURL('image/png');
        }
        return dataUrl;
    }
    
    const downloadDataUrlAsPng = (dataUrl: string) => {
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = 'canvas.png';
        a.click();
    }
    
    const exportToPng = async () => {
        const dataUrl = await canvasToDataUrl();
        if (dataUrl) downloadDataUrlAsPng(dataUrl);
    }

    const closeCanvas = async () => {
        let scale = 1; let imgUrl;
        do {
            scale /= 2;
            imgUrl = await canvasToDataUrl(scale);
        } while (imgUrl.length > 30720);
        const containerMap = {time: new Date().toISOString(), previewImage: imgUrl};
        await props.containerManager.updateContainerProperty(props.container, containerMap);
        props.closeCanvas();
    }

    return (
        <FluentProvider id='canvas-background' theme={teamsLightTheme} ref={fluentProviderRef}>
            <div ref={closeButtonRef} id="close-button">
                <Tooltip content="Close Collab Case" relationship="label">
                    <Button
                        icon={<Dismiss24Filled color="#424242"/>}
                        onClick={closeCanvas}/>
                </Tooltip>
            </div>
            <div id="canvas-host" ref={canvasRef} />
            {!container && <div className='shared-canvas-loading'><Spinner labelPosition="below" label="Loading..." /></div>}
            {container && <MyToolBar innerDivRef={myToolBarDivRef}  ink={inkingManager} container={container} pointerSelected={isPointerSelected} exportCanvas={exportToPng}/>}
            <div id='floaters' >
                {floaterHandles && floatersList.map(({key, value}) => {
                    return <Floater 
                        key={key} 
                        handle={value}
                        delete={() => {deleteFloater(key)}}
                        inkingManager={inkingManager!}
                    />
                })}
            </div>
        </FluentProvider>
    );
}

export default SharedCanvas;
