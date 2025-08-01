// import { COOLING_RATE, HEATING_RATE } from "./config";
// import { getIsHeating, getTemperature, setTemperature } from "./state";

const timeMultiplicationFactor = 1;

const RATE_MULTIPLIER = 100;
const KA0 = 20.764 * RATE_MULTIPLIER * 10;
const EA = 34.814 * RATE_MULTIPLIER;
const Ka = (T) => { return KA0 * Math.exp(-EA/T); }
const KD0 = 4.104 * RATE_MULTIPLIER;
const ED = 58.102 * RATE_MULTIPLIER;
const Kd = (T) => { return KD0 * Math.exp(-ED/T); }
const BED_MAX_CAPACITY = 1; // mol CO2 total

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

  // const th0 = theta({ t: t, cCO2: C }); // initial amount adsorbed
  // const th1 = theta({ t: t + tStep, cCO2: C }); // amount adsorbed after time tStep

  // const amount_adsorbed = nMax * (th1 - th0); // moles of CO2 adsorbed in time tStep

  // const amount_passed_through = Math.max(0, nCO2 * tStep - amount_adsorbed); // the amount of CO2 that did not adsorb in time tStep

  // let yOut = amount_passed_through / tStep / (amount_passed_through / tStep + nN2) || 0;

  // function thetaDesorption(tInput, { Ea = 35000, k0 = 1e3, T0 = 298, beta = 0.1, dt = 0.1, theta0 = th1 } = {}) {
  //   const R = 8.314;
  //   let theta = theta0;
  //   let t = 0;

  //   // Integrate using Euler steps until t >= tInput
  //   while (t < tInput && theta > 0) {
  //     let T = T0 + beta * t;
  //     let k = k0 * Math.exp(-Ea / (R * T));
  //     let dtheta_dt = -k * theta;

  //     theta += dtheta_dt * dt;
  //     if (theta < 0) theta = 0;

  //     t += dt;
  //   }

  //   console.log("theta0", theta0);

  //   return theta;
  // }

  // if (!desorbing) {
  //   console.log("th1", th1.toFixed(4));
  //   return yOut;
  // } else {
  //   const t = args.t * timeMultiplicationFactor;
  //   const delta_t = t - timeOfDesorption;
  //   const thetaDesorbed = thetaDesorption(delta_t); // amount of CO2 desorbed in time delta_t
  //   yOut = yOut * thetaDesorbed;
  //   console.log("thetaDesorbed", thetaDesorbed.toFixed(4));
  //   return yOut;
  // }

}

export const HEATING_RATE = 5 // K / s
export const COOLING_RATE = Math.exp(-1/3);
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

/**
 * A function to test the adsorbtion of CO2
 * at various pressures, temperatures, and inlet mole fractions.
 */
// (function testTheta() {
//   const P = 5.0;
//   const T = 273;
//   const timePassed = 1e9;
//   const C = cCO2({
//     P: P,
//     T: T,
//     yCO2: 1
//   });

//   const thetaTheoretical = theta({
//     t: timePassed,
//     cCO2: C,
//     ka: 9.120e-6,
//     kd: 4.365e-4
//   }) * 12;

//   console.log({ P, T, thetaTheoretical });
// })()

/**
 * A function to find the best ka and kd values
 * to fit the experimental data.
 */
// (function findKa_Kd() {
//   const experimentalData = [
//     [0.1, 273, 1.50],
//     [0.1, 298, 1.20],
//     [0.1, 323, 0.95],
//     [0.1, 348, 0.75],
//     [0.5, 273, 3.75],
//     [0.5, 298, 3.00],
//     [0.5, 323, 2.45],
//     [0.5, 348, 2.00],
//     [1.0, 273, 5.90],
//     [1.0, 298, 4.80],
//     [1.0, 323, 3.90],
//     [1.0, 348, 3.10],
//     [2.0, 273, 7.80],
//     [2.0, 298, 6.50],
//     [2.0, 323, 5.40],
//     [2.0, 348, 4.50],
//     [5.0, 273, 10.20],
//     [5.0, 298, 8.50],
//     [5.0, 323, 7.00],
//     [5.0, 348, 5.90],
//     [10.0, 273, 12.00],
//     [10.0, 298, 10.10],
//     [10.0, 323, 8.50],
//     [10.0, 348, 7.20]
//   ];
//   const timePassed = 1e5; // This should be enough time to reach equilibrium
//
//   let largestError = 1e9; // set initial error to an unrealistically high value
//   let kaBest, kdBest;
//   const kaStart = 1e-6;
//   const kdStart = 1e-4;
//   const kaEnd = 1e-3;
//   const kdEnd = 1;
//   const kaStep = Math.pow(kaEnd / kaStart, 1 / 1e2); // test 100 different values for ka in geometric progression
//   const kdStep = Math.pow(kdEnd / kdStart, 1 / 1e2);
//   for (let ka = kaStart; ka < kaEnd; ka *= kaStep) {
//     for (let kd = kdStart; kd < kdEnd; kd *= kdStep) {
//       let totalDifference = 0;
//       for (let i = 0; i < experimentalData.length; i++) {
//         const P = experimentalData[i][0];
//         const T = experimentalData[i][1];
//         const thetaExperimental = experimentalData[i][2] / 12;
//
//         const C = cCO2({
//           P: P,
//           T: T,
//           yCO2: 1
//         });
//
//         const thetaTheoretical = theta({
//           t: timePassed,
//           ka: ka,
//           kd: kd,
//           cCO2: C
//         });
//         const thetaDifference = Math.abs(thetaExperimental - thetaTheoretical);
//         totalDifference += thetaDifference;
//       }
//       if (totalDifference < largestError) {
//         largestError = totalDifference;
//         kaBest = ka;
//         kdBest = kd;
//       }
//     }
//   }
//   console.log(`Best ka: ${kaBest.toExponential(3)}, Best kd: ${kdBest.toExponential(3)}, Error: ${err}`);
// })()

