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
    on: false,
  },
  heatExchanger: {
    valvePosition: 0,
    T: 100,
  },
  pressureController: {
    valvePosition: 0,
    P: 1,
  },
  liquidHeight: 1,
  vaporDensity: 0,
  xF: 0.5,
  liquidFlow: {
    timeCoordinate: -1,
    liquidHeight: 0,
  },
  mL: 0,
  mV: 0,
  mF: 0,
  massFlowRateUnits: "g/s",
  temperatureUnits: "C",
};

const containerElement = document.getElementById("p5-container");

window.preload = () => {
  state.meterFont = loadFont("assets/digital-7.ttf");
}

window.setup = function() {
  createCanvas(containerElement.offsetWidth, containerElement.offsetHeight).parent(containerElement);
  handleInputs();
  setDefaults();
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
  calcAll();
  drawAll();
};

window.windowResized = () => {
  resizeCanvas(containerElement.offsetWidth, containerElement.offsetHeight);
}

window.relativeSize = () => containerElement.offsetWidth / 150;

require("./js/events.js");