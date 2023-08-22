/**
 * Accepted types of floaters.
 */
export type AcceptedFloaterType = 'model' | 'file' | 'note';

/**
 * Interface for a floater object.
 * It lists the minimum properties that a floater object should have.
 * This is intended to be used with the FloaterLoader hook
 * and be customized to fit the data needs of the floater resource being loaded.
 */
export default interface IFloaterObject {
    type: string;
    pos: { x: number, y: number };
    size: { width: number, height: number };
}

/**
 * Keys of the SharedMap for a floater.
 */
export const FloaterKeys = {
    type: "type",
    pos: "pos",
    size: "size",
    lastEditTime: "lastEditTime",
} as const;