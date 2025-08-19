import { AnimationLoop, type AnimationFn } from ".";
import { fanAnimation, makeFlowAnimation } from "../ts/animations";

export const FLOWRATE_GAIN = 16; // mL / min

export type vec2 = {
    x: number;
    y: number;
}

export const vec2 = (x: number, y: number): vec2 => {
    return {x: x, y: y};
}

export interface GlobalState {
    animationLoop: AnimationLoop,
    pumpIsOn: boolean,
    fanIsOn: boolean,
    lift: number
}

export class Simulation {
    private state = { animationLoop: new AnimationLoop(), pumpIsOn: false, fanIsOn: false, lift: 0 };

    constructor() {
        // Initialize the flow animation
        this.addAnimation(makeFlowAnimation(this.state));
    }
    
    /**
     * Getters 
     */
    public getPumpStatus = () => { return this.state.pumpIsOn }
    public getFanStatus = () => { return this.state.fanIsOn }
    public getLift = () => { return this.state.lift }
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
}

