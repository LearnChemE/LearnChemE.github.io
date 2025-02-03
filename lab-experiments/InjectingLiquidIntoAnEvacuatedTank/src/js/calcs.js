const V = 2; // Volume of tank (L)
const R = 0.08314; // Gas constant ((L bar) / (mol K))


// Function for calculating saturation pressure based on temperature
gvs.Psat = function(t) {
  let exp;
  if (gvs.chemical == "propane") {
    exp = 3.98292 - 819.296 / (t + 248.6);
  } else {
    exp = 4.14157 - 1377.578 / (t + 222.493);
  }
  return 10 ** exp; // Psat equation
};

// Density (g/L) based on the chemical
gvs.rho = function() {
  if (gvs.chemical == "propane") {
    return 580;
  } else {
    return 867;
  }
};

// Molecular weight (g/mol) based on the chemical
gvs.MW = function() {
  if (gvs.chemical == "propane") {
    return 44.1;
  } else {
    return 92.14;
  }
};

// Mols per liter
gvs.rhoLm = function() {
  return gvs.rho() / gvs.MW();
};



// Main function to calculate all simulation values based on the current temperature
function calcAll() {
  let d = 1e9;
  let liq_estimate = 0;
  
  //gvs.T = currentTemp; // Set the current temperature dynamically
  currentTemp = gvs.T;

  // Iterate to find the liquid estimate using the equation for liquid-vapor equilibrium
  for (let liq = 0; liq < gvs.n; liq += 0.0001) {
    const vap = gvs.n - liq; // Vapor moles
    const RHS =
      liq / gvs.rhoLm() +
      (vap * R * (gvs.T + 273.15)) / gvs.Psat(gvs.T); // Right-hand side of the equation: V == L / rhoLm + (V R T) / Psat

    const dV = Math.abs(V - RHS); // Difference between predicted volume and actual volume
    if (dV < d) {
      d = dV;
      liq_estimate = liq;
    }
  }

  const liq = liq_estimate;
  gvs.L_final = Number(liq.toFixed(4)); // Final liquid volume with 4-digit precision
  gvs.V_final = Number((gvs.n - gvs.L_final).toFixed(4)); // Final vapor volume with 4-digit precision

  // Calculate the final liquid level (exaggerated for visualization)
  gvs.final_liquid_level = 1.5 * (gvs.L_final / gvs.rhoLm()) / V;

  const max_n = 2; // Max number of moles of vapor possible
  gvs.final_vapor_density = 0.05 + 0.95 * (gvs.V_final / max_n); // Calculate vapor density

  // Update final pressure based on the temperature and the current state (liquid or vapor phase)
  gvs.P_final = P_final(gvs.T); // Pressure depends on the current temperature
}

// Final pressure calculation based on temperature
function P_final(currentTemp) {
  if (gvs.L_final == 0) {
    // If there's no liquid phase, use the ideal gas law to calculate pressure
    return (gvs.n * R * (currentTemp + 273.15)) / V;
  } else {
    // If there's a liquid phase, use the saturation pressure
    return gvs.Psat(currentTemp);
  }
}

module.exports = calcAll;
