export class Signal<T> {
    private value: T;
    private _listeners: Array<(val: T) => void> = [];

    constructor(val: T) {
        this.value = val;
    }

    public set = (val: T) => {
        this.value = val;
        for (const fn of this._listeners) {
            fn(val);
        }
    }

    public get = () => {
        return this.value;
    }

    public subscribe = (fn: (val: T) => void) => {
        this._listeners.push(fn);
    }
}
