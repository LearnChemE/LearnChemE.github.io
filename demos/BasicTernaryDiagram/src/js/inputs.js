const plotPoint = document.getElementById("plot-point");
const plotPointContainer = document.getElementById("plot-point-container");
const containerRect = plotPointContainer.getBoundingClientRect();
const viewSelect = document.getElementById("select-view");
const showGrid = document.getElementById("show-grid-lines");
const showMassFractions = document.getElementById("show-composition-label");
const randomButton = document.getElementById("random-button");
const randomButtonContainer = document.getElementsByClassName("random-button-container")[0];

plotPoint.addEventListener("mousedown", (e) => {
  gvs.mousedown = true;
  gvs.mouseStart = [e.clientX, e.clientY];
});

document.addEventListener("mouseup", () => {
  gvs.mousedown = false;
  gvs.pointLocation = [ gvs.dragCoords[0], gvs.dragCoords[1] ];
  document.getElementById("plot-point").style.removeProperty(`box-shadow`);
  document.getElementById("plot-point").style.removeProperty(`background-color`);
});

document.addEventListener("mousemove", (e) => {
  if(gvs.mousedown) {
    document.getElementById("plot-point").style.boxShadow = `0px 0px 3px 3px white`;
    document.getElementById("plot-point").style.backgroundColor = `rgb(80, 80, 80)`;
    const dx = e.clientX - gvs.mouseStart[0];
    const dy = e.clientY - gvs.mouseStart[1];
    gvs.dragCoords[0] = gvs.pointLocation[0] + dx;
    gvs.dragCoords[1] = gvs.pointLocation[1] + dy;
    const bl = gvs.bottomLeftPoint.getBoundingClientRect();
    const br = gvs.bottomRightPoint.getBoundingClientRect();
    const t = gvs.topPoint.getBoundingClientRect();
    const container = document.getElementsByTagName("canvas")[0].getBoundingClientRect();

    gvs.left_coords = [
      Math.max(0, e.clientX - gvs.bottomLeftPoint.getBoundingClientRect().left),
      Math.max(0, gvs.bottomLeftPoint.getBoundingClientRect().top - e.clientY)
    ];

    gvs.right_coords = [
      Math.max(0, gvs.bottomRightPoint.getBoundingClientRect().left - e.clientX),
      Math.max(0, gvs.bottomRightPoint.getBoundingClientRect().top - e.clientY)
    ];
    const left_angle = Math.PI / 3 - Math.atan2(gvs.left_coords[0], gvs.left_coords[1]) % Math.PI;
    const right_angle = Math.PI / 3 - Math.atan2(gvs.right_coords[0], gvs.right_coords[1]) % Math.PI;
    
    gvs.bl_distance = Math.sqrt(gvs.left_coords[0]**2 + gvs.left_coords[1]**2) * Math.cos(left_angle);
    gvs.br_distance = Math.sqrt(gvs.right_coords[0]**2 + gvs.right_coords[1]**2) * Math.cos(right_angle);

    gvs.top_distance = e.clientY - gvs.topPoint.getBoundingClientRect().top;

    const diagonalDistance = (gvs.t[2][0] - gvs.t[0][0]) * Math.tan(Math.PI / 3);

    const left = Math.max(0, Math.min(417, bl.top - container.top + Math.tan(Math.PI / 3) * (bl.left - e.clientX)));
    const right = Math.max(0, Math.min(417, bl.top - container.top + Math.tan(Math.PI / 3) * (e.clientX - br.left)));
    const bottom = Math.max(0, Math.min(diagonalDistance, bl.top - e.clientY));

    gvs.dragCoords[1] = Math.min(Math.max(left, right, gvs.dragCoords[1]), bl.top - container.top);
    gvs.dragCoords[0] = Math.min(Math.max(bl.left - container.left, gvs.dragCoords[0]), br.left - container.left);

    let distance_to_left_corner = Math.sqrt((gvs.dragCoords[0]- gvs.t[0][0])**2 + (gvs.dragCoords[1] - gvs.t[0][1])**2);
    let distance_to_right_corner = Math.sqrt((gvs.t[1][0] - gvs.dragCoords[0])**2 + (gvs.dragCoords[1] - gvs.t[0][1])**2);
    
    if(gvs.dragCoords[0] > gvs.t[1][0]) {
      distance_to_right_corner = 0
    }

    if(gvs.dragCoords[0] < gvs.t[0][0]) {
      distance_to_left_corner = 0
    }

    // let angle_to_left_corner = gvs.p.atan2(gvs.t[0][1] - gvs.dragCoords[1], gvs.dragCoords[0] - gvs.t[0][0]);
    // angle_to_left_corner = Math.max(0, Math.min(Math.PI / 3, angle_to_left_corner));

    
    // let angle_to_right_corner = gvs.p.atan2(gvs.t[0][1] - gvs.dragCoords[1], gvs.t[1][0] - gvs.dragCoords[0]);
    // angle_to_right_corner = Math.max(0, Math.min(Math.PI / 3, angle_to_left_corner));

    let px = (gvs.dragCoords[0] - gvs.t[0][0]) / (gvs.t[1][0] - gvs.t[0][0]);
    let py = (1 - (gvs.dragCoords[1] - gvs.t[2][1]) / (gvs.t[0][1] - gvs.t[2][1])) * Math.sqrt(3) / 2;

    px = Math.min(1, Math.max(0, px));
    py = Math.min(1, Math.max(0, py));

    let wtA = Math.round(1000 * py * 2 / Math.sqrt(3));
    let wtB = Math.round(1000 * (1 - (px + py / Math.sqrt(3))));
    let wtC = Math.round(1000 * (px - py / Math.sqrt(3)));

    if(wtA + wtB + wtA !== 1000) {
      if(wtA + wtB > 1000) {
        wtB = 1000 - wtA
        wtC = 0;
      }
      if(wtA + wtC > 1000) {
        wtC = 1000 - wtA
        wtB = 0;
      }
      if(wtB + wtC > 1000) {
        wtC = 1000 - wtB
        wtA = 0;
      }
    }
    wtA = wtA / 1000;
    wtB = wtB / 1000;
    wtC = wtC / 1000;

    gvs.xA = Math.abs(wtA);
    gvs.xB = Math.abs(wtB);
    gvs.xC = Math.abs(wtC);

    plotPoint.style.left = `${gvs.dragCoords[0]}px`;
    plotPoint.style.top = `${gvs.dragCoords[1]}px`;

    gvs.p.redraw();
  }
});

