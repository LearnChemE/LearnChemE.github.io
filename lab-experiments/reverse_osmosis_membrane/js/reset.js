export function reset() {
  //graph and window variables
  state.figureX = 175;
  state.figureY = 280;
  state.pumpOn = false;
  state.backwardsFlow = null;

  state.frameCount = 0;
  state.frameRate = 30;
  state.flowRate = 1;

  state.topOfTankDrainTimer = 0;
  state.bottomOfTankDrainTimer = 0;
  state.doneDrainingTank = false;
  state.tankToPumpDrainTimer = 0;

  state.permeateBeakerFillUp = false;
  state.retentateBeakerFillUp = false;
  state.permeateBeakerTimer = 0;
  state.rententateBeakerTimer = 0;

  //Salt Soln Tank variables
  state.saltTankWidth = 200;
  state.saltTankHeight = 250;
  state.tankVol = null;
  state.saltTankConeWaterDepth = 24;
  state.deltaHeightSaltTankCylinder = null;
  state.hConePx = 24;
  state.rConePx = 100; // = 0.5*saltTankWidth
  state.realSaltTankConeWaterDepth = 0;
  state.ratioConeSaltTankHeightToRadius = 0;
  state.cmToPixelConversonSaltTankConeRadius = null;

  //Beaker variables
  state.permeateBeakerWidth = 200;
  state.permeateBeakerHeight = 200;
  state.retentateBeakerWidth = 200;
  state.retentateBeakerHeight = 200;
  state.beakerFlairX = 7;
  state.beakerThickness = 8;
  state.fractionFillRetentateBeaker = null;
  state.fractionFillPermeateBeaker = null;
  state.retentateConcentration = 0;
  state.permeateConcentration = 0;

  //RO Variables
  state.permeateFlowRate = null;
  state.retentateFlowRate = null;
  state.feedFlowRate = 8;
  state.deltaHeightPermeateBeaker = null;
  state.deltaHeightRetentateBeaker = null;
  state.saltRejectionRate = 0.992;

  state.molarMassNaCl = 58.44; // g/mol
  state.saltWaterDensity = 1.025; // g/ml
  state.osmoticPressure = null; //bar
  state.feedWaterConcentration = null;
  state.vantHoffNaCl_i = 2;
  state.gasConstant = 0.08314; // L*bar/K*mol
  state.permeatePressure = 1.01325; // bar <-- this is just atmospheric pressure
  state.permeabilityFactor = 3; //L/(m^2*hr*bar)
  state.membraneArea = 0.5; // m^2
  state.recoveryRate = null;

  //Slider reset

  const pressureSlider = document.getElementById("feed-pressure");
  pressureSlider.disabled = false;

  const tempSlider = document.getElementById("feed-temp");
  tempSlider.disabled = false;

  const saltSlider = document.getElementById("salt-conc");
  saltSlider.disabled = false;
}
