// Molar mass of SiO₂ [g/mol]
const M_SIO2 = 60.08;
const TEOSFraction = 0.0005; // Molar mass of TEOS [g/mol]
const gasFlowRate = 1; // Total gas flow [mol/s]
const conversion = 0.65; // Fraction of TEOS converted per pass

/**
 * Compute SiO₂ deposition rate without recycle.
 *
 * @param {number} gasFlowRate   Total gas flow [mol/s]
 * @param {number} TEOSFraction  Mole fraction of TEOS in feed
 * @param {number} conversion    Fraction of TEOS converted per pass
 * @returns {number}             Mass of SiO₂ deposited [g/s]
 */
export function massSiO2WithoutRecycle(gasFlowRate, TEOSFraction, conversion) {
  // 1. Molar flow of TEOS entering reactor [mol/s]
  const TEOSFlow = gasFlowRate * TEOSFraction;

  // 2. Moles of TEOS reacted per second [mol/s]
  const reactedTEOS = TEOSFlow * conversion;

  // 3. Mass of SiO₂ formed per second [g/s]
  return reactedTEOS * M_SIO2;
}

// Example:
console.log(
  massSiO2WithoutRecycle(1, 0.0005, 0.65).toFixed(5),
  'g/s'  // ≈ 0.01953 g/s
);

export function massSiO2WithRecycle(gasFlowRate, TEOSFraction, conversion, recycleRatio) {
  // 1. Fresh TEOS molar flow [mol/s]
  const freshTEOS = gasFlowRate * TEOSFraction;

  // 2. Total TEOS molar flow into reactor [mol/s]
  const TEOSIn = freshTEOS / (recycleRatio * conversion + 1);

  // 3. Moles reacted per second [mol/s]
  const reactedTEOS = TEOSIn * conversion;

  // 4. Mass SiO₂ formed [g/s]
  return reactedTEOS * M_SIO2;
}

// Example for R = 1.0:
console.log(
  massSiO2WithRecycle(1, TEOSFraction, conversion, gasFlowRate).toFixed(5),
  'g/s'
);