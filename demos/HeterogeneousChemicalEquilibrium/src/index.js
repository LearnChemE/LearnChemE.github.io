import "bootstrap";
import "p5";
import "./style/style.scss";
import { drawAll, setupSliders, sliderTemp, tempValue, slidercO2, 
  slidercaCO3, slidercaO, caCO3Value, caOValue, cO2Value  } from "./js/draw";

import { handleInputs } from "./js/inputs";
import { calcAll } from "./js/calcs";

// GLOBAL VARIABLES OBJECT
window.state = {
  frameRate: 60,
  pixelDensity: 4,
  showButtons: false,
  hamburgerHasBeenClicked: window.localStorage.getItem("hamburgerHasBeenClicked") === "true",
  canvasSize: [150, 120],
  // T: Number(document.getElementById("temperature-slider").value),
  T: 1000,
  CaCO3: 0.5,
  CaO: 0.5,
  CO2: 0.5
};

const containerElement = document.getElementById("p5-container");

window.setup = function () {
  sizeContainer();
  createCanvas(containerElement.offsetWidth, containerElement.offsetHeight).parent(containerElement);
  setupSliders();  // <- this is required!
  handleInputs();
  calcAll();
  pixelDensity(state.pixelDensity);
  frameRate(state.frameRate);
};

window.draw = function () {
  window.width = state.canvasSize[0];
  window.height = state.canvasSize[1];
  scale(relativeSize());
  background(255);

  if (sliderTemp) {
    window.state.T = sliderTemp.value();
    console.log("Slider value:", window.state.T);
  }

  if (tempValue) {
    tempValue.html(`${window.state.T} K`);
    if (slidercaCO3) {
      window.state.caCO3 = slidercaCO3.value();
      caCO3Value.html(window.state.caCO3.toFixed(2));
    }
    
    if (slidercaO) {
      window.state.caO = slidercaO.value();
      caOValue.html(window.state.caO.toFixed(2));
    }
    
    if (slidercO2) {
      window.state.cO2 = slidercO2.value();
      cO2Value.html(window.state.cO2.toFixed(2));
    }
    
  }
  

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