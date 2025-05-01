// This is for calculating the conversion of two reactants following the
// reaction equation A + B => C + D. It is happening in a CSTR reactor,
// which starts with an initial concentration of zero for A and B,
// and the reaction is first order in both A and B.

/**
 * @param {number} args.t - time in seconds
 * @param {number} args.T - temperature in Kelvin
 * @param {number} args.CAf - Concentration of A in the feed (mol/L)
 * @param {number} args.CBf - Concentration of B in the feed (mol/L)
 * @return {Object} - Final concentrations of A, B, C, D after time "time", and conversion coordinate X
 */
module.exports = function run_CSTR(args) {
  const t = args.t; // time in seconds
  const T = args.T; // temperature in Kelvin
  const CAf = args.CAf; // Concentration of A in the feed (mol/L)
  const CBf = args.CBf; // Concentration of B in the feed (mol/L)
  const vA = args.vA; // volumetric flow rate of A (L/s)
  const vB = args.vB; // volumetric flow rate of B (L/s)

  // CSTR initial concentrations
  const CA0 = 0;
  const CB0 = 0;
  const CC0 = 0;
  const CD0 = 0;

  // Feed concentration

  const V = 2; // volume of tank (L)

  // Rate constant is dependent on temperature
  const k = (T) => {
    const Ea = 33.40e3; // J/mol
    const R = 8.314; // J/(mol*K)
    const A = 5.8e5; // Pre-exponential factor (arbitrary units)
    return A * Math.exp(-Ea / (R * T));
  }

  const dCA_dt = (CA, CB, T) => {
    const nA_in = vA * CAf;

    const v_out = vA + vB; // total volumetric flow rate (L/s)

    const k_val = k(T);
    const r = -k_val * CA * CB;

    const d = (nA_in - CA * v_out + r * V) / V;
    return d;
  }

  const dCB_dt = (CA, CB, T) => {
    const nB_in = vB * CBf;

    const v_out = vA + vB; // total volumetric flow rate (L/s)

    const k_val = k(T);
    const r = -k_val * CA * CB;

    const d = (nB_in - CB * v_out + r * V) / V;
    return d;
  }

  const dCC_dt = (CA, CB, CC, T) => {
    const nC_in = 0;
    const v_out = vA + vB; // total volumetric flow rate (L/s)

    const k_val = k(T);
    const r = k_val * CA * CB;

    const d = (nC_in + r * V - CC * v_out) / V;
    return d;
  }

  const dCD_dt = (CA, CB, CD, T) => {
    const nD_in = 0;
    const v_out = vA + vB; // total volumetric flow rate (L/s)

    const k_val = k(T);
    const r = k_val * CA * CB;

    const d = (nD_in + r * V - CD * v_out) / V;
    return d;
  }

  const dt = 0.01;

  let CA = CA0;
  let CB = CB0;
  let CC = CC0;
  let CD = CD0;
  const time_steps = Math.ceil(t / dt);

  if (t < dt) {
    return { time: t, CA: CA, CB: CB, CC: CC, CD: CD, X: 0 };
  }

  const results = [];

  for (let i = 0; i <= time_steps; i++) {
    const time = i * dt;
    const X = CC / (vA * CAf / (vA + vB)); // Conversion of A
    results.push({ time: time, CA: CA, CB: CB, CC: CC, CD: CD, X: X });

    const dCA = dCA_dt(CA, CB, T) * dt;
    const dCB = dCB_dt(CA, CB, T) * dt;
    const dCC = dCC_dt(CA, CB, CC, T) * dt;
    const dCD = dCD_dt(CA, CB, CD, T) * dt;

    CA += dCA;
    CB += dCB;
    CC += dCC;
    CD += dCD;
  }

  return results[results.length - 1];
}