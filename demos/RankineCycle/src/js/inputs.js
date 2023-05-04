const PHDiagramButton = document.getElementById("p-h-diagram-button");
const turbineButton = document.getElementById("turbine-button");
const rankineCycleButton = document.getElementById("rankine-cycle-button");
const turbineEfficiencySlider = document.getElementById("turbine-efficiency-slider");
const turbineEfficiencyValue = document.getElementById("turbine-efficiency-value");
const inletP3Slider = document.getElementById("inlet-p3-pressure-slider");
const inletP3Value = document.getElementById("inlet-p3-pressure-value");
const outletP4Slider = document.getElementById("outlet-p4-pressure-slider");
const outletP4Value = document.getElementById("outlet-p4-pressure-value");

PHDiagramButton.addEventListener("click", () => {
  gvs.display = "P-H diagram";
  PHDiagramButton.classList.add("active");
  turbineButton.classList.remove("active");
  rankineCycleButton.classList.remove("active");
  gvs.p.redraw();
});

turbineButton.addEventListener("click", () => {
  gvs.display = "turbine";
  PHDiagramButton.classList.remove("active");
  turbineButton.classList.add("active");
  rankineCycleButton.classList.remove("active");
  gvs.p.redraw();
});

rankineCycleButton.addEventListener("click", () => {
  gvs.display = "Rankine cycle";
  PHDiagramButton.classList.remove("active");
  turbineButton.classList.remove("active");
  rankineCycleButton.classList.add("active");
  gvs.p.redraw();
});

turbineEfficiencySlider.addEventListener("input", () => {
  const efficiency = Number(turbineEfficiencySlider.value);
  gvs.turbine_efficiency = efficiency;
  turbineEfficiencyValue.innerHTML = `${efficiency.toFixed(2)}`;
  gvs.p.redraw();
});

inletP3Slider.addEventListener("input", () => {
  const pressure = Number(inletP3Slider.value);
  gvs.inlet_p3_pressure = pressure;
  inletP3Value.innerHTML = `${pressure.toFixed(2)}`;
  gvs.p.redraw();
});

outletP4Slider.addEventListener("input", () => {
  const pressure = 
    outletP4Slider.value === "1" ? 0.01
    : outletP4Slider.value === "2" ? 0.1
    : outletP4Slider.value === "3" ? 0.2
    : 0.3;
  gvs.outlet_p4_pressure = pressure;
  outletP4Value.innerHTML = `${pressure.toFixed(2)}`;
  gvs.p.redraw();
});