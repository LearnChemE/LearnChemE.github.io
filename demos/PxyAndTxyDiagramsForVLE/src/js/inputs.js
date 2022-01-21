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
  const coord1 = gvs.pxy_plot.coordToPix(Math.min(0.45, gvs.pxy_x_bubble_point()), 1.5);
  const coord2 = gvs.pxy_plot.coordToPix(Math.max(0.45, gvs.pxy_x_dew_point()), 1.5);
  if(gvs.pxy_x_bubble_point() > 0.45 || gvs.pxy_x_dew_point() < 0.45) {
    document.getElementById("pxy-vapor-tie-line").style.opacity = "0";
    document.getElementById("pxy-liquid-tie-line").style.opacity = "0";
    document.getElementById("pxy-vapor-composition-line").style.opacity = "0";
    document.getElementById("pxy-liquid-composition-line").style.opacity = "0";
  } else {
    document.getElementById("pxy-vapor-composition-line").style.opacity = "1";
    document.getElementById("pxy-liquid-composition-line").style.opacity = "1";
    document.getElementById("pxy-vapor-tie-line").style.opacity = "1";
    document.getElementById("pxy-liquid-tie-line").style.opacity = "1";
    gvs.pxy_liquid_composition_line.setAttribute("x1", `${coord1[0]}`);
    gvs.pxy_liquid_composition_line.setAttribute("x2", `${coord1[0]}`);
    gvs.pxy_vapor_composition_line.setAttribute("x1", `${coord2[0]}`);
    gvs.pxy_vapor_composition_line.setAttribute("x2", `${coord2[0]}`);
    gvs.pxy_vapor_tie_line.setAttribute("x1", `${coord1[0]}`);
    gvs.pxy_liquid_tie_line.setAttribute("x2", `${coord2[0]}`);
  }
  if(gvs.pxy_x_bubble_point() > 0.45) {
    gvs.pxy_liquid_composition_line.setAttribute("x1", `${coord1[0]}`);
    gvs.pxy_liquid_composition_line.setAttribute("x2", `${coord1[0]}`);
    document.getElementById("pxy-liquid-composition-line").style.opacity = "1";
  }
  if(gvs.pxy_x_dew_point() < 0.45) {
    gvs.pxy_vapor_composition_line.setAttribute("x1", `${coord2[0]}`);
    gvs.pxy_vapor_composition_line.setAttribute("x2", `${coord2[0]}`);
    document.getElementById("pxy-vapor-composition-line").style.opacity = "1";
  }
  temperatureValue.innerHTML = `${T.toFixed(0)}°`;
  gvs.calc_tie_lines();
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
  const coord1 = gvs.txy_plot.coordToPix(Math.min(0.45, gvs.txy_x_bubble_point()), 115);
  const coord2 = gvs.txy_plot.coordToPix(Math.max(0.45, gvs.txy_x_dew_point()), 115);
  if(gvs.txy_x_bubble_point() > 0.45 || gvs.txy_x_dew_point() < 0.45) {
    document.getElementById("txy-vapor-tie-line").style.opacity = "0";
    document.getElementById("txy-liquid-tie-line").style.opacity = "0";
    document.getElementById("txy-vapor-composition-line").style.opacity = "0";
    document.getElementById("txy-liquid-composition-line").style.opacity = "0";
  } else {
    document.getElementById("txy-vapor-composition-line").style.opacity = "1";
    document.getElementById("txy-liquid-composition-line").style.opacity = "1";
    document.getElementById("txy-vapor-tie-line").style.opacity = "1";
    document.getElementById("txy-liquid-tie-line").style.opacity = "1";
    gvs.txy_vapor_tie_line.setAttribute("x1", `${coord1[0]}`);
    gvs.txy_liquid_tie_line.setAttribute("x2", `${coord2[0]}`);
    gvs.txy_vapor_composition_line.setAttribute("x1", `${coord2[0]}`);
    gvs.txy_vapor_composition_line.setAttribute("x2", `${coord2[0]}`);
    gvs.txy_liquid_composition_line.setAttribute("x1", `${coord1[0]}`);
    gvs.txy_liquid_composition_line.setAttribute("x2", `${coord1[0]}`);
  }
  if(gvs.txy_x_bubble_point() > 0.45) {
    gvs.txy_liquid_composition_line.setAttribute("x1", `${coord1[0]}`);
    gvs.txy_liquid_composition_line.setAttribute("x2", `${coord1[0]}`);
    document.getElementById("txy-liquid-composition-line").style.opacity = "1";
  }
  if(gvs.txy_x_dew_point() < 0.45) {
    gvs.txy_vapor_composition_line.setAttribute("x1", `${coord2[0]}`);
    gvs.txy_vapor_composition_line.setAttribute("x2", `${coord2[0]}`);
    document.getElementById("txy-vapor-composition-line").style.opacity = "1";
  }
  pressureValue.innerHTML = `${P.toFixed(2)}`;
  gvs.calc_tie_lines();
  gvs.p.redraw();
});

