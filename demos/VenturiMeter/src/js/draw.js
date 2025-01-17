const liquid_color = "rgb(220, 220, 255)";

function mmToPix(x, y) {
  const xPix = (x / 100) * (gvs.p.width / 3);
  const yPix = (y / 100) * (gvs.p.width / 3);
  return [xPix, yPix]
}

function drawAll(p) {
  p.push();
  p.translate(p.width / 2, p.height / 2 + 170);

  // start of manometer fluid section

  p.rectMode(p.CORNERS);
  p.fill(liquid_color);
  p.noStroke();
  let coord1 = mmToPix(-78, 0);
  let coord2 = mmToPix(-72, -1 * gvs.manometer_1_pressure);
  p.rect(coord1[0], coord1[1], coord2[0], coord2[1]);

  // coord1 = mmToPix(-33, 0);
  // coord2 = mmToPix(-27, -1 * gvs.manometer_2_pressure);
  // p.rect(coord1[0], coord1[1], coord2[0], coord2[1]);

  coord1 = mmToPix(-3, 0);
  coord2 = mmToPix(3, -1 * gvs.manometer_3_pressure);
  p.rect(coord1[0], coord1[1], coord2[0], coord2[1]);

  // coord1 = mmToPix(27, 0);
  // coord2 = mmToPix(33, -1 * gvs.manometer_4_pressure);
  // p.rect(coord1[0], coord1[1], coord2[0], coord2[1]);

  coord1 = mmToPix(72, 0);
  coord2 = mmToPix(78, -1 * gvs.manometer_5_pressure);
  p.rect(coord1[0], coord1[1], coord2[0], coord2[1]);

  p.stroke(100, 100, 255);
  p.strokeWeight(1);
  coord1 = mmToPix(-78, -1 * gvs.manometer_1_pressure);
  coord2 = mmToPix(-72, -1 * gvs.manometer_1_pressure);
  p.line(coord1[0], coord1[1], coord2[0], coord2[1]);

  // coord1 = mmToPix(-33, -1 * gvs.manometer_2_pressure);
  // coord2 = mmToPix(-27, -1 * gvs.manometer_2_pressure);
  // p.line(coord1[0], coord1[1], coord2[0], coord2[1]);

  coord1 = mmToPix(-3, -1 * gvs.manometer_3_pressure);
  coord2 = mmToPix(3, -1 * gvs.manometer_3_pressure);
  p.line(coord1[0], coord1[1], coord2[0], coord2[1]);

  // coord1 = mmToPix(27, -1 * gvs.manometer_4_pressure);
  // coord2 = mmToPix(33, -1 * gvs.manometer_4_pressure);
  // p.line(coord1[0], coord1[1], coord2[0], coord2[1]);

  coord1 = mmToPix(78, -1 * gvs.manometer_5_pressure);
  coord2 = mmToPix(72, -1 * gvs.manometer_5_pressure);
  p.line(coord1[0], coord1[1], coord2[0], coord2[1]);

  // start of venturi meter outline section

  const outline_list_mm = [
    [-100, -1 * gvs.outer_diameter / 2],
    [-50, -1 * gvs.outer_diameter / 2],
    [-10, -1 * gvs.inner_diameter / 2],
    [10, -1 * gvs.inner_diameter / 2],
    [50, -1 * gvs.outer_diameter / 2],
    [100, -1 * gvs.outer_diameter / 2],
    [100, gvs.outer_diameter / 2],
    [50, gvs.outer_diameter / 2],
    [10, gvs.inner_diameter / 2],
    [-10, gvs.inner_diameter / 2],
    [-50, gvs.outer_diameter / 2],
    [-100, gvs.outer_diameter / 2],
  ];
  const outline_list_pix = [];
  p.noStroke();
  p.fill(liquid_color);
  p.beginShape();
  for (let i = 0; i < outline_list_mm.length; i++) {
    const coord = outline_list_mm[i];
    const pix = mmToPix(coord[0], coord[1]);
    p.vertex(pix[0], pix[1]);
  }
  p.endShape();
  p.stroke(0);
  p.strokeWeight(1);
  p.noFill();

  coord1 = mmToPix(-100, -1 * gvs.outer_diameter / 2);
  coord2 = mmToPix(-78, -1 * gvs.outer_diameter / 2);
  p.line(coord1[0], coord1[1], coord2[0], coord2[1]);

  coord1 = mmToPix(-72, -1 * gvs.outer_diameter / 2);
  coord2 = mmToPix(-50, -1 * gvs.outer_diameter / 2);
  p.line(coord1[0], coord1[1], coord2[0], coord2[1]);

  coord1 = mmToPix(-50, -1 * gvs.outer_diameter / 2);
  coord2 = mmToPix(-10, -1 * gvs.inner_diameter / 2);
  p.line(coord1[0], coord1[1], coord2[0], coord2[1]);

  coord1 = mmToPix(-10, -1 * gvs.inner_diameter / 2);
  coord2 = mmToPix(-3, -1 * gvs.inner_diameter / 2);
  p.line(coord1[0], coord1[1], coord2[0], coord2[1]);

  coord1 = mmToPix(3, -1 * gvs.inner_diameter / 2);
  coord2 = mmToPix(10, -1 * gvs.inner_diameter / 2);
  p.line(coord1[0], coord1[1], coord2[0], coord2[1]);

  coord1 = mmToPix(10, -1 * gvs.inner_diameter / 2);
  coord2 = mmToPix(50, -1 * gvs.outer_diameter / 2);
  p.line(coord1[0], coord1[1], coord2[0], coord2[1]);

  coord1 = mmToPix(50, -1 * gvs.outer_diameter / 2);
  coord2 = mmToPix(72, -1 * gvs.outer_diameter / 2);
  p.line(coord1[0], coord1[1], coord2[0], coord2[1]);

  coord1 = mmToPix(78, -1 * gvs.outer_diameter / 2);
  coord2 = mmToPix(100, -1 * gvs.outer_diameter / 2);
  p.line(coord1[0], coord1[1], coord2[0], coord2[1]);

  coord1 = mmToPix(100, gvs.outer_diameter / 2);
  coord2 = mmToPix(50, gvs.outer_diameter / 2);
  p.line(coord1[0], coord1[1], coord2[0], coord2[1]);

  coord1 = mmToPix(50, gvs.outer_diameter / 2);
  coord2 = mmToPix(10, gvs.inner_diameter / 2);
  p.line(coord1[0], coord1[1], coord2[0], coord2[1]);

  coord1 = mmToPix(10, gvs.inner_diameter / 2);
  coord2 = mmToPix(-10, gvs.inner_diameter / 2);
  p.line(coord1[0], coord1[1], coord2[0], coord2[1]);

  coord1 = mmToPix(-10, gvs.inner_diameter / 2);
  coord2 = mmToPix(-50, gvs.outer_diameter / 2);
  p.line(coord1[0], coord1[1], coord2[0], coord2[1]);

  coord1 = mmToPix(-50, gvs.outer_diameter / 2);
  coord2 = mmToPix(-100, gvs.outer_diameter / 2);
  p.line(coord1[0], coord1[1], coord2[0], coord2[1]);

  // start of manometers section

  coord1 = mmToPix(-78, -1 * gvs.outer_diameter / 2);
  coord2 = mmToPix(-78, -1 * gvs.outer_diameter / 2 - 130);
  p.line(coord1[0], coord1[1], coord2[0], coord2[1]);

  coord1 = mmToPix(-72, -1 * gvs.outer_diameter / 2);
  coord2 = mmToPix(-72, -1 * gvs.outer_diameter / 2 - 130);
  p.line(coord1[0], coord1[1], coord2[0], coord2[1]);

  // coord1 = mmToPix(-33, (25 / 40) * -1 * gvs.outer_diameter / 2 + (15 / 40) * -1 * gvs.inner_diameter / 2);
  // coord2 = mmToPix(-33, -1 * gvs.outer_diameter / 2 - 130);
  // p.line(coord1[0], coord1[1], coord2[0], coord2[1]);

  // coord1 = mmToPix(-27, (15 / 40) * -1 * gvs.outer_diameter / 2 + (25 / 40) * -1 * gvs.inner_diameter / 2);
  // coord2 = mmToPix(-27, -1 * gvs.outer_diameter / 2 - 130);
  // p.line(coord1[0], coord1[1], coord2[0], coord2[1]);

  coord1 = mmToPix(-3, -1 * gvs.inner_diameter / 2);
  coord2 = mmToPix(-3, -1 * gvs.outer_diameter / 2 - 130);
  p.line(coord1[0], coord1[1], coord2[0], coord2[1]);

  coord1 = mmToPix(3, -1 * gvs.inner_diameter / 2);
  coord2 = mmToPix(3, -1 * gvs.outer_diameter / 2 - 130);
  p.line(coord1[0], coord1[1], coord2[0], coord2[1]);

  // coord1 = mmToPix(27, (15 / 40) * -1 * gvs.outer_diameter / 2 + (25 / 40) * -1 * gvs.inner_diameter / 2);
  // coord2 = mmToPix(27, -1 * gvs.outer_diameter / 2 - 130);
  // p.line(coord1[0], coord1[1], coord2[0], coord2[1]);

  // coord1 = mmToPix(33, (25 / 40) * -1 * gvs.outer_diameter / 2 + (15 / 40) * -1 * gvs.inner_diameter / 2);
  // coord2 = mmToPix(33, -1 * gvs.outer_diameter / 2 - 130);
  // p.line(coord1[0], coord1[1], coord2[0], coord2[1]);

  coord1 = mmToPix(78, -1 * gvs.outer_diameter / 2);
  coord2 = mmToPix(78, -1 * gvs.outer_diameter / 2 - 130);
  p.line(coord1[0], coord1[1], coord2[0], coord2[1]);

  coord1 = mmToPix(72, -1 * gvs.outer_diameter / 2);
  coord2 = mmToPix(72, -1 * gvs.outer_diameter / 2 - 130);
  p.line(coord1[0], coord1[1], coord2[0], coord2[1]);

  // start of middle arrow and label section

  coord1 = mmToPix(7, -1 * gvs.inner_diameter / 2);
  coord2 = mmToPix(7, -1 * gvs.inner_diameter / 2 - 10);
  let coord3 = mmToPix(8.3, -1 * gvs.inner_diameter / 2 - 3);
  let coord4 = mmToPix(5.7, -1 * gvs.inner_diameter / 2 - 3);
  p.line(coord1[0], coord1[1], coord2[0], coord2[1]);
  p.line(coord1[0], coord1[1], coord3[0], coord3[1]);
  p.line(coord1[0], coord1[1], coord4[0], coord4[1]);

  coord1 = mmToPix(7, gvs.inner_diameter / 2);
  coord2 = mmToPix(7, gvs.inner_diameter / 2 + 10);
  coord3 = mmToPix(8.5, gvs.inner_diameter / 2 + 3);
  coord4 = mmToPix(5.5, gvs.inner_diameter / 2 + 3);
  p.line(coord1[0], coord1[1], coord2[0], coord2[1]);
  p.line(coord1[0], coord1[1], coord3[0], coord3[1]);
  p.line(coord1[0], coord1[1], coord4[0], coord4[1]);

  p.textSize(14);
  p.fill(0);
  p.noStroke();
  p.textAlign(p.CENTER, p.CENTER);
  let labelCoord = mmToPix(7, 20);
  p.text(`${gvs.inner_diameter} mm`, labelCoord[0], labelCoord[1]);

  // start of axis section

  p.noFill();
  p.stroke(0);
  coord1 = mmToPix(-120, 0);
  coord2 = mmToPix(-120, -130 - gvs.outer_diameter / 2);
  p.line(coord1[0], coord1[1], coord2[0], coord2[1]);

  p.fill(0);
  p.textAlign(p.RIGHT, p.CENTER);
  p.textSize(16);
  for (let y = 0; y <= 130 + gvs.outer_diameter / 2; y += 4) {
    y = Math.round(y);
    const tickWidth = y % 20 === 0 || y % 20 === 20 ? 8 : 4;
    const pix = mmToPix(-120, -1 * y);
    p.stroke(0);
    p.line(pix[0], pix[1], pix[0] + tickWidth, pix[1]);
    if (tickWidth === 8) {
      p.noStroke();
      p.text(`${y}`, pix[0] - 5, pix[1]);
    }
  }

  p.fill(0);
  p.noStroke();
  p.textAlign(p.CENTER, p.CENTER);
  labelCoord = mmToPix(-139, -70);
  p.text("mm", labelCoord[0], labelCoord[1]);

  p.textSize(14);

  p.stroke(0);
  coord1 = mmToPix(-95, -1 * gvs.outer_diameter / 2);
  coord2 = mmToPix(-95, gvs.outer_diameter / 2);
  p.line(coord1[0], coord1[1], coord2[0], coord2[1]);

  coord1 = mmToPix(-93, -1 * gvs.outer_diameter / 2 + 3);
  coord2 = mmToPix(-95, -1 * gvs.outer_diameter / 2);
  p.line(coord1[0], coord1[1], coord2[0], coord2[1]);

  coord1 = mmToPix(-97, -1 * gvs.outer_diameter / 2 + 3);
  coord2 = mmToPix(-95, -1 * gvs.outer_diameter / 2);
  p.line(coord1[0], coord1[1], coord2[0], coord2[1]);

  coord1 = mmToPix(-92, gvs.outer_diameter / 2 - 3);
  coord2 = mmToPix(-95, gvs.outer_diameter / 2);
  p.line(coord1[0], coord1[1], coord2[0], coord2[1]);

  coord1 = mmToPix(-97, gvs.outer_diameter / 2 - 3);
  coord2 = mmToPix(-95, gvs.outer_diameter / 2);
  p.line(coord1[0], coord1[1], coord2[0], coord2[1]);

  p.fill(0);
  p.noStroke();
  coord1 = mmToPix(-85, 0);
  p.text(`${gvs.outer_diameter} mm`, coord1[0], coord1[1]);

  p.noFill();
  p.stroke(0);
  const curveVerticesTop = [
    [-100, 0.5 * -1 * gvs.outer_diameter / 2],
    [-70, 0.5 * -1 * gvs.outer_diameter / 2],
    [-50, 0.5 * -1 * gvs.outer_diameter / 2],
    [-10, 0.5 * -1 * gvs.inner_diameter / 2 - 0.2],
    [0, 0.5 * -1 * gvs.inner_diameter / 2],
    [10, 0.5 * -1 * gvs.inner_diameter / 2 - 0.2],
    [50, 0.5 * -1 * gvs.outer_diameter / 2],
    [70, 0.5 * -1 * gvs.outer_diameter / 2],
    [100, 0.5 * -1 * gvs.outer_diameter / 2]
  ];
  const curveVerticesBottom = [
    [-100, 0.5 * gvs.outer_diameter / 2],
    [-70, 0.5 * gvs.outer_diameter / 2],
    [-50, 0.5 * gvs.outer_diameter / 2],
    [-10, 0.5 * gvs.inner_diameter / 2 + 0.2],
    [0, 0.5 * gvs.inner_diameter / 2],
    [10, 0.5 * gvs.inner_diameter / 2 + 0.2],
    [50, 0.5 * gvs.outer_diameter / 2],
    [70, 0.5 * gvs.outer_diameter / 2],
    [100, 0.5 * gvs.outer_diameter / 2]
  ];
  p.beginShape();
  for (let i = 0; i < curveVerticesTop.length; i++) {
    const mm = curveVerticesTop[i];
    const coord = mmToPix(mm[0], mm[1]);
    p.curveVertex(coord[0], coord[1]);
  }
  p.endShape();

  p.beginShape();
  for (let i = 0; i < curveVerticesBottom.length; i++) {
    const mm = curveVerticesBottom[i];
    const coord = mmToPix(mm[0], mm[1]);
    p.curveVertex(coord[0], coord[1]);
  }
  p.endShape();

  coord1 = mmToPix(-70, 0);
  coord2 = mmToPix(70, 0);
  p.line(coord1[0], coord1[1], coord2[0], coord2[1]);

  p.fill(0);
  p.noStroke();
  coord1 = mmToPix(-66, 0);
  coord2 = mmToPix(-70, 1);
  coord3 = mmToPix(-70, -1);
  p.triangle(coord1[0], coord1[1], coord2[0], coord2[1], coord3[0], coord3[1]);

  coord1 = mmToPix(-66, 0.5 * -1 * gvs.outer_diameter / 2);
  coord2 = mmToPix(-70, 0.5 * -1 * gvs.outer_diameter / 2 + 1);
  coord3 = mmToPix(-70, 0.5 * -1 * gvs.outer_diameter / 2 - 1);
  p.triangle(coord1[0], coord1[1], coord2[0], coord2[1], coord3[0], coord3[1]);

  coord1 = mmToPix(-66, 0.5 * gvs.outer_diameter / 2);
  coord2 = mmToPix(-70, 0.5 * gvs.outer_diameter / 2 + 1);
  coord3 = mmToPix(-70, 0.5 * gvs.outer_diameter / 2 - 1);
  p.triangle(coord1[0], coord1[1], coord2[0], coord2[1], coord3[0], coord3[1]);

  coord1 = mmToPix(2, 0);
  coord2 = mmToPix(-2, 1);
  coord3 = mmToPix(-2, -1);
  p.triangle(coord1[0], coord1[1], coord2[0], coord2[1], coord3[0], coord3[1]);

  coord1 = mmToPix(2, 0.5 * gvs.inner_diameter / 2);
  coord2 = mmToPix(-2, 0.5 * gvs.inner_diameter / 2 + 1);
  coord3 = mmToPix(-2, 0.5 * gvs.inner_diameter / 2 - 1);
  p.triangle(coord1[0], coord1[1], coord2[0], coord2[1], coord3[0], coord3[1]);

  coord1 = mmToPix(2, -1 * 0.5 * gvs.inner_diameter / 2);
  coord2 = mmToPix(-2, -1 * 0.5 * gvs.inner_diameter / 2 + 1);
  coord3 = mmToPix(-2, -1 * 0.5 * gvs.inner_diameter / 2 - 1);
  p.triangle(coord1[0], coord1[1], coord2[0], coord2[1], coord3[0], coord3[1]);

  coord1 = mmToPix(72, 0);
  coord2 = mmToPix(68, 1);
  coord3 = mmToPix(68, -1);
  p.triangle(coord1[0], coord1[1], coord2[0], coord2[1], coord3[0], coord3[1]);

  coord1 = mmToPix(72, 0.5 * -1 * gvs.outer_diameter / 2);
  coord2 = mmToPix(68, 0.5 * -1 * gvs.outer_diameter / 2 + 1);
  coord3 = mmToPix(68, 0.5 * -1 * gvs.outer_diameter / 2 - 1);
  p.triangle(coord1[0], coord1[1], coord2[0], coord2[1], coord3[0], coord3[1]);

  coord1 = mmToPix(72, 0.5 * gvs.outer_diameter / 2);
  coord2 = mmToPix(68, 0.5 * gvs.outer_diameter / 2 + 1);
  coord3 = mmToPix(68, 0.5 * gvs.outer_diameter / 2 - 1);
  p.triangle(coord1[0], coord1[1], coord2[0], coord2[1], coord3[0], coord3[1]);

  if (gvs.show_flow_rate) {
    p.fill(0);
    p.noStroke();
    p.textSize(16);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(`volumetric flow rate = ${Math.round(gvs.volumetric_flow_rate * 1e6)} mL / s`, -200, 60);
  }
  p.pop();

  p.push();
  p.fill(0);
  p.noStroke();
  p.textSize(16);
  p.textAlign(p.CENTER);
  p.text(`${Math.round(gvs.manometer_1_pressure)} mm`, 197, 50);
  // p.text(`${Math.round(gvs.manometer_2_pressure)}`, 319, 50);
  p.text(`${Math.round(gvs.manometer_3_pressure)}`, 397, 50);
  // p.text(`${Math.round(gvs.manometer_4_pressure)}`, 479, 50);
  p.text(`${Math.round(gvs.manometer_5_pressure)}`, 597, 50);
  p.pop();
}

module.exports = drawAll;