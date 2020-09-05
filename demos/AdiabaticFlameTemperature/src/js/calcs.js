window.simulationSettings = {
  inletFuelTemperature : 273 + 25,
  inletOxidizerTemperature : 273 + 150,
  inletFuelMolarFlowRate : 100,
  oxygenOutletFlowRate : 0,
  nitrogenOutletFlowRate : 276,
  waterOutletFlowRate : 200,
  carbonDioxideOutletFlowRate : 100,
  excessO2 : 0,
  oxidizerFlowRate : 961,
  fuel : "methane",
  oxidizer : "air",
}

// All heat capacities are in J/(mol*K)

function CpH2O(T) {
  if ( T < 1700 ) {
    return 30.092 + 6.832514*(T/1000) + 6.793435*(T/1000)**2 - 2.534480*(T/1000)**3 + 0.082139/((T/1000)**2)
  } else {
    return 41.96426 + 8.622053*(T/1000) - 1.499780*(T/1000)**2 + 0.098119*(T/1000)**3 - 11.15764/((T/1000)**2)
  }
}

function CpCO2(T) {
  if ( T < 1200 ) {
    return 24.99735 + 55.18696*(T/1000) - 33.69137*(T/1000)**2 + 7.948387*(T/1000)**3 - 0.136638/((T/1000)**2)
  } else {
    return 58.16639 + 2.720074*(T/1000) - 0.492289*(T/1000)**2 + 0.038844*(T/1000)**3 - 6.447293/((T/1000)**2)
  }
}

function CpO2(T) {
  if ( T < 700 ) {
    return 31.32234 - 20.23531*(T/1000) + 57.86644*(T/1000)**2 - 36.50624*(T/1000)**3 - 0.007374/((T/1000)**2)
  } else if ( T < 2000 ) {
    return 30.03235 + 8.772972*(T/1000) - 3.988133*(T/1000)**2 + 0.788313	*(T/1000)**3 - 0.741599/((T/1000)**2)
  } else {
    return 20.91111 + 10.72071*(T/1000) - 2.020498*(T/1000)**2 + 0.146449*(T/1000)**3 + 9.245722/((T/1000)**2)
  }
}

function CpN2(T) {
  if ( T < 500 ) {
    return 28.98641 + 1.853978*(T/1000) - 9.647459*(T/1000)**2 + 16.63537*(T/1000)**3 + 0.000117/((T/1000)**2)
  } else if ( T < 2000 ) {
    return 19.50583 + 19.88705*(T/1000) - 8.598535*(T/1000)**2 + 1.369784*(T/1000)**3 + 0.527601/((T/1000)**2)
  } else {
    return 35.51872 + 1.128728*(T/1000) - 0.196103*(T/1000)**2 + 0.014662*(T/1000)**3 - 4.553760/((T/1000)**2)
  }
}

function CpMethane(T) {
  return -0.703029 + 108.4773*(T/1000) - 42.52157*(T/1000)**2 + 5.862788*(T/1000)**3 + 0.678565/((T/1000)**2)
}

function CpEthane(T) {
  return 29.1 + 0.066*T
}

function CpAcetylene(T) {
  return 23.13 + 0.0622*T
}

function CpPropane(T) {
  return 26.82 + 0.1448*T
}

function CpButane(T) {
  return 20.79 + 0.3456*T
}

function SensibleHeat(Cp, Tmin, Tmax, steps) {
  
  let T = Tmin;
  let H = 0;
  const dT = (Tmax - Tmin) / steps;

  for ( let i = 0; i < steps; i++ ) {
    const cp = Cp(T);
    const dH = cp * dT;
    H += dH;
    T += dT;
  }

  return H
}

