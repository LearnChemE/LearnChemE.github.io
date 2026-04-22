// Configuration constants for the liquid-liquid extraction lab experiment
const urlParams = new URLSearchParams(window.location.search);
const mode = urlParams.get('mode');

export const SIM_MODE = (mode === "adsorption" || mode === "desorption") ? mode : "adsorption";

export const MIN_MASS_FLOWRATE = 0;
export const MAX_MASS_FLOWRATE = 20;
export const MASS_FLOW_STEP = 0.5;

export const MAX_CYL_VALVE_ROTATION = 360;
export const MAX_PRESSURE = 10; // bar

export const V1_90_ANGLE = 180;
export const V1_10_ANGLE = 90
export const V1_N2_ANGLE = 0;

export const V2_BED_ANGLE = 90;
export const V2_BYPASS_ANGLE = 180;

export const VALVE_1_ANGLES = [V1_90_ANGLE, V1_N2_ANGLE, V1_10_ANGLE];
export const VALVE_2_ANGLES = [V2_BED_ANGLE, V2_BYPASS_ANGLE];

export const BETA_INIT = 4;
export const BETA_MIN = 1;
export const BETA_MAX = 10;
export const BETA_STEP = 1;

export const TEMP_ROOM = 298;
export const TEMP_MAX = 623;