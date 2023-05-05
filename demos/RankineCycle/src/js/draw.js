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
  p.stroke(50, 150, 50);
  p.line(H3_pix[0], H3_pix[1], H4rev_pix[0], H4rev_pix[1]);
  p.stroke(0);
  p.line(H1_pix[0], H1_pix[1], H2_pix[0], H2_pix[1]);
  p.line(H3rev_pix[0], H3rev_pix[1], H3_pix[0], H3_pix[1]);
  p.line(H3_pix[0], H3_pix[1], H4_pix[0], H4_pix[1]);
  p.line(H4_pix[0], H4_pix[1], H4rev_pix[0], H4rev_pix[1]);
  p.line(H5_pix[0], H5_pix[1], H1_pix[0], H1_pix[1]);
  p.line(H2_pix[0], H2_pix[1], H3rev_pix[0], H3rev_pix[1]);
  p.line(H4rev_pix[0], H4rev_pix[1], H5_pix[0], H5_pix[1]);
  p.noStroke();
  p.fill(50, 150, 50);
  p.circle(H4rev_pix[0], H4rev_pix[1], 8);
  p.fill(0);
  p.circle(H1_pix[0], H1_pix[1], 8);
  p.circle(H3_pix[0], H3_pix[1], 8);
  p.circle(H4_pix[0], H4_pix[1], 8);
  p.circle(H5_pix[0], H5_pix[1], 8);
  p.circle(H3rev_pix[0], H3rev_pix[1], 8);
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
  p.translate(H4rev_pix[0], H4rev_pix[1]);
  p.rotate(angle_rev);
  p.fill(50, 150, 50);
  p.triangle(0, 0, 18, 5, 18, -5);
  p.rotate(-1 * angle_rev);
  p.translate(-1 * H4rev_pix[0], -1 * H4rev_pix[1]);
  p.fill(0);
  p.translate(H4_pix[0], H4_pix[1]);
  p.rotate(angle_irrev);
  p.triangle(0, 0, 18, 5, 18, -5);
  p.rotate(-1 * angle_irrev);
  p.translate(-1 * H4_pix[0], -1 * H4_pix[1]);
  const x_text_top = (H2_pix[0] + H3rev_pix[0]) / 2;
  const x_text_bottom = (H5_pix[0] + H3rev_pix[0]) / 2;
  p.text(`${Math.round(gvs.Tsat(gvs.inlet_p3_pressure))}°C`, x_text_top, H3_pix[1] - 13);
  p.text(`${Math.round(gvs.Tsat(gvs.outlet_p4_pressure))}°C`, x_text_bottom, H4_pix[1] - 13);
  p.textSize(18);
  p.textAlign(p.LEFT, p.CENTER);
  p.text(`work = ${Math.round(gvs.W)} kJ`, gvs.plot.margins[0][0] + 150, gvs.plot.margins[1][0] + 30);
  p.text(`cycle efficiency = ${(Math.round(1000 * gvs.eff) / 1000).toFixed(3)}`, gvs.plot.margins[0][0] + 350, gvs.plot.margins[1][0] + 30);
  if(gvs.H4 < gvs.H(gvs.outlet_p4_pressure, 2)) {
    const HSatVapor = gvs.H(gvs.outlet_p4_pressure, 2);
    const HSatLiquid = gvs.H5;
    const q = (HSatVapor - gvs.H4) / (HSatVapor - HSatLiquid);
    const x = (gvs.saturation_list[0][0] + gvs.saturation_list[gvs.saturation_list.length - 1][0]) / 2;
    const yPix = p.height - gvs.plot.margins[1][1] - 30;
    const pix = coordToPix(x, 0.001);
    p.textAlign(p.CENTER);
    p.text(`${(Math.round(q * 1000) / 10).toFixed(1)}% liquid  ${(Math.round((1 - q) * 1000) / 10).toFixed(1)}% vapor`, pix[0], yPix);
  }
  p.pop();
}

function drawTurbine(p) {
  p.push();
  p.translate(0, -30);
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
  p.text(`η   = ${gvs.turbine_efficiency.toFixed(2)}`, 10, 0);
  p.text("superheated steam", -250, -170);
  p.text(`P  = ${gvs.inlet_p3_pressure.toFixed(2)} MPa`, -250, -140);
  p.text(`T  = 500°C`, -250, -110);
  const state4 = gvs.H4 > gvs.H(gvs.outlet_p4_pressure, 2) ? "superheated steam" : "vapor-liquid mixture";
  p.text(state4, 180, 150);
  p.text(`P  = ${gvs.outlet_p4_pressure.toFixed(2)} MPa`, 180, 180);
  p.textAlign(p.LEFT);
  p.text(`T  = ${Math.round(gvs.T4)}°C`, 138, 210);
  p.textAlign(p.CENTER);
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
  p.text("T", -14, 11);
  p.pop();
}

function isCursorOver(cursorX, cursorY, objectX, objectY, objectRadius) {
  const distance_from_object = Math.sqrt((cursorX - objectX - gvs.p.width / 2)**2 + (cursorY - objectY - gvs.p.height / 2)**2);
  if(distance_from_object <= objectRadius) {
    return true
  } else {
    return false
  }
}

