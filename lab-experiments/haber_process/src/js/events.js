window.mousePressed = function() {
  const mass_flow_rate_left_button_x = [62, 64.5];
  const mass_flow_rate_right_button_x = [65, 67.5];
  const h2_mass_flow_rate_button_y = [7.9, 9.2];
  const n2_mass_flow_rate_button_y = [17.9, 19.2];
  const nh3_mass_flow_rate_button_y = [27.9, 29.2];
  if (mX < mass_flow_rate_left_button_x[1] && mX > mass_flow_rate_left_button_x[0]) {
    if (mY < h2_mass_flow_rate_button_y[1] && mY > h2_mass_flow_rate_button_y[0] && state.tanks.h2.valvePosition === 1) {
      state.tanks.h2.m = max(state.minFlowRate, state.tanks.h2.m - 1);
    } else if (mY < n2_mass_flow_rate_button_y[1] && mY > n2_mass_flow_rate_button_y[0] && state.tanks.n2.valvePosition === 1) {
      state.tanks.n2.m = max(state.minFlowRate, state.tanks.n2.m - 1);
    } else if (mY < nh3_mass_flow_rate_button_y[1] && mY > nh3_mass_flow_rate_button_y[0] && state.tanks.nh3.valvePosition === 1) {
      state.tanks.nh3.m = max(state.minFlowRate, state.tanks.nh3.m - 1);
    }
    state.mouseDownFrame = frameCount;
  }
  if (mX < mass_flow_rate_right_button_x[1] && mX > mass_flow_rate_right_button_x[0]) {
    if (mY < h2_mass_flow_rate_button_y[1] && mY > h2_mass_flow_rate_button_y[0] && state.tanks.h2.valvePosition === 1) {
      state.tanks.h2.m = min(state.maxFlowRate, state.tanks.h2.m + 1);
    } else if (mY < n2_mass_flow_rate_button_y[1] && mY > n2_mass_flow_rate_button_y[0] && state.tanks.n2.valvePosition === 1) {
      state.tanks.n2.m = min(state.maxFlowRate, state.tanks.n2.m + 1);
    } else if (mY < nh3_mass_flow_rate_button_y[1] && mY > nh3_mass_flow_rate_button_y[0] && state.tanks.nh3.valvePosition === 1) {
      state.tanks.nh3.m = min(state.maxFlowRate, state.tanks.nh3.m + 1);
    }
    state.mouseDownFrame = frameCount;
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
}

// window.mouseDragged = function() {
//   const mX = mouseX / relativeSize();
//   const mY = mouseY / relativeSize();
// }