import "bootstrap";
import "p5";
import "./style/style.scss";
import "./assets/digital-7.ttf";
import "./assets/ranque_hilsch_vortex_tube_worksheet.pdf";
import { importSVG } from "./js/svg";
import { handleInputs } from "./js/inputs";
import { calcAll } from "./js/calcs";

// GLOBAL VARIABLES OBJECT
window.state = {
  frameRate: 60,
  pixelDensity: 4,
  showButtons: false,
  hamburgerHasBeenClicked: window.localStorage.getItem("hamburgerHasBeenClicked") === "true",
  canvasSize: [320, 240],
  inletPressure: 1,
  outletPressure: 1,
  hotSideTemperature: 22,
  hotSideDisplayedTemperature: 22,
  coldSideTemperature: 22,
  coldSideDisplayedTemperature: 22,
  inletVolumetricFlowRate: 0,
  outletVolumetricFlowRate: 0,
  vortexPortPosition: 0.5,
  maxP: 6.89,
  fractionInColdStream: 0.2,
};

const containerElement = document.getElementById("p5-container");

window.setup = function() {
  sizeContainer();
  importSVG();
  window.drawAll = require("./js/draw");
  createCanvas(containerElement.offsetWidth, containerElement.offsetHeight).parent(containerElement);
  handleInputs();
  calcAll();
  pixelDensity(state.pixelDensity);
  frameRate(state.frameRate);
};

window.draw = function() {
  window.width = state.canvasSize[0];
  window.height = state.canvasSize[1];
  scale(relativeSize());
  background(255);
  drawAll();
};

window.windowResized = () => {
  resizeCanvas(containerElement.offsetWidth, containerElement.offsetHeight);
}

window.relativeSize = () => containerElement.offsetWidth / 150;

function sizeContainer() {
  containerElement.style.width = `calc(100vw - 10px)`;
  containerElement.style.maxWidth = `calc(calc(100vh - 10px) * ${state.canvasSize[0]} / ${state.canvasSize[1]})`;
  containerElement.style.height = `calc(calc(100vw - 10px) * ${state.canvasSize[1]} / ${state.canvasSize[0]})`;
  containerElement.style.maxHeight = `calc(100vh - 10px)`;
}

require("./js/events.js");