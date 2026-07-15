import { animate } from "./helpers";

type AnimationFn = (dt: number, t: number) => void;

export class AnimationTimer {
    private playTime: number = 0;
    private playing = false;
    private callbacks: Array<AnimationFn>;

    constructor() {
        this.callbacks = [];
    }

    public subscribe(callback: AnimationFn) {
        this.callbacks.push(callback);
    }

    public play() {
        if (this.playing) return;
        this.playing = true;

        const frame = (dt: number) => {
            if (!this.playing) return false;
            this.playTime += dt;
            this.callbacks.forEach(fn => fn(dt, this.playTime));
            return this.playing;
        }

        animate(frame);
    }
    
    public pause() {
        this.playing = false;
    }

    public reset() {
        this.playing = false;
        this.playTime = 0;
    }
}