const tank_diameter = 200;

function drawTank() {
  push();
  translate(width / 2, height / 2.5);
  fill(50);
  stroke(0);
  rectMode(CENTER);
  rect(-270, 80, 25, 80);
  rect(-170, 80, 25, 80);
  fill(120);
  rect(-280, 100, 25, 90);
  rect(-160, 100, 25, 90);
  stroke(50);
  rect(-220, -100, 10, 30);
  fill(255);
  drawPressureGauge();
  pop();
}

function drawPressureGauge() {
  push();
  translate(-220, -140);
  fill(255);
  stroke(0);
  ellipse(0, 0, 60, 60);
  textAlign(CENTER, CENTER);
  textSize(10 / relativeSize() ** 0.25);
  for (let i = 30; i >= -210; i -= 2.4) {
    i = round(i * 10) / 10;
    const x = 30 * cos(radians(i));
    const y = 30 * sin(radians(i));
    stroke(0);
    noFill();
    if ((i - 30) % 48 === 0) {
      strokeWeight(0.6 / relativeSize());
      line(x / 1.4, y / 1.4, x / 1.12, y / 1.12);
    } else if ((i - 30) % 24 === 0) {
      strokeWeight(0.5 / relativeSize());
      line(x / 1.3, y / 1.3, x / 1.12, y / 1.12);
    } else if ((i - 30) % 12 === 0) {
      strokeWeight(0.4 / relativeSize());
      line(x / 1.23, y / 1.23, x / 1.12, y / 1.12);
    } else {
      strokeWeight(0.2 / relativeSize());
      line(x / 1.2, y / 1.2, x / 1.12, y / 1.12);
    }
    if ((i - 30) % 48 === 0) {
      noStroke();
      fill(0);
      const textX = 42 * cos(radians(i));
      const textY = 42 * sin(radians(i));
      const ratio = round(10 * (1 + ((i - 30) / 240))) / 10;
      const P = round(10 * ratio * g.P_range[1]) / 10;
      text(P, textX, textY);
    }
  }
  push();
  const angle = radians(map(g.P, g.P_range[0], g.P_range[1], -30, 210));
  rotate(angle);
  strokeWeight(0.25 / relativeSize());
  stroke(0);
  fill(205);
  triangle(-24, 0, -8, -3, -8, 3);
  line(0, 1.8, -8, 1.8);
  line(0, -1.8, -8, -1.8);
  pop();
  stroke(0);
  fill(235);
  circle(0, 0, 8);
  noStroke();
  fill(0);
  text("bar", 0, 20);
  pop();
}

function drawTankShell() {
  push();
  translate(width / 2, height / 2.5);
  noFill();
  for (let i = 0; i < 200; i++) {
    const rgb = 220 - 0.002 * i ** 2;
    stroke(rgb);
    beginShape();
    for (let j = 0; j < 360; j++) {
      const x = -220 + tank_diameter / 2 * (i / 200) * sin(radians(j / 2));
      const y = tank_diameter / 2 * cos(radians(j / 2));
      vertex(x, y);
    }
    endShape();
    beginShape();
    for (let j = 0; j < 360; j++) {
      const x = -220 - tank_diameter / 2 * (i / 200) * sin(radians(j / 2));
      const y = tank_diameter / 2 * cos(radians(j / 2));
      vertex(x, -y);
    }
    endShape();
  }
  stroke(100);
  strokeWeight(1 / relativeSize());
  ellipse(-220, 0, tank_diameter, tank_diameter)
  pop();
}

function drawSyringe() {
  push();
  translate(width / 2, height / 2.5);
  rectMode(CORNER);
  noStroke();
  fill(g.liquid_color);
  rect(-80, -12.5, 5 + (1 - g.syringe_fraction) * 92, 25);
  stroke(0);
  fill(150);
  rect(-120, -1, 40, 2);
  fill(150);
  rect(15 - 90 * g.syringe_fraction, -3, 105, 6);
  rectMode(CENTER);
  fill(120);
  rect(15 - 90 * g.syringe_fraction, 0, 4, 23);
  rectMode(CORNER);
  fill(180);
  rect(120 - 90 * g.syringe_fraction, -13, 3, 26);
  rect(-82, -5, 2, 10);
  setGradient(-80, -12.5, 100, 25, color(240, 240, 240, 127), color(215, 215, 215, 127), 1);
  noFill();
  rectMode(CORNER);
  stroke(100);
  rect(-80, -12.5, 100, 25, 2, 2);
  pop();
}

function setGradient(p, x, y, w, h, c1, c2, axis) {
  noFill();

  if (axis === 1) {
    // Top to bottom gradient
    for (let i = y; i <= y + h; i++) {
      let inter = map(i, y, y + h, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(x, i, x + w, i);
    }
  } else if (axis === 2) {
    // Left to right gradient
    for (let i = x; i <= x + w; i++) {
      let inter = map(i, x, x + w, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(i, y, i, y + h);
    }
  }
}

function drawText() {
  push();
  translate(width / 2, height / 2.5);
  textSize(16);
  noStroke();
  fill(0);
  textAlign(CENTER, CENTER);
  textWrap(WORD);
  let text_above_syringe = "";
  let text_below_syringe = "";
  let liquid_in_syringe = Number(round(10000 * g.n / g.rhoLm()) / 10).toFixed(1);
  if (liquid_in_syringe === "0.0" || liquid_in_syringe === "0.1") {
    liquid_in_syringe = Number(round(100000 * g.n / g.rhoLm()) / 100).toFixed(2);
  }
  if (!g.is_finished && !g.is_running) {
    text_above_syringe = "ready to inject liquid into empty vessel";
    text_below_syringe = `syringe contains ${liquid_in_syringe} mL liquid`;
  } else if (g.is_running && !g.is_finished) {
    text_above_syringe = "";
    text_below_syringe = "injecting liquid ...";
  } else {
    text_below_syringe = `injected ${liquid_in_syringe} L liquid`;
    text_above_syringe = "";
  }
  text(text_above_syringe, -120, -45, 200);
  text(text_below_syringe, -10, 40);
  text("tank volume = 2 L", -220, 180);
  pop();
}

function drawAll() {
  drawTank();
  drawTankShell();
  drawSyringe();
  drawText();
  if (g.is_running && g.percent_injected == 0) {
    document.getElementById("T-slider").setAttribute("disabled", "yes");
    document.getElementById("n-slider").setAttribute("disabled", "yes");
  }
}

module.exports = drawAll;