import { calcAll } from "./calcs";

window.mousePressed = function() {
  const mX = mouseX / relativeSize();
  const mY = mouseY / relativeSize();
  const x = state.pump.x;
  const y = state.pump.y;
  if (mX > 16.5 + x - 3.5 && mX < 16.5 + x + 11.5 && mY > 19.5 + y - 1 && mY < 19.5 + y + 6.75 && (state.liquidFlow.timeCoordinate === -1 || state.liquidFlow.timeCoordinate === 1)) {
    state.pump.on = !state.pump.on;
  }
  if (mX > 62 && mX < 65 && mY < 52.75 && mY > 49.75) {
    state.heatExchanger.T = state.temperatureUnits === "C" ? constrain(state.heatExchanger.T - 1, state.heatExchanger.Tmin, state.heatExchanger.Tmax) : constrain(state.heatExchanger.T - 5 / 9, state.heatExchanger.Tmin, state.heatExchanger.Tmax);
    state.mousePressedTemperatureFrame = frameCount;
    state.heatExchanger.valvePosition = state.heatExchanger.T / state.heatExchanger.Tmax;
  }
  if (mX > 62 + 3.5 && mX < 65 + 3.5 && mY < 52.75 && mY > 49.75) {
    state.heatExchanger.T = state.temperatureUnits === "C" ? constrain(state.heatExchanger.T + 1, state.heatExchanger.Tmin, state.heatExchanger.Tmax) : constrain(state.heatExchanger.T + 5 / 9, state.heatExchanger.Tmin, state.heatExchanger.Tmax);
    state.mousePressedTemperatureFrame = frameCount;
    state.heatExchanger.valvePosition = state.heatExchanger.T / state.heatExchanger.Tmax;
  }
  if (mX > 72.75 && mX < 75.75 && mY < 25.25 && mY > 22.25) {
    state.pressureController.P = state.pressureUnits === "atm" ? constrain(state.pressureController.P - 0.01, state.pressureController.Pmin, state.pressureController.Pmax) : constrain(state.pressureController.P - 0.01 * 100000 / 101325, state.pressureController.Pmin, state.pressureController.Pmax);
    state.mousePressedPressureFrame = frameCount;
    state.pressureController.valvePosition = 0.2 + (state.pressureController.Pmax - state.pressureController.P) * 0.8;
  }
  if (mX > 72.75 + 3.5 && mX < 75.75 + 3.5 && mY < 25.25 && mY > 22.25) {
    state.pressureController.P = state.pressureUnits === "atm" ? constrain(state.pressureController.P + 0.01, state.pressureController.Pmin, state.pressureController.Pmax) : constrain(state.pressureController.P + 0.01 * 100000 / 101325, state.pressureController.Pmin, state.pressureController.Pmax);
    state.mousePressedPressureFrame = frameCount;
    state.pressureController.valvePosition = 0.2 + (state.pressureController.Pmax - state.pressureController.P) * 0.8;
  }
  state.mousePressedFrameModulus = frameCount % 10;
  calcAll();
}

// window.mouseDragged = function() {

// }