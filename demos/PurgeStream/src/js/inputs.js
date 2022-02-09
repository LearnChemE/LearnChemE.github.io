const XSlider = document.getElementById("X-slider");
const RSlider = document.getElementById("R-slider");
const XValue = document.getElementById("X-value");
const RValue = document.getElementById("R-value");

XSlider.addEventListener("input", () => {
  gvs.X = Number(XSlider.value);
  XValue.innerHTML = `${gvs.X.toFixed(2)}`;
  document.getElementById("conversion-value").innerHTML = `${gvs.X.toFixed(2)}`;
  gvs.p.redraw();
});

RSlider.addEventListener("input", () => {
  gvs.R = Number(RSlider.value);
  RValue.innerHTML = `${gvs.R.toFixed(2)}`;
  gvs.p.redraw();
});