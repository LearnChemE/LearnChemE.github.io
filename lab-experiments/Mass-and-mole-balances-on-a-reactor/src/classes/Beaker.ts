import { GetElement } from "../ts/helpers";
import type { Signal } from "./Signal";

export type BeakerDescriptor = {
    fillId: string;
    flowSignal: Signal<number>;
    initialVolume: number;
    maxVolume: number;
    flowOutInstead?: boolean;
}

export class Beaker {
    private fill: SVGRectElement;
    private height: number;
    private y: number;

    private flowrate: number;
    private volume: number;
    private maxVol: number;

    constructor(descriptor: BeakerDescriptor) {
        this.fill = GetElement<SVGRectElement>(descriptor.fillId);
        this.height = Number(this.fill.getAttribute("height")!);
        this.y = Number(this.fill.getAttribute("y")!);

        this.volume = descriptor.initialVolume;
        this.maxVol = descriptor.maxVolume;
        // Signal
        this.flowrate = descriptor.flowSignal.get();
        if (descriptor.flowOutInstead) 
            descriptor.flowSignal.subscribe((flow: number) => { this.flowrate = -flow });
        else
            descriptor.flowSignal.subscribe((flow: number) => { this.flowrate =  flow });

        this.animate();
    }

    private render = () => {
        const h = Math.max(this.volume / this.maxVol * this.height, 0);
        const dy = this.height - h;
        this.fill.setAttribute("y",`${this.y + dy}`);
        this.fill.setAttribute("height",`${h}`);
    }

    private animate = () => {
        let prevtime: number | null = null;

        const frame = (time: number) => {
            if (prevtime === null) prevtime = time;
            const deltaTime = time - prevtime;
            prevtime = time;

            // Integrate the flow each frame
            const dv = this.flowrate * deltaTime / 1000;
            this.volume += dv;
            this.render();

            requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
    }
}