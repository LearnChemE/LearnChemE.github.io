const A12Slider = document.getElementById("A12-slider");
const A21Slider = document.getElementById("A21-slider");
const plotSelectionElement = document.querySelector('input[name="plot"]:checked');
state.plotSelection = plotSelectionElement.value;

export function positiveSlidersCase() {
  A12Slider.max = 2;
  A12Slider.min = 0;
  A21Slider.max = 2;
  A21Slider.min = 0;

  A12Slider.addEventListener("input", function () {
    // The default value of a slider is a string, so we always first convert it to a number.
    state.A12PositiveValue = Number(A12Slider.value);
    const A12Label = document.getElementById("A12-value");
    A12Label.innerHTML = state.A12PositiveValue.toFixed(1);
  });

  A21Slider.addEventListener("input", function () {
    state.A21PositiveValue = Number(A21Slider.value);
    const A21Label = document.getElementById("A21-value");
    A21Label.innerHTML = state.A21PositiveValue.toFixed(1);
  });
}

export function negativeSlidersCase() {
  A12Slider.max = 0;
  A12Slider.min = -2;
  A21Slider.max = 0;
  A21Slider.min = -2;

  A12Slider.addEventListener("input", function () {
    // The default value of a slider is a string, so we always first convert it to a number.
    state.A12NegativeValue = Number(A12Slider.value);
    const A12Label = document.getElementById("A12-value");
    A12Label.innerHTML = state.A12NegativeValue.toFixed(1);
  });

  A21Slider.addEventListener("input", function () {
    state.A21NegativeValue = Number(A21Slider.value);
    const A21Label = document.getElementById("A21-value");
    A21Label.innerHTML = state.A21NegativeValue.toFixed(1);
  });
}
