import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Text, Tooltip } from "@fluentui/react-components";
import { InkingManager } from "@microsoft/live-share-canvas";
import { getTheme } from '@fluentui/react';
import { IValueChanged, SharedMap } from "fluid-framework";
import { throttle } from 'lodash';

import ModelViewer from "../unity/ModelViewer";
import styles from "../../../styles/Floater.module.css";
import FloaterInteraction from "./FloaterInteraction";
import {
    FloaterAppSize,
    FloaterScreenSize,
    FloaterAppCoords,
    appToScreenPos,
    appToScreenSize,
    screenToAppPos,
    screenToAppSize,
    FloaterScreenCoords,
} from '../utils/FloaterUtils';
import FileViewer from "../fileSharing/FileViewer";
import globalTime from "../utils/GlobalTime";
import { AcceptedFloaterType } from "./IFloater";
import NotesViewer from "../notes/NotesViewer";
import { FloaterKeys } from "./IFloater";


const theme = getTheme();
const throttleTime = 100;
/**
 * Update the remote position state.
 * The function is throttled because UI interactions fire way too many events.
 * @param dataMap - The remote data map.
 * @param pos - The new position.
 */
const setDMPos = throttle((dataMap, pos: FloaterAppCoords) => {
    if (!dataMap) return;
    dataMap.set(FloaterKeys.pos, pos);
}, throttleTime, { leading: true, trailing: true });
/**
 * Update the remote size state.
 * The function is throttled because UI interactions fire way too many events.
 * @param dataMap - The remote data map.
 * @param pos - The new position.
 */
const setDMSize = throttle((dataMap, size: FloaterAppSize) => {
    if (!dataMap) return;
    dataMap.set(FloaterKeys.size, size);
}, throttleTime, { leading: true, trailing: true });
/**
 * Update the remote editTime state.
 * The function is throttled because UI interactions fire way too many events.
 * @param dataMap - The remote data map.
 * @param pos - The new position.
 */
const setDMEditTime = throttle(async (dataMap, reverse: boolean = false) => {
    if (!dataMap) return;
    let lastEditTime = (await globalTime()).ntpTimeInUTC;
    dataMap.set(FloaterKeys.lastEditTime, lastEditTime * (reverse ? -1 : 1));
}, throttleTime, { leading: true, trailing: true });


export interface FloaterProps {
    objMap: SharedMap;
    delete: () => void;
    inkingManager: InkingManager;
    id?: string;
}

interface ModelViewerRefType {
    handleClickTakeScreenshot: () => string;
}

/**
 * Generic container for resources.
 * It displays a window that can be moved, resized and deleted, where the actual content is rendered.
 * It handles all the remote synchronization for the window state.
 * Synchronization of the contained resource is handled by the resource itself.
 * 
 * NOTE: it is called "Floater" because it floats on the canvas (no reference to any other meaning...)
 */
function Floater(props: FloaterProps) {
    const [screenPos, setScreenPos] = useState<FloaterScreenCoords | undefined>(undefined);
    const [screenSize, setScreenSize] = useState<FloaterScreenSize | undefined>(undefined);
    const [hasLoaded, setHasLoaded] = useState(false);

    const throttledSetScreenSize = throttle(setScreenSize, throttleTime * 2, { leading: true, trailing: true });
    const contentRef = useRef<HTMLDivElement>(null);
    const ModelViewerRef = useRef<ModelViewerRefType | null>(null);

    /**
     * Register the event handler to receive remote floater state updates.
     */
    useEffect(() => {
        const handleChange = (changed: IValueChanged, local: boolean) => {
            if (local) return;
            if (changed.key === FloaterKeys.pos) 
                setScreenPos(appToScreenPos(props.inkingManager, props.objMap.get(FloaterKeys.pos)!));
            if (changed.key === FloaterKeys.size) 
                setScreenSize(appToScreenSize(props.inkingManager, props.objMap.get(FloaterKeys.pos)!, props.objMap.get(FloaterKeys.size)!));
        };
        props.objMap.on("valueChanged", handleChange);

        setScreenPos(appToScreenPos(props.inkingManager, props.objMap.get(FloaterKeys.pos)!));
        setScreenSize(appToScreenSize(props.inkingManager, props.objMap.get(FloaterKeys.pos)!, props.objMap.get(FloaterKeys.size)!));
        setHasLoaded(true);
        return () => { props.objMap.off("valueChanged", handleChange) };
    }, [props.objMap, props.inkingManager]);

    /**
     * Receive the local UI event of window drag and update the local and remote state.
     * Dragging a window also brings it to the front.
     * @param e - The mouse event.
     */
    const handleDrag = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const newScreenPos = { left: e.clientX, top: e.clientY };
        if (newScreenPos.left === 0 && newScreenPos.top === 0) return; // Ignore the last event
        setScreenPos(newScreenPos); // Local update
        setDMPos(props.objMap, screenToAppPos(props.inkingManager, newScreenPos)); // Remote update
        setDMEditTime(props.objMap); // Bring to front
    }

    /**
     * Register the resize observer to listen for changes in the content size.
     */
    useLayoutEffect(() => {
        /**
         * Handle resize events by updating the local and remote state.
         * Contrary to dragging, resizing does not bring the window to the front
         * because resizing is handled weirdly by the browser and it would enter infinite event loops.
         */
        if (!contentRef.current) return;
        const content = contentRef.current;
        // Attach resize observer
        const resizeObserver = new ResizeObserver((entries) => {
            const rect = content.getBoundingClientRect();
            const newScreenSize = { width: rect.width, height: rect.height };
            throttledSetScreenSize(newScreenSize);
            setDMSize(props.objMap, screenToAppSize(props.inkingManager, screenPos!, newScreenSize));
        });
        resizeObserver.observe(content);
        return () => resizeObserver.disconnect();
    }, [hasLoaded, screenPos, props.inkingManager, props.objMap, throttledSetScreenSize]);

    /**
     * Export the model as a screenshot.
     */
    const exportModel = () => {
        ModelViewerRef.current?.handleClickTakeScreenshot();
    }

    // Render the floater
    if (!screenPos || !screenSize) return <></>;
    
    let content;
    const floaterType = props.objMap.get(FloaterKeys.type) as AcceptedFloaterType;
    switch (floaterType) {
        case "model":
            content = <ModelViewer ref={ModelViewerRef} objMap={props.objMap} />
            break;
        case "file":
            content = <FileViewer objMap={props.objMap} screenSize={screenSize} />
            break;
        case "note":
            content = <NotesViewer objMap={props.objMap} />
            break;
        default:
            content = <Text>Unknown display type</Text>;
            break;
    }
    
    const interaction = <FloaterInteraction 
        delete={props.delete} 
        drag={handleDrag} 
        lastEdit={(reverse?: boolean) => {setDMEditTime(props.objMap, reverse)}} 
        export={floaterType === 'model' ? exportModel : undefined}
    />
    const contentStyle = { ...screenPos, ...screenSize };
    
    return (
        <Tooltip content={interaction} relationship="label" hideDelay={300} showDelay={200} positioning='above-start' >
            <div 
                id={props.id}
                ref={contentRef}
                className={styles.content} 
                style={{...contentStyle, boxShadow: theme.effects.elevation8, zIndex: props.objMap.get(FloaterKeys.lastEditTime)}}
                onClick={() => {setDMEditTime(props.objMap)}}
            >{content}
            </div>
        </Tooltip>
    );
}

export default Floater
