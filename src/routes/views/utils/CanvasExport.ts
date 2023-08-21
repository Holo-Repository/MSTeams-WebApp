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


export async function exportImageString(
    canvasRoot: HTMLElement, 
    floatersRoot: HTMLElement, 
    inkingManager: InkingManager, 
    floatersList: {key: string, value: { map: SharedMap, lastEditTime: number }}[], 
    thumbnail: boolean = false
) {
    const image = new Jimp(inkingManager.clientWidth, inkingManager.clientHeight, 0xFFFFFFFF);
    let scale = window.devicePixelRatio;
    image.scale(scale);
    await renderFloatersOnCanvas(floatersRoot, inkingManager, floatersList, image);
    
    const canvasImage = await renderDOM(canvasRoot);
    if (canvasImage) {
        image.blit(canvasImage, 0, 0);
    }
    
    let base64;
    do {
        base64 = await image.getBase64Async(Jimp.MIME_PNG);
        scale /= 2;
        image.scale(scale);
    } while (thumbnail && base64.length > 30720)
    
    return base64;
}


async function renderFloatersOnCanvas(
    floatersRoot: HTMLElement, 
    inkingManager: InkingManager, 
    floatersList: {key: string, value: { map: SharedMap, lastEditTime: number }}[], 
    rootImage: typeof Jimp,
) {
    const floatersMap = Object.fromEntries(floatersList.map((map) => [map.key, map.value.map]));
    const DOMFloaterObjects = Array.from(floatersRoot.children)
        .filter((child) => child.id.startsWith("floater-")).map((child) => {
            const floaterID = child.id.slice("floater-".length);
            const floater = floatersMap[floaterID];
            return {
                map: floater,
                lastEditTime: floater.get('lastEditTime'),
                dom: child as HTMLElement,
            };
        }).sort((a, b) => a.lastEditTime - b.lastEditTime);

    const DOMImages = (await Promise.all(DOMFloaterObjects.map(async (floater) => { return {
        ...floater,
        image: await renderFloater(floater.map, floater.dom)
    }}))).filter((floater) => floater.image !== undefined);
    console.log(DOMImages);

    DOMImages.forEach((floater) => {
        placeImageOnImage(inkingManager, floater.map, floater.image, rootImage);
    });
}


async function renderFloater(map: SharedMap, dom: HTMLElement) {
    const floaterType = map.get('type') as AcceptedFloaterType;
    switch (floaterType) {
        case 'note':
        case 'model':
            return await renderDOM(dom);
        case 'file': return await renderFile(map);
        default: return;
    }
}

async function renderDOM(dom: HTMLElement) {
    const canvas = await html2canvas(dom, { scale: window.devicePixelRatio, backgroundColor: 'transparent' });
    const strippedCanvas = canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
    return await Jimp.read(Buffer.from(strippedCanvas, 'base64')).catch(console.error);
}

async function renderFile(map: SharedMap) {
    const imgURL = map.get('url') as string;
    return await Jimp.read(imgURL).catch(console.error);
}

function placeImageOnImage(inkingManager: InkingManager, map: SharedMap, image: typeof Jimp, rootImage: typeof Jimp) {
    const appPos = map.get('pos') as FloaterAppCoords;
    const appSize = map.get('size') as FloaterAppSize;
    const pos = appToScreenPos(inkingManager, appPos);
    const size = appToScreenSize(inkingManager, appPos, appSize);
    const floaterWidth = size.width * window.devicePixelRatio;
    const floaterHheight = size.height * window.devicePixelRatio;
    image.scaleToFit(floaterWidth, floaterHheight);
    
    const widthDiff = floaterWidth - image.bitmap.width;
    const heightDiff = floaterHheight - image.bitmap.height;
    const x = Math.floor(pos.left * window.devicePixelRatio + widthDiff / 2);
    const y = Math.floor(pos.top * window.devicePixelRatio + heightDiff / 2);
    
    rootImage.blit(image, x, y);
}