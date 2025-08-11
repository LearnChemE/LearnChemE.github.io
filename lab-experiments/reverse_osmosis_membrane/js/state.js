const mainWidth = 1280;
const mainHeight = 600;
// Declare global variables which are available to all files
window.state = {
  //graph and window variables
  width: mainWidth,
  height: mainHeight,
  figureX: 175,
  figureY: 280,
  pumpOn: false,
  backwardsFlow: null,

  frameCount: 0,
  frameRate: 30,
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
  saltTankConeWaterDepth: 24,
  deltaHeightSaltTankCylinder: null,
  hConePx: 24,
  rConePx: 100, // = 0.5*saltTankWidth
  realSaltTankConeWaterDepth: 0,
  ratioConeSaltTankHeightToRadius: 0,
  cmToPixelConversonSaltTankConeRadius: null,

  //Beaker variables
  permeateBeakerWidth: 200,
  permeateBeakerHeight: 200,
  retentateBeakerWidth: 200,
  retentateBeakerHeight: 200,
  beakerFlairX: 7,
  beakerThickness: 8,
  fractionFillRetentateBeaker: null,
  fractionFillPermeateBeaker: null,
  retentateConcentration: null,
  permeateConcentration: null,

  //RO Variables
  feedPressure: 10, // bar
  saltConcentrationPercent: 0.5, // wt%
  feedTemperature: 15, // C
  permeateFlowRate: null,
  retentateFlowRate: null,
  feedFlowRate: 8, // mL/s
  deltaHeightPermeateBeaker: null,
  deltaHeightRetentateBeaker: null,
  saltRejectionRate: 0.992,

  molarMassNaCl: 58.44, // g/mol
  saltWaterDensity: 1.025, // g/ml
  osmoticPressure: null, //bar
  feedWaterConcentration: null,
  vantHoffNaCl_i: 2,
  gasConstant: 0.08314, // L*bar/K*mol
  permeatePressure: 1.01325, // bar <-- this is just atmospheric pressure
  permeabilityFactor: 3, //L/(m^2*hr*bar)
  membraneArea: 0.5, // m^2
  recoveryRate: null,

  recoveryLimitBasedOnConcentration: [0.75, 0.7, 0.65, 0.6, 0.55, 0.5, 0.45],
};
