import type { FluidType, PlayState } from "./enums";
import type { Renderer } from "p5";

export type GlobalState = {
    canvas: Renderer | undefined;

    playState: PlayState;
    fluidType: FluidType;

    linePressure: number;
    lineTemperature:number;
    tankPressure: number;
};

export type col4 = [r: number, g: number, b: number, a: number];