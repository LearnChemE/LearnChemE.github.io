import "bootstrap";
import "p5";
import "./assets/digital-7.ttf";
import "./assets/evaporative_cooling_worksheet.pdf";
import calcAll from "./js/calcs";
import drawAll from "./js/draw";
import { initializeHamburger, initializeUnitsButton } from "./js/inputs";
import "./style/style.scss";

// TO DO:

// GLOBAL VARIABLES OBJECT
window.state = {
  showButtons: false,
  fanOn: false,
  fanCount: 0,
  waterOn: false,
  waterFlowCoordinate: 0,
  valvePosition: 0,
  valvePositionStart: 0,
  mousePositionStart: [0, 0],
  onKnob: false,
  switchOn: false,
  temperatureUnits: "C",
  airTemperature: 25,
  reservoirTemperature: 71,
  beakerTemperature: 80,
  apparatusTemperatureTop: 78,
  apparatusTemperatureBottom: 75,
};

const containerElement = document.getElementById("p5-container");

window.preload = () => {
  state.temperatureFont = loadFont("assets/digital-7.ttf");
}

window.setup = () => {
  createCanvas(containerElement.offsetWidth, containerElement.offsetHeight).parent(containerElement);
  initializeHamburger();
  initializeUnitsButton();
  frameRate(60);
}

window.draw = () => {
  scale(relativeSize());
  if (state.waterOn) {
    state.waterFlowCoordinate = constrain(state.waterFlowCoordinate + 1, 0, 1000);
  } else {
    state.waterFlowCoordinate = 0;
  }
  calcAll();
  drawAll();
}

window.windowResized = () => {
  resizeCanvas(containerElement.offsetWidth, containerElement.offsetHeight);
}

window.relativeSize = () => width / 150;