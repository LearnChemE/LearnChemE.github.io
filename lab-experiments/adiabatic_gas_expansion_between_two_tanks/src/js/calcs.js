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

  console.time("Solving for final temperatures and pressure...");

  // Use changes in volume to calculate theoretical final pressure
  var Pf = Pi * V1 / (V1 + V2); // Final pressure estimate

  // Use adiabatic expansion law to calculate T1f
  var T1 = Ti * (Pf / Pi) ** (2 / 7);

  // Use energy balance to calculate T2f
  var T2 = Pf * V2 / (Pi / Ti - Pf / T1) / V1;


  // Calculate error ranges by sensitivity analysis
  const TErrorRange = [
    0.95 - 0.04 * (state.leftTank.pressure - 5e5) / 4.5e6 - 0.03 * (state.leftTank.temperature - 25) / 275,
    0.98 - 0.02 * (state.leftTank.pressure - 5e5) / 4.5e6 - 0.01 * (state.leftTank.temperature - 25) / 275,
  ]

  // Generate errors based on ranges
  const leftTankError = random(2 - TErrorRange[0], 2 - TErrorRange[1]);
  const rightTankError = random(TErrorRange[0], TErrorRange[1]);

  // Pressure error range depends on temperature errors
  const PErrorRange = [
    min(2 - leftTankError, 2 - rightTankError),
    max(2 - leftTankError, 2 - rightTankError)
  ]

  // Generate pressure error based on range
  const pressureError = random(PErrorRange[0], PErrorRange[1]);

  // Convert back to Celsius
  T1 -= 273.15;
  T2 -= 273.15;

  // Apply errors
  T1 = leftTankInitialTemperature + (T1 - leftTankInitialTemperature) * leftTankError;
  T2 = rightTankInitialTemperature + (T2 - rightTankInitialTemperature) * rightTankError;

  Pf *= 1000;

  Pf = initialPressure + pressureError * (Pf - initialPressure);

  state.solution = {
    Tf1: T1,
    Tf2: T2,
    P: Pf,
  }

  console.timeEnd("Solving for final temperatures and pressure...");
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