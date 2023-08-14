import { Image } from "@fluentui/react-components";
import { SharedMap } from "fluid-framework";
import { useMemo } from "react";

import { AcceptedFileTypes } from "./AcceptedFileTypes";
import { FloaterScreenSize } from "../utils/FloaterUtils";
import PDF from "./fileHandlers/PDF";


function FileViewer(props: { objMap: SharedMap, screenSize: FloaterScreenSize }) {
    const { type, url } = useMemo(() => { return {
        type: props.objMap.get('fileType') as AcceptedFileTypes,
        url: props.objMap.get('url') as string,
    }}, [props.objMap]);
    
    switch (type) {
        case 'image': return <Image src={url} fit="contain" />;
        case 'pdf': return <PDF url={url} screenSize={props.screenSize} objMap={props.objMap} />;
    }
}

export default FileViewer;