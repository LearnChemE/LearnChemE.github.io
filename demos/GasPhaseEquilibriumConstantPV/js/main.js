/*
  This is the main JavaScript file for the simulation. It is just a wrapper
  for the other JavaScript files. None of the actual simulation logic should go
  in this file.
*/
const mainWidth = 1280;
const mainHeight = 720;
// Declare global variables which are available to all files
window.z = {
  //graph and window variables
  width: mainWidth,
  height: mainWidth,

  //slider inputs
  pressureConstPressureCase: 0.7,
  volumeConstPressureCase: 0.74,
  pressureConstVolumeCase: 0.7,
  volumeConstVolumeCase: 0.74,
  molesInerts: 0.0000000001,
  R: 0.00008314,
  temperature: 900,
  totalMoles: 0,
  initialA: 5,
  coeffBValue: 2,
  result1: 0,
  c: 0,
  equilMolsA: 0,
  equilMolsB: 0,
  extentConstPressureCase: 0,
  extentConstVolumeCase: 0,
  kEQ: 0.5,

  //3D cylinder parameters
  cylRadius: 100,
  cylHeight: 300,

  cylinderLiveVolumeFractionConstantPressureCase: 0,
  cylinderLiveVolumeFractionConstantVolumeCase: 0,

  molAForConstPressureSelection: 3.0,
  molBForConstPressureSelection: 4.1,

  molAForConstVolumeSelection: 3.1,
  molBForConstVolumeSelection: 3.9,
};

// Load the other scripts (except calcs.js, which is imported in draw.js).

import "./controls.js";
import "./draw.js";
