const V = 2; // Volume of tank (L)
const R = 0.08314; // Gas constant ( (L bar) / (mol K) )

g.Psat = function(t) {
  let exp;
  if (g.chemical == "propane") {
    exp = 3.98292 - 819.296 / (t + 248.6)
  } else {
    exp = 4.14157 - 1377.578 / (t + 222.493)
  }
  return 10 ** exp
}

// Density (g/L)
g.rho = function() {
  if (g.chemical == "propane") {
    return 580
  } else {
    return 867
  }
}

// Molecular weight (g/mol)
g.MW = function() {
  if (g.chemical == "propane") {
    return 44.1
  } else {
    return 92.14
  }
}

// Mols per liter
g.rhoLm = function() {
  return g.rho() / g.MW()
}

function calcAll() {
  let d = 1e9;
  let liq_estimate = 0;
  for (let liq = 0; liq < g.n; liq += 0.0001) {
    const vap = g.n - liq;
    const RHS = (liq / g.rhoLm()) + (vap * R * (g.T + 273.15) / g.Psat(g.T)); // Right-hand side of the equation V == L / rhoLm + (V R T) / Psat
    const dV = Math.abs(V - RHS);
    if (dV < d) {
      d = dV
      liq_estimate = liq
    }
  }
  const liq = liq_estimate;
  g.L_final = Number(liq.toFixed(4)); // Fix to 3-digit precision
  g.V_final = Number((g.n - g.L_final).toFixed(4)); // Fix to 3-digit precision
  g.final_liquid_level = 1.5 * (g.L_final / g.rhoLm()) / V;
  const max_n = 2; // Max number of moles of vapor possible
  g.final_vapor_density = 0.05 + 0.95 * (g.V_final / max_n); // Even for tiny amounts of vapor, we want it to be at least 5% density
  g.P_final = P_final(); // Next, calculate the final pressure
}

function P_final() {
  if (g.L_final == 0) {
    return g.n * R * (g.T + 273.15) / V
  } else {
    return g.Psat(g.T)
  }
}

module.exports = calcAll;