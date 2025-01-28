import "bootstrap";
import "p5";
import "./assets/evaporative_cooling_worksheet.pdf";
import calcAll from "./js/calcs";
import drawAll from "./js/draw";
import { initializeHamburger } from "./js/inputs";
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
};

const containerElement = document.getElementById("p5-container");

window.setup = () => {
  createCanvas(containerElement.offsetWidth, containerElement.offsetHeight).parent(containerElement);
  initializeHamburger();
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