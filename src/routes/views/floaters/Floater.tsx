import { IFluidHandle } from "@fluidframework/core-interfaces";
import { useEffect, useState } from "react";
import { Tooltip } from "@fluentui/react-components";
import { InkingManager } from "@microsoft/live-share-canvas";

import ModelViewer from "../../unity/ModelViewer";
import styles from "../../../styles/Floater.module.css";
import FloaterInteraction from "./FloaterInteraction";
import {
    appToCanvasPos,
} from './FloaterUtils';

export interface FloaterProps {
    handle: IFluidHandle;
    delete: () => void;
    inkingManager: InkingManager;
}

function Floater(props: FloaterProps) {
    const [dataMap, setDataMap] = useState(undefined as unknown as { [key: string]: any } );

    useEffect(() => {(async () => {
        const dataMap = await props.handle.get();
        setDataMap(dataMap);
    })();}, [props.handle]);

    let content = <p>Loading...</p>;

    let pos = { top: 0, left: 0 };
    if (dataMap) {
        pos = appToCanvasPos(props.inkingManager, dataMap.get('pos'));
        switch (dataMap.get('type')) {
            case "model":
                content = <p style={{backgroundColor:"black"}}>Model</p>//<ModelViewer objMap={dataMap} />
                break;
            default:
                content = <p>Unknown</p>;
                break;
        }
    }
    
    const interaction = <FloaterInteraction delete={props.delete} />
    
    return <Tooltip content={interaction} relationship="label">
                <div className={styles.content} style={pos}>{content}</div>
            </Tooltip>
}

export default Floater