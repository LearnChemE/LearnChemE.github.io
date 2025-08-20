import { AnimationLoop, type AnimationFn } from ".";
import { fanAnimation, makeFlowAnimation, makeThermometerAnimation } from "../ts/animations";
import { Balance } from "./tubes";

export const FLOWRATE_GAIN = 16; // mL / min

export const THERMOMETER_NONE = 0;
export const THERMOMETER_TANK = 1;
export const THERMOMETER_TUBE = 2;

export type vec2 = {
    x: number;
    y: number;
}

export const vec2 = (x: number, y: number): vec2 => {
    return {x: x, y: y};
}


export interface GlobalState {
    animationLoop: AnimationLoop,
    systemBalance: Balance,
    pumpIsOn: boolean,
    fanIsOn: boolean,
    outIsFlowing: boolean,
    lift: number,
    thermTarget: number
}

export class Simulation {
    private state = { animationLoop: new AnimationLoop(), systemBalance: new Balance(), pumpIsOn: false, fanIsOn: false, outIsFlowing: false, lift: 0, thermTarget: THERMOMETER_TANK };

    constructor() {
        // Initialize the constant animation
        this.addAnimation(makeFlowAnimation(this.state));
        this.addAnimation(makeThermometerAnimation(this.state));
    }
    
    /**
     * Getters 
     */
    public getPumpStatus = () => { return this.state.pumpIsOn }
    public getFanStatus = () => { return this.state.fanIsOn }
    public getLift = () => { return this.state.lift }
    public getTTarg = () => { return this.state.thermTarget }
    public addAnimation = (fn: AnimationFn) => { this.state.animationLoop.add(fn) }

    /**
     * Setters
     */
    public setPumpStatus = (isOn: boolean) => { this.state.pumpIsOn = isOn }
    public setFanStatus = (isOn: boolean) => {
        this.state.fanIsOn = isOn;
        if (isOn) this.state.animationLoop.add(fanAnimation);
        else this.state.animationLoop.remove(fanAnimation);
    }
    public setLift = (lift: number) => { this.state.lift = lift }
    public setTTarg = (target: number) => { this.state.thermTarget = target }
}

