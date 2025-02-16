import "bootstrap";
import "./assets/venturi_meter_virtual_lab_worksheet.pdf";
import addEvents from "./js/events.js";
import populate from "./js/populate.js";
import "./style/style.scss";

window.state = {
  switchOn: false,
  valveOpen: false,
  maxFlowRate: 13.5, // mL/s
  flowRate: 0, // mL/s
  beakerPtsPerFrame: 0,
  flowing: false,
  outer_diameter: 12.7, // venturi outer diameter (mm)
  inner_diameter: 4.06, // venturi inner diameter (mm)
  volumetric_flow_rate: 0, // volumetric flow rate (mL/s)
  manometer_1_pressure: 100, // mmH2O
  manometer_2_pressure: 100, // mmH2O
  manometer_3_pressure: 100, // mmH2O
  manometer_4_pressure: 100, // mmH2O
  manometer_5_pressure: 100, // mmH2O
  laminar: true,
  f: 0, // friction factor
  maxViewBox: [0, 0, 0, 0],
  viewBox: [0, 0, 0, 0],
  showButtons: false,
  initialized: false,
  resetting: false,
};

window.mousedown = false;

state.hamburgerHasBeenClicked =
  window.sessionStorage.getItem("hamburgerHasBeenClicked") === "true" ?
  true :
  false;

populate();
addEvents();