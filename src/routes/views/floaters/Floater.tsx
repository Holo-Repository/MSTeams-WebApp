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
import { AcceptedFloaterType } from "./AcceptedFloaterType";
import NotesViewer from "../notes/NotesViewer";

const theme = getTheme();
const throttleTime = 100;
const setDMPos = throttle((dataMap, pos: FloaterAppCoords) => {
    if (!dataMap) return;
    dataMap.set('pos', pos);
}, throttleTime, { leading: true, trailing: true });
const setDMSize = throttle((dataMap, size: FloaterAppSize) => {
    if (!dataMap) return;
    dataMap.set('size', size);
}, throttleTime, { leading: true, trailing: true });
const setDMEditTime = throttle(async (dataMap, reverse: boolean = false) => {
    if (!dataMap) return;
    let lastEditTime = (await globalTime()).ntpTimeInUTC;
    dataMap.set('lastEditTime', lastEditTime * (reverse ? -1 : 1));
}, throttleTime, { leading: true, trailing: true });


export interface FloaterProps {
    objMap: SharedMap;
    delete: () => void;
    inkingManager: InkingManager;
}

interface ModelViewerRefType {
    handleClickTakeScreenshot: () => string;
}

function Floater(props: FloaterProps) {
    const [screenPos, setScreenPos] = useState<FloaterScreenCoords | undefined>(undefined);
    const [screenSize, setScreenSize] = useState<FloaterScreenSize | undefined>(undefined);
    const [hasLoaded, setHasLoaded] = useState(false);

    const throttledSetScreenSize = throttle(setScreenSize, throttleTime * 2, { leading: true, trailing: true });
    const ModelViewerRef = useRef<ModelViewerRefType | null>(null);

    useEffect(() => {
        const handleChange = (changed: IValueChanged, local: boolean) => {
            if (local) return;
            if (changed.key === 'pos') setScreenPos(appToScreenPos(props.inkingManager, props.objMap.get('pos')!));
            if (changed.key === 'size') setScreenSize(appToScreenSize(props.inkingManager, props.objMap.get('pos')!, props.objMap.get('size')!));
        };
        props.objMap.on("valueChanged", handleChange);

        setScreenPos(appToScreenPos(props.inkingManager, props.objMap.get('pos')!));
        setScreenSize(appToScreenSize(props.inkingManager, props.objMap.get('pos')!, props.objMap.get('size')!));
        setHasLoaded(true);
        return () => { props.objMap.off("valueChanged", handleChange) };
    }, [props.objMap, props.inkingManager]);

    const handleDrag = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const newScreenPos = { left: e.clientX, top: e.clientY };
        if (newScreenPos.left === 0 && newScreenPos.top === 0) return; // Ignore the last event
        setScreenPos(newScreenPos); // Local update
        setDMPos(props.objMap, screenToAppPos(props.inkingManager, newScreenPos)); // Remote update
        setDMEditTime(props.objMap); // Bring to front
    }

    const contentRef = useRef<HTMLDivElement>(null);
    useLayoutEffect(() => {
        if (!contentRef.current) return;
        const content = contentRef.current;
        // Attach resize observer
        const resizeObserver = new ResizeObserver((entries) => {
            const rect = content.getBoundingClientRect() as DOMRect;
            const newScreenSize = { width: rect.width, height: rect.height };
            throttledSetScreenSize(newScreenSize);
            setDMSize(props.objMap, screenToAppSize(props.inkingManager, screenPos!, newScreenSize));
        });
        resizeObserver.observe(content);
        return () => resizeObserver.disconnect();
    }, [hasLoaded, screenPos, props.inkingManager, props.objMap, throttledSetScreenSize]);


    const exportModel = () => {
        ModelViewerRef.current?.handleClickTakeScreenshot();
    }

    // Render the floater
    if (!screenPos || !screenSize) return <></>;
    
    let content;
    const floaterType = props.objMap.get('type') as AcceptedFloaterType;
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
                ref={contentRef}
                className={styles.content} 
                style={{...contentStyle, boxShadow: theme.effects.elevation8, zIndex: props.objMap.get('lastEditTime')}}
                onClick={() => {setDMEditTime(props.objMap)}}
            >{content}
            </div>
        </Tooltip>
    );
}

export default Floater
