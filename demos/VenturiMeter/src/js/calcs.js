function calcAll() {
  const K = 0.5; // minor loss coefficient
  const D1 = gvs.outer_diameter / 1000; // m
  const D2 = gvs.inner_diameter / 1000; // m
  const rho = 1000; // density of water, kg / m^3
  const mu = 0.001; // dynamic viscosity of water, Pa * s
  const A1 = Math.PI * (D1 / 2) ** 2; // area of venturi outer tube, m^2
  const A2 = Math.PI * (D2 / 2) ** 2; // area of venturi choke, m^2
  const L = 40; // length of the tube exiting the venturi meter, m
  const g = 9.81; // acceleration due to gravity, m / s^2
  const V = gvs.volumetric_flow_rate;

  const v = V / A1; // average velocity, m / s
  const Re = v * D1 * rho / mu; // Reynolds number, dimensionless

  const f = 0.25 / Math.log10(5.74 / Math.pow(Re, 0.9)) ** 2; // friction factor, dimensionless - Swamee Jain equation

  let P5 = (rho * v ** 2 * f * L) / (2 * D1); // pressure drop across venturi meter, including friction, Pa
  const vThroat = V / A2; // velocity at the throat, m/s
  let Hf = K * (vThroat ** 2) / (2 * g); // head loss (m)
  Hf = Hf * rho * g; // convert Hf to Pa
  let P1 = P5 + Hf; // pressure at first manometer (Pa)

  if (!gvs.include_friction) {
    P5 = P1;
  }

  const dP = 0.5 * rho * (vThroat ** 2 - v ** 2); // pressure drop across venturi meter, not including friction, Pa
  const P3 = P1 - dP; // pressure at third manometer, Pa

  const P2 = (P1 + P3) / 2; // pressure at second manometer, Pa
  const P4 = (P3 + P5) / 2; // pressure at fourth manometer, Pa

  gvs.manometer_1_pressure = P1 / 9.80638; // mmH2O
  gvs.manometer_2_pressure = P2 / 9.80638; // mmH2O
  gvs.manometer_3_pressure = P3 / 9.80638; // mmH2O
  gvs.manometer_4_pressure = P4 / 9.80638; // mmH2O
  gvs.manometer_5_pressure = P5 / 9.80638; // mmH2O

  // const P_mmH2O = gvs.inlet_pressure; // mmH2O
  // const P_Pa = P_mmH2O * 9.80638; // Pa
  // const rho = 1000; // kg/m^3
  // const A1 = ((gvs.outer_diameter / 2) ** 2) * Math.PI;
  // const A2 = ((gvs.inner_diameter / 2) ** 2) * Math.PI;
  // gvs.choke_velocity = gvs.inlet_velocity * (A1 / A2);
  // const delta_P_Pa = 0.5 * rho * (gvs.choke_velocity ** 2 - gvs.inlet_velocity ** 2);
  // const delta_P_mmH2O = delta_P_Pa / 9.80638;
  // gvs.manometer_1_pressure = 120;
  // gvs.manometer_2_pressure = (gvs.manometer_1_pressure + (gvs.manometer_1_pressure - delta_P_mmH2O)) / 2;
  // gvs.manometer_3_pressure = gvs.manometer_1_pressure - delta_P_mmH2O;
  // if (gvs.include_friction) {
  //   gvs.manometer_4_pressure = (gvs.manometer_1_pressure + gvs.manometer_3_pressure) / 2 - (1 - gvs.discharge_coefficient) * gvs.manometer_1_pressure / 2;
  //   gvs.manometer_5_pressure = gvs.discharge_coefficient * gvs.manometer_1_pressure;
  // } else {
  //   gvs.manometer_4_pressure = (gvs.manometer_1_pressure + gvs.manometer_3_pressure) / 2;
  //   gvs.manometer_5_pressure = gvs.manometer_1_pressure;
  // }
}

module.exports = calcAll;