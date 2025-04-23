//const selectionElement = document.getElementById('selection');
const pressureSlider = document.getElementById('pressure-slider');
const volumeSlider = document.getElementById('volume-slider');
const molesInertsSlider = document.getElementById('moles-inerts-slider');

pressureSlider.addEventListener('input', function () {
  // The default value of a slider is a string, so we always first convert it to a number.
  z.pressureCP = Number(pressureSlider.value);
  const pressureLabel = document.getElementById("pressure-value");
  pressureLabel.innerHTML = z.pressureCP.toFixed(2);

});

volumeSlider.addEventListener('input', function () {
  // The default value of a slider is a string, so we always first convert it to a number.
  z.volumeCV = Number(volumeSlider.value);
  const volumeLabel = document.getElementById("volume-value");
  volumeLabel.innerHTML = z.volumeCV.toFixed(2);

});

molesInertsSlider.addEventListener('input', function () {
  z.molesInerts = Number(molesInertsSlider.value);
  const molesInertsLabel = document.getElementById("moles-inerts-value");
  molesInertsLabel.innerHTML = z.molesInerts.toFixed(1);

});




