import "bootstrap";
import "p5";
import "./style/style.scss";
import "./assets/digital-7.ttf";
import "./assets/adiabatic_flash_drum_with_binary_liquid_feed_worksheet.pdf";
import { drawAll } from "./js/draw";
import { handleInputs } from "./js/inputs";
import { calcAll, setDefaults } from "./js/calcs";
// TO DO:

// GLOBAL VARIABLES OBJECT
window.state = {
  frameRate: 60,
  pixelDensity: 4,
  showButtons: false,
  hamburgerHasBeenClicked: window.localStorage.getItem("hamburgerHasBeenClicked") === "true",
  pump: {
    x: 32,
    y: 70,
    scaleX: 0.8,
    scaleY: 0.8,
  },
  gc: {
    x: 51,
    y: 40,
    scale: 0.7,
    takingSample: false,
    takingSampleFrame: 0,
    takingSampleTime: 0,
  },
  heatExchanger: {
    T: 22,
    T_current: 500,
    Tmin: 22,
    Tmax: 450
  },
  pressureController: {
    P: 1,
    P_current: 1,
    Pmin: 1,
    Pmax: 2
  },
  column: {
    T: 22,
    T_current: 22,
    units: "C"
  },
  liquidOutlet: {
    units: "kg/min"
  },
  inlet: {
    units: "kg/min"
  },
  xF: 0.5,
  temperatureUnits: "C",
  pressureUnits: "bar"
};

const containerElement = document.getElementById("p5-container");

window.preload = () => {
  state.meterFont = loadFont("assets/digital-7.ttf");
}

window.setup = function() {
  createCanvas(containerElement.offsetWidth, containerElement.offsetHeight).parent(containerElement);
  handleInputs();
  setDefaults();
  window.mixture = [state.chemicals.chemical1, state.chemicals.chemical2];
  calcAll();
  pixelDensity(state.pixelDensity);
  frameRate(state.frameRate);
};

window.draw = function() {
  window.width = 150;
  window.height = 100;
  scale(relativeSize());
  translate(0, 15);
  background(255);
  drawAll();
};

window.windowResized = () => {
  resizeCanvas(containerElement.offsetWidth, containerElement.offsetHeight);
}

window.relativeSize = () => containerElement.offsetWidth / 150;

require("./js/events.js");