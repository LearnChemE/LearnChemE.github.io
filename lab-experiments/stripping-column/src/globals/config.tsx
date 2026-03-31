// Configuration constants for the liquid-liquid extraction lab experiment
const urlParams = new URLSearchParams(window.location.search);
const mode = urlParams.get('mode');

export const SIM_MODE = (mode === "absorption" || mode === "meb") ? mode : "stripping";
console.log(SIM_MODE)

export const STAGE_HEIGHT = 32;
export const DEFAULT_NUMBER_OF_STAGES = (SIM_MODE === "meb") ? 4 : 2;
export const ZERO_STAGE_PADDING = 48;

export const COLUMN_BASE_VOL = 8; // L
export const COLUMN_VOL_PER_STAGE = 2; // L

export const FEED_PPM_ABS = 0.01;
export const GAS_PPM_ABS = 10;
export const FEED_PPM_STR = 0.5;
export const GAS_PPM_STR = 0.1;
export const INIT_FEED_PPM = (SIM_MODE === "absorption") ? FEED_PPM_ABS : FEED_PPM_STR;
export const INIT_GAS_PPM = (SIM_MODE === "absorption") ? GAS_PPM_ABS : GAS_PPM_STR;

// Feed
export const INIT_FEED_LIFT = 0.75;
export const FEED_MAX_RATE = 10;

// Gas
export const INIT_GAS_SP = 5;
export const GAS_MAX_RATE = 10;
export const GAS_SP_INTERVAL = 0.5;
export const MAX_PRESSURE = 20;

export const MIN_EFFICIENCY = 50; // %

export const MAX_TANK_VALVE_ROTATION = 360; // degrees

export const MIN_STAGES_MEB = 3;
export const MAX_STAGES_MEB = 5;

// Each simulation will link to eachother
export const STR_LINK = "https://learncheme.github.io/lab-experiments/stripping-column/dist";
export const ABS_LINK = "https://learncheme.github.io/lab-experiments/absorption-column";
export const MEB_LINK = "https://learncheme.github.io/lab-experiments/stripping-absorption-meb";