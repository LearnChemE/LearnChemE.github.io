import "bootstrap";
import "p5";
import "./style/style.scss";
import { drawAll } from "./js/draw";
import { handleInputs } from "./js/inputs";
import { calcAll } from "./js/calcs";

// GLOBAL VARIABLES OBJECT
window.state = {
  frameRate: 60,
  pixelDensity: 4,
  showButtons: false,
  hamburgerHasBeenClicked: window.localStorage.getItem("hamburgerHasBeenClicked") === "true",
  canvasSize: [300, 200],
  P: Number(document.getElementById("feed-pressure-slider").value), // bar
  z: Number(document.getElementById("fraction-feed-slider").value), // fraction of feed in cold stream
};

const containerElement = document.getElementById("p5-container");

window.setup = function () {
  sizeContainer();
  createCanvas(containerElement.offsetWidth, containerElement.offsetHeight - 10).parent(containerElement);
  textFont('Arial, sans‐serif');

  handleInputs();
  if (window.MathJax) MathJax.typesetPromise();
  calcAll();
  pixelDensity(state.pixelDensity);
  frameRate(state.frameRate);
};

window.draw = function () {
  scale(1);
  background(255);
  push();
  drawAll();
  pop();
  console.log('to ' + millis())
};

window.windowResized = () => {
  sizeContainer(); // recalculate container size
  resizeCanvas(
    containerElement.offsetWidth,
    containerElement.offsetHeight - 10
  );

}

window.relativeSize = () => containerElement.offsetWidth / state.canvasSize[0];

function sizeContainer() {
  containerElement.style.width = `90vw`;
  containerElement.style.maxWidth = `calc(calc(100vh - 10px) * ${state.canvasSize[0]} / ${state.canvasSize[1]})`;
  //containerElement.style.height = `calc(calc(100vw - 10px) * ${state.canvasSize[1]} / ${state.canvasSize[0]})`;
  containerElement.style.height = `80vh`;
  containerElement.style.maxHeight = `calc(100vh - 10px)`;
}

require("./js/events.js");