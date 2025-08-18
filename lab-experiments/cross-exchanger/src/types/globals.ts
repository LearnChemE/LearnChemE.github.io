import { AnimationLoop } from ".";
import { fanAnimation } from "../ts/animations";

export const FLOWRATE_LIFT = 16; // mL / min

export type vec2 = {
    x: number;
    y: number;
}

export const vec2 = (x: number, y: number): vec2 => {
    return {x: x, y: y};
}

export interface GlobalState {
    pumpIsOn: boolean,
    fanIsOn: boolean,
    lift: number
}

export class GlobalState {
    private animationLoop: AnimationLoop = new AnimationLoop();
    private state = { pumpIsOn: false, fanIsOn: false, lift: 0 };
    
    /**
     * Getters 
     */
    public getPumpStatus = () => { return this.state.pumpIsOn }
    public getFanStatus = () => { return this.state.fanIsOn }
    public getLift = () => { return this.state.lift }

    /**
     * Setters
     */
    public setPumpStatus = (isOn: boolean) => { this.state.pumpIsOn = isOn }
    public setFanStatus = (isOn: boolean) => {
        this.state.fanIsOn = isOn;
        if (isOn) this.animationLoop.add(fanAnimation);
        else this.animationLoop.remove(fanAnimation);
    }
    public setLift = (lift: number) => { this.state.lift = lift }
}

