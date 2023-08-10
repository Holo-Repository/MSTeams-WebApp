import ShareFiles from './ShareFiles';
import useFloaterLoader from '../floaters/FloaterLoader';
import { IFluidContainer } from 'fluid-framework';
import IFloaterObject from '../floaters/IFloaterObject';
import { Toolbar, ToolbarButton } from '@fluentui/react-components';
import { useState } from 'react';
import {
    Image24Filled as Image,
    DocumentPdf24Filled as PDF,
} from "@fluentui/react-icons";
import { AcceptedFileTypes } from './AcceptedFileTypes';


/**
 * The ShareFile class contains functions to handle file rendering for lists of Files and URLs.
 *  It renders a div named SharedFile containing a DropZoneComponent,
 *  and a Form to allow user to input a url a view a file.
 */
function FileLoader(props: {container: IFluidContainer, setParentState: (tool: string) => void}) {
    const { floaters, loadFloater } = useFloaterLoader({
        container: props.container,
    });

    const [fileType, setFileType] = useState(undefined as AcceptedFileTypes | undefined);

    async function loadFile(fileURL: string) {
        const file = {
            type: "file",
            pos: { x: 0, y: 0 },
            size: { width: 50, height: 100 },
            url: fileURL,
            fileType: fileType,
        } as IFloaterObject;

        await loadFloater(file);
        props.setParentState("Select");
    }

    if (!floaters) return <p>Loading...</p>;
    if (!fileType) return (
        <Toolbar>
            <ToolbarButton onClick={() => setFileType('image')} icon={<Image />}/>
            <ToolbarButton onClick={() => setFileType('pdf')} icon={<PDF />}/>
        </Toolbar>
    );
    return <ShareFiles fileType={fileType} loadFile={loadFile} />;
}

export default FileLoader;