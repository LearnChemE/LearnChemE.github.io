// import { COOLING_RATE, HEATING_RATE } from "./config";
// import { getIsHeating, getTemperature, setTemperature } from "./state";

const timeMultiplicationFactor = 1;

export const HEATING_RATE = 4 // K / s
export const COOLING_RATE = Math.exp(-1/3);

const BED_VOLUME = .1; // L
const KA0 = 2.764 * 10;
const EA = 3400.814;
const Ka = (T) => { return KA0 * Math.exp(-EA/T); }
const KD0 = 2 * 10**5;
const ED = 8209;
const Kd = (T) => { return KD0 * Math.exp(-ED/T); }
const BED_MAX_CAPACITY = .01; // mol CO2 total
const MAX_TEMP = 623.15; // K
const R = 0.08314 // bar L / mol / K

/**
 * Calculate the amount of CO2 adsorbed on a surface
 * as a function of time using a first-order rate equation.
 *
 * @param {Object} args - The arguments object.
 * @param {number} args.t - The time in seconds.
 * @param {number} args.ka - The adsorption rate constant in m^3/(mol*s).
 * @param {number} args.kd - The desorption rate constant in s^-1.
 * @param {number} args.cCO2 - The concentration of CO2 in mol/m^3.
 * @returns {number} - The amount of CO2 adsorbed on the surface.
 */
function theta(args) {
  const t = args.t;

  // These constants were chosen to achieve adsorption specified in OneNote. They are specifically hard-coded in
  // to be the default unless overridden.
  const ka = args.ka || 9.12e-6;
  const kd = args.kd || 4.365e-4;
  const cCO2 = args.cCO2;

  const p = ka * cCO2 + kd;
  const q = ka * cCO2;

  const theta0 = 0; // initial amount adsorbed

  const thetaEq = q / p;
  const d = theta0 - thetaEq;

  const exp = Math.exp(-p * t);

  const theta = thetaEq + d * exp;

  return theta;
}

// // ----------- FOR DEBUGGING PURPOSES ONLY --------------
// // Remove this from the code for production builds!!
// // It is probably unsafe, and students could potentially use it to cheat the homework pretty easily.
// // Normally, you could check if process.env.NODE_ENV === 'development' or something but this sim does not have a development environment set up.
// async function sendDataToPython(data) {
//   // You are making a POST request with the attached JSON to localhost port 5000's /plot endpoint (exposed by the Flask server)
//   const response = await fetch('http://localhost:5000/plot', { 
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(data)
//   });

//   // Await the response from the server and print the results
//   const result = await response.json();
//   console.log('Python responded with: ', result);
// }
// let x=[], y=[], dx=.1;
// for (let xn=0;xn<120;xn+=dx) {
//   x.push(xn);
//   y.push(theta({ t: xn, cCO2: 1 - (xn/120) }));
// }
// sendDataToPython({x: [x], y: [y]});
// // ----------------- END DEBUG SECTION -------------------

var n_co2 = 0;
var n_n2 = 5 * BED_VOLUME / R / 298.15;
var th_co2 = 0; // Fraction of bed covered in CO2
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
  const m = args.m * 1000; // mg / s
  const P = args.P; // bar
  const T = args.T; // K
  const V = BED_VOLUME; // L
  const y = Math.min(args.yCO2, 0.99); // limit yCO2 to 0.99 to avoid division by zero
  const dt = tStep * timeMultiplicationFactor;
  const MW_CO2 = 44.01; // g/mol
  const MW_N2 = 28.02; // g/mol

  // Get molar flowrate of each species
  const ndot = m / (MW_CO2 * y + MW_N2 * (1 - y)); // [mmol / s] total number of moles in the gas mixture
  const ndot_co2 = ndot * y; // molar flow rate of CO2 [mmol / s]
  const ndot_n2 = ndot * (1 - y); // molar flow rate of N2 [mmol / s]

  // Calculate partial pressure of what's already in the tank
  const p_co2 = n_co2 * R * T / V; 
  console.log(`pco2: ${p_co2}\npN2: ${n_n2 * R * T / V}`)

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
  const dthdt = (rate_ads - rate_des) / BED_MAX_CAPACITY; // 
  const dcdt = ndot_co2 + gen_minus_cons; // mmol / s ?
  const dndt = ndot_n2; // mmol / s ?

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

  console.log(`theta:${th_co2.toFixed(2)}`);//\nn_CO2:${n_co2.toFixed(2)}\nn_N2:${n_n2.toFixed(2)}`);

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

/**
 * Find the time required to adsorb a certain amount of CO2
 * to the zeolite membrane.
 *
 * @param {Object} args - The arguments object.
 * @param {number} args.tStep - The time step in seconds.
 * @param {number} args.m - The mass flow rate of the gas mixture in g / s.
 * @param {number} args.P - The total pressure of the gas mixture in bar.
 * @param {number} args.T - The temperature of the gas mixture in K.
 * @param {number} args.yTarget - The target mole fraction of CO2 in the gas mixture.
 * @param {number} args.yCO2 - The initial mole fraction of CO2 in the gas mixture.
 * @returns {number} - The time required to adsorb the target amount of CO2 in seconds.
 */
export function findAdsorbTime(args) {
  const tStep = args.tStep * timeMultiplicationFactor;
  const m = args.m;
  const P = args.P;
  const T = args.T;
  const yTarget = args.yTarget;
  const yCO2 = args.yCO2;

  let err = 1e9;
  let tResult = 0;

  if (yTarget <= 0) {
    return 0;
  }

  for (let t = 0; t < 1200; t += tStep) {
    const outlet = yCO2_out({
      t: t,
      tStep: tStep,
      m: m,
      P: P,
      T: T,
      yCO2: yCO2,
      desorbing: false,
      timeOfDesorption: 0,
    });

    const diff = Math.abs(outlet - yTarget);
    if (diff < err) {
      err = diff;
      tResult = t;
    }
  }

  return tResult;
}
