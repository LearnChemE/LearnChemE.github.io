const width = gvs.p.width;
const height = gvs.p.height;
const tank_diameter = 200;

function drawTank(p) {
  p.push();
  p.translate(width / 2, height / 2);
  p.fill(50);
  p.stroke(0);
  p.rectMode(p.CENTER);
  p.rect(-270, 80, 25, 80);
  p.rect(-170, 80, 25, 80);
  p.fill(120);
  p.rect(-280, 100, 25, 90);
  p.rect(-160, 100, 25, 90);
  p.stroke(50);
  p.rect(-220, -100, 10, 30);
  p.fill(255);
  p.strokeWeight(2);
  p.ellipse(-220, -137.5, 70, 45);
  p.fill(0);
  p.noStroke();
  p.textAlign(p.CENTER, p.CENTER);
  p.textSize(14);
  p.text(`${gvs.P.toFixed(2)} bar`, -220, -137);
  p.pop();
}

function drawLiquid(p) {
  p.push();
  p.translate(width / 2, height / 2);
  p.noStroke();
  p.fill(gvs.liquid_color);
  p.ellipse(-220, 0, tank_diameter, tank_diameter);
  p.fill(gvs.background_color);
  const rect_height = (1 - gvs.liquid_level) * tank_diameter;
  p.rect(-320, -100, tank_diameter, rect_height);
  p.fill(gvs.liquid_color[0], gvs.liquid_color[1], gvs.liquid_color[2], gvs.vapor_density * 127);
  p.ellipse(-220, 0, tank_diameter, tank_diameter);
  const triangle_height_top = 200 - 400 * Math.abs(0.5 - gvs.liquid_level);
  const triangle_height_bottom = 200 - triangle_height_top;
  const radius = tank_diameter * 0.5;
  let angle = Math.asin(triangle_height_bottom / (radius * 2));
  if(Number.isNaN(angle)) {angle = 0.01}
  const ellipse_width = Math.sin(Math.PI / 2 - angle) * 2 * radius - 3;
  const ellipse_y = -100 + (1 - gvs.liquid_level) * tank_diameter;
  const ellipse_height = 30 - 50 * Math.abs(gvs.liquid_level - 0.5);
  p.stroke(50);
  p.fill(gvs.liquid_color[0] - 30, gvs.liquid_color[1] - 30, gvs.liquid_color[2] - 30);
  if(ellipse_height > 6) {
    p.ellipse(-220, ellipse_y, ellipse_width, ellipse_height);
  }
  p.stroke(100);
  p.noFill();
  p.ellipse(-220, 0, tank_diameter, tank_diameter)
  p.pop();
}

function drawSyringe(p) {
  p.push();
  p.translate(width / 2, height / 2);
  p.rectMode(p.CORNER);
  p.noStroke();
  p.fill(gvs.liquid_color);
  p.rect(-80, -12.5, 5 + (1 - gvs.syringe_fraction) * 92, 25);
  p.stroke(0);
  p.fill(150);
  p.rect(-120, -1, 40, 2);
  p.fill(150);
  p.rect(15 - 90 * gvs.syringe_fraction, -3, 105, 6);
  p.rectMode(p.CENTER);
  p.fill(120);
  p.rect(15 - 90 * gvs.syringe_fraction, 0, 4, 23);
  p.rectMode(p.CORNER);
  p.fill(180);
  p.rect(120 - 90 * gvs.syringe_fraction, -13, 3, 26);
  setGradient(p, -80, -12.5, 100, 25, p.color(240, 240, 240, 127), p.color(215, 215, 215, 127), 1);
  p.noFill();
  p.rectMode(p.CORNER);
  p.stroke(100);
  p.rect(-80, -12.5, 100, 25, 2, 2);
  p.pop();
}

function setGradient(p, x, y, w, h, c1, c2, axis) {
  p.noFill();

  if (axis === 1) {
    // Top to bottom gradient
    for (let i = y; i <= y + h; i++) {
      let inter = p.map(i, y, y + h, 0, 1);
      let c = p.lerpColor(c1, c2, inter);
      p.stroke(c);
      p.line(x, i, x + w, i);
    }
  } else if (axis === 2) {
    // Left to right gradient
    for (let i = x; i <= x + w; i++) {
      let inter = p.map(i, x, x + w, 0, 1);
      let c = p.lerpColor(c1, c2, inter);
      p.stroke(c);
      p.line(i, y, i, y + h);
    }
  }
}

function drawAll(p) {
  drawTank(p);
  drawLiquid(p);
  drawSyringe(p);
}

module.exports = drawAll;