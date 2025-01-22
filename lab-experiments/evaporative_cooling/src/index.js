import "bootstrap";
import "p5";
import "./assets/evaporative_cooling_worksheet.pdf";
import calcAll from "./js/calcs";
import drawAll from "./js/draw";
import { initializeButtons, initializeHamburger } from "./js/inputs";
import "./style/style.scss";

// TO DO:

// GLOBAL VARIABLES OBJECT
window.state = {
  showButtons: false,
  fanOn: false,
  fanCount: 0,
  waterOn: false,
  waterLevel: 0,
};

const containerElement = document.getElementById("p5-container");

window.setup = () => {
  createCanvas(containerElement.offsetWidth, containerElement.offsetHeight).parent(containerElement);
  initializeHamburger();
  initializeButtons();
  frameRate(60);
}

window.draw = () => {
  scale(relativeSize());
  calcAll();
  drawAll();
}

window.windowResized = () => {
  resizeCanvas(containerElement.offsetWidth, containerElement.offsetHeight);
}

window.relativeSize = () => width / 150;