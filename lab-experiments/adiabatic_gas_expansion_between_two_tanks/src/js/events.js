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
  const equilibrated = abs(state.leftTank.pressure - state.rightTank.pressure) < 4e4;

  if (mX > lkx - lkw / 2 && mX < lkx + 3 * lkw / 2 && mY > lky - lkh / 2 && mY < lky + 2 * lkh) {
    disableInputs();
    if (leftTank.valveRotation === 0 && !equilibrated) {
      state.leftTank.open = true;
      if (rightTank.valveRotation > 0 && state.valvePosition > 0) {
        solve();
        gasTransferSound.currentTime = 0;
        gasTransferSound.play();
      } else {
        gasReleaseSound.currentTime = 0;
        gasReleaseSound.play();
      }
      const openInterval = setInterval(() => {
        if (leftTank.valveRotation === 1) {
          clearInterval(openInterval)
        } else {
          leftTank.valveRotation = min(1, leftTank.valveRotation + 0.005);
        }
      }, 1000 / state.frameRate);
    } else if (leftTank.valveRotation === 1 && equilibrated) {
      state.leftTank.open = false;
      const closeInterval = setInterval(() => {
        if (leftTank.valveRotation === 0) {
          clearInterval(closeInterval)
        } else {
          leftTank.valveRotation = max(0, leftTank.valveRotation - 0.005);
        }
      }, 1000 / state.frameRate);
    }
  }

  if (mX > rkx - rkw / 2 && mX < rkx + 3 * rkw / 2 && mY > rky - rkh / 2 && mY < rky + 2 * rkh) {
    disableInputs();
    if (rightTank.valveRotation === 0 && !equilibrated) {
      state.rightTank.open = true;
      if (leftTank.valveRotation > 0 && state.valvePosition > 0) {
        solve();
        gasTransferSound.currentTime = 0;
        gasTransferSound.play();
      }
      const openInterval = setInterval(() => {
        if (rightTank.valveRotation === 1) {
          clearInterval(openInterval)
        } else {
          rightTank.valveRotation = min(1, rightTank.valveRotation + 0.005);
        }
      }, 1000 / state.frameRate);
    } else if (rightTank.valveRotation === 1 && equilibrated) {
      state.rightTank.open = false;
      const closeInterval = setInterval(() => {
        if (rightTank.valveRotation === 0) {
          clearInterval(closeInterval)
        } else {
          rightTank.valveRotation = max(0, rightTank.valveRotation - 0.005);
        }
      }, 1000 / state.frameRate);
    }
  }

  if (mX > vkx - vkw / 1.5 && mX < vkx + vkw / 1.5 && mY > vky - vkh && mY < vky + vkh * 2) {
    disableInputs();
    if (state.valvePosition === 0 && !equilibrated) {
      state.valveOpen = true;
      if (leftTank.valveRotation > 0 && rightTank.valveRotation > 0) {
        solve();
        gasTransferSound.curentTime = 0;
        gasTransferSound.play();
      } else if (leftTank.valveRotation > 0) {
        gasReleaseSound.currentTime = 0;
        gasReleaseSound.play();
      }
      const openInterval = setInterval(() => {
        if (state.valvePosition === 1) {
          clearInterval(openInterval)
        } else {
          state.valvePosition = min(1, state.valvePosition + 0.005);
        }
      }, 1000 / state.frameRate);
    } else if (state.valvePosition === 1 && equilibrated) {
      state.valveOpen = false;
      const closeInterval = setInterval(() => {
        if (state.valvePosition === 0) {
          clearInterval(closeInterval)
        } else {
          state.valvePosition = max(0, state.valvePosition - 0.005);
        }
      }, 1000 / state.frameRate);
    }
  }
}

function disableInputs() {
  document.getElementById("left-25").classList.add("disabled");
  document.getElementById("left-50").classList.add("disabled");
  document.getElementById("left-100").classList.add("disabled");
  document.getElementById("right-25").classList.add("disabled");
  document.getElementById("right-50").classList.add("disabled");
  document.getElementById("right-100").classList.add("disabled");
  document.getElementById("pressure-slider").classList.add("disabled");
  document.getElementById("temperature-slider").classList.add("disabled");
}