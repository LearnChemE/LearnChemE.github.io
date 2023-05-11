const innerDiameterSlider = document.getElementById("inner-diameter-slider");
const innerDiameterValue = document.getElementById("inner-diameter-value");
const fluidFrictionCheckbox = document.getElementById("include-friction");

innerDiameterSlider.addEventListener("input", () => {
  const innerDiameter = Number(innerDiameterSlider.value);
  innerDiameterValue.innerHTML = innerDiameter.toFixed(1);
  gvs.inner_diameter = innerDiameter;
  gvs.p.redraw();
});

fluidFrictionCheckbox.addEventListener("change", () => {
  const checked = fluidFrictionCheckbox.checked;
  if(checked) {
    gvs.include_friction = true;
  } else {
    gvs.include_friction = false;
  }
  gvs.p.redraw();
});