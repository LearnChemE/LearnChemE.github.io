const pressureSlider = document.getElementById("feed-pressure");
// Function to update slider value display
function updateSliderValue(sliderId) {
  // Get the slider element
  const slider = document.getElementById(sliderId);

  // Get the current value element
  const currentValue = slider.parentElement.querySelector(".current-value");

  // Get the slider's current value
  const value = parseFloat(slider.value);

  // Format the value based on the slider's step
  const step = parseFloat(slider.step);
  const decimals = step < 1 ? 1 : 0; // Show 1 decimal place for step < 1

  // Update the text to show the current value instead of "X"
  currentValue.textContent = value.toFixed(decimals);
}

// Add event listeners to the sliders
document.addEventListener("DOMContentLoaded", () => {
  // Set up Feed Pressure slider
  const pressureSlider = document.getElementById("feed-pressure");
  pressureSlider.addEventListener("input", () => updateSliderValue("feed-pressure"));
  updateSliderValue("feed-pressure");
  pressureSlider.addEventListener("input", () => (state.feedPressure = Number(pressureSlider.value)));
  state.feedPressure = Number(pressureSlider.value);

  // Set up Feed Temperature slider
  const tempSlider = document.getElementById("feed-temp");
  tempSlider.addEventListener("input", () => updateSliderValue("feed-temp"));
  updateSliderValue("feed-temp");
  tempSlider.addEventListener("input", () => (state.feedTemperature = Number(tempSlider.value)));
  state.feedTemperature = Number(tempSlider.value);

  // Set up NaCl Concentration slider
  const saltSlider = document.getElementById("salt-conc");
  saltSlider.addEventListener("input", () => updateSliderValue("salt-conc"));
  updateSliderValue("salt-conc");
  saltSlider.addEventListener("input", () => (state.saltConcentrationPercent = Number(saltSlider.value)));
  state.saltConcentrationPercent = Number(saltSlider.value);
});
