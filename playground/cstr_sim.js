const run_CSTR = require("./cstr_calc");

/*
 * At t = 10 seconds and a temperature of 350 K, the following outputs
 * the concentrations of A, B, C, and D in the CSTR, where "A" is CH3COOCH3,
 * "B" is NaOH, "C" is CH3COONa, and "D" is CH3OH.
 */
const output = run_CSTR({
  t: 10, // time in seconds
  T: 350, // temperature in Kelvin
  CAf: 0.1, // Concentration of A (CH3COOCH3) in the feed (mol/L)
  CBf: 0.1, // Concentration of B (NaOH) in the feed (mol/L)
  vA: 0.03, // volumetric flow rate of A (CH3COOCH3) (L/s)
  vB: 0.05, // volumetric flow rate of B (NaOH) (L/s)
});

console.log(output);

/* output => 
  {
    time: 10,
    CA: 0.008763373005670856,
    CB: 0.01700671279883049,
    CC: 0.003601636684068561,
    CD: 0.003601636684068561,
    X: 0.09604364490849496
  }
*/