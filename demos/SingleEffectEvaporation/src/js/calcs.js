function Hvap(T_K) {
  const T_C = T_K - 273; // temperature in celsius
  let H_vap = 193.1 - 10950 * Math.log( ( 374 - T_C ) / 647) * ( 374 - T_C )**0.785 / ( 273 + T_C ); // heat of vaporization (kJ/kg)
  H_vap *= 1000; // heat of vaporization converted to J/kg
  return H_vap;  
}

function Cp(T_K, xs) {
  // Equation for heat capacity of sugar solution
  // Source: https://onlinelibrary.wiley.com/doi/pdf/10.1002/9781444320527.app1
  const T_C = T_K - 273.15;
  let cp = 1 - ( 0.6 - 0.0018 * T_C ) * xs; // heat capacity (kcal/kg)
  cp *= 4.1868; // heat capacity (kJ/kg)
  cp *= 1000; // heat capacity (J/kg)
  return cp;
}

// Calculates boiling temperature (K) from pressure (MPa)
// Source: https://webbook.nist.gov/cgi/cbook.cgi?ID=C7732185
function T_boiling(P) {
  const P_bar = P * 10; // Pressure in bar
  let T = 298; // boiling temperature (K)
  let Psat = 0;
  let i = 0;
  while(Psat < P_bar && i < 1000) {
    T++;
    i++;
    if(T < 379) {
      const T_C = T - 273.15; // Temperature in celsius
      const A = 8.07131;
      const B = 1730.63;
      const C = 233.426;
      Psat = 10**( A - B / ( T_C + C ) ); // saturation pressure, mmHg;
      Psat *= 0.00133322; // convert to bar
    } else {
      const A = 3.55959;
      const B = 643.748;
      const C = -198.043;
      Psat = 10**( A - B / ( T + C ) );
    }
  }
  return T;
}

let iterations = 0;

function calcAll() {
  iterations = 0;
  iterate();
}

function iterate() {
  // Calculate the heat transfer value
  gvs.Q = gvs.hx_U * gvs.hx_A * ( gvs.t_steam - gvs.t_evaporator );

  // Calculate the heats of vaporization of steam and concentrate streams
  gvs.Hvap_steam = Hvap(gvs.t_steam);
  gvs.Hvap_conc = Hvap(gvs.t_evaporator);

  // Calculate the mole fractions at the inlet and in concentrate
  gvs.xs_inlet = (gvs.conc_inlet / gvs.MW_sugar) / (gvs.conc_inlet / gvs.MW_sugar + (1 - gvs.conc_inlet) / gvs.MW_water);
  gvs.xw_inlet = 1 - gvs.xs_inlet;
  gvs.xs_conc = (gvs.conc_concentrate / gvs.MW_sugar) / (gvs.conc_concentrate / gvs.MW_sugar + (1 - gvs.conc_concentrate) / gvs.MW_water);
  gvs.xw_conc = 1 - gvs.xs_conc;

  // Limit the concentrations to reasonable values
  gvs.xs_conc = Math.min(0.99999999, Math.max(0.00000001, gvs.xs_conc));
  gvs.xw_conc = Math.min(0.99999999, Math.max(0.00000001, gvs.xw_conc));
  gvs.conc_concentrate = gvs.xs_conc * gvs.MW_sugar / (gvs.xs_conc * gvs.MW_sugar + gvs.xw_conc * gvs.MW_water);

  // Calculate the heat capacity of the concentrate (J/kg)
  gvs.Cp_conc = Cp(gvs.t_evaporator, gvs.xs_conc);

  // Calculate the flow rates of each stream
  gvs.s_inlet = gvs.Q / gvs.Hvap_steam;
  gvs.evap_flowrate = ( gvs.Q - gvs.f_inlet * gvs.Cp_conc * (gvs.t_evaporator - gvs.t_inlet) ) / gvs.Hvap_conc;
  gvs.evap_flowrate = Math.max(0, gvs.evap_flowrate);
  gvs.evap_flowrate = Math.min(gvs.f_inlet - gvs.f_inlet * gvs.conc_inlet, gvs.evap_flowrate); // maximum amount to evaporate is all of the water
  gvs.conc_flowrate = gvs.f_inlet - gvs.evap_flowrate;

  // Calculate the weight percent of sugar in the concentrate
  gvs.conc_concentrate = (gvs.f_inlet * gvs.conc_inlet) / gvs.conc_flowrate;

  // Calculate the boiling point of the concentrate
  const Psat_conc = gvs.p_conc / gvs.xw_conc; // Raoult's law to calculate saturation pressure of the concentrate
  gvs.t_evaporator = Math.min(gvs.t_steam, T_boiling(Psat_conc));
  
  gvs.steam_economy = gvs.evap_flowrate / gvs.s_inlet;

  if(iterations < 100) {
    iterations++;
    iterate();
  }
}

module.exports = calcAll;