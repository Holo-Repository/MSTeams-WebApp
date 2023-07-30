import { IFluidHandle } from "@fluidframework/core-interfaces";
import { useEffect, useRef, useState } from "react";
import { Tooltip } from "@fluentui/react-components";
import { InkingManager } from "@microsoft/live-share-canvas";
import { getTheme } from '@fluentui/react';
import { IValueChanged, SharedMap } from "fluid-framework";
import { throttle } from 'lodash';

import ModelViewer from "../../unity/ModelViewer";
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


const theme = getTheme();
const throttleTime = 100;
const setDMPos = throttle((dataMap, pos: FloaterAppCoords) => { 
    if (dataMap) dataMap.set('pos', pos);
}, throttleTime, { leading: true, trailing: true });
const setDMSize = throttle((dataMap, size: FloaterAppSize) => {
    console.log('SENDING SIZE', size);
    if (dataMap) dataMap.set('size', size);
} , throttleTime, { leading: true, trailing: true });


export interface FloaterProps {
    handle: IFluidHandle;
    delete: () => void;
    inkingManager: InkingManager;
}

function Floater(props: FloaterProps) {
    const [dataMap, setDataMap] = useState(undefined as unknown as { [key: string]: any } );
    const [appPos, setAppPos] = useState({ x: 0, y: 0 } as FloaterAppCoords);
    const [appSize, setAppSize] = useState({ width: 0, height: 0 } as FloaterAppSize);
    const contentRef = useRef(null);
    const sizeObserver = new ResizeObserver((entires) => {
        if (!entires || entires.length === 0) return;
        const contentRect = entires[0].contentRect;
        const screenSize = { width: contentRect.left + contentRect.right, height: contentRect.top + contentRect.bottom } as FloaterScreenSize;
        handleResize(screenSize);
    });
    
    useEffect(() => {(async () => {
        const dm = await props.handle.get() as SharedMap;
        dm.on("valueChanged", (change, local) => {handleChange(change, local)});
        setAppPos(dm.get('pos') as FloaterAppCoords);
        setAppSize(dm.get('size') as FloaterAppSize);
        setDataMap(dm);
    })();}, [props]);

    useEffect(() => {
        if (!contentRef.current) return;
        const content = contentRef.current as unknown as HTMLElement;
        sizeObserver.observe(content, { box: 'border-box' });
        return () => { sizeObserver.unobserve(content); };
    }, [contentRef]);
    
    const handleChange = (changed: IValueChanged, local: boolean) => {
        if (!dataMap) return;
        if (!local && changed.key === 'pos') setAppPos(dataMap.get('pos') as FloaterAppCoords);
        if (!local && changed.key === 'size') {
            const newSize = dataMap.get('size') as FloaterAppSize;
            console.log('RECEIVED SIZE', newSize);
            setAppSize(newSize);
        }
    }

    const handleResize = (newSize: FloaterScreenSize) => {
        if (!dataMap || !appPos || newSize.width === 0 || newSize.height === 0) return;
        const screenPos = appToScreenPos(props.inkingManager, appPos);
        const newAppSize = screenToAppSize(props.inkingManager, screenPos, newSize);
        setAppSize(newAppSize);
        setDMSize(dataMap, newAppSize);
    }

    
    const handleDrag = (event: any) => {
        const canvasPos = { left: event.clientX, top: event.clientY } as FloaterScreenCoords;
        if (canvasPos.left === 0 && canvasPos.top === 0) return;
        const newAppPos = screenToAppPos(props.inkingManager, canvasPos);
        setAppPos(newAppPos);
        setDMPos(dataMap, newAppPos);
    }

    let content = <p>Loading...</p>;

    if (dataMap) {
        switch (dataMap.get('type')) {
            case "model":
                content = <p style={{backgroundColor:"black"}}>Model</p>//<ModelViewer objMap={dataMap} />
                break;
            default:
                content = <p>Unknown</p>;
                break;
        }
    }
    
    const interaction = <FloaterInteraction delete={props.delete} drag={handleDrag} />
    const pos = dataMap ? appToScreenPos(props.inkingManager, appPos) : { top: 0, left: 0 };
    const size = dataMap ? appToScreenSize(props.inkingManager, appPos, appSize) : { width: 0, height: 0 };
    const contentStyle = { ...pos, ...size };
    
    return (
        <Tooltip content={interaction} relationship="label" hideDelay={50} showDelay={10} >
            <div 
                ref={contentRef}
                className={styles.content} 
                style={{...contentStyle, boxShadow: theme.effects.elevation8}}
            >{content}</div>
        </Tooltip>
    );
}

export default Floater