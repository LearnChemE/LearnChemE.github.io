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
  canvasSize: [650, 220],

};

const containerElement = document.getElementById("drawing-area");
window.addEventListener('resize', () => {
  drawAll(document.getElementById('drawing-area'));
  console.log('current mode:')
});

window.setup = function () {
  sizeContainer();
  createCanvas(containerElement.offsetWidth, containerElement.offsetHeight).parent(containerElement);
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
  calcAll();
  drawAll(containerElement);
};

window.windowResized = () => {
  resizeCanvas(containerElement.offsetWidth, containerElement.offsetHeight);
}

window.relativeSize = () => containerElement.offsetWidth / state.canvasSize[0];

function sizeContainer() {
  containerElement.style.width = `calc(100vw - 10px)`;
  containerElement.style.maxWidth = `calc(calc(100vh - 10px) * ${state.canvasSize[0]} / ${state.canvasSize[1]})`;
  containerElement.style.height = `calc(calc(100vw - 10px) * ${state.canvasSize[1]} / ${state.canvasSize[0]})`;
  containerElement.style.maxHeight = `calc(100vh - 10px)`;
}

window.addEventListener('DOMContentLoaded', () => {
  const modeButtons = document.querySelectorAll('.button-group button');
  modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // 1) Compute the new mode
      window.graphMode = btn.id.replace('Btn', '');
      // 2) Toggle active classes
      modeButtons.forEach(b => b.classList.toggle('active', b === btn));
      // 3) Redraw

      drawAll();
    });
  });

  window.addEventListener('DOMContentLoaded', () => {
    const volumeSlider = document.getElementById('volumeFraction');
    const timeSlider = document.getElementById('timeSprayed');

    // 1) Initial draw
    drawAll();

    // 2) Redraw on slider moves
    volumeSlider.addEventListener('input', () => {
      console.log('volumeFraction changed');
      drawAll();
    });
    timeSlider.addEventListener('input', () => {
      console.log('timeSprayed changed');
      drawAll();
    });
  });
});

require("./js/events.js");
