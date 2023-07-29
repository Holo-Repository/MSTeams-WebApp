import { InkingManager } from "@microsoft/live-share-canvas";

function appToCanvasPos(inkingManager: InkingManager, pos: { x: number, y: number }): { left: number, top: number } {
    if (!(inkingManager.referencePoint === 'center')) throw new Error('Only center reference point is supported');
    
    const screenCoords = inkingManager.viewportToScreen(pos);
    return { left: screenCoords.x, top: screenCoords.y };
}

function canvasToAppPos(inkingManager: InkingManager, pos: { left: number, top: number }): { x: number, y: number } {
    if (!(inkingManager.referencePoint === 'center')) throw new Error('Only center reference point is supported');
    
    const canvasCoords = { x: pos.left, y: pos.top };
    const viewportCoords = inkingManager.screenToViewport(canvasCoords);
    return { x: viewportCoords.x, y: viewportCoords.y };
}

export {
    appToCanvasPos,
    canvasToAppPos,
}