import { createEffect, createMemo, createSignal, onMount, type Accessor, type Setter } from "solid-js";
import { animate, expDecay, resolveProperty, smoothLerp } from "./helpers";
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

    maxPressure: number;
    rotationRange: number;
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

    maxPressure: number;
    rotationRange: number;
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
        linePres: createMemo(() => Math.min(cylPres.get(), regSP.get())),

        maxPressure: descriptor.maxPressure,
        rotationRange: descriptor.rotationRange
    } as GasCylinder;
}

const cylinderDescriptors: GasCylinderDescriptor[] = (SIM_MODE === "adsorption") ? 
// Adsorption: All three cylinders
[
    // {
    //     name: "90%",
    //     x: 40,
    //     angle: 180,
    //     yCO2: 0.9,
    //     color: "#1cb700",

    //     initCylPres: 0,
    //     initRegSP: 0
    // }, 
    {
        name: "90%",
        x: 194,
        angle: 90,
        yCO2: 0.9,
        color: "#1cb700", // "#5e9b3a",

        initCylPres: 0,
        initRegSP: 0,

        maxPressure: 10,
        rotationRange: 720
    }, 
    {
        name: "10%",
        x: 348,
        angle: 0,
        yCO2: 0.1,
        color: "#93bf79",

        initCylPres: 0,
        initRegSP: 0,

        maxPressure: 10,
        rotationRange: 120
    }
] :
// Desorption: N2 only
[
    {
        name: "90%",
        x: 194,
        angle: 90,
        yCO2: 0.9,
        color: "#1cb700",

        initCylPres: 0,
        initRegSP: 0,

        maxPressure: 6,
        rotationRange: 720
    }, 
    {
        name: "N2",
        x: 348,
        angle: 0,
        yCO2: 0,
        color: "#a2d3e7",

        initCylPres: 0,
        initRegSP: 0,

        maxPressure: 1,
        rotationRange: 720
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
 * Create a memo that automatically creates an animation to create an exponential decay towards values on update. Must be a number signal.
 * @param f memo callback function
 * @param tau time constant (s) or accessor for time constant.
 * @param threshold cutoff threshold (if abs(target - current) <= threshold current jumps to the target value).
 * @returns accessor for exponential
 */
export function expMemo(f: () => number, tau: number | (() => number) = 0.5, threshold: number = 0.1) {
    const target = createMemo(f);
    const [actual, setActual] = createSignal(target());
    tau = resolveProperty(tau);

    const evaluate = (val: number) => {
        const dist = Math.abs(val - target());
        return dist <= threshold;
    }

    let playing = false;
    const frame = (dt: number) => {
        const nextVal = expDecay(actual(), target(), tau(), dt);
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

interface PendingTimeout {
    id: number;
    callTime: number; // timestamp of timeout creation (ms)
}

/**
 * Create a memo that automatically uses window animation and delays to create a first-order-plus-time-delay (FOPTD) response.
 * @param f memo callback function
 * @param tau time constant (s) or accessor for time constant.
 * @param theta time delay (ms)
 * @param threshold cutoff threshold (if abs(target - current) <= threshold current jumps to the target value).
 * @returns accessor for exponential
 */
export function foptdMemo(f: () => number, tau: number | (() => number) = 0.5, theta: number | (() => number) = 1000, threshold: number = 0.1) {
    theta = resolveProperty(theta);
    tau = resolveProperty(tau);
    
    const immediate = createMemo(f);
    const [delayed, setDelayed] = createSignal(immediate());
    const [tauDelayed, setTauDelayed] = createSignal(tau());

    let pending: Array<PendingTimeout> = [];

    interface UpdateData { value: number, tau: number };

    const execute = (id: number, callTime: number, payload: UpdateData) => {
        // Set new value
        setDelayed(payload.value);
        setTauDelayed(payload.tau);
        // Filter list to remove self and any timeouts that were scheduled before self
        pending = pending.filter(t => {
            if (t.id === id) return false; // Remove self from list
            if (t.callTime < callTime) { // If any timeouts remain that were created before this one, clear them
                window.clearTimeout(t.id);
                return false;
            } 
            return true;
        });
    }

    createEffect(() => {
        const newVal = immediate();
        const payload = { value: newVal, tau: tau() };
        
        // Create a new call
        const callTime = Date.now();
        const id = window.setTimeout(() => execute(id, callTime, payload), theta());

        // Add the pending timeout to the array
        pending.push({ id, callTime });
    });
    
    return expMemo(delayed, tauDelayed, threshold);
}
