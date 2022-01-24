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
  const coord1 = gvs.pxy_plot.coordToPix(Math.min(gvs.z, gvs.pxy_x_bubble_point()), gvs.P);
  const coord2 = gvs.pxy_plot.coordToPix(Math.max(gvs.z, gvs.pxy_x_dew_point()), gvs.P);
  const center_coord = gvs.pxy_plot.coordToPix(gvs.z, gvs.P);
  if(gvs.pxy_x_bubble_point() > gvs.z || gvs.pxy_x_dew_point() < gvs.z) {
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
    gvs.pxy_vapor_tie_line.setAttribute("x2", `${center_coord[0]}`);
    gvs.pxy_liquid_tie_line.setAttribute("x2", `${coord2[0]}`);
    gvs.pxy_liquid_tie_line.setAttribute("x1", `${center_coord[0]}`);
    const left = gvs.pxy_vapor_tie_line.getBoundingClientRect().left;
    gvs.pxy_vapor_tie_line.style.strokeDashoffset = `${left}px`;
  }
  if(gvs.pxy_x_bubble_point() > gvs.z) {
    gvs.pxy_liquid_composition_line.setAttribute("x1", `${coord1[0]}`);
    gvs.pxy_liquid_composition_line.setAttribute("x2", `${coord1[0]}`);
    document.getElementById("pxy-liquid-composition-line").style.opacity = "1";
  }
  if(gvs.pxy_x_dew_point() < gvs.z) {
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
  const coord1 = gvs.txy_plot.coordToPix(Math.min(gvs.z, gvs.txy_x_bubble_point()), gvs.T);
  const coord2 = gvs.txy_plot.coordToPix(Math.max(gvs.z, gvs.txy_x_dew_point()), gvs.T);
  const center_coord = gvs.txy_plot.coordToPix(gvs.z, gvs.T);
  if(gvs.txy_x_bubble_point() > gvs.z || gvs.txy_x_dew_point() < gvs.z) {
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
    gvs.txy_vapor_tie_line.setAttribute("x2", `${center_coord[0]}`);
    gvs.txy_liquid_tie_line.setAttribute("x2", `${coord2[0]}`);
    gvs.txy_liquid_tie_line.setAttribute("x1", `${center_coord[0]}`);
    const left = gvs.txy_vapor_tie_line.getBoundingClientRect().left;
    gvs.txy_vapor_tie_line.style.strokeDashoffset = `${left}px`;
    gvs.txy_vapor_composition_line.setAttribute("x1", `${coord2[0]}`);
    gvs.txy_vapor_composition_line.setAttribute("x2", `${coord2[0]}`);
    gvs.txy_liquid_composition_line.setAttribute("x1", `${coord1[0]}`);
    gvs.txy_liquid_composition_line.setAttribute("x2", `${coord1[0]}`);
  }
  if(gvs.txy_x_bubble_point() > gvs.z) {
    gvs.txy_liquid_composition_line.setAttribute("x1", `${coord1[0]}`);
    gvs.txy_liquid_composition_line.setAttribute("x2", `${coord1[0]}`);
    document.getElementById("txy-liquid-composition-line").style.opacity = "1";
  }
  if(gvs.txy_x_dew_point() < gvs.z) {
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
  gvs.plot_selection = plot;
  if(plot === "P-x-y") {
    gvs.T = 115;
    gvs.P = 1.50;
    gvs.z = 0.45;
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
    const center_coord = gvs.pxy_plot.coordToPix(gvs.z, 1.5);
    gvs.pxy_vapor_tie_line.setAttribute("x1", `${coord1[0]}`);
    gvs.pxy_vapor_tie_line.setAttribute("y1", `${coord1[1]}`);
    gvs.pxy_vapor_tie_line.setAttribute("x2", `${center_coord[0]}`);
    gvs.pxy_vapor_tie_line.setAttribute("y2", `${center_coord[1]}`);
    gvs.pxy_liquid_tie_line.setAttribute("x1", `${coord2[0]}`);
    gvs.pxy_liquid_tie_line.setAttribute("y1", `${coord2[1]}`);
    gvs.pxy_liquid_tie_line.setAttribute("x2", `${center_coord[0]}`);
    gvs.pxy_liquid_tie_line.setAttribute("y2", `${center_coord[1]}`);
    gvs.pxy_liquid_composition_line.setAttribute("x1", `${coord1[0]}`);
    gvs.pxy_liquid_composition_line.setAttribute("x2", `${coord1[0]}`);
    gvs.pxy_liquid_composition_line.setAttribute("y1", `${coord1[1]}`);
    gvs.pxy_vapor_composition_line.setAttribute("x1", `${coord2[0]}`);
    gvs.pxy_vapor_composition_line.setAttribute("x2", `${coord2[0]}`);
    gvs.pxy_vapor_composition_line.setAttribute("y1", `${coord2[1]}`);
    gvs.pxy_point.setAttribute("cx", `${center_coord[0]}`);
    gvs.pxy_point.setAttribute("cy", `${center_coord[1]}`);
    gvs.calc_tie_lines();
    gvs.p.redraw();
  } else {
    gvs.P = 1.5;
    gvs.T = 115;
    gvs.z = 0.45;
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
    const center_coord = gvs.txy_plot.coordToPix(gvs.z, 115);
    gvs.txy_vapor_tie_line.setAttribute("x1", `${coord1[0]}`);
    gvs.txy_vapor_tie_line.setAttribute("y1", `${coord1[1]}`);
    gvs.txy_vapor_tie_line.setAttribute("x2", `${center_coord[0]}`);
    gvs.txy_vapor_tie_line.setAttribute("y2", `${center_coord[1]}`);
    gvs.txy_liquid_tie_line.setAttribute("x1", `${coord2[0]}`);
    gvs.txy_liquid_tie_line.setAttribute("y1", `${coord2[1]}`);
    gvs.txy_liquid_tie_line.setAttribute("x2", `${center_coord[0]}`);
    gvs.txy_liquid_tie_line.setAttribute("y2", `${center_coord[1]}`);
    gvs.txy_liquid_composition_line.setAttribute("x1", `${coord1[0]}`);
    gvs.txy_liquid_composition_line.setAttribute("x2", `${coord1[0]}`);
    gvs.txy_liquid_composition_line.setAttribute("y1", `${coord1[1]}`);
    gvs.txy_vapor_composition_line.setAttribute("x1", `${coord2[0]}`);
    gvs.txy_vapor_composition_line.setAttribute("x2", `${coord2[0]}`);
    gvs.txy_vapor_composition_line.setAttribute("y1", `${coord2[1]}`);
    gvs.txy_point.setAttribute("cx", `${center_coord[0]}`);
    gvs.txy_point.setAttribute("cy", `${center_coord[1]}`);
    gvs.calc_tie_lines();
    gvs.p.redraw();
  }
  gvs.p.redraw();
});

