import { calcAll } from "./calcs.js";
const p5container = document.getElementById("p5-container");
const volumeSliderWrapper = document.getElementById("volume-slider-wrapper");
const pressureSliderWrapper = document.getElementById("pressure-slider-wrapper");

//defined local variables only needed in draw
let angleX = 0;
let angleY = 0;
let meter3Image;
let font;

//preload for loading images and fonts
window.preload = function () {};

// This function is used to scale the canvas based on the size of the container
window.relativeSize = () => p5container.offsetWidth / 1280;
//window.relativeSizeY = () => p5container.offsetHeight;

function resize() {
  // Here I am reassigning the width and height of the canvas to a static value of 1280x720,
  // even though the actual canvas size is based on the size of the #p5-container element.
  // So you can effectively treat the canvas like it is 1280x720, even though it will scale to fit the screen.
  z.width;
  z.height;

  scale(relativeSize());
}

// Moved outside of the selection block - Do not call setup() more than once.
// So this should never be inside a conditional statement.
window.setup = function () {
  createCanvas(p5container.offsetWidth, p5container.offsetHeight).parent(p5container);
  frameRate(60);
};

// Same with draw() - this should never be inside a conditional statement.
// Put the conditional statements inside the draw function.
window.draw = function () {
  // The "window" keyword is used to set global variables. So you can use
  // "selection" in any file, function, block, etc.

  const selectionElement = document.querySelector('input[name="selection"]:checked');
  window.selection = selectionElement.value;

  resize();
  background(255);
  calcAll();

  if (selection === "constant-pressure") {
    volumeSliderWrapper.style.display = "none";
    pressureSliderWrapper.style.display = "grid";
  } else if (selection === "constant-volume") {
    volumeSliderWrapper.style.display = "grid";
    pressureSliderWrapper.style.display = "none";
  }
};

// Look this function up in p5.js documentation. The width and height of
// the #p5-container element are set in the css file.
window.windowResized = () => {
  resizeCanvas(p5container.offsetWidth, p5container.offsetHeight);
};
