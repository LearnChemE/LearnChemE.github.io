const V = g.tank_volume; // Volume of tank (L)
const R = 0.08314; // Gas constant ( (L bar) / (mol K) )

g.Psat = function(t) {
  let A, B, C, exp;
  switch (g.chemical) {
    case "a":
      A = 6.880;
      B = 1197;
      C = 219.2;
      break;
    case "b":
      A = 8.1122;
      B = 1592.864;
      C = 226.184;
      break;
    case "c":
      A = 6.89677;
      B = 1264.9;
      C = 216.544;
      break;
    case "d":
      A = 8.07131;
      B = 1730.63;
      C = 233.426;
      break;
    case "e":
      A = 7.264753;
      B = 1434.148;
      C = 246.7207;
      break;
    default:
      A = 6.880;
      B = 1197;
      C = 219.2;
      break;
  }
  exp = A - B / (C + t);
  const mmHg = Math.pow(10, exp);
  // Convert to bar
  return mmHg / 750.0616827;
}

// Density (g/L)
g.rho = function() {
  switch (g.chemical) {
    case "a":
      return 876;
    case "b":
      return 789;
    case "c":
      return 684;
    case "d":
      return 1000;
    case "e":
      return 779;
    default:
      return 876;
  }
}

// Molecular weight (g/mol)
g.MW = function() {
  switch (g.chemical) {
    case "a":
      return 78.11;
    case "b":
      return 46.07;
    case "c":
      return 100.21;
    case "d":
      return 18.02;
    case "e":
      return 84.16;
    default:
      return 78.11;
  }
}

// Mols per liter
g.rhoLm = function() {
  return g.rho() / g.MW()
}

function calcAll() {
  let d = 1e9;
  let liq_estimate = 0;
  for (let liq = 0; liq < g.n_max; liq += 0.0001) {
    const vap = g.n_max - liq;
    const RHS = (liq / g.rhoLm()) + (vap * R * (g.T + 273.15) / g.Psat(g.T)); // Right-hand side of the equation V == L / rhoLm + (V R T) / Psat
    const dV = Math.abs(V - RHS);
    if (dV < d) {
      d = dV
      liq_estimate = liq
    }
  }
  const liq = liq_estimate;
  g.L_final = Number(liq.toFixed(4)); // Fix to 3-digit precision
  g.V_final = Number((g.n_max - g.L_final).toFixed(4)); // Fix to 3-digit precision
  g.P_final = P_final(); // Next, calculate the final pressure
}

function P_final() {
  if (g.L_final == 0) {
    return g.n_max * R * (g.T + 273.15) / V
  } else {
    return g.Psat(g.T)
  }
}

module.exports = calcAll;