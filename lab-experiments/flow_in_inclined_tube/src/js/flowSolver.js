/**
 * Compute the required pressure P (Pa) to sustain a given flow rate down a tilted
 * pipe under gravity.
 *
 *   Q = (P + ρ g ℓ1 sin θ) · (π d⁴) / [128 μ (ℓ1 + ℓ2)]
 *
 * ⇒ P = Q·128μ(ℓ1+ℓ2)/(π d⁴) − ρ g ℓ1 sin θ
 *
 * @param {number} flowRate_ml_s  – flow rate in milliliters per second
 * @param {number} angle_deg      – pipe inclination angle in degrees (θ)
 * @returns {number}  Pressure in Pascals
 */
export function computePressure(flowRate_ml_s, angle_deg) {
  // constants
  const rho = 1260;      // kg/m³
  const mu  = 0.934;     // Pa·s
  const l1  = 0.30;      // m (30 cm)
  const l2  = 0.30;      // m (30 cm)
  const d   = 0.025;     // m (2.5 cm)
  const g   = 9.8;       // m/s²

  // conversions & geometry
  const Q = flowRate_ml_s / 1e6;              // m³/s
  const θ = angle_deg * Math.PI / 180;        // radians

  // invert formula
  const num = Q * 128 * mu * (l1 + l2);
  const den = Math.PI * Math.pow(d, 4);
  const P   = num/den - rho * g * l1 * Math.sin(θ);

  // Convert pressure to kilopascals and round to two decimal places
  // return P
  // console.log(`Computed pressure: ${parseFloat((P / 1000)).toFixed(2)} Pa`);
  return parseFloat((P / 1000));  // in kPa, two decimals
}