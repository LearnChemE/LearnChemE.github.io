const V = 2; // Volume of tank (L)
const R = 0.08314; // Gas constant ((L bar) / (mol K))


// Function for calculating saturation pressure based on temperature
g.Psat = function(t) {
  let exp;
  if (g.chemical == "propane") {
    exp = 3.98292 - 819.296 / (t + 248.6);
  } else {
    exp = 4.14157 - 1377.578 / (t + 222.493);
  }
  return 10 ** exp; // Psat equation
};

// Density (g/L) based on the chemical
g.rho = function() {
  if (g.chemical == "propane") {
    return 580;
  } else {
    return 867;
  }
};

// Molecular weight (g/mol) based on the chemical
g.MW = function() {
  if (g.chemical == "propane") {
    return 44.1;
  } else {
    return 92.14;
  }
};

// Mols per liter
g.rhoLm = function() {
  return g.rho() / g.MW();
};



// Main function to calculate all simulation values based on the current temperature
function calcAll() {
  let d = 1e9;
  let liq_estimate = 0;

  //g.T = currentTemp; // Set the current temperature dynamically
  currentTemp = g.T;

  // Iterate to find the liquid estimate using the equation for liquid-vapor equilibrium
  for (let liq = 0; liq < g.n; liq += 0.0001) {
    const vap = g.n - liq; // Vapor moles
    const RHS =
      liq / g.rhoLm() +
      (vap * R * (g.T + 273.15)) / g.Psat(g.T); // Right-hand side of the equation: V == L / rhoLm + (V R T) / Psat

    const dV = Math.abs(V - RHS); // Difference between predicted volume and actual volume
    if (dV < d) {
      d = dV;
      liq_estimate = liq;
    }
  }

  const liq = liq_estimate;
  g.L_final = Number(liq.toFixed(4)); // Final liquid volume with 4-digit precision
  g.V_final = Number((g.n - g.L_final).toFixed(4)); // Final vapor volume with 4-digit precision

  // Calculate the final liquid level (exaggerated for visualization)
  g.final_liquid_level = 1.5 * (g.L_final / g.rhoLm()) / V;

  const max_n = 2; // Max number of moles of vapor possible
  g.final_vapor_density = 0.05 + 0.95 * (g.V_final / max_n); // Calculate vapor density

  // Update final pressure based on the temperature and the current state (liquid or vapor phase)
  g.P_final = P_final(g.T); // Pressure depends on the current temperature
}

// Final pressure calculation based on temperature
function P_final(currentTemp) {
  if (g.L_final == 0) {
    // If there's no liquid phase, use the ideal gas law to calculate pressure
    return (g.n * R * (currentTemp + 273.15)) / V;
  } else {
    // If there's a liquid phase, use the saturation pressure
    return g.Psat(currentTemp);
  }
}

module.exports = calcAll;