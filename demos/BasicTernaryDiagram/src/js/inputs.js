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
    
    plotPoint.style.left = `${gvs.dragCoords[0]}px`;
    plotPoint.style.top = `${gvs.dragCoords[1]}px`;
  }
});

