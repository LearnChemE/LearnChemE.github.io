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

// All enthalpies are in kJ/mol

function hH2O(T) {
  const t = T / 1000;
  if ( T < 1700 ) {
    return 30.092*t + 6.832514*(t**2)/2 + 6.793435*(t**3)/3 - 2.534480*(t**4)/4 + 0.082139/(-1 * t) - 250.8810 + 241.8264
  } else {
    return 41.96426*t + 8.622053*(t**2)/2 - 1.499780*(t**3)/3 + 0.098119*(t**4)/4 - 11.15764/(-1 * t) - 272.1797 + 241.8264
  }
}

function hCO2(T) {
  const t = T / 1000;
  if ( T < 1200 ) {
    return 24.99735*t + 55.18696*(t**2)/2 - 33.69137*(t**3)/3 + 7.948387*(t**4)/4 - 0.136638/(-1 * t) - 403.6075 + 393.5224
  } else {
    return 58.16639*t + 2.720074*(t**2)/2 - 0.492289*(t**3)/3 + 0.038844*(t**4)/4 - 6.447293/(-1 * t) - 425.9186 + 393.5224
  }
}

function hO2(T) {
  const t = T / 1000;
  if ( T < 700 ) {
    return 31.32234*t - 20.23531*(t**2)/2 + 57.86644*(t**3)/3 - 36.50624*(t**4)/4 - 0.007374/(-1 * t) - 8.903471
  } else if ( T < 2000 ) {
    return 30.03235*t + 8.772972*(t**2)/2 - 3.988133*(t**3)/3 + 0.788313*(t**4)/4 - 0.741599/(-1 * t) - 11.32468
  } else {
    return 20.91111*t + 10.72071*(t**2)/2 - 2.020498*(t**3)/3 + 0.146449*(t**4)/4 + 9.245722/(-1 * t) + 5.337651
  }
}

function hN2(T) {
  const t = T / 1000;
  if ( T < 500 ) {
    return 28.98641*t + 1.853978*(t**2)/2 - 9.647459*(t**3)/3 + 16.63537*(t**4)/4 + 0.000117/(-1 * t) - 8.671914
  } else if ( T < 2000 ) {
    return 19.50583*t + 19.88705*(t**2)/2 - 8.598535*(t**3)/3 + 1.369784*(t**4)/4 + 0.527601/(-1 * t) - 4.935202
  } else {
    return 35.51872*t + 1.128728*(t**2)/2 - 0.196103*(t**3)/3 + 0.014662*(t**4)/4 - 4.553760/(-1 * t) - 18.97091
  }
}

function hMethane(T) {
  const t = T / 1000;
  return -0.703029*t + 108.4773*(t**2)/2 - 42.52157*(t**3)/3 + 5.862788*(t**4)/4 + 0.678565/(-1 * t) - 76.84376 + 74.87310
}

function hEthane(T) {
  const t = T / 1000;
  return 29.1*t + 66.0*(t**2)/2 - 11.6096
}

function hAcetylene(T) {
  const t = T / 1000;
  return 23.13*t + 62.2*(t**2)/2 - 9.66079
}

function hPropane(T) {
  const t = T / 1000;
  return 26.82*t + 144.8*(t**2)/2 - 14.4323
}

function hButane(T) {
  const t = T / 1000;
  return 20.79*t + 345.6*(t**2)/2 - 21.559
}

// Heats of formation (kJ/mol)
const HfH2O = -241.83;
const HfCO2 = -393.51;
const HfO2 = 0;
const HfMethane = -74.87;
const HfEthane = -84;
const HfAcetylene = 227;
const HfPropane = -104.7;
const HfButane = -126;

window.findFlameTemp = function() {

  const fuel = simulationSettings.fuel;

  let nH2O, nCO2, nO2, nN2, nFuel; // mol / hr
  
  nFuel = simulationSettings.inletFuelMolarFlowRate; // mol / hr

  let Hr; // Heat of reaction ( kJ / mol )
  let hFuel;

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
      Hr = -1 * HfMethane - 2 * HfO2 + 2 * HfH2O + 1 * HfCO2;
      hFuel = hMethane;

    break;

    case "ethane":
      nO2 = 3.5 * nFuel;
      nCO2 = 2 * nFuel;
      nH2O = 3 * nFuel;
      Hr = -1 * HfEthane - 3.5 * HfO2 + 3 * HfH2O + 2 * HfCO2;
      hFuel = hEthane;
    break;

    case "acetylene":
      nO2 = 2.5 * nFuel;
      nCO2 = 2 * nFuel;
      nH2O = nFuel;
      Hr = -1 * HfAcetylene - 2.5 * HfO2 + 1 * HfH2O + 2 * HfCO2;
      hFuel = hAcetylene;
    break;

    case "propane":
      nO2 = 5 * nFuel;
      nCO2 = 3 * nFuel;
      nH2O = 4 * nFuel;
      Hr = -1 * HfPropane - 5 * HfO2 + 4 * HfH2O + 3 * HfCO2;
      hFuel = hPropane;
    break;

    case "butane":
      nO2 = 6.5 * nFuel;
      nCO2 = 4 * nFuel;
      nH2O = 5 * nFuel;
      Hr = -1 * HfAcetylene - 6.5 * HfO2 + 5 * HfH2O + 4 * HfCO2;
      hFuel = hButane;
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

  const totalHeat = -1 * nFuel * Hr;

  const FuelInletHeat = -1 * nFuel * hFuel(TFuel);
  const OxygenInletHeat = -1 * (nO2 + xO2) * hO2(TOxidizer);
  const NitrogenInletHeat = -1 * nN2 * hN2(TOxidizer);
  const InletHeat = FuelInletHeat + OxygenInletHeat + NitrogenInletHeat;

  let ProductsHeat = 0; // Initial value
  let TFlame = 298; // Initial guess for flame temperature

  while ( ProductsHeat + InletHeat < totalHeat ) {
    TFlame += 1000;
    ProductsHeat = 
      xO2 * hO2(TFlame) +
      nN2 * hN2(TFlame) +
      nCO2 * hCO2(TFlame) + 
      nH2O * hH2O(TFlame);
  }

  while ( ProductsHeat + InletHeat > totalHeat ) {
    TFlame -= 100;
    ProductsHeat = 
      xO2 * hO2(TFlame) +
      nN2 * hN2(TFlame) +
      nCO2 * hCO2(TFlame) + 
      nH2O * hH2O(TFlame);
  }

  while ( ProductsHeat + InletHeat < totalHeat ) {
    TFlame += 10;
    ProductsHeat = 
      xO2 * hO2(TFlame) +
      nN2 * hN2(TFlame) +
      nCO2 * hCO2(TFlame) + 
      nH2O * hH2O(TFlame);
  }

  while ( ProductsHeat + InletHeat > totalHeat ) {
    TFlame -= 1;
    ProductsHeat = 
      xO2 * hO2(TFlame) +
      nN2 * hN2(TFlame) +
      nCO2 * hCO2(TFlame) + 
      nH2O * hH2O(TFlame);
  }

  return TFlame
}
