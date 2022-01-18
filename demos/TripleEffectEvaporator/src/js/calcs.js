function Hvap(T_K) {
  // Equation for heat of vaporization of saturated water
  // Source: https://mychemengmusings.wordpress.com/2019/01/08/handy-equations-to-calculate-heat-of-evaporation-and-condensation-of-water-steam/
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

function T_boiling(P) {
  // Calculates boiling temperature (K) from pressure (MPa)
  // Source: https://webbook.nist.gov/cgi/cbook.cgi?ID=C7732185&Mask=4#Thermo-Phase
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

function H_liquid(T_K) {
  const t = T_K / 1000;
  const A = -203.6060;
  const B = 1523.6060;
  const C = -3196.413;
  const D = 2474.455;
  const E = 3.855326;
  const F = -256.5478;
  const G = -488.7163;
  const H = -285.8304;
  const h = A*t + B*t**2/2 + C*t**3/3 + D*t**4/4 - E/t + F;
  return h * 1000;
}

function H_vapor(T_K) {
  const t = T_K / 1000;
  const A = 30.092;
  const B = 6.832514;
  const C = 6.793435;
  const D = -2.534480;
  const E = 0.082139;
  const F = -250.8810;
  const G = 223.3967;
  const H = -241.8264;
  const h = A*t + B*t**2/2 + C*t**3/3 + D*t**4/4 - E/t + F;
  return h * 1000;
}

let iterations = 0;

function calcAll() {
  // Find temperature of each evaporator
  gvs.T1 = T_boiling(gvs.P1);
  gvs.T2 = T_boiling(gvs.P2);
  gvs.T3 = T_boiling(gvs.P3);

  const H_HX1 = gvs.hx_U * gvs.hx_A * (gvs.t_steam - gvs.T1);
  gvs.s_inlet = H_HX1 / Hvap(gvs.t_steam);

  gvs.Q1 = gvs.s_inlet * Hvap(gvs.t_steam);
  const Hvap1 = Hvap(gvs.T1);
  const Hsensible1 = gvs.f_inlet * (gvs.T1 - gvs.t_inlet) * Cp(gvs.t_inlet, gvs.xs_inlet);
  gvs.V1 = Math.max((gvs.Q1 - Hsensible1) / Hvap1, 0);
  gvs.L1 = gvs.f_inlet - gvs.V1;

  // Find heat transfer of second evaporator
  gvs.Q2 = Math.min(Hvap1 * gvs.V1, gvs.hx_U * gvs.hx_A * (gvs.T1 - gvs.T2));
  const HX_liq2 = gvs.Q2 / Hvap1;
  gvs.q_cond_2 = HX_liq2 / gvs.V1;

  const H_liq1 = H_liquid(gvs.T1);
  let delta1 = 10000000;
  let q1 = 0.00;
  const H_liq2 = H_liquid(gvs.T2);
  const H_vap2 = H_vapor(gvs.T2);
  // Find quality of steam entering second evaporator
  for(var q = 0.000; q < 1.000; q += 0.001) {
    let delta = Math.abs( ( q * H_liq2 + (1 - q) * H_vap2 ) - H_liq1);
    if(delta < delta1) {delta1 = delta; q1 = q}
  }

  gvs.q1 = q1;
  const V1_in = (1 - q1) * gvs.L1; // vapor flowrate immediately after first valve
  const evap_2 = Math.min(gvs.Q2 / Hvap(gvs.T2), gvs.V1);
  gvs.V2 = Math.min(evap_2 + V1_in, gvs.L1);
  gvs.L2 = gvs.L1 - gvs.V2;
  const Hvap2 = Hvap(gvs.T2);

  // Find heat transfer of second evaporator
  gvs.Q3 = Math.min( gvs.V2 * Hvap2, gvs.hx_U * gvs.hx_A * (gvs.T2 - gvs.T3) );
  const HX_liq3 = gvs.Q3 / Hvap2;
  gvs.q_cond_3 = HX_liq3 / gvs.V2;

  let delta2 = 100000000;
  let q2 = 0.00;
  const H_liq3 = H_liquid(gvs.T3);
  const H_vap3 = H_vapor(gvs.T3);

  for(var q = 0.000; q < 1.000; q += 0.001) {
    let delta = Math.abs( ( q * H_liq3 + (1 - q) * H_vap3 ) - H_liq2);
    if(delta < delta2) {delta2 = delta; q2 = q}
  }

  gvs.q2 = q2;
  const V2_in = (1 - q2) * gvs.L2; // vapor flowrate immediately after first valve
  const evap_3 = Math.min(gvs.Q3 / Hvap(gvs.T3), gvs.V2);
  gvs.V3 = Math.min(evap_3 + V2_in, gvs.L2);
  gvs.L3 = gvs.L2 - gvs.V3;

  gvs.conc_outlet = (gvs.conc_inlet * gvs.f_inlet) / gvs.L3;

  gvs.steam_economy = (gvs.f_inlet - gvs.L3) / gvs.s_inlet;
}

module.exports = calcAll;