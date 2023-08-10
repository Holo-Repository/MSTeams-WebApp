import { FC, Dispatch, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Text } from '@fluentui/react-components';

import "../../../styles/DropZone.css";


/**
 * The DropZoneComponent allows file drag and drop into the dropzone div.
 * The input file is then returned as a File object.
 */
const DropZoneComponent: FC<{ setFile: Dispatch<File> }> = ({ setFile }) => {

    // onDrop function to handle the file dropped, creating a new File object and setting it to state setFile.
    const onDropAccepted = useCallback((acceptedFiles: any) => {
        if (acceptedFiles.size < 1) {
            return;
        }
        else {
            try {
                const file = new File([acceptedFiles[0]], acceptedFiles[0].name, { type: acceptedFiles[0].type });
                console.log(file);
                const dropzone = document.getElementsByClassName("dropzone")[0];
                dropzone.innerHTML = file.name;
                setFile(file);

            }
            catch (error) {
                console.log(error);
            }

        }
    }, []);


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


export default DropZoneComponent;
