const innerDiameterSlider = document.getElementById("inner-diameter-slider");
const innerDiameterValue = document.getElementById("inner-diameter-value");
const fluidFrictionCheckbox = document.getElementById("include-friction");
const volumetricFlowRateSlider = document.getElementById("v-slider");
const volumetricFlowRateValue = document.getElementById("v-value");
const showFlowRate = document.getElementById("show-flow-rate");

innerDiameterSlider.addEventListener("input", () => {
  const innerDiameter = Number(innerDiameterSlider.value);
  innerDiameterValue.innerHTML = innerDiameter.toFixed(1);
  gvs.inner_diameter = innerDiameter;
  gvs.discharge_coefficient = 1 - (0.05 + 0.15 * ((15 - gvs.inner_diameter) / (15 - 9.1)));
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

volumetricFlowRateSlider.addEventListener("input", () => {
  gvs.volumetric_flow_rate = Number(volumetricFlowRateSlider.value) / 10000;
  gvs.inlet_velocity = gvs.volumetric_flow_rate / (Math.PI * ((gvs.outer_diameter / 1000) / 2)**2);
  // volumetricFlowRateValue.innerHTML = `${(gvs.volumetric_flow_rate * 10000).toFixed(2)}`;
  gvs.p.redraw();
});

showFlowRate.addEventListener("input", () => {
  if(showFlowRate.checked) {
    gvs.show_flow_rate = true
  } else {
    gvs.show_flow_rate = false
  }
  gvs.p.redraw();
});