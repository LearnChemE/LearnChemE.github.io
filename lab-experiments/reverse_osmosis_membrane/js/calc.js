export function calcAll() {
  //-----------calculate volume of beakers and tank for proper mass balance-----------
  //these calculations are to account for the thickness of the walls of the beakers and tank

  let volumePermeateBeaker =
    3.14159 * ((state.permeateBeakerWidth - 2 * state.beakerThickness) / 2) ** 2 * ((10 / 11) * state.permeateBeakerHeight - 8);
  let volumeRetentateBeaker =
    3.14159 * ((state.retentateBeakerWidth - 2 * state.beakerThickness) / 2) ** 2 * ((10 / 11) * state.retentateBeakerHeight - 8);

  //second term is for calculating cone volume. And *8 comes from cone_depth/3
  let volumeSaltSolnTank =
    3.14159 * ((state.saltTankWidth - 10) / 2) ** 2 * (state.saltTankHeight - 10) + 3.14159 * ((state.saltTankWidth - 10) / 2) ** 2 * 8;

  //console.log(volumeRetentateBeaker / volumeSaltSolnTank);

  //---------------calculate feed concentration---------------
  state.feedWaterConcentration = (state.saltConcentrationPercent * state.saltWaterDensity * 10) / state.molarMassNaCl;

  //---------------osmotic pressure calculation using van't Hoff eq (PI = i*C*R*T)---------------
  let i = state.vantHoffNaCl_i;
  let C = state.feedWaterConcentration;
  let R = state.gasCosntant;
  let T = state.feedTemperature + 273.15; //Temperature comes in as C this returns K
  state.osmoticPressure = i * C * R * T;

  let PI = state.osmoticPressure;
  let deltaP = state.feedPressure - state.permeatePressure; // P1-P2
}