viewSelect.addEventListener("change", () => {
  const selection = viewSelect.value;
  gvs.view = selection;
  if(gvs.view !== "no-arrows") {
    showMassFractions.checked = false;
    gvs.hide_mass_fractions = false;
    randomButtonContainer.style.display = "none";
  }
  gvs.p.redraw();
});

showGrid.addEventListener("change", () => {
  const checked = showGrid.checked;
  gvs.show_grid = checked;
  gvs.p.redraw();
});

showMassFractions.addEventListener("change", () => {
  const checked = showMassFractions.checked;
  gvs.hide_mass_fractions = checked;
  if(checked) {
    gvs.view = "no-arrows";
    randomButtonContainer.style.display = "grid";
  } else {
    randomButtonContainer.style.display = "none";
  }
  viewSelect.value = "no-arrows";
  gvs.p.redraw();
});

randomButton.addEventListener("mousedown", () => {
  randomButton.classList.add("pressed");
  const val1 = Math.random();
  const val2 = Math.random();
  const val3 = Math.random();
  const total = val1 + val2 + val3;
  gvs.xA = Number((val1 / total).toFixed(3));
  gvs.xB = Number((val2 / total).toFixed(3));
  gvs.xC = Number(1 - gvs.xA - gvs.xB).toFixed(3);

  // The following few lines of code prevent any of the mole fractions from being below 0.05
  if(gvs.xA < 0.05) {
    gvs.xA = 0.05;
    if(gvs.xB > gvs.xC) {
      gvs.xB = 1 - gvs.xA - gvs.xC
    } else {
      gvs.xC = 1 - gvs.xA - gvs.xB
    }
  }
  if(gvs.xB < 0.05) {
    gvs.xB = 0.05;
    if(gvs.xA > gvs.xC) {
      gvs.xA = 1 - gvs.xB - gvs.xC
    } else {
      gvs.xC = 1 - gvs.xA - gvs.xB
    }
  }
  if(gvs.xC < 0.05) {
    gvs.xC = 0.05;
    if(gvs.xA > gvs.xB) {
      gvs.xA = 1 - gvs.xB - gvs.xC
    } else {
      gvs.xB = 1 - gvs.xA - gvs.xC
    }
  }

  // Round to the nearest thousandth again
  gvs.xA = Number(gvs.xA.toFixed(3));
  gvs.xB = Number(gvs.xB.toFixed(3));
  gvs.xC = Number((1 - gvs.xA - gvs.xB).toFixed(3));

  const side_length = gvs.t[1][0] - gvs.t[0][0];
  const cross_length = Math.sqrt(side_length**2 - (side_length / 2)**2);
  const distance_from_A_corner = (1 - gvs.xA) * cross_length;
  const x_coord = gvs.t[0][0] + gvs.xC * side_length + Math.tan(Math.PI / 6) * (gvs.xA * cross_length);
  const y_coord = gvs.t[2][1] + distance_from_A_corner;
  gvs.dragCoords = [x_coord, y_coord];
  plotPoint.style.left = `${gvs.dragCoords[0]}px`;
  plotPoint.style.top = `${gvs.dragCoords[1]}px`;
  window.setTimeout(() => {
    randomButton.classList.remove("pressed");
  }, 100);
  gvs.p.redraw();
})