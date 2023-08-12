import { IFluidHandle } from "@fluidframework/core-interfaces";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Tooltip } from "@fluentui/react-components";
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

const theme = getTheme();
const throttleTime = 100;
const setDMPos = throttle((dataMap, pos: FloaterAppCoords) => {
    if (dataMap) dataMap.set('pos', pos);
}, throttleTime, { leading: true, trailing: true });
const setDMSize = throttle((dataMap, size: FloaterAppSize) => {
    if (dataMap) dataMap.set('size', size);
} , throttleTime, { leading: true, trailing: true });

export interface FloaterProps {
    handle: IFluidHandle;
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

    const floaterRef = useRef<SharedMap>();
    useEffect(() => {
        props.handle.get().then((dataMap) => {
            floaterRef.current = dataMap as SharedMap;
            floaterRef.current.on("valueChanged", (changed: IValueChanged, local: boolean) => {
                if (local) return;
                if (changed.key === 'pos') {
                    setScreenPos(appToScreenPos(props.inkingManager, floaterRef.current!.get('pos')!));
                }
                if (changed.key === 'size') {
                    setScreenSize(appToScreenSize(props.inkingManager, floaterRef.current!.get('pos')!, floaterRef.current!.get('size')!));
                }
            });
            setScreenPos(appToScreenPos(props.inkingManager, floaterRef.current.get('pos')!));
            setScreenSize(appToScreenSize(props.inkingManager, floaterRef.current.get('pos')!, floaterRef.current.get('size')!));
            setHasLoaded(true);
        });
    }, [props.handle, props.inkingManager]);

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
        // Attach resize observer
        const resizeObserver = new ResizeObserver((entries) => {
            const rect = content.getBoundingClientRect() as DOMRect;
            const newScreenSize = { width: rect.width, height: rect.height };
            throttledSetScreenSize(newScreenSize);
            setDMSize(floaterRef.current, screenToAppSize(props.inkingManager, screenPos!, newScreenSize));
        });
        resizeObserver.observe(content);
        return () => resizeObserver.disconnect();
    }, [hasLoaded, screenPos, props.inkingManager]);


    const exportModel = () => {
        ModelViewerRef.current?.handleClickTakeScreenshot();
    }

    // Render the floater
    if (!screenPos || !screenSize || !floaterRef.current) return <></>;
    
    let content;
    switch (floaterRef.current.get('type')) {
        case "model":
            content = <ModelViewer ref={ModelViewerRef} objMap={floaterRef.current} />
            break;
        case "file":
            content = <FileViewer objMap={floaterRef.current} screenSize={screenSize} />
            break;
        default:
            content = <p>Unknown</p>;
            break;
    }
    
    const interaction = <FloaterInteraction delete={props.delete} drag={handleDrag} export={exportModel} />
    const contentStyle = { ...screenPos, ...screenSize };
    
    return (
        <Tooltip content={interaction} relationship="label" hideDelay={50} showDelay={10} positioning='above-start' >
            <div 
                ref={contentRef}
                className={styles.content} 
                style={{...contentStyle, boxShadow: theme.effects.elevation8}}
            >{content}
            </div>
        </Tooltip>
    );
}

export default Floater
