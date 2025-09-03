import { constrain, GetElement } from "../ts/helpers";
import { Signal } from "./Signal";

export type TubeDescriptor = {
    pathId: string,
    inFlowSignal: Signal<number>,
    minDistance?: number,
    maxDistance?: number,
    crossArea?: number,
    initialFill: number,
    reverse?: boolean
};

export class Tube {
    private path: SVGPathElement;
    private inFlow: number;
    private minDistance: number;
    private maxDistance: number;
    private thickness: number;
    private current: number;
    private reverse: boolean;

    public outFlow: Signal<number>;

    constructor(descriptor: TubeDescriptor) {
        // Initialize parameters
        this.path = GetElement<SVGPathElement>(descriptor.pathId);
        this.thickness = (descriptor.crossArea !== undefined) ? descriptor.crossArea : 1;
        this.current = descriptor.initialFill;
        this.minDistance = (descriptor.minDistance !== undefined) ? descriptor.minDistance : 0;
        this.maxDistance = (descriptor.maxDistance !== undefined) ? descriptor.maxDistance : this.path.getTotalLength();
        this.reverse = (descriptor.reverse === true) ? true : false;

        // Set from signal for reactivity
        this.inFlow = descriptor.inFlowSignal.get();
        descriptor.inFlowSignal.subscribe((flow: number) => { this.inFlow = flow });

        // Create output signal
        this.outFlow = new Signal<number>(0);

        // Finally, start animation
        this.animate();
    }

    private animate = () => {
        let prevtime: number | null = null;

        const frame = (time: number) => {
            if (prevtime === null) prevtime = time;
            const deltaTime = time - prevtime;
            prevtime = time;

            const dv = this.inFlow * deltaTime / 60000;
            const dl = dv / this.thickness;
            const current = constrain(this.current + dl, this.minDistance, this.maxDistance);

            // Add attributes, hide by default
            const offset = this.reverse ? current : this.maxDistance - current;
            this.path.setAttribute("stroke-dasharray",  `${this.maxDistance}`);
            this.path.setAttribute("stroke-dashoffset", `${offset}`);
            this.current = current;

            requestAnimationFrame(frame);
        }

        requestAnimationFrame(frame);
    }

}