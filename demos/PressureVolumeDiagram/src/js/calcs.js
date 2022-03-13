require("./water_properties.js");


/*
Saturated Liquid/Vapor Properties - 
0.) T (deg.C)
1.) P (Mpa)
2.) Vliq (m3/kg)
3.) Vvap (m3/kg)
4.) Uliq (kJ/kg)
5.) Delta Uvap (kJ/kg)
6.) Uvap (kJ/kg)
7.) Hliq (kJ/kg)
8.) Delta Hvap (kJ/kg)
9.) Hvap (kJ/kg)
10.) Sliq (kJ/kg)
11.) Delta Svap (kJ/kg)
12.) Svap (kJ/kg)
*/

/*
Steam/compressed liquid properties -
0.) P (Mpa)
1.) T (deg.C)
2.) V (m3/kg)
3.) U (kJ/kg)
4.) H (kJ/kg)
5.) S (kJ/kg*K)
*/

// volume_compressed_liquid(P, T)
// Range of valid pressures: 0.01 Mpa - 100 MPa
// Range of valid temperatures: 273.15 K - 647.1 K

// volume_saturated_liquid(T)
// Range of valid pressures: 0.01 Mpa - 100 MPa
// Range of valid temperatures: 273.15 K - 647.1 K

// volume_superheated_steam(P, T_K)
// Range of valid pressures: 0.01 MPa - 60 MPa
// Range of valid temperatures: 318.95 K - 1573.15 K

// const T_target = 395 + 275;
// const T_374 = [];

// for(let P_log = Math.log(0.01); P_log < Math.log(60); P_log += (Math.log(60) - Math.log(0.01)) / 100) {

//   const P = Math.exp(P_log);
//   const T_sat = find_saturation_temperature(P);

//   if(T_target < T_sat) {
//     const V = volume_compressed_liquid(P, T_target);
//     T_374.push([V, P]);
//   } else {
//     const V = volume_superheated_steam(P, T_target);
//     T_374.push([V, P]);
//   }
// }

// console.log(T_374);