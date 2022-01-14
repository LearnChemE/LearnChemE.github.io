const coolant_color = gvs.p.color(240, 240, 255);
const liquid_color = gvs.p.color(200, 200, 255);
const top_of_liquid_color = gvs.p.color(170, 170, 255);

function translate_to_column(p) {
  p.translate(p.width / 4, p.height / 2);
}

function drawColumn(p) {
  p.push();
    translate_to_column(p);
    p.noFill();
    p.stroke(0);
    p.strokeWeight(1);
    p.rectMode(p.CENTER);
    // Draw the tank at the bottom of the column
    p.rect(0, 100, 100, 100, 25, 25, 20, 20);
    // Draw the rounded rectangle at the top of the column
    p.rect(0, -135, 40, 40, 5);
    // Draw the outline of the "column" part of the rig
    p.line(16, 50, 16, -115);
    p.line(-16, 50, -16, -115);
    p.noStroke();
    // Draw the "column" part of the rig
    p.fill(255, 255, 255);
    p.rect(0, -35, 30, 180);
    // Draw the stem on the condenser and the condenser itself
    p.translate(83, -68);
    p.rotate(-Math.PI / 4);
    p.fill(coolant_color);
    // The condenser itself (blue)
    p.rect(0, 0, 35, 140);
    p.rect(25, -60, 15, 10);
    p.rect(-25, 60, 15, 10);
    p.fill(255, 255, 255);
    // The stem coming out the top of the rig
    p.rect(0, 0, 15, 200);
    p.stroke(0);
    p.strokeWeight(1);
    // Draw the lines around the condenser
    p.line(-32.5, 65, -17.5, 65);
    p.line(-17.5, 65, -17.5, 70);
    p.line(-17.5, 70, -10, 70);
    p.line(17.5, 70, 10, 70);
    p.line(17.5, 70, 17.5, -55);
    p.line(17.5, -55, 32.5, -55);
    p.line(17.5, -65, 32.5, -65);
    p.line(17.5, -65, 17.5, -70);
    p.line(17.5, -70, 10, -70);
    p.line(-10, -70, -17.5, -70);
    p.line(-17.5, -70, -17.5, 55);
    p.line(-17.5, 55, -32.5, 55);
    p.line(7.5, -96, 7.5, 100);
    p.line(-7.5, -80, -7.5, 102);
    p.translate(7.5, 100);
    p.rotate(Math.PI / 4);
    p.line(0, 0, 0, 12);
    p.noStroke();
    p.noFill();
    p.beginShape();
    p.vertex(0, 0);
    p.vertex(0, 15);
    p.vertex(-10, 10);
    p.endShape();
  p.pop();
}

function drawStillLiquid(p, lvl) {
  p.push();
  p.fill(liquid_color);
  p.noStroke();
  translate_to_column(p);
  p.rectMode(p.CORNER);
  p.rect(-49, 149, 98, Math.min(-40, -80 + 80 * (1 - lvl)), 18, 18, 0, 0);
  p.fill(255, 255, 255);
  p.rect(-49, 50, 98, (1 - lvl) * 80 + 20);
  if(lvl > 0.2) {
    p.stroke(0);
    p.strokeWeight(1);
    p.fill(top_of_liquid_color);
    p.ellipse(0, 70 + 80 * (1 - lvl), 98, 5);
  } else {
    p.stroke(0);
    p.strokeWeight(1);
    p.fill(top_of_liquid_color);
    p.ellipse(0, 70 + 80 * (1 - lvl), 98 - 23 * (0.2 - lvl) / 0.2, 5 - 4 * (0.2 - lvl) / 0.2);
  }
  p.pop();
}

let i = 1;

function drawAll(p) {
  drawStillLiquid(p, gvs.B);
  drawColumn(p);
  // If "flasks" is selected, draw every flask, otherwise just draw the last one under the collection spout
  if(gvs.display = "flasks") {
    for(let i = 0; i < gvs.flasks.length; i++) {
      const flask = gvs.flasks[i];
      flask.draw();
    }
  } else {
    gvs.flasks[gvs.flasks.length - 1].draw();
  }
}

module.exports = drawAll;