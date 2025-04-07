import { calcAll } from "./calcs";

window.mousePressed = function() {
  const mX = mouseX / relativeSize();
  const mY = mouseY / relativeSize();
  const x = state.pump.x;
  const y = state.pump.y;
  if (mX > 16.5 + x - 3.5 && mX < 16.5 + x + 11.5 && mY > 19.5 + y - 1 && mY < 19.5 + y + 6.75 && (state.liquidFlow.timeCoordinate === -1 || state.liquidFlow.timeCoordinate === 1)) {
    state.pump.on = !state.pump.on;
  }
  if (mX > 124.5 && mX < 131 && mY < 90.5 && mY > 86.5) {
    // state.liquidOutlet.units = state.liquidOutlet.units === "g/s" ? "kg/min" : "g/s";
    state.liquidOutlet.readout_on = !state.liquidOutlet.readout_on;
  }
  if (mX > 61 - 2.5 && mX < 67 - 2.5 && mY < 52.75 && mY > 49.75) {
    // state.temperatureUnits = state.temperatureUnits === "C" ? "F" : "C";
    state.heatExchanger.on = !state.heatExchanger.on;
    if (!state.heatExchanger.on) {
      state.heatExchanger.T = 25;
      const interval = setInterval(() => {
        state.heatExchanger.valvePosition = constrain(state.heatExchanger.valvePosition - 0.01, 0, 1);
        if (state.heatExchanger.valvePosition <= 0) {
          clearInterval(interval);
          state.heatExchanger.valvePosition = 0;
        }
      }, 16.67);
    }
  }
  if (mX > 61 + 4 && mX < 64 + 4 && mY < 52.75 && mY > 49.75) {
    if (state.heatExchanger.on) {
      state.heatExchanger.T = state.temperatureUnits === "C" ? constrain(state.heatExchanger.T - 1, state.heatExchanger.Tmin, state.heatExchanger.Tmax) : constrain(state.heatExchanger.T - 5 / 9, state.heatExchanger.Tmin, state.heatExchanger.Tmax);
      state.mousePressedTemperatureFrame = frameCount;
      state.heatExchanger.valvePosition = state.heatExchanger.T / state.heatExchanger.Tmax;
    }
  }
  if (mX > 61 + 7.5 && mX < 64 + 7.5 && mY < 52.75 && mY > 49.75) {
    if (state.heatExchanger.on) {
      state.heatExchanger.T = state.temperatureUnits === "C" ? constrain(state.heatExchanger.T + 1, state.heatExchanger.Tmin, state.heatExchanger.Tmax) : constrain(state.heatExchanger.T + 5 / 9, state.heatExchanger.Tmin, state.heatExchanger.Tmax);
      state.mousePressedTemperatureFrame = frameCount;
      state.heatExchanger.valvePosition = state.heatExchanger.T / state.heatExchanger.Tmax;
    }
  }
  if (mX > 69.25 && mX < 75.25 && mY < 25.25 && mY > 22.25) {
    // state.pressureUnits = state.pressureUnits === "atm" ? "bar" : "atm";
    state.pressureController.on = !state.pressureController.on;
    if (!state.pressureController.on) {
      state.pressureController.P = 1;
    }
  }
  if (mX > 69.25 + 6.5 && mX < 72.25 + 6.5 && mY < 25.25 && mY > 22.25) {
    if (state.pressureController.on) {
      state.pressureController.P = state.pressureUnits === "atm" ? constrain(state.pressureController.P - 0.01, state.pressureController.Pmin, state.pressureController.Pmax) : constrain(state.pressureController.P - 0.01 * 100000 / 101325, state.pressureController.Pmin, state.pressureController.Pmax);
      state.mousePressedPressureFrame = frameCount;
      state.pressureController.valvePosition = 0.2 + (state.pressureController.Pmax - state.pressureController.P) * 0.8;
    }
  }
  if (mX > 76.25 + 3 && mX < 79.25 + 3 && mY < 25.25 && mY > 22.25) {
    if (state.pressureController.on) {
      state.pressureController.P = state.pressureUnits === "atm" ? constrain(state.pressureController.P + 0.01, state.pressureController.Pmin, state.pressureController.Pmax) : constrain(state.pressureController.P + 0.01 * 100000 / 101325, state.pressureController.Pmin, state.pressureController.Pmax);
      state.mousePressedPressureFrame = frameCount;
      state.pressureController.valvePosition = 0.2 + (state.pressureController.Pmax - state.pressureController.P) * 0.8;
    }
  }
  if (mX > 113 && mX < 119 && mY < 51.25 && mY > 48.25) {
    // state.column.units = state.column.units === "C" ? "F" : "C";
    state.column.readout_on = !state.column.readout_on;
  }
  if (mX > 49.5 && mX < 55.5 && mY < 85 && mY > 82) {
    // state.inlet.units = state.inlet.units === "g/s" ? "kg/min" : "g/s";
    state.inlet.readout_on = !state.inlet.readout_on;
  }
  state.mousePressedFrameModulus = frameCount % 10;
  calcAll();
}

// window.mouseDragged = function() {

// }