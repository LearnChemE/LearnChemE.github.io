/**
 * Equilibrium pressure (bar) for N2O4 ⇌ 2 NO2 at constant volume (V=0.50 L).
 * Uses the two-equation model:
 *   P = (n0 + X) R T / V
 *   Kp = [4 X^2 P] / [(n0 + X)(n0 - X)]
 * Eliminating P ⇒ (4RT/V) X^2 + Kp X - Kp n0 = 0
 *
 * You can tune Kp(T) via ln Kp = A - B/T (defaults below).
 *
 * @param {number} weight_g  mass of injected N2O4 in grams (1.6–2.0 g)
 * @param {number} tempC     temperature in °C (25–45 °C)
 * @param {object} [opts]
 * @param {number} [opts.A=26.14]  lnKp intercept  (edit to match your data)
 * @param {number} [opts.B=6820]   lnKp slope term (Kelvin in denominator)
 * @param {number} [opts.V=0.50]   reactor volume in L
 * @returns {number} Pressure in bar
 */
export function computePressureWithConstantVolume(weight_g, tempC) {
  const M_N2O4 = 92 ;         // g/mol
  const R = 0.08314;             // L·bar/(mol·K)
  const V = 0.50;      // L

  // Temperature & initial moles
  const T = tempC + 273.15;      // K
  const n0 = weight_g / M_N2O4;  // mol of N2O4 injected

  // ---- Equilibrium constant (editable form): ln Kp = A - B/T ----
  const A = 21.14;
  const B = 6874;
  const Kp = Math.exp(A - B / T);

  // ---- Solve quadratic in X: a X^2 + b X + c = 0 ----
  const a = (4 * R * T) / V;
  const b = Kp;
  const c = -Kp * n0;

  const disc = b * b - 4 * a * c;                // should be > 0
  if (disc < 0) throw new Error("No real solution for X (check A/B values).");

  // Physical root: X must be ≥ 0 and ≤ n0. The '+' root gives the positive X.
  const X = (-b + Math.sqrt(disc)) / (2 * a);

  // Guard against tiny numerical drift
  const Xphys = Math.max(0, Math.min(n0, X));

  // ---- Pressure from ideal gas law at equilibrium ----
  const n_total = n0 + Xphys;
  const P = (n_total * R * T) / V;

  // Optional: debug details
  // console.log({T, n0, Kp, a, b, c, X, Xphys, n_total, P});

  console.log(`P at ${tempC}°C, ${weight_g} g:`, P.toFixed(3), "bar");
  return P;
}

// Example:
// console.log("P at 25°C, 1.8 g:", computePressureWithConstantVolume(1.8, 25).toFixed(3), "bar");