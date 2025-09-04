import { initButton } from "../ts/helpers";
import type { ControlType, SetpointControlDescriptor } from "../types";
import { DigitalLabel } from "./Label";

export class SetpointControl<T extends ControlType> {
    private control: T;
    private displayPoint: number;
    private spLabel: DigitalLabel;
    private outLabel: DigitalLabel;
    private min: number;
    private max: number;
    private step: number;

    private savedVal: number | null = null;

    constructor(descriptor: SetpointControlDescriptor<T>) {
        if (descriptor.ctrl === null) {
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
        if (this.savedVal !== null) return;
        const sp = Math.min(this.displayPoint + this.step, this.max);
        this.displayPoint = sp;
        this.spLabel?.setLabel(sp);
        this.control.set(sp);
    }
    
    public decrement = () => {
        if (this.savedVal !== null) return;
        const sp = Math.max(this.displayPoint - this.step, this.min);
        this.displayPoint = sp;
        this.spLabel?.setLabel(sp);
        this.control.set(sp);
    }

    private animate = (delay: number) => {
        setTimeout(() => {
            this.control.iterate(delay);
            this.outLabel?.setLabel(this.control.value);
            this.animate(delay);
        }, delay);
    }

    public togglePower = (saveVal?: number) => {
        console.log(`${saveVal}`);
        if (this.savedVal === null) {
            if (saveVal === undefined) {
                console.warn("No value saved!");
                return;
            }
            this.savedVal = this.displayPoint;
            this.displayPoint = saveVal;
            this.spLabel?.setLabel(saveVal);
            this.control.set(saveVal);
        }
        else {
            this.displayPoint = this.savedVal;
            this.spLabel?.setLabel(this.savedVal);
            this.control.set(this.savedVal);
            this.savedVal = null;
        }
        console.log(`Saved: ${this.savedVal}`)
    }
}

export class FirstOrder implements ControlType {
    setpoint: number;
    value: number;

    private r: number;
    private th: number;
    private gain: number;

    constructor(init: number, tau: number, th=0, gain=1) {
        this.setpoint = init;
        this.value = init;
        this.r = Math.exp(-1/tau);
        this.th = th;
        this.gain = gain;
    }

    /**
     * Change the setpoint value after a time delay.
     * @param val New setpoint value
     * @param th delay time (ms)
     */
    public set = async (val: number, th?: number) => {
        if (th === undefined) th = this.th;
        setTimeout(() => {
            this.setpoint = val;
        }, th);
    }

    public get = () => {
        return this.value * this.gain;
    }

    /**
     * Iterate the transfer function and return the new value
     * @param dt 
     */
    iterate = (dt: number) => {
        this.value = (this.value - this.setpoint) * this.r ** dt + this.setpoint;
        if (Math.abs(this.setpoint - this.value) < 0.01) this.value = this.setpoint;
        return this.value;
    };
}
