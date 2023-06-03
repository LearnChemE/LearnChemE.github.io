const numberOfCSTRsSlider = document.getElementById("number-of-cstrs-slider");
const spacetimeSlider = document.getElementById("spacetime-slider");
const numberOfCSTRsValue = document.getElementById("number-of-cstrs-value");
const spacetimeValue = document.getElementById("spacetime-value");

numberOfCSTRsSlider.addEventListener("input", () => {
  const n = Number(numberOfCSTRsSlider.value);
  numberOfCSTRsValue.innerHTML = `${n}`;
  gvs.n = n;
  gvs.p.redraw();
});

spacetimeSlider.addEventListener("input", () => {
  const tau = Number(spacetimeSlider.value);
  spacetimeValue.innerHTML = `${Math.round(tau / 60)}`;
  gvs.tau = tau;
  gvs.p.redraw();
});