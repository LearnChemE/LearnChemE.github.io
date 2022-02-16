const plotPoint = document.getElementById("plot-point");
const plotPointContainer = document.getElementById("plot-point-container");
const containerRect = plotPointContainer.getBoundingClientRect();

plotPoint.addEventListener("mousedown", (e) => {
  gvs.mousedown = true;
  gvs.mouseStart = [e.clientX, e.clientY];
});

document.addEventListener("mouseup", () => {
  gvs.mousedown = false;
  gvs.pointLocation = [ gvs.dragCoords[0], gvs.dragCoords[1] ];
});

document.addEventListener("mousemove", (e) => {
  if(gvs.mousedown) {
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
      wtC = 1000 - wtA - wtB
      if(wtC < 0) {wtC = 0; wtB = 1000 - wtB}
    }
    wtA = wtA / 1000;
    wtB = wtB / 1000;
    wtC = wtC / 1000;

    gvs.xA = wtA;
    gvs.xB = wtB;
    gvs.xC = wtC;

    plotPoint.style.left = `${gvs.dragCoords[0]}px`;
    plotPoint.style.top = `${gvs.dragCoords[1]}px`;

    gvs.p.redraw();
  }
});

