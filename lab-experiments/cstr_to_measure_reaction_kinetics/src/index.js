import "bootstrap";
import "p5";
import "./style/style.scss";
import { setupCanvas, drawSimulation } from "./js/graphics";

// Global state object
window.state = {
  frameRate: 60,
  pixelDensity: 4,
  hamburgerHasBeenClicked: window.localStorage.getItem("hamburgerHasBeenClicked") === "true",
  canvasSize: [1400, 1000],
  scale: 1
};

const containerElement = document.getElementById("p5-container");

window.setup = function() {
  setupCanvas(containerElement);
  windowResized();
};

window.draw = function() {
  const width = state.canvasSize[0];
  const height = state.canvasSize[1];
  window.width = width;
  window.height = height;
  window.mX = mouseX / relativeSize();
  window.mY = mouseY / relativeSize();
  scale(relativeSize());
  console.log(relativeSize());
  drawSimulation(width, height);
};

window.windowResized = () => {
  const width = containerElement.offsetWidth;
  const height = containerElement.offsetHeight;
  resizeCanvas(width, height);
}

window.relativeSize = () => {
  return containerElement.offsetWidth / state.canvasSize[0];
}