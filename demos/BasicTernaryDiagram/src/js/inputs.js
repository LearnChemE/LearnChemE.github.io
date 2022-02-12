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
    const left_angle = Math.PI / 3 - Math.atan2(gvs.left_coords[0], gvs.left_coords[1]) % 3.14;
    const right_angle = Math.PI / 3 - Math.atan2(gvs.right_coords[0], gvs.right_coords[1]) % 3.14;
    
    gvs.bl_distance = Math.sqrt(gvs.left_coords[0]**2 + gvs.left_coords[1]**2) * Math.cos(left_angle);
    gvs.br_distance = Math.sqrt(gvs.right_coords[0]**2 + gvs.right_coords[1]**2) * Math.cos(right_angle);
    gvs.top_distance = e.clientY - gvs.topPoint.getBoundingClientRect().top;

    const left = bl.top - container.top + Math.tan(Math.PI / 3) * (bl.left - e.clientX);
    const right = bl.top - container.top + Math.tan(Math.PI / 3) * (e.clientX - br.left);
    const bottom = bl.top - e.clientY;

    gvs.dragCoords[1] = Math.min(Math.max(left, right, gvs.dragCoords[1]), bl.top - container.top);
    gvs.dragCoords[0] = Math.min(Math.max(bl.left - container.left, gvs.dragCoords[0]), br.left - container.left);

    plotPoint.style.left = `${gvs.dragCoords[0]}px`;
    plotPoint.style.top = `${gvs.dragCoords[1]}px`;
  }
});

