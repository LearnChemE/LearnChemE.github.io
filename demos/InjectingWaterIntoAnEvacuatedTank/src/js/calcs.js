const V = 2; // Volume of tank (L)
const R = 0.08314; // Gas constant ( (L bar) / (mol K) )

gvs.Psat = function(t) {
  let exp;
  if( gvs.chemical == "propane" ) {
    exp = 3.98292 - 819.296 / (t + 248.6)
  } else {
    exp = 4.14157 - 1377.578 / (t + 222.493)
  }
  return 10**exp
}

// Density (g/L)
gvs.rho = function() {
  if(gvs.chemical == "propane") {
    return 580
  } else {
    return 867
  }
}

// Molecular weight (g/mol)
gvs.MW = function() {
  if(gvs.chemical == "propane") {
    return 44.1
  } else {
    return 92.14
  }
}

// Mols per liter
gvs.rhoLm = function() {
  return gvs.rho() / gvs.MW()
}

function calcAll() {
  let d = 1e9;
  let liq_estimate = 0;
  for( let liq = 0; liq < gvs.n; liq += 0.0001 ) {
    const vap = gvs.n - liq;
    const RHS = ( liq / gvs.rhoLm() ) + ( vap * R * (gvs.T + 273.15) / gvs.Psat(gvs.T) ); // Right-hand side of the equation V == L / rhoLm + (V R T) / Psat
    const dV = Math.abs(V - RHS);
    if(dV < d) {
      d = dV
      liq_estimate = liq
    }
  }
  const liq = liq_estimate;
  gvs.L_final = Number(liq.toFixed(4)); // Fix to 3-digit precision
  gvs.V_final = Number((gvs.n - gvs.L_final).toFixed(4)); // Fix to 3-digit precision
  gvs.final_liquid_level = 1.5 * (gvs.L_final / gvs.rhoLm()) / V;
  const max_n = 2; // Max number of moles of vapor possible
  gvs.final_vapor_density = gvs.V_final / max_n;
  gvs.P_final = P_final(); // Next, calculate the final pressure
}

function P_final() {
  if(gvs.L_final == 0) {
    return gvs.n * R * (gvs.T + 273.15) / V
  } else {
    return gvs.Psat(gvs.T)
  }
}

module.exports = calcAll;