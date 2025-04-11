/*
  This is the main JavaScript file for the simulation. It is just a wrapper
  for the other JavaScript files. None of the actual simulation logic should go
  in this file.
*/
const mainWidth = 1280;
const mainHeight = 720;
// Declare global variables which are available to all files
window.z = {
  //selection: "Velocity Distribution",

  //graph and window variables
  width: mainWidth,
  height: mainWidth,
  graphCenterX: (mainWidth / 2),
  graphCenterY: (mainHeight / 2) - 32,
  grayThickness: (((mainHeight / 2) - 32) - 265) - 50,
  distLX: ((mainWidth / 2)) - 428,
  heightBY: ((mainHeight / 2) - 32) + 290,
  distRX: ((mainWidth / 2)) + 428,
  heightTY: ((mainHeight / 2) - 32) - 290,
  distBY: ((mainHeight / 2) - 32) + 240,
  distTY: ((mainHeight / 2) - 32) - 240, 

}

// Load the other scripts (except calcs.js, which is imported in draw.js).

import "./controls.js";
import "./draw.js";
