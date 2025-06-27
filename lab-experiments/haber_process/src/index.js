import "bootstrap";
import "p5";
import "./style/style.scss";
import "./assets/digital-7.ttf";
import "./assets/chemical_equilibrium_in_the_haber_process.pdf";
import { drawAll, Zoom } from "./js/draw";
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
  zoomMax: 6, // Maximum zoom level
  zoomX: 300,
  zoomY: 270,
  dragging: false,
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
  [window.mX, window.mY] = mouseCoordinate();
  // drag();

  push();
  Zoom();

  scale(relativeSize());
  background(255);
  drawAll();
  pop();

  // push();
  // fill('black');
  // noStroke();
  // textSize(10);
  // text(`x: ${window.mX.toFixed(1)}\ny: ${window.mY.toFixed(1)}`, 50, 20);
  // pop();
};

window.windowResized = () => {
  resizeCanvas(containerElement.offsetWidth, containerElement.offsetHeight);
}

window.relativeSize = () => containerElement.offsetWidth / 150;

export function mouseCoordinate() {
  // Declare variables
  var x = mouseX;
  var y = mouseY;
  const s  = state.zoom; // Will never be 0
  const tx = state.zoomX;
  const ty = state.zoomY;
  // Calculate inverse transform of zoom matrix
  x = x/s + tx/s * (s - 1);
  y = y/s + ty/s * (s - 1);
  return [x / relativeSize(), y / relativeSize()]
}

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
  var newZoom = state.zoom * zoomFactor;

  // Clamp zoom level between min and max
  newZoom = constrain(newZoom, state.zoomMin, state.zoomMax);

  if (newZoom !== state.zoomMin) {
    const dz = newZoom - state.zoom;
    const zdif = newZoom - state.zoomMin;
    const oldZoom = state.zoom - state.zoomMin;
    const zoomX = (oldZoom * state.zoomX + mouseX * dz) / zdif;
    const zoomY = (oldZoom * state.zoomY + mouseY * dz) / zdif;

    state.zoomX = constrain(zoomX, 0, containerElement.offsetWidth);
    state.zoomY = constrain(zoomY, 0, containerElement.offsetHeight);
  }
  else {
    state.zoomX = 300;
    state.zoomY = 270;
  }

  state.zoom = newZoom;

  return false;
};

require("./js/events.js");