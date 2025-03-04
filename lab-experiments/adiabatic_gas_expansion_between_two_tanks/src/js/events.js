import { solve } from './calcs.js';

window.mousePressed = function() {
  const leftTank = state.leftTank;
  const rightTank = state.rightTank;
  const valve = state.valveLocation;
  const mX = mouseX / relativeSize();
  const mY = mouseY / relativeSize();
  const leftTankKnobCoords = leftTank.knobCoords;
  const rightTankKnobCoords = rightTank.knobCoords;
  const lkx = leftTankKnobCoords[0]; // left knob x
  const lky = leftTankKnobCoords[1]; // left knob y
  const lkw = leftTankKnobCoords[2]; // left knob width
  const lkh = leftTankKnobCoords[3]; // left knob height
  const rkx = rightTankKnobCoords[0];
  const rky = rightTankKnobCoords[1];
  const rkw = rightTankKnobCoords[2];
  const rkh = rightTankKnobCoords[3];
  const vkx = valve.x;
  const vky = valve.y;
  const vkw = valve.width;
  const vkh = valve.height;

  if (mX > lkx && mX < lkx + lkw && mY > lky && mY < lky + lkh) {
    document.getElementById("left-25").classList.add("disabled");
    document.getElementById("left-50").classList.add("disabled");
    document.getElementById("left-100").classList.add("disabled");
    document.getElementById("right-25").classList.add("disabled");
    document.getElementById("right-50").classList.add("disabled");
    document.getElementById("right-100").classList.add("disabled");
    if (leftTank.valveRotation === 0) {
      if (rightTank.valveRotation > 0 && state.valvePosition > 0) {
        solve();
      }
      const openInterval = setInterval(() => {
        if (leftTank.valveRotation === 1) {
          clearInterval(openInterval)
        } else {
          leftTank.valveRotation = min(1, leftTank.valveRotation + 0.005);
          leftTank.outletPressure = 0.05 * (leftTank.pressure - leftTank.outletPressure) + leftTank.outletPressure;
        }
      }, 1000 / state.frameRate);
    }
  }

  if (mX > rkx && mX < rkx + rkw && mY > rky && mY < rky + rkh) {
    document.getElementById("left-25").classList.add("disabled");
    document.getElementById("left-50").classList.add("disabled");
    document.getElementById("left-100").classList.add("disabled");
    document.getElementById("right-25").classList.add("disabled");
    document.getElementById("right-50").classList.add("disabled");
    document.getElementById("right-100").classList.add("disabled");
    if (rightTank.valveRotation === 0) {
      if (leftTank.valveRotation > 0 && state.valvePosition > 0) {
        solve();
      }
      const openInterval = setInterval(() => {
        if (rightTank.valveRotation === 1) {
          clearInterval(openInterval)
        } else {
          rightTank.valveRotation = min(1, rightTank.valveRotation + 0.005);
        }
      }, 1000 / state.frameRate);
    }
  }

  if (mX > vkx - vkw / 2 && mX < vkx + vkw / 2 && mY > vky - vkh && mY < vky + vkh) {
    document.getElementById("left-25").classList.add("disabled");
    document.getElementById("left-50").classList.add("disabled");
    document.getElementById("left-100").classList.add("disabled");
    document.getElementById("right-25").classList.add("disabled");
    document.getElementById("right-50").classList.add("disabled");
    document.getElementById("right-100").classList.add("disabled");
    if (state.valvePosition === 0) {
      if (leftTank.valveRotation > 0 && rightTank.valveRotation > 0) {
        solve();
      }
      const openInterval = setInterval(() => {
        if (state.valvePosition === 1) {
          clearInterval(openInterval)
        } else {
          state.valvePosition = min(1, state.valvePosition + 0.005);
          if (state.leftTank.valveRotation > 0) {
            state.rightTank.outletPressure = 0.05 * (state.leftTank.outletPressure - state.rightTank.outletPressure) + state.rightTank.outletPressure;
          }
        }
      }, 1000 / state.frameRate);
    }
  }
}