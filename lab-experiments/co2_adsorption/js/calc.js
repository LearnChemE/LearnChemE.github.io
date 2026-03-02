import { rk45 } from "./rk45.js";
const timeMultiplicationFactor = 1;

export const HEATING_RATE = 4 // K / s
export const COOLING_RATE = Math.exp(-1/3);
const MAX_TEMP = 400 + 273; // K

const LENGTH_BED = 40; // cm
const RHO_ZEOLITE = 0.75; // g/cc
const MASS_ZEOLITE = 4000; // g
const MM_CO2 = 44.009; // g/mol
const MM_N2 = 14.041 // g/mol
const R = 83.14 // bar cc / mol / K
const BED_MAX_CAPACITY = MASS_ZEOLITE / 1000 * 0.85; // mols
const DIFFUSIVITY = 1.8e-1; // m^2/s, diffusivity of CO2 in zeolite
// Spatial info
const N = 101; // number of points in spatial discretization
const NT = 3*N + 6; // Size of arrays including padding
const x = Array.from({ length: N }).map((_,i) => i * LENGTH_BED / (N - 1));
const dx = x[1] - x[0];



// Geometry
const BED_VOLUME = MASS_ZEOLITE / RHO_ZEOLITE; // cc
const BED_CROSS_SECTION = BED_VOLUME / LENGTH_BED; // cm^2
const BED_RADIUS = Math.sqrt(BED_CROSS_SECTION / Math.PI); // cm
console.log("Radius: ", BED_RADIUS)

// Kinetic parameters
const ka0 = 2.196e4; // min^-1
const ea = 2000; // convert from kJ/mol to K
const kd0 = 8e6;
const ed = 6e3;
function k_val(k0, ea, T) {
  return k0 * Math.exp(-ea / T);
}

// type BedPoint = [
//   pco2: Number,
//   th_co2: Number,
//   u: Number
// ]

const bed = Array.from({ length: 3*N }).fill(0); // initialize bed with zeros

/**
 * Utility functions for calculations
 */

// Pad the edges of an array with the first and last values to make it easier to calculate derivatives
function pad(y, left) {
  const right = Array.from({ length: 3 }).map((_,i) => {
    const yi = y[3 * N - 3 + i];
    return yi;
  });
  // if (right[2] > 0) throw new Error(`Padding right with: ${right}, ${y}`)
  return [ ...left, ...y, ...right ];
}

// Remove the padding from an array
function updateBed(y) {
  y = y.slice(3, -3);
  for (let i=0; i<3*N; i++) {
    bed[i] = y[i];
  }
}

// Molar mass of the gas mixture based on the mole fraction of CO2
function molar_mass(x_co2) {
  return x_co2 * MM_CO2 + (1 - x_co2) * MM_N2;
}

/**
 * Calculte the velocity of the gas mixture through the bed based on the mass flow rate, mole fraction of CO2, and pressure.
 * @param {Number} mdot Mass flow rate in g/s
 * @param {Number} x_co2 mole fraction of CO2 in the gas mixture
 * @param {Number} P overall pressure in bar
 * @returns velocity in cm/s
 */
function calc_velocity(mdot, x_co2, T, P) {
    // pv = nrt; Vdot = ndot * RT / P
    const ndot = mdot / molar_mass(x_co2) // mol/s
    const q = ndot * R * T / P // cc/s
    return q / BED_CROSS_SECTION // cm/s
}

function advection(y, dx) {
  const inv_dx = 1 / dx;
  const adv = Array.from({ length: 3*N + 6 }).fill(0);

  for (let i = 3; i < NT; i += 3) {
    const ip = i;
    // No theta; no advection for adsorbed carbon
    const iu = i + 2;

    const dp = y[ip] - y[ip - 3];
    const du = y[iu] - y[iu - 3];
    adv[ip] = - y[iu] * dp * inv_dx;
    adv[iu] = - y[iu] * du * inv_dx
  }

  return adv;
}

function diffusion(y, dx) {
  const inv_dx2 = 1 / dx / dx;
  const dif = Array.from({ length: NT }).fill(0);

  for (let i = 3; i < NT - 3; i += 3) {
    const ip = i;
    // No theta; no advection for adsorbed carbon
    const iu = i + 2;

    const d2p = y[ip + 3] + y[ip - 3] - 2 * y[ip];
    const d2u = y[iu + 3] + y[iu - 3] - 2 * y[iu];
    dif[ip] = DIFFUSIVITY * d2p * inv_dx2;
    dif[iu] = DIFFUSIVITY * d2u * inv_dx2;
  }

  return dif;
}

