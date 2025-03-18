import "bootstrap";
import "p5";
import "./style/style.scss";
import "./assets/adiabatic_gas_expansion_between_two_tanks_worksheet.pdf";
import "./assets/gas_release.wav";
import "./assets/gas_transfer.wav";
import { drawAll } from "./js/draw";
import { handleInputs, initializeHamburger } from "./js/inputs";
import { calcAll, setDefaults } from "./js/calcs";
// TO DO:

// GLOBAL VARIABLES OBJECT
window.state = {
  frameRate: 60,
  pixelDensity: 4,
  showButtons: false,
  hamburgerHasBeenClicked: window.localStorage.getItem("hamburgerHasBeenClicked") === "true",
  sounds: window.localStorage.getItem("sounds") === "true" || window.localStorage.getItem("sounds") === null,
  isRetina: window.devicePixelRatio === 2,
  zoom: 1,
  zoomTarget: [0, 0],
};

const containerElement = document.getElementById("p5-container");

window.preload = function() {
  window.gasReleaseSound = new Audio("./assets/gas_release.wav");
  window.gasReleaseSound.loop = false;
  window.gasTransferSound = new Audio("./assets/gas_transfer.wav");
  window.gasTransferSound.loop = false;
}

window.setup = function() {
  if (state.sounds === false) {
    document.getElementById("sound-off").style.display = "none";
    document.getElementById("sound-on").style.display = "block";
    gasReleaseSound.volume = 0;
    gasTransferSound.volume = 0;
  }
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
  translate(state.zoomTarget[0], state.zoomTarget[1]);
  scale(state.zoom);
  background(255);
  calcAll();
  drawAll();
};

window.windowResized = () => {
  resizeCanvas(containerElement.offsetWidth, containerElement.offsetHeight);
}

window.relativeSize = () => containerElement.offsetWidth / 150;

require("./js/events.js");