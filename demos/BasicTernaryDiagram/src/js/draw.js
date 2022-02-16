function drawTriangle(p) {
  p.push();
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
    p.line(left1, top, left2, top);
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
    p.line(left1, top1, left2, top2);
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
    p.line(left1, top1, left2, top2);
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

function drawMoleFractionLines(p) {
  // mole fraction A
  p.push();
  const dotX = gvs.dragCoords[0];
  const dotY = gvs.dragCoords[1];
  const xA_x = gvs.t[1][0] - gvs.xA * (gvs.t[1][0] - gvs.t[2][0]);
  const xA_y = gvs.dragCoords[1];
  p.strokeWeight(2);
  p.stroke(gvs.colorA);
  p.fill(gvs.colorA);
  p.line(dotX, dotY, xA_x, xA_y);
  p.triangle(xA_x - 1, xA_y, xA_x - 10, xA_y + 3, xA_x - 10, xA_y - 3);

  const xB_x = gvs.t[0][0] + (1 - gvs.xB) * (gvs.t[2][0] - gvs.t[0][0]);
  const xB_y = gvs.t[2][1] + gvs.xB * (gvs.t[0][1] - gvs.t[2][1]);
  p.stroke(gvs.colorB);
  p.fill(gvs.colorB);
  p.line(dotX, dotY, xB_x, xB_y);
  p.translate(xB_x, xB_y);
  p.rotate(Math.PI / 3);
  p.triangle(0, 0, 10, 3, 10, -3);
  p.rotate(-Math.PI / 3);
  p.translate(-xB_x, -xB_y);

  const xC_x = gvs.t[0][0] + gvs.xC * (gvs.t[1][0] - gvs.t[0][0]);
  const xC_y = gvs.t[0][1];
  p.stroke(gvs.colorC);
  p.fill(gvs.colorC);
  p.line(dotX, dotY, xC_x, xC_y);
  p.translate(xC_x, xC_y);
  p.rotate(-Math.PI / 3);
  p.triangle(0, 0, 10, 3, 10, -3);
  p.translate(-xC_x, -xC_y);
  p.pop();
}

function drawMassFractions(p) {
  p.push();

  p.pop();
}

function drawAll(p) {
  drawComponentA(p);
  drawComponentB(p);
  drawComponentC(p);
  drawTriangle(p);
  drawMoleFractionLines(p);
  drawMassFractions(p);
}

module.exports = drawAll;