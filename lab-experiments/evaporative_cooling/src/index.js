import "bootstrap";
import "p5";
import "./assets/digital-7.ttf";
import "./assets/evaporative_cooling_article.pdf";
import "./assets/evaporative_cooling_worksheet.pdf";
import calcAll from "./js/calcs";
import drawAll from "./js/draw";
import { initializeHamburger, initializeReset, initializeUnitsButton } from "./js/inputs";
import "./style/style.scss";

// TO DO:

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
};

const containerElement = document.getElementById("p5-container");

window.preload = () => {
  state.temperatureFont = loadFont("assets/digital-7.ttf");
}

window.setup = () => {
  createCanvas(containerElement.offsetWidth, containerElement.offsetHeight).parent(containerElement);
  initializeHamburger();
  initializeUnitsButton();
  initializeReset();
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