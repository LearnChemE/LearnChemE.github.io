import { solve } from './calcs.js';

window.mousePressed = function() {
  const leftTank = state.leftTank;
  const rightTank = state.rightTank;
  const valve = state.valveLocation;
  const mX = (-state.zoomTarget[0] + mouseX / relativeSize()) / state.zoom;
  const mY = (-state.zoomTarget[1] + mouseY / relativeSize()) / state.zoom;
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

  const leftClickBox = [
    lkx - lkw / 2, lky - lkh / 2,
    lkx + 3 * lkw / 2, lky + 3 * lkh
  ]
  if (mX > leftClickBox[0] && mX < leftClickBox[2] && mY > leftClickBox[1] && mY < leftClickBox[3]) {
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

  const rightClickBox = [
    rkx - rkw / 2, rky - rkh / 2,
    rkx + 3 * rkw / 2, rky + 2 * rkh
  ]
  if (mX > rightClickBox[0] && mX < rightClickBox[2] && mY > rightClickBox[1] && mY < rightClickBox[3]) {
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

  const valveClickBox = [
    vkx - vkw, vky - 2 * vkh,
    vkx + vkw, vky + vkh * 7
  ]
  if (mX > valveClickBox[0] && mX < valveClickBox[2] && mY > valveClickBox[1] && mY < valveClickBox[3]) {
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

window.mouseWheel = function(e) {
  e.preventDefault();
  const mX = mouseX / relativeSize();
  const mY = mouseY / relativeSize();
  if (e.deltaY < 0) {
    state.zoom *= 1.02;
    state.zoomTarget[0] = mX - (mX - state.zoomTarget[0]) * 1.02;
    state.zoomTarget[1] = mY - (mY - state.zoomTarget[1]) * 1.02;
  } else {
    state.zoom /= 1.02;
    state.zoom = Math.max(1, state.zoom); // Prevent zooming out too much
    state.zoomTarget[0] = mX - (mX - state.zoomTarget[0]) / 1.02;
    state.zoomTarget[1] = mY - (mY - state.zoomTarget[1]) / 1.02;
    state.zoomTarget[0] = constrain(state.zoomTarget[0], -150 * (state.zoom - 1), 0);
    state.zoomTarget[1] = constrain(state.zoomTarget[1], -150 * (state.zoom - 1), 0);
  }
}

window.mouseDragged = function() {
  state.zoomTarget[0] += (mouseX - pmouseX) / relativeSize();
  state.zoomTarget[1] += (mouseY - pmouseY) / relativeSize();
  state.zoomTarget[0] = constrain(state.zoomTarget[0], -150 * (state.zoom - 1), 0);
  state.zoomTarget[1] = constrain(state.zoomTarget[1], -150 * (state.zoom - 1), 0);
}