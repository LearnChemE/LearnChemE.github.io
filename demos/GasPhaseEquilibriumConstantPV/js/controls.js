//const selectionElement = document.getElementById('selection');
const pressureSlider = document.getElementById("pressure-slider");
//const pressureSliderWrapper = document.getElementById("pressure-slider-wrapper");
const volumeSlider = document.getElementById("volume-slider");
//const volumeSliderWrapper = document.getElementById("volume-slider-wrapper");
const molesInertsSlider = document.getElementById("moles-inerts-slider");

//window.selection = selectionElement.value;

pressureSlider.addEventListener("input", function () {
  // The default value of a slider is a string, so we always first convert it to a number.
  z.pressureConstPressureCase = Number(pressureSlider.value);
  const pressureLabel = document.getElementById("pressure-value");
  pressureLabel.innerHTML = z.pressureConstPressureCase.toFixed(1);
});

volumeSlider.addEventListener("input", function () {
  // The default value of a slider is a string, so we always first convert it to a number.
  z.volumeConstVolumeCase = Number(volumeSlider.value);
  const volumeLabel = document.getElementById("volume-value");
  volumeLabel.innerHTML = z.volumeConstVolumeCase.toFixed(2);
});

molesInertsSlider.addEventListener("input", function () {
  z.molesInerts = Number(molesInertsSlider.value);
  const molesInertsLabel = document.getElementById("moles-inerts-value");
  molesInertsLabel.innerHTML = z.molesInerts.toFixed(1);
});

/* selectionElement.addEventListener("change", function () {
  const value = selectionElement.value;
  window.selection = value;
 
});
 */
