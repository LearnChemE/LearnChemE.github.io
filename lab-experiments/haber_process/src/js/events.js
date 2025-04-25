window.mousePressed = function() {
  const mass_flow_rate_left_button_x = [62, 64.5];
  const mass_flow_rate_right_button_x = [65, 67.5];
  const h2_mass_flow_rate_button_y = [7.9, 9.2];
  const n2_mass_flow_rate_button_y = [17.9, 19.2];
  const nh3_mass_flow_rate_button_y = [27.9, 29.2];
  const T_controller_coords = [
    [60, 62.5],
    [64, 66.5],
    [102.5, 105]
  ];
  state.mouseDownFrame = frameCount;

  if (mX < mass_flow_rate_left_button_x[1] && mX > mass_flow_rate_left_button_x[0]) {
    if (mY < h2_mass_flow_rate_button_y[1] && mY > h2_mass_flow_rate_button_y[0]) {
      state.tanks.h2.mSetPoint = max(state.minFlowRate, state.tanks.h2.mSetPoint - 1);
      state.tanks.h2.mFrame = frameCount;
    } else if (mY < n2_mass_flow_rate_button_y[1] && mY > n2_mass_flow_rate_button_y[0]) {
      state.tanks.n2.mSetPoint = max(state.minFlowRate, state.tanks.n2.mSetPoint - 1);
      state.tanks.n2.mFrame = frameCount;
    } else if (mY < nh3_mass_flow_rate_button_y[1] && mY > nh3_mass_flow_rate_button_y[0]) {
      state.tanks.nh3.mSetPoint = max(state.minFlowRate, state.tanks.nh3.mSetPoint - 1);
      state.tanks.nh3.mFrame = frameCount;
    }
  }
  if (mX < mass_flow_rate_right_button_x[1] && mX > mass_flow_rate_right_button_x[0]) {
    if (mY < h2_mass_flow_rate_button_y[1] && mY > h2_mass_flow_rate_button_y[0]) {
      state.tanks.h2.mSetPoint = min(state.maxFlowRate, state.tanks.h2.mSetPoint + 1);
      state.tanks.h2.mFrame = frameCount;
    } else if (mY < n2_mass_flow_rate_button_y[1] && mY > n2_mass_flow_rate_button_y[0]) {
      state.tanks.n2.mSetPoint = min(state.maxFlowRate, state.tanks.n2.mSetPoint + 1);
      state.tanks.n2.mFrame = frameCount;
    } else if (mY < nh3_mass_flow_rate_button_y[1] && mY > nh3_mass_flow_rate_button_y[0]) {
      state.tanks.nh3.mSetPoint = min(state.maxFlowRate, state.tanks.nh3.mSetPoint + 1);
      state.tanks.nh3.mFrame = frameCount;
    }
  }

  if (T_controller_coords[0][0] < mX && mX < T_controller_coords[0][1] && T_controller_coords[2][0] < mY && mY < T_controller_coords[2][1]) {
    state.T = max(state.minT, state.T - 1);
  }

  if (T_controller_coords[1][0] < mX && mX < T_controller_coords[1][1] && T_controller_coords[2][0] < mY && mY < T_controller_coords[2][1]) {
    state.T = min(state.maxT, state.T + 1);
  }

  const h2_tank_knob_x = [8, 13.5];
  const n2_tank_knob_x = [25, 30.5];
  const nh3_tank_knob_x = [42, 47.5];
  const knob_tank_y = [48, 51];

  if (mX < h2_tank_knob_x[1] && mX > h2_tank_knob_x[0] && mY < knob_tank_y[1] && mY > knob_tank_y[0]) {
    if (state.tanks.h2.valvePosition === 0) {
      state.tanks.h2.isTurningOn = true;
    }
    if (state.tanks.h2.valvePosition === 1) {
      state.tanks.h2.isTurningOff = true;
    }
  }
  if (mX < n2_tank_knob_x[1] && mX > n2_tank_knob_x[0] && mY < knob_tank_y[1] && mY > knob_tank_y[0]) {
    if (state.tanks.n2.valvePosition === 0) {
      state.tanks.n2.isTurningOn = true;
    }
    if (state.tanks.n2.valvePosition === 1) {
      state.tanks.n2.isTurningOff = true;
    }
  }
  if (mX < nh3_tank_knob_x[1] && mX > nh3_tank_knob_x[0] && mY < knob_tank_y[1] && mY > knob_tank_y[0]) {
    if (state.tanks.nh3.valvePosition === 0) {
      state.tanks.nh3.isTurningOn = true;
    }
    if (state.tanks.nh3.valvePosition === 1) {
      state.tanks.nh3.isTurningOff = true;
    }
  }

  handlePressures();
  handlePurge();
}

function handlePurge() {
  const knob_coords = [
    [89.5, 94.5],
    [75.5, 80.5]
  ];

  const clicked_on_valve = mX > knob_coords[0][0] && mX < knob_coords[0][1] && mY > knob_coords[1][0] && mY < knob_coords[1][1];

  if (clicked_on_valve) {
    state.purging = !state.purging;
  }
}

function handlePressures() {
  const coords = [
    [14.5, 25],
    [31.5, 42],
    [48.5, 59],
    [45.5, 56.5]
  ];

  const clicked_on_h2 = mX > coords[0][0] && mX < coords[0][1] && mY > coords[3][0] && mY < coords[3][1];
  const clicked_on_n2 = mX > coords[1][0] && mX < coords[1][1] && mY > coords[3][0] && mY < coords[3][1];
  const clicked_on_nh3 = mX > coords[2][0] && mX < coords[2][1] && mY > coords[3][0] && mY < coords[3][1];

  if (clicked_on_h2) {
    state.popupOpen = true;
    document.getElementById("h2-pressure").style.display = "grid";
    document.getElementById("n2-pressure").style.display = "none";
    document.getElementById("nh3-pressure").style.display = "none";
  }
  if (clicked_on_n2) {
    state.popupOpen = true;
    document.getElementById("h2-pressure").style.display = "none";
    document.getElementById("n2-pressure").style.display = "grid";
    document.getElementById("nh3-pressure").style.display = "none";
  }
  if (clicked_on_nh3) {
    state.popupOpen = true;
    document.getElementById("h2-pressure").style.display = "none";
    document.getElementById("n2-pressure").style.display = "none";
    document.getElementById("nh3-pressure").style.display = "grid";
  }
}

// window.mouseDragged = function() {
//   const mX = mouseX / relativeSize();
//   const mY = mouseY / relativeSize();
// }