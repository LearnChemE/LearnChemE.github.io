function drawUnitOps(p) {
  p.push();
  // Reactor
  p.noFill();
  p.stroke(0);
  p.strokeWeight(2);
  p.rectMode(p.CORNER);
  p.rect(265, 165, 110, 80, 5);
  // Separator
  p.rect(500, 165, 120, 80, 5);

  p.fill(0);
  p.noStroke();
  // Reactor
  p.textAlign(p.CENTER);
  p.textSize(18);
  p.text(`reactor`, 320, 195);
  p.text(`X = ${gvs.X.toFixed(2)}`, 320, 225);

  // Separator
  p.text(`separator`, 560, 205);
  p.pop();
}

function arrow(p, x1, y1, x2, y2) {
  p.push();
  p.strokeWeight(2);
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
  arrow(p, 20, 205, 263, 205); // inlet
  p.push();
  p.fill(255);
  p.strokeWeight(2);
  p.circle(130, 205, 15);
  p.pop();
  arrow(p, 375, 205, 498, 205); // after reactor
  arrow(p, 620, 205, 750, 205); // right of separator
  arrow(p, 560, 245, 560, 450); // bottom of separator
  p.strokeWeight(2);
  p.line(560, 380, 130, 380);
  p.push();
  p.fill(255);
  p.strokeWeight(2);
  p.circle(560, 380, 15);
  p.pop();
  arrow(p, 130, 380, 130, 216);
}

function drawText(p) {
  p.push();
  p.textSize(18);
  p.text("All flow rates are in mol/s", p.width / 2 - 120, 50)
  p.textSize(16);
  p.pop();
}

function drawAll(p) {
  drawUnitOps(p);
  drawIcons(p);
  drawText(p);
}

module.exports = drawAll;