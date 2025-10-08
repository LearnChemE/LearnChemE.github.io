import { AnimationLoop, type AnimationFn } from ".";
import { fanAnimation, makeFlowAnimation, makeThermometerAnimation } from "../ts/animations";
import { Balance } from "./calcs";
declare const __DEV__: boolean;

export const FLOWRATE_GAIN = 37.5; // mL / s

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
    therm1Target: boolean, // "false" for front, "true" for back
    therm2Target: number,
    liqInHex: boolean
}

export class Simulation {
    private state = { animationLoop: new AnimationLoop(), systemBalance: new Balance(), pumpIsOn: false, fanIsOn: false, outIsFlowing: false, lift: 0, therm1Target: false, therm2Target: THERMOMETER_TANK, liqInHex: false };

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
    public getT1Targ = () => { return this.state.therm1Target }
    public getT2Targ = () => { return this.state.therm2Target }
    public getLiqInHex = () => { return this.state.liqInHex }
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
    public setT1Targ = (target: boolean) => { this.state.therm1Target = target }
    public setT2Targ = (target: number) => { this.state.therm2Target = target }
    public setLiqInHex = (isThere: boolean) => { this.state.liqInHex = isThere }

    public reset = () => {
        // Reset some interactions
        this.state.fanIsOn = false;
        this.state.pumpIsOn = false;
        this.state.outIsFlowing = false;
        // Reset balance
        const bal = this.state.systemBalance;
        bal.reset();
        // Recreate animations
        this.state.animationLoop.reset();
        // Re-initialize constant animations
        this.addAnimation(makeFlowAnimation(this.state));
        this.addAnimation(makeThermometerAnimation(this.state));
    }

    public getInfo = () => {
        return this.state;
    }
    
}

