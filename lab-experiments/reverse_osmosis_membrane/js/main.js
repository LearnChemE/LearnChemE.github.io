const mainWidth = 1280;
const mainHeight = 720;
const pressureSlider = document.getElementById("feed-pressure");
// Declare global variables which are available to all files
window.state = {
  //selection: "Velocity Distribution",

  //graph and window variables
  width: mainWidth,
  height: mainHeight,
  figureX: 175,
  figureY: 380,
  pumpOn: false,

  feedPressure: 10,
  frameCount: 0,
  flowRate: 1,

  topOfTankDrainTimer: 0,
  bottomOfTankDrainTimer: 0,
  doneDrainingTank: false,
  tankToPumpDrainTimer: 0,
};

// Load the other scripts (except calcs.js, which is imported in draw.js).

import "./controls.js";
import "./draw.js";
