export function setDefaults() {
  state = {
    ...state,
    liquidHeight: 0,
    vaporDensity: 0,
    liquidFlow: {
      timeCoordinate: -1,
      liquidHeight: 0,
    },
    mL: 0,
    mV: 0,
    mF: 0,
    nF: 1,
    nL: 0,
    nV: 0,
    yV: 0,
    xL: 0,
    mL_current: 0,
    mF_current: 0,
    mousePressedFrameModulus: 0,
    mousePressedPressureFrame: -1200,
    mousePressedTemperatureFrame: -1200,
    bubbleFrame: 0,
    bubbleEndTime: 0,
    chemicals: {
      chemical1: {
        name: "chemical 1",
        A: 6.880,
        B: 1197,
        C: 218.7,
        Psat: (T) => {
          const c = state.chemicals.chemical1;
          return Math.pow(10, c.A - c.B / (T + c.C)) * 0.00133322; // bar
        },
        Hvap: 30.7, // kJ / mol
        CpL: 136, // J / mol·K
        CpV: (T) => {
          const A = -3.39e+01,
            B = 4.74e-01,
            C = -3.02e-04,
            D = 7.13e-08;
          return A + B * T + C * T ** 2 + D * T ** 3; // J/mol·K
        },
        MW: 78 // g/mol
      },
      chemical2: {
        name: "chemical 2",
        A: 6.951,
        B: 1342,
        C: 219.2,
        Psat: (T) => {
          const c = state.chemicals.chemical2;
          return Math.pow(10, c.A - c.B / (T + c.C)) * 0.00133322;
        },
        Hvap: 51.0,
        CpL: 157,
        CpV: (T) => {
          const A = -2.44e+01,
            B = 5.13e-01,
            C = -2.77e-04,
            D = 4.91e-08;
          return A + B * T + C * T ** 2 + D * T ** 3;
        },
        MW: 92
      },
      chemical3: {
        name: "chemical 3",
        A: 6.876,
        B: 1171,
        C: 224.4,
        Psat: (T) => {
          const c = state.chemicals.chemical3;
          return Math.pow(10, c.A - c.B / (T + c.C)) * 0.00133322;
        },
        Hvap: 31.0,
        CpL: 195,
        CpV: (T) => {
          const A = -4.413,
            B = 5.28e-01,
            C = -3.12e-04,
            D = 6.49e-08;
          return A + B * T + C * T ** 2 + D * T ** 3;
        },
        MW: 86
      },
      chemical4: {
        name: "chemical 4",
        A: 6.919,
        B: 1352,
        C: 209.2,
        Psat: (T) => {
          const c = state.chemicals.chemical4;
          return Math.pow(10, c.A - c.B / (T + c.C)) * 0.00133322;
        },
        Hvap: 41.0,
        CpL: 254,
        CpV: (T) => {
          const A = -6.096,
            B = 0.7712,
            C = -4.195e-04,
            D = 8.855e-08;
          return A + B * T + C * T ** 2 + D * T ** 3;
        },
        MW: 114
      },
      chemical5: {
        name: "chemical 5",
        A: 6.851,
        B: 1206,
        C: 223.1,
        Psat: (T) => {
          const c = state.chemicals.chemical5;
          return Math.pow(10, c.A - c.B / (T + c.C)) * 0.00133322;
        },
        Hvap: 30.8,
        CpL: 156,
        CpV: (T) => {
          const A = -5.45e+01,
            B = 6.11e-01,
            C = -2.52e-04,
            D = 1.32e-08;
          return A + B * T + C * T ** 2 + D * T ** 3;
        },
        MW: 84
      },
      chemical6: {
        name: "chemical 6",
        A: 6.944,
        B: 1495,
        C: 193.9,
        Psat: (T) => {
          const c = state.chemicals.chemical6;
          return Math.pow(10, c.A - c.B / (T + c.C)) * 0.00133322;
        },
        Hvap: 51.3,
        CpL: 313,
        CpV: (T) => {
          const A = -7.913,
            B = 9.61e-01,
            C = -5.29e-04,
            D = 1.13e-07;
          return A + B * T + C * T ** 2 + D * T ** 3;
        },
        MW: 144
      },
      chemical7: {
        name: "chemical 7",
        A: 8.072,
        B: 1575,
        C: 238.9,
        Psat: (T) => {
          const c = state.chemicals.chemical7;
          return Math.pow(10, c.A - c.B / (T + c.C)) * 0.00133322;
        },
        Hvap: 35.2,
        CpL: 81.2,
        CpV: (T) => {
          const A = 18.38;
          const B = 0.1016;
          const C = -2.868e-5;
          return A + B * T + C * T ** 2;
        },
        MW: 32
      },
      chemical8: {
        name: "chemical 8",
        A: 8.071,
        B: 1731,
        C: 233.4,
        Psat: (T) => {
          const c = state.chemicals.chemical8;
          return Math.pow(10, c.A - c.B / (T + c.C)) * 0.00133322;
        },
        Hvap: 40.7,
        CpL: 75.3,
        CpV: (T) => {
          const TC = T - 273.15;
          const A = 3.537165e-14;
          const B = -2.853687405e-11;
          const C = 9.00625896115e-9;
          const D = -1.33933025300616e-6;
          const E = 1.04431796066292e-4;
          const F = -3.62516252242907e-3;
          const G = 4.22234973344988;
          return (A * TC ** 6 + B * TC ** 5 + C * TC ** 4 + D * TC ** 3 + E * TC ** 2 + F * TC + G) * 18.016;
        },
        MW: 18
      }
    }
  };

  state.pump.on = false;
  state.heatExchanger.valvePosition = (state.heatExchanger.T - state.heatExchanger.Tmin) / (state.heatExchanger.Tmax - state.heatExchanger.Tmin);
  state.pressureController.valvePosition = 1 - (state.pressureController.P - state.pressureController.Pmin) / (state.pressureController.Pmax - state.pressureController.Pmin);
  state.heatExchanger.T_current = 500;
  state.pressureController.P_current = 1;
  state.column.T_current = 22;
}

