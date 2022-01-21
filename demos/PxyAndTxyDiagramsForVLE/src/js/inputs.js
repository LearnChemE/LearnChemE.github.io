const pressureSlider = document.getElementById("P-slider");
const pressureValue = document.getElementById("P-value");
const temperatureSlider = document.getElementById("T-slider");
const temperatureValue = document.getElementById("T-value");
const selectPlot = document.getElementById("select-plot");

temperatureSlider.addEventListener("input", () => {
  const T = Number(temperatureSlider.value);
  gvs.T = T;
  gvs.calc_Tsat();
  gvs.pxy_bubble_point.updateCoords();
  gvs.pxy_bubble_point.drawCurve();
  gvs.pxy_dew_point.updateCoords();
  gvs.pxy_dew_point.drawCurve();
  temperatureValue.innerHTML = `${T.toFixed(0)}°`;
  gvs.p.redraw();
});

pressureSlider.addEventListener("input", () => {
  const P = Number(pressureSlider.value);
  gvs.P = P;
  gvs.calc_Tsat();
  gvs.txy_bubble_point.updateCoords();
  gvs.txy_bubble_point.drawCurve();
  gvs.txy_dew_point.updateCoords();
  gvs.txy_dew_point.drawCurve();
  pressureValue.innerHTML = `${P.toFixed(2)}`;
  gvs.p.redraw();
});

selectPlot.addEventListener("change", () => {
  const plot = selectPlot.value;
  gvs.plot = plot;
  if(plot === "P-x-y") {
    gvs.txy_plot.container.classList.add("hidden");
    gvs.txy_plot.tickLabels.classList.add("hidden");
    gvs.pxy_plot.container.classList.remove("hidden");
    gvs.pxy_plot.tickLabels.classList.remove("hidden");
    document.getElementById("pressure-slider-container").style.display = "none";
    document.getElementById("temperature-slider-container").style.display = "grid";
  } else {
    gvs.txy_plot.container.classList.remove("hidden");
    gvs.txy_plot.tickLabels.classList.remove("hidden");
    gvs.pxy_plot.container.classList.add("hidden");
    gvs.pxy_plot.tickLabels.classList.add("hidden");
    document.getElementById("pressure-slider-container").style.display = "grid";
    document.getElementById("temperature-slider-container").style.display = "none";
  }
  gvs.p.redraw();
})