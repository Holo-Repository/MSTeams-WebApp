import { useState } from "react";
import { Button, Text, Input } from '@fluentui/react-components';

import DropZone from "./DropZone";
import "../../../styles/DropZone.css";


/**
 * The shareFiles functional component renders a div with a form to input URLs and a DropZone to input files.
 *  It records the input Files and URLs as arrays and dispatches them to the FileLoader component.
 */
function ShareFiles(props: { loadFile: (fileURL: string) => Promise<void> }) {
    

    

    return (
        <div className="SharedFiles">
            {/* <DropZone handleFile={setfile} /> */}
            

        </div>
    );

}

export default ShareFiles;