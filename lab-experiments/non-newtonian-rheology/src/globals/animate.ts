import { createSignal } from "solid-js";
import { animate } from "./helpers";

export type AnimationCallback = (dt: number, t: number) => void;

export abstract class AnimatorBase {
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
        animate(this.frame.bind(this));
    }
    
    public pause() {
        this.playing = false;
    }

    public reset() {
        this.playing = false;
        this.playTime = 0;
        this.callbacks.forEach(callback => callback(0, 0));
    }

    public onFinish(_: () => void) {};
}

export class AnimationTimer extends AnimatorBase {
    constructor(duration?: number) {
        super();
        this.duration = duration;
    }

    protected frame(dt: number) {
        if (!this.playing) return false;
        this.playTime += dt;
        this.callbacks.forEach(fn => fn(dt, this.playTime));
        return this.playing;
    }

    public readonly duration: number | undefined;
}

export class EasedAnimation extends AnimationTimer {
    private delay: number;
    private easing: EasingFn;
    private prevS: number = 0;
    private finishCallbacks: Array<(() => void)>

    constructor(easing: EasingFn, duration: number, delay=0) {
        super(duration);
        this.delay = delay;
        this.easing = easing;
        this.finishCallbacks = [];
    }

    protected frame(dt: number) {
        if (!this.playing) return false;
        this.playTime += dt;
        const t = delayDuration(this.playTime, this.delay, this.duration!);
        const s = this.easing(t);
        const ds = s - this.prevS;
        this.prevS = s;
        this.callbacks.forEach(fn => fn(ds, s));

        if (s >= 1) {
            this.playing = false;
            this.finish();
        }
        return this.playing;
    }

    private finish() {
        this.finishCallbacks.forEach(callback => {
            callback();
        });
    }

    public onFinish(callback: () => void) {
        this.finishCallbacks.push(callback);
    }
}

// type AnimationSegment<T> = T extends AnimatorBase;
type AnimationRecord = Record<string, AnimatorBase>;
export type AnimationSegmentDescriptor = {
    name: string;
    duration: number;
    easing: EasingFn | undefined;
}

export class AnimationSequence extends AnimatorBase {
    private sequence: AnimationRecord = {};
    private first!: AnimatorBase;
    
    constructor(descriptors: Array<AnimationSegmentDescriptor>) {
        super();

        let latest: AnimatorBase | null = null;
        descriptors.forEach(desc => {
            const easing = desc.easing ?? (t => t) as EasingFn;
            const segment = new EasedAnimation(easing, desc.duration);

            // Connect the latest to start the current
            if (latest) latest.onFinish(() => segment.play());
            else this.first = segment;
            latest = segment;

            // Insert into the record
            this.sequence[desc.name] = segment;
        });
    }

    // Stary
    public play() {
        if (this.playing) return;
        this.playing = true;
        
        this.first.play();
    }

    // The holder doesn't need to play. Dummy protected function to uphold class
    protected frame(_: number) {
        return false;
    }

    public reset() {
        this.playing = false;
        this.playTime = 0;
        for (const segment of Object.values(this.sequence)) {
            segment.reset();
        }
    }

    public subscribeTo(key: string, callback: AnimationCallback): void {
        const seg = this.sequence[key];
        if (!seg) {
            console.error(`${key} not found in Animation Sequence`);
            return;
        }

        seg.subscribe(callback);
    }

    public getSegment(name: string) {
        return this.sequence[name];
    }

    public createSolidSignal(segName: string) {
        const seg = this.sequence[segName];
        if (!seg) console.error(`${segName} not found`);

        const [sig, setSig] = createSignal(0);
        seg.subscribe((_,t) => setSig(t));
        return sig;
    }

}

export type EasingFn = (t: number) => number;

export const linear: EasingFn = (t: number) => t;
export const easeInQuad: EasingFn = (t: number) => t * t;
export const easeOutQuad: EasingFn = (t: number) => t * (2 - t);
export const easeInOutQuad: EasingFn = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

// export const createEaseIn = (easing: EasingFn, min = 0, max = 1): EasingFn => {
//     return (t: number) => {
//         const clamped = clamp(t);
//         return min + (max - min) * easing(clamped);
//     };
// };

export function createEaseOut(n: number) {
    return (t: number) => 1 - (1 - t) ** n;
}

// export const createEaseInOut = (easing: EasingFn, min = 0, max = 1): EasingFn => {
//     return (t: number) => {
//         const clamped = clamp(t);
//         if (clamped < 0.5) {
//             return min + (max - min) * 0.5 * easing(clamped * 2);
//         }
//         return min + (max - min) * (0.5 + 0.5 * (1 - easing((1 - clamped) * 2)));
//     };
// };

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

