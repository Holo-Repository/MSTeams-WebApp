import { FC, Dispatch, useState } from "react";
import { Button, Text, Input } from '@fluentui/react-components';

import { FileSharingProps } from './FileSharing';
import DropZoneComponent from "./DropZoneAddFile";
import "../../../styles/DropZone.css";


/**
 * The shareFiles functional component renders a div with a form to input URLs and a DropZone to input files.
 *  It records the input Files and URLs as arrays and dispatches them to the FileSharing component.
 */
const ShareFiles: FC<{ shareFiles: Dispatch<FileSharingProps> }> = ({ shareFiles }) => {

    const [file, setfile] = useState<File>();
    const [files, setfiles] = useState<File[]>([]);

    const [fileURL, setfileURL] = useState<URL>();
    const [fileURLs, setfileURLs] = useState<URL[]>([]);

    // sendFile function handles updating the state properties and sets the shareFiles paramenter to reflect the current state
    const sendFile = () => {

        if (files.length === 0 || files === undefined) {
            setfiles([file as File]);
            if (fileURLs.length === 0 || fileURLs === undefined) {
                setfileURLs([]);
            }

            console.log("File added - " + files.toString() + " : files array" + fileURLs.toString() + " : fileURLs array");
            shareFiles({ files, fileURLs });

        }
        else if (files.length > 0) {
            setfiles([...files, file as File]);
            if (fileURLs.length === 0 || fileURLs === undefined) {
                setfileURLs([]);
            }

            console.log("File added - " + files.toString() + " : files array" + fileURLs.toString() + " : fileURLs array");
            shareFiles({ files, fileURLs });
        }
        else {
            console.log("File could not be added.");
        }
    }

    // isvalidURL function to check if the input string is valid
    const isValidURL = (url: string) => {
        try {
            new URL(url);
            return true;
        }
        catch (error) {
            console.log(error + " Invalid URL");
            return false;
        }
    }

    // Add fileURL to fileURLs array then add file to div
    const formSubmit = (e: any) => {
        e.preventDefault();

        const formfileURL = document.getElementById("fileURL") as HTMLInputElement;
        if (formfileURL.value === "") {
            return;
        }
        else {
            if (isValidURL(formfileURL.value)) {
                const url = new URL(formfileURL.value);
                setfileURL(url);
                if (fileURLs.length === 0 || fileURLs === undefined) {
                    setfileURLs([url]);

                    if (files.length === 0 || files === undefined) {
                        setfiles([]);
                    }

                    console.log("File URL added - " + files.toString() + " : files array" + fileURLs.toString() + " : fileURLs array");
                    shareFiles({ files, fileURLs });
                }
                else if (fileURLs.length > 0) {
                    setfileURLs([...fileURLs, url]);

                    if (files === undefined) {
                        setfiles([]);
                    }

                    console.log("File URL  added - " + files.toString() + " : files array" + fileURLs.toString() + " : fileURLs array");
                    shareFiles({ files, fileURLs });
                }
                //else if (fileURLs.includes(url)){
                // console.log("File already exists");
                //}
                else {
                    console.log("File could not be added.");
                }

            }
            else {
                console.log("Invalid URL input");
                return;
            }

        }
    }

    return (
        <div className="SharedFiles">
            <DropZoneComponent setFile={setfile} />
            <Button onClick={() => sendFile()}>Upload File</Button>

            <form onSubmit={formSubmit}>
                <br></br>
                <Text>Enter File URL:</Text>
                <Input id="fileURL" type="text" name="fileURL"></Input>
                <Button type="submit" value="Submit">Upload URL</Button>
            </form>
            <br></br>

        </div>
    );

}

export default ShareFiles;