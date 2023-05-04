const xMin = gvs.plot.domain[0];
const xMax = gvs.plot.domain[1];
const xStepMajor = gvs.plot.domain[2];
const xStepMinor = gvs.plot.domain[3];
const yMin = gvs.plot.range[0];
const yMax = gvs.plot.range[1];

const margin_left = gvs.plot.margins[0][0];
const margin_right = gvs.plot.margins[0][1];
const margin_top = gvs.plot.margins[1][0];
const margin_bottom = gvs.plot.margins[1][1];
const plot_width = gvs.p.width - margin_left - margin_right;
const plot_height = gvs.p.height - margin_bottom - margin_top;

function coordToPix(x, y) {

  const xPix = margin_left + ((x - xMin) / (xMax - xMin)) * plot_width;
  const yPix = margin_top + plot_height - ((Math.log(y) - Math.log(yMin)) / (Math.log(yMax) - Math.log(yMin))) * plot_height;
  
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
    x = Math.round(x);
    const pix_bottom = coordToPix(x, gvs.plot.range[0]);
    const pix_top = coordToPix(x, gvs.plot.range[1]);
    let tickLength;
    if(Math.round(x - xMin) % xStepMajor === 200) {
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

  for(let y = 0.001; y <= 100; y += y < 0.01 ? 0.001 : y < 0.1 ? 0.01 : y < 1 ? 0.1 : y < 10 ? 1 : y < 100 ? 10 : 100) {
    if(y < 0.01) {y = Math.round(y * 1000) / 1000}
    else if(y < 0.1) {y = Math.round(y * 100) / 100}
    else if(y < 1) {y = Math.round(y * 10) / 10}
    else {y = Math.round(y)}
    const pix_left = coordToPix(gvs.plot.domain[0], y);
    const pix_right = coordToPix(gvs.plot.domain[1], y);
    let tickLength;
    if(y === 0.001 || y === 0.01 || y === 0.1 || y === 1 || y === 10 || y === 100) {
      tickLength = 8;
      p.noStroke();
      p.fill(0);
      p.textAlign(p.RIGHT, p.CENTER);
      p.textSize(14);
      p.text(`${y}`, pix_left[0] - 5, pix_left[1]);
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
  const leftLabelCoords = coordToPix(xMin, 10**((Math.log10(yMin) + Math.log10(yMax)) / 2));
  p.text(gvs.plot.labels[1][1], bottomLabelCoords[0], bottomLabelCoords[1] + 40);
  p.translate(leftLabelCoords[0], leftLabelCoords[1]);
  p.rotate(-1 * Math.PI / 2);
  p.text(gvs.plot.labels[0][0], 0, -60);
  p.pop();
}

function drawPhaseEnvelope(p) {
  p.push();
  p.noFill();
  p.stroke(0, 0, 255);
  p.strokeWeight(2);
  p.beginShape();
  for(let i = 0; i < gvs.saturation_list.length; i++) {
    const x = gvs.saturation_list[i][0];
    const y = gvs.saturation_list[i][1];
    const pix = coordToPix(x, y);
    p.vertex(pix[0], pix[1]);
  }
  p.endShape();
  p.pop();
}

function drawCycle(p) {
  p.push();
  p.stroke(0);
  p.strokeWeight(1.5);
  p.noFill();
  p.drawingContext.setLineDash([4, 6]);
  const H1_pix = coordToPix(gvs.H1, gvs.inlet_p3_pressure);
  const H2_pix = coordToPix(gvs.H2, gvs.inlet_p3_pressure);
  const H3_pix = coordToPix(gvs.H3, gvs.inlet_p3_pressure);
  const H4_pix = coordToPix(gvs.H4, gvs.outlet_p4_pressure);
  const H5_pix = coordToPix(gvs.H5, gvs.outlet_p4_pressure);
  const H3rev_pix = coordToPix(gvs.H3rev, gvs.inlet_p3_pressure);
  const H4rev_pix = coordToPix(gvs.H4rev, gvs.outlet_p4_pressure);
  p.line(H1_pix[0], H1_pix[1], H2_pix[0], H2_pix[1]);
  p.line(H3rev_pix[0], H3rev_pix[1], H3_pix[0], H3_pix[1]);
  p.line(H3_pix[0], H3_pix[1], H4_pix[0], H4_pix[1]);
  p.line(H4_pix[0], H4_pix[1], H4rev_pix[0], H4rev_pix[1]);
  p.line(H5_pix[0], H5_pix[1], H1_pix[0], H1_pix[1]);
  p.stroke(50, 150, 50);
  p.line(H2_pix[0], H2_pix[1], H3rev_pix[0], H3rev_pix[1]);
  p.line(H3_pix[0], H3_pix[1], H4rev_pix[0], H4rev_pix[1]);
  p.line(H4rev_pix[0], H4rev_pix[1], H5_pix[0], H5_pix[1]);
  p.noStroke();
  p.fill(0);
  p.circle(H1_pix[0], H1_pix[1], 8);
  p.circle(H3_pix[0], H3_pix[1], 8);
  p.circle(H4_pix[0], H4_pix[1], 8);
  p.circle(H5_pix[0], H5_pix[1], 8);
  p.fill(50, 150, 0);
  p.circle(H3rev_pix[0], H3rev_pix[1], 8);
  p.circle(H4rev_pix[0], H4rev_pix[1], 8);
  p.fill(0, 0, 255);
  p.circle(H2_pix[0], H2_pix[1], 8);
  p.pop();
}

function drawAll(p) {
  drawPhaseEnvelope(p);
  drawCycle(p);
  drawAxes(p);
}

module.exports = drawAll;