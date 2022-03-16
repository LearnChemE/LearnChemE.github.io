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

heatSlider.addEventListener("mousedown", () => {
  heatSlider.classList.add("mousedown");
});

pressureSlider.addEventListener("input", () => {
  const pressure = Number(pressureSlider.value);
  gvs.P = pressure * 101325;
  pressureValue.innerHTML = pressure.toFixed(1);
  gvs.p.redraw();
});

pressureSlider.addEventListener("mousedown", () => {
  pressureSlider.classList.add("mousedown");
});

document.body.addEventListener("mouseup", () => {
  heatSlider.classList.remove("mousedown");
  pressureSlider.classList.remove("mousedown");
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
      pressureSlider.value = "1.0";
      pressureValue.innerHTML = "1.0";
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
      pressureSlider.value = "1.0";
      pressureValue.innerHTML = "1.0";
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
      pressureSlider.value = "1.0";
      pressureValue.innerHTML = "1.0";
      pressureSlider.setAttribute("max", "8.0");
    break;

    case "spring":
      heatRow.style.display = "grid";
      pressureRow.style.display = "none";
      gvs.piston_height = 0.5;
      gvs.heat_added = 0;
      gvs.T = 273;
      gvs.P = 101325;
      gvs.V = 0.0224 / 0.35 * 0.5;
      gvs.n = 1.429;
      heatSlider.value = "0";
      heatValue.innerHTML = "0.0";
      pressureSlider.value = "1.0";
      pressureValue.innerHTML = "1.0";
    break;

    case "constant-t":
      heatRow.style.display = "none";
      pressureRow.style.display = "grid";
      gvs.piston_height = 0.8;
      gvs.heat_added = 0;
      gvs.T = 273;
      gvs.P = 101325;
      gvs.V = 0.0224 / 0.35 * 0.8;
      gvs.n = 2.287;
      heatSlider.value = "0";
      heatValue.innerHTML = "0.0";
      pressureSlider.value = "1.0";
      pressureValue.innerHTML = "1.0";
      pressureSlider.setAttribute("max", "4.0");
    break;
  }
  gvs.p.redraw();
});

const constantPHeader = document.getElementById("constant-p-header");
const constantPContent = document.getElementById("constant-p-content");
const constantVHeader = document.getElementById("constant-v-header");
const constantVContent = document.getElementById("constant-v-content");
const adiabaticReversibleHeader = document.getElementById("adiabatic-reversible-header");
const adiabaticReversibleContent = document.getElementById("adiabatic-reversible-content");
const externalSpringHeader = document.getElementById("external-spring-header");
const externalSpringContent = document.getElementById("external-spring-content");
const constantTHeader = document.getElementById("constant-t-header");
const constantTContent = document.getElementById("constant-t-content");

constantPHeader.addEventListener("click", () => {
  constantPHeader.classList.add("active");
  constantVHeader.classList.remove("active");
  adiabaticReversibleHeader.classList.remove("active");
  externalSpringHeader.classList.remove("active");
  constantTHeader.classList.remove("active");

  constantPContent.classList.add("active");
  constantVContent.classList.remove("active");
  adiabaticReversibleContent.classList.remove("active");
  externalSpringContent.classList.remove("active");
  constantTContent.classList.remove("active");
});

constantVHeader.addEventListener("click", () => {
  constantPHeader.classList.remove("active");
  constantVHeader.classList.add("active");
  adiabaticReversibleHeader.classList.remove("active");
  externalSpringHeader.classList.remove("active");
  constantTHeader.classList.remove("active");

  constantPContent.classList.remove("active");
  constantVContent.classList.add("active");
  adiabaticReversibleContent.classList.remove("active");
  externalSpringContent.classList.remove("active");
  constantTContent.classList.remove("active");
});

adiabaticReversibleHeader.addEventListener("click", () => {
  constantPHeader.classList.remove("active");
  constantVHeader.classList.remove("active");
  adiabaticReversibleHeader.classList.add("active");
  externalSpringHeader.classList.remove("active");
  constantTHeader.classList.remove("active");

  constantPContent.classList.remove("active");
  constantVContent.classList.remove("active");
  adiabaticReversibleContent.classList.add("active");
  externalSpringContent.classList.remove("active");
  constantTContent.classList.remove("active");
});

externalSpringHeader.addEventListener("click", () => {
  constantPHeader.classList.remove("active");
  constantVHeader.classList.remove("active");
  adiabaticReversibleHeader.classList.remove("active");
  externalSpringHeader.classList.add("active");
  constantTHeader.classList.remove("active");

  constantPContent.classList.remove("active");
  constantVContent.classList.remove("active");
  adiabaticReversibleContent.classList.remove("active");
  externalSpringContent.classList.add("active");
  constantTContent.classList.remove("active");
});

constantTHeader.addEventListener("click", () => {
  constantPHeader.classList.remove("active");
  constantVHeader.classList.remove("active");
  adiabaticReversibleHeader.classList.remove("active");
  externalSpringHeader.classList.remove("active");
  constantTHeader.classList.add("active");

  constantPContent.classList.remove("active");
  constantVContent.classList.remove("active");
  adiabaticReversibleContent.classList.remove("active");
  externalSpringContent.classList.remove("active");
  constantTContent.classList.add("active");
});