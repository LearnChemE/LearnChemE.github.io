import type { OutletDescriptor } from "../../types";
import { BallValve } from "./BallValve";
import { Waterfall } from "./Waterfall";

export class Outlet {
    private flowrate: number;
    private composition: number;

    private outFall: Waterfall;
    private measureFall: Waterfall;
    private valve: BallValve;


    constructor (descriptor: OutletDescriptor) {
        this.flowrate = descriptor.flowrate;
        this.composition = descriptor.composition;
        this.outFall = new Waterfall(descriptor.drainWaterfallId);
        this.measureFall = new Waterfall(descriptor.bucketWaterfallId);
        this.valve = new BallValve(descriptor.valveDescriptor.id, descriptor.valveDescriptor.reverse, (measure: boolean) => {
            if (measure) {
                this.outFall.stop();
                this.measureFall.pour();
            }
            else {
                this.measureFall.stop();
                this.outFall.pour();
            }
        });

        this.outFall.pour();
    }
}