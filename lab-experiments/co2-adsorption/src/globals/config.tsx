// Configuration constants for the liquid-liquid extraction lab experiment
// const urlParams = new URLSearchParams(window.location.search);
// const mode = urlParams.get('mode');

// export const SIM_MODE = (mode === "absorption" || mode === "meb") ? mode : "stripping";

export const MIN_MASS_FLOWRATE = 0;
export const MAX_MASS_FLOWRATE = 20;
export const MASS_FLOW_STEP = 0.5;

export const MAX_CYL_VALVE_ROTATION = 360;
export const MAX_PRESSURE = 10; // bar

export const VALVE_1_ANGLES = [180, 0, 90];
export const VALVE_2_ANGLES = [180, 90];

export const BETA_INIT = 4;
export const BETA_MIN = 1;
export const BETA_MAX = 10;
export const BETA_STEP = 1;

export const TEMP_ROOM = 298;
export const TEMP_MAX = 623;