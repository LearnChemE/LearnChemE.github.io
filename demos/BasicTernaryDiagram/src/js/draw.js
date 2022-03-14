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
  let triangle_width = gvs.xB < 0.02 ? 1 : gvs.xB < 0.07 ? 2 : 3;
  let triangle_height = gvs.xB < 0.02 ? 2 : gvs.xB < 0.07 ? 6 : 10;
  p.triangle(gvs.xA_x - 1, gvs.xA_y, gvs.xA_x - triangle_height, gvs.xA_y + triangle_width, gvs.xA_x - triangle_height, gvs.xA_y - triangle_width);

  gvs.xB_x = gvs.t[0][0] + (1 - gvs.xB) * (gvs.t[2][0] - gvs.t[0][0]);
  gvs.xB_y = gvs.t[2][1] + gvs.xB * (gvs.t[0][1] - gvs.t[2][1]);
  p.stroke(gvs.colorB);
  p.fill(gvs.colorB);
  p.line(dotX, dotY, gvs.xB_x, gvs.xB_y);
  p.translate(gvs.xB_x, gvs.xB_y);
  p.rotate(Math.PI / 3);
  triangle_width = gvs.xC < 0.02 ? 1 : gvs.xC < 0.07 ? 2 : 3;
  triangle_height = gvs.xC < 0.02 ? 2 : gvs.xC < 0.07 ? 6 : 10;
  p.triangle(0, 0, triangle_height, triangle_width, triangle_height, -triangle_width);
  p.rotate(-Math.PI / 3);
  p.translate(-gvs.xB_x, -gvs.xB_y);

  gvs.xC_x = gvs.t[0][0] + gvs.xC * (gvs.t[1][0] - gvs.t[0][0]);
  gvs.xC_y = gvs.t[0][1];
  p.stroke(gvs.colorC);
  p.fill(gvs.colorC);
  p.line(dotX, dotY, gvs.xC_x, gvs.xC_y);
  p.translate(gvs.xC_x, gvs.xC_y);
  p.rotate(-Math.PI / 3);
  triangle_width = gvs.xA < 0.02 ? 1 : gvs.xA < 0.07 ? 2 : 3;
  triangle_height = gvs.xA < 0.02 ? 2 : gvs.xA < 0.07 ? 6 : 10;
  p.triangle(0, 0, triangle_height, triangle_width, triangle_height, -triangle_width);
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
  let triangle_width = gvs.xA < 0.05 ? 0.5 : gvs.xA < 0.18 ? 2 : 3;
  let triangle_height = gvs.xA < 0.05 ? 2 : gvs.xA < 0.18 ? 6 : 10;
  p.triangle(gvs.xA_x, gvs.xA_y, gvs.xA_x - triangle_width, gvs.xA_y - triangle_height, gvs.xA_x + triangle_width, gvs.xA_y - triangle_height);
  p.triangle(dotX, dotY + 5, dotX - triangle_width, dotY + 5 + triangle_height, dotX + triangle_width, dotY + 5 + triangle_height);
  if(gvs.xA > 0.18) {
    const label_xA_x = dotX;
    const label_xA_y = gvs.xA_y - (gvs.xA_y - dotY) / 2;
    p.fill(255);
    p.strokeWeight(1);
    p.rect(label_xA_x - 19, label_xA_y - 11, label_xA_x + 19, label_xA_y + 11);
    p.fill(gvs.colorA);
    p.noStroke();
    p.text(`${Math.abs(gvs.xA).toFixed(2)}`, label_xA_x, label_xA_y + 1);
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
  triangle_width = gvs.xB < 0.05 ? 0.5 : gvs.xB < 0.18 ? 2 : 3;
  triangle_height = gvs.xB < 0.05 ? 2 : gvs.xB < 0.18 ? 6 : 10;
  p.triangle(0, 2, triangle_width, 2 + triangle_height, -1 * triangle_width, 2 + triangle_height);
  p.rotate(-Math.PI / 3);
  p.translate(-gvs.xB_x, -gvs.xB_y);
  p.translate(dotX, dotY);
  p.rotate(Math.PI / 3);
  p.triangle(0, -5, triangle_width, -5 - triangle_height, -triangle_width, -5 - triangle_height);
  p.rotate(-Math.PI / 3);
  p.translate(-dotX, -dotY);
  if(gvs.xB > 0.18) {
    const label_xB_x = dotX + (gvs.xB_x - dotX) / 2;
    const label_xB_y = gvs.xB_y - (gvs.xB_y - dotY) / 2;
    p.fill(255);
    p.strokeWeight(1);
    p.rect(label_xB_x - 19, label_xB_y - 11, label_xB_x + 19, label_xB_y + 11);
    p.fill(gvs.colorB);
    p.noStroke();
    p.text(`${Math.abs(gvs.xB).toFixed(2)}`, label_xB_x, label_xB_y + 1);
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
  triangle_width = gvs.xC < 0.05 ? 0.5 : gvs.xC < 0.18 ? 2 : 3;
  triangle_height = gvs.xC < 0.05 ? 2 : gvs.xC < 0.18 ? 6 : 10;
  p.triangle(0, 2, triangle_width, 2 + triangle_height, -triangle_width, 2 + triangle_height);
  p.rotate(Math.PI / 3);
  p.translate(-gvs.xC_x, -gvs.xC_y);
  p.translate(dotX, dotY);
  p.rotate(-Math.PI / 3);
  p.triangle(0, -5, triangle_width, -5 - triangle_height, -triangle_width, -5 - triangle_height);
  p.rotate(Math.PI / 3);
  p.translate(-dotX, -dotY);
  if(gvs.xC > 0.18) {
    const label_xC_x = dotX + (gvs.xC_x - dotX) / 2;
    const label_xC_y = gvs.xC_y - (gvs.xC_y - dotY) / 2;
    p.fill(255);
    p.strokeWeight(1);
    p.rect(label_xC_x - 19, label_xC_y - 11, label_xC_x + 19, label_xC_y + 11);
    p.fill(gvs.colorC);
    p.noStroke();
    const xC = (1 - Number(gvs.xA.toFixed(2)) - Number(gvs.xB.toFixed(2))).toFixed(2);
    p.text(`${Math.abs(xC).toFixed(2)}`, label_xC_x, label_xC_y + 1);
  }
  p.pop();
}

function drawMassFractionsLabel(p) {
  p.push();
  p.fill(255);
  p.stroke(0);
  p.translate(10, 0);
  p.rect(30, 50, 125, 105);
  p.textSize(18);
  p.fill(0);
  p.noStroke();
  p.text("mass fractions", 36, 40);
  // xA
  p.fill(gvs.colorA);
  p.text(`x  = ${Math.abs(gvs.xA).toFixed(2)}`, 55, 76);
  p.textSize(11);
  p.text("A", 64, 82);
  // xB
  p.fill(gvs.colorB);
  p.textSize(18);
  p.text(`x  = ${Math.abs(gvs.xB).toFixed(2)}`, 55, 106);
  p.textSize(11);
  p.text("B", 64, 112);
  // xC
  p.fill(gvs.colorC);
  p.textSize(18);
  const xC = (1 - Number(gvs.xA.toFixed(2)) - Number(gvs.xB.toFixed(2))).toFixed(2);
  p.text(`x  = ${Math.abs(xC).toFixed(2)}`, 55, 136);
  p.textSize(11);
  p.text("C", 64, 142);
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
  p.text(`${Math.abs(gvs.xA).toFixed(2)}`, gvs.xA_x + 14, gvs.xA_y + 5);
  // xB
  p.fill(255);
  p.stroke(gvs.colorB);
  p.strokeWeight(1);
  p.rect(gvs.xB_x - 45, gvs.xB_y - 2, 39, -25);
  p.noStroke();
  p.fill(gvs.colorB);
  p.textSize(15);
  p.text(`${Math.abs(gvs.xB).toFixed(2)}`, gvs.xB_x - 40, gvs.xB_y - 9);
  // xC
  p.fill(255);
  p.stroke(gvs.colorC);
  p.strokeWeight(1);
  p.rect(gvs.xC_x - 23, gvs.xC_y + 30, 39, -25);
  p.noStroke();
  p.fill(gvs.colorC);
  p.textSize(15);
  const xC = (1 - Number(gvs.xA.toFixed(2)) - Number(gvs.xB.toFixed(2))).toFixed(2);
  p.text(`${Math.abs(xC).toFixed(2)}`, gvs.xC_x - 18, gvs.xC_y + 23);
      
  p.pop();
}

function drawPlotLabel(p) {
  p.push();
  p.translate(2.7 * p.width / 5 - 10, 35);
  p.textAlign(p.LEFT, p.CENTER);
  p.textSize(15);
  p.fill(0);
  p.noStroke();
  p.text("Drag the black dot with your mouse, or try quizzing yourself with this procedure:", 10, 0, 290);
  p.text(`1.)  check "hide mass fractions"`, 20, 45);
  p.text(`2.)  click the "random composition" button`, 20, 69);
  p.text(`3.)  determine the correct mass fractions`, 20, 93);
  p.text(`4.)  check your answer by unchecking`, 20, 116.5);
  p.text(` "hide mass fractions", or re-enable`, 44, 138);
  p.text(` arrows with the drop-down menu.`, 46.5, 159);
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
  } else if(gvs.view == "alternate") {
    drawMoleFractionLines_alternate(p);
  }
  if(!gvs.hide_mass_fractions) {
    drawMassFractionsLabel(p);
  }
  drawPlotLabel(p);
}

module.exports = drawAll;