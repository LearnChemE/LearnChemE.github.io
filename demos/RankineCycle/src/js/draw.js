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
  p.line(H2_pix[0], H2_pix[1], H3rev_pix[0], H3rev_pix[1]);
  p.line(H4rev_pix[0], H4rev_pix[1], H5_pix[0], H5_pix[1]);
  p.stroke(50, 150, 50);
  p.line(H3_pix[0], H3_pix[1], H4rev_pix[0], H4rev_pix[1]);
  p.noStroke();
  p.fill(0);
  p.circle(H1_pix[0], H1_pix[1], 8);
  p.circle(H3_pix[0], H3_pix[1], 8);
  p.circle(H4_pix[0], H4_pix[1], 8);
  p.circle(H5_pix[0], H5_pix[1], 8);
  p.circle(H3rev_pix[0], H3rev_pix[1], 8);
  p.fill(50, 150, 50);
  p.circle(H4rev_pix[0], H4rev_pix[1], 8);
  p.fill(0, 0, 255);
  p.circle(H2_pix[0], H2_pix[1], 8);
  p.fill(255);
  p.stroke(0);
  p.strokeWeight(1);
  p.drawingContext.setLineDash([1, 0]);
  p.circle(H1_pix[0] - 19, H1_pix[1] - 19, 25);
  p.circle(H2_pix[0] - 12, H2_pix[1] - 19, 25);
  p.circle(H3_pix[0] + 15, H3_pix[1] - 19, 25);
  p.circle(H4_pix[0] + 15, H4_pix[1] + 19, 25);
  p.circle(H5_pix[0] - 17, H5_pix[1] + 17, 25);
  p.textAlign(p.CENTER, p.CENTER);
  p.fill(0);
  p.noStroke();
  p.textSize(16);
  p.text("1", H1_pix[0] - 19, H1_pix[1] - 18);
  p.text("2", H2_pix[0] - 12, H2_pix[1] - 18);
  p.text("3", H3_pix[0] + 15, H3_pix[1] - 18);
  p.text("4", H4_pix[0] + 15, H4_pix[1] + 20);
  p.text("5", H5_pix[0] - 17, H5_pix[1] + 18);
  p.triangle(H1_pix[0], H1_pix[1], H1_pix[0] - 5, H1_pix[1] + 18, H1_pix[0] + 5, H1_pix[1] + 18);
  p.triangle(H3_pix[0], H3_pix[1], H3_pix[0] - 18, H3_pix[1] + 5, H3_pix[0] - 18, H3_pix[1] - 5);
  p.triangle(H5_pix[0], H5_pix[1], H5_pix[0] + 18, H5_pix[1] + 5, H5_pix[0] + 18, H5_pix[1] - 5);
  const angle_irrev = Math.PI / 2 + p.atan2(H4_pix[0] - H3_pix[0], H3_pix[1] - H4_pix[1]);
  const angle_rev = Math.PI / 2 + p.atan2(H4rev_pix[0] - H3_pix[0], H3_pix[1] - H4rev_pix[1]);
  p.translate(H4_pix[0], H4_pix[1]);
  p.rotate(angle_irrev);
  p.triangle(0, 0, 18, 5, 18, -5);
  p.rotate(-1 * angle_irrev);
  p.translate(-1 * H4_pix[0], -1 * H4_pix[1]);
  p.translate(H4rev_pix[0], H4rev_pix[1]);
  p.rotate(angle_rev);
  p.fill(50, 150, 50);
  p.triangle(0, 0, 18, 5, 18, -5);
  p.rotate(-1 * angle_rev);
  p.translate(-1 * H4rev_pix[0], -1 * H4rev_pix[1]);
  const x_text_top = (H2_pix[0] + H3rev_pix[0]) / 2;
  const x_text_bottom = (H5_pix[0] + H3rev_pix[0]) / 2;
  p.fill(0);
  p.text(`${Math.round(gvs.Tsat(gvs.inlet_p3_pressure))}°C`, x_text_top, H3_pix[1] - 13);
  p.text(`${Math.round(gvs.Tsat(gvs.outlet_p4_pressure))}°C`, x_text_bottom, H4_pix[1] - 13);
  p.textSize(18);
  p.textAlign(p.LEFT, p.CENTER);
  p.text(`work = ${Math.round(gvs.W)} kJ`, gvs.plot.margins[0][0] + 150, gvs.plot.margins[1][0] + 30);
  p.text(`cycle efficiency = ${(Math.round(100 * gvs.eff) / 100).toFixed(2)}`, gvs.plot.margins[0][0] + 350, gvs.plot.margins[1][0] + 30);
  p.pop();
}

