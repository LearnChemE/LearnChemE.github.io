const zSlider = document.getElementById("z-slider");
const zValue = document.getElementById("z-value");
const evapSlider = document.getElementById("evap-slider");
const evapValue = document.getElementById("evap-value");
const displaySelect = document.getElementById("display-select");
const collectButton = document.getElementById("start-collection");
const resetButton = document.getElementById("reset-simulation");
const eqPlotSelect = document.getElementById("eq-plot-select");

zSlider.addEventListener("input", () => {
  const z = Number(zSlider.value);
  zValue.innerHTML = `${z.toFixed(2)}`;
  gvs.z = z;
  gvs.xB = z;
  switch(gvs.eq_plot) {
    case "no azeotrope":
      gvs.xD = gvs.no_azeotrope(gvs.xB);
      gvs.T = gvs.no_azeotrope_temperature(gvs.xB);
    break;

    case "minimum-temperature azeotrope":
      gvs.xD = gvs.minimum_temperature_azeotrope(gvs.xB);
      gvs.T = gvs.minimum_temperature_azeotrope_temperature(gvs.xB);
    break;

    case "maximum-temperature azeotrope":
      gvs.xD = gvs.maximum_temperature_azeotrope(gvs.xB);
      gvs.T = gvs.maximum_temperature_azeotrope_temperature(gvs.xB);
    break;
  }
  gvs.p.redraw();
});

evapSlider.addEventListener("input", () => {
  const evap = Number(evapSlider.value);
  evapValue.innerHTML = `${evap.toFixed(2)}`;
  gvs.amount_to_collect = evap;
  gvs.p.redraw();
});

displaySelect.addEventListener("change", () => {
  window.gvs.display = displaySelect.value;
  const eqPlot = document.getElementById("eq-plot");
  const txyPlot = document.getElementById("txy-plot");
  const eqPlotLabels = document.getElementById("eq-plot-tick-labels");
  const txyPlotLabels = document.getElementById("txy-plot-tick-labels");
  switch(gvs.display) {
    case "flasks":
      [eqPlot, txyPlot, eqPlotLabels, txyPlotLabels].forEach(plot => { plot.style.display = "none" })
    break;

    case "eq":
      eqPlot.style.display = "block";
      txyPlot.style.display = "none";
      eqPlotLabels.style.display = "block";
      txyPlotLabels.style.display = "none";
    break;

    case "txy":
      eqPlot.style.display = "none";
      txyPlot.style.display = "block";
      eqPlotLabels.style.display = "none";
      txyPlotLabels.style.display = "block";
    break;
  }
  gvs.p.redraw();
});

collectButton.addEventListener("click", () => {
  gvs.is_collecting = true;
  resetButton.setAttribute("disabled", "yes");
  zSlider.setAttribute("disabled", "yes");
  evapSlider.setAttribute("disabled", "yes");
  collectButton.setAttribute("disabled", "yes");
  eqPlotSelect.setAttribute("disabled", "yes");
  gvs.begin_collection();
});

resetButton.addEventListener("click", () => {
  gvs.is_collecting = false;
  zSlider.removeAttribute("disabled");
  evapSlider.removeAttribute("disabled");
  collectButton.removeAttribute("disabled");
  eqPlotSelect.removeAttribute("disabled");
  gvs.B = 1.0;
  gvs.xB = gvs.z;
  gvs.flasks = [];
  gvs.flasks.push(new gvs.Flask({ x_loc : 356, y_loc : 370 }));
  gvs.D = 0;
  switch(gvs.eq_plot) {
    case "no azeotrope":
      gvs.xD = gvs.no_azeotrope(gvs.xB);
      gvs.T = gvs.no_azeotrope_temperature(gvs.xB);
    break;

    case "minimum-temperature azeotrope":
      gvs.xD = gvs.minimum_temperature_azeotrope(gvs.xB);
      gvs.T = gvs.minimum_temperature_azeotrope_temperature(gvs.xB);
    break;

    case "maximum-temperature azeotrope":
      gvs.xD = gvs.maximum_temperature_azeotrope(gvs.xB);
      gvs.T = gvs.maximum_temperature_azeotrope_temperature(gvs.xB);
    break;
  }
  gvs.p.noLoop();
  gvs.p.redraw();
});

eqPlotSelect.addEventListener("change", () => {
  gvs.eq_plot = eqPlotSelect.value;
  switch(gvs.eq_plot) {
    case "no azeotrope":
      gvs.xD = gvs.no_azeotrope(gvs.xB);
      gvs.T = gvs.no_azeotrope_temperature(gvs.xB);
      gvs.no_azeotrope_curve.elt.style.display = "block";
      gvs.minimum_temperature_azeotrope_curve.elt.style.display = "none";
      gvs.maximum_temperature_azeotrope_curve.elt.style.display = "none";
      gvs.no_azeotrope_temperature_curve.elt.style.display = "block";
      gvs.minimum_temperature_azeotrope_temperature_curve.elt.style.display = "none";
      gvs.maximum_temperature_azeotrope_temperature_curve.elt.style.display = "none";
      gvs.no_azeotrope_dew_point_curve.elt.style.display = "block";
      gvs.minimum_temperature_azeotrope_dew_point_curve.elt.style.display = "none";
      gvs.maximum_temperature_azeotrope_dew_point_curve.elt.style.display = "none";
    break;

    case "minimum-temperature azeotrope":
      gvs.xD = gvs.minimum_temperature_azeotrope(gvs.xB);
      gvs.T = gvs.minimum_temperature_azeotrope_temperature(gvs.xB);
      gvs.no_azeotrope_curve.elt.style.display = "none";
      gvs.minimum_temperature_azeotrope_curve.elt.style.display = "block";
      gvs.maximum_temperature_azeotrope_curve.elt.style.display = "none";
      gvs.no_azeotrope_temperature_curve.elt.style.display = "none";
      gvs.minimum_temperature_azeotrope_temperature_curve.elt.style.display = "block";
      gvs.maximum_temperature_azeotrope_temperature_curve.elt.style.display = "none";
      gvs.no_azeotrope_dew_point_curve.elt.style.display = "none";
      gvs.minimum_temperature_azeotrope_dew_point_curve.elt.style.display = "block";
      gvs.maximum_temperature_azeotrope_dew_point_curve.elt.style.display = "none";
    break;

    case "maximum-temperature azeotrope":
      gvs.xD = gvs.maximum_temperature_azeotrope(gvs.xB);
      gvs.T = gvs.maximum_temperature_azeotrope_temperature(gvs.xB);
      gvs.no_azeotrope_curve.elt.style.display = "none";
      gvs.minimum_temperature_azeotrope_curve.elt.style.display = "none";
      gvs.maximum_temperature_azeotrope_curve.elt.style.display = "block";
      gvs.no_azeotrope_temperature_curve.elt.style.display = "none";
      gvs.minimum_temperature_azeotrope_temperature_curve.elt.style.display = "none";
      gvs.maximum_temperature_azeotrope_temperature_curve.elt.style.display = "block";
      gvs.no_azeotrope_dew_point_curve.elt.style.display = "none";
      gvs.minimum_temperature_azeotrope_dew_point_curve.elt.style.display = "none";
      gvs.maximum_temperature_azeotrope_dew_point_curve.elt.style.display = "block";
    break;
  }
  gvs.p.redraw();
})