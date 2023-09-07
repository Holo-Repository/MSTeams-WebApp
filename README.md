# Introduction
HoloCollab is a software aimed at professionals with the primary goals of facilitating remote collaboration and enabling advanced insights through the use of interactive 2D and 3D resources.
The primary use cases focus on supporting multidisciplinary teams (MDT), merging the functionalities of multiple apps into a single cohesive environment.
Concretely, this resulted in a Microsoft Teams app that provides multiple whiteboards where meeting participants can collaboratively annotate and place additional resources like images, PDFs, text notes, and 3D models.
All interactions are synchronized across clients using Azure Fluid containers and the LiveShare SDK, and each member is served with the same shared app state rendered using React and Fluent UI elements.
Additionally, leveraging previous UCL projects under the HoloRepository umbrella, as well as state-of-the-art machine learning models from MONAI, we provided an avenue tailored to the needs of medical professionals to produce organ-segment 3D models from raw DICOM scans.
The models can then be imported into the collaborative environment, which provides a globally synchronized view of the 3D volumes handling rotation, scaling, and drawing on the model’s texture.

# Showcase 
Demonstration videos and a list of features

# Architecture

![System Diagram](./public/AchitectureDiagram.png)

The HoloCollab system consists of multiple sub-components and remains open to future extensions. Currently, core components are:

### [HoloCollab Teams App](https://github.com/Holo-Repository/MSTeams-WebApp)

The HoloCollab Teams App serves as the system's core, working directly with the MS Teams Client to collect user input and display the app's current state. It not only hosts the 3D Model Viewer Unity App but also coordinates communication between various components through a custom interface. Alongside this, it uses Azure Fluid Relay for real-time state synchronization across all client instances, which also handles user authentication through the Fluid JWT Provider service.


### [3D Model Viewer Unity App](https://github.com/Holo-Repository/Unity3D-ModelViewer)

The 3D Model Viewer Unity App allows users to retrieve models via directly accessible URLs, and do basic manipulations and annotation on models. This component communicates with both the HoloCollab Teams App for display and the Organ Segmentation Storage Accessor for data retrieval.

### [Organ Segmentation Pipeline](https://github.com/Holo-Repository/OrganSegmentation-Pipeline)
The Organ Segmentation Pipeline is the backbone for 3D model creation, working in conjunction with MONAI and Organ segmentation Storage Accessor to create segmented 3D models from DICOM scans. It was originally a part of the HoloRepository but was later modified to handle the computational demands of MONAI.

### [Organ Segmentation Storage Accessor](https://github.com/Holo-Repository/OrganSegmentation-StorageAccessor)
Serving as an intermediary between storage and retrieval, the Organ Segmentation Storage Accessor is responsible for fetching the segmented 3D models from the Azure storage accoun. This makes it easier for other components to interact with storage without diving deep into the specifics of the storage architecture.

### [Organ Segmentation Model](https://github.com/Holo-Repository/OrganSegmentation-Model#run-docker-and-connect-docker-to-the-port-5000)
The Organ Segmentation Model is powered by MONAI and is deployed as part of a Flask webapp on Azure. It uses a neural network to perform segmentation on abdominal CT scans. The model processes the input it receives from the pipeline webapp and sends the segmented results back for further utilization.

# Installation


## Requirements


## Unity


## HoloRepository

### Provisioning

### Deployment


## HoloCollab

### Provisioning

### Deployment

### Publishing

# Maintenance

# Contacts

# References

* [Extend a Teams personal tabs across Microsoft 365](https://docs.microsoft.com/microsoftteams/platform/m365-apps/extend-m365-teams-personal-tab?tabs=manifest-teams-toolkit)
* [Teams Toolkit Documentations](https://docs.microsoft.com/microsoftteams/platform/toolkit/teams-toolkit-fundamentals)
* [Teams Toolkit CLI](https://docs.microsoft.com/microsoftteams/platform/toolkit/teamsfx-cli)
* [TeamsFx SDK](https://docs.microsoft.com/microsoftteams/platform/toolkit/teamsfx-sdk)
* [Teams Toolkit Samples](https://github.com/OfficeDev/TeamsFx-Samples)
