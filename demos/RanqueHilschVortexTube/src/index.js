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
const wrapperElement = document.getElementById("p5-outer");

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
  // console.log('to ' + millis())
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
  const w = window.innerWidth * .9;
  const h = window.innerHeight * .8;
  const asp = 3/2;
  const dim = Math.min(w / asp, h);

  containerElement.style.width = `${dim * asp}px`;
  containerElement.style.height = `${dim}px`;
  wrapperElement.style.width = `${dim * asp}px`;
  wrapperElement.style.height = `${dim}px`;
  
  wrapperElement.style.fontSize = `${dim / 500}rem`;
}

require("./js/events.js");