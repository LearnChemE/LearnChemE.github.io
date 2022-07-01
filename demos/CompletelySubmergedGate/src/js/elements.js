window.g.waterSlider = document.getElementById("water-slider");
window.g.weightSlider = document.getElementById("weight-slider");
window.g.waterValueDisplay = document.getElementById("water-value");
window.g.weightValueDisplay = document.getElementById("weight-value");
window.g.inputArea = document.getElementsByClassName("input-area")[0];

g.waterSlider.addEventListener("input", () => {
  g.waterValue = Number(Number(g.waterSlider.value).toFixed(2));
  g.waterValueDisplay.innerHTML = Number(g.waterValue).toFixed(2);
  g.p.redraw();
});

g.weightSlider.addEventListener("input", () => {
  g.weightValue = Number(Number(g.weightSlider.value).toFixed(2));
  g.weightValueDisplay.innerHTML = Number(g.weightValue).toFixed(2);
  g.p.redraw();
});

g.align = () => {

}
