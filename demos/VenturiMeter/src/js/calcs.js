function calcAll() {
  const P_mmH2O = gvs.inlet_pressure; // mmH2O
  const P_Pa = P_mmH2O * 9.80638; // Pa
  const rho = 1000; // kg/m^3
  const A1 = ((gvs.outer_diameter / 2)**2) * Math.PI;
  const A2 = ((gvs.inner_diameter / 2)**2) * Math.PI;
  gvs.choke_velocity = gvs.inlet_velocity * (A1 / A2);
  const delta_P_Pa = 0.5 * rho * (gvs.choke_velocity**2 - gvs.inlet_velocity**2);
  const delta_P_mmH2O = delta_P_Pa / 9.80638;
  gvs.manometer_1_pressure = 120;
  gvs.manometer_2_pressure = (gvs.manometer_1_pressure + (gvs.manometer_1_pressure - delta_P_mmH2O)) / 2;
  gvs.manometer_3_pressure = gvs.manometer_1_pressure - delta_P_mmH2O;
  if(gvs.include_friction) {
    gvs.manometer_4_pressure = (gvs.manometer_1_pressure + gvs.manometer_3_pressure) / 2 - (1 - gvs.discharge_coefficient) * gvs.manometer_1_pressure / 2;
    gvs.manometer_5_pressure = gvs.discharge_coefficient * gvs.manometer_1_pressure;
  } else {
    gvs.manometer_4_pressure = (gvs.manometer_1_pressure + gvs.manometer_3_pressure) / 2;
    gvs.manometer_5_pressure = gvs.manometer_1_pressure;
  }
}

module.exports = calcAll;