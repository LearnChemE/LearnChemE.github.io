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
  // p.text(`X = ${gvs.X.toFixed(2)}`, 320, 225);

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
  arrow(p, 120, 205, 263, 205); // inlet
  arrow(p, 20, 205, 120, 205); // inlet
  p.push();
  p.fill(255);
  p.strokeWeight(2);
  p.circle(130, 205, 15);
  p.pop();
  arrow(p, 375, 205, 498, 205); // after reactor
  arrow(p, 620, 205, 750, 205); // right of separator
  arrow(p, 560, 245, 560, 450); // bottom of separator
  arrow(p, 560, 245, 560, 370); // bottom of separator
  p.strokeWeight(2);
  arrow(p, 560, 380, 130, 380);
  arrow(p, 560, 380, 350, 380);
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
  p.text("All flow rates are in mol/s", 50, 50);
  p.text(`Fraction of feed lost to purge stream: ${(gvs.fraction_lost * 100).toFixed(1)}%`, 400, 40);
  p.text(`Ratio of recycled CH  to feed CH  : ${(gvs.fraction_CH4).toFixed(1)}`, 400, 75);
  p.textSize(13);
  p.text(`4`, 565, 80);
  p.text(`4`, 662, 80);
  p.pop();
}

function updateLabels() {
  document.getElementById("FH2-1").innerHTML = `${gvs.F_H2_1.toFixed(1)}`;
  document.getElementById("FN2-1").innerHTML = `${gvs.F_N2_1.toFixed(1)}`;
  document.getElementById("FCH4-1").innerHTML = `${gvs.F_CH4_1.toFixed(1)}`;

  document.getElementById("FH2-2").innerHTML = `${gvs.F_H2_2.toFixed(1)}`;
  document.getElementById("FN2-2").innerHTML = `${gvs.F_N2_2.toFixed(1)}`;
  document.getElementById("FCH4-2").innerHTML = `${gvs.F_CH4_2.toFixed(1)}`;

  document.getElementById("FH2-3").innerHTML = `${gvs.F_H2_3.toFixed(1)}`;
  document.getElementById("FN2-3").innerHTML = `${gvs.F_N2_3.toFixed(1)}`;
  document.getElementById("FCH4-3").innerHTML = `${gvs.F_CH4_3.toFixed(1)}`;
  document.getElementById("FNH3-3").innerHTML = `${gvs.F_NH3_3.toFixed(1)}`;

  document.getElementById("FNH3-4").innerHTML = `${gvs.F_NH3_4.toFixed(1)}`;

  document.getElementById("FH2-5").innerHTML = `${gvs.F_H2_5.toFixed(1)}`;
  document.getElementById("FN2-5").innerHTML = `${gvs.F_N2_5.toFixed(1)}`;
  document.getElementById("FCH4-5").innerHTML = `${gvs.F_CH4_5.toFixed(1)}`;

  document.getElementById("FH2-6").innerHTML = `${gvs.F_H2_6.toFixed(1)}`;
  document.getElementById("FN2-6").innerHTML = `${gvs.F_N2_6.toFixed(1)}`;
  document.getElementById("FCH4-6").innerHTML = `${gvs.F_CH4_6.toFixed(1)}`;

  document.getElementById("FH2-7").innerHTML = `${gvs.F_H2_7.toFixed(1)}`;
  document.getElementById("FN2-7").innerHTML = `${gvs.F_N2_7.toFixed(1)}`;
  document.getElementById("FCH4-7").innerHTML = `${gvs.F_CH4_7.toFixed(1)}`;

}

function drawAll(p) {
  drawUnitOps(p);
  drawIcons(p);
  drawText(p);
  updateLabels();
}

module.exports = drawAll;