function drawRankine(p) {
  p.push();
  p.translate(p.width / 2, p.height / 2);
  p.fill(255, 190, 190);
  p.stroke(0);
  p.strokeWeight(1);
  p.rect(-200, -100, 80, 160, 10);
  p.fill(200, 200, 0);
  p.beginShape();
  p.vertex(150, -147);
  p.vertex(220, -170);
  p.vertex(220, -100);
  p.vertex(150, -123);
  p.endShape(p.CLOSE);
  p.fill(220, 220, 255);
  p.circle(180, 150, 90);
  p.fill(220);
  p.translate(0, 4);
  p.circle(-50, 120, 70);
  p.noStroke();
  p.rect(5, 155, -60, -20);
  p.rect(-55, 85, -55, 20);
  p.stroke(0);
  p.line(5, 155, -55, 155);
  p.line(5, 135, -18, 135);
  p.line(-55, 85, -110, 85);
  p.line(-110, 105, -83, 105);
  p.line(5, 155, 5, 135);
  p.line(-110, 85, -110, 105);
  p.strokeWeight(2);
  p.translate(0, -4);
  p.line(-160, -100, -160, -200);
  p.line(-160, -200, 180, -200);
  p.line(180, -200, 180, -160);
  p.line(135, 150, 6, 150);
  p.line(-110, 99, -160, 99);
  p.line(-160, 99, -160, 61);
  p.line(180, -110, 180, 105);
  p.line(220, -135, 280, -135);
  p.line(-280, -20, -200, -20);
  p.noStroke();
  p.fill(0);
  p.triangle(180, -158, 186, -175, 174, -175);
  p.triangle(180, 107, 186, 90, 174, 90);
  p.triangle(4, 150, 19, 156, 19, 144);
  p.triangle(-160, 58, -166, 73, -154, 73);
  p.triangle(-198, -20, -213, -26, -213, -14);
  p.triangle(282, -135, 267, -141, 267, -129);
  p.fill(200);
  p.strokeWeight(1);
  p.stroke(0);
  p.rect(220, -139, 30, 8);
  p.noFill();
  p.strokeWeight(2);
  p.translate(0, 8);
  p.beginShape();
  p.vertex(160, 220);
  p.vertex(160, 160);
  p.vertex(170, 170);
  p.vertex(180, 160);
  p.vertex(190, 170);
  p.vertex(200, 160);
  p.vertex(200, 220);
  p.endShape();
  p.noStroke();
  p.fill(0);
  p.triangle(200, 222, 206, 207, 194, 207);
  p.translate(0, -8);
  p.textSize(16);
  p.textAlign(p.CENTER, p.CENTER);
  p.text("boiler", -160, -20);
  p.text("turbine", 188, -135);
  p.text("condenser", 180, 150);
  p.text("pump", -50, 124);
  p.textAlign(p.LEFT, p.CENTER);
  p.text(`Q   = ${Math.round(gvs.H3 - gvs.H1)} kJ`, -385, -20);
  p.text(`Q   = ${Math.round(gvs.H5 - gvs.H4)} kJ`, 190, 245);
  p.text(`W = ${-1 * Math.round(gvs.W)} kJ`, 285, -135);
  p.textSize(12);
  p.text("H", -371, -14);
  p.text("C", 204, 251);
  p.textSize(16);
  p.textAlign(p.CENTER, p.CENTER);
  p.rectMode(p.CENTER);
  p.strokeWeight(1);
  const coord1 = [-225, 100];
  const coord3 = [-225, -200];
  const coord4 = [240, 0];
  const coord5 = [50, 100];
  if(isCursorOver(p.mouseX, p.mouseY, coord1[0], coord1[1], 15)) {
    p.stroke(0);
    p.fill(255);
    p.rect(coord1[0], coord1[1], 110, 50, 5);
    p.noStroke();
    p.fill(0);
    p.text("high-pressure\nliquid", coord1[0], coord1[1]);
  } else {
    p.stroke(0);
    p.fill(255);
    p.circle(coord1[0], coord1[1], 25);
    p.noStroke();
    p.fill(0);
    p.text("1", coord1[0], coord1[1] + 1);
  }

  if(isCursorOver(p.mouseX, p.mouseY, coord3[0], coord3[1], 15)) {
    p.stroke(0);
    p.fill(255);
    p.rect(coord3[0], coord3[1], 110, 50, 5);
    p.noStroke();
    p.fill(0);
    p.text("superheated\nsteam", coord3[0], coord3[1]);
  } else {
    p.stroke(0);
    p.fill(255);
    p.circle(coord3[0], coord3[1], 25);
    p.noStroke();
    p.fill(0);
    p.text("3", coord3[0], coord3[1] + 1);
  }

  if(isCursorOver(p.mouseX, p.mouseY, coord4[0], coord4[1], 15)) {
    p.stroke(0);
    p.fill(255);
    p.rect(coord4[0], coord4[1], 110, 50, 5);
    p.noStroke();
    p.fill(0);
    const state = gvs.H4 > gvs.H(gvs.outlet_p4_pressure, 2) ? "superheated\nsteam" : "vapor-liquid\nmixture";
    p.text(state, coord4[0], coord4[1]);
  } else {
    p.stroke(0);
    p.fill(255);
    p.circle(coord4[0], coord4[1], 25);
    p.noStroke();
    p.fill(0);
    p.text("4", coord4[0], coord4[1] + 1);
  }

  if(isCursorOver(p.mouseX, p.mouseY, coord5[0], coord5[1], 15)) {
    p.stroke(0);
    p.fill(255);
    p.rect(coord5[0], coord5[1], 90, 50, 5);
    p.noStroke();
    p.fill(0);
    p.text("saturated\nliquid", coord5[0], coord5[1]);
  } else {
    p.stroke(0);
    p.fill(255);
    p.circle(coord5[0], coord5[1], 25);
    p.noStroke();
    p.fill(0);
    p.text("5", coord5[0], coord5[1] + 1);
  }
  p.fill(0);
  p.noStroke();
  p.text("move cursor over numbers to show phases present", 0, -240);
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
    drawRankine(p);
  }
}

module.exports = drawAll;