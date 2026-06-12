// Configuration constants for the liquid-liquid extraction lab experiment
const urlParams = new URLSearchParams(window.location.search);
const mode = urlParams.get('mode');

export const SIM_MODE = (mode === "adsorption" || mode === "desorption") ? mode : "adsorption";

export const MIN_SCCM_FLOWRATE = 5;
export const MAX_SCCM_FLOWRATE = 200;
export const SCCM_FLOW_STEP = 5;
export const SCCM_FLOW_INIT = (SIM_MODE === "adsorption") ? MAX_SCCM_FLOWRATE / 2 : MAX_SCCM_FLOWRATE;

export const MAX_CYL_VALVE_ROTATION = 360;
export const MAX_PRESSURE = (SIM_MODE === "adsorption") ? 10 : 1; // bar
export const MAX_NEEDLE_PRESSURE = 10; // bar
export const REG_ROTATION_RANGE = (SIM_MODE === "adsorption") ? 720 : 120; // degrees

export const V1_90_ANGLE = 180;
export const V1_10_ANGLE = 90;
export const V1_N2_ANGLE = 0;
export const V1_ANGLE_INIT = (SIM_MODE === "adsorption") ? V1_N2_ANGLE : V1_10_ANGLE;

export const V2_BED_ANGLE = 90;
export const V2_BYPASS_ANGLE = 180;
export const V2_ANGLE_INIT = V2_BYPASS_ANGLE;

export const VALVE_1_ANGLES = (SIM_MODE === "adsorption") ? [V1_90_ANGLE, V1_N2_ANGLE, V1_10_ANGLE] : [V1_N2_ANGLE, V1_10_ANGLE];
export const VALVE_2_ANGLES = [V2_BED_ANGLE, V2_BYPASS_ANGLE];

export const BETA_INIT = 2.0;
export const BETA_MIN  = 0.3;
export const BETA_MAX  = 3.0;
export const BETA_STEP = 0.1;

export const TEMP_ROOM = 298;
export const TEMP_MAX = 700;