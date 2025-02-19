export default function calcAll() {
  // const K = 0.5; // minor loss coefficient
  // const D1 = state.outer_diameter / 1000; // m
  // const D2 = state.inner_diameter / 1000; // m
  // const rho = 1000; // density of water, kg / m^3
  // const mu = 0.001; // dynamic viscosity of water, Pa * s
  // const A1 = Math.PI * (D1 / 2) ** 2; // area of venturi outer tube, m^2
  // const A2 = Math.PI * (D2 / 2) ** 2; // area of venturi choke, m^2
  // const L = 20; // length of the tube exiting the venturi meter, m
  // const g = 9.81; // acceleration due to gravity, m / s^2
  // const V = state.flowRate / 1e6;

  // const v = V / A1; // average velocity, m / s
  // const Re = v * D1 * rho / mu; // Reynolds number, dimensionless

  // const f = 0.25 / Math.log10(5.74 / Math.pow(Re, 0.9)) ** 2; // friction factor, dimensionless - Swamee Jain equation

  // let P5 = (rho * v ** 2 * f * L) / (2 * D1); // pressure drop across venturi meter, including friction, Pa
  // const vThroat = V / A2; // velocity at the throat, m/s
  // let Hf = K * (vThroat ** 2) / (2 * g); // head loss (m)
  // Hf = Hf * rho * g; // convert Hf to Pa
  // let P1 = P5 + Hf; // pressure at first manometer (Pa)

  // const dP = rho * ((V * 4 * Math.sqrt(1 - (D2 / D1) ** 4)) / (Math.PI * D2 ** 2)) ** 2 / 2;
  // const P3 = P1 - dP; // pressure at third manometer, Pa

  // const Dmid = (D1 + D2) / 2; // m
  // const dPmid = rho * ((V * 4 * Math.sqrt(1 - (Dmid / D1) ** 4)) / (Math.PI * Dmid ** 2)) ** 2 / 2;
  // const P2 = P1 - dPmid; // pressure at second manometer, Pa
  // const P4 = P5 - dPmid;

  // state.manometer_1_pressure = P1 / 9.80638; // mmH2O
  // state.manometer_2_pressure = P2 / 9.80638; // mmH2O
  // state.manometer_3_pressure = P3 / 9.80638; // mmH2O
  // state.manometer_4_pressure = P4 / 9.80638; // mmH2O
  // state.manometer_5_pressure = P5 / 9.80638; // mmH2O

  const V = state.flowRate;
  const rho = 1000; // density of water, kg / m^3
  const g = 9.81; // acceleration due to gravity, m / s^2
  const P1 = rho * g * (0.4179 * V ** 2 + 1.8196 * V + 0.0001);
  const delta_P1 = 1000 * (0.0594 * V ** 2 + 0.8074 * V);
  const P2 = P1 - delta_P1;
  const delta_P2 = 1000 * (3.4128 * V ** 2 + 0.8044 * V);
  const P3 = P1 - delta_P2;
  const delta_P3 = 1000 * (0.9448 * V ** 2 + 7.7015 * V);
  const P4 = P1 - delta_P3;
  const delta_P4 = 1000 * (0.9393 * V ** 2 + 6.5932 * V);
  const P5 = P1 - delta_P4;

  const H1 = P1 / (rho * g);
  const H2 = P2 / (rho * g);
  const H3 = P3 / (rho * g);
  const H4 = P4 / (rho * g);
  const H5 = P5 / (rho * g);

  state.manometer_1_pressure = H1;
  state.manometer_2_pressure = H2;
  state.manometer_3_pressure = H3;
  state.manometer_4_pressure = H4;
  state.manometer_5_pressure = H5;
}