const flowRateSlider = document.getElementById("f-slider");
const flowRateValue = document.getElementById("f-value");
const feedTempSlider = document.getElementById("t-slider");
const feedTempValue = document.getElementById("t-value");

flowRateSlider.addEventListener("input", () => {
  flowRateValue.innerHTML = flowRateSlider.value;
  gvs.f_inlet = Number(flowRateSlider.value);
});

feedTempSlider.addEventListener("input", () => {
  feedTempValue.innerHTML = feedTempSlider.value;
  gvs.t_inlet = Number(feedTempSlider.value);
});