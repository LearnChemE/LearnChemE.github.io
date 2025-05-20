const inletPressureSlider = document.getElementById("inlet-pressure-slider");
const outletPressureSlider = document.getElementById("outlet-pressure-slider");
const inletTemperatureSlider = document.getElementById("inlet-temperature-slider");

inletPressureSlider.addEventListener("input", function () {
  // The default value of a slider is a string, so we always first convert it to a number.
  z.inletPressure = Number(inletPressureSlider.value);
  const inletPressureLabel = document.getElementById("inlet-pressure-value");
  inletPressureLabel.innerHTML = z.inletPressure.toFixed(0);
});

outletPressureSlider.addEventListener("input", function () {
  z.outletPressure = Number(outletPressureSlider.value);
  const outletPressureLabel = document.getElementById("outlet-pressure-value");
  outletPressureLabel.innerHTML = z.outletPressure.toFixed(2);
});

inletTemperatureSlider.addEventListener("input", function () {
  z.inletTemperature = Number(inletTemperatureSlider.value);
  const inletTemperatureLabel = document.getElementById("inlet-temperature-value");
  inletTemperatureLabel.innerHTML = z.inletTemperature.toFixed(0);
  document.getElementById("gas-type").onclick = function () {
    inletTemperatureLabel.innerHTML = 500;
    inletTemperatureSlider.value = "500";
    z.inletTemperature = 500;
  };
});
