function drawUnitOps(p) {
  p.push();
  // Reactor
  p.noFill();
  p.stroke(0);
  p.strokeWeight(1);
  p.rectMode(p.CORNER);
  p.rect(220, 165, 140, 80, 5);
  // Separator
  p.rect(480, 165, 140, 80, 5);

  p.fill(0);
  p.noStroke();
  // Reactor
  p.textAlign(p.CENTER);
  p.textSize(18);
  p.text(`reactor`, 290, 195);
  p.text(`X = ${gvs.X.toFixed(2)}`, 290, 225);

  // Separator
  p.text(`separator`, 550, 205);
  p.pop();
}

function arrow(p, x1, y1, x2, y2) {
  p.push();
  p.translate(x1, y1);
  const angle = p.atan2((y2 - y1), (x2 - x1));
  p.rotate(angle);
  const distance = Math.sqrt((x2 - x1)**2 + (y2 - y1)**2);
  p.line(0, 0, distance, 0);
  p.fill(0);
  p.triangle(distance, 0, distance - 10, 4, distance - 10, -4);
  p.pop();
}

function drawIcons(p) {
  arrow(p, 30, 205, 218, 205); // inlet
  p.push();
  p.fill(255);
  p.strokeWeight(1);
  p.circle(120, 205, 15);
  p.pop();
  arrow(p, 360, 205, 478, 205); // after reactor
  arrow(p, 620, 205, 750, 205); // right of separator
  arrow(p, 550, 245, 550, 450); // bottom of separator
  p.line(550, 380, 120, 380);
  p.push();
  p.fill(255);
  p.strokeWeight(1);
  p.circle(550, 380, 15);
  p.pop();
  arrow(p, 120, 380, 120, 216);
}

function drawText(p) {
  p.push();
  p.textSize(16);
  p.pop();
}

function drawAll(p) {
  drawUnitOps(p);
  drawIcons(p);
  drawText(p);
}

module.exports = drawAll;