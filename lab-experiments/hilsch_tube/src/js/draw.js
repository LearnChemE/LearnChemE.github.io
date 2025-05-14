const svg = state.svg;
const hotSideTemperatureText = svg.getElementById("hot-side-temperature");
const coldSideTemperatureText = svg.getElementById("cold-side-temperature");
const inletRotameterReadout = svg.getElementById("rotameter-1-readout");
const outletRotameterReadout = svg.getElementById("rotameter-2-readout");
const inletPressureNeedle = svg.getElementById("pressure-needle-1");
const outletPressureNeedle = svg.getElementById("pressure-needle-2");

function displayTemperatures() {
  hotSideTemperatureText.innerHTML = (round(state.hotSideDisplayedTemperature * 10) / 10).toFixed(1);
  coldSideTemperatureText.innerHTML = (round(state.coldSideDisplayedTemperature * 10) / 10).toFixed(1);
}

function displayPressures() {
  const translate = "translate(31.5,213)";
  const inletPressureRotation = map(state.inletPressure, 0, 8, 0, 240);
  const outletPressureRotation = map(state.outletPressure, 0, 8, 0, 240);
  inletPressureNeedle.setAttribute("transform", `${translate} rotate(${inletPressureRotation})`);
  outletPressureNeedle.setAttribute("transform", `${translate} rotate(${outletPressureRotation})`);
}

function displayFlowRates() {
  const inletOffsetY = map(state.inletVolumetricFlowRate, 0, 50, 0, -50);
  const outletOffsetY = map(state.outletVolumetricFlowRate, 0, 100, 0, -50);
  inletRotameterReadout.setAttribute("transform", `translate(0, ${inletOffsetY})`);
  outletRotameterReadout.setAttribute("transform", `translate(0, ${outletOffsetY})`);
}

module.exports = function drawAll() {
  if (frameCount % 60 === 0) {
    state.hotSideDisplayedTemperature = state.hotSideDisplayedTemperature + (state.hotSideTemperature - state.hotSideDisplayedTemperature) * 0.3;
    state.coldSideDisplayedTemperature = state.coldSideDisplayedTemperature + (state.coldSideTemperature - state.coldSideDisplayedTemperature) * 0.3;
  }
  displayTemperatures();
  displayPressures();
  displayFlowRates();
}