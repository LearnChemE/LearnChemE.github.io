import { P5CanvasInstance } from "@p5-wrapper/react";
import { g } from "./Sketch.tsx";

const HYDRAULIC_DIAMETER_ANNULAR = 0.00318; // m
const ANNULAR_CROSS_SECTION_AREA = 3.966e-5; // m^2
const INNER_TUBE_DIAMETER = 0.00457; // m
const OUTER_TUBE_DIAMETER = 0.00635; // m
const ANNULAR_DIAMETER = 0.00953; // m
const DYNAMIC_VISCOSITY_H = 5.5e-7; // m^2 / s
const DYNAMIC_VISCOSITY_C = 9e-5; // m^2 / s
const PR_COLD = 6.62; // kJ / kg / K
const PR_HOT = 3.42; // kJ / kg / K
const TUBE_LENGTH = 0.137; // m
const CONDUCTIVITY_COLD_WATER = 0.5984; // W / m / K
const CONDUCTIVITY_HOT_WATER = 0.6435; // W / m / K
const HEX_AREA = 109; // cm2

// Flowrates
export const MAX_HOT_WATER_TEMP = 59.2;
export const MIN_HOT_WATER_TEMP = 46.6;
export const MAX_COLD_WATER_TEMP = 26.6;
export const MIN_COLD_WATER_TEMP = 20.2;
export const MAX_HOT_FLOWRATE = 20;
export const MIN_HOT_FLOWRATE = 15;
export const MAX_COLD_FLOWRATE = 22;
export const MIN_COLD_FLOWRATE = 16;

/* ********************************************************************* */
/* ** This file holds calculations for heat transfer and outlet temps ** */
/* ********************************************************************* */

// Randomize start values
export function randStartVals(p: P5CanvasInstance) {
  g.Th_in = p.random(MIN_HOT_WATER_TEMP, MAX_HOT_WATER_TEMP);
  g.mDotH = p.random(MIN_HOT_FLOWRATE, MAX_HOT_FLOWRATE);
  g.Tc_in = p.random(MIN_COLD_WATER_TEMP, MAX_COLD_WATER_TEMP);
  g.mDotC = p.random(MIN_COLD_FLOWRATE, MAX_COLD_FLOWRATE);
}

// Finds effectiveness of heat exchanger for calculating amount of heat transferred
function effectiveness(cmin: number, cmax: number, UA: number) {
  let C = cmin / cmax;
  let NTU = UA / cmin;

  if (C == 1)
    return NTU / (1 + NTU); // This is the limit so it doesnt become NaN
  else
    return (1 - Math.exp(-NTU * (1 - C))) / (1 - C * Math.exp(-NTU * (1 - C)));
}

