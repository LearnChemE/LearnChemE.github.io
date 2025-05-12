function calcInletFlowRate() {
  const P = state.inletPressure;
  const frac = map(P, 1, 8, 0, 1);
  const Q = 50 * frac ** 0.4;
  state.inletVolumetricFlowRate = Q;
}

function molesIn() {
  const P = state.inletPressure;
  const T = 273.15 + 22;
  const R = 8.314;
  const V = state.inletVolumetricFlowRate * 1e-6;
  const n = P * V / (R * T);
  return n;
}

function calcOutletPressureAndFlowRate() {
  const coldStreamFraction = 0.2 + 0.599 * (1 - state.vortexPortPosition) ** 0.75;
  state.fractionInColdStream = coldStreamFraction;
  calculateTemperatures();
  const nIn = molesIn();
  const nOut = nIn * coldStreamFraction;
  const Pout = 1 + state.inletPressure * (nOut / (6 * nIn)) ** 0.85 || 1;
  state.outletPressure = Pout;
  const R = 8.314;
  const T = state.coldSideTemperature + 273.15;
  const VOut = nOut * R * T / Pout;
  state.outletVolumetricFlowRate = VOut * 1e6;
}

function calculateTemperatures() {
  if (state.inletPressure <= 1) {
    state.coldSideTemperature = 22;
    state.hotSideTemperature = 22;
    return;
  }
  const P = barToPSI(state.inletPressure);
  const z = state.fractionInColdStream * 100;
  const TCold = 22 - 5 * interpolateFromData(P, z, TDropData) / 9;
  const THot = 22 + 5 * interpolateFromData(P, z, TRiseData) / 9;
  state.coldSideTemperature = TCold;
  state.hotSideTemperature = THot;
}

function efficiency() {
  const tf = 22 + 273;
  const tCold = state.coldSideTemperature + 273;
  const gamma = 1.4;
  const Pf = state.inletPressure;
  return (tf - tCold) / (tf * ((Pf / 1.01325) ** ((gamma - 1) / gamma) - 1));
}

function COP() {
  const Cp = 1004.832;
  const R = 286.9;
  const phi = state.fractionInColdStream;
  const Tf = 22 + 273;
  const Pf = state.inletPressure;
  const TCold = state.coldSideTemperature + 273;
  const gamma = 1.4;
  return (phi * Cp * (Tf - TCold)) / ((gamma / (gamma - 1)) * R * Tf * ((Pf / 1.01325) ** ((gamma - 1) / gamma) - 1));
}

export function calcAll() {
  calcInletFlowRate();
  calcOutletPressureAndFlowRate();
}

function barToPSI(bar) {
  return bar * 14.5038;
}

function interpolateFromData(psi, percentage_open, data) {
  if (psi < 20) {
    psi = 20;
  }
  if (psi >= 100) {
    psi = 99.9;
  }
  for (let i = 0; i < data.length; i++) {
    if (psi >= data[i][0][0] &&
      percentage_open >= data[i][0][1] &&
      Math.abs(psi - data[i][0][0]) < 20 &&
      Math.abs(percentage_open - data[i][0][1]) < 10) {
      const T1 = data[i][1];
      const T2 = data[i + 7][1];
      const T3 = data[i + 1][1];
      const T4 = data[i + 8][1];
      const P1 = data[i][0][0];
      const P2 = data[i + 7][0][0];
      const open1 = data[i][0][1];
      const open2 = data[i + 1][0][1];

      const Pfrac = (psi - P1) / (P2 - P1);
      const openFrac = (percentage_open - open1) / (open2 - open1);
      const Tlow = T1 + openFrac * (T3 - T1);
      const Thigh = T2 + openFrac * (T4 - T2);

      const T = Tlow + Pfrac * (Thigh - Tlow);
      return T;
    }
  }
}

const TDropData = [
  [
    [20, 20], 63.1
  ],
  [
    [20, 30], 61.3
  ],
  [
    [20, 40],
    56.1
  ],
  [
    [20, 50], 51.3
  ],
  [
    [20, 60], 44.5
  ],
  [
    [20, 70],
    37
  ],
  [
    [20, 80], 28.8
  ],
  [
    [40, 20], 89.2
  ],
  [
    [40, 30],
    85.8
  ],
  [
    [40, 40], 81.1
  ],
  [
    [40, 50], 73.2
  ],
  [
    [40, 60],
    63.1
  ],
  [
    [40, 70], 52.5
  ],
  [
    [40, 80], 39.1
  ],
  [
    [60, 20],
    104.3
  ],
  [
    [60, 30], 101.7
  ],
  [
    [60, 40], 93.7
  ],
  [
    [60, 50],
    84.1
  ],
  [
    [60, 60], 73.5
  ],
  [
    [60, 70], 60.9
  ],
  [
    [60, 80],
    45.4
  ],
  [
    [80, 20], 117.1
  ],
  [
    [80, 30], 111.2
  ],
  [
    [80, 40],
    102.3
  ],
  [
    [80, 50], 92.2
  ],
  [
    [80, 60], 81.3
  ],
  [
    [80, 70],
    66.2
  ],
  [
    [80, 80], 50.1
  ],
  [
    [100, 20], 128.3
  ],
  [
    [100, 30],
    119.5
  ],
  [
    [100, 40], 111.1
  ],
  [
    [100, 50], 100.3
  ],
  [
    [100, 60],
    86.5
  ],
  [
    [100, 70], 71.9
  ],
  [
    [100, 80], 53.5
  ]
];

const TRiseData = [
  [
    [20, 20], 15.1
  ],
  [
    [20, 30], 24.4
  ],
  [
    [20, 40],
    37.8
  ],
  [
    [20, 50], 51.3
  ],
  [
    [20, 60], 65.1
  ],
  [
    [20, 70],
    82.5
  ],
  [
    [20, 80], 108.1
  ],
  [
    [40, 20], 23.4
  ],
  [
    [40, 30],
    35.2
  ],
  [
    [40, 40], 52.1
  ],
  [
    [40, 50], 73.2
  ],
  [
    [40, 60],
    92.8
  ],
  [
    [40, 70], 116.9
  ],
  [
    [40, 80], 148.1
  ],
  [
    [60, 20],
    25.6
  ],
  [
    [60, 30], 39.9
  ],
  [
    [60, 40], 59.1
  ],
  [
    [60, 50],
    84.1
  ],
  [
    [60, 60], 104.1
  ],
  [
    [60, 70], 133.1
  ],
  [
    [60, 80],
    169.1
  ],
  [
    [80, 20], 26.1
  ],
  [
    [80, 30], 44.1
  ],
  [
    [80, 40],
    64.1
  ],
  [
    [80, 50], 92.2
  ],
  [
    [80, 60], 114.1
  ],
  [
    [80, 70],
    144.3
  ],
  [
    [80, 80], 181.1
  ],
  [
    [100, 20], 27.8
  ],
  [
    [100, 30],
    46.1
  ],
  [
    [100, 40], 67.3
  ],
  [
    [100, 50], 100.3
  ],
  [
    [100, 60],
    119.9
  ],
  [
    [100, 70], 151.1
  ],
  [
    [100, 80], 192.1
  ]
];