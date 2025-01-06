// let pMax = 130; // mmH2O
// pMax = pMax * 9.80638; // Pa
// const pSq = Math.sqrt(pMax);
// let VMax = 0; // m^3/s
// const D1 = 0.02; // m
// const D2 = 0.01; // m
// const rho = 1000; // kg/m^3
// const mu = 0.001; // Pa*s
// const A1 = Math.PI * (D1 / 2) ** 2; // m^2
// const A2 = Math.PI * (D2 / 2) ** 2; // m^2
// const B = A2 / A1;

// function diff(V) {
//   const v = V / A1; // average velocity, m/s
//   const Re = v * D1 * rho / mu;
//   const Cd = 0.5959 + 0.0312 * B ** 8 + 91.71 * B ** 2.5 / Re ** 0.75;
//   const rhs = pSq * Cd * A2 * Math.sqrt(2 / (rho * (1 - B ** 2)));
//   return Math.abs(rhs - V);
// }

// function solve() {
//   let V = 0; // m^3/s
//   let d = diff(V);
//   let i = 0;
//   while (d > 0.00000001) {
//     V += 0.00000001;
//     d = diff(V);
//     i++;
//     if (i > 1000000) {
//       throw new Error('Max iterations exceeded');
//     }
//   }
//   const VmL = V * 1e6; // mL/s
//   return VmL;
// }

// console.log(solve());

const K = 0.15; // minor loss coefficient
const pMax = 130 * 9.80638; // Pa
const D1 = 0.015; // m
const D2 = 0.0075; // m
const rho = 1000; // kg/m^3
const mu = 0.001; // Pa*s
const A1 = Math.PI * (D1 / 2) ** 2; // m^2
const A2 = Math.PI * (D2 / 2) ** 2; // m^2
const L = 2; // m - length of the tube exiting the venturi meter
const g = 9.81; // m/s^2 - acceleration due to gravity

function diff(V) {
  const v = V / A1; // average velocity, m/s
  const Re = v * D1 * rho / mu;
  let f;
  const laminar = Re < 2800;
  if (laminar) {
    f = 64 / Re; // Darcy friction factor
  } else {
    f = 0.25 / Math.log10(5.74 / Math.pow(Re, 0.9)) ** 2;
  }

  const P4 = (rho * v ** 2 * f * L) / (2 * D1); // pressure drop (Pa)
  const vThroat = V / A2; // velocity at the throat (m/s)
  let Hf = K * (vThroat ** 2) / (2 * g); // head loss (m)
  // convert Hf to Pa
  Hf = Hf * rho * g;
  const P1 = P4 + Hf; // pressure at first manometer (Pa)
  return Math.abs(P1 - pMax);
}

function solve() {
  let V = 0.000001; // m^3/s
  let d = diff(V);
  let i = 0;
  while (d > 50) {
    V += 0.000001;
    d = diff(V);
    i++;
    if (i > 1000000) {
      throw new Error('Max iterations exceeded');
    }
  }
  const VmL = V * 1e6; // mL/s
  return VmL;
}

console.log(solve());