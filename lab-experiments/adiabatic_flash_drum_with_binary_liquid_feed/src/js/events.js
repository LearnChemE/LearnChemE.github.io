window.mousePressed = function() {
  const mX = mouseX / relativeSize();
  const mY = mouseY / relativeSize();
  const x = state.pump.x;
  const y = state.pump.y;
  if (mX > 16.5 + x - 7.5 && mX < 16.5 + x + 7.5 && mY > 16 + y - 5 && mY < 16 + y + 2.75) {
    state.pump.on = !state.pump.on;
  }
}

// window.mouseDragged = function() {

// }