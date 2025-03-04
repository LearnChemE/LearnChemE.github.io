export function setDefaults() {
  state = {
    ...state,
    leftTank: {
      volume: 100,
      pressure: 1e7,
      outletPressure: 0,
      temperature: 2,
      valveRotation: 0,
      xCoord: 30,
      yCoord: 30,
      width: 20,
      height: 80,
    },
    rightTank: {
      volume: 100,
      pressure: 0,
      outletPressure: 0,
      temperature: 0,
      valveRotation: 0,
      xCoord: 100,
      yCoord: 30,
      width: 20,
      height: 80,
    },
    valvePosition: 0,
    solution: {
      Tf1: 0,
      Tf2: 0,
      P: 0,
    }
  };

  state.valveLocation = {
    x: 75,
    y: state.leftTank.yCoord - 10,
    width: 5,
    height: 1,
  }
}

export function solve() {
  const V1 = state.leftTank.volume;
  const V2 = state.rightTank.volume;
  const R = 8.314;
  const Pi = state.leftTank.pressure / 1000;
  const Ti = state.leftTank.temperature + 273.15;
  let Tf1, Tf2, Pff;
  let error = 1e12;
  for (let T1 = Ti; T1 > 0; T1 -= 1) {
    for (let T2 = Ti; T2 < 1000; T2 += 1) {
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
  state.solution = {
    Tf1: Tf1,
    Tf2: Tf2,
    P: Pff * 1000,
  }
}

export function calcAll() {
  if (state.rightTank.valveRotation > 0 && state.leftTank.valveRotation > 0 && state.valvePosition > 0) {
    const Tf1 = state.solution.Tf1;
    const Tf2 = state.solution.Tf2;
    const Pf = state.solution.P;
    state.leftTank.temperature = 0.005 * (state.leftTank.temperature - Tf1) + state.leftTank.temperature;
    state.rightTank.temperature = 0.005 * (state.rightTank.temperature - Tf2) + state.rightTank.temperature;
    state.leftTank.pressure = 0.005 * (Pf - state.leftTank.pressure) + state.leftTank.pressure;
    state.rightTank.pressure = 0.005 * (Pf - state.rightTank.pressure) + state.rightTank.pressure;
    state.leftTank.outletPressure = 0.05 * (state.leftTank.pressure - state.leftTank.outletPressure) + state.leftTank.outletPressure;
    state.rightTank.outletPressure = 0.05 * (state.leftTank.outletPressure - state.rightTank.outletPressure) + state.rightTank.outletPressure;
  }
}