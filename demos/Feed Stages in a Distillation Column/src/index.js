import "bootstrap";
import "p5";
import "./style/style.scss";
// import "./assets/font_here.ttf";
// import "./assets/worksheet_here.pdf";
import { drawAll } from "./js/draw";
// import { drawAll } from "./js/step1";
import { handleInputs } from "./js/inputs";
import { calcAll, setDefaults, getFeedCondition } from "./js/calcs";

// GLOBAL VARIABLES OBJECT
window.state = {
  frameRate: 60,
  pixelDensity: 4,
  showButtons: false,
  hamburgerHasBeenClicked: window.localStorage.getItem("hamburgerHasBeenClicked") === "true",
  canvasSize: [800, 600], // Updated for Phase 1: 800x600 canvas
  
  // Feed Stage Simulation State
  qValue: 0.0, // Default q-value (saturated vapor)
  
  // Column Geometry (in canvas units)
  columnWidth: 60,
  columnHeight: 400,
  columnX: 400, // Center of canvas (800/2)
  columnY: 100, // Starting Y position
  
  // Stage Configuration
  numStages: 10,
  feedStage: 5, // Stage number where feed enters (from top)
  
  // Flow Properties (for future phases)
  feedFlow: 100, // F
  liquidFlow: 150, // L (above feed)
  vaporFlow: 200, // V (above feed)
  liquidFlowBelow: 0, // L̅ (below feed) - will be calculated
  vaporFlowBelow: 0, // V̅ (below feed) - will be calculated
};

const containerElement = document.getElementById("p5-container");

// window.preload = () => {
//   state.customFont = loadFont("assets/font_here.ttf");
// }

window.setup = function() {
  sizeContainer();
  createCanvas(containerElement.offsetWidth, containerElement.offsetHeight).parent(containerElement);
  handleInputs();
  setDefaults();
  calcAll();
  pixelDensity(state.pixelDensity);
  frameRate(state.frameRate);
  
  // Log canvas setup for debugging
  console.log("Canvas setup complete:", {
    width: containerElement.offsetWidth,
    height: containerElement.offsetHeight,
    virtualSize: state.canvasSize,
    qValue: state.qValue
  });
};

window.draw = function() {
  // Set virtual canvas dimensions
  window.width = state.canvasSize[0];
  window.height = state.canvasSize[1];
  
  // Scale to fit container
  scale(relativeSize());
  
  // Keep original white background
  background(255);
  
  // Draw all simulation components
  drawAll();
};

window.windowResized = () => {
  resizeCanvas(containerElement.offsetWidth, containerElement.offsetHeight);
}

// Updated to use new canvas width (800 instead of 150)
window.relativeSize = () => containerElement.offsetWidth / 800;

function sizeContainer() {
  // Update container sizing for 800x600 aspect ratio
  containerElement.style.width = `calc(100vw - 10px)`;
  containerElement.style.maxWidth = `calc(calc(100vh - 10px) * ${state.canvasSize[0]} / ${state.canvasSize[1]})`;
  containerElement.style.height = `calc(calc(100vw - 10px) * ${state.canvasSize[1]} / ${state.canvasSize[0]})`;
  containerElement.style.maxHeight = `calc(100vh - 10px)`;
}

// Helper function to update q-value from slider
window.updateQValue = function(newQValue) {
  state.qValue = parseFloat(newQValue);
  
  // Update the display
  const qDisplay = document.getElementById("q-value-display");
  if (qDisplay) {
    qDisplay.textContent = `q = ${state.qValue.toFixed(1)}`;
  }
  
  // Recalculate flows and update visualization
  calcAll();
  
  // Log for debugging
  console.log("Q-value updated:", state.qValue);
};

// Helper function to get feed condition description (using calcs.js)
window.getFeedCondition = function(q) {
  return getFeedCondition(q).condition;
};

require("./js/events.js");