function drawPistons(p) {
  p.push();
  p.translate(230, 450);
  p.beginShape();
  p.vertex(-100, 0);
  p.vertex(100, 0);
  p.vertex(100, -250);
  p.vertex(130, -250);
  p.vertex(130, 30);
  p.vertex(-130, 30);
  p.vertex(-130, -250);
  p.vertex(-100, -250);
  p.endShape(p.CLOSE);

  p.fill(120);
  p.rect(-100, -200, 200, -15);
  p.fill(240, 240, 200);
  p.rect(-100, -200, 200, 200);

  p.fill(255);
  p.translate(350, 0);
  p.beginShape();
  p.vertex(-100, 0);
  p.vertex(100, 0);
  p.vertex(100, -250);
  p.vertex(130, -250);
  p.vertex(130, 30);
  p.vertex(-130, 30);
  p.vertex(-130, -250);
  p.vertex(-100, -250);
  p.endShape(p.CLOSE);

  p.fill(120);
  p.rect(-100, -200, 200, -15);
  p.fill(240, 240, 200);
  p.rect(-100, -200, 200, 200);
  p.pop();
}

function drawLabels(p) {
  p.push();
  p.translate(230, 100);
  p.rectMode(p.CENTER);
  p.rect(0, 0, 250, 150);
  p.noStroke();
  p.fill(0);
  p.textSize(18);
  p.text("reversible adiabatic", -75, -45);
  p.text(`W = 0.0 kJ/mol`, -60, -10);
  p.text(`T = 300 K`, -40, 20);
  p.text(`V = V`, -30, 50);
  p.textSize(12);
  p.text("initial", 15, 55);

  p.translate(350, 0);
  p.fill(255);
  p.stroke(0);
  p.rect(0, 0, 250, 150);
  p.noStroke();
  p.fill(0);
  p.textSize(18);
  p.text("reversible adiabatic", -75, -45);
  p.text(`W = 0.0 kJ/mol`, -60, -10);
  p.text(`T = 300 K`, -40, 20);
  p.text(`V = V`, -30, 50);
  p.textSize(12);
  p.text("initial", 15, 55);

  p.pop();
}

function drawAll(p) {
  drawPistons(p);
  drawLabels(p);
}

module.exports = drawAll;