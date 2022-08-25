

function drawTube(p) {
  p.push();

  p.translate(30, g.p.height / 1.5);
  const outer_dia = g.venturi_outer;
  const inner_dia = g.venturi_inner;
  const delta_dia = g.venturi_outer - g.venturi_inner;
  p.fill("cyan");
  
  p.stroke("blue");
  p.rect(100, 0, 20, -0.5 * outer_dia - g.manometer_1_height);
  p.rect(240, 0, 20, -0.5 * outer_dia - g.manometer_2_height);
  p.rect(335, 0, 20, -0.5 * outer_dia - g.manometer_3_height);
  p.rect(440, 0, 20, -0.5 * outer_dia - g.manometer_4_height);
  p.rect(585, 0, 20, -0.5 * outer_dia - g.manometer_5_height);

  p.noStroke();
  p.beginShape();
  p.vertex(0, -0.5 * outer_dia);
  p.vertex(200, -0.5 * outer_dia);
  p.vertex(300, -0.5 * inner_dia);
  p.vertex(400, -0.5 * inner_dia);
  p.vertex(500, -0.5 * outer_dia);
  p.vertex(700, -0.5 * outer_dia);
  p.vertex(700, 0.5 * outer_dia);
  p.vertex(500, 0.5 * outer_dia);
  p.vertex(400, 0.5 * inner_dia);
  p.vertex(300, 0.5 * inner_dia);
  p.vertex(200, 0.5 * outer_dia);
  p.vertex(0, 0.5 * outer_dia);
  p.endShape();

  p.stroke(0);
  p.strokeWeight(1);
  p.noFill();
  // Top Line
  p.line(0, -0.5 * outer_dia, 100, -0.5 * outer_dia);
  p.line(120, -0.5 * outer_dia, 200, -0.5 * outer_dia);
  p.line(200, -0.5 * outer_dia, 240, -0.5 * outer_dia + 0.5 * delta_dia * (40 / 100));
  p.line(260, -0.5 * outer_dia + 0.5 * delta_dia * (60 / 100), 300, -0.5 * inner_dia);
  p.line(300, -0.5 * inner_dia, 335, -0.5 * inner_dia);
  p.line(355, -0.5 * inner_dia, 400, -0.5 * inner_dia);
  p.line(400, -0.5 * inner_dia, 440, -0.5 * outer_dia + 0.5 * delta_dia * (60 / 100));
  p.line(460, -0.5 * outer_dia + 0.5 * delta_dia * (40 / 100), 500, -0.5 * outer_dia);
  p.line(500, -0.5 * outer_dia, 585, -0.5 * outer_dia);
  p.line(605, -0.5 * outer_dia, 700, -0.5 * outer_dia);

  // Bottom line
  p.line(0, 0.5 * outer_dia, 200, 0.5 * outer_dia);
  p.line(200, 0.5 * outer_dia, 300, 0.5 * inner_dia);
  p.line(300, 0.5 * inner_dia, 400, 0.5 * inner_dia);
  p.line(400, 0.5 * inner_dia, 500, 0.5 * outer_dia);
  p.line(500, 0.5 * outer_dia, 700, 0.5 * outer_dia);

  // Manometers
  p.line(100, -0.5 * outer_dia, 100, -0.5 * outer_dia - 200);
  p.line(120, -0.5 * outer_dia, 120, -0.5 * outer_dia - 200);
  p.line(240, -0.5 * outer_dia + 0.5 * delta_dia * (40 / 100), 240, -0.5 * outer_dia - 200);
  p.line(260, -0.5 * outer_dia + 0.5 * delta_dia * (60 / 100), 260, -0.5 * outer_dia - 200);
  p.line(335, -0.5 * inner_dia, 335, -0.5 * outer_dia - 200);
  p.line(355, -0.5 * inner_dia, 355, -0.5 * outer_dia - 200);
  p.line(440, -0.5 * outer_dia + 0.5 * delta_dia * (60 / 100), 440, -0.5 * outer_dia - 200);
  p.line(460, -0.5 * outer_dia + 0.5 * delta_dia * (40 / 100), 460, -0.5 * outer_dia - 200);
  p.line(585, -0.5 * outer_dia, 585, -0.5 * outer_dia - 200);
  p.line(605, -0.5 * outer_dia, 605, -0.5 * outer_dia - 200);

  p.noStroke();
  p.fill(0);
  p.textAlign(p.CENTER, p.CENTER);
  p.textSize(18);
  p.text(`${g.manometer_1_height.toFixed(0)} mmH₂O`, 110, -280);
  p.text(`${g.manometer_2_height.toFixed(0)}`, 250, -280);
  p.text(`${g.manometer_3_height.toFixed(0)}`, 345, -280);
  p.text(`${g.manometer_4_height.toFixed(0)}`, 450, -280);
  p.text(`${g.manometer_5_height.toFixed(0)}`, 595, -280);

  p.pop();
}

function drawAll(p) {
  drawTube(p);
}

module.exports = drawAll;