function drawPlot(p) {
  const margins = gvs.plot.margins;
  const height = gvs.plot.height;
  const width = gvs.plot.width;
  const axes_range = gvs.plot.axes_range;
  const xMin = axes_range[0][0];
  const xMax = axes_range[0][1];
  const yMin = axes_range[1][0];
  const yMax = axes_range[1][1];

  p.push();
  p.fill(255);
  p.stroke(0);
  p.strokeWeight(0.5);
  p.line(margins[0][0], margins[1][0], margins[0][0], margins[1][0] + height);
  p.line(margins[0][0], margins[1][0], margins[0][0] + width, margins[1][0]);
  p.line(margins[0][0], margins[1][0] + height, margins[0][0] + width, margins[1][0] + height);
  p.line(margins[0][0] + width, margins[1][0], margins[0][0] + width, margins[1][0] + height);
  let y = axes_range[1][0];
  
  while(y < 0.1) {
    const coords = gvs.coordToPix(0, y);
    let tickWidth;
    if(y === 0.01) {tickWidth = 8} else {tickWidth = 3}
    p.line(coords[0], coords[1], coords[0] + tickWidth, coords[1]);
    y += 0.01;
    y = Math.round(y * 100) / 100;
  }

  while(y < 1) {
    const coords = gvs.coordToPix(0, y);
    let tickWidth;
    if(y === 0.1) {tickWidth = 8} else {tickWidth = 3}
    p.line(coords[0], coords[1], coords[0] + tickWidth, coords[1]);
    y += 0.1;
    y = Math.round(y * 10) / 10;
  }

  while(y < 10) {
    const coords = gvs.coordToPix(0, y);
    let tickWidth;
    if(y === 1) {tickWidth = 8} else {tickWidth = 3}
    p.line(coords[0], coords[1], coords[0] + tickWidth, coords[1]);
    y += 1;
    y = Math.round(y);
  }

  while(y < 100) {
    const coords = gvs.coordToPix(0, y);
    let tickWidth;
    if(y === 10) {tickWidth = 8} else {tickWidth = 3}
    p.line(coords[0], coords[1], coords[0] + tickWidth, coords[1]);
    y += 10;
    y = Math.round(y);
  }

  while(y < 1000) {
    const coords = gvs.coordToPix(0, y);
    let tickWidth;
    if(y === 100) {tickWidth = 8} else {tickWidth = 3}
    p.line(coords[0], coords[1], coords[0] + tickWidth, coords[1]);
    y += 100;
    y = Math.round(y);
  }

  while(y < 10000) {
    const coords = gvs.coordToPix(0, y);
    let tickWidth;
    if(y === 1000) {tickWidth = 8} else {tickWidth = 3}
    p.line(coords[0], coords[1], coords[0] + tickWidth, coords[1]);
    y += 1000;
    y = Math.round(y);
  }

  p.pop();
}

function drawAll(p) {
  drawPlot(p);
}

module.exports = drawAll;