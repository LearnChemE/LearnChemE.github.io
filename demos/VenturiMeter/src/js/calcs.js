function calcAll() {
  const P_mmH2O = gvs.inlet_pressure; // mmH2O
  const P_Pa = P_mmH2O * 9.80638; // Pa
  const rho = 1000; // kg/m^3
  const inlet_velocity = Math.sqrt(2 * P_Pa / rho);
  const A1 = ((gvs.outer_diameter / 2)**2) * Math.PI;
  const A2 = ((gvs.inner_diameter / 2)**2) * Math.PI;
  const inner_velocity = (A1 / A2) * inlet_velocity;
  const pressure_drop_Pa = 0.5 * rho * (inner_velocity**2 - inlet_velocity**2);
  const pressure_drop_mmH2O = pressure_drop_Pa / 9.80638;
  console.log(pressure_drop_mmH2O);
}

module.exports = calcAll;