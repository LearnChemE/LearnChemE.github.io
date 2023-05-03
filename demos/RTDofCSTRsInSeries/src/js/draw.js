const math = require("mathjs");

const xMin = gvs.plot.domain[0];
const xMax = gvs.plot.domain[1];
const xStepMajor = gvs.plot.domain[2];
const xStepMinor = gvs.plot.domain[3];
const yMin = gvs.plot.range[0];
const yMax = gvs.plot.range[1];
const yStepMajor = gvs.plot.range[2];
const yStepMinor = gvs.plot.range[3];

const margin_left = gvs.plot.margins[0][0];
const margin_right = gvs.plot.margins[0][1];
const margin_top = gvs.plot.margins[1][0];
const margin_bottom = gvs.plot.margins[1][1];
const plot_width = gvs.p.width - margin_left - margin_right;
const plot_height = gvs.p.height - margin_bottom - margin_top;

function coordToPix(x, y) {

  const xPix = margin_left + ((x - xMin) / (xMax - xMin)) * plot_width;
  const yPix = margin_top + plot_height - ((y - yMin) / (yMax - yMin)) * plot_height;
  
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

  for(let x = xMin; x <= xMax; x += xStepMinor) {
    x = Math.round(x * 100) / 100;
    const pix_bottom = coordToPix(x, gvs.plot.range[0]);
    const pix_top = coordToPix(x, gvs.plot.range[1]);
    let tickLength;
    if((Math.round(100 * (x - xMin)) / 100) % xStepMajor === 0) {
      tickLength = 8;
      p.noStroke();
      p.fill(0);
      p.textAlign(p.CENTER, p.TOP);
      p.textSize(14);
      p.text(`${Math.round(x)}`, pix_bottom[0], pix_bottom[1] + 5);
      p.stroke(0);
      p.noFill();
    } else {
      tickLength = 4;
    }
    p.line(pix_bottom[0], pix_bottom[1], pix_bottom[0], pix_bottom[1] - tickLength);
    p.line(pix_top[0], pix_top[1], pix_top[0], pix_top[1] + tickLength);
  }

  for(let y = yMin; y <= yMax; y += yStepMinor) {
    y = Math.round(y * 100) / 100;
    const pix_left = coordToPix(gvs.plot.domain[0], y);
    const pix_right = coordToPix(gvs.plot.domain[1], y);
    let tickLength;
    const discrepancy = Math.round(100 * (y - yMin)) / 100;
    if(
      ((Math.round((discrepancy % yStepMajor) * 100) / 100) === 0
      || (Math.round((discrepancy % yStepMajor) * 100) / 100) === yStepMajor)
      && y !== 0) {
      tickLength = 8;
      p.noStroke();
      p.fill(0);
      p.textAlign(p.RIGHT, p.CENTER);
      p.textSize(14);
      p.text(`${y.toFixed(2)}`, pix_left[0] - 5, pix_left[1]);
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
  const bottomLabelCoords = coordToPix((xMin + xMax) / 2, yMin);
  const leftLabelCoords = coordToPix(xMin, (yMin + yMax) / 2);
  const topLabelCoords = coordToPix((xMin + xMax) / 2, yMax);
  p.text(gvs.plot.labels[1][1], bottomLabelCoords[0], bottomLabelCoords[1] + 40);
  p.translate(leftLabelCoords[0], leftLabelCoords[1]);
  p.rotate(-1 * Math.PI / 2);
  p.text(gvs.plot.labels[0][0], 0, -60);
  p.rotate(Math.PI / 2);
  p.translate(-1 * leftLabelCoords[0], -1 * leftLabelCoords[1]);
  p.fill(253);
  p.rect(coordToPix(xMin, yMax)[0] - 3, 0, plot_width, margin_top);
  p.fill(0);
  p.text(gvs.plot.labels[1][0], topLabelCoords[0], topLabelCoords[1] - 30);
  p.pop();
}

function drawCurve(p) {
  p.push();

  p.noFill();
  p.stroke(0, 0, 255);
  p.strokeWeight(2);
  p.beginShape();
  for(let x = xMin; x < xMax; x += (xMax - xMin) / 1000) {
    x = Math.round(x * 1000) / 1000;
    const t = x;
    const n = gvs.n;
    const tau = gvs.tau;
    const y = ((n / tau)**n) * ((t**(n - 1)) / math.factorial(n - 1)) * Math.exp((-1 * n * t) / tau);
    const pix = coordToPix(x, y);
    p.vertex(pix[0], pix[1]);
  }
  p.endShape();
  p.pop();
}

function drawAll(p) {
  drawCurve(p);
  drawAxes(p);
}

module.exports = drawAll;