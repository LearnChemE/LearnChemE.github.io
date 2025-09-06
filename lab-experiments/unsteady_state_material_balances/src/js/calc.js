/**
 * Unsteady-state liquid volume vs time for a bubbler with an equimolar
 * n-pentane / n-hexane liquid and N2 carrier gas.
 *
 * Model assumptions (from worksheet):
 * - Vapor–liquid equilibrium; ideal solution; Raoult's law.
 * - Total pressure ~ 1.0 bar; three operating temperatures: 15, 20, 25 °C.
 * - N2 enters at a fixed standard volumetric flow (sccm) and does not accumulate.
 * - Initial liquid is 50/50 molar (n-pentane / n-hexane).
 * - Stop when liquid volume falls to 20% of the initial value (VLE breaks down below this).
 *
 * Notes:
 * - The worksheet states 35 sccm N2; it also shows a conversion to 0.0156 mol/min.
 *   If you want to reproduce the worksheet numerically, set `useWorksheetFN2` to true to use 0.0156 mol/min.
 *   Otherwise we convert sccm → mol/min using 24,465 cm^3/mol (approx at 25 °C): mol/min = sccm / 24465.
 *
 * Returns arrays of time (minutes) and total liquid volume (cm^3).
 */

// === Physical constants (at ~20–25 °C) ===
const MW = { // g/mol
  pentane: 72.151,
  hexane: 86.178,
};

const rho = { // g/cm^3 (liquid)
  // Representative values near room temperature
  pentane: 0.626, // ~20 °C
  hexane: 0.659,  // ~25 °C
};

const P_TOTAL_BAR = 1.0;

// Saturation pressures (bar) for the three allowed temperatures.
// Representative values consistent with engineering handbooks.
// If needed, you can swap this table for an Antoine calculator later.
const PSAT_BAR = {
  15: { pentane: 0.33, hexane: 0.12 },
  20: { pentane: 0.42, hexane: 0.16 },
  25: { pentane: 0.57, hexane: 0.20 },
};

/** Convert N2 flow from sccm to mol/min (approx, 25 °C). */
function sccmToMolPerMin(sccm) {
  const CM3_PER_MOL = 24465; // cm^3/mol at ~25 °C, 1 bar
  return sccm / CM3_PER_MOL;
}

/**
 * Compute initial moles for an equimolar (x=0.5/0.5) mixture given total volume (cm^3).
 * Uses ideal mixing with component densities to back-calc moles.
 */
function initialMolesFromVolumeEquimolar(V0_cm3) {
  const vPerMolPent = MW.pentane / rho.pentane; // cm^3/mol
  const vPerMolHex  = MW.hexane  / rho.hexane;  // cm^3/mol
  const vBar = 0.5 * (vPerMolPent + vPerMolHex); // cm^3/mol of total mixture for x=0.5
  const Ntot0 = V0_cm3 / vBar; // total moles initially
  return { Npent: 0.5 * Ntot0, Nhex: 0.5 * Ntot0 };
}

/**
 * Single Euler step for the mole balances.
 * dN_i/dt = -F_i,out, where F_i = FN2 * (x_i * P_i^sat) / P_N2
 */
function stepMoles({ Npent, Nhex }, dt_min, T_C, FN2_mol_min) {
  const ps = PSAT_BAR[T_C];
  const Ntot = Math.max(Npent + Nhex, 1e-12);
  const xPent = Npent / Ntot;
  const xHex  = 1 - xPent;

  const PN2 = P_TOTAL_BAR - (xPent * ps.pentane + xHex * ps.hexane);
  if (PN2 <= 1e-9) {
    // VLE model breaks if PN2→0; freeze composition.
    return { Npent, Nhex };
  }

  const F_pent = FN2_mol_min * (xPent * ps.pentane) / PN2; // mol/min out
  const F_hex  = FN2_mol_min * (xHex  * ps.hexane)  / PN2; // mol/min out

  const Npent_new = Math.max(0, Npent - F_pent * dt_min);
  const Nhex_new  = Math.max(0, Nhex  - F_hex  * dt_min);
  return { Npent: Npent_new, Nhex: Nhex_new };
}

