export function calcAll() {
  if (window.state.dropdownSelection !== 1) return;

  const temp = getCurrentTemperature();
  const realGas = window.state.realGasChecked;

  // Clausius function always returns in bar
  function clausius(T) {
    return 1.0 * Math.exp(-5268.134 * (1 / T - 1 / 373));
  }

  function calcFugacityPressureIdealGas(temp) {
    // IDEAL GAS: all in bar
    const nPoints = 100;
    const Pmin = 0.0;
    const Pmax = 3.0;
    const Psat = clausius(temp); // in bar
    let Pvals = [], fugacityVapor = [], fugacityLiquid = [];
    for (let i = 0; i < nPoints; i++) {
      const P = Pmin + (Pmax - Pmin) * i / (nPoints - 1); // bar
      Pvals.push(P);
      if (P < Psat) {
        fugacityVapor.push(P); // ideal gas: fugacity = P (bar)
        fugacityLiquid.push(clausius(temp)); // bar
      } else {
        fugacityVapor.push(clausius(temp)); // bar
        fugacityLiquid.push(clausius(temp)); // bar
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

  if (!realGas) {
    calcFugacityPressureIdealGas(temp);
    return;
  }

  // REAL GAS: all in MPa
  const Pmin = 0.0;
  const Pmax = 3.0;
  // fugliq in MPa
  function fugliq(T) { return clausius(T) * 10; } // bar -> MPa
  function fugvap(P, T) { return P - 0.8 * (P - Math.log(P + 1)); } // P in MPa
  // Find Psat: fugvap(Psat, T) = fugliq(T)
  function findPsat(T) {
    let P = 0.00001;
    let step = 0.001;
    let lastDiff = null;
    for (let i = 0; i < 10000; i++) {
      const diff = fugvap(P, T) - fugliq(T);
      if (lastDiff !== null && diff * lastDiff < 0) {
        const P0 = P - step;
        const d0 = fugvap(P0, T) - fugliq(T);
        return P0 + (0 - d0) * (P - P0) / (diff - d0);
      }
      lastDiff = diff;
      P += step;
      if (P > 3) break;
    }
    return null;
  }
  const Psat = findPsat(temp); // in MPa
  let Pvals = [], fugacityVapor = [], fugacityLiquid = [];
  for (let i = 0; i < 100; i++) {
    const P = Pmin + (Pmax - Pmin) * i / (100 - 1); // MPa
    Pvals.push(P);
    if (Psat !== null && P < Psat) {
      fugacityVapor.push(fugvap(P, temp)); // MPa
      fugacityLiquid.push(fugliq(temp)); // MPa
    } else {
      fugacityVapor.push(fugliq(temp)); // MPa
      fugacityLiquid.push(fugliq(temp)); // MPa
    }
  }
  // Debug output for real gas
  console.log('[DEBUG] Real Gas:', { Psat, Pvals, fugacityVapor });

  window.state.fugacityPressureGraph = {
    Pvals,
    fugacityVapor,
    fugacityLiquid,
    Psat,
    temp,
    realGas
  };
}

// Helper to get current temperature in K from slider
function getCurrentTemperature() {
  // Slider is 0..1, maps to different ranges for fugacity vs pressure
  if (window.state.dropdownSelection !== 1) return 0;
  if (window.state.realGasChecked) {
    const minT = 458;
    const maxT = 483;
    return minT + (maxT - minT) * window.state.sliderValue;
  } else {
    const minT = 358;
    const maxT = 395;
    return minT + (maxT - minT) * window.state.sliderValue;
  }
}