gvs.pxy_point.addEventListener("mousedown", (e) => {
  if(!gvs.isDragging) {
    gvs.mouseOriginalPixels = [e.clientX, e.clientY];
    gvs.mouseCurrentPixels = [e.clientX, e.clientY];
    gvs.dotOriginalCoords = [Number(gvs.pxy_point.getAttribute("cx")), Number(gvs.pxy_point.getAttribute("cy"))];
    gvs.isDragging = true;
  }
});

gvs.txy_point.addEventListener("mousedown", (e) => {
  if(!gvs.isDragging) {
    gvs.mouseOriginalPixels = [e.clientX, e.clientY];
    gvs.mouseCurrentPixels = [e.clientX, e.clientY];
    gvs.dotOriginalCoords = [Number(gvs.txy_point.getAttribute("cx")), Number(gvs.txy_point.getAttribute("cy"))];
    gvs.isDragging = true;
  }
});

document.addEventListener("mouseup", () => {
  gvs.isDragging = false;
  gvs.q_list = [gvs.q, gvs.q, gvs.q, gvs.q, gvs.q, gvs.q];
  gvs.p.redraw();
});

document.addEventListener("mousemove", (e) => {
  if( gvs.isDragging && e.buttons === 1 ) {
    gvs.mouseCurrentPixels = [e.clientX, e.clientY];
    const dx = e.ctrlKey ? 0 : gvs.mouseCurrentPixels[0] - gvs.mouseOriginalPixels[0];
    const dy = e.shiftKey ? 0 : gvs.mouseCurrentPixels[1] - gvs.mouseOriginalPixels[1];
    let rect;
    
    if(gvs.plot_selection === "P-x-y") {
      rect = document.getElementById("pxy-plot").getElementsByClassName("svg-axes")[0].getBoundingClientRect();
    } else {
      rect = document.getElementById("txy-plot").getElementsByClassName("svg-axes")[0].getBoundingClientRect();
    }

    const width_px = rect.width;
    const height_px = rect.height;
    const width_pt = 100;
    const height_pt = 100;
    const pts_moved_horizontal = (dx / width_px) * width_pt;
    const pts_moved_vertical = (dy / height_px) * height_pt;
    const new_x_coord = Number(Math.min(100, Math.max(0, gvs.dotOriginalCoords[0] + pts_moved_horizontal)).toFixed(5));
    const new_y_coord = Number(Math.min(100, Math.max(0, gvs.dotOriginalCoords[1] + pts_moved_vertical)).toFixed(5));
    
    let plot_coords;
    if(gvs.plot_selection === "P-x-y") {
      gvs.pxy_point.setAttribute("cx", `${new_x_coord}`);
      gvs.pxy_point.setAttribute("cy", `${new_y_coord}`);
      plot_coords = gvs.pxy_plot.pixToCoord(new_x_coord, new_y_coord);
    } else {
      gvs.txy_point.setAttribute("cx", `${new_x_coord}`);
      gvs.txy_point.setAttribute("cy", `${new_y_coord}`);
      plot_coords = gvs.txy_plot.pixToCoord(new_x_coord, new_y_coord);
    }

    const plot_x = plot_coords[0];
    const plot_y = plot_coords[1];

    gvs.z = plot_x;

    if(gvs.plot_selection === "P-x-y") {
      gvs.P = plot_y;
      document.getElementById("P-slider").value = `${gvs.P}`;
      // gvs.pxy_plot.container.getElementsByClassName("plot-title")[0].innerHTML = `mixture is at ${gvs.P.toFixed(2)} bar`;
    } else {
      gvs.T = plot_y;
      document.getElementById("T-slider").value = `${gvs.T}`;
      // gvs.txy_plot.container.getElementsByClassName("plot-title")[0].innerHTML = `mixture is at ${Math.round(gvs.T).toFixed(0)}° C`;
    }

    gvs.calc_tie_lines();

    if(gvs.plot_selection === "P-x-y") {
      let bubble_x = Math.min(gvs.z, Math.max(0, gvs.pxy_x_bubble_point()));
      let dew_x = Math.max(gvs.z, Math.min(1, gvs.pxy_x_dew_point()));
      if(isNaN(bubble_x)) { bubble_x = gvs.z }
      if(isNaN(dew_x)) { dew_x = gvs.z }
      const liq_coord_x = gvs.pxy_plot.coordToPix(bubble_x, plot_coords[1])[0];
      const vap_coord_x = gvs.pxy_plot.coordToPix(dew_x, plot_coords[1])[0];
      if(bubble_x !== gvs.z && dew_x !== gvs.z) {
        gvs.pxy_vapor_tie_line.style.opacity = "1";
        gvs.pxy_liquid_tie_line.style.opacity = "1";
        gvs.pxy_vapor_composition_line.style.opacity = "1";
        gvs.pxy_liquid_composition_line.style.opacity = "1";
      } else if (bubble_x === gvs.z) {
        gvs.pxy_vapor_tie_line.style.opacity = "0";
        gvs.pxy_liquid_tie_line.style.opacity = "0";
        gvs.pxy_vapor_composition_line.style.opacity = "0";
        gvs.pxy_liquid_composition_line.style.opacity = "1";
      } else {
        gvs.pxy_vapor_tie_line.style.opacity = "0";
        gvs.pxy_liquid_tie_line.style.opacity = "0";
        gvs.pxy_vapor_composition_line.style.opacity = "1";
        gvs.pxy_liquid_composition_line.style.opacity = "0";
      }
      gvs.pxy_vapor_tie_line.setAttribute("x1", `${liq_coord_x}`);
      gvs.pxy_vapor_tie_line.setAttribute("x2", `${new_x_coord}`);
      gvs.pxy_vapor_tie_line.setAttribute("y1", `${new_y_coord}`);
      gvs.pxy_vapor_tie_line.setAttribute("y2", `${new_y_coord}`);
      gvs.pxy_liquid_tie_line.setAttribute("x2", `${vap_coord_x}`);
      gvs.pxy_liquid_tie_line.setAttribute("x1", `${new_x_coord}`);
      gvs.pxy_liquid_tie_line.setAttribute("y1", `${new_y_coord}`);
      gvs.pxy_liquid_tie_line.setAttribute("y2", `${new_y_coord}`);
      gvs.pxy_liquid_composition_line.setAttribute("x1", `${liq_coord_x}`);
      gvs.pxy_liquid_composition_line.setAttribute("x2", `${liq_coord_x}`);
      gvs.pxy_liquid_composition_line.setAttribute("y1", `${new_y_coord}`);
      gvs.pxy_vapor_composition_line.setAttribute("x1", `${vap_coord_x}`);
      gvs.pxy_vapor_composition_line.setAttribute("x2", `${vap_coord_x}`);
      gvs.pxy_vapor_composition_line.setAttribute("y1", `${new_y_coord}`);
    } else {
      let bubble_x = Math.min(gvs.z, Math.max(0, gvs.txy_x_bubble_point()));
      let dew_x = Math.max(gvs.z, Math.min(1, gvs.txy_x_dew_point()));
      if(isNaN(bubble_x)) { bubble_x = gvs.z }
      if(isNaN(dew_x)) { dew_x = gvs.z }
      const liq_coord_x = gvs.txy_plot.coordToPix(bubble_x, plot_coords[1])[0];
      const vap_coord_x = gvs.txy_plot.coordToPix(dew_x, plot_coords[1])[0];
      if(bubble_x !== gvs.z && dew_x !== gvs.z) {
        gvs.txy_vapor_tie_line.style.opacity = "1";
        gvs.txy_liquid_tie_line.style.opacity = "1";
        gvs.txy_vapor_composition_line.style.opacity = "1";
        gvs.txy_liquid_composition_line.style.opacity = "1";
      } else if (bubble_x === gvs.z) {
        gvs.txy_vapor_tie_line.style.opacity = "0";
        gvs.txy_liquid_tie_line.style.opacity = "0";
        gvs.txy_vapor_composition_line.style.opacity = "0";
        gvs.txy_liquid_composition_line.style.opacity = "1";
      } else {
        gvs.txy_vapor_tie_line.style.opacity = "0";
        gvs.txy_liquid_tie_line.style.opacity = "0";
        gvs.txy_vapor_composition_line.style.opacity = "1";
        gvs.txy_liquid_composition_line.style.opacity = "0";
      }
      gvs.txy_vapor_tie_line.setAttribute("x1", `${liq_coord_x}`);
      gvs.txy_vapor_tie_line.setAttribute("x2", `${new_x_coord}`);
      gvs.txy_vapor_tie_line.setAttribute("y1", `${new_y_coord}`);
      gvs.txy_vapor_tie_line.setAttribute("y2", `${new_y_coord}`);
      gvs.txy_liquid_tie_line.setAttribute("x2", `${vap_coord_x}`);
      gvs.txy_liquid_tie_line.setAttribute("x1", `${new_x_coord}`);
      gvs.txy_liquid_tie_line.setAttribute("y1", `${new_y_coord}`);
      gvs.txy_liquid_tie_line.setAttribute("y2", `${new_y_coord}`);
      gvs.txy_liquid_composition_line.setAttribute("x1", `${liq_coord_x}`);
      gvs.txy_liquid_composition_line.setAttribute("x2", `${liq_coord_x}`);
      gvs.txy_liquid_composition_line.setAttribute("y1", `${new_y_coord}`);
      gvs.txy_vapor_composition_line.setAttribute("x1", `${vap_coord_x}`);
      gvs.txy_vapor_composition_line.setAttribute("x2", `${vap_coord_x}`);
      gvs.txy_vapor_composition_line.setAttribute("y1", `${new_y_coord}`);
    }

    gvs.p.redraw();
  }

  if( e.buttons !== 1 ) {
    gvs.isDragging = false;
  }
});