selectPlot.addEventListener("change", () => {
  const plot = selectPlot.value;
  gvs.plot = plot;
  if(plot === "P-x-y") {
    gvs.T = 115;
    gvs.P = 1.50;
    temperatureSlider.value = "115";
    temperatureValue.innerHTML = `${gvs.T.toFixed(0)}°`;
    pressureSlider.value = "1.5";
    pressureValue.innerHTML = `${gvs.P.toFixed(2)}`;
    gvs.calc_Tsat();
    gvs.pxy_bubble_point.updateCoords();
    gvs.pxy_dew_point.updateCoords();
    gvs.pxy_bubble_point.drawCurve();
    gvs.pxy_dew_point.drawCurve();
    gvs.txy_plot.container.classList.add("hidden");
    gvs.txy_plot.tickLabels.classList.add("hidden");
    gvs.pxy_plot.container.classList.remove("hidden");
    gvs.pxy_plot.tickLabels.classList.remove("hidden");
    document.getElementById("pxy-vapor-composition-line").style.opacity = "1";
    document.getElementById("pxy-liquid-composition-line").style.opacity = "1";
    document.getElementById("pxy-vapor-tie-line").style.opacity = "1";
    document.getElementById("pxy-liquid-tie-line").style.opacity = "1";
    document.getElementById("pressure-slider-container").style.display = "none";
    document.getElementById("temperature-slider-container").style.display = "grid";
    const coord1 = gvs.pxy_plot.coordToPix(gvs.pxy_x_bubble_point(), 1.5);
    const coord2 = gvs.pxy_plot.coordToPix(gvs.pxy_x_dew_point(), 1.5);
    gvs.pxy_vapor_tie_line.setAttribute("x1", `${coord1[0]}`);
    gvs.pxy_liquid_tie_line.setAttribute("x2", `${coord2[0]}`);
    gvs.pxy_liquid_composition_line.setAttribute("x1", `${coord1[0]}`);
    gvs.pxy_liquid_composition_line.setAttribute("x2", `${coord1[0]}`);
    gvs.pxy_vapor_composition_line.setAttribute("x1", `${coord2[0]}`);
    gvs.pxy_vapor_composition_line.setAttribute("x2", `${coord2[0]}`);
    gvs.calc_tie_lines();
    gvs.p.redraw();
  } else {
    gvs.P = 1.5;
    gvs.T = 115;
    pressureSlider.value = "1.5";
    pressureValue.innerHTML = `${gvs.P.toFixed(2)}`;
    temperatureSlider.value = "115";
    temperatureValue.innerHTML = `${gvs.T.toFixed(0)}°`;
    gvs.calc_Tsat();
    gvs.txy_plot.container.classList.remove("hidden");
    gvs.txy_plot.tickLabels.classList.remove("hidden");
    gvs.pxy_plot.container.classList.add("hidden");
    gvs.pxy_plot.tickLabels.classList.add("hidden");
    document.getElementById("txy-vapor-composition-line").style.opacity = "1";
    document.getElementById("txy-liquid-composition-line").style.opacity = "1";
    document.getElementById("txy-vapor-tie-line").style.opacity = "1";
    document.getElementById("txy-liquid-tie-line").style.opacity = "1";
    document.getElementById("pressure-slider-container").style.display = "grid";
    document.getElementById("temperature-slider-container").style.display = "none";
    gvs.txy_bubble_point.updateCoords();
    gvs.txy_dew_point.updateCoords();
    gvs.txy_bubble_point.drawCurve();
    gvs.txy_dew_point.drawCurve();
    const coord1 = gvs.txy_plot.coordToPix(gvs.txy_x_bubble_point(), 115);
    const coord2 = gvs.txy_plot.coordToPix(gvs.txy_x_dew_point(), 115);
    gvs.txy_vapor_tie_line.setAttribute("x1", `${coord1[0]}`);
    gvs.txy_liquid_tie_line.setAttribute("x2", `${coord2[0]}`);
    gvs.txy_vapor_composition_line.setAttribute("x1", `${coord2[0]}`);
    gvs.txy_vapor_composition_line.setAttribute("x2", `${coord2[0]}`);
    gvs.txy_liquid_composition_line.setAttribute("x1", `${coord1[0]}`);
    gvs.txy_liquid_composition_line.setAttribute("x2", `${coord1[0]}`);
    gvs.calc_tie_lines();
    gvs.p.redraw();
  }
  gvs.p.redraw();
})