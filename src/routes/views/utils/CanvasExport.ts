import { InkingManager } from "@microsoft/live-share-canvas";
import { FloaterAppCoords, FloaterAppSize, appToScreenPos, appToScreenSize } from "./FloaterUtils";
import { SharedMap } from "fluid-framework";
import html2canvas from "html2canvas";

import { AcceptedFloaterType } from "../floaters/AcceptedFloaterType";
import { AcceptedFileTypes } from "../fileSharing/AcceptedFileTypes";

/* ======================= 
    Known issue with [Jimp import](https://github.com/jimp-dev/jimp/issues/1194#issuecomment-1449287374)
======================= */
import "jimp";
const { Jimp } = window as any;


/**
 * Export a screenshot of the canvas as a base64 string
 * @param canvasRoot - The root element where the canvas is located
 * @param floatersRoot - The root element that contains all the floaters
 * @param inkingManager - The inking manager
 * @param floatersList - The list of floaters as can be found in the SharedCanvas
 * @param thumbnail - Whether or not to generate a thumbnail
 * @returns - A base64 string of the image
 */
export async function exportImageString(
    canvasRoot: HTMLElement, 
    floatersRoot: HTMLElement, 
    inkingManager: InkingManager, 
    floatersList: {key: string, value: { map: SharedMap, lastEditTime: number }}[], 
    thumbnail: boolean = false
) {
    // Render all floaters on a blank image
    const image = new Jimp(inkingManager.clientWidth, inkingManager.clientHeight, 0xFFFFFFFF);
    image.scale(window.devicePixelRatio);
    await renderFloatersOnCanvas(floatersRoot, inkingManager, floatersList, image);
    
    // Render the canvas strokes on the image
    const canvasImage = await renderDOM(canvasRoot);
    if (canvasImage) {
        image.blit(canvasImage, 0, 0);
    }
    
    // Scale down the image if it's too large
    let scale = 1;
    let base64;
    do {
        base64 = await image.getBase64Async(Jimp.MIME_PNG);
        scale *= 0.75;
        image.scale(scale);
    } while (thumbnail && base64.length > 30720)
    
    return base64;
}

/**
 * Render all floaters on a base image.
 * Floaters are ordered by their last edit time.
 * Nothing is returned since the base image is modified in place.
 * @param floatersRoot - The root element that contains all the floaters
 * @param inkingManager - The inking manager
 * @param floatersList - The list of floaters as can be found in the SharedCanvas
 * @param rootImage - The base image to render the floaters on
 */
async function renderFloatersOnCanvas(
    floatersRoot: HTMLElement, 
    inkingManager: InkingManager, 
    floatersList: {key: string, value: { map: SharedMap, lastEditTime: number }}[], 
    rootImage: typeof Jimp,
) {
    // Create a map of floater IDs to their SharedMap
    const floatersMap = Object.fromEntries(floatersList.map((map) => [map.key, map.value.map]));
    // Fetch all floaters from the DOM and associate them with their SharedMap
    const DOMFloaterObjects = Array.from(floatersRoot.children)
        .filter((child) => child.id.startsWith("floater-")).map((child) => {
            const floaterID = child.id.slice("floater-".length);
            const floater = floatersMap[floaterID];
            return {
                map: floater,
                lastEditTime: floater.get('lastEditTime'),
                dom: child as HTMLElement,
            };
        }).sort((a, b) => a.lastEditTime - b.lastEditTime); // Sort by last edit time

    // Render all floaters into images separately
    const DOMImages = (await Promise.all(DOMFloaterObjects.map(async (floater) => { return {
        ...floater,
        image: await renderFloater(floater.map, floater.dom)
    }}))).filter((floater) => floater.image !== undefined);
    console.log(DOMImages);

    // Place all floaters on the base image
    DOMImages.forEach((floater) => {
        placeImageOnImage(inkingManager, floater.map, floater.image, rootImage);
    });
}


/**
 * Generic method to render a floater as a Jimp image
 * @param map - The SharedMap of the floater
 * @param dom - The DOM element of the floater
 * @returns - A Jimp image of the floater
 */
async function renderFloater(map: SharedMap, dom: HTMLElement) {
    const floaterType = map.get('type') as AcceptedFloaterType;
    switch (floaterType) {
        case 'note':
        case 'model':
            return await renderDOM(dom);
        case 'file': return await renderFile(map, dom);
        default: return;
    }
}

/**
 * Render a floater as a Jimp image using html2canvas
 * This is essentially a wrapper around html2canvas and most floaters can use it with no problems.
 * However, when a floater would produce a [tainted](https://html2canvas.hertzen.com/documentation#limitations) 
 * canvas it should instead be rendered using a different method.
 * @param dom 
 * @returns 
 */
async function renderDOM(dom: HTMLElement) {
    const canvas = await html2canvas(dom, { scale: window.devicePixelRatio, backgroundColor: 'transparent' });
    const strippedCanvas = canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
    return await Jimp.read(Buffer.from(strippedCanvas, 'base64')).catch(console.error);
}

/**
 * Render a file as a Jimp image to get around the tainted canvas issue.
 * This is a generic method to handle floaters of type 'file'.
 * Each file type should be handled separately.
 * @param map - The SharedMap of the floater
 * @param dom - The DOM element of the floater
 * @returns - A Jimp image of the floater
 */
async function renderFile(map: SharedMap, dom: HTMLElement) {
    const fileType = map.get('fileType') as AcceptedFileTypes;
    if (fileType === 'image') {
        const imgURL = map.get('url') as string;
        return await Jimp.read(imgURL).catch(console.error);
    } else if (fileType === 'pdf') {
        return await renderDOM(dom);
    }
}

/**
 * Place a Jimp image on another Jimp image.
 * This is used to place floaters on the base image so it makes some assumption for
 * scaling and positioning.
 * It should not be used to place any image on any other image.
 * There is no return value since the base image is modified in place.
 * @param inkingManager - The inking manager
 * @param map - The SharedMap of the floater that generated the image
 * @param image - The Jimp image to place
 * @param rootImage - The Jimp image to place the image on
 */
function placeImageOnImage(inkingManager: InkingManager, map: SharedMap, image: typeof Jimp, rootImage: typeof Jimp) {
    const appPos = map.get('pos') as FloaterAppCoords;
    const appSize = map.get('size') as FloaterAppSize;
    const pos = appToScreenPos(inkingManager, appPos);
    const size = appToScreenSize(inkingManager, appPos, appSize);
    const floaterWidth = size.width * window.devicePixelRatio;
    const floaterHheight = size.height * window.devicePixelRatio;
    image.scaleToFit(floaterWidth, floaterHheight);
    
    // Center the image on the floater because the size from the map refers to the container, not the content
    const widthDiff = floaterWidth - image.bitmap.width;
    const heightDiff = floaterHheight - image.bitmap.height;
    const x = Math.floor(pos.left * window.devicePixelRatio + widthDiff / 2);
    const y = Math.floor(pos.top * window.devicePixelRatio + heightDiff / 2);
    
    rootImage.blit(image, x, y);
}