import { Manometer } from "./manometer";

export enum ValveSetting {
    RecycleMode = 0,
    CatchAndWeigh = 1
}

export type GlobalState = {
    apparatusDiv: SVGAElement;
    valveSetting: ValveSetting;
    initialFill: boolean;
    pumpIsRunning: boolean;
    valveLift: number;
    valve2isDisabled: boolean;
}

export type vec2 = {
    x: number;
    y: number;
}

export const vec2 = (x: number, y: number): vec2 => {
    return {x: x, y: y};
}

export const BED_DIAMETER = 1.588; // cm
export const CROSS_AREA_BED = 1.981 // cm^2
export const PUMP_VELOCITY_GAIN = 7; // cm / s @ lift==1 (superficial)
export const PUMP_PRESSURE_GAIN = 45; // cm water / valve lift
export const PUMP_FLOWRATE_GAIN = PUMP_VELOCITY_GAIN * Math.PI * BED_DIAMETER**2 / 4; // Flowrate at lift==1