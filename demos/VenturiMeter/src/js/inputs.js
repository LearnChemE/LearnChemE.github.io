const innerDiameterSlider = document.getElementById("inner-diameter-slider");
const innerDiameterValue = document.getElementById("inner-diameter-value");

innerDiameterSlider.addEventListener("input", () => {
  const innerDiameter = Number(innerDiameterSlider.value);
  innerDiameterValue.innerHTML = innerDiameter.toFixed(1);
  gvs.inner_diameter = innerDiameter;
  gvs.p.redraw();
});