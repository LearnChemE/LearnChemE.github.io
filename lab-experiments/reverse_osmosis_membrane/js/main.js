const mainWidth = 1280;
const mainHeight = 600;
const pressureSlider = document.getElementById("feed-pressure");
// Declare global variables which are available to all files
window.state = {
  //selection: "Velocity Distribution",

  //graph and window variables
  width: mainWidth,
  height: mainHeight,
  figureX: 175,
  figureY: 280,
  pumpOn: false,

  frameCount: 0,
  flowRate: 1,

  topOfTankDrainTimer: 0,
  bottomOfTankDrainTimer: 0,
  doneDrainingTank: false,
  tankToPumpDrainTimer: 0,

  permeateBeakerFillUp: false,
  retentateBeakerFillUp: false,
  permeateBeakerTimer: 0,
  rententateBeakerTimer: 0,

  //Salt Soln Tank variables
  saltTankWidth: 200,
  saltTankHeight: 250,
  tankVol: null,

  //Beaker variables
  permeateBeakerWidth: 200,
  permeateBeakerHeight: 200,
  retentateBeakerWidth: 200,
  retentateBeakerHeight: 200,
  beakerFlairX: 7,
  beakerThickness: 8,
  fractionFillRetentateBeaker: 0.75,
  fractionFillPermeateBeaker: 0.75,

  //RO Variables
  feedPressure: 10, // bar
  saltConcentrationPercent: 0.5, // wt%
  feedTemperature: 15, // C

  molarMassNaCl: 58.44, // g/mol
  saltWaterDensity: 1.025, // g/ml
  osmoticPressure: null, //bar
  feedWaterConcentration: null,
  vantHoffNaCl_i: 2,
  gasConstant: 0.08314, // L*bar/K*mol
  permeatePressure: 1.01325, // bar
};

// Load the other scripts (except calcs.js, which is imported in draw.js).

import "./controls.js";
import "./draw.js";
