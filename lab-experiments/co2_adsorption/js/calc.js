// import { COOLING_RATE, HEATING_RATE } from "./config";
// import { getIsHeating, getTemperature, setTemperature } from "./state";

const timeMultiplicationFactor = 1;

export const HEATING_RATE = 4 // K / s
export const COOLING_RATE = Math.exp(-1/3);

const RATE_MULTIPLIER = 1;
const KA0 = 20.764 * RATE_MULTIPLIER * 10;
const EA = 34.814 * RATE_MULTIPLIER;
const Ka = (T) => { return KA0 * Math.exp(-EA/T); }
const KD0 = 10**4 * RATE_MULTIPLIER;
const ED = 4209 * RATE_MULTIPLIER;
const Kd = (T) => { return KD0 * Math.exp(-ED/T); }
const BED_MAX_CAPACITY = 10; // mol CO2 total

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

var th_co2 = 0; // Fraction of bed covered in CO2
function catalyst_bed(cCO2_in, temperature, dt) {
  // Calculate rate constants
  const ka = Ka(temperature);
  const kd = Kd(temperature); 
  // Calculate rates of adsorption and desorption
  const rate_ads = ka * cCO2_in * (1 - th_co2);
  const rate_des = kd * th_co2;
  const roc = rate_des - rate_ads;

  // Rate of change of theta_co2
  const dthdt = (rate_ads - rate_des) / BED_MAX_CAPACITY;
  const dcdt = roc;

  // Calculate new theta
  th_co2 = th_co2 + dthdt * dt;
  // Constrain to range [0,1]
  th_co2 = Math.max(Math.min(th_co2, 1), 0);
  console.log(`theta CO2 = ${th_co2}`)

  // Return the out concentration
  return cCO2_in + dcdt * dt;
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

/**
 * Calculate the concentration of CO2 in a gas mixture
 * using the ideal gas law.
 *
 * @param {Object} args - The arguments object.
 * @param {number} args.P - The total pressure of the gas mixture in bar.
 * @param {number} args.T - The temperature of the gas mixture in K.
 * @param {number} args.yCO2 - The mole fraction of CO2 in the gas mixture.
 * @returns {number} - The concentration of CO2 in mol/m^3.
 */
function cCO2(args) {
  // const P = args.P ** 0.79; // adjusted to fit experimental data
  // const T = 250 + 532 * ((args.T - 273) / (348 - 273)); // adjusted to fit experimental data
  // const yCO2 = args.yCO2;

  // const PCO2 = P * yCO2; // partial pressure of CO2

  // const R = 0.08314; // L * bar / (K * mol)

  // Ideal gas law: PV = nRT => n/V = P/RT
  const R = 0.08314;
  const PCO2 = args.P * args.yCO2;
  return PCO2 / R / args.T; // M
}

function cN2(P, T, yN2) {
  const R = 0.08314;
  const PN2 = P * yN2;
  return PN2 / R / T; // M
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
  let t = args.t * timeMultiplicationFactor;
  const tStep = args.tStep * timeMultiplicationFactor;
  const m = args.m;
  const P = args.P;
  const T = args.T;
  console.log(`T: ${T}`);
  const y = Math.min(args.yCO2, 0.99); // limit yCO2 to 0.99 to avoid division by zero
  const MW_CO2 = 44.01; // g/mol
  const MW_N2 = 28.02; // g/mol

  // Get molar flowrate of each species
  const nTotal = m / (MW_CO2 * y + MW_N2 * (1 - y)); // total number of moles in the gas mixture
  const nCO2 = nTotal * y; // molar flow rate of CO2
  const nN2 = nTotal * (1 - y); // molar flow rate of N2

  const desorbing = args.desorbing || false;
  const timeOfDesorption = args.timeOfDesorption * timeMultiplicationFactor || 0;
  const kd = args.kd || 4.365e-4; // desorption rate constant in s^-1

  if (desorbing) {
    t = timeOfDesorption;
  }

  // const mZeolite = 0.005; // mass of zeolite, kg
  // const nBinding = 12; // maximum adsorption capacity (12 mmol / g)
  // const nMax = mZeolite * nBinding; // maximum number of moles of CO2 that can be adsorbed

  // Pass through the catalyst bed
  const c_co2_in = cCO2({ P: P, T: T, yCO2: y }); // concentration of CO2 in mol / m^3
  const c_n2 = cN2(P, T, 1-y);
  const c_co2_out = catalyst_bed(c_co2_in, T, tStep * timeMultiplicationFactor);

  console.log(`C_CO2 in : ${c_co2_in}`)
  console.log(`C_CO2 out : ${c_co2_out}`)
  const y_out = c_co2_out / (c_co2_out + c_n2);


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
  // sendDataToPython({x: [args.t], y: [y_out], label: "y_out"});
  // sendDataToPython({x: [args.t], y: [th_co2], label: "theta"});
  // // ----------------- END DEBUG SECTION -------------------

  return y_out;
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
    newTemp = oldTemp + HEATING_RATE * deltaTime;
  }
  else {
    // Temperature falls to ambient temp through exponential decay
    newTemp = 298 + (oldTemp - 298) * Math.pow(COOLING_RATE, deltaTime);
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
