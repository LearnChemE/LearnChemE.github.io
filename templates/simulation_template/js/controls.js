const selectionElement = document.getElementById('selection');
const densitySlider = document.getElementById('density-slider');
const playButton = document.getElementById("play");
const pauseButton = document.getElementById("pause");

selectionElement.addEventListener('input', function() {
  // This corresponds to the "value" attribute of each option in the select element.
  const value = selectionElement.value;
  switch (value) {
    case "a":
      g.selection = "Option 1";
      break;
    case "b":
      g.selection = "Option 2";
      break;
    case "c":
      g.selection = "Option 3";
      break;
    default:
      g.selection = "Option 1";
  }
  if (!g.playing) {
    redraw();
  }
});

densitySlider.addEventListener('input', function() {
  // The default value of a slider is a string, so we always first convert it to a number.
  g.density = Number(densitySlider.value);
  const densityLabel = document.getElementById("density-value");
  densityLabel.innerHTML = g.density.toFixed(2);
  if (!g.playing) {
    redraw();
  }
});

playButton.addEventListener('click', function() {
  g.playing = true;
  loop();
});

pauseButton.addEventListener('click', function() {
  g.playing = false;
  noLoop();
});