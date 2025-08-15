import "bootstrap";
import "p5";
import "./style/style.scss";
import { drawAll} from "./js/draw";
import { handleInputs } from "./js/inputs";
import { calcAll, setDefaults } from "./js/calcs";

// GLOBAL VARIABLES OBJECT
window.state = {
  frameRate: 60,
  pixelDensity: 4,
  showButtons: false,
  mode: "compressor",
  hamburgerHasBeenClicked: window.localStorage.getItem("hamburgerHasBeenClicked") === "true",
  canvasSize: [150, 120],
};

const containerElement = document.getElementById("p5-container");

// Load kettle HTML layout and inject into container
fetch("kettleBoiler.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById('kettleBoiler').innerHTML = html;
    }
  )
  .catch(err => console.error("❌ Failed to load kettleBoiler.html", err));



window.setup = function () {
  //preload();
  sizeContainer();
  createCanvas(containerElement.offsetWidth, containerElement.offsetHeight).parent(containerElement);
  handleInputs();
  setDefaults();
  calcAll();
  pixelDensity(state.pixelDensity);
  frameRate(state.frameRate);
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
}

window.relativeSize = () => containerElement.offsetWidth / 150;

function sizeContainer() {
  containerElement.style.width = `calc(100vw - 10px)`;
  containerElement.style.maxWidth = `calc(calc(100vh - 10px) * ${state.canvasSize[0]} / ${state.canvasSize[1]})`;
  containerElement.style.height = `calc(calc(100vw - 10px) * ${state.canvasSize[1]} / ${state.canvasSize[0]})`;
  containerElement.style.maxHeight = `calc(100vh - 10px)`;
}



require("./js/events.js");