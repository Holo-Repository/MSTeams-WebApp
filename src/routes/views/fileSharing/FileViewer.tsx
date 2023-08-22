import { Image, Text } from "@fluentui/react-components";
import { SharedMap } from "fluid-framework";
import { useMemo } from "react";

import { AcceptedFileTypes } from "./AcceptedFileTypes";
import { FloaterScreenSize } from "../utils/FloaterUtils";
import PDF from "./fileHandlers/PDF";


/**
 * Display a file.
 * This is a generic component that will draw the appropriate file viewer based on the file type.
 */
function FileViewer(props: { objMap: SharedMap, screenSize: FloaterScreenSize }) {
    const { type, url } = useMemo(() => { return {
        type: props.objMap.get('fileType') as AcceptedFileTypes,
        url: props.objMap.get('url') as string,
    }}, [props.objMap]);
    
    switch (type) {
        case 'image': return <Image src={url} fit="contain" />;
        case 'pdf': return <PDF url={url} screenSize={props.screenSize} objMap={props.objMap} />;
        default: return <Text>Unsupported file type</Text>;
    }
}

export default FileViewer;