function drawTriangle(p) {
  p.push();
  // p.fill(255);
  // p.noStroke();
  // p.triangle(gvs.t[0][0], gvs.t[0][1], gvs.t[1][0], gvs.t[1][1], gvs.t[2][0], gvs.t[2][1]);
  p.stroke(150, 150, 150);
  p.strokeWeight(1);
  p.line(gvs.t[0][0], gvs.t[0][1], gvs.t[1][0], gvs.t[1][1]);
  p.line(gvs.t[1][0], gvs.t[1][1], gvs.t[2][0], gvs.t[2][1]);
  p.line(gvs.t[2][0], gvs.t[2][1], gvs.t[0][0], gvs.t[0][1]);
  p.pop();
}

// 0 is left, 1 is right, 2 is top

function drawComponentA(p) {
  p.push();
  for(let i = 1; i < 20; i++) {
    const left1 = gvs.t[2][0] - (i / 20) * (gvs.t[2][0] - gvs.t[0][0]);
    const left2 = gvs.t[2][0] + (i / 20) * (gvs.t[2][0] - gvs.t[0][0]);
    const top = gvs.t[2][1] - (i / 20) * (gvs.t[2][1] - gvs.t[0][1]);
    p.stroke(gvs.colorLines);
    if(gvs.show_grid) {
      p.line(left1, top, left2, top);
    }
    p.noStroke();
    p.fill(gvs.colorA);
    p.textAlign(p.LEFT, p.CENTER);
    p.textSize(15);
    if(i % 2 == 0) {
      p.text(`${Number(1 - i / 20).toFixed(1)}`, left2 + 5, top);
    }

  }
  p.textAlign(p.CENTER, p.BOTTOM);
  p.textSize(18);
  p.text("A", gvs.t[2][0], gvs.t[2][1]);
  p.pop();
}

function drawComponentB(p) {
  p.push();
  for(let i = 1; i < 20; i++) {
    const left1 = gvs.t[0][0] + (i / 20) * (gvs.t[2][0] - gvs.t[0][0]);
    const left2 = gvs.t[0][0] + (i / 20) * (gvs.t[1][0] - gvs.t[0][0]);
    const top1 = gvs.t[0][1] + (i / 20) * (gvs.t[2][1] - gvs.t[0][1]);
    const top2 = gvs.t[1][1];
    p.stroke(gvs.colorLines);
    if(gvs.show_grid) {
      p.line(left1, top1, left2, top2);
    }
    p.noStroke();
    p.fill(gvs.colorB);
    p.textAlign(p.RIGHT, p.CENTER);
    p.textSize(15);
    if(i % 2 == 0) {
      p.text(`${Number(1 - i / 20).toFixed(1)}`, left1 - 5, top1);
    }

  }
  p.textAlign(p.RIGHT, p.CENTER);
  p.textSize(18);
  p.text("B", gvs.t[0][0] - 5, gvs.t[0][1] + 5);
  p.pop();
}

function drawComponentC(p) {
  p.push();
  for(let i = 1; i < 20; i++) {
    const left1 = gvs.t[1][0] - (i / 20) * (gvs.t[1][0] - gvs.t[2][0]);
    const left2 = gvs.t[1][0] - (i / 20) * (gvs.t[1][0] - gvs.t[0][0]);
    const top1 = gvs.t[0][1] + (i / 20) * (gvs.t[2][1] - gvs.t[0][1]);
    const top2 = gvs.t[1][1];
    p.stroke(gvs.colorLines);
    if(gvs.show_grid) {
      p.line(left1, top1, left2, top2);
    }
    p.noStroke();
    p.fill(gvs.colorC);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(15);
    if(i % 2 == 0) {
      p.text(`${Number(1 - i / 20).toFixed(1)}`, left2, top2 + 5);
    }

  }
  p.textAlign(p.LEFT, p.CENTER);
  p.textSize(18);
  p.text("C", gvs.t[1][0] + 5, gvs.t[1][1] + 5);
  p.pop();
}