window.findFlameTemp = function() {

  const fuel = simulationSettings.fuel;

  let nH2O, nCO2, nO2, nN2, nFuel; // mol / hr

  nFuel = simulationSettings.inletFuelMolarFlowRate; // mol / hr

  let Hc; // Heat of combustion ( J / mol )
  let CpFuel;

  const O2x = simulationSettings.excessO2;
  let xO2; // Excess oxygen molar flow rate

  const T0 = 298;
  const TOxidizer = simulationSettings.inletOxidizerTemperature;
  const TFuel = simulationSettings.inletFuelTemperature;

  switch(fuel) {
    case "methane":
      nO2 = 2 * nFuel; // This does not include excess O2
      nCO2 = nFuel;
      nH2O = 2 * nFuel;
      Hc = -890360;
      CpFuel = CpMethane;
    break;

    case "ethane":
      nO2 = 3.5 * nFuel;
      nCO2 = 2 * nFuel;
      nH2O = 3 * nFuel;
      Hc = -1559900;
      CpFuel = CpEthane;
    break;

    case "acetylene":
      nO2 = 2.5 * nFuel;
      nCO2 = 2 * nFuel;
      nH2O = nFuel;
      Hc = -1299600;
      CpFuel = CpAcetylene;
    break;

    case "propane":
      nO2 = 5 * nFuel;
      nCO2 = 3 * nFuel;
      nH2O = 4 * nFuel;
      Hc = -2220000;
      CpFuel = CpPropane;
    break;

    case "butane":
      nO2 = 6.5 * nFuel;
      nCO2 = 4 * nFuel;
      nH2O = 5 * nFuel;
      Hc = -2878500;
      CpFuel = CpButane;
    break;
  }

  xO2 = O2x * nO2;

  if(simulationSettings.oxidizer === "oxygen") {
    // If the oxidizer is pure oxygen
    nN2 = 0
  } else {
    // If the oxidizer is air
    nN2 = (nO2 + xO2) * 79 / 21
  }

  simulationSettings.oxidizerFlowRate = nO2 + xO2 + nN2;
  simulationSettings.oxygenOutletFlowRate = xO2;
  simulationSettings.nitrogenOutletFlowRate = nN2;
  simulationSettings.waterOutletFlowRate = nH2O;
  simulationSettings.carbonDioxideOutletFlowRate = nCO2;

  const totalHeat = -1 * nFuel * Hc;

  const FuelSensibleHeatChange = -1 * nFuel * SensibleHeat(CpFuel, T0, TFuel, 100);
  const OxidizerSensibleHeatChange = -1 * (nO2 + xO2) * SensibleHeat(CpO2, T0, TOxidizer, 100) + -1 * nN2 * SensibleHeat(CpN2, T0, TOxidizer, 100);

  let ProductsSensibleHeatChange = 0; // Initial value
  let TFlame = TOxidizer + 1; // Initial value for flame temperature is inlet oxidizer temperature + 1

  const precision = 100;

  while ( ProductsSensibleHeatChange + OxidizerSensibleHeatChange + FuelSensibleHeatChange < totalHeat ) {

    TFlame += 1000;

    ProductsSensibleHeatChange = 
      xO2 * SensibleHeat(CpO2, T0, TFlame, precision) +
      nN2 * SensibleHeat(CpN2, T0, TFlame, precision) +
      nH2O * SensibleHeat(CpH2O, T0, TFlame, precision) +
      nCO2 * SensibleHeat(CpCO2, T0, TFlame, precision)

  }

  while ( ProductsSensibleHeatChange + OxidizerSensibleHeatChange + FuelSensibleHeatChange > totalHeat ) {

    TFlame -= 100;

    ProductsSensibleHeatChange = 
      xO2 * SensibleHeat(CpO2, T0, TFlame, precision) +
      nN2 * SensibleHeat(CpN2, T0, TFlame, precision) +
      nH2O * SensibleHeat(CpH2O, T0, TFlame, precision) +
      nCO2 * SensibleHeat(CpCO2, T0, TFlame, precision)

  }

  while ( ProductsSensibleHeatChange + OxidizerSensibleHeatChange + FuelSensibleHeatChange < totalHeat ) {

    TFlame += 10;

    ProductsSensibleHeatChange = 
      xO2 * SensibleHeat(CpO2, T0, TFlame, precision) +
      nN2 * SensibleHeat(CpN2, T0, TFlame, precision) +
      nH2O * SensibleHeat(CpH2O, T0, TFlame, precision) +
      nCO2 * SensibleHeat(CpCO2, T0, TFlame, precision)

  }

  while ( ProductsSensibleHeatChange + OxidizerSensibleHeatChange + FuelSensibleHeatChange > totalHeat ) {

    TFlame -= 1;

    ProductsSensibleHeatChange = 
      xO2 * SensibleHeat(CpO2, T0, TFlame, precision) +
      nN2 * SensibleHeat(CpN2, T0, TFlame, precision) +
      nH2O * SensibleHeat(CpH2O, T0, TFlame, precision) +
      nCO2 * SensibleHeat(CpCO2, T0, TFlame, precision)

  }

  return TFlame
}
