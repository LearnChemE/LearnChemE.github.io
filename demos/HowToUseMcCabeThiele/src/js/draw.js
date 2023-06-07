function setupPlot() {
  gvs.xMin = gvs.plot.domain[0];
  gvs.xMax = gvs.plot.domain[1];
  gvs.xStepMajor = gvs.plot.domain[2];
  gvs.xStepMinor = gvs.plot.domain[3];
  gvs.yMin = gvs.plot.range[0];
  gvs.yMax = gvs.plot.range[1];
  gvs.yStepMajor = gvs.plot.range[2];
  gvs.yStepMinor = gvs.plot.range[3];
  
  gvs.margin_left = gvs.plot.margins[0][0];
  gvs.margin_right = gvs.plot.margins[0][1];
  gvs.margin_top = gvs.plot.margins[1][0];
  gvs.margin_bottom = gvs.plot.margins[1][1];
  gvs.plot_width = gvs.p.width - gvs.margin_left - gvs.margin_right;
  gvs.plot_height = gvs.p.height - gvs.margin_bottom - gvs.margin_top;
}

function coordToPix(x, y) {

  const xPix = gvs.margin_left + ((x - gvs.xMin) / (gvs.xMax - gvs.xMin)) * gvs.plot_width;
  const yPix = gvs.margin_top + gvs.plot_height - ((y - gvs.yMin) / (gvs.yMax - gvs.yMin)) * gvs.plot_height;
  
  return [xPix, yPix]
}

function drawAxes(p) {
  p.push();
  const topLeft = coordToPix(gvs.plot.domain[0], gvs.plot.range[1]);
  const bottomLeft = coordToPix(gvs.plot.domain[0], gvs.plot.range[0]);
  const topRight = coordToPix(gvs.plot.domain[1], gvs.plot.range[1]);
  const bottomRight = coordToPix(gvs.plot.domain[1], gvs.plot.range[0]);

  p.stroke(0);
  p.strokeWeight(1);
  p.noFill();
  p.line(topLeft[0], topLeft[1], bottomLeft[0], bottomLeft[1]);
  p.line(topLeft[0], topLeft[1], topRight[0], topRight[1]);
  p.line(topRight[0], topRight[1], bottomRight[0], bottomRight[1]);
  p.line(bottomLeft[0], bottomLeft[1], bottomRight[0], bottomRight[1]);

  for(let x = gvs.xMin; x <= gvs.xMax; x += gvs.xStepMinor) {
    x = Math.round(x * 100) / 100;
    const pix_bottom = coordToPix(x, gvs.plot.range[0]);
    const pix_top = coordToPix(x, gvs.plot.range[1]);
    let tickLength;
    if(Math.round((x % gvs.xStepMajor) * 100) / 100 === 0 || Math.round((x % gvs.xStepMajor) * 100) / 100 === gvs.xStepMajor) {
      tickLength = 8;
      p.noStroke();
      p.fill(0);
      p.textAlign(p.CENTER, p.TOP);
      p.textSize(14);
      p.text(`${x.toFixed(1)}`, pix_bottom[0], pix_bottom[1] + 5);
      p.stroke(0);
      p.noFill();
    } else {
      tickLength = 4;
    }
    p.line(pix_bottom[0], pix_bottom[1], pix_bottom[0], pix_bottom[1] - tickLength);
    p.line(pix_top[0], pix_top[1], pix_top[0], pix_top[1] + tickLength);
  }

  for(let y = gvs.yMin; y <= gvs.yMax; y += gvs.yStepMinor) {
    y = Math.round(y * 100) / 100;
    const pix_left = coordToPix(gvs.plot.domain[0], y);
    const pix_right = coordToPix(gvs.plot.domain[1], y);
    let tickLength;
    const discrepancy = Math.round(100 * (y - gvs.yMin)) / 100;
    if(Math.round((y % gvs.yStepMajor) * 100) / 100 === 0 || Math.round((y % gvs.yStepMajor) * 100) / 100 === gvs.yStepMajor) {
      tickLength = 8;
      p.noStroke();
      p.fill(0);
      p.textAlign(p.RIGHT, p.CENTER);
      p.textSize(14);
      p.text(`${y.toFixed(1)}`, pix_left[0] - 5, pix_left[1]);
      p.stroke(0);
      p.noFill();
    } else {
      tickLength = 4;
    }
    p.line(pix_left[0], pix_left[1], pix_left[0] + tickLength, pix_left[1]);
    p.line(pix_right[0], pix_right[1], pix_right[0] - tickLength, pix_right[1]);
  }

  p.noStroke();
  p.fill(0);
  p.textAlign(p.CENTER, p.CENTER);
  p.textSize(16);
  const bottomLabelCoords = coordToPix((gvs.xMin + gvs.xMax) / 2, gvs.yMin);
  const leftLabelCoords = coordToPix(gvs.xMin, (gvs.yMin + gvs.yMax) / 2);
  const topLabelCoords = coordToPix((gvs.xMin + gvs.xMax) / 2, gvs.yMax);
  p.text(gvs.plot.labels[1][1], bottomLabelCoords[0], bottomLabelCoords[1] + 40);
  p.translate(leftLabelCoords[0], leftLabelCoords[1]);
  p.rotate(-1 * Math.PI / 2);
  p.text(gvs.plot.labels[0][0], 0, -60);
  p.rotate(Math.PI / 2);
  p.translate(-1 * leftLabelCoords[0], -1 * leftLabelCoords[1]);
  p.fill(253);
  p.rect(coordToPix(gvs.xMin, gvs.yMax)[0] - 3, 0, gvs.plot_width, gvs.margin_top);
  p.fill(0);
  p.text(gvs.plot.labels[1][0], topLabelCoords[0], topLabelCoords[1] - 30);
  p.pop();
}

function drawEquilb(p) {
  p.push();
  p.stroke(0);
  p.noFill();
  p.strokeWeight(2);
  p.beginShape();
  for(let x = 0; x <= 1; x += 0.01) {
    x = Math.round(x * 100) / 100;
    const pix = coordToPix(x, gvs.equilb(x));
    p.vertex(pix[0], pix[1]);
  }
  p.endShape();
  const xy_pix_1 = coordToPix(0, 0);
  const xy_pix_2 = coordToPix(1, 1);
  p.line(xy_pix_1[0], xy_pix_1[1], xy_pix_2[0], xy_pix_2[1]);
  p.pop();
}

function drawAll(p) {
  setupPlot();
  drawEquilb(p);
  drawAxes(p);
}

module.exports = drawAll;