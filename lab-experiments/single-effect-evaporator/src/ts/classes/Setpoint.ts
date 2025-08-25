import type { ControlType, SetpointControlDescriptor } from "../../types";
import { initButton } from "../helpers";
import { DigitalLabel } from "./Label";

export class SetpointControl<T extends ControlType> {
    private control: T;
    private spLabel: DigitalLabel;
    private outLabel: DigitalLabel;
    private min: number;
    private max: number;
    private step: number;

    constructor(descriptor: SetpointControlDescriptor<T>) {
        this.control = descriptor.ctrl;
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
        this.control.setpoint += this.step; 
        this.control.setpoint = Math.min(this.control.setpoint, this.max);
        this.spLabel.setLabel(this.control.setpoint);
    }
    
    public decrement = () => {
        this.control.setpoint -= this.step; 
        this.control.setpoint = Math.max(this.control.setpoint, this.min);
        this.spLabel.setLabel(this.control.setpoint);
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

    constructor(init: number, tau: number) {
        this.setpoint = init;
        this.value = init;
        this.r = Math.exp(-1/tau);
    }

    iterate = (dt: number) => {
        this.value = (this.value - this.setpoint) * this.r ** dt + this.setpoint;
    };
}