/**
 * A function to generate a CSV file with the outlet mole fraction of CO2
 * as a function of time for different inlet mole fractions.
 */
// (function generateGraphData() {
//   const moleFractions = [0.15, 0.5, 1.0];
//   const P = 5.0; // pressure = 5 bar
//   const T = 273; // temperature = 298 K
//   const tStep = 0.1; // time step in seconds. This can be any arbitrary value and d
//   const V = 0.05; // volumetric flow rate of gas in L / s

//   moleFractions.forEach(y => {
//     const outputData = []
//     for (let t = 0; t < 600; t += 1) {
//       const outlet = yCO2_out({ t, tStep, V, P, T, yCO2: y });
//       outputData.push([t, Math.round(outlet * 1e4) / 1e4]);
//     }
//     const dataString = outputData.map(d => d.join(",")).join("\n");
//     const blob = new Blob([dataString], { type: "text/csv" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = `yCO2_out_${y}.csv`;
//     link.style.display = "none";
//     // link.click();
//   });
// })()

/**
 * A function to generate a CSV file with the theoretical theta values
 * for the same pressures and temperatures as in the experimental measurement.
 */
// (function generateTheoreticalTheta() {
//   const experimental_P_T = [
//     [0.1, 273],
//     [0.1, 298],
//     [0.1, 323],
//     [0.1, 348],
//     [0.5, 273],
//     [0.5, 298],
//     [0.5, 323],
//     [0.5, 348],
//     [1.0, 273],
//     [1.0, 298],
//     [1.0, 323],
//     [1.0, 348],
//     [2.0, 273],
//     [2.0, 298],
//     [2.0, 323],
//     [2.0, 348],
//     [5.0, 273],
//     [5.0, 298],
//     [5.0, 323],
//     [5.0, 348],
//     [10.0, 273],
//     [10.0, 298],
//     [10.0, 323],
//     [10.0, 348]
//   ];

//   const outputData = [...experimental_P_T];
//   experimental_P_T.forEach(([P, T], i) => {
//     const C = cCO2({ P, T, yCO2: 1 });
//     let thetaTheoretical = theta({ t: 1e9, cCO2: C }) * 12;
//     thetaTheoretical = Math.round(thetaTheoretical * 1e3) / 1e3; // round to 4 decimal places
//     outputData[i].push(thetaTheoretical);
//   });
//   const dataString = outputData.map(d => d.join(",")).join("\n");
//   const blob = new Blob([dataString], { type: "text/csv" });
//   const url = URL.createObjectURL(blob);
//   const link = document.createElement("a");
//   link.href = url;
//   link.download = `theoretical_theta.csv`;
//   link.style.display = "none";
//   // link.click();
// })()

// (function CO2Landing() {
//   let temperatures = [25, 50, 75, 100, 125, 150];
//   temperatures = temperatures.map(t => t + 273); // convert to K
//   const pressures = [];
//   for (let p = 0.01; p <= 5; p += 0.01) {
//     pressures.push(p);
//   }
//   const CO2_data = [];
//   temperatures.forEach((T, i) => {
//     CO2_data.push([]);
//     pressures.forEach(P => {
//       const C = cCO2({ P: P, T: T, yCO2: 1 });
//       const thetaTheoretical = theta({ t: 1e9, cCO2: C }) * 12;
//       CO2_data[i].push(thetaTheoretical);
//     });
//   });

//   const dataString = CO2_data.map(d => d.join(",")).join("\n");
//   const blob = new Blob([dataString], { type: "text/csv" });
//   const url = URL.createObjectURL(blob);
//   const link = document.createElement("a");
//   link.href = url;
//   link.download = `CO2_landing.csv`;
//   link.style.display = "none";
//   // link.click();
// })()
