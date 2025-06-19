import "bootstrap";
import "p5";
import "./style/style.scss";
import "./assets/digital-7.ttf";
import "./assets/chemical_equilibrium_in_the_haber_process.pdf";
import { drawAll } from "./js/draw";
import { handleInputs } from "./js/inputs";
import { calcAll, setDefaults } from "./js/calcs";

// GLOBAL VARIABLES OBJECT
window.state = {
  frameRate: 60,
  pixelDensity: 4,
  showButtons: false,
  hamburgerHasBeenClicked: window.localStorage.getItem("hamburgerHasBeenClicked") === "true",
  canvasSize: [150, 120],
  mouseDownFrame: 0,
  minFlowRate: 0,
  maxFlowRate: 100,
  popupOpen: false,
  minT: 273 + 250,
  maxT: 273 + 500,
  doCalc: false,
  hasAdjustedPressure: window.localStorage.getItem("hasAdjustedPressure") === "true",
  hasAdjustedTemperature: window.localStorage.getItem("hasAdjustedTemperature") === "true",
  zoom: 1, // Current zoom level
  zoomMin: 1, // Minimum zoom level
  zoomMax: 4, // Maximum zoom level
};

const containerElement = document.getElementById("p5-container");

window.preload = () => {
  state.meterFont = loadFont("assets/digital-7.ttf");
}

window.setup = function() {
  sizeContainer();
  createCanvas(containerElement.offsetWidth, containerElement.offsetHeight).parent(containerElement);
  setDefaults();
  handleInputs();
  calcAll();
  pixelDensity(state.pixelDensity);
  frameRate(state.frameRate);
};

window.draw = function() {
  window.width = state.canvasSize[0];
  window.height = state.canvasSize[1];
  window.mX = mouseX / relativeSize();
  window.mY = mouseY / relativeSize();

  // Apply zoom transformation
  push();
  translate(mouseX, mouseY);
  scale(state.zoom);
  translate(-mouseX, -mouseY);

  scale(relativeSize());
  background(255);
  drawAll();
  pop();
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

// Add mouseWheel handler
window.mouseWheel = function(event) {
  // Prevent default scrolling
  event.preventDefault();

  // Calculate zoom factor based on scroll direction
  const zoomFactor = event.deltaY > 0 ? 0.95 : 1.05;

  // Calculate new zoom level
  const newZoom = state.zoom * zoomFactor;

  // Clamp zoom level between min and max
  state.zoom = constrain(newZoom, state.zoomMin, state.zoomMax);

  return false;
};

require("./js/events.js");