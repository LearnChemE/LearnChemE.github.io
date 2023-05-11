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

const water_color = "rgb(0, 0, 255)";
const benzene_color = "rgb(255, 200, 150)";
const vapor_color = "rgb(255, 0, 0)";

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
    if(
      Math.round(100 * ((Math.round(100 * (x - xMin)) / 100) % xStepMajor)) / 100 === 0
      || Math.round(100 * ((Math.round(100 * (x - xMin)) / 100) % xStepMajor)) / 100 === xStepMajor
      ) {
      tickLength = 5;
      p.noStroke();
      p.fill(0);
      p.textAlign(p.CENTER, p.TOP);
      p.textSize(14);
      p.text(`${(Math.round(x * 100) / 100).toFixed(1)}`, pix_bottom[0], pix_bottom[1] + 5);
      p.stroke(0);
      p.noFill();
    } else {
      tickLength = 3;
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
      tickLength = 5;
      p.noStroke();
      p.fill(0);
      p.textAlign(p.RIGHT, p.CENTER);
      p.textSize(14);
      p.text(`${y.toFixed(0)}`, pix_left[0] - 5, pix_left[1]);
      p.stroke(0);
      p.noFill();
    } else {
      tickLength = 3;
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
  const topLabelCoords = coordToPix((xMin + xMax) / 2 - 0.05, yMax);
  p.text(gvs.plot.labels[1][1], bottomLabelCoords[0], bottomLabelCoords[1] + 40);
  p.translate(leftLabelCoords[0] + 10, leftLabelCoords[1]);
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

function drawLines(p) {
  p.push();
  if(gvs.show_labels) {
    p.noStroke();
    p.textSize(15);
    p.fill(water_color);
    const pix1 = coordToPix(0.05, gvs.bubble_point + 2);
    p.text("water + ", pix1[0], pix1[1]);
    p.fill(vapor_color);
    p.text("vapor", pix1[0] + 55, pix1[1]);
    const pix2 = coordToPix(0.66, gvs.bubble_point + 2);
    p.text("vapor + ", pix2[0], pix2[1]);
    p.fill(benzene_color);
    p.text("benzene", pix2[0] + 55, pix2[1]);
    const pix3 = coordToPix(0.05, 105);
    p.fill(water_color);
    p.text("water + ", pix3[0], pix3[1]);
    p.fill(benzene_color);
    p.text("benzene", pix3[0] + 55, pix3[1]);
    p.fill(vapor_color);
    const pix4 = coordToPix(0.8, 210);
    p.text("vapor", pix4[0], pix4[1]);
  }
  p.stroke(0);
  p.noFill();
  p.strokeWeight(1);
  p.beginShape();
  for(let x = gvs.intersection_point; x < 1; x += 0.01) {
    x = Math.round(x * 1000) / 1000;
    const pix = coordToPix(x, gvs.Ty1(x));
    p.vertex(pix[0], pix[1]);
  }
  p.endShape();

  p.beginShape();
  for(let x = 0; x <= gvs.intersection_point; x += 0.01) {
    x = Math.min(gvs.intersection_point, Math.round(x * 1000) / 1000);
    const pix = coordToPix(x, Math.max(gvs.bubble_point, gvs.Ty2(x)));
    p.vertex(pix[0], pix[1]);
  }
  p.endShape();

  const T_evap = gvs.Ty1(gvs.intersection_point);
  const T_evap_pix_1 = coordToPix(0, T_evap);
  const T_evap_pix_2 = coordToPix(1, T_evap);
  p.line(T_evap_pix_1[0], T_evap_pix_1[1], T_evap_pix_2[0], T_evap_pix_2[1]);
  p.pop();
}

function drawPoint(p) {
  p.push();
  p.noFill();
  p.strokeWeight(2);
  p.drawingContext.setLineDash([5, 5]);
  if(gvs.Q * 1000 < gvs.Q_subcooled) {
    p.stroke(benzene_color);
    let pix1 = coordToPix(gvs.x, gvs.T);
    let pix2 = coordToPix(0, gvs.T);
    p.line(pix1[0], pix1[1], pix2[0], pix2[1]);
    p.stroke(water_color);
    pix2 = coordToPix(1, gvs.T);
    p.line(pix1[0], pix1[1], pix2[0], pix2[1]);
  }
  if(gvs.Q * 1000 > gvs.Q_subcooled && gvs.Q * 1000 < gvs.Q_dew && gvs.x < gvs.intersection_point) {
    p.stroke(vapor_color);
    let pix1 = coordToPix(gvs.x, gvs.T);
    let pix2 = coordToPix(0, gvs.T);
    p.line(pix1[0], pix1[1], pix2[0], pix2[1]);
    p.stroke(water_color);
    pix2 = coordToPix(gvs.yB, gvs.T);
    p.line(pix1[0], pix1[1], pix2[0], pix2[1]);
    p.stroke(vapor_color);
    let pix3 = coordToPix(gvs.yB, 100);
    p.line(pix2[0], pix2[1], pix3[0], pix3[1]);
  }
  if(gvs.Q * 1000 > gvs.Q_subcooled && gvs.Q * 1000 < gvs.Q_dew && gvs.x >= gvs.intersection_point) {
    p.stroke(vapor_color);
    let pix1 = coordToPix(gvs.x, gvs.T);
    let pix2 = coordToPix(1, gvs.T);
    p.line(pix1[0], pix1[1], pix2[0], pix2[1]);
    p.stroke(benzene_color);
    pix2 = coordToPix(gvs.yB, gvs.T);
    p.line(pix1[0], pix1[1], pix2[0], pix2[1]);
    p.stroke(vapor_color);
    let pix3 = coordToPix(gvs.yB, 100);
    p.line(pix2[0], pix2[1], pix3[0], pix3[1]);
  }
  if(gvs.Q * 1000 >= gvs.Q_dew) {
    p.stroke(vapor_color);
    let pix1 = coordToPix(gvs.x, gvs.T);
    let pix2 = coordToPix(gvs.x, 100);
    p.line(pix1[0], pix1[1], pix2[0], pix2[1]);
  }
  p.noStroke();
  p.fill(0);
  const point_pix = coordToPix(gvs.x, gvs.T);
  p.circle(point_pix[0], point_pix[1], 8);
  if(gvs.Q * 1000 > gvs.Q_subcooled) {
    p.fill(253);
    p.stroke(0);
    p.strokeWeight(1);
    p.drawingContext.setLineDash([1, 0]);
    const y_label_pix = coordToPix(gvs.yB, 115);
    p.rectMode(p.CENTER);
    p.rect(y_label_pix[0], y_label_pix[1], 70, 24);
    p.fill(0);
    p.noStroke();
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(14);
    p.text(`y  = ${(Math.round(100 * gvs.yB) / 100).toFixed(2)}`, y_label_pix[0], y_label_pix[1]);
    p.textSize(9);
    p.text("B", y_label_pix[0] - 17, y_label_pix[1] + 5);
  }
  p.pop();
}

function drawBarChart(p) {
  p.push();
  p.translate(margin_left + plot_width + 100, margin_top + plot_height);
  p.noFill();
  p.stroke(0);
  p.strokeWeight(1);
  p.line(0, 0, 0, -1 * plot_height);
  p.line(0, 0, 200, 0);
  p.textSize(15);
  p.textAlign(p.RIGHT, p.CENTER);
  p.rectMode(p.CORNERS);
  for(let y = 0; y <= 1.00; y += 0.05) {
    y = Math.round(y * 100) / 100;
    let tickLength;
    let modulus = Math.round((y % 0.20) * 100) / 100;
    const y_Pix = -1 * plot_height * y;
    if(modulus === 0 || modulus === 0.20) {
      tickLength = 5;
      p.fill(0);
      p.noStroke();
      p.text(y.toFixed(1), -5, y_Pix);
    } else {
      tickLength = 2;
    }
    p.noFill();
    p.stroke(0);
    p.strokeWeight(1);
    p.line(0, y_Pix, tickLength, y_Pix);
  }
  p.fill(water_color);
  p.stroke(0);
  p.rect(5, 0, 60, gvs.moles_liquid_water * -1 * plot_height);
  p.fill(benzene_color);
  p.rect(70, 0, 125, gvs.moles_liquid_benzene * -1 * plot_height);
  p.fill(vapor_color);
  p.rect(135, 0, 190, gvs.moles_vapor * -1 * plot_height);
  if(gvs.show_yB) {
    p.fill(0);
    p.noStroke();
    p.textAlign(p.CENTER, p.CENTER);
    p.text(`y  = ${(Math.round(gvs.yB * 100) / 100).toFixed(2)}`, 160, gvs.moles_vapor * -1 * plot_height - 12);
    p.textSize(9);
    p.text("B", 142, gvs.moles_vapor * -1 * plot_height - 7)
  }
  p.pop();
  p.push();
  p.translate(margin_left + plot_width + 110, margin_top + plot_height + 37);
  p.fill(0);
  p.noStroke();
  p.textSize(14);
  p.rotate(-1 * Math.PI / 4);
  p.text("water\n(liquid)", 0, 0);
  p.pop();
  p.push();
  p.translate(margin_left + plot_width + 180, margin_top + plot_height + 47);
  p.fill(0);
  p.noStroke();
  p.textSize(14);
  p.rotate(-1 * Math.PI / 4);
  p.text("benzene\n(liquid)", 0, 0);
  p.pop();
  p.push();
  p.translate(margin_left + plot_width + 250, margin_top + plot_height + 37);
  p.fill(0);
  p.noStroke();
  p.textSize(14);
  p.rotate(-1 * Math.PI / 4);
  p.text("vapor", 0, 0);
  p.pop();
}

function drawAll(p) {
  drawLines(p);
  drawAxes(p);
  drawPoint(p);
  drawBarChart(p);
}

module.exports = drawAll;