function drawTurbine(p) {
  p.push();
  p.stroke(0);
  p.strokeWeight(2);
  p.translate(p.width / 2, p.height / 2);
  const number_of_lines = 15;
  for(let i = 0; i < number_of_lines; i++) {
    const x1 = -150;
    const y1 = -150 + i * 300 / number_of_lines;
    const x2 = -150 + i * 300 / number_of_lines;
    const y2 = -150;
    p.line(x1, y1, x2, y2);
    const x3 = -150 + i * 300 / number_of_lines;
    const y3 = 150;
    const x4 = 150;
    const y4 = -150 + i * 300 / number_of_lines;
    p.line(x3, y3, x4, y4);
  }
  p.fill(253);
  p.noStroke();
  p.beginShape();
  p.vertex(-152, 20);
  p.vertex(152, 140);
  p.vertex(152, 160);
  p.vertex(-152, 160);
  p.endShape(p.CLOSE);
  p.beginShape();
  p.vertex(-152, -20);
  p.vertex(152, -140);
  p.vertex(152, -160);
  p.vertex(-152, -160);
  p.endShape(p.CLOSE);
  p.rect(-152, -50, 30, 100);
  p.rect(122, -152, 32, 304);
  p.stroke(0);
  p.fill(255);
  p.beginShape();
  p.vertex(-100, 20);
  p.vertex(100, 100);
  p.vertex(100, -100);
  p.vertex(-100, -20);
  p.endShape(p.CLOSE);
  p.noFill();
  p.stroke(0);
  p.strokeWeight(15);
  p.strokeCap(p.PROJECT);
  p.line(-140, -130, -60, -130);
  p.line(-60, -130, -60, -70);
  p.line(107.5, 0, 180, 0);
  p.line(10, 72, 10, 170);
  p.line(10, 170, 50, 170);
  p.noStroke();
  p.fill(0);
  p.triangle(-75, -80, -45, -80, -60, -35);
  p.triangle(170, -15, 170, 15, 215, 0);
  p.triangle(40, 185, 40, 155, 85, 170);
  p.textAlign(p.CENTER, p.CENTER);
  p.textSize(20);
  p.text(`η  = ${gvs.turbine_efficiency.toFixed(2)}`, 10, 0);
  p.text("superheated steam", -250, -170);
  p.text(`P  = ${gvs.inlet_p3_pressure.toFixed(2)} MPa`, -250, -140);
  p.text(`T  = 500°C`, -250, -110);
  const state4 = gvs.H4 > gvs.H(gvs.outlet_p4_pressure, 2) ? "superheated steam" : "vapor-liquid mixture";
  p.text(state4, 180, 150);
  p.text(`P  = ${gvs.outlet_p4_pressure.toFixed(2)} MPa`, 180, 180);
  p.text(`T  = ${Math.round(gvs.T4)}°C`, 180, 210);
  if(state4 === "vapor-liquid mixture") {
    const HSatVapor = gvs.H(gvs.outlet_p4_pressure, 2);
    const HSatLiquid = gvs.H5;
    const q = (HSatVapor - gvs.H4) / (HSatVapor - HSatLiquid);
    p.text(`${(Math.round(q * 1000) / 10).toFixed(1)}% liquid  ${(Math.round((1 - q) * 1000) / 10).toFixed(1)}% vapor`, 180, 240);
  }
  p.text(`W = ${Math.round(gvs.W)} kJ`, 280, 0);
  p.textSize(14);
  p.text("3", -297, -132);
  p.text("3", -283, -102);
  p.text("4", 132, 189);
  p.text("4", 154, 219);
  p.pop();
}

function drawAll(p) {
  if(gvs.display === "P-H diagram") {
    drawPhaseEnvelope(p);
    drawCycle(p);
    drawAxes(p);
  }
  if(gvs.display === "turbine") {
    drawTurbine(p);
  }
  if(gvs.display === "Rankine cycle") {

  }
}

module.exports = drawAll;