// Solve for vapor fraction
function flash(T, P, z, component_A, component_B) {
  const K1 = component_A.Psat(T - 273.15) / P;
  const K2 = component_B.Psat(T - 273.15) / P;
  const tolerance = 1e-8;

  let beta_low = 0,
    beta_high = 1,
    beta = 0.5;

  for (let i = 0; i < 30; i++) {
    beta = 0.5 * (beta_low + beta_high);
    const f = rr(z, K1, K2, beta);

    if (abs(f) < tolerance) {
      break;
    }

    if (f > 0) {
      beta_low = beta;
    } else {
      beta_high = beta;
    }
  }
  return { beta, K1, K2 };
}

// Rachford–Rice function
function rr(z, K1, K2, beta) {
  const t1 = z * (K1 - 1) / (1 + beta * (K1 - 1));
  const t2 = (1 - z) * (K2 - 1) / (1 + beta * (K2 - 1));
  return t1 + t2;
}

// Integrate CpV over temperature range
function int_CpV(component, T_low, T_high) {
  let sum = 0;
  let steps = 100;
  const dT = (T_high - T_low) / steps;
  for (let i = 0; i < steps; i++) {
    const T = T_low + i * dT;
    const Cp = component.CpV(T);
    sum += Cp * dT;
  }
  return sum;
}

// Enthalpy of liquid (J/mol)
function HL(T, x, component_A, component_B) {
  const Cp = x * component_A.CpL + (1 - x) * component_B.CpL;
  const Tref = 298;
  return Cp * (T - Tref);
}

// Enthalpy of vapor (J/mol)
function HV(T, y, component_A, component_B) {
  const Tref = 298;

  const H_latent_A = component_A.Hvap * 1000;
  const H_sensible_A = int_CpV(component_A, Tref, T);
  const H_A = H_latent_A + H_sensible_A;

  const H_latent_B = component_B.Hvap * 1000;
  const H_sensible_B = int_CpV(component_B, Tref, T);
  const H_B = H_latent_B + H_sensible_B;

  return y * H_A + (1 - y) * H_B;
}

// Feed enthalpy for given molar flow rate
function HF(args) {
  const z = args.z;
  const T = args.T + 273.15;
  const component_A = args.component_A;
  const component_B = args.component_B;

  return HL(T, z, component_A, component_B);
}

function solution(args) {
  const T = args.T;
  const z = args.z;
  const P = args.P;
  const n = args.n;
  const component_A = args.component_A;
  const component_B = args.component_B;

  const H_feed = n * HF(args);

  let T_low = Math.min(T, 0) + 273.15;
  let T_high = Math.max(T, 1000) + 273.15;
  let T_est = 0.5 * (T_low + T_high);

  let nL = 0,
    nV = 0,
    x = z,
    y = z;

  const iterations = 30;

  for (let i = 0; i < iterations; i++) {
    const sol = flash(T_est, P, z, component_A, component_B);
    const V = sol.beta;
    const K1 = sol.K1;

    const L = 1 - V;
    const denom = 1 + V * (K1 - 1);

    const xF = z / denom;
    const yF = K1 * xF;

    const H_liquid = HL(T_est, xF, component_A, component_B);
    const H_vapor = HV(T_est, yF, component_A, component_B);
    const H_out = n * L * H_liquid + n * V * H_vapor;

    const diff = H_out - H_feed;

    if (Math.abs(diff) < 1e-2 || i === iterations - 1) {
      nL = n * L;
      nV = n * V;
      x = xF;
      y = yF;
      break;
    }

    if (diff > 0) {
      T_high = T_est;
    } else {
      T_low = T_est;
    }

    T_est = 0.5 * (T_low + T_high);
  }

  // clamp single-phase
  if (nV <= 0) {
    nV = 0;
    nL = n;
    T_est = T;
    x = z;
    y = z;
  } else if (nV >= n) {
    nV = n;
    nL = 0;
    T_est = T;
    x = z;
    y = z;
  }

  T_est -= 273.15; // convert back to °C

  return {
    T: T_est,
    z: z,
    P: P,
    L: nL,
    V: nV,
    x: x,
    y: y
  }
}

export function calcAll() {
  const sol = solution({
    T: state.heatExchanger.T,
    z: state.xF,
    P: state.pressureController.P * 101325 / 100000,
    n: state.nF,
    component_A: mixture[0],
    component_B: mixture[1]
  });

  state.column.T = sol.T;
  state.nL = sol.L;
  state.nV = sol.V;
  state.xL = sol.x;
  state.yV = sol.y;
  state.mL = sol.L * sol.x * mixture[0].MW / 1000 + sol.L * (1 - sol.x) * mixture[1].MW / 1000;
  state.mV = sol.V * sol.y * mixture[0].MW / 1000 + sol.V * (1 - sol.y) * mixture[1].MW / 1000;
  state.mF = state.nF * (sol.z * mixture[0].MW / 1000 + (1 - sol.z) * mixture[1].MW / 1000);
}