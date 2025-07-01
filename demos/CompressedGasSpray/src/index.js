import "bootstrap";
import "p5";
import "./style/style.scss";
import { drawAll } from "./js/draw";
import { handleInputs } from "./js/inputs";
import { calcAll } from "./js/calcs";
import { triggerSpray, playMolecule, pauseMolecule, resetMolecule, resetMoleculeForSliderChange } from './js/draw';
import "./js/events";

// GLOBAL VARIABLES OBJECT
window.state = {
  frameRate: 60,
  pixelDensity: 4,
  showButtons: false,
  hamburgerHasBeenClicked:
    localStorage.getItem("hamburgerHasBeenClicked") === "true",
  canvasSize: [200, 80],
  showSpray: false,
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

};

window.windowResized = () => {
  sizeContainer();
  resizeCanvas(
    containerElement.offsetWidth,
    containerElement.offsetHeight - 10
  );
}

window.relativeSize = () => containerElement.offsetWidth / state.canvasSize[0];
window.relativeSizeY = () => containerElement.offsetHeight / state.canvasSize[1];

function sizeContainer() {
  const w = window.innerWidth * .9;
  const h = window.innerHeight * .8;
  const asp = 3 / 2;
  const dim = Math.min(w / asp, h);

  containerElement.style.width = `${dim * asp - 100}px`;
  containerElement.style.height = `${dim - 40}px`;
  wrapperElement.style.width = `${dim * asp}px`;
  wrapperElement.style.height = `${dim}px`;
  wrapperElement.style.fontSize = `${dim / 500}rem`;
}


window.addEventListener("DOMContentLoaded", () => {
  const modeButtons = document.querySelectorAll(".button-group button");
  modeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      window.graphMode = btn.id.replace("Btn", "");
      modeButtons.forEach(b => b.classList.toggle("active", b === btn));
      drawAll();
    });
  });

  const volumeSlider = document.getElementById("volumeFraction");
  const timeSlider = document.getElementById("timeSprayed");

  // redraw on slider move
  volumeSlider.addEventListener("input", () => {
    document.getElementById("volumeVal").textContent = volumeSlider.value;
    drawAll();
  });
  timeSlider.addEventListener("input", () => {
    document.getElementById("timeVal").textContent = timeSlider.value;
    drawAll();
  });

  const playBtn = document.getElementById("play-button");
  const pauseBtn = document.getElementById("pause-button");
  const resetBtn = document.getElementById("reset-button");


  if (playBtn) {
    playBtn.addEventListener('click', () => {
      console.log('▶️ Play clicked');
      triggerSpray(500);
      playMolecule();
    });
  } else {
    console.error('play-button not found');
  }

  if (pauseBtn) {
    pauseBtn.addEventListener('click', () => {
      console.log('⏸ Pause clicked');
      pauseMolecule();
    });
  } else {
    console.error('pause-button not found');
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      console.log('⏮ Reset clicked');
      resetMolecule();
    });
  } else {
    console.error('reset-button not found');
  }

  ['timeSprayed'].forEach(id => {
    const el = document.getElementById(id);
    el.addEventListener('input', resetMoleculeForSliderChange);
  });

  drawAll();
});
