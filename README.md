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

## HoloCollab Teams App

The HoloCollab Teams App is the central hub of the system, directly interacting with the MS Teams Client to gather user input and display the application's state. It relays state changes to the Azure Fluid Relay for synchronization across all client instances. Additionally, it acts as the host for the 3D Model Viewer Unity App and facilitates communication between the components via a custom interface.

## Azure Fluid Relay

Azure Fluid Relay plays a crucial role as a backend service, synchronizing the application state across all connected clients. It interacts closely with the HoloCollab Teams App, fetching user authentication tokens from the Fluid JWT Provider service to facilitate this synchronization.

## 3D Model Viewer Unity App

The 3D Model Viewer Unity App allows users to retrieve models via directly accessible URLs, and do basic manipulations and annotation on models. This component communicates with both the HoloCollab Teams App for display and the Organ Segmentation Pipeline for data retrieval.

## Organ Segmentation Pipeline

The Organ Segmentation Pipeline focuses on organ segmentation, working in conjunction with MONAI for 3D model generation. This pipeline also involves the Organ Segmentation Storage Accessor, which is responsible for retrieving and storing the segmented 3D models. These models are subsequently fetched by the 3D Model Viewer Unity App for user interaction and display.

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
