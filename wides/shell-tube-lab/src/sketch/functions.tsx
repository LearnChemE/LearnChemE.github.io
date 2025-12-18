import { P5CanvasInstance } from "@p5-wrapper/react";
import { g } from "./sketch";

export const ANIMATION_TIME = 2500; // ms

// Constants used in calculations
const HYDRAULIC_DIAMETER_SHELL = ((0.0127 * 0.08) / 2) * (0.0127 + 0.08); // m
const INNER_TUBE_DIAMETER = 0.00457; // m
const OUTER_TUBE_DIAMETER = 0.00635; // m
const TUBE_CROSS_SECTION_AREA = (Math.PI * INNER_TUBE_DIAMETER ** 2) / 4;
const SHELL_CROSS_SECTION_AREA =
  0.0127 * 0.08 - (Math.PI * OUTER_TUBE_DIAMETER ** 2) / 4; // m^2
const DYNAMIC_VISCOSITY_H = 6.06e-7; // m^2 / s
const DYNAMIC_VISCOSITY_C = 9e-5; // m^2 / s
const PR_COLD = 6.62; // kJ / kg / K
const PR_HOT = 4.02; // kJ / kg / K
// const TUBE_LENGTH = 0.137; // m
const CONDUCTIVITY_COLD_WATER = 0.5984; // W / m / K
const CONDUCTIVITY_HOT_WATER = 0.6186; // W / m / K
const HEX_AREA = 109; // cm2

// Flowrates
export const MAX_HOT_WATER_TEMP = 40.0;
export const MIN_HOT_WATER_TEMP = 50.0;
export const MAX_COLD_WATER_TEMP = 25.0;
export const MIN_COLD_WATER_TEMP = 15.0;
export const MAX_HOT_FLOWRATE = 28.0;
export const MIN_HOT_FLOWRATE = 24.0;
export const MAX_COLD_FLOWRATE = 36.0;
export const MIN_COLD_FLOWRATE = 30.0;

/* ********************************************************************* */
/* ** This file holds calculations for heat transfer and outlet temps ** */
/* ********************************************************************* */

// Basic lerp function, throws error if amount isn't on range [0,1]
export function lerp(start: number, end: number, amount: number): number {
  if (amount < 0 || amount > 1) {
    throw new Error("Lerp amount must be between 0 and 1");
  }
  return start + (end - start) * amount;
}

// Generate Random Value from min to max
const rand = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

// Randomize temp and flowrate values in g
export function randStartVals() {
  g.Th_in = rand(MIN_HOT_WATER_TEMP,  MAX_HOT_WATER_TEMP);
  g.mDotH = rand(MIN_HOT_FLOWRATE,    MAX_HOT_FLOWRATE);
  g.Tc_in = rand(MIN_COLD_WATER_TEMP, MAX_COLD_WATER_TEMP);
  g.mDotC = rand(MIN_COLD_FLOWRATE,   MAX_COLD_FLOWRATE);
}

function effectiveness(cmin: number, cmax: number, UA: number) {
  let C = cmin / cmax;
  let NTU = UA / cmin;
  let temp =
    (1 + Math.exp(-NTU * Math.sqrt(1 + C ** 2))) /
    (1 - C * Math.exp(-NTU * Math.sqrt(1 + C ** 2)));
  temp = temp * Math.sqrt(1 + C ** 2);
  return 2 / (1 + C + temp);
}

// Main calculations, sets g outlet temps
function calcHeatTransferRate() {
  let cmin = g.cpH * g.mDotH;
  let cmax = g.cpC * g.mDotC;

  let h_shell = calcShellHValue();
  let h_tube = calcTubeHValue();
  let Uo =
    1 /
    (OUTER_TUBE_DIAMETER ** 2 / INNER_TUBE_DIAMETER ** 2 / h_shell +
      1 / h_tube);
  let UA = (Uo * HEX_AREA) / 10000;

  if (cmin > cmax) {
    // Swap if need be
    let tmp = cmin;
    cmin = cmax;
    cmax = tmp;
  }

  let epsilon = effectiveness(cmin, cmax, UA);
  let QdotMax = cmin * (g.Th_in - g.Tc_in);
  let Qdot = epsilon * QdotMax;

  // Set g values
  g.Th_out = g.Th_in - Qdot / g.cpH / g.mDotH;
  g.Tc_out = g.Tc_in + Qdot / g.cpC / g.mDotC;
}