// Main calculations, calculates heat transferred and outlet temps
export function calcHeatTransferRate() {
  let cmin = g.cpH * g.mDotH;
  let cmax = g.cpC * g.mDotC;

  let h_annular = calcAnnularHValue();
  let h_tube = calcTubeHValue();
  let Uo =
    1 /
    (OUTER_TUBE_DIAMETER ** 2 / INNER_TUBE_DIAMETER ** 2 / h_annular +
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

  g.Th_out = g.Th_in - Qdot / g.cpH / g.mDotH;
  g.Tc_out = g.Tc_in + Qdot / g.cpC / g.mDotC;

  // console.log(`Th out = ${g.Th_out}\nTc out = ${g.Tc_out}`); // Use this to debug true outlet values
}

// returns tube-side heat transfer coefficient
function calcTubeHValue() {
  let Re = calcTubeReynolds();
  let Nu: number;

  if (Re > 2100) {
    // Transitional flow
    let f = (1.58 * Math.log(Re) - 3.28) ** -2;
    Nu =
      (((f / 2) * (Re - 1000) * PR_HOT) /
        (1 + 12.7 * (f / 2) ** 0.5 * (PR_HOT ** (2 / 3) - 1))) *
      (1 + (INNER_TUBE_DIAMETER / TUBE_LENGTH) ** (2 / 3));
  } else {
    // Laminar Regime
    let Gr = calcTubeGrashoff();
    Nu =
      1.86 *
      ((Re * PR_HOT * INNER_TUBE_DIAMETER) / TUBE_LENGTH) ** (1 / 3) *
      (0.87 * (1 + 0.015 * Gr ** (1 / 3)));
  }

  return (Nu * CONDUCTIVITY_HOT_WATER) / INNER_TUBE_DIAMETER;
}

// returns tube-side reynolds number
function calcTubeReynolds() {
  let u = (g.mDotH * 4) / Math.PI / INNER_TUBE_DIAMETER ** 2 / 1000000;
  return (u * INNER_TUBE_DIAMETER) / DYNAMIC_VISCOSITY_H;
}

// returns tube-side grashoff number
function calcTubeGrashoff() {
  var T = g.Th_in;
  var Tc = g.Tc_in;
  return (
    (((9.81 * (T - Tc)) / (T + Tc)) * INNER_TUBE_DIAMETER ** 3) /
    DYNAMIC_VISCOSITY_H ** 2
  );
}

// returns annular-side heat transfer coefficient
function calcAnnularHValue() {
  let Gr = calcGrashoffNumber();
  let Re = calcAnnularReynoldsNumber();
  let Nu =
    1.02 *
    Re ** 0.45 *
    PR_COLD ** (1 / 3) *
    (HYDRAULIC_DIAMETER_ANNULAR / TUBE_LENGTH) ** 0.4 *
    (ANNULAR_DIAMETER / OUTER_TUBE_DIAMETER) ** 0.8 *
    Gr ** 0.05;
  return (Nu * CONDUCTIVITY_COLD_WATER) / HYDRAULIC_DIAMETER_ANNULAR;
}

// returns annular-side reynolds number
function calcAnnularReynoldsNumber() {
  let u = g.mDotC / ANNULAR_CROSS_SECTION_AREA / 10000; // m / s
  return (u * HYDRAULIC_DIAMETER_ANNULAR) / DYNAMIC_VISCOSITY_C;
}

// returns annular-side grashoff number
function calcGrashoffNumber() {
  let deltaT = Math.abs(g.Th_in - g.Tc_in) / 2.0;
  let beta = 2.0 / (g.Th_in + g.Th_out + 546.3);
  return (
    (9.81 * beta * deltaT * HYDRAULIC_DIAMETER_ANNULAR ** 3) /
    DYNAMIC_VISCOSITY_C ** 2
  );
}

// iterate the volumes in the g.vols array based on flowrates
export function changeVols(p: P5CanvasInstance) {
  let dV;
  if (g.vols[0] > 0 && g.hIsFlowing) {
    dV = (g.mDotH * p.deltaTime) / 1000;
    g.vols[0] -= dV;
    g.vols[1] += dV;
  } else if (g.vols[0] <= 0) {
    g.vols[0] = 0.0;
    g.vols[1] = 1000.0;
    g.hIsFlowing = false;
  }
  if (g.vols[2] > 0 && g.cIsFlowing) {
    dV = (g.mDotC * p.deltaTime) / 1000;
    g.vols[2] -= dV;
    g.vols[3] += dV;
  } else if (g.vols[2] <= 0) {
    g.vols[2] = 0.0;
    g.vols[3] = 1000.0;
    g.cIsFlowing = false;
  }
}

const UA_ROOM = 1e-3;
const T_ROOM = 25;
const V_BUFFER = 50; // mL
// Integrates temperatures to find observed temps
export function integrateTemps(p: P5CanvasInstance) {
  // if (g.vols[1] == 0 || g.vols[3] == 0) return;
  var dV, vol, dTdV;

  if (g.hIsFlowing) {
    dV = (g.mDotH * p.deltaTime) / 1000;
    vol = g.vols[1] + V_BUFFER;
    dTdV = g.cIsFlowing ? g.Th_out : g.Th_in;
    g.Th_out_observed = (g.Th_out_observed * (vol - dV) + dTdV * dV) / vol;
  }

  if (g.cIsFlowing) {
    dV = (g.mDotC * p.deltaTime) / 1000;
    vol = g.vols[3] + V_BUFFER;
    dTdV = g.hIsFlowing ? g.Tc_out : g.Tc_in;
    g.Tc_out_observed = (g.Tc_out_observed * (vol - dV) + dTdV * dV) / vol;
  }

  // Q lost to room
  var h = ((UA_ROOM / g.cpH) * p.deltaTime) / 1000;
  g.Th_in += h * (T_ROOM - g.Th_in);
  g.Th_out += h * (T_ROOM - g.Th_out);
  g.Tc_in += h * (T_ROOM - g.Tc_in);
  g.Tc_out += h * (T_ROOM - g.Tc_out);
}

export function singleBeakerCalculations(p: P5CanvasInstance) {
  if (!g.hIsFlowing) return;
  calcHeatTransferRate();

  let dV = (g.mDotH * p.deltaTime) / 1000;
  g.Th_in = p.lerp(g.Th_in, g.Th_out, dV / 1000);
  dV = (g.mDotC * p.deltaTime) / 1000;
  g.Tc_in = p.lerp(g.Tc_in, g.Tc_out, dV / 1000);
}

export function lerp(start: number, end: number, amount: number): number {
  if (amount < 0 || amount > 1) {
    throw new Error("Amount must be between 0 and 1");
  }
  return start + (end - start) * amount;
}
