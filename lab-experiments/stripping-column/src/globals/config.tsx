// Configuration constants for the liquid-liquid extraction lab experiment
export const STAGE_HEIGHT = 32;
export const DEFAULT_NUMBER_OF_STAGES = 2;
export const ZERO_STAGE_PADDING = 48;

export const COLUMN_BASE_VOL = 8; // L
export const COLUMN_VOL_PER_STAGE = 2; // L

export const FEED_PPM = .5;
export const GAS_INIT_PPM = .1;

// Feed
export const INIT_FEED_LIFT = 0.75;
export const FEED_MAX_RATE = 10;

// Gas
export const INIT_GAS_SP = 0;
export const GAS_MAX_RATE = 10;
export const GAS_SP_INTERVAL = 0.5;
export const MAX_PRESSURE = 20;

export const MIN_EFFICIENCY = 50; // %

export const MAX_TANK_VALVE_ROTATION = 360; // degrees