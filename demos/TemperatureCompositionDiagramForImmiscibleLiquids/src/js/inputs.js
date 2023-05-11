const pressureSlider = document.getElementById("pressure-slider");
const pressureValue = document.getElementById("pressure-value");
const xSlider = document.getElementById("x-slider");
const xValue = document.getElementById("x-value");
const QSlider = document.getElementById("Q-slider");
const QValue = document.getElementById("Q-value");
const reset = document.getElementById("reset");
const showLabels = document.getElementById("show-labels");

pressureSlider.addEventListener("input", () => {
  const pressure = Number(pressureSlider.value);
  gvs.P = pressure;
  pressureValue.innerHTML = pressure.toFixed(1);
  gvs.p.redraw();
});

xSlider.addEventListener("input", () => {
  const x = Number(xSlider.value);
  gvs.x = x;
  xValue.innerHTML = x.toFixed(2);
  gvs.p.redraw();
});

QSlider.addEventListener("input", () => {
  const Q = Number(QSlider.value);
  gvs.Q = Q;
  QValue.innerHTML = Q.toFixed(0);
  gvs.p.redraw();
});

reset.addEventListener("mousedown", () => {
  resetConditions();
  reset.classList.add("mousedown");
});

reset.addEventListener("mouseup", () => {
  reset.classList.remove("mousedown");
});

function resetConditions() {
  gvs.P = 12.5;
  gvs.Q = 0;
  gvs.x = 0.5;
  gvs.show_labels = false;
  pressureSlider.value = "12.5";
  pressureValue.innerHTML = "12.5";
  xSlider.value = "0.5";
  xValue.innerHTML = "0.50";
  QSlider.value = "0";
  QValue.innerHTML = "0";
  gvs.p.redraw();
}

showLabels.addEventListener("change", () => {
  const show = showLabels.checked;
  if(show) {
    gvs.show_labels = true;
  } else {
    gvs.show_labels = false;
  }
  gvs.p.redraw();
});