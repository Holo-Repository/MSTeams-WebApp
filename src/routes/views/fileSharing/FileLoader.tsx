import React, { useState } from 'react';
import axios from "axios";

import ShareFiles from './ShareFiles';
import useFloaterLoader from '../floaters/FloaterLoader';
import { IFluidContainer } from 'fluid-framework';
import IFloaterObject from '../floaters/IFloaterObject';


/**
 * The ShareFile class contains functions to handle file rendering for lists of Files and URLs.
 *  It renders a div named SharedFile containing a DropZoneComponent,
 *  and a Form to allow user to input a url a view a file.
 */
function FileLoader(props: {container: IFluidContainer}) {
    const { floaters, loadFloater } = useFloaterLoader({
        container: props.container,
    });

    async function loadFile(fileURL: string) {
        const file = {
            type: "file",
            pos: { x: 0, y: 0 },
            size: { width: 50, height: 100 },
            url: fileURL,
        } as IFloaterObject;

        await loadFloater(file);
    }

    if (!floaters) return <p>Loading...</p>;
    else return <ShareFiles loadFile={loadFile} />;
}

export default FileLoader;