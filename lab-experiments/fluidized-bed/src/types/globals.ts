export enum ValveSetting {
    RecycleMode = 0,
    CatchAndWeigh = 1
}

export type GlobalState = {
    apparatusDiv: SVGAElement;
    valveSetting: ValveSetting;
    pumpIsRunning: boolean;
    valveLift: number
}

export type vec2 = {
    x: number;
    y: number;
}

export const vec2 = (x: number, y: number): vec2 => {
    return {x: x, y: y};
}