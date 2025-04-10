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

  //slider variables
  h3Max: 0.98,
  h2Max: 0.98,
  hTop: 0.27,
  muTop: 0.5,
  hMid: 0.33,
  muMid: 1,
  hBot: 0.33,
  centerXTop: 0,
  centerYTop: 0,
  centerXMid: 0,
  centerYMid: 0,
  centerXBot: 0,
  centerYBot: 0,
  h3Actual: 0,
  h2Actual: 0,

  //line on the distribution graph points
  distLineX23: 0,
  distLineX12: 0,
  mouseXPtCalibrated: 0,
  mouseYPtCalibrated: 0,
  pressed: 0,
  circleX: 0,
  circleY: 0,
  plotCirlceX1: 0,
  plotCirlceX2: 0,
  plotCirlceX3: 0,
  plotCirlceY1: 0,
  plotCirlceY2: 0,
  plotCirlceY3: 0,
  bottomLineA: 0,
  bottomLineB: 0,
  midLineA: 0,
  midLineB: 0,
  bottomLineA: 0,
  bottomLineB: 0,
  mouseVector: 0,

  //Height graph
  heightY12: 0,
  heightY23: 0,
  plotCirlceY4: 0,
  plotCirlceY5: 0,
  plotCirlceY6: 0,
  heightX12: 0,
  heightX23: 0,

  //arrows


}

// Load the other scripts (except calcs.js, which is imported in draw.js).

import "./controls.js";
import "./draw.js";