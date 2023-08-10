import { Image } from "@fluentui/react-components";
import { SharedMap } from "fluid-framework";
import { useMemo } from "react";


function FileViewer(props: { objMap: SharedMap }) {
    const { type, url } = useMemo(() => {
        const type = props.objMap.get('fileType');
        const url = props.objMap.get('url');
        return { type, url };
    }, [props.objMap]);

    if (type === 'image') return <Image src={props.objMap.get('url')} fit="contain" />;
    return <p>File type not supported</p>;
}

export default FileViewer;