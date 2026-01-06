const A12Slider = document.getElementById("A12-slider");
const A21Slider = document.getElementById("A21-slider");

A12Slider.addEventListener("input", function () {
  // The default value of a slider is a string, so we always first convert it to a number.
  z.A12Value = Number(A12Slider.value);
  const A12Label = document.getElementById("A12-value");
  A12Label.innerHTML = z.A12Value.toFixed(1);
});

A21Slider.addEventListener("input", function () {
  // The default value of a slider is a string, so we always first convert it to a number.
  z.A21Value = Number(A21Slider.value);
  const A21Label = document.getElementById("A21-value");
  A21Label.innerHTML = z.A21Value.toFixed(1);
});