function reaction(y, ka, kd) {
  const rxn = Array.from({ length: NT }).fill(0);

  for (let i=3; i < NT - 3; i += 3) {
    const p = y[i];
    const th = y[i + 1];
    const th_star = 1 - th;

    const ads = ka * p * th_star;
    const des = kd * th;

    rxn[i] = des - ads; // Pressure changes
    rxn[i + 1] = (ads - des) / BED_MAX_CAPACITY; // Theta changes
  }

  return rxn;
}

// RHS for advection-diffusion eqn with reaction term
function rhs(t, y, dx, ka, kd) {
  const adv = advection(y, dx);
  const dif = diffusion(y, dx);
  const rxn = reaction(y, ka, kd);

  const dydt = dif.map((dif, i) => dif + adv[i] + rxn[i]);
  dydt[NT - 3] = 0;
  dydt[NT - 1] = 0;
  return dydt;
  // return adv.map((a, i) => a + dif[i]);// + rxn[i]);
}

function evolve(tstep, T, left) {
  const y0 = pad(bed, left);
  const ka = k_val(ka0, ea, T);
  const kd = k_val(kd0, ed, T);

  const f = (t, y) => {
    return rhs(t, y, dx, ka, kd);
  }

  const sol = rk45(f, y0, 0, tstep);
  const soly = sol.y.at(-1);
  
  updateBed(soly);
  updatePlot();
}

/**
 * Calculate the outlet mole fraction of CO2 in a gas mixture
 * after passing through a zeolite membrane.
 *
 * @param {Object} args - The arguments object.
 * @param {number} args.t - The time in seconds.
 * @param {number} args.tStep - The time step in seconds.
 * @param {number} args.m - The mass flow rate of the gas mixture in g / s.
 * @param {number} args.P - The total pressure of the gas mixture in bar.
 * @param {number} args.T - The temperature of the gas mixture in K.
 * @param {number} args.yCO2 - The mole fraction of CO2 in the gas mixture.
 * @param {boolean} [args.desorbing=false] - Whether the CO2 is desorbing.
 * @param {number} [args.timeOfDesorption=0] - The time of desorption in seconds.
 * @param {number} [args.kd=4.365e-4] - The desorption rate constant in s^-1.
 * @returns {number} - The outlet mole fraction of CO2 in the gas mixture.
 */
export function yCO2_out(dt, mdot, T, P, y) {
  mdot *= 60000; // mg/min
  const ul = calc_velocity(mdot, y, T, P);
  const left = [ y * P, 0, ul ];
  // console.log(y*P)
  evolve(dt, T, left);

  const outlet = bed[3*N - 3] / P
  return outlet;
}

/**
 * Ramp the temperature of the simulation
 * @param {number} deltaTime Time difference since last call
 * @param {boolean} isHeating Whether heating is on (true) or off (false)
 * @param {number} temperature Temperature of reactor from last call
 */
export function rampTemperature(deltaTime, isHeating, temperature) {
  const oldTemp = temperature;
  var newTemp;
  if (isHeating) {
    // Slowly ramp the temperature
    // Constant heating rate = linear temperature rise
    newTemp = Math.min(oldTemp + HEATING_RATE * deltaTime, MAX_TEMP);
  }
  else {
    // Temperature falls to ambient temp through exponential decay
    newTemp = 298.15 + (oldTemp - 298.15) * Math.pow(COOLING_RATE, deltaTime);
  }
  return newTemp;
}

// debug
function plot_P() {
  return Array.from({ length: N }).map((_,i) => bed[3 * i]);
}

function plot_th() {
  const y = Array.from({ length: N }).map((_,i) => {
    console.log(bed[3 * i + 1])
    return bed[3 * i + 1];
  });
  return y;
}

// Debug
var data = [{
    x: x, y: plot_P(), type: 'scatter'
}];
var layout = {title: 'Pressure'};

Plotly.newPlot('plotly-chart', data, layout);

function updatePlot() {
  var data = [{
      x: x, y: plot_th(), type: 'scatter'
  }];
  Plotly.react('plotly-chart', data, layout);
}