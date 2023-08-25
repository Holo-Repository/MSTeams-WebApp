/**
 * Fuse is a class that allows you to use a value only a certain number of times.
 */
export default class Fuse<T> {
    private _value: T;
    private uses: number;

    /**
     * @param value The value to be used.
     * @param uses The number of times the value can be used. Defaults to 1.
     * @throws Error if uses is less than or equal to 0.
     */
    constructor(value: T, uses: number = 1) {
        this._value = value;
        this.uses = uses;
        if (uses <= 0) throw new Error("Fuse uses must be greater than 0");
    }

    /**
     * Returns the value if the number of uses is greater than 0, otherwise returns undefined.
     * @returns The value if the number of uses is greater than 0, otherwise returns undefined.
     */
    public get value(): T | undefined {
        console.log(this.uses, this._value);
        this.uses--;
        if (this.uses < 0) return undefined;
        else return this._value;
    }
}