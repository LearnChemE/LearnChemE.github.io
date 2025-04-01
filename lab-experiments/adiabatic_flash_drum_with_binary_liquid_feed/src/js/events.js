window.mousePressed = function() {
  const mX = mouseX / relativeSize();
  const mY = mouseY / relativeSize();
  const x = state.pump.x;
  const y = state.pump.y;
  if (mX > 16.5 + x - 7.5 && mX < 16.5 + x + 7.5 && mY > 31 + y - 5 && mY < 31 + y + 2.75) {
    state.pump.on = !state.pump.on;
  }
  if (mX > 124.5 && mX < 131 && mY < 90.5 && mY > 86.5) {
    state.massFlowRateUnits = state.massFlowRateUnits === "g/s" ? "kg/min" : "g/s";
  }
  if (mX > 61 && mX < 67 && mY < 49.75 && mY > 46.75) {
    state.temperatureUnits = state.temperatureUnits === "C" ? "F" : "C";
  }
}

// window.mouseDragged = function() {

// }