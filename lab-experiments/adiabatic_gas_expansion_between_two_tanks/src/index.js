import "bootstrap";
import "p5";
import "./style/style.scss";
import "./assets/adiabatic_gas_expansion_worksheet.pdf";
import { drawAll } from "./js/draw";
import { handleInputs, initializeHamburger } from "./js/inputs";
import { calcAll, setDefaults } from "./js/calcs";
// TO DO:

// GLOBAL VARIABLES OBJECT
window.state = {
  frameRate: 60,
  pixelDensity: 4,
  showButtons: false,
  hamburgerHasBeenClicked: window.sessionStorage.getItem("hamburgerHasBeenClicked") === "true",
};

const containerElement = document.getElementById("p5-container");

window.setup = function() {
  createCanvas(containerElement.offsetWidth, containerElement.offsetHeight).parent(containerElement);
  handleInputs();
  initializeHamburger();
  setDefaults();
  calcAll();
  pixelDensity(state.pixelDensity);
  frameRate(state.frameRate);
  drawAll();
};

window.draw = function() {
  window.width = 150;
  window.height = 100;
  scale(relativeSize());
  calcAll();
  drawAll();
};

window.windowResized = () => {
  resizeCanvas(containerElement.offsetWidth, containerElement.offsetHeight);
}

window.relativeSize = () => containerElement.offsetWidth / 150;