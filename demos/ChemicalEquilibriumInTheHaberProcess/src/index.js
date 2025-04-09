import "bootstrap";
import "p5";
import "./style/style.scss";
import { drawAll } from "./js/draw";
import { handleInputs } from "./js/inputs";
import { calcAll } from "./js/calcs";
// TO DO:

// GLOBAL VARIABLES OBJECT
window.state = {
  frameRate: 60,
  pixelDensity: 4,
  showButtons: false,
  hamburgerHasBeenClicked: window.localStorage.getItem("hamburgerHasBeenClicked") === "true",
  P: 150,
  T: 600,
  inlet: {
    nN2: 0,
    nH2: 0,
    nNH3: 1,
  },
  outlet: {
    nN2: 0,
    nH2: 0,
    nNH3: 1,
  }
};

const containerElement = document.getElementById("p5-container");

window.setup = function() {
  createCanvas(containerElement.offsetWidth, containerElement.offsetHeight).parent(containerElement);
  handleInputs();
  calcAll();
  pixelDensity(state.pixelDensity);
  frameRate(state.frameRate);
  noLoop();
};

window.draw = function() {
  window.width = 150;
  window.height = 120;
  scale(relativeSize());
  background(255);
  drawAll();
};

window.windowResized = () => {
  resizeCanvas(containerElement.offsetWidth, containerElement.offsetHeight);
}

window.relativeSize = () => containerElement.offsetWidth / 150;