function drawMoleFractionLines_standard(p) {
  // mole fraction A
  p.push();
  const dotX = gvs.dragCoords[0];
  const dotY = gvs.dragCoords[1];
  gvs.xA_x = gvs.t[1][0] - gvs.xA * (gvs.t[1][0] - gvs.t[2][0]);
  gvs.xA_y = gvs.dragCoords[1];
  p.strokeWeight(2);
  p.stroke(gvs.colorA);
  p.fill(gvs.colorA);
  p.line(dotX, dotY, gvs.xA_x, gvs.xA_y);
  p.triangle(gvs.xA_x - 1, gvs.xA_y, gvs.xA_x - 10, gvs.xA_y + 3, gvs.xA_x - 10, gvs.xA_y - 3);

  gvs.xB_x = gvs.t[0][0] + (1 - gvs.xB) * (gvs.t[2][0] - gvs.t[0][0]);
  gvs.xB_y = gvs.t[2][1] + gvs.xB * (gvs.t[0][1] - gvs.t[2][1]);
  p.stroke(gvs.colorB);
  p.fill(gvs.colorB);
  p.line(dotX, dotY, gvs.xB_x, gvs.xB_y);
  p.translate(gvs.xB_x, gvs.xB_y);
  p.rotate(Math.PI / 3);
  p.triangle(0, 0, 10, 3, 10, -3);
  p.rotate(-Math.PI / 3);
  p.translate(-gvs.xB_x, -gvs.xB_y);

  gvs.xC_x = gvs.t[0][0] + gvs.xC * (gvs.t[1][0] - gvs.t[0][0]);
  gvs.xC_y = gvs.t[0][1];
  p.stroke(gvs.colorC);
  p.fill(gvs.colorC);
  p.line(dotX, dotY, gvs.xC_x, gvs.xC_y);
  p.translate(gvs.xC_x, gvs.xC_y);
  p.rotate(-Math.PI / 3);
  p.triangle(0, 0, 10, 3, 10, -3);
  p.translate(-gvs.xC_x, -gvs.xC_y);
  p.pop();
}

function drawMoleFractionLines_alternate(p) {
  p.push();
  const dotX = gvs.dragCoords[0];
  const dotY = gvs.dragCoords[1];
  gvs.xA_x = dotX;
  gvs.xA_y = gvs.t[0][1];
  
  let px = (gvs.dragCoords[0] - gvs.t[0][0]) / (gvs.t[1][0] - gvs.t[0][0]);
  let py = (1 - (gvs.dragCoords[1] - gvs.t[2][1]) / (gvs.t[0][1] - gvs.t[2][1])) * Math.sqrt(3) / 2;

  // xA
  p.rectMode(p.CORNERS);
  p.textAlign(p.CENTER, p.CENTER);
  p.textSize(16);
  p.strokeWeight(2);
  p.stroke(gvs.colorA);
  p.fill(gvs.colorA);
  p.line(dotX, dotY, gvs.xA_x, gvs.xA_y);
  p.triangle(gvs.xA_x, gvs.xA_y, gvs.xA_x - 3, gvs.xA_y - 10, gvs.xA_x + 3, gvs.xA_y - 10);
  p.triangle(dotX, dotY + 5, dotX - 3, dotY + 15, dotX + 3, dotY + 15);
  if(gvs.xA > 0.15) {
    const label_xA_x = dotX;
    const label_xA_y = gvs.xA_y - (gvs.xA_y - dotY) / 2;
    p.fill(255);
    p.strokeWeight(1);
    p.rect(label_xA_x - 19, label_xA_y - 11, label_xA_x + 19, label_xA_y + 11);
    p.fill(gvs.colorA);
    p.noStroke();
    p.text(`${gvs.xA.toFixed(2)}`, label_xA_x, label_xA_y + 1);
  }

  // xB
  gvs.xB_x = gvs.t[0][0] + (1 - py / Math.sqrt(3) - ( 1 / 4 ) * ( 1 - py / Math.sqrt(3) - px )) * (gvs.t[1][0] - gvs.t[0][0]);
  gvs.xB_y = gvs.t[0][1] - (py + Math.sqrt(3) / 4 * (1 - py / Math.sqrt(3) - px)) * (gvs.t[1][0] - gvs.t[0][0]);
  p.strokeWeight(2);
  p.stroke(gvs.colorB);
  p.fill(gvs.colorB);
  p.line(dotX, dotY, gvs.xB_x, gvs.xB_y);
  p.translate(gvs.xB_x, gvs.xB_y);
  p.rotate(Math.PI / 3);
  p.triangle(0, 2, 3, 12, -3, 12);
  p.rotate(-Math.PI / 3);
  p.translate(-gvs.xB_x, -gvs.xB_y);
  p.translate(dotX, dotY);
  p.rotate(Math.PI / 3);
  p.triangle(0, -5, 3, -15, -3, -15);
  p.rotate(-Math.PI / 3);
  p.translate(-dotX, -dotY);
  if(gvs.xB > 0.15) {
    const label_xB_x = dotX + (gvs.xB_x - dotX) / 2;
    const label_xB_y = gvs.xB_y - (gvs.xB_y - dotY) / 2;
    p.fill(255);
    p.strokeWeight(1);
    p.rect(label_xB_x - 19, label_xB_y - 11, label_xB_x + 19, label_xB_y + 11);
    p.fill(gvs.colorB);
    p.noStroke();
    p.text(`${gvs.xB.toFixed(2)}`, label_xB_x, label_xB_y + 1);
  }

  // xC
  gvs.xC_x = gvs.t[0][0] + (py / Math.sqrt(3) + (1 / 4) * (px - py / Math.sqrt(3))) * (gvs.t[1][0] - gvs.t[0][0]);
  gvs.xC_y = gvs.t[0][1] - (py + Math.sqrt(3) / 4 * (px - py / Math.sqrt(3))) * (gvs.t[1][0] - gvs.t[0][0]);
  p.strokeWeight(2);
  p.stroke(gvs.colorC);
  p.fill(gvs.colorC);
  p.line(dotX, dotY, gvs.xC_x, gvs.xC_y);
  p.translate(gvs.xC_x, gvs.xC_y);
  p.rotate(-Math.PI / 3);
  p.triangle(0, 2, 3, 12, -3, 12);
  p.rotate(Math.PI / 3);
  p.translate(-gvs.xC_x, -gvs.xC_y);
  p.translate(dotX, dotY);
  p.rotate(-Math.PI / 3);
  p.triangle(0, -5, 3, -15, -3, -15);
  p.rotate(Math.PI / 3);
  p.translate(-dotX, -dotY);
  if(gvs.xC > 0.15) {
    const label_xC_x = dotX + (gvs.xC_x - dotX) / 2;
    const label_xC_y = gvs.xC_y - (gvs.xC_y - dotY) / 2;
    p.fill(255);
    p.strokeWeight(1);
    p.rect(label_xC_x - 19, label_xC_y - 11, label_xC_x + 19, label_xC_y + 11);
    p.fill(gvs.colorC);
    p.noStroke();
    p.text(`${gvs.xC.toFixed(2)}`, label_xC_x, label_xC_y + 1);
  }
  p.pop();
}

