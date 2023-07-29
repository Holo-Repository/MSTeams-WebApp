import { IFluidHandle } from "@fluidframework/core-interfaces";
import { useEffect, useState } from "react";
import { Tooltip } from "@fluentui/react-components";
import { InkingManager } from "@microsoft/live-share-canvas";
import { getTheme } from '@fluentui/react';

import ModelViewer from "../../unity/ModelViewer";
import styles from "../../../styles/Floater.module.css";
import FloaterInteraction from "./FloaterInteraction";
import {
    appToCanvasPos,
    canvasToAppPos,
} from './FloaterUtils';
import { IValueChanged, SharedMap } from "fluid-framework";


const theme = getTheme();


export interface FloaterProps {
    handle: IFluidHandle;
    delete: () => void;
    inkingManager: InkingManager;
}

function Floater(props: FloaterProps) {
    const [dataMap, setDataMap] = useState(undefined as unknown as { [key: string]: any } );
    const [appPos, setAppPos] = useState({ x: 0, y: 0 });

    useEffect(() => {(async () => {
        const dm = await props.handle.get() as SharedMap;
        dm.on("valueChanged", (change, local) => {handleChange(change, local)});
        setDataMap(dm);
        setAppPos(dm.get('pos') as { x: number, y: number });
    })();}, [props]);

    const handleChange = (changed: IValueChanged, local: boolean) => {
        if (dataMap && changed.key === 'pos' && !local) {
            setAppPos(dataMap.get('pos') as { x: number, y: number });
        }
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

    const handleDrag = (event: any) => {
        const canvasPos = { left: event.clientX, top: event.clientY };
        if (canvasPos.left === 0 && canvasPos.top === 0) return;
        const newAppPos = canvasToAppPos(props.inkingManager, canvasPos);
        const dist = Math.sqrt((appPos.x - newAppPos.x) ** 2 + (appPos.y - newAppPos.y) ** 2);
        if (dist < 10) return;
        setAppPos(newAppPos);
        dataMap.set('pos', newAppPos);
    }
    
    const interaction = <FloaterInteraction delete={props.delete} drag={handleDrag} />
    const pos = dataMap ? appToCanvasPos(props.inkingManager, appPos) : { top: 0, left: 0 };
    
    return (
        <Tooltip content={interaction} relationship="label" hideDelay={50} showDelay={10} >
            <div className={styles.content} style={{...pos, boxShadow: theme.effects.elevation8}}>{content}</div>
        </Tooltip>
    );
}

export default Floater