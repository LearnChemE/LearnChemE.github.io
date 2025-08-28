import type { ControlType, SetpointControlDescriptor } from "../../types";
import { initButton } from "../helpers";
import { DigitalLabel } from "./Label";

export class SetpointControl<T extends ControlType> {
    private control: T;
    private displayPoint: number;
    private spLabel: DigitalLabel;
    private outLabel: DigitalLabel;
    private min: number;
    private max: number;
    private step: number;

    constructor(descriptor: SetpointControlDescriptor<T>) {
        if (descriptor.ctrl === null) {
            throw new Error("Error: null control object on Setpoint Descriptor");
        }
        if (descriptor.spLabel === null || descriptor.outLabel === null) {
            throw new Error("Error: null control object on Setpoint Descriptor");
        }
        this.control = descriptor.ctrl;
        this.displayPoint = this.control.setpoint;
        this.spLabel = descriptor.spLabel;
        this.outLabel = descriptor.outLabel;
        this.min  = descriptor.min;
        this.max  = descriptor.max;
        this.step = descriptor.step;

        initButton(descriptor.upBtnId, this.increment);
        initButton(descriptor.downBtnId, this.decrement);

        this.animate(500);
    }

    public increment = () => {
        const sp = Math.min(this.displayPoint + this.step, this.max);
        this.displayPoint = sp;
        this.spLabel.setLabel(sp);
        this.control.setTimeDelay(sp);
    }
    
    public decrement = () => {
        const sp = Math.max(this.displayPoint - this.step, this.min);
        this.displayPoint = sp;
        this.spLabel.setLabel(sp);
        this.control.setTimeDelay(sp);
    }

    private animate = (delay: number) => {
        setTimeout(() => {
            this.control.iterate(delay);
            this.outLabel.setLabel(this.control.value);
            this.animate(delay);
        }, delay);
    }
}

export class FirstOrder implements ControlType {
    setpoint: number;
    value: number;

    private r: number;
    private th: number;

    constructor(init: number, tau: number, th=0) {
        this.setpoint = init;
        this.value = init;
        this.r = Math.exp(-1/tau);
        this.th = th;
    }

    public setTimeDelay = async (val: number, th?: number) => {
        if (th === undefined) th = this.th;
        setTimeout(() => {
            this.setpoint = val;
        }, th);
    }

    iterate = (dt: number) => {
        this.value = (this.value - this.setpoint) * this.r ** dt + this.setpoint;
        if (Math.abs(this.setpoint - this.value) < 0.01) this.value = this.setpoint;
    };
}
