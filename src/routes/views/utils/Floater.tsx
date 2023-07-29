import { IFluidHandle } from "@fluidframework/core-interfaces";
import { useEffect, useState } from "react";
import ModelViewer from "../../unity/ModelViewer";

function Floater(props: {handle : IFluidHandle, delete: () => void}) {
    const [dataMap, setDataMap] = useState(undefined as unknown as { [key: string]: any } );

    useEffect(() => {(async () => {
        const dataMap = await props.handle.get();
        setDataMap(dataMap);
    })();}, [props.handle]);

    let content = <p>Loading...</p>;

    if (dataMap) 
    switch (dataMap.get('type')) {
        case "model":
            content = <>
                <ModelViewer objMap={dataMap} />
                <button onClick={props.delete}>Remove</button>
            </>
            break;
        default:
            content = <p>Unknown</p>;
            break;
    }
    
    return content;
}

export default Floater