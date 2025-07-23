// Clausius function always returns in bar
export function clausius(T) {
  return 1.0 * Math.exp(-5268 * (1 / T - 1 / 373));
}

// Fugacity vs Temperature Calculation
function calcFugacityVsTemperature() {
  // Only run if in fugacity vs temperature mode
  if (window.state.dropdownSelection !== 0) return;
  // Pressure in MPa from slider
  const minP = 0.2;
  const maxP = 1.5;
  const pres = minP + (maxP - minP) * window.state.sliderValue; // MPa
  const Tmin = 280;
  const Tmax = 400;
  const nPoints = 100;
  // Find Tsat where fugL = fugV (ideal)
  function fugL(T) { return clausius(T); } // bar
  function fugV(T) { return pres; } // MPa
  // Root finding for Tsat
  function findTsat() {
    let T = Tmin, step = 0.05, lastDiff = null;
    for (let i = 0; i < 10000; i++) {
      const diff = fugL(T) - fugV(T);
      if (lastDiff !== null && diff * lastDiff < 0) {
        const T0 = T - step;
        const d0 = fugL(T0) - fugV(T0);
        return T0 + (0 - d0) * (T - T0) / (diff - d0);
      }
      lastDiff = diff;
      T += step;
      if (T > Tmax) break;
    }
    return null;
  }
  const Tsat = findTsat();
  // Generate data for plotting
  let Tvals = [], fugacityVals = [];
  for (let i = 0; i < nPoints; i++) {
    const T = Tmin + (Tmax - Tmin) * i / (nPoints - 1);
    Tvals.push(T);
    if (Tsat !== null && T < Tsat) {
      fugacityVals.push(fugL(T));
    } else {
      fugacityVals.push(fugV(T));
    }
  }
  window.state.fugacityTemperatureGraph = {
    Tvals,
    fugacityVals,
    Tsat,
    pres
  };
}

// Fugacity vs Pressure (Ideal Gas) Calculation
function calcFugacityPressureIdealGas(temp) {
  // IDEAL GAS: all in bar
  const nPoints = 100;
  const Pmin = 0.0;
  const Pmax = 3.0;
  const Psat = clausius(temp); // in bar
  let Pvals = [], fugacityVapor = [], fugacityLiquid = [];
  for (let i = 0; i < nPoints; i++) {
    const P = Pmin + (Pmax - Pmin) * i / (nPoints - 1); // MPa
    Pvals.push(P);
    if (P < Psat) {
      fugacityVapor.push(P); // ideal gas: fugacity = P (MPa)
      fugacityLiquid.push(Psat); // bar
    } else {
      fugacityVapor.push(Psat); // bar
      fugacityLiquid.push(Psat); // bar
    }
  }
  window.state.fugacityPressureGraph = {
    Pvals,
    fugacityVapor,
    fugacityLiquid,
    Psat,
    temp,
    realGas: false
  };
}

// Fugacity vs Pressure (Real Gas) Calculation
function calcFugacityPressureRealGas(temp) {
  // REAL GAS: all in bar
  const nPoints = 100;
  const Pmin = 0.0;
  const Pmax = 3.0;
  // Vapor fugacity (real gas, in bar):
  function fugV(P) { return (P - 0.8 * (P - Math.log(P + 1))); } // bar
  // Liquid fugacity (in MPa):
  function fugL(temp) { return clausius(temp); } // bar
  // Find Psat: fugL(temp) = fugV(Psat)
  function findPsat(temp) {
    let P = Pmin, step = (Pmax - Pmin) / nPoints, lastDiff = null;
    for (let i = 0; i < nPoints * 10; i++) {
      const diff = fugL(temp) - fugV(P);
      if (lastDiff !== null && diff * lastDiff < 0) {
        const P0 = P - step;
        const d0 = fugL(temp) - fugV(P0);
        return P0 + (0 - d0) * (P - P0) / (diff - d0);
      }
      lastDiff = diff;
      P += step;
      if (P > Pmax) break;
    }
    return null;
  }
  const Psat = findPsat(temp); // in MPa
  let Pvals = [], fugacityVapor = [], fugacityLiquid = [];
  for (let i = 0; i < nPoints; i++) {
    const P = Pmin + (Pmax - Pmin) * i / (nPoints - 1); // MPa
    Pvals.push(P);
    if (Psat !== null && P < Psat) {
      fugacityVapor.push(fugV(P)); // MPa
      fugacityLiquid.push(fugL(temp)); // MPa
    } else {
      fugacityVapor.push(fugL(temp)); // MPa
      fugacityLiquid.push(fugL(temp)); // MPa
    }
  }
  window.state.fugacityPressureGraph = {
    Pvals,
    fugacityVapor,
    fugacityLiquid,
    Psat,
    temp,
    realGas: true
  };
}

export function calcAll() {
  // Fugacity vs Temperature
  if (window.state.dropdownSelection === 0) {
    calcFugacityVsTemperature();
    return;
  }
  // Fugacity vs Pressure
  if (window.state.dropdownSelection !== 1) return;
  const temp = getCurrentTemperature();
  const realGas = window.state.realGasChecked;
  if (!realGas) {
    calcFugacityPressureIdealGas(temp);
    return;
  }
  calcFugacityPressureRealGas(temp);
}

// Helper to get current temperature in K from slider
function getCurrentTemperature() {
  // Slider is 0..1, maps to different ranges for fugacity vs pressure
  if (window.state.dropdownSelection !== 1) return 0;
  if (window.state.realGasChecked) {
    const minT = 350;
    const maxT = 385;
    // Snap to nearest integer
    return Math.round(minT + (maxT - minT) * window.state.sliderValue);
  } else {
    const minT = 350;
    const maxT = 400;
    // Snap to nearest integer
    return Math.round(minT + (maxT - minT) * window.state.sliderValue);
  }
}