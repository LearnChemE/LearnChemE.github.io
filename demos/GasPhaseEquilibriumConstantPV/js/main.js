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
  pressureCP: 0.7,
  volumeCP: 0.74,
  pressureCV: 0.7,
  volumeCV: 0.74,
  molesInerts: 0.0000000001,
  gasConst: 0.00008314,
  temp: 900,
  totalMoles: 0, 
  initialA: 5,
  coeffBValue: 2, 
  result1: 0,
  c: 0,
  equilA: 0,
  equilB: 0,
  extentCP: 0,
  extentCV: 0,
  kEQ: 0.5,
  
  //3D cylinder parameters
  cylRadius: 100,
  cylHeight: 300,

  molACP: 3.0,
  molBCP: 4.1,
  

  molACV: 3.1,
  molBCV: 3.9,
  

}

// Load the other scripts (except calcs.js, which is imported in draw.js).

import "./controls.js";
import "./draw.js";
