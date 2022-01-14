const zSlider = document.getElementById("z-slider");
const zValue = document.getElementById("z-value");
const evapSlider = document.getElementById("evap-slider");
const evapValue = document.getElementById("evap-value");

zSlider.addEventListener("input", () => {
  const z = Number(zSlider.value);
  zValue.innerHTML = `${z.toFixed(2)}`;
  gvs.z = z;
  gvs.p.redraw();
});

evapSlider.addEventListener("input", () => {
  const evap = Number(evapSlider.value);
  evapValue.innerHTML = `${evap.toFixed(2)}`;
  gvs.amount_to_evaporate = evap;
  gvs.p.redraw();
})