/* Antoine constants (benzene / toluene) */
export const ANTOINE_BENZENE = { A: 6.87987, B: 1196.76, C: 219.161 };
export const ANTOINE_TOLUENE = { A: 6.95087, B: 1342.31, C: 219.187 };

/* ––––– Helpers ––––– */

/** mm Hg → bar */
const MMHG_TO_BAR = 0.00133322368;

/** Antoine vapour pressure (temp °C → bar) */
export function Psat(tempC, { A, B, C }) {
  const log10P = A - B / (tempC + C);        // log10(mm Hg)
  return MMHG_TO_BAR * 10 ** log10P;         // bar
}

/** Bubble- & dew-pressure at liquid mole fraction x (Raoult) */
function Px(x, T) {                                // bubble
  return x * Psat(T, ANTOINE_BENZENE) +
        (1 - x) * Psat(T, ANTOINE_TOLUENE);
}
function Py(x, T) {                                // dew
  const PB = Psat(T, ANTOINE_BENZENE);
  const PT = Psat(T, ANTOINE_TOLUENE);
  return 1 / (x / PB + (1 - x) / PT);
}

/** Equilibrium compositions on a tie-line at given P (analytic) */
export function computeEquilibriumCompositions(P, PB, PT) {
  // liquid (x_B)
  const xL = (PT - P) / (PT - PB);
  // vapour (y_B)
  const yV = (1 / P - 1 / PT) / (1 / PB - 1 / PT);
  return { xL, yV };
}

/** Vapour & liquid fractions from overall z */
function leverRule(z, xL, yV) {
  const V = (z - xL) / (yV - xL);   // vapour fraction
  const L = 1 - V;                  // liquid fraction
  return { V, L };
}

/* ––––– Core calcs ––––– */

function calculatePxy(x, tempC) {
  return { Px: Px(x, tempC), Py: Py(x, tempC) };
}

/** Fugacity for ONE point (overall z, P, T) */
function fugacityPoint(z, P, tempC) {
  const PB = Psat(tempC, ANTOINE_BENZENE);
  const PT = Psat(tempC, ANTOINE_TOLUENE);
  const { Px: Px_z, Py: Py_z } = calculatePxy(z, tempC);

  let fB, fT;

  if (P < Py_z) {                                       // single-phase vapour
    fB = z * P;
    fT = (1 - z) * P;
  } else if (P > Px_z) {                                // single-phase liquid
    fB = z * PB;
    fT = (1 - z) * PT;
  } else {                                              // two-phase
    const { xL, yV } = computeEquilibriumCompositions(P, PB, PT);
    const { V, L } = leverRule(z, xL, yV);

    fB = V * yV * P + L * xL * PB;                      // Benzene
    fT = V * (1 - yV) * P + L * (1 - xL) * PT;          // Toluene
  }
  return { fB, fT };
}

/** Full p-sweep for plotting fugacity curves at fixed z & T */
function fugacityCurves(z, tempC, n = 100) {
  const data = [];
  for (let i = 0; i <= n; i++) {
    const P = 0.1 + (0.4 * i) / n;                     // 0.1 → 0.5 bar
    const { fB, fT } = fugacityPoint(z, P, tempC);
    data.push({ p: P, fBen: fB, fTol: fT });
  }
  return data;
}

/** P-x-y data at fixed T */
function generatePxyData(tempC, n = 100) {
  const arr = [];
  for (let i = 0; i <= n; i++) {
    const x = i / n;
    const { Px: Px_i, Py: Py_i } = calculatePxy(x, tempC);
    arr.push({ x, Px: Px_i, Py: Py_i });
  }
  return arr;
}

/* ––––– Application glue ––––– */

function readSliders() {
  const z   = 0.05 + 0.9  * window.state.sliderValue;     // 0.05-0.95
  const P   = 0.1  + 0.4  * window.state.slider2Value;    // 0.1-0.5 bar
  const T   = 40   + 19   * window.state.slider3Value;    // 40-59 °C
  return { z, P, T };
}

export function calcAll() {
  const { z, P, T } = readSliders();
  const { Px: Px_z, Py: Py_z } = calculatePxy(z, T);

  /* current-state fugacity */
  const { fB, fT } = fugacityPoint(z, P, T);

  /* datasets for charts */
  window.pxyData            = generatePxyData(T);
  window.fugacityCurvesData = fugacityCurves(z, T);
  window.currentState       = {
    moleFraction: z,
    pressure: P,
    temperature: T,
    Px: Px_z,
    Py: Py_z,
    fB,
    fT,
    isInTwoPhase: P >= Py_z && P <= Px_z,
  };
}