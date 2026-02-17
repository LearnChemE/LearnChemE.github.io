/*
  This is the main JavaScript file for the simulation. It is just a wrapper
  for the other JavaScript files. None of the actual simulation logic should go
  in this file.
*/
const mainWidth = 1200;
const mainHeight = 800;
// Declare global variables which are available to all files
window.state = {
  //selection: "Velocity Distribution",

  //graph and window variables
  width: mainWidth,
  height: mainWidth,
  graphCenterX: mainWidth / 2 - 120,
  graphCenterY: mainHeight / 2 - 40,
  graphWidth: 720,
  graphHeight: 540,

  //slider variables
  positiveA12Value: 0,
  positiveA21Value: 0,
  negativeA12Value: 0,
  negativeA21Value: 0,

  //radio button variables
  plotSelection: 0,
  deviationSelection: 0,

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

  //Timers
  drawTimer: 0,
  deviationSelectionTimer: 0,
};