// Calculate H value for shell side heat transfer
function calcShellHValue() {
  let Re: number = calcShellRe();
  let Nu: number = 0.2 * Re ** 0.6 * PR_COLD ** (1 / 3);
  return (Nu * CONDUCTIVITY_COLD_WATER) / HYDRAULIC_DIAMETER_SHELL;
}

function calcShellRe() {
  return (
    ((g.mDotC / SHELL_CROSS_SECTION_AREA) * HYDRAULIC_DIAMETER_SHELL) /
    DYNAMIC_VISCOSITY_C
  );
}

// Calculate H value for tube side heat transfer
function calcTubeHValue() {
  let Re: number = calcTubeRe();
  let Nu: number = 0.023 * Re ** 0.8 * PR_HOT ** (1 / 3);
  return (Nu * CONDUCTIVITY_HOT_WATER) / INNER_TUBE_DIAMETER;
}

function calcTubeRe() {
  return (
    ((g.mDotH / TUBE_CROSS_SECTION_AREA) * INNER_TUBE_DIAMETER) /
    DYNAMIC_VISCOSITY_H
  );
}

// Change the volumes each frame based on the deltaTime
const FILL_ANIMATION_FLOWRATE = 50 * 1000 / ANIMATION_TIME; // (mL available) / (seconds of animation)
function changeVols(deltaTime: number) {
  let dV;
  if (g.vols[0] > 0 && g.hIsFlowing) {
    if (g.fillBeakers) {
      dV = (g.mDotH * deltaTime) / 1000;
      g.vols[0] -= dV;
      g.vols[1] += dV;
    }
    else {
      dV = (FILL_ANIMATION_FLOWRATE * deltaTime) / 1000;
      g.vols[0] -= dV;
    }
  } else if (g.vols[0] <= 0) {
    g.vols[0] = 0.0;
    g.hIsFlowing = false;
    return false
  }
  if (g.vols[2] > 0 && g.cIsFlowing) {
    if (g.fillBeakers) {
      dV = (g.mDotC * deltaTime) / 1000;
      g.vols[2] -= dV;
      g.vols[3] += dV;
    }
    else {
      dV = (FILL_ANIMATION_FLOWRATE * deltaTime) / 1000;
      g.vols[2] -= dV;
    }
  } else if (g.vols[2] <= 0) {
    g.vols[2] = 0.0;
    g.cIsFlowing = false;
    return false;
  }
  return true;
}

// Constants for integrateTemps. These aren't scientific yet
const UA_ROOM = 1e-3;
const T_ROOM = 25;
const V_BUFFER = 50; // mL

// Integrates temperatures to find observed temps in outlet beakers
function integrateTemps(deltaTime: number) {
  var dV, vol, dTdV;

  if (g.hIsFlowing) {
    dV = (g.mDotH * deltaTime) / 1000;
    vol = g.vols[1] + V_BUFFER;
    dTdV = g.cIsFlowing ? g.Th_out : g.Th_in;
    g.Th_out_observed = (g.Th_out_observed * (vol - dV) + dTdV * dV) / vol;
  }

  if (g.cIsFlowing) {
    dV = (g.mDotC * deltaTime) / 1000;
    vol = g.vols[3] + V_BUFFER;
    dTdV = g.hIsFlowing ? g.Tc_out : g.Tc_in;
    g.Tc_out_observed = (g.Tc_out_observed * (vol - dV) + dTdV * dV) / vol;
  }

  // Q lost to room
  var h = ((UA_ROOM / g.cpH) * deltaTime) / 1000;
  g.Th_in += h * (T_ROOM - g.Th_in);
  g.Th_out += h * (T_ROOM - g.Th_out);
  g.Tc_in += h * (T_ROOM - g.Tc_in);
  g.Tc_out += h * (T_ROOM - g.Tc_out);
}

// Handle full calculations and set globals each frame in single-beaker mode
export function handleSingleBeakerCalculations(deltaTime: number) {
  if (!g.hIsFlowing) return; // not flowing
  calcHeatTransferRate(); // calc outlet temps

  // Change temperatures of beakers based on outlets and deltaTime
  let dV = (g.mDotH * deltaTime) / 1000;
  g.Th_in = lerp(g.Th_in, g.Th_out, dV / 1000);
  dV = (g.mDotC * deltaTime) / 1000;
  g.Tc_in = lerp(g.Tc_in, g.Tc_out, dV / 1000);
}

// Handle full calculations and set globals each frame in double-beaker mode
export function handleDoubleBeakerCalculations(deltaTime: number) {
  calcHeatTransferRate();
  const running = changeVols(deltaTime);
  integrateTemps(deltaTime);
  return running;
}
