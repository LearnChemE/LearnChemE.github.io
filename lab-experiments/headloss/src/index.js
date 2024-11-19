import modal from "bootstrap";
import Graphic from "./assets/headloss.svg";
import "./assets/headloss_worksheet.docx";
import addEvents from "./js/events.js";
import populate from "./js/populate.js";
import "./style/style.scss";

window.state = {
  switchOn: false,
  valveOpen: false,
  maxFlowRate: 24, // mL/s
  flowRate: 0, // mL/s
  wasteBeakerFilling: false,
  flowing: false,
  r: 0.635 / 2, // tube radius (cm)
  v: 0, // velocity (cm/s)
  rho: 1, // density (g/cm^3)
  Re: 0, // Reynolds number
  laminar: true,
  f: 0, // friction factor
  maxViewBox: [0, 0, 0, 0],
  viewBox: [0, 0, 0, 0],
  showButtons: false,
  initialized: false,
  tilted: false,
  switchTilt: false,
  pinching: false,
};

state.hamburgerHasBeenClicked =
  window.sessionStorage.getItem("hamburgerHasBeenClicked") === "true"
    ? true
    : false;

populate(Graphic);
addEvents();
