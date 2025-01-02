require("bootstrap");
require("./style/style.scss");
import calcAll from "./js/calcs.js";
import drawAll from "./js/draw.js";
import "./js/p5.min.js";

// TO DO:

// GLOBAL VARIABLES OBJECT
window.gvs = {
  include_friction: true,
  outer_diameter: 12.7, // mm
  inner_diameter: 4.06, // mm
  volumetric_flow_rate: 8.75 / 1e6, // m^3/s
  show_flow_rate: false,
  manometer_1_pressure: 100, // mmH2O
  manometer_2_pressure: 100, // mmH2O
  manometer_3_pressure: 100, // mmH2O
  manometer_4_pressure: 100, // mmH2O
  manometer_5_pressure: 100, // mmH2O
};

window.setup = function() {
  createCanvas(800, 530);
  noLoop();
  require("./js/inputs.js");
};

window.draw = function() {
  background(253);
  calcAll();
  drawAll();
};