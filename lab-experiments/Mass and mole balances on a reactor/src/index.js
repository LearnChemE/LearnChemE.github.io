import "bootstrap";
import "p5";
import "./style/style.scss";
import { drawAll } from "./js/draw";
import { handleInputs } from "./js/inputs";
import { calcAll, setDefaults } from "./js/calcs";
import { toggleReactorHeater } from "./js/reactor"; // ✅ Add this import

// ✅ Declare global variables properly
window.tempSlider = null;
window.tempValueSpan = null;
window.reactorTemp = 200;
window.targetTemp = 200;
window.reactorHeaterOn = false;

// GLOBAL VARIABLES OBJECT
window.state = {
  frameRate: 60,
  pixelDensity: 4,
  showButtons: false,
  hamburgerHasBeenClicked: window.localStorage.getItem("hamburgerHasBeenClicked") === "true",
  canvasSize: [150, 120],
};

const containerElement = document.getElementById("p5-container");

window.setup = function () {
  sizeContainer();
  createCanvas(containerElement.offsetWidth, containerElement.offsetHeight).parent(containerElement);
  handleInputs();
  setDefaults();
  calcAll();
  pixelDensity(state.pixelDensity);
  frameRate(state.frameRate);

  // ✅ Initialize slider references
  window.tempSlider = document.getElementById("tempSlider");
  window.tempValueSpan = document.getElementById("tempValue");

  if (window.tempSlider && window.tempValueSpan) {
    window.tempSlider.addEventListener("input", () => {
      window.tempValueSpan.textContent = `${window.tempSlider.value}°C`;
    });
  }
};

window.draw = function () {
  window.width = state.canvasSize[0];
  window.height = state.canvasSize[1];
  scale(relativeSize());
  background(255);

  // ✅ FIXED: Properly update target temperature
  if (window.reactorHeaterOn && window.tempSlider) {
    window.targetTemp = parseInt(window.tempSlider.value);
    console.log("Heater ON - Slider value:", window.tempSlider.value, "Target:", window.targetTemp); // Debug
  } else {
    window.targetTemp = 200;
    console.log("Heater OFF - Target reset to 200"); // Debug
  }

  // ✅ FIXED: Update the actual temperature and store it back
  window.reactorTemp = lerp(window.reactorTemp, window.targetTemp, 0.05);
  
  
 

  drawAll(window.reactorTemp);
};

// ✅ Add mouse click handler
window.mousePressed = function() {
  let mx = mouseX / relativeSize();
  let my = mouseY / relativeSize();
  
  toggleReactorHeater(mx, my);
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