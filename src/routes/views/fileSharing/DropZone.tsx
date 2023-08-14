import { Dispatch, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { Text } from '@fluentui/react-components';

import "../../../styles/DropZone.css";


/**
 * The DropZoneComponent allows file drag and drop into the dropzone div.
 * The input file is then returned as a File object.
 */
function DropZone(props: { handleFile: Dispatch<File> }) {
    const dropZoneRef = useRef<HTMLDivElement>(null);

    // onDrop function to handle the file dropped, creating a new File object and setting it to state setFile.
    const onDropAccepted = useCallback((acceptedFiles: any) => {
        if (acceptedFiles.size < 1) throw new Error("No file selected");
        
        const file = new File([acceptedFiles[0]], acceptedFiles[0].name, { type: acceptedFiles[0].type });
        dropZoneRef.current!.innerHTML = file.name;
        props.handleFile(file);
    }, [dropZoneRef]);


    // useDropzone hook to handle the onDrop function and accept file types.
    const { getRootProps, getInputProps } = useDropzone({
        onDropAccepted,
        accept: {
            "image/png": [".png"],
            "image/jpeg": [".jpeg", ".jpg"],
            "text/plain": [".txt"],
        },
        multiple: false
    }
    );

    // return a div with the DropZoneComponent.
    return (
        <div>
            <div {...getRootProps()}>
                <input {...getInputProps()} />
                <div className="dropzone">
                    <Text>Select a file to share</Text>
                </div>
            </div>
        </div>

    );
};


export default DropZone;
