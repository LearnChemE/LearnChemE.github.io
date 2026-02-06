const positiveA12Slider = document.getElementById("positive-A12-slider");
const positiveA21Slider = document.getElementById("positive-A21-slider");
const negativeA12Slider = document.getElementById("negative-A12-slider");
const negativeA21Slider = document.getElementById("negative-A21-slider");
const plotSelectionElement = document.querySelector('input[name="plot"]:checked');
state.plotSelection = plotSelectionElement.value;

/* positiveA12Slider.max = 2;
  positiveA12Slider.min = 0;
  positiveA21Slider.max = 2;
  positiveA21Slider.min = 0; */

positiveA12Slider.addEventListener("input", function () {
  // The default value of a slider is a string, so we always first convert it to a number.
  state.positiveA12Value = Number(positiveA12Slider.value);
  const positiveA12Label = document.getElementById("positive-A12-value");
  positiveA12Label.innerHTML = state.positiveA12Value.toFixed(1);
});

positiveA21Slider.addEventListener("input", function () {
  state.positiveA21Value = Number(positiveA21Slider.value);
  const positiveA21Label = document.getElementById("positive-A21-value");
  positiveA21Label.innerHTML = state.positiveA21Value.toFixed(1);
});

/* negativeA12Slider.max = 0;
  negativeA12Slider.min = -2;
  negativeA21Slider.max = 0;
  negativeA21Slider.min = -2; */

negativeA12Slider.addEventListener("input", function () {
  // The default value of a slider is a string, so we always first convert it to a number.
  state.negativeA12Value = Number(negativeA12Slider.value);
  const negativeA12Label = document.getElementById("negative-A12-value");
  negativeA12Label.innerHTML = state.negativeA12Value.toFixed(1);
});

negativeA21Slider.addEventListener("input", function () {
  state.negativeA21Value = Number(negativeA21Slider.value);
  const negativeA21Label = document.getElementById("negative-A21-value");
  negativeA21Label.innerHTML = state.negativeA21Value.toFixed(1);
});
