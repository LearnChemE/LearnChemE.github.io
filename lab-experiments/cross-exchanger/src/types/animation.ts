export type AnimationFn = (dt: number) => void;

export class AnimationLoop {
    private animations: Set<AnimationFn> = new Set();
    private running = false;
    private lastTime = 0;

    private tick = (time: number) => {
        if (!this.running) return;
        const dt = Math.min(time - this.lastTime, 300);
        this.lastTime = time;

        for (const fn of this.animations) {
            fn(dt);
        }

        requestAnimationFrame(this.tick);
    }

    private start = () => {
        if (this.running) return;
        this.running = true;
        this.lastTime = performance.now();
        requestAnimationFrame(this.tick);
    }

    private stop = () => {
        this.running = false;
    }

    public add = (fn: AnimationFn) => {
        this.animations.add(fn);
        if (!this.running) this.start();
    }

    public remove = (fn: AnimationFn) => {
        this.animations.delete(fn);
        if (this.animations.size === 0) this.stop();
    }

    public reset = () => {
        this.stop();
        this.animations.clear();
    }
}