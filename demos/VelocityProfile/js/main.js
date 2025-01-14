/*
  This is the main JavaScript file for the simulation. It is just a wrapper
  for the other JavaScript files. None of the actual simulation logic should go
  in this file.
*/

// Declare global variables which are available to all files
window.g = {
  selection: "Option 1",
  density: 0.5,
  particles: 50,
  playing: false,
}

// Load the other scripts (except calcs.js, which is imported in draw.js).

import "./controls.js";
import "./draw.js";
