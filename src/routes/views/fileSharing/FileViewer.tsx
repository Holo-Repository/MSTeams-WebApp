import { Image } from "@fluentui/react-components";
import { SharedMap } from "fluid-framework";
import { useMemo } from "react";
import { AcceptedFileTypes } from "./AcceptedFileTypes";


function FileViewer(props: { objMap: SharedMap }) {
    const { type, url } = useMemo(() => {
        const type = props.objMap.get('fileType') as AcceptedFileTypes;
        const url = props.objMap.get('url') as string;
        return { type, url };
    }, [props.objMap]);

    switch (type) {
        case 'image': return <Image src={props.objMap.get('url')} fit="contain" />;
        case 'pdf': return <iframe src={props.objMap.get('url')} />;
    }
}

export default FileViewer;