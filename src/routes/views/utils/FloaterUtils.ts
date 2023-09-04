import { InkingManager } from "@microsoft/live-share-canvas";

/**
 * This file contains utility functions for floaters.
 * 
 * In all subsequent methods, "app" refers to a quantity in the remote container.
 * While "screen" refers to a quantity in the local coordinate system of the DOM.
 */


export interface FloaterScreenCoords { left: number; top: number; }
export interface FloaterAppCoords { x: number; y: number; }
export interface FloaterAppSize { width: number; height: number; }
export interface FloaterScreenSize { width: number; height: number; }

/**
 * Convert app coordinates to screen coordinates.
 * The inking manager is used to convert between the two coordinate systems.
 * @param inkingManager - The inking manager
 * @param pos - The app coordinates
 * @returns - The screen coordinates
 */
export function appToScreenPos(inkingManager: InkingManager, pos: FloaterAppCoords): FloaterScreenCoords {
    if (inkingManager.referencePoint !== 'center') throw raiseGlobalError(new Error('Only center reference point is supported'));
    try {
        const screenCoords = inkingManager.viewportToScreen(pos);
        return { left: screenCoords.x, top: screenCoords.y };
    } catch (e: any) { throw raiseGlobalError(e) };
}

/**
 * Convert screen coordinates to app coordinates.
 * The inking manager is used to convert between the two coordinate systems.
 * @param inkingManager - The inking manager
 * @param pos - The screen coordinates
 * @returns - The app coordinates
 */
export function screenToAppPos(inkingManager: InkingManager, pos: FloaterScreenCoords): FloaterAppCoords {
    if (inkingManager.referencePoint !== 'center') throw raiseGlobalError(new Error('Only center reference point is supported'));
    try {
        const viewportCoords = inkingManager.screenToViewport({ x: pos.left, y: pos.top });
        return { x: viewportCoords.x, y: viewportCoords.y };
    } catch (e: any) { throw raiseGlobalError(e) };
}

/**
 * Convert app size to screen size.
 * The inking manager is used to convert between the two coordinate systems.
 * @param inkingManager - The inking manager
 * @param pos - The app coordinates
 * @param size - The app size
 * @returns - The screen size
 */
export function appToScreenSize(inkingManager: InkingManager, pos: FloaterAppCoords, size: FloaterAppSize): FloaterScreenSize {
    const screenTopLeft = appToScreenPos(inkingManager, pos);
    const screenBottomRight = appToScreenPos(inkingManager, { x: pos.x + size.width, y: pos.y + size.height });
    return { width: screenBottomRight.left - screenTopLeft.left, height: screenBottomRight.top - screenTopLeft.top };
}

/**
 * Convert screen size to app size.
 * The inking manager is used to convert between the two coordinate systems.
 * @param inkingManager - The inking manager
 * @param pos - The screen coordinates
 * @param size - The screen size
 * @returns - The app size
 */
export function screenToAppSize(inkingManager: InkingManager, pos: FloaterScreenCoords, size: FloaterScreenSize): FloaterAppSize {
    const appTopLeft = screenToAppPos(inkingManager, pos);
    const appBottomRight = screenToAppPos(inkingManager, { left: pos.left + size.width, top: pos.top + size.height });
    return { width: appBottomRight.x - appTopLeft.x, height: appBottomRight.y - appTopLeft.y };
}
