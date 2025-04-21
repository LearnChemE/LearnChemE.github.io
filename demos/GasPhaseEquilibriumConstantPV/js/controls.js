//const selectionElement = document.getElementById('selection');
const pressureSlider = document.getElementById('pressure-slider');
const molesInertsSlider = document.getElementById('moles-inerts-slider');


//const playButton = document.getElementById("play");
//const pauseButton = document.getElementById("pause");

pressureSlider.addEventListener('input', function() {
  // The default value of a slider is a string, so we always first convert it to a number.
  z.pressure = Number(pressureSlider.value);
  const pressureLabel = document.getElementById("pressure-value");
  pressureLabel.innerHTML = z.pressure.toFixed(1);
  
});

molesInertsSlider.addEventListener('input', function() {
  // The default value of a slider is a string, so we always first convert it to a number.
  z.molesInerts = Number(molesInertsSlider.value);
  const molesInertsLabel = document.getElementById("moles-inerts-value");
  molesInertsLabel.innerHTML = z.molesInerts.toFixed(1);
  
});