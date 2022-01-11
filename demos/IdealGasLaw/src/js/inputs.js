const heatSlider = document.getElementById("q-slider");
const heatValue = document.getElementById("q-value");

heatSlider.addEventListener("input", () => {
  const heat = Number(heatSlider.value);
  gvs.heat_added = heat;
  heatValue.innerHTML = Number(gvs.heat_added).toFixed(0);
  gvs.p.redraw();
});
