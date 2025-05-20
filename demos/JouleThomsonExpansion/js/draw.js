import { calcAll } from "./calcs.js";
const p5container = document.getElementById("p5-container");
const inletPressureSlider = document.getElementById("inlet-pressure-slider");
const outletPressureSlider = document.getElementById("outlet-pressure-slider");
const inletTemperatureSlider = document.getElementById("inlet-temperature-slider");
const inletPressureSliderWrapper = document.getElementById("inlet-pressure-slider-wrapper");
const outletPressureSliderWrapper = document.getElementById("outlet-pressure-slider-wrapper");
const inletTemperatureSliderWrapper = document.getElementById("inlet-temperature-slider-wrapper");
const gasButtonsWrapper = document.getElementById("gas-buttons-wrapper");

let mu = 5.468;

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
  frameRate(30);
};

// Same with draw() - this should never be inside a conditional statement.
// Put the conditional statements inside the draw function.
window.draw = function () {
  // The "window" keyword is used to set global variables. So you can use
  // "selection" in any file, function, block, etc.

  const selectionElement = document.querySelector('input[name="selection"]:checked');
  window.selection = selectionElement.value;

  const gasSelectionElement = document.querySelector('input[name="gas"]:checked');
  window.gasSelection = gasSelectionElement.value;

  resize();
  background(255);
  calcAll();

  if (gasSelection === "NH3") {
    inletTemperatureSlider.setAttribute("min", 200);
    inletTemperatureSlider.setAttribute("max", 725);
    mu = z.muNH3[z.inletPressure - 1][(z.inletTemperature - 200) / 5];
  }
  if (gasSelection === "CO2") {
    inletTemperatureSlider.setAttribute("min", 290);
    inletTemperatureSlider.setAttribute("max", 1000);
    mu = z.muCO2[z.inletPressure - 1][(z.inletTemperature - 290) / 5];
  }
  if (gasSelection === "N2") {
    inletTemperatureSlider.setAttribute("min", 145);
    inletTemperatureSlider.setAttribute("max", 1000);
    mu = z.muN2[z.inletPressure - 1][(z.inletTemperature - 145) / 5];
  }
  if (gasSelection === "H2") {
    inletTemperatureSlider.setAttribute("min", 55);
    inletTemperatureSlider.setAttribute("max", 1000);
    mu = z.muH2[z.inletPressure - 1][(z.inletTemperature - 55) / 5];
  }

  z.outletTemperature = z.inletTemperature + mu * (z.outletPressure - z.inletPressure);

  if (selection === "constant-pressure") {
    gasButtonsWrapper.style.display = "grid";
    inletPressureSliderWrapper.style.display = "grid";
    outletPressureSliderWrapper.style.display = "grid";
    inletTemperatureSliderWrapper.style.display = "grid";

    drawDiagramText();
  } else if (selection === "constant-volume") {
    inletTemperatureSliderWrapper.style.display = "none";
    inletPressureSliderWrapper.style.display = "grid";
    outletPressureSliderWrapper.style.display = "none";
    gasButtonsWrapper.style.display = "none";
  }
};

// Look this function up in p5.js documentation. The width and height of
// the #p5-container element are set in the css file.
window.windowResized = () => {
  resizeCanvas(p5container.offsetWidth, p5container.offsetHeight);
};

function drawDiagramText() {
  push();
  textAlign(CENTER);
  stroke("Black");
  strokeWeight(0.2);
  fill("Black");
  textSize(28);
  text("T out = " + z.outletTemperature.toFixed(1), z.width / 4, z.height / 2);
  pop();
}
