export function setDefaults() {
  state = {
    ...state,
    leftTank: {
      volume: 100,
      pressure: 3e6,
      temperature: 227,
      valveRotation: 0,
      xCoord: 30,
      yCoord: 30,
      width: 20,
      height: 80,
      open: false,
    },
    rightTank: {
      volume: 100,
      pressure: 0,
      temperature: 22,
      valveRotation: 0,
      xCoord: 100,
      yCoord: 30,
      width: 20,
      height: 80,
      open: false,
    },
    valvePosition: 0,
    valveOpen: false,
    solution: {
      Tf1: 0,
      Tf2: 0,
      P: 0,
    },
    maxTemperature: 600,
  };

  state.valveLocation = {
    x: 75,
    y: state.leftTank.yCoord - 10,
    width: 5,
    height: 1,
  }

  const pressureSlider = document.getElementById("pressure-slider");
  const temperatureSlider = document.getElementById("temperature-slider");
  const P = Number(pressureSlider.value);
  const T = Number(temperatureSlider.value);
  state.leftTank.pressure = P * 1e6;
  state.leftTank.temperature = T;
}

export function solve() {
  const leftTankInitialTemperature = state.leftTank.temperature;
  const rightTankInitialTemperature = state.rightTank.temperature;
  const initialPressure = state.leftTank.pressure;
  const V1 = state.leftTank.volume;
  const V2 = state.rightTank.volume;
  const Pi = state.leftTank.pressure / 1000;
  const Ti = state.leftTank.temperature + 273.15;
  let Tf1, Tf2, Pff;
  let error = 1e12;

  // Search for global minimum
  for (let T1 = Ti; T1 > 173; T1 -= 0.5) {
    for (let T2 = Ti; T2 < 783; T2 += 0.5) {
      for (let Pf = 0; Pf < state.leftTank.pressure / 1000; Pf += 100) {
        const diff1 = Pi * V1 / Ti - Pf * V1 / T1 - Pf * V2 / T2;
        const diff2 = T1 / Ti - (Pf / Pi) ** (2 / 7);
        const diff3 = Pi * V1 - Pf * V1 - Pf * V2;
        const diff = abs(diff1) + abs(diff2) + abs(diff3);
        if (diff < error) {
          error = diff;
          Tf1 = T1;
          Tf2 = T2;
          Pff = Pf;
        }
      }
    }
  }

  // Refine search
  for (let T1 = Tf1 + 20; T1 > Tf1 - 20; T1 -= 1) {
    for (let T2 = Tf2 + 20; T2 > Tf2 - 20; T2 -= 1) {
      for (let Pf = Pff - 50; Pf < Pff + 50; Pf++) {
        const diff1 = Pi * V1 / Ti - Pf * V1 / T1 - Pf * V2 / T2;
        const diff2 = T1 / Ti - (Pf / Pi) ** (2 / 7);
        const diff3 = Pi * V1 - Pf * V1 - Pf * V2;
        const diff = abs(diff1) + abs(diff2) + abs(diff3);
        if (diff < error) {
          error = diff;
          Tf1 = T1;
          Tf2 = T2;
          Pff = Pf;
        }
      }
    }
  }

  const TErrorRange = [
    0.95 - 0.04 * (state.leftTank.pressure - 5e5) / 4.5e6 - 0.03 * (state.leftTank.temperature - 25) / 275,
    0.98 - 0.02 * (state.leftTank.pressure - 5e5) / 4.5e6 - 0.01 * (state.leftTank.temperature - 25) / 275,
  ]

  const leftTankError = random(2 - TErrorRange[0], 2 - TErrorRange[1]);
  const rightTankError = random(TErrorRange[0], TErrorRange[1]);

  const PErrorRange = [
    min(2 - leftTankError, 2 - rightTankError),
    max(2 - leftTankError, 2 - rightTankError)
  ]

  const pressureError = random(PErrorRange[0], PErrorRange[1]);

  Tf1 -= 273.15;
  Tf2 -= 273.15;

  Tf1 = leftTankInitialTemperature + (Tf1 - leftTankInitialTemperature) * leftTankError;
  Tf2 = rightTankInitialTemperature + (Tf2 - rightTankInitialTemperature) * rightTankError;

  Pff *= 1000;

  Pff = initialPressure + pressureError * (Pff - initialPressure);

  state.solution = {
    Tf1: Tf1,
    Tf2: Tf2,
    P: Pff,
  }
}

/**
 * Smoothly interpolate between current and target values in a frame-rate independent way.
 * @param {*} current Current value
 * @param {*} target Target value
 * @param {*} r Interpolation rate (use exp(-1/timeConstant))
 * @param {*} dt Delta time (same units as time constant)
 * @returns Interpolated value
 */
function smoothLerp(current, target, r, dt) {
  return (current - target) * r ** dt + target;
}

const inv_tau = 0.3; // time constant in seconds
const r = Math.exp(-inv_tau);

export function calcAll() {
  // Only calculate if all valves are open
  if (state.rightTank.valveRotation > 0 && state.leftTank.valveRotation > 0 && state.valvePosition > 0) {
    // Use calculated solution to gradually update tank properties
    const Tf1 = state.solution.Tf1;
    const Tf2 = state.solution.Tf2;
    const Pf = state.solution.P;
    const dt = deltaTime / 1000;
    // Interpolate towards final values
    state. leftTank.temperature = smoothLerp(state. leftTank.temperature, Tf1, r, dt);
    state.rightTank.temperature = smoothLerp(state.rightTank.temperature, Tf2, r, dt);
    state. leftTank.pressure    = smoothLerp(state. leftTank.pressure,     Pf, r, dt);
    state.rightTank.pressure    = smoothLerp(state.rightTank.pressure,     Pf, r, dt);
  }
}