function drawMassFractionsLabel(p) {
  p.push();
  p.fill(255);
  p.stroke(0);
  p.rect(40, 60, 125, 105);
  p.textSize(18);
  p.fill(0);
  p.noStroke();
  p.text("mass fractions", 46, 50);
  // xA
  p.fill(gvs.colorA);
  p.text(`x  = ${gvs.xA.toFixed(2)}`, 65, 86);
  p.textSize(11);
  p.text("A", 74, 92);
  // xB
  p.fill(gvs.colorB);
  p.textSize(18);
  p.text(`x  = ${gvs.xB.toFixed(2)}`, 65, 116);
  p.textSize(11);
  p.text("B", 74, 122);
  // xC
  p.fill(gvs.colorC);
  p.textSize(18);
  p.text(`x  = ${gvs.xC.toFixed(2)}`, 65, 146);
  p.textSize(11);
  p.text("C", 74, 152);
  p.pop();
}

function drawFloatingLabels_standard(p) {
  p.push();
  // xA
  p.fill(255);
  p.stroke(gvs.colorA);
  p.strokeWeight(1);
  p.rect(gvs.xA_x + 9, gvs.xA_y + 12, 39, -25);
  p.noStroke();
  p.fill(gvs.colorA);
  p.textSize(15);
  p.text(`${gvs.xA.toFixed(2)}`, gvs.xA_x + 14, gvs.xA_y + 5);
  // xB
  p.fill(255);
  p.stroke(gvs.colorB);
  p.strokeWeight(1);
  p.rect(gvs.xB_x - 45, gvs.xB_y - 2, 39, -25);
  p.noStroke();
  p.fill(gvs.colorB);
  p.textSize(15);
  p.text(`${gvs.xB.toFixed(2)}`, gvs.xB_x - 40, gvs.xB_y - 9);
  // xC
  p.fill(255);
  p.stroke(gvs.colorC);
  p.strokeWeight(1);
  p.rect(gvs.xC_x - 23, gvs.xC_y + 30, 39, -25);
  p.noStroke();
  p.fill(gvs.colorC);
  p.textSize(15);
  p.text(`${gvs.xC.toFixed(2)}`, gvs.xC_x - 18, gvs.xC_y + 23);
      
  p.pop();
}

function drawFloatingLabels_alternate(p) {
  p.push();

  p.pop();
}

function drawAll(p) {
  drawTriangle(p);
  drawComponentA(p);
  drawComponentB(p);
  drawComponentC(p);
  if(gvs.view == "standard") {
    drawMoleFractionLines_standard(p);
    drawFloatingLabels_standard(p);
  } else {
    drawMoleFractionLines_alternate(p);
    drawFloatingLabels_alternate(p);
  }
  drawMassFractionsLabel(p);
}

module.exports = drawAll;