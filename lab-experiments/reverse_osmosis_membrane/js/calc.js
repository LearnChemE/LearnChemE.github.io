export function calcAll() {
  function calculatePermeabilityFactor(T) {
    let newPermFactor;
    let beta = 0.03;
    let TRef = 25;
    let permFactorAtRefTemp = 3; //this is a refrence permeability factor at a refrence temp of 25 C

    newPermFactor = permFactorAtRefTemp * Math.exp(beta * (T - TRef));

    return newPermFactor;
  }

  state.permeabilityFactor = calculatePermeabilityFactor(state.feedTemperature); //we want to have A, the permeability factor, be adjusted based on temperature

  //console.log("permeability factor A = " + state.permeabilityFactor);

  //-----------calculate volume of beakers and tank for proper mass balance-----------
  //these calculations are to account for the thickness of the walls of the beakers and tank

  let permeateBeakerInnerRadius = (state.permeateBeakerWidth - 2 * state.beakerThickness) / 2;
  let permeateBeakerWaterHeight = (10 / 11) * state.permeateBeakerHeight - 8; //height up to 1000mL

  let volumePermeateBeaker = Math.PI * permeateBeakerInnerRadius ** 2 * permeateBeakerWaterHeight; //units of pixels^3

  let retentateBeakerInnerRadius = (state.retentateBeakerWidth - 2 * state.beakerThickness) / 2;
  let retentateBeakerWaterHeight = (10 / 11) * state.retentateBeakerHeight - 8; //height up to 1000mL

  let volumeRetentateBeaker = Math.PI * retentateBeakerInnerRadius ** 2 * retentateBeakerWaterHeight; //units of pixels^3

  let saltTankInnerRadius = (state.saltTankWidth - 10) / 2;
  let saltTankWaterHeight = state.saltTankHeight - 10;

  let volumeSaltSolnTank =
    Math.PI * saltTankInnerRadius ** 2 * saltTankWaterHeight + (Math.PI * saltTankInnerRadius ** 2 * state.saltTankConeWaterDepth) / 3;

  state.fractionFillPermeateBeaker = volumeSaltSolnTank / 2 / volumePermeateBeaker; //temporary -- fills each beaker with 50% of tank vol
  state.fractionFillRetentateBeaker = volumeSaltSolnTank / 2 / volumeRetentateBeaker; //temporary -- fills each beaker with 50% of tank vol

  let realTankVolume = volumeSaltSolnTank / 2 / volumeRetentateBeaker + volumeSaltSolnTank / 2 / volumePermeateBeaker; // about 1.52L
  /* console.log("tank vol: " + realTankVolume);
  console.log("real permeate vol: " + volumePermeateBeaker); */

  //pixels/cm

  //---------------calculate feed concentration---------------
  state.feedWaterConcentration = (state.saltConcentrationPercent * state.saltWaterDensity * 10) / state.molarMassNaCl;

  //---------------osmotic pressure calculation using van't Hoff eq (PI = i*C*R*T)---------------
  let i = state.vantHoffNaCl_i;
  let C = state.feedWaterConcentration;
  let R = state.gasConstant;
  let T = state.feedTemperature + 273.15; //Temperature comes in as C this returns K
  state.osmoticPressure = i * C * R * T; // C in mol/L, R in L·bar/mol·K, T in K, osmotic pressure in bar

  let PI = state.osmoticPressure;
  let deltaP = state.feedPressure - state.permeatePressure; // P1-P2

  let permeateFlux = state.permeabilityFactor * (deltaP - PI); // units of L/(hr*m^2)

  if (permeateFlux < 0) {
    state.backwardsFlow = true;
  } else {
    state.backwardsFlow = false;
  }

  //Flow Rates but need to be in terms of pixels of height/frame
  state.permeateFlowRate = permeateFlux * state.membraneArea * (1000 / 3600); // units of mL/s
  if (state.permeateFlowRate > state.recoveryLimitBasedOnConcentration[state.saltConcentrationPercent / 0.5 - 1] * state.feedFlowRate) {
    state.permeateFlowRate = state.recoveryLimitBasedOnConcentration[state.saltConcentrationPercent / 0.5 - 1] * state.feedFlowRate;
  }
  state.recoveryRate = state.permeateFlowRate / state.feedFlowRate;
  state.retentateFlowRate = state.feedFlowRate - state.permeateFlowRate; // units of mL/s

  /*  console.log("permeate flow: " + state.permeateFlowRate);

  console.log("feed flow rate: " + state.feedFlowRate + "mL/s");
 */
  //Concentrations
  state.permateConcentration = (1 - state.saltRejectionRate) * state.saltConcentrationPercent;
  state.retentateConcentration = state.saltConcentrationPercent / (1 - state.recoveryRate);

  //console.log(state.feedWaterConcentration);
  //console.log(PI);
  //console.log(state.retentateFlowRate);

  let ratioCylinderSaltTankHeightToRadius = saltTankWaterHeight / saltTankInnerRadius;
  state.ratioConeSaltTankHeightToRadius = state.saltTankConeWaterDepth / saltTankInnerRadius;
  let ratioPermeateBeakerHeightToRadius = permeateBeakerWaterHeight / permeateBeakerInnerRadius;
  let ratioRetentateBeakerHeightToRadius = retentateBeakerWaterHeight / retentateBeakerInnerRadius;

  let realSaltTankInnerRadius =
    ((realTankVolume * 1000) / (Math.PI * (ratioCylinderSaltTankHeightToRadius + (1 / 3) * state.ratioConeSaltTankHeightToRadius))) ** (1 / 3); //cm
  let realSaltTankWaterHeight = realSaltTankInnerRadius * ratioCylinderSaltTankHeightToRadius; //cm
  state.realSaltTankConeWaterDepth = realSaltTankInnerRadius * state.ratioConeSaltTankHeightToRadius; //cm

  let realPermeateBeakerRadius = (1000 / (Math.PI * ratioPermeateBeakerHeightToRadius)) ** (1 / 3); //cm
  let realPermeateBeakerWaterHeight = realPermeateBeakerRadius * ratioPermeateBeakerHeightToRadius; //cm

  let realRetentateBeakerRadius = (1000 / (Math.PI * ratioRetentateBeakerHeightToRadius)) ** (1 / 3); //cm
  let realRetentateBeakerWaterHeight = realRetentateBeakerRadius * ratioRetentateBeakerHeightToRadius; //cm

  let cmToPixelConversonSaltTankCylinder = saltTankWaterHeight / realSaltTankWaterHeight;

  state.cmToPixelConversonSaltTankConeRadius = saltTankInnerRadius / realSaltTankInnerRadius;
  let cmToPixelConversonPermeateBeaker = permeateBeakerWaterHeight / realPermeateBeakerWaterHeight;
  let cmToPixelConversonRetentateBeaker = retentateBeakerWaterHeight / realRetentateBeakerWaterHeight;

  state.deltaHeightSaltTankCylinder = (state.feedFlowRate / (Math.PI * realSaltTankInnerRadius ** 2)) * cmToPixelConversonSaltTankCylinder; //px/s
  state.deltaHeightPermeateBeaker = (state.permeateFlowRate / (Math.PI * realPermeateBeakerRadius ** 2)) * cmToPixelConversonPermeateBeaker; //px/s
  state.deltaHeightRetentateBeaker = (state.retentateFlowRate / (Math.PI * realRetentateBeakerRadius ** 2)) * cmToPixelConversonRetentateBeaker; //px/s
}

//cone changing function outputs px/s

export function deltaHWaterInCone(hConePx) {
  let cmToPixelConversonSaltTankConeHeight = state.saltTankConeWaterDepth / state.realSaltTankConeWaterDepth;
  let deltaHConeWater =
    (state.ratioConeSaltTankHeightToRadius ** 2 / (Math.PI * (hConePx / cmToPixelConversonSaltTankConeHeight) ** 2)) *
    state.feedFlowRate *
    cmToPixelConversonSaltTankConeHeight;

  return deltaHConeWater;
}

export function deltaRWaterInCone(hConePx) {
  let cmToPixelConversonSaltTankConeHeight = state.saltTankConeWaterDepth / state.realSaltTankConeWaterDepth;
  let deltaRConeWater =
    (state.ratioConeSaltTankHeightToRadius / (Math.PI * (hConePx / cmToPixelConversonSaltTankConeHeight) ** 2)) *
    state.feedFlowRate *
    cmToPixelConversonSaltTankConeHeight;

  return deltaRConeWater;
}
