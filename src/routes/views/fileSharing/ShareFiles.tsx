import { useRef, useState } from "react";
import { Button, Input, Field } from '@fluentui/react-components';
import { ArrowUpload16Regular as Upload } from "@fluentui/react-icons";

import "../../../styles/ShareFiles.css";
import { AcceptedFileTypes } from "./IFile";


/**
 * Display a file sharing component.
 * It displays a field for the user to provide a URL to a file to load and validates the URL.
 * NOTE: validation is still very basic and should be improved.
 */
function ShareFiles(props: { fileType: AcceptedFileTypes, loadFile: (fileURL: string) => Promise<void> }) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [fileURL, setFileURL] = useState("");
    const [isValidURL, setIsValidURL] = useState(false);

    const loadFileURL = async () => {
        if (!inputRef.current) throw raiseGlobalError(new Error("Input ref not set"));
        if (!isValidURL) throw raiseGlobalError(new Error("Invalid URL"));
        props.loadFile(fileURL);
    }

    const validateURL = (url: string) => {
        const regex = /^(ftp|http|https):\/\/[^ "]+$/;
        return regex.test(url);
    }

    return (
        <div className="sharefile-components">
            {/* <DropZone handleFile={setfile} /> */}
            <Field
                label="File URL"
                validationState={isValidURL ? 'success' : 'error'}
                validationMessageIcon={isValidURL ? 'success' : 'error'}
            >
                <div className="sharefile-components-level2">
                    <Input 
                        placeholder="Enter a file URL"
                        ref={inputRef}
                        onChange={(e) => {
                            const url = e.target.value;
                            setFileURL(url);
                            setIsValidURL(validateURL(url));
                        }}
                    />
                    <Button id="UploadBTN" icon={<Upload />} appearance='primary' onClick={loadFileURL} disabled={!isValidURL}/>
                </div>
            </Field>
        </div>
    );

}

export default ShareFiles;