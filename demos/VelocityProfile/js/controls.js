//const selectionElement = document.getElementById('selection');
const densitySlider = document.getElementById('density-slider');
//const playButton = document.getElementById("play");
//const pauseButton = document.getElementById("pause");



densitySlider.addEventListener('input', function() {
  // The default value of a slider is a string, so we always first convert it to a number.
  g.density = Number(densitySlider.value);
  const densityLabel = document.getElementById("density-value");
  densityLabel.innerHTML = g.density.toFixed(2);
  
});

