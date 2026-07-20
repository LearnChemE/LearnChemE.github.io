import { animate } from "./helpers";

export type AnimationCallback = (dt: number, t: number) => void;

abstract class AnimatorBase {
    protected playTime: number = 0;
    protected playing = false;
    protected callbacks: Array<AnimationCallback>;

    constructor() {
        this.callbacks = [];
    }

    protected abstract frame(dt: number, t: number): boolean;

    public subscribe(callback: AnimationCallback) {
        this.callbacks.push(callback);
    }

    public play() {
        if (this.playing) return;
        this.playing = true;
        animate(this.frame);
    }
    
    public pause() {
        this.playing = false;
    }

    public reset() {
        this.playing = false;
        this.playTime = 0;
    }
}

export class AnimationTimer extends AnimatorBase {
    protected frame(dt: number) {
        if (!this.playing) return false;
        this.playTime += dt;
        this.callbacks.forEach(fn => fn(dt, this.playTime));
        return this.playing;
    }
}

export class EasedAnimation extends AnimationTimer {
    private duration: number;
    private delay: number;
    private easing: EasingFn;
    private prevS: number = 0;

    constructor(easing: EasingFn, duration: number, delay=0) {
        super();
        this.duration = duration;
        this.delay = delay;
        this.easing = easing;
    }

    protected frame(dt: number) {
        if (!this.playing) return false;
        this.playTime += dt;
        const t = delayDuration(this.playTime, this.delay, this.duration);
        const s = this.easing(t);
        const ds = s - this.prevS;
        this.prevS = s;
        this.callbacks.forEach(fn => fn(ds, s));
        return this.playing;
    }
}

export type EasingFn = (t: number) => number;

const clamp = (t: number) => Math.min(Math.max(t, 0), 1);

export const createEaseIn = (easing: EasingFn, min = 0, max = 1): EasingFn => {
    return (t: number) => {
        const clamped = clamp(t);
        return min + (max - min) * easing(clamped);
    };
};

export const createEaseOut = (easing: EasingFn, min = 0, max = 1): EasingFn => {
    return (t: number) => {
        const clamped = clamp(t);
        return min + (max - min) * (1 - easing(1 - clamped));
    };
};

export const createEaseInOut = (easing: EasingFn, min = 0, max = 1): EasingFn => {
    return (t: number) => {
        const clamped = clamp(t);
        if (clamped < 0.5) {
            return min + (max - min) * 0.5 * easing(clamped * 2);
        }
        return min + (max - min) * (0.5 + 0.5 * (1 - easing((1 - clamped) * 2)));
    };
};

export const step = (t: number) => {
    return (t < 0) ? 0 : 1;
}
export const delay = (t: number, by?: number) => {
    by = by ?? 0;
    return step(t - by) * (t - by);
}
export const delayDuration = (t: number, delayAmt: number, duration: number) => {
    const delayed = delay(t, delayAmt);
    const normalized = delayed / duration;
    return Math.min(normalized, 1);
}

