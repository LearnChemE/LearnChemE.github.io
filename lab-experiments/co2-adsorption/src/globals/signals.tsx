import { createEffect, createMemo, createSignal, onMount, type Accessor, type Setter } from "solid-js";
import { animate, smoothLerp } from "./helpers";
import { SIM_MODE } from "./config";

export type Signal<T> = { get: Accessor<T>, set: Setter<T> };
export function Signal<T>(raw: [() => T, (v: T) => null]) {
    return { get: raw[0], set: raw[1] } as Signal<T>;
}

type GasCylinderDescriptor = {
    name: string;
    x: number;
    angle: number;
    yCO2: number;
    color: string;

    initCylPres: number;
    initRegSP: number;
}

export type GasCylinder = {
    name: string,
    x: number,
    angle: number,
    yCO2: number,
    color: string,

    cylPres: Signal<number>,
    regSP: Signal<number>,
    linePres: Accessor<number>,
};

export function GasCylinder(descriptor: GasCylinderDescriptor) {
    const cylPres = Signal<number>(createSignal(descriptor.initCylPres));
    const regSP = Signal<number>(createSignal(descriptor.initRegSP));
    return {
        name: descriptor.name,
        x: descriptor.x,
        angle: descriptor.angle,
        yCO2: descriptor.yCO2,
        color: descriptor.color,

        cylPres,
        regSP,
        linePres: createMemo(() => Math.min(cylPres.get(), regSP.get()))
    } as GasCylinder;
}

const cylinderDescriptors: GasCylinderDescriptor[] = (SIM_MODE === "adsorption") ? 
// Adsorption: All three cylinders
[
    {
        name: "90%",
        x: 40,
        angle: 180,
        yCO2: 0.9,
        color: "#BF0000",

        initCylPres: 0,
        initRegSP: 0
    }, 
    {
        name: "10%",
        x: 194,
        angle: 90,
        yCO2: 0.1,
        color: "#EA6C6C",

        initCylPres: 0,
        initRegSP: 0
    }, 
    {
        name: "N2",
        x: 348,
        angle: 0,
        yCO2: 0,
        color: "#68A246",

        initCylPres: 0,
        initRegSP: 0
    }
] :
// Desorption: N2 only
[
    {
        name: "90%",
        x: 194,
        angle: 90,
        yCO2: 0.9,
        color: "#BF0000",

        initCylPres: 0,
        initRegSP: 0
    }, 
    {
        name: "N2",
        x: 348,
        angle: 0,
        yCO2: 0,
        color: "#68A246",

        initCylPres: 0,
        initRegSP: 0
    }
];

export function createCylinders() {
    return cylinderDescriptors.map(desc => GasCylinder(desc));
}

export function expSignal(init: number, tau: number, threshold: number = 0.1) {
    const [target, setTarget] = createSignal(init);
    const [actual, setActual] = createSignal(init);
    const r = Math.exp(-1/tau);

    const evaluate = (val: number) => {
        const dist = Math.abs(val - target());
        return dist <= threshold;
    }

    let playing = false;
    const frame = (dt: number) => {
        const nextVal = smoothLerp(actual(), target(), r, dt);
        const done = evaluate(nextVal);
        if (done) {
            setActual(target());
            playing = false;
        }
        else {
            setActual(nextVal);
        }

        return playing;
    }

    const start = () => {
        if (playing) return;
        playing = true;
        animate(frame);
    }

    createEffect(() => {
        target();
        start();
    });
    
    return [actual, setTarget];
}

/**
 * 
 * @param f 
 * @param tau 
 * @param threshold 
 * @returns 
 */
export function expMemo(f: () => number, tau: number = 0.5, threshold: number = 0.1) {
    const target = createMemo(f);
    const [actual, setActual] = createSignal(target());
    const r = Math.exp(-1/tau);

    const evaluate = (val: number) => {
        const dist = Math.abs(val - target());
        return dist <= threshold;
    }

    let playing = false;
    const frame = (dt: number) => {
        const nextVal = smoothLerp(actual(), target(), r, dt);
        const done = evaluate(nextVal);
        if (done) {
            setActual(target());
            playing = false;
        }
        else {
            setActual(nextVal);
        }

        return playing;
    }

    const start = () => {
        if (playing) return;
        playing = true;
        animate(frame);
    }

    createEffect(() => {
        target();
        start();
    });
 
    return actual;
}

class ResetSignal {
    private signal: [Accessor<boolean>, Setter<boolean>] | null = null;

    init() {
        this.signal = createSignal(false);
    }

    triggerSignal() {
        if (this.signal === null) {
            return false;
        }

        const set = this.signal[1];
        set(sig => !sig);
        return true;
    }

    subscribe(callback: () => void) {
        if (this.signal === null) {
            onMount(() => {
                if (this.subscribe(callback) === false) throw new Error("uninitialized ResetSignal")
            });
            return false;
        }

        const get = this.signal[0];
        createEffect(() => {
            get();
            callback();
        });

        return true;
    }
}

export const resetSignal = new ResetSignal();