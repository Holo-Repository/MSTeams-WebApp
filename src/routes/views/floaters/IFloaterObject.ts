export default interface IFloaterObject {
    type: string;
    pos: { x: number, y: number };
    size: { width: number, height: number };
    lastEditTime: number;
}