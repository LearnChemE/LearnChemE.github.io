// === Constants ===
export const R = 8.314;   // Ideal gas constant [kJ/(mol·K)]
export const deltaH = 178000;   // Enthalpy change of reaction [kJ/mol]
export const deltaG = -14350;   // Gibbs free energy at T_ref [kJ/mol]
export const T_ref = 1000;   // Reference temperature [K]
export const V = 10;         // Volume of container [L]

// ===  equilibrium constant using Van’t Hoff equation ===
export function computeKeq(T) {
  const K_ref = Math.exp(-deltaG / (R * T_ref));
  const Keq = K_ref * Math.exp(-(deltaH / R) * (1 / T - 1 / T_ref));
  console.log(`[computeKeq] T: ${T} → Keq: ${Keq.toFixed(4)}`);
  return Keq;
}

// === Solve for extent of reaction (zeta) with clamping ===
export function solveZeta(nCaCO3, nCaO, nCO2, Keq, T, volume = V) {
  const nCO2_eq = (Keq * volume) / (R * T);

  let zeta = nCO2_eq - nCO2;

  const zeta_min = -nCaO;
  const zeta_max = nCaCO3;

  zeta = Math.max(zeta_min, Math.min(zeta_max, zeta));
  return zeta;
}


// ===  final moles of each species at equilibrium ===
export function getFinalMoles(nCaCO3, nCaO, nCO2, zeta) {
  return {
    nCaCO3_final: Math.max(nCaCO3 - zeta, 0),
    nCaO_final: Math.max(nCaO + zeta, 0),
    nCO2_final: Math.max(nCO2 + zeta, 0)
  };
}

// ===  equilibrium pressure (bar), capped for visuals ===
export function computePressure(nCO2_final, T, volume = V) {
  return (nCO2_final * R * T) / volume;
}


// ===  function to compute equilibrium based on state ===
export function calculateEquilibrium(state) {
  const { T, caCO3, caO, cO2 } = state;

  const canReact = caCO3 > 0;

  if (!canReact) {
    return {
      pressure: computePressure(cO2, T),
      nCaCO3_final: caCO3,
      nCaO_final: caO,
      nCO2_final: cO2
    };
  }

  const Keq = computeKeq(T);
  const zeta = solveZeta(caCO3, caO, cO2, Keq, T);
  const { nCaCO3_final, nCaO_final, nCO2_final } = getFinalMoles(caCO3, caO, cO2, zeta);
  const pressure = computePressure(nCO2_final, T);

  return { pressure, nCaCO3_final, nCaO_final, nCO2_final };
}

// === Compatibility placeholder ===
export function calcAll() {
  // This function is a placeholder for compatibility with the original code.
}
