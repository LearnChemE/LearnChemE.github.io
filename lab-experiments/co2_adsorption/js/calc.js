const timeMultiplicationFactor = 1;

export const HEATING_RATE = 4 // K / s
export const COOLING_RATE = Math.exp(-1/3);

const LENGTH_BED = 20; // cm
const RHO_ZEOLITE = 0.75; // g/cc
const MASS_ZEOLITE = 4000; // g
const MM_CO2 = 44.009; // g/mol
const MM_N2 = 14.041 // g/mol
const R = 83.14 // bar cc / mol / K
const BED_MAX_CAPACITY = MASS_ZEOLITE / 1000 * 0.85; // mols
const DIFFUSIVITY = 1.8e-9; // m^2/s, diffusivity of CO2 in zeolite
// Spatial info
const N = 201; // number of points in spatial discretization
const NT = 3*N + 6; // Size of arrays including padding
const x = Array.from({ length: N }).map((_,i) => i * LENGTH_BED / (N - 1));
const dx = x[1] - x[0];

const TH = 15; // min
const BETA = 4; // K/min

// Geometry
const BED_VOLUME = MASS_ZEOLITE / RHO_ZEOLITE; // cc
const BED_CROSS_SECTION = BED_VOLUME / LENGTH_BED; // cm^2
const BED_RADIUS = Math.sqrt(BED_CROSS_SECTION / Math.PI); // cm

// type BedPoint = [
//   pco2: Number,
//   th_co2: Number,
//   u: Number
// ]

const bed = Array.from({ length: N }).map(() => [0, 0, 0]); // initialize bed with zeros

/**
 * Utility functions for calculations
 */

// Pad the edges of an array with the first and last values to make it easier to calculate derivatives
function pad(y, left) {
  return [ left, ...y, y[y.length - 1] ];
}

// Remove the padding from an array
function unpad(y) {
  return y.slice(1, -1);
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
function calc_velocity(mdot, x_co2, P) {
    // pv = nrt; Vdot = ndot * RT / P
    ndot = mdot / molar_mass(x_co2) // mol/s
    q = ndot * R * T / P // cc/s
    return q / AC_BED // cm/s
}

function advection(y, dx) {
  const inv_dx = 1 / dx;
  const adv = Array.from({ length: 3*N + 6 }).fill(0);

  for (let i = 3; i < NT - 3; i += 3) {
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
    const d2u = y[iu + 3] - y[iu - 3] - 2 * y[iu];
    dif[ip] = DIFFUSIVITY * d2p * inv_dx;
    dif[iu] = DIFFUSIVITY * d2u * inv_dx;
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

  return adv.map((a, i) => a + dif[i] + rxn[i]);
}

function evolve() {


  sol = rk45()
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
export function yCO2_out(args) {
  const tStep = args.tStep * timeMultiplicationFactor;
  const m = args.m * 1000; // g / s
  const P = args.P; // bar
  const T = args.T; // K
  const V = BED_VOLUME; // L
  const y = Math.min(args.yCO2, 0.99); // limit yCO2 to 0.99 to avoid division by zero
  const dt = tStep * timeMultiplicationFactor;
  const MW_CO2 = 44.01; // g/mol
  const MW_N2 = 28.02; // g/mol

  // Get molar flowrate of each species
  const ndot = m / (MW_CO2 * y + MW_N2 * (1 - y)); // [mol / s] total number of moles in the gas mixture
  const ndot_co2 = ndot * y; // molar flow rate of CO2 [mol / s]
  const ndot_n2 = ndot * (1 - y); // molar flow rate of N2 [mol / s]

  // Calculate partial pressure of what's already in the tank
  const p_co2 = n_co2 * R * T / V; 
  // console.log(`pco2: ${p_co2}\npN2: ${n_n2 * R * T / V}`)

  // Calculate rate constants
  const ka = Ka(T);
  const kd = Kd(T); 
  // Calculate rates of adsorption and desorption
  const rate_ads = ka * p_co2 * (1 - th_co2);
  const rate_des = kd * th_co2;

  // Rate of change of theta_co2
  const gen_minus_cons = rate_des - rate_ads;

  // Calculate new theta
  
  // Find the change in the bulk concentrations. 
  //   acc = in - out + gen - cons
  // Don't include out just yet because it should guaruntee we stay at pressure
  const dthdt = (rate_ads - rate_des) / BED_MAX_CAPACITY;
  const dcdt = ndot_co2 + gen_minus_cons; // mol / s
  const dndt = ndot_n2; // mol / s

  // Evolve the system
  th_co2 += dthdt * dt; // unitless
  n_co2  += dcdt  * dt; // mmol
  n_n2   += dndt  * dt; // mmol

  // Constrain theta to range [0,1]
  if (th_co2 > 1) {
    const dif = th_co2 - 1;
    th_co2 = 1;
    n_co2 += dif * BED_MAX_CAPACITY;
  }
  if (th_co2 < 0) {
    const dif = th_co2;
    th_co2 = 0;
    n_co2 += dif * BED_MAX_CAPACITY;
  }

  // console.log(`theta:${th_co2.toFixed(2)}`);//\nn_CO2:${n_co2.toFixed(2)}\nn_N2:${n_n2.toFixed(2)}`);

  // Calculate the amount of moles actually in the tank and compare to what the maximum pressure would allow
  const n_max = P * V / R / T; // maximum moles
  const n_tot = n_co2 + n_n2;
  if (n_tot < n_max) {
    // console.log(`${n_tot.toFixed(3)} moles of ${n_max.toFixed(3)}`);
    // Not up to pressure; nothing will come out so it will accumulate
    if (n_co2 < 0) n_co2 = 0;
    if (n_n2 < 0) n_n2 = 0;
    return 0;
  }
  else {
    // Calculate mole fraction
    const y_out = n_co2 / n_tot;
    // Preserve that mole fraction but lower to n_max
    n_co2 = n_max * y_out;
    n_n2 = n_max * (1 - y_out);
    // Return the outlet mole fraction because it is flowing
    return Math.max(y_out, 0);
  }
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
