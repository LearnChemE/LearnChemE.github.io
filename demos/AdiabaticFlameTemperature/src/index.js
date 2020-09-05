require("./style/style.scss");
const graphic = require("./media/graphic.svg").toString();
document.getElementById("graphic-container").innerHTML = graphic;
require("./js/insertGraphicsElements.js");
require("./js/calcs.js");

const fuelSelection = document.getElementById("fuel");
const oxidizerSelection = document.getElementById("oxidizer");
const O2slider = document.getElementById("excessO2");
const fuelSlider = document.getElementById("inletFuelTempSlider");
const oxidizerTempSlider = document.getElementById("inletOxidizerTempSlider"); 

O2slider.addEventListener('input', (e) => {  
  window.simulationSettings.excessO2 = O2slider.value;
  updateLabels();
});

oxidizerSelection.addEventListener('change', (e) => {
  window.simulationSettings.oxidizer = oxidizerSelection.value;
  updateLabels();
});

fuelSelection.addEventListener('change', (e) => {
  window.simulationSettings.fuel = fuelSelection.value;
  updateLabels();
});

fuelSlider.addEventListener('input', (e) => {
  window.simulationSettings.inletFuelTemperature = Number(fuelSlider.value) + 273;
  updateLabels();
});

oxidizerTempSlider.addEventListener('input', (e) => {
  window.simulationSettings.inletOxidizerTemperature = Number(oxidizerTempSlider.value) + 273;
  updateLabels();
})

window.updateLabels = function() {

  const fuelLabel = document.getElementById("fuelLabel");
  //const fuelFlowRate = document.getElementById("fuelFlowRate");
  const fuelTemp = document.getElementById("fuelTemp");
  const oxidizerLabel = document.getElementById("oxidizerLabel");
  const oxidizerSliderLabel = document.getElementById("excessO2label");
  const oxidizerFlowRate = document.getElementById("oxidizerFlowRate");
  const oxidizerTemp = document.getElementById("oxidizerTemp");
  const flameTemp = document.getElementById("flameTemp");
  const oxygenOutletFlowRate = document.getElementById("oxygenOutletFlowRate");
  const nitrogenOutletFlowRate = document.getElementById("nitrogenOutletFlowRate");
  const waterOutletFlowRate = document.getElementById("waterOutletFlowRate");
  const carbonDioxideOutletFlowRate = document.getElementById("carbonDioxideOutletFlowRate");
  const fuelTempSliderLabel = document.getElementById("inletFuelTemp");
  const oxidizerTempSliderLabel = document.getElementById("inletOxidizerTemp");

  switch(simulationSettings.fuel) {
    case "methane" : fuelLabel.innerHTML = "CH<sub>4</sub>"; break;
    case "ethane" : fuelLabel.innerHTML = "C<sub>2</sub>H<sub>6</sub>"; break;
    case "acetylene" : fuelLabel.innerHTML = "C<sub>2</sub>H<sub>2</sub>"; break;
    case "propane" : fuelLabel.innerHTML = "C<sub>3</sub>H<sub>8</sub>"; break;
    case "butane" : fuelLabel.innerHTML = "C<sub>4</sub>H<sub>10</sub>"; break;
  }

  flameTemp.innerHTML = `${window.findFlameTemp() - 273}`;

  fuelTemp.innerHTML = `${simulationSettings.inletFuelTemperature - 273}`;

  oxidizerLabel.innerHTML = simulationSettings.oxidizer === "air" ? "air" : "O<sub>2</sub>";

  oxidizerSliderLabel.innerHTML = `excess ${oxidizerSelection.value} = ${Number.parseInt(O2slider.value * 100)}%`;

  oxidizerFlowRate.innerHTML = `${Number.parseInt(simulationSettings.oxidizerFlowRate)}`;

  oxidizerTemp.innerHTML = `${Number.parseInt(simulationSettings.inletOxidizerTemperature - 273)}`;

  oxygenOutletFlowRate.innerHTML = `${Number.parseInt(simulationSettings.oxygenOutletFlowRate)}`;

  nitrogenOutletFlowRate.innerHTML = `${Number.parseInt(simulationSettings.nitrogenOutletFlowRate)}`;

  waterOutletFlowRate.innerHTML = `${Number.parseInt(simulationSettings.waterOutletFlowRate)}`;
  
  carbonDioxideOutletFlowRate.innerHTML = `${Number.parseInt(simulationSettings.carbonDioxideOutletFlowRate)}`;

  fuelTempSliderLabel.innerHTML = `${Number.parseInt(simulationSettings.inletFuelTemperature - 273)}`;

  oxidizerTempSliderLabel.innerHTML = `${Number.parseInt(simulationSettings.inletOxidizerTemperature - 273)}`;

}

updateLabels();
