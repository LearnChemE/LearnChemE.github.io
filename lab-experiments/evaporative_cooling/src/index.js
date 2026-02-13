import "bootstrap";
import "p5";
import "./assets/digital-7.ttf";
import "./assets/evaporative_cooling_article.pdf";
import "./assets/evaporative_cooling_worksheet.pdf";
import calcAll, { randomizeStartingTemps } from "./js/calcs";
import drawAll from "./js/draw";
import { initializeHamburger, initializeReset, initializeUnitsButton } from "./js/inputs";
import "./style/style.scss";

const containerElement = document.getElementById("p5-container");

// GLOBAL VARIABLES OBJECT
window.state = {
  showButtons: false,
  hamburgerHasBeenClicked: window.sessionStorage.getItem("hamburgerHasBeenClicked") === "true",
  fanOn: false,
  fanCount: 0,
  waterOn: false,
  flowState: new Array(16).fill(0),
  beakerWaterLevel: 1000,
  valvePosition: 1,
  valvePositionStart: 0,
  mousePositionStart: [0, 0],
  onKnob: false,
  pumpOn: false,
  temperatureUnits: "C",
  airInletTemperature: 22,
  waterOutletTemperature: 22,
  beakerTemperature: 52,
  apparatusTemperatureTop: 22,
  apparatusTargetTemperatureTop: 22,
  airOutletTemperature: 22,
  airOutletTargetTemperature: 22,
  outletHumidity: 0.005,
  outletTargetHumidity: 0.005,
  ambientHumidity: 0.005,
  waterOnMesh: false,
  waterInReservoir: false,
  reservoirVolume: 0,
  beakerTemperatureArray: [],
  waterOutletTemperatureArray: [],
  airOutletTemperatureArray: [],
  timeIndex: 0,

  zoom: 1, // Current zoom level
  zoomMin: 1, // Minimum zoom level
  zoomMax: 6, // Maximum zoom level
  zoomX: containerElement.offsetWidth / 2,
  zoomY: containerElement.offsetHeight / 2,
  dragging: false,
};


window.preload = () => {
  state.temperatureFont = loadFont("assets/digital-7.ttf");
}

window.setup = () => {
  createCanvas(containerElement.offsetWidth, containerElement.offsetHeight).parent(containerElement);
  initializeHamburger();
  initializeUnitsButton();
  initializeReset();
  frameRate(60);
  randomizeStartingTemps();
}

window.draw = () => {
  [window.mX, window.mY] = mouseCoordinate();
  Zoom();
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
    state.zoomX = containerElement.offsetWidth / 2;
    state.zoomY = containerElement.offsetHeight / 2;
  }

  state.zoom = newZoom;

  return false;
};


// Add drag event
var offsetX = 0;
var offsetY = 0;
window.mouseReleased = () => {
  state.dragging = false;
}

export function beginDrag() {
  state.dragging = true;
  offsetX = mouseX;
  offsetY = mouseY;
}

window.mouseDragged = function() {
  if (!state.dragging) return;
  // For bounds
  const containerElement = document.getElementById("p5-container");
  // Subtract the difference from the offset vector times the zoom for tracking
  state.zoomX -= (mouseX - offsetX) / state.zoom;
  state.zoomY -= (mouseY - offsetY) / state.zoom;
  // Constrain so the apparatus doesn't go offscreen
  state.zoomX = constrain(state.zoomX, 0, containerElement.offsetWidth);
  state.zoomY = constrain(state.zoomY, 0, containerElement.offsetHeight);

  // Update the offset vector for the next mouseDragged event
  offsetX = mouseX;
  offsetY = mouseY;
  // Update mX and mY, because changing the zoom coordinates will change these
  [mX, mY] = mouseCoordinate();
}

export function Zoom() {
  // Calculate and apply matrix
  const s  = state.zoom;
  const zx = -state.zoomX * (s - 1);
  const zy = -state.zoomY * (s - 1);
  applyMatrix(s,0 , 0,s , zx,zy);
}