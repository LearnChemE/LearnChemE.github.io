import type { OutletDescriptor } from "../../types";
import { BallValve } from "./BallValve";
import type { DigitalLabel } from "./Label";
import { Waterfall } from "./Waterfall";

export class Outlet {
    private flowrate: number;
    private composition: number;

    private bucketMass: number = 0;
    private bucketComp: number = 0;

    private outFall: Waterfall;
    private measureFall: Waterfall;
    private label: DigitalLabel;

    private measuring: boolean = false;

    constructor (descriptor: OutletDescriptor) {
        if (descriptor.label === null) {
            throw new Error("Error: label must be set in outlet descriptor.");
        }
        this.flowrate = descriptor.flowrate;
        this.composition = descriptor.composition;
        this.outFall = new Waterfall(descriptor.drainWaterfallId);
        this.measureFall = new Waterfall(descriptor.bucketWaterfallId);
        this.label = descriptor.label;

        // Initialize the valve
        new BallValve(descriptor.valveDescriptor.id, descriptor.valveDescriptor.reverse, this.flow);
    }

    private flow = (measure: boolean) => {
        if (measure) {
            this.outFall.stop();
            if (this.flowrate !== 0) this.measureFall.pour();
            this.catchAndWeigh();
        }
        else {
            this.measureFall.stop();
            if (this.flowrate !== 0) this.outFall.pour();
            this.stop();
        }
    }

    private catchAndWeigh = () => {
        if (this.measuring) return;
        console.log("measuring")
        this.measuring = true;

        var prevtime: number | null = null;

        const frame = (time: number) => {
            if (prevtime === null) prevtime = time;
            const deltaTime = time - prevtime;
            prevtime = time;

            const dt = deltaTime / 1000 / 60;
            const dv = this.flowrate * dt;

            // Integrate the mass and composition
            const v = this.bucketMass + dv;
            this.bucketComp = (v !== 0) ? (this.bucketComp * this.bucketMass + this.composition * this.flowrate) / v : 0;
            this.bucketMass += dv;

            this.label.setLabel(this.bucketMass);

            if (this.measuring) requestAnimationFrame(frame);
        }

        requestAnimationFrame(frame)
    }

    private stop = () => {
        this.measuring = false;
    }

    public tare = () => {
        this.bucketMass = 0;
        this.bucketComp = 0;
        this.label.setLabel(0);
    }

    /**
     * Set the current flow conditions
     * @param flowrate mass flowrate in kg/min
     * @param x mole fraction of sucrose
     */
    public setStreamConditions = (flowrate: number, x: number) => {
        this.flowrate = flowrate;
        this.composition = x;

        window.setTimeout(() => {
            this.flow(this.measuring);
            if (flowrate === 0) {
                this.outFall.stop();
                this.measureFall.stop();
            }
        }, 5000);
    }
}