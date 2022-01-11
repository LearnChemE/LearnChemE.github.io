const heatSlider = document.getElementById("q-slider");
const heatValue = document.getElementById("q-value");
const modeSelection = document.getElementById("select-mode");
const pressureSlider = document.getElementById("p-slider");
const pressureValue = document.getElementById("p-value");
const heatRow = document.getElementById("heat-row");
const pressureRow = document.getElementById("pressure-row");

heatSlider.addEventListener("input", () => {
  const heat = Number(heatSlider.value);
  gvs.heat_added = heat * 1000;
  heatValue.innerHTML = heat.toFixed(1);
  gvs.p.redraw();
});

pressureSlider.addEventListener("input", () => {
  const pressure = Number(pressureSlider.value);
  gvs.P = pressure * 101325;
  pressureValue.innerHTML = pressure.toFixed(1);
  gvs.p.redraw();
})

modeSelection.addEventListener("input", () => {
  const value = modeSelection.value;
  gvs.piston_mode = value;
  switch(value) {
    case "constant-p":
      heatRow.style.display = "grid";
      pressureRow.style.display = "none";
      gvs.piston_height = 0.35;
      gvs.heat_added = 0;
      gvs.T = 273;
      gvs.P = 101325;
      gvs.V = 0.0224;
      gvs.n = 1;
      heatSlider.value = "0";
      heatValue.innerHTML = "0.0";
    break;

    case "constant-v":
      heatRow.style.display = "grid";
      pressureRow.style.display = "none";
      gvs.piston_height = 0.5;
      gvs.heat_added = 0;
      gvs.T = 273;
      gvs.P = 101325;
      gvs.V = 0.05;
      gvs.n = gvs.P * gvs.V / ( gvs.R * gvs.T );
      heatSlider.value = "0";
      heatValue.innerHTML = "0.0";
    break;

    case "adiabatic-reversible":
      heatRow.style.display = "none";
      pressureRow.style.display = "grid";
      gvs.piston_height = 0.8;
      gvs.heat_added = 0;
      gvs.T = 273;
      gvs.P = 101325;
      gvs.V = 0.0224 / 0.35 * 0.8;
      gvs.n = 2.286;
      heatSlider.value = "0";
      heatValue.innerHTML = "0.0";
    break;

    case "spring":

    break;

    case "constant-t":

    break;
  }
  gvs.p.redraw();
})