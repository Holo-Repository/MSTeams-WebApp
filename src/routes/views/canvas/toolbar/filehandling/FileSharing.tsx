import {useState} from 'react';
import axios from "axios";
import DropZoneComponent from "./DropZoneAddFile";
import { Button, Text, Input, Label} from '@fluentui/react-components';
import { render } from 'react-dom';
import React from 'react';
import ShareFiles from './ShareFiles';

/**
 * Interface defining the properties for Filesharing component
 * 
 * @property files: Array of type Files which holds the files to be shared
 * @property filesURLs: Array of type URL which holds the URLs to be shared
 */
export interface FileSharingProps {
    files: File[];
    fileURLs: URL[];
}

// State properties for FileSharing component, contains arrays for files and URLs to be shared. 
// Optional properties for a single file and fileURL to be shared.
type FileSharingState = {
    file?: File;
    files: File[];
    fileURL?: URL;
    fileURLs: URL[];
}

/**
 * The ShareFile class contains functions to handle file rendering for lists of Files and URLs.
 *  It renders a div named SharedFile containing a DropZoneComponent,
 *  and a Form to allow user to input a url a view a file.
 */
class FileSharing extends React.Component<{}, FileSharingState> {

    constructor(props: {}) {
        super(props);
        this.state = {files: [], fileURLs: []};
        this.setShareFiles = this.setShareFiles.bind(this);
    }

    setShareFiles(getFiles: FileSharingProps) {
        
        if (getFiles === null || getFiles === undefined){
            console.log("getFiles is null/undefined");
            return;
        }
        else {

            getFiles.files.forEach(file => {
                console.log(file.name + " is the file names from shareFiles.tsx");
            });
            getFiles.fileURLs.forEach(fileURL => {
                console.log(fileURL.toString() + " is the fileURLs from shareFiles.tsx");
            });

            if (getFiles.fileURLs === null || getFiles.fileURLs === undefined){
                console.log("fileURLs list is null or undefined");
                return;
            }
            else {
                if (getFiles.fileURLs.length > 0){
                    this.setState({fileURLs: getFiles.fileURLs});
                    console.log("URLS and urls are not empty");
                    return;
    
                }
                else if (getFiles.fileURLs.length === 0){
                    this.setState({fileURL: getFiles.fileURLs[0]});
                    console.log("first URL added");
                }
                else {
                    console.log("No URL added");
                    return;
                }
            }
            if (getFiles.files === null || getFiles.files === undefined){
                
                console.log("files list is null or undefined");
                return;
            }
            else {
                if (getFiles.files.length > 0){
                    this.setState({files: getFiles.files});
                    console.log("files and urls are not empty");

                }
                else if (getFiles.files.length === 0){
                    this.setState({file: getFiles.files[0]});
                    console.log("first file added");
                }
                else {
                    console.log("No file added");
                    return;
                }
            }
        } 
    }

    // upload file to server with axios 
    uploadFile = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file as Blob);
        try {
            await axios.post("https://localhost:53000/index.html/#holorepo", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

        } catch (error) {
            console.log(error);
        }
    }  

    // download file function using input url as string with axios
    downloadFile = async (fileURL: URL) => {
        try {
            var fileURLString = fileURL.toString();
            await axios.get(fileURLString, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

        } catch (error) {
            console.log(error);

        }
    }


    getFiles = () => {
        // for each file in files property log the file name
        this.state.files.forEach(file => {
            console.log(file.name + " is the file names from getFiles()");
        });

        return this.state.files;
    }

    getFileURLs = () => {
        this.state.fileURLs.forEach(fileURL => {
            console.log(fileURL.toString() + " is the fileURL names from getFileURLs()");
        });
        return this.state.fileURLs;
    }

    // showFile function using input file as File object
    showFile(file: File) {

        return(
            
            <div className="ShowFiles">
                {file.type === "image/png" || file.type === "image/jpeg" || file.type === "image/jpg" ? (
                    <img src={URL.createObjectURL(file)} alt={file.name} />
                ) : (
                    <div></div>
                )}
                
                {file.type === "model/gltf-binary" ? (
                    //<a-gltf-model src={URL.createObjectURL(file)} alt={file.name} />
                    <div></div>
                            
                ) : (
                    <div></div>
                )}

                {file.type === "text/plain" ? (
                    <div></div>
                ) : (
                    <div></div>
                )}   
                
            </div>
        );

    }

    // addFile function uses input url to fetch file and render it
    addFile(url: URL) {
       if (url.toString() === "") {
            console.log("Given URL is empty");
            return;
        }
        else {
            try {
               fetch(url)
                .then(response => response.blob())
                .then(blob => {
                this.renderFile(blob);}) 
            }
            catch(error) {
                console.log(error);
            }
        }
    }

    // renderFile function uses input blob to render file in div
    renderFile(input: Blob) {
        const reader = new FileReader();
        reader.readAsDataURL(input);
        reader.onload = function () {
            console.log(reader.result);
            if (input.type === "image/png" || input.type === "image/jpeg" || input.type === "image/jpg") {
                const img = document.createElement("img");
                img.src = reader.result as string;
                const images = document.querySelector(".SharedFiles") as HTMLDivElement;
                images.appendChild(img);
            }
            else if (input.type === "model/gltf-binary") {
                const gltf = document.createElement("a-gltf-model");
                gltf.setAttribute("src", reader.result as string);
                const gltfs = document.querySelector(".SharedFiles") as HTMLDivElement;
                gltfs.appendChild(gltf);
            }
            else if (input.type === "text/plain") {
                return;
                // SSToDO: add text file rendering
            }

        }
        reader.onerror = function (error) {
            console.log('Error: ', error);
        }

    }


    // listfilesURLs function to list the URLs given by the user
    listfileURLs = () => {
        // SSToDo: first fileURL is empty, fix this
        if (this.state.fileURLs.length >= 0 && this.state.fileURLs[0] != null) {
            return (
                this.state.fileURLs.map((a) =>
                <li key={a.href}>
                    <a href={a.href}>{a.href}</a>
                </li>
                )
            );
        }
        else {
            return (
                <li>No files have been added.</li>
            );
        }

    }
 

//<button onClick={() => console.log(window.location.href)}>Print Window Location</button>  

    // Render the dropzone and fileURL input form in a div which will be displayed when the ShareFile icon on the toolbar is selected.
    render() {

        // if the div element exists, clear it before rendering new files
        //const showFilesDiv = document.querySelector(".ShowFiles") as HTMLDivElement;
        //if (showFilesDiv != null) {
           // showFilesDiv.innerHTML = "";
           // console.log("ShowFiles div cleared");
       //}

        const showFiles = this.state.files.map((file) => this.showFile((file)));
        
        const showFileURLs = this.state.fileURLs.map((url) => this.addFile(url));
        
        return(
            <div className="ShareFile">
                <ShareFiles shareFiles={this.setShareFiles}/>
                <div className="SharedFiles">
                    <h4>Shared Files are: </h4>
                    
                    {showFiles}
                    
                    <button onClick={() => showFileURLs}>Show File URLs</button>
                    <ul>
                        {this.listfileURLs()}
                    </ul>
            
                </div>

            </div>
        );

    }
}

export default FileSharing;