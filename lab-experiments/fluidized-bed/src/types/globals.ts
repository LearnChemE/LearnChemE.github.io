import { Manometer } from "./manometer";

export enum ValveSetting {
    RecycleMode = 0,
    CatchAndWeigh = 1
}

export type GlobalState = {
    apparatusDiv: SVGAElement;
    valveSetting: ValveSetting;
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
export const PUMP_PRESSURE_GAIN = 30; // cm water / valve lift
export const PUMP_FLOWRATE_GAIN = 16; // Flowrate at lift==1