function drawUnitOps(p) {
  p.push();
  // Reactor
  p.noFill();
  p.stroke(0);
  p.strokeWeight(1);
  p.rectMode(p.CORNER);
  p.rect(210, p.height / 2 - 100, 140, 80, 5);
  // Separator
  p.rect(480, p.height / 2 - 100, 140, 80, 5);

  p.fill(0);
  p.noStroke();
  // Reactor
  p.textAlign(p.CENTER);
  p.textSize(18);
  p.text(`reactor`, 280, p.height / 2 - 70);
  p.text(`X = ${gvs.X.toFixed(2)}`, 280, p.height / 2 - 40);

  // Separator
  p.text(`separator`, 550, p.height / 2 - 60);
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

function drawArrows(p) {
  // arrow(p, 10, 10, 50, 30);
}

function drawText(p) {
  p.push();
  p.textSize(16);
  p.pop();
}

function drawAll(p) {
  drawUnitOps(p);
  drawArrows(p);
  drawText(p);
}

module.exports = drawAll;