/** Compute total liquid volume (cm^3) from component moles. */
function volumeFromMoles({ Npent, Nhex }) {
  const Vpent = (Npent * MW.pentane) / rho.pentane; // cm^3
  const Vhex  = (Nhex  * MW.hexane)  / rho.hexane;  // cm^3
  return Vpent + Vhex;
}

/**
 * Compute volume–time curve until volume reaches 20% of initial (or tMax).
 *
 * @param {Object} opts
 * @param {number} opts.T_C          Temperature in °C (allowed: 15, 20, 25)
 * @param {number} [opts.V0_cm3=61.5] Initial total liquid volume (cm^3)
 * @param {number} [opts.FN2_sccm=35]  N2 flow (standard cm^3/min)
 * @param {boolean}[opts.useWorksheetFN2=false] Use 0.0156 mol/min as in worksheet
 * @param {number} [opts.dt_s=0.5]     Integrator time step (seconds)
 * @param {number} [opts.tMax_min=240] Hard cap on runtime (minutes)
 * @returns {{t_min:number[], V_cm3:number[], states: {Npent:number, Nhex:number}[]}}
 */
export function computeVolumeVsTime(opts) {
  const {
    T_C,
    V0_cm3 = 61.5,
    FN2_sccm = 35,
    useWorksheetFN2 = false,
    dt_s = 0.5,
    tMax_min = 240,
  } = opts || {};

  if (!(T_C in PSAT_BAR)) {
    throw new Error(`T_C must be one of 15, 20, 25 °C. Received: ${T_C}`);
  }

  // Convert flow to mol/min
  const FN2_mol_min = useWorksheetFN2 ? 0.0156 : sccmToMolPerMin(FN2_sccm);

  // Initial moles from total volume and equimolar assumption
  let state = initialMolesFromVolumeEquimolar(V0_cm3);
  const V0 = volumeFromMoles(state); // recomputed initial volume (≈ input)
  const Vstop = 0.2 * V0;

  const dt_min = dt_s / 60;
  const t_min = [0];
  const V_cm3 = [V0];
  const states = [ { ...state } ];

  let t = 0;
  while (t < tMax_min) {
    // advance one step
    const next = stepMoles(state, dt_min, T_C, FN2_mol_min);
    t += dt_min;

    // compute new volume
    const V = volumeFromMoles(next);

    t_min.push(t);
    V_cm3.push(V);
    states.push({ ...next });

    state = next;

    if (V <= Vstop || (next.Npent + next.Nhex) <= 1e-10) break;
  }

  return { t_min, V_cm3, states };
}

/**
 * Convenience: get total liquid volume at a specific time (minutes),
 * using the same integrator.
 */
export function volumeAtTime(T_C, t_query_min, opts = {}) {
  const res = computeVolumeVsTime({ T_C, ...opts, tMax_min: t_query_min + 1 });
  const { t_min, V_cm3 } = res;
  // find the last index not exceeding t_query_min
  let idx = t_min.length - 1;
  for (let i = 0; i < t_min.length; i++) {
    if (t_min[i] > t_query_min) { idx = Math.max(0, i - 1); break; }
  }
  return V_cm3[idx];
}

// Optional: attach to window for quick manual testing in the browser console
// if (typeof window !== 'undefined') {
//   window.computeVolumeVsTime = computeVolumeVsTime;
//   window.volumeAtTime = volumeAtTime;
// }

/**
 * Example usage in your UI code:
 *
 * const { t_min, V_cm3 } = computeVolumeVsTime({ T_C: 25, V0_cm3: 61.5, FN2_sccm: 35 });
 * // then animate the liquid height using V_cm3 as a function of t_min.
 */
