import { createMemo, createSignal, type Accessor, type Setter } from "solid-js";

type Signal<T> = [get: Accessor<T>, set: Setter<T>];

export class GasCylinder {
    public name: string;
    public x: number;

    private cylPres: Signal<number>;
    private regSP: Signal<number>;
    public linePres: Accessor<number>;

    constructor(name: string, x: number) {
        this.name = name;
        this.x = x;
        this.cylPres = createSignal(0);
        this.regSP = createSignal(0);
        this.linePres = createMemo(() => Math.min(this.cylPres[0](), this.regSP[0]()));
    }

    public getCylPres = () => { console.log(this);return this.cylPres[0]() }
    public setCylPres = ((val: number) => { this.cylPres[1](val) }) as Setter<number>
    public getRegSP = () => { return this.regSP[0]() }
    public setRegSP = ((val: number) => { this.regSP[1](val) }) as Setter<number>
};