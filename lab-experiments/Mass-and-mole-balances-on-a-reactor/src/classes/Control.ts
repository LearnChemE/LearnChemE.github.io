import type { ControlType } from "../types";
import { Signal } from "./Signal";

export type PoweredControllerDescriptor<T extends ControlType> = {
    restingSetpoint: number,
    powerSignal: Signal<boolean>,
    setpointSignal: Signal<number>,
    control: T
};

export class PoweredController<T extends ControlType> {
    private resting: number;
    private power: boolean;
    private setpoint: number;
    private ctrl: T;

    public output: Signal<number>;
    
    constructor(descriptor: PoweredControllerDescriptor<T>) {
        this.resting = descriptor.restingSetpoint;
        this.power = descriptor.powerSignal.get();
        this.setpoint = descriptor.setpointSignal.get();
        this.ctrl = descriptor.control;
        
        // Subscribe to signals
        descriptor.powerSignal.subscribe((on: boolean) => this.togglePower(on));
        descriptor.setpointSignal.subscribe((sp: number) => {
            this.setpoint = sp;
            if (this.power) {
                this.ctrl.setpoint = this.setpoint;
            }
        });

        // Set the initial setpoint
        this.ctrl.set(this.power ? this.setpoint : this.resting);

        // Create a signal for output
        this.output = new Signal<number>(this.ctrl.value);

        // Start the animation loop
        this.animate();
    } 

    public togglePower = (on: boolean) => {
            this.power = on;
            if (on) {
                this.ctrl.setpoint = this.setpoint;
            }
            else {
                this.ctrl.setpoint = this.resting;
            }
    }

    private animate = () => {
        let prevtime: number | null = null;

        const frame = (time: number) => {
            if (prevtime === null) prevtime = time;
            const deltaTime = time - prevtime;
            prevtime = time;

            this.ctrl.iterate(deltaTime);
            this.output.set(this.ctrl.get());

            requestAnimationFrame(frame);
        }

        requestAnimationFrame(frame);
    }
}