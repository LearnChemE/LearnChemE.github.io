module.exports = function calcAll() {
  const v1 = g.velocity_1 / 1000; // user-specified velocity of water (m/s)
  let v2, v3, v4, v5; // other velocities must be calculated (m/s)

  // diamter of each portion of the venturi meter (m)
  const d1 = g.venturi_outer / 1000;
  const d2 = (g.venturi_outer * 0.5 + g.venturi_inner * 0.5) / 1000;;
  const d3 = g.venturi_inner / 1000;
  const d4 = (g.venturi_outer * 0.5 + g.venturi_inner * 0.5) / 1000;
  const d5 = (g.venturi_outer) / 1000;

  // areas of each portion of the venturi meter (m^2)
  const A1 = (d1 / 2)**2 * Math.PI;
  const A2 = (d2 / 2)**2 * Math.PI;
  const A3 = (d3 / 2)**2 * Math.PI;
  const A4 = (d4 / 2)**2 * Math.PI;
  const A5 = (d5 / 2)**2 * Math.PI;

  v2 = v1 * (A1 / A2);
  v3 = v1 * (A1 / A3);
  v4 = v1 * (A1 / A4);
  v5 = v1 * (A1 / A5);

  // pressure for each portion of the venturi meter (Pa)
  const P1 = g.pressure_1 * 9.80665; // 9.80665 Pa per mmH2O
  const P2 = calcP(P1, v1, v2);
  const P3 = calcP(P1, v1, v3);
  const P4 = calcP(P1, v1, v4);
  const P5 = calcP(P1, v1, v5);

  // set the global variables in their respective units
  g.velocity_2 = v2 * 1000; // (mm/s)
  g.velocity_3 = v3 * 1000;
  g.velocity_4 = v4 * 1000;
  g.velocity_5 = v5 * 1000;
  g.pressure_2 = P2 / 9.80665; // mmH2O
  g.pressure_3 = P3 / 9.80665;
  g.pressure_4 = P4 / 9.80665;
  g.pressure_5 = P5 / 9.80665;

}

function calcP(P1, v1, v2) {
  const rho = 1000; // density of water (kg / m^3)
  // left-hand side of Bernoulli eqn with v2 term moved to lhs (Pa)
  const P2 = (P1 + 101325) + 0.5 * rho * v1**2 - 0.5 * rho * v2**2;
  const P = (P2 - 101325);
  return P
}