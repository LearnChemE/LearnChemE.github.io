const run_CSTR = require("./cstr_calc");

/*
 * At t = 10 seconds and a temperature of 350 K, the following outputs
 * the concentrations of A, B, C, and D in the CSTR, where "A" is CH3COOCH3,
 * "B" is NaOH, "C" is CH3COONa, and "D" is CH3OH.
 */
const output = run_CSTR({
  t: 10, // time in seconds
  T: 350, // temperature in Kelvin
  CAf: 0.067, // Concentration of A (CH3COOCH3) in the feed (mol/L)
  CBf: 0.067 // Concentration of B (NaOH) in the feed (mol/L)
});

console.log(output);

/* output => 
  {
    time: 10,
    CA: 0.016964123206283706, // (Concentration of CH3COOCH3 [mol/L])
    CB: 0.016964123206283706, // (Concentration of NaOH [mol/L])
    CC: 0.007198940444495265, // (Concentration of CH3COONa [mol/L])
    CD: 0.007198940444495265, // (Concentration of CH3OH [mol/L])
    X: 0.1439788088899053 // (Conversion coordinate X)
  }
*/