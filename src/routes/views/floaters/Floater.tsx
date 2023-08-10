import { IFluidHandle } from "@fluidframework/core-interfaces";
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


const theme = getTheme();
const throttleTime = 100;
const setDMPos = throttle((dataMap, pos: FloaterAppCoords) => { 
    console.log('SENDING POS', pos);
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
    const [screenPos, setScreenPos] = useState<FloaterScreenCoords | undefined>(undefined);
    const [screenSize, setScreenSize] = useState<FloaterScreenSize | undefined>(undefined);
    const [hasLoaded, setHasLoaded] = useState(false);

    const floaterRef = useRef<SharedMap>();
    useEffect(() => {
        props.handle.get().then((dataMap) => {
            floaterRef.current = dataMap as SharedMap;
            floaterRef.current.on("valueChanged", (changed: IValueChanged, local: boolean) => {
                if (local) return;
                if (changed.key === 'pos') {
                    console.log('RECEIVED POS', floaterRef.current!.get('pos')!);
                    setScreenPos(appToScreenPos(props.inkingManager, floaterRef.current!.get('pos')!));
                }
                if (changed.key === 'size') {
                    console.log('RECEIVED SIZE', floaterRef.current!.get('size')!);
                    setScreenSize(appToScreenSize(props.inkingManager, floaterRef.current!.get('pos')!, floaterRef.current!.get('size')!));
                }
            });
            setScreenPos(appToScreenPos(props.inkingManager, floaterRef.current.get('pos')!));
            setScreenSize(appToScreenSize(props.inkingManager, floaterRef.current.get('pos')!, floaterRef.current.get('size')!));
            setHasLoaded(true);
        });
    }, [props.handle]);

    const handleDrag = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const newScreenPos = { left: e.clientX, top: e.clientY };
        if (newScreenPos.left === 0 && newScreenPos.top === 0) return; // Ignore the last event
        setScreenPos(newScreenPos); // Local update
        setDMPos(floaterRef.current, screenToAppPos(props.inkingManager, newScreenPos)); // Remote update
    }


    const contentRef = useRef<HTMLDivElement>(null);
    useLayoutEffect(() => {
        if (!contentRef.current) return;
        const content = contentRef.current;
        console.log('INIT OBSERVER');
        // Attach resize observer
        const resizeObserver = new ResizeObserver((entries) => {
            const rect = content.getBoundingClientRect() as DOMRect;
            const newScreenSize = { width: rect.width, height: rect.height };
            console.log('RESIZE', newScreenSize);
            setDMSize(floaterRef.current, screenToAppSize(props.inkingManager, screenPos!, newScreenSize));
        });
        resizeObserver.observe(content);
        return () => resizeObserver.disconnect();
    }, [hasLoaded]);





    // Render the floater
    if (!screenPos || !screenSize || !floaterRef.current) return <></>;
    
    let content = <Text>{JSON.stringify({...screenPos, ...screenSize})}</Text>;
    switch (floaterRef.current.get('type')) {
        case "model":
            content = <ModelViewer objMap={floaterRef.current} />
            break;
        default:
            content = <p>Unknown</p>;
            break;
    }
    
    const interaction = <FloaterInteraction delete={props.delete} drag={handleDrag} />
    const contentStyle = { ...screenPos, ...screenSize };
    
    return (
        <Tooltip content={interaction} relationship="label" hideDelay={50} showDelay={10} positioning='above-start' >
            <div 
                ref={contentRef}
                className={styles.content} 
                style={{...contentStyle, boxShadow: theme.effects.elevation8}}
            >{content}</div>
        </Tooltip>
    );
}

export default Floater