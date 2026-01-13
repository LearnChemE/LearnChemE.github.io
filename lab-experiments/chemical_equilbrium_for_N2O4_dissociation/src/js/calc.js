const M_N2O4 = 92;       // g/mol
const R_BAR = 0.08314;   // L·bar/(mol·K)
const DEFAULT_VOLUME_L = 0.5;  // L (constant-volume reactor)
const DEFAULT_PRESSURE_BAR = 1.3; // bar (constant-pressure reactor)
const DEFAULT_LN_KP_A = 21.14;
const DEFAULT_LN_KP_B = 6874;

const clamp = (value, lo, hi) => Math.max(lo, Math.min(hi, value));
const toKelvin = (tempC) => tempC + 273.15;

export function molesInjected(weight_g) {
  return weight_g / M_N2O4;
}

export function equilibriumConstantKp(tempC, opts = {}) {
  const { A = DEFAULT_LN_KP_A, B = DEFAULT_LN_KP_B } = opts;
  const T = toKelvin(tempC);
  return Math.exp(A - B / T);
}

function solveConstantVolume(weight_g, tempC, opts = {}) {
  const { V = DEFAULT_VOLUME_L, A = DEFAULT_LN_KP_A, B = DEFAULT_LN_KP_B } = opts;

  const T = toKelvin(tempC);
  const n0 = molesInjected(weight_g);
  const Kp = equilibriumConstantKp(tempC, { A, B });

  const a = (4 * R_BAR * T) / V;
  const b = Kp;
  const c = -Kp * n0;

  const disc = b * b - 4 * a * c;
  if (disc < 0) throw new Error('No real solution for X at constant volume (check parameters).');

  const Xraw = (-b + Math.sqrt(disc)) / (2 * a);
  const X = clamp(Xraw, 0, n0);

  const nTotal = n0 + X;
  const pressureBar = (nTotal * R_BAR * T) / V;

  const nN2O4 = n0 - X;
  const nNO2 = 2 * X;
  const yN2O4 = nN2O4 / nTotal;
  const yNO2 = nNO2 / nTotal;

  return {
    injection: { mass_g: weight_g, moles: n0 },
    temperatureK: T,
    pressureBar,
    volumeL: V,
    extentMol: X,
    totalMoles: nTotal,
    moles: { N2O4: nN2O4, NO2: nNO2 },
    moleFractions: { N2O4: yN2O4, NO2: yNO2 },
    partialPressures: { N2O4: yN2O4 * pressureBar, NO2: yNO2 * pressureBar },
    Kp,
    params: { A, B, V }
  };
}

function solveConstantPressure(weight_g, tempC, opts = {}) {
  // console.trace("Calculations")
  const {
    P = DEFAULT_PRESSURE_BAR,
    A = DEFAULT_LN_KP_A,
    B = DEFAULT_LN_KP_B
  } = opts;

  const T = toKelvin(tempC);
  const n0 = molesInjected(weight_g);
  const Kp = equilibriumConstantKp(tempC, { A, B });

  const denominator = Kp + 4 * P;
  if (denominator <= 0) throw new Error('Non-physical denominator when solving for extent at constant pressure.');

  const X = clamp(n0 * Math.sqrt((Kp) / denominator), 0, n0);
  const nTotal = n0 + X;
  const volumeL = (nTotal * R_BAR * T) / P;

  const nN2O4 = n0 - X;
  const nNO2 = 2 * X;
  const yN2O4 = nN2O4 / nTotal;
  const yNO2 = nNO2 / nTotal;

  return {
    injection: { mass_g: weight_g, moles: n0 },
    temperatureK: T,
    pressureBar: P,
    volumeL,
    extentMol: X,
    totalMoles: nTotal,
    moles: { N2O4: nN2O4, NO2: nNO2 },
    moleFractions: { N2O4: yN2O4, NO2: yNO2 },
    partialPressures: { N2O4: yN2O4 * P, NO2: yNO2 * P },
    Kp,
    params: { A, B, P }
  };
}

/**
 * Equilibrium pressure (bar) for the constant-volume experiment.
 */
export function computePressureWithConstantVolume(weight_g, tempC, opts = {}) {
  return solveConstantVolume(weight_g, tempC, opts).pressureBar;
}

/**
 * Convenience wrapper returning the full equilibrium state at constant volume.
 */
export function computeConstantVolumeEquilibrium(weight_g, tempC, opts = {}) {
  return solveConstantVolume(weight_g, tempC, opts);
}

/**
 * Equilibrium volume (L) for the constant-pressure experiment.
 */
export function computeVolumeWithConstantPressure(weight_g, tempC, opts = {}) {
  return solveConstantPressure(weight_g, tempC, opts).volumeL;
}

/**
 * Convenience wrapper returning the full equilibrium state at constant pressure.
 */
export function computeConstantPressureEquilibrium(weight_g, tempC, opts = {}) {
  return solveConstantPressure(weight_g, tempC, opts);
}

// Example usage:
// const cp = computeConstantPressureEquilibrium(1.8, 30);
// console.log(`Volume @30°C: ${cp.volumeL.toFixed(3)} L, extent: ${cp.extentMol.toFixed(4)} mol`);
// const cv = computeConstantVolumeEquilibrium(1.8, 30);
// console.log(`Pressure @30°C: ${cv.pressureBar.toFixed(3)} bar, extent: ${cv.extentMol.toFixed(4)} mol`);
