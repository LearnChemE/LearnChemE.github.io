window.mousePressed = function() {
  const mX = mouseX / relativeSize();
  const mY = mouseY / relativeSize();
  const x = state.pump.x;
  const y = state.pump.y;
  if (mX > 16.5 + x - 7.5 && mX < 16.5 + x + 7.5 && mY > 19.5 + y - 5 && mY < 19.5 + y + 2.75 && (state.liquidFlow.timeCoordinate === -1 || state.liquidFlow.timeCoordinate === 1)) {
    state.pump.on = !state.pump.on;
  }
  if (mX > 124.5 && mX < 131 && mY < 90.5 && mY > 86.5) {
    state.massFlowRateUnits = state.massFlowRateUnits === "g/s" ? "kg/min" : "g/s";
  }
  if (mX > 61 - 2.5 && mX < 67 - 2.5 && mY < 49.75 && mY > 46.75) {
    state.temperatureUnits = state.temperatureUnits === "C" ? "F" : "C";
  }
  if (mX > 61 + 4 && mX < 64 + 4 && mY < 49.75 && mY > 46.75) {
    state.heatExchanger.T = state.temperatureUnits === "C" ? constrain(state.heatExchanger.T - 1, 100, 300) : constrain(state.heatExchanger.T - 5 / 9, 100, 300);
  }
  if (mX > 61 + 7.5 && mX < 64 + 7.5 && mY < 49.75 && mY > 46.75) {
    state.heatExchanger.T = state.temperatureUnits === "C" ? constrain(state.heatExchanger.T + 1, 100, 300) : constrain(state.heatExchanger.T + 5 / 9, 100, 300);
  }
  if (mX > 76.25 && mX < 82.25 && mY < 15.25 && mY > 12.25) {
    state.pressureUnits = state.pressureUnits === "atm" ? "bar" : "atm";
  }
  if (mX > 76.25 + 6.5 && mX < 79.25 + 6.5 && mY < 15.25 && mY > 12.25) {
    state.pressureController.P = state.pressureUnits === "atm" ? constrain(state.pressureController.P - 0.01, 1, 3) : constrain(state.pressureController.P - 0.01 * 100000 / 101325, 1, 3);
  }
  if (mX > 76.25 + 10 && mX < 79.25 + 10 && mY < 15.25 && mY > 12.25) {
    state.pressureController.P = state.pressureUnits === "atm" ? constrain(state.pressureController.P + 0.01, 1, 3) : constrain(state.pressureController.P + 0.01 * 100000 / 101325, 1, 3);
  }
  state.mousePressedFrameModulus = frameCount % 10;
}

// window.mouseDragged = function() {

// }