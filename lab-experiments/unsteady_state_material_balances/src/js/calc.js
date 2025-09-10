// === Physical constants (at ~20–25 °C) ===
const MW = { // g/mol
  pentane: 72.151,
  hexane: 86.178,
};

const rho = { // g/cm^3 (liquid)
  pentane: 0.626, // ~20 °C
  hexane: 0.659,  // ~25 °C
};

const P_TOTAL_BAR = 1.0;

// (Kept) Representative saturation pressures for quick checks or if useAntoine=false
const PSAT_BAR = {
  15: { pentane: 0.33, hexane: 0.12 },
  20: { pentane: 0.42, hexane: 0.16 },
  25: { pentane: 0.57, hexane: 0.20 },
};

// === NEW: Antoine coefficients from NIST (log10(P[bar]) = A - B/(T[K] + C)) ===
const ANTOINE = {
  pentane: [
    // Valid 268.8–341.37 K  (≈ -4.35 to 68.2 °C)
    { A: 3.9892,  B: 1070.617, C: -40.454, TminK: 268.8,  TmaxK: 341.37 },
  ],
  hexane: [
    // Choose the range that covers room temperature
    { A: 4.00266, B: 1171.53,  C: -48.784, TminK: 286.18, TmaxK: 342.69 },
    // Low-T range (not used for 15–25 °C but kept for robustness)
    { A: 3.45604, B: 1044.038, C: -53.893, TminK: 177.70, TmaxK: 264.93 },
  ],
};

/** Convert N2 flow from sccm to mol/min (approx, 25 °C). */
function sccmToMolPerMin(sccm) {
  const CM3_PER_MOL = 24465; // cm^3/mol at ~25 °C, 1 bar
  return sccm / CM3_PER_MOL;
}

/**
 * NEW: P_sat (bar) via Antoine (NIST). T_C in °C.
 * Falls back to nearest valid set if T is slightly outside all ranges.
 */
function psatBarFromAntoine(species, T_C) {
  const sets = ANTOINE[species];
  if (!sets) throw new Error(`Unknown species for Antoine: ${species}`);
  const T_K = T_C + 273.15;

  // Prefer a set whose range contains T_K
  let chosen = sets.find(s => T_K >= s.TminK && T_K <= s.TmaxK);
  if (!chosen) {
    // Fallback: pick the set with the smallest distance to its valid range
    chosen = sets.reduce((best, s) => {
      const dist = T_K < s.TminK ? (s.TminK - T_K) : (T_K > s.TmaxK ? (T_K - s.TmaxK) : 0);
      return (!best || dist < best.dist) ? { set: s, dist } : best;
    }, null).set;
  }
  const { A, B, C } = chosen;
  const log10P = A - (B / (T_K + C));
  return Math.pow(10, log10P);
}

/** NEW: get {pentane, hexane} psat (bar) from either Antoine or the fixed table */
function getPsatBar(T_C, useAntoine) {
  if (useAntoine) {
    return {
      pentane: psatBarFromAntoine('pentane', T_C),
      hexane:  psatBarFromAntoine('hexane',  T_C),
    };
  }
  if (!(T_C in PSAT_BAR)) {
    throw new Error(`T_C must be one of ${Object.keys(PSAT_BAR).join(', ')} °C when useAntoine=false. Received: ${T_C}`);
  }
  return PSAT_BAR[T_C];
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
 * (Updated signature) Single Euler step for the mole balances.
 * Pass in psat (bar) object {pentane, hexane} to avoid recomputing every step.
 * dN_i/dt = -F_i,out, where F_i = FN2 * (x_i * P_i^sat) / P_N2
 */
function stepMoles({ Npent, Nhex }, dt_min, ps, FN2_mol_min) {
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
 * @param {number} opts.T_C                  Temperature in °C (e.g., 15, 20, 25). With useAntoine=true you may use other T within Antoine ranges.
 * @param {number} [opts.V0_cm3=61.5]        Initial total liquid volume (cm^3)
 * @param {number} [opts.FN2_sccm=35]        N2 flow (standard cm^3/min)
 * @param {boolean}[opts.useWorksheetFN2=false] Use 0.0156 mol/min as in worksheet
 * @param {boolean}[opts.useAntoine=true]    If true, compute P_sat(T) from Antoine; else use PSAT_BAR table
 * @param {boolean}[opts.stopAt20pct=true]   Stop once V ≤ 20% of initial
 * @param {number} [opts.dt_s=0.5]           Integrator time step (seconds)
 * @param {number} [opts.tMax_min=240]       Hard cap on runtime (minutes)
 * @returns {{t_min:number[], V_cm3:number[], states: {Npent:number, Nhex:number}[]}}
 */
export function computeVolumeVsTime(opts) {
  const {
    T_C,
    V0_cm3 = 61.5,
    FN2_sccm = 35,
    useWorksheetFN2 = false,
    useAntoine = true,
    stopAt20pct = true,
    dt_s = 0.5,
    tMax_min = 240,
  } = opts || {};

  // Precompute P_sat at this temperature (bar)
  const ps = getPsatBar(T_C, useAntoine);

  // Convert flow to mol/min
  const FN2_mol_min = useWorksheetFN2 ? 0.0156 : sccmToMolPerMin(FN2_sccm);

  // Initial moles from total volume and equimolar assumption
  let state = initialMolesFromVolumeEquimolar(V0_cm3);
  const V0 = volumeFromMoles(state); // recomputed initial volume (≈ input)
  const Vstop = stopAt20pct ? 0.2 * V0 : 0;

  const dt_min = dt_s / 60;
  const t_min = [0];
  const V_cm3 = [V0];
  const states = [ { ...state } ];

  let t = 0;
  while (t < tMax_min) {
    // advance one step
    const next = stepMoles(state, dt_min, ps, FN2_mol_min);
    t += dt_min;

    // compute new volume
    const V = volumeFromMoles(next);

    t_min.push(t);
    V_cm3.push(V);
    states.push({ ...next });

    state = next;

    if ((stopAt20pct && V <= Vstop) || (next.Npent + next.Nhex) <= 1e-10) break;
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
