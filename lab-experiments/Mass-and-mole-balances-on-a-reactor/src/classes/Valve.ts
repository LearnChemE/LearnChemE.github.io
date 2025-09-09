import { vec2 } from "../ts/helpers";
import { Signal } from "./Signal";

export class BallValve {
    private handle: SVGGElement;
    private state = false;
    private onTurn: ((state:boolean) => void) | undefined;
    private angle = 0;
    private turnAngle = 90;
    private coords: { x: number, y: number };

    // Output
    public turned: Signal<boolean>;

    constructor(id: string, reverse=false, onTurn?: (state: boolean) => void, offset?: vec2) {
        const handle = document.getElementById(id)! as unknown as SVGGElement;
        handle.classList.add("svg-valve");
        handle.addEventListener("click", this.toggleState);
        this.handle = handle;
        this.onTurn = onTurn;

        const bbox = handle.getBBox();
        const dx = (offset !== undefined) ? offset.x : 0;
        const dy = (offset !== undefined) ? offset.y : 0;
        this.coords = { x: bbox.x + bbox.width * .5 + dx , y: bbox.y + bbox.height / 2 + dy };
        if (reverse) this.turnAngle = -90;

        // Create output signal
        this.turned = new Signal<boolean>(false);

        // Set initial transform
        this.handle.setAttribute("transform", `rotate(${0} ${this.coords.x} ${this.coords.y})`);
    }

    public getState = () => {return this.state}
    private toggleState = () => {
        this.state = !this.state;
        this.turned.set(this.state);
        this.onTurn?.(this.state);
        this.animate();
    }

    private animate = () => {

        let prevtime: number | null = null;
        const r = Math.exp(-1/100);

        const frame = (time: number) => {
            // Get time
            if (prevtime === null) prevtime = time;
            const deltaTime = time - prevtime!;
            prevtime = time;

            // Find target angle
            const target = this.state ? this.turnAngle : 0;
            const angle = this.angle;
            // Lerp towards target
            const newAngle = (angle - target) * r ** deltaTime + target;

            // Set transform
            this.handle.setAttribute("transform", `rotate(${newAngle} ${this.coords.x} ${this.coords.y})`);
            this.angle = newAngle;

            // Request next frame
            if (Math.abs(newAngle - target) < 0.1) this.angle = target;
            else requestAnimationFrame(frame);
        }

        requestAnimationFrame(frame);
    }
}
