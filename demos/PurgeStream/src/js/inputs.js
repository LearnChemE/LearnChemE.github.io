const XSlider = document.getElementById("X-slider");
const PSlider = document.getElementById("P-slider");
const XValue = document.getElementById("X-value");
const PValue = document.getElementById("P-value");

XSlider.addEventListener("input", () => {
  gvs.X = Number(XSlider.value);
  XValue.innerHTML = `${gvs.X.toFixed(2)}`;
  document.getElementById("conversion-value").innerHTML = `${gvs.X.toFixed(2)}`;
  gvs.p.redraw();
});

PSlider.addEventListener("input", () => {
  gvs.P = Number(PSlider.value);
  PValue.innerHTML = `${gvs.P.toFixed(2)}`;
  gvs.p.redraw();
});