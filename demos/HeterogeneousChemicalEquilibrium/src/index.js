import "bootstrap";
import "p5";
import "./style/style.scss";
import { drawAll } from "./js/draw";
import { handleInputs } from "./js/inputs";
import { calcAll } from "./js/calcs";

window.state = {
  frameRate: 60,
  pixelDensity: 4,
  showButtons: false,
  hamburgerHasBeenClicked: window.localStorage.getItem("hamburgerHasBeenClicked") === "true",
  canvasSize: [150, 120],
  T: 1364, 
};

const containerElement = document.getElementById("p5-container");

window.setup = function () {
  sizeContainer();
  createCanvas(containerElement.offsetWidth, containerElement.offsetHeight).parent(containerElement);
  handleInputs();
  calcAll();
  pixelDensity(state.pixelDensity);
  frameRate(state.frameRate);

  // Slider value label updates only 
  const tempSlider = document.getElementById("tempSlider");
  const caco3Slider = document.getElementById("caco3Slider");
  const caoSlider = document.getElementById("caoSlider");
  const co2Slider = document.getElementById("co2Slider");

  tempSlider.addEventListener("input", () => {
    document.getElementById("tempValue").textContent = `${tempSlider.value} K`;
  });

  caco3Slider.addEventListener("input", () => {
    document.getElementById("caco3Value").textContent = (+caco3Slider.value).toFixed(2);
  });

  caoSlider.addEventListener("input", () => {
    document.getElementById("caoValue").textContent = (+caoSlider.value).toFixed(2);
  });

  co2Slider.addEventListener("input", () => {
    document.getElementById("co2Value").textContent = (+co2Slider.value).toFixed(2);
  });
};

window.draw = function () {
  window.width = state.canvasSize[0];
  window.height = state.canvasSize[1];
  scale(relativeSize());
  background(255);
  drawAll();  
};

window.windowResized = () => {
  resizeCanvas(containerElement.offsetWidth, containerElement.offsetHeight);
};

window.relativeSize = () => containerElement.offsetWidth / 150;

function sizeContainer() {
  containerElement.style.width = `calc(100vw - 10px)`;
  containerElement.style.maxWidth = `calc(calc(100vh - 10px) * ${state.canvasSize[0]} / ${state.canvasSize[1]})`;
  containerElement.style.height = `calc(calc(100vw - 10px) * ${state.canvasSize[1]} / ${state.canvasSize[0]})`;
  containerElement.style.maxHeight = `calc(100vh - 10px)`;
}

require("./js/events.js");
