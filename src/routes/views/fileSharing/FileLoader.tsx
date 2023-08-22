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
import globalTime from '../utils/GlobalTime';


/**
 * A file loader component.
 * Allows to load a file by providing a direct link to the resource.
 */
function FileLoader(props: {container: IFluidContainer, setParentState: (tool: string) => void}) {
    const { floaters, loadFloater } = useFloaterLoader({
        container: props.container,
    });

    const [fileType, setFileType] = useState(undefined as AcceptedFileTypes | undefined);

    /**
     * Load a file into the container.
     * Handles populating the appropriate floater object and loading it into the container.
     * @param fileURL - The URL of the file to load.
     */
    async function loadFile(fileURL: string) {
        let file = {
            type: "file",
            pos: { x: -200, y: -150 },
            size: { width: 400, height: 300 },
            lastEditTime: (await globalTime()).ntpTimeInUTC,
            url: fileURL,
            fileType: fileType,
        } as IFloaterObject & { fileType: AcceptedFileTypes };

        if (fileType === 'pdf') {
            (file as any).currentPage = 1;
            (file as any).pageScroll = 0;
        }

        loadFloater(file);
        props.setParentState("Select"); // Deselect the file loader tool
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