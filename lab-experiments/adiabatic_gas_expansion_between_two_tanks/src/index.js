import "bootstrap";
import "./style/style.scss";
import "./assets/adiabatic_gas_expansion_between_two_tanks_worksheet.pdf";
import "./assets/gas_release.wav";
import "./assets/gas_transfer.wav";
import { drawAll } from "./js/draw";
import { handleInputs, initializeHamburger } from "./js/inputs";
import { calcAll, setDefaults } from "./js/calcs";

window.p5 = require("p5");
require("p5/lib/addons/p5.sound");
// TO DO:

// GLOBAL VARIABLES OBJECT
window.state = {
  frameRate: 60,
  pixelDensity: 8,
  showButtons: false,
  hamburgerHasBeenClicked: window.localStorage.getItem("hamburgerHasBeenClicked") === "true",
  sounds: window.localStorage.getItem("sounds") === "true" || window.localStorage.getItem("sounds") === null,
};

const containerElement = document.getElementById("p5-container");

window.preload = function() {
  window.gasReleaseSound = loadSound("./assets/gas_release.wav");
  window.gasTransferSound = loadSound("./assets/gas_transfer.wav");
}

window.setup = function() {
  createCanvas(containerElement.offsetWidth, containerElement.offsetHeight).parent(containerElement);
  handleInputs();
  initializeHamburger();
  setDefaults();
  calcAll();
  pixelDensity(state.pixelDensity);
  frameRate(state.frameRate);
};

window.draw = function() {
  window.width = 150;
  window.height = 100;
  scale(relativeSize());
  background(255);
  calcAll();
  drawAll();
};

window.windowResized = () => {
  resizeCanvas(containerElement.offsetWidth, containerElement.offsetHeight);
}

window.relativeSize = () => containerElement.offsetWidth / 150;

require("./js/events.js");