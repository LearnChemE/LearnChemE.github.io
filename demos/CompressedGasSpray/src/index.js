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
  hamburgerHasBeenClicked:
    localStorage.getItem("hamburgerHasBeenClicked") === "true",
  canvasSize: [200, 80],
  showSpray: false,  // ← toggled by startSpray/stopSpray
};

const containerElement = document.getElementById("p5-container");
const wrapperElement = document.getElementById("p5-outer");
//const containerElement = document.getElementById("drawing-area");
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

// // spray control (events.js will call these)
// window.startSpray = () => state.showSpray = true;
// window.stopSpray  = () => state.showSpray = false;

// // the actual aqua-spray drawing
// function drawSpray() {
//   push();
//   stroke(0, 200, 200);
//   strokeWeight(2);

//   // nozzle coordinates in your 650×220 logical space:
//   const nozzleX = 100,
//         nozzleY = 20;

//   for (let i = 0; i < 8; i++) {
//     const angle = random(-PI / 4, PI / 4);
//     const len   = random(20, 50);
//     line(
//       nozzleX, nozzleY,
//       nozzleX + len * cos(angle),
//       nozzleY + len * sin(angle)
//     );
//   }
//   pop();
// }

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

  // initial draw
  drawAll();
});
