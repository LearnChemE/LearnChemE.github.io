import { createEffect, createMemo, createSignal, onMount, type Accessor, type Setter } from "solid-js";
import { animate, expDecay, resolveProperty } from "./helpers";

export type Signal<T> = { get: Accessor<T>, set: Setter<T> };
export function Signal<T>(raw: [() => T, (v: T) => null]) {
    return { get: raw[0], set: raw[1] } as Signal<T>;
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
