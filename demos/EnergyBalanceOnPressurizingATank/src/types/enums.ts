export const PlayState = {
    NOT_PLAYED: 0,
    PLAYED: 1
};
export type PlayState = (typeof PlayState)[keyof typeof PlayState];

export const FluidType = {
    WATER: 0,
    IDEAL_GAS: 1
};
export type FluidType = (typeof FluidType)[keyof typeof FluidType];


export const TANK_TEMPERATURE = 100; // C