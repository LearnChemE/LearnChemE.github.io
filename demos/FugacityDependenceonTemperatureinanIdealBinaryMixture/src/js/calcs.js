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

/* ––––– T-x-y Functions ––––– */

/** Bubble point temperature Tx(x) - from Mathematica code */
export function Tx(x) {
  return 13.14055 * x * x - 43.6023 * x + 110.7101;
}

/** Dew point temperature Ty(x) - from Mathematica code */
function Ty(x) {
  return -14.5068 * x * x - 15.7199 * x + 110.6248;
}

/** Check if temperature is in VLE region */
function isVLE(T, z) {
  return Tx(z) <= T && T <= Ty(z);
}

/** Liquid composition xB at given temperature T and overall composition z */
function xB(T, z) {
  if (isVLE(T, z)) {
    // Solve Tx(x) == T for x
    // Tx(x) = 13.14055*x^2 - 43.6023*x + 110.7101 = T
    // 13.14055*x^2 - 43.6023*x + (110.7101 - T) = 0
    const a = 13.14055;
    const b = -43.6023;
    const c = 110.7101 - T;
    const discriminant = b * b - 4 * a * c;
    if (discriminant >= 0) {
      const x1 = (-b - Math.sqrt(discriminant)) / (2 * a);
      const x2 = (-b + Math.sqrt(discriminant)) / (2 * a);
      // Return the first root (like Mathematica's Solve[[1]])
      if (x1 >= 0 && x1 <= 1) return x1;
      if (x2 >= 0 && x2 <= 1) return x2;
    }
    return z; // fallback
  } else if (Tx(z) > T) {
    return z; // liquid phase
  } else {
    return 0; // vapor phase
  }
}

/** Vapor composition yB at given temperature T and overall composition z */
function yB(T, z) {
  if (isVLE(T, z)) {
    // Solve Ty(x) == T for x
    // Ty(x) = -14.5068*x^2 - 15.7199*x + 110.6248 = T
    // -14.5068*x^2 - 15.7199*x + (110.6248 - T) = 0
    const a = -14.5068;
    const b = -15.7199;
    const c = 110.6248 - T;
    const discriminant = b * b - 4 * a * c;
    if (discriminant >= 0) {
      const x1 = (-b - Math.sqrt(discriminant)) / (2 * a);
      const x2 = (-b + Math.sqrt(discriminant)) / (2 * a);
      // Return the last root (like Mathematica's Solve[[-1]])
      if (x2 >= 0 && x2 <= 1) return x2;
      if (x1 >= 0 && x1 <= 1) return x1;
    }
    return z; // fallback
  } else if (Tx(z) > T) {
    return 0; // liquid phase
  } else {
    return z; // vapor phase
  }
}

/* ––––– Application glue ––––– */

function readSliders() {
  const z   = 0.00 + 1.00 * window.state.sliderValue;     // 0.00-1.00
  const P   = 1.0;                                        // Fixed pressure at 1.0 bar
  const T   = 75   + 40   * window.state.slider3Value;    // 75-115 °C
  return { z, P, T };
}

/** Generate T-x-y data for plotting */
function generateTxyData(n = 100) {
  const arr = [];
  for (let i = 0; i <= n; i++) {
    const x = i / n;
    const tx = Tx(x);
    const ty = Ty(x);
    arr.push({ x, Tx: tx, Ty: ty });
  }
  return arr;
}

/** Generate fugacity curves data for Plot 2 - exactly like Mathematica */
function generateFugacityCurvesData() {
  const z = window.state.sliderValue;
  const data = [];
  
  // Use dense sampling like the pressure simulation (100+ points)
  for (let i = 0; i <= 100; i++) {
    const T = 75 + (40 * i) / 100;  // 75 → 115 °C, 100 points
    const xB_val = xB(T, z);
    const yB_val = yB(T, z);
    const PsatB = Psat(T, ANTOINE_BENZENE);
    const PsatT = Psat(T, ANTOINE_TOLUENE);
    
    let fB, fT;
    if (T <= Tx(z)) {
      fB = PsatB * z;
      fT = PsatT * (1 - z);
    } else if (isVLE(T, z)) {
      fB = yB_val * 1.0;
      fT = (1 - yB_val) * 1.0;
    } else {
      fB = z * 1.0;
      fT = (1 - z) * 1.0;
    }
    
    data.push({ T, fB, fT });
  }
  
  return data;
}

export function calcAll() {
  const { z, P, T } = readSliders();
  
  // Calculate compositions at current temperature
  const xB_val = xB(T, z);
  const yB_val = yB(T, z);
  
  // Calculate vapor pressures at current temperature
  const PsatB = Psat(T, ANTOINE_BENZENE);
  const PsatT = Psat(T, ANTOINE_TOLUENE);
  
  // Calculate fugacities based on phase region (exactly same logic as Mathematica Piecewise)
  let fB, fT;
  
  // Match Mathematica's Piecewise conditions exactly:
  // fB[T_] := Piecewise[{{PsatB[T]*z, T <= Tx[z]}, {yB[T]*P, VLE[T]}, {z*P, T >= Ty[z]}}]
  if (T <= Tx(z)) {
    // Liquid region: fB = PsatB[T]*z
    fB = PsatB * z;
    fT = PsatT * (1 - z);
  } else if (isVLE(T, z)) {
    // Two-phase region: fB = yB[T]*P
    fB = yB_val * 1.0;
    fT = (1 - yB_val) * 1.0;
  } else {
    // Vapor region: fB = z*P (when T >= Ty[z])
    fB = z * 1.0;
    fT = (1 - z) * 1.0;
  }
  
  /* datasets for charts */
  window.pxyData = generateTxyData();
  window.fugacityCurvesData = generateFugacityCurvesData();
  window.currentState = {
    moleFraction: z,
    pressure: P,
    temperature: T,
    xB: xB_val,
    yB: yB_val,
    fB,
    fT,
    isInTwoPhase: isVLE(T, z),
  };
}