const tank_diameter = 200;

function drawTank() {
  push();
  translate(graphics_left, graphics_top);
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
  pop();
}

function drawPressureGauge() {
  push();
  translate(-220, -140);
  if (g.is_enlarged) {
    scale(2);
    translate(0, 20);
    fill(255);
    stroke(100);
    strokeWeight(0.25);
    circle(0, -1, 105);
  }
  fill(255);
  stroke(0);
  strokeWeight(1);
  ellipse(0, 0, 60, 60);
  textAlign(CENTER, CENTER);
  textSize(10 / relativeSize() ** 0.25);
  for (let i = 54; i >= -210; i -= 2.4) {
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
  push();
  translate(-80, -190);
  textAlign(CENTER, CENTER);
  noStroke();
  fill(0);
  textSize(10 / relativeSize() ** 0.25);
  text("hover mouse over\ngauge to enlarge", 0, 40);
  pop();
}

function drawTankShell() {
  push();
  translate(graphics_left, graphics_top);
  strokeWeight(2);
  noFill();
  for (let i = 0; i < 200; i += 2) {
    const rgb = 220 - 0.002 * i ** 2;
    stroke(rgb);
    beginShape();
    for (let j = 0; j < 360; j += 10) {
      const x = -220 + tank_diameter / 2 * (i / 200) * sin(radians(j / 2));
      const y = tank_diameter / 2 * cos(radians(j / 2));
      vertex(x, y);
    }
    endShape();
    beginShape();
    for (let j = 0; j < 360; j += 10) {
      const x = -220 - tank_diameter / 2 * (i / 200) * sin(radians(j / 2));
      const y = tank_diameter / 2 * cos(radians(j / 2));
      vertex(x, -y);
    }
    endShape();
  }
  stroke(150);
  strokeWeight(4);
  ellipse(-220, 0, tank_diameter, tank_diameter)
  drawPressureGauge();
  pop();
}

function drawSyringe() {
  push();
  // console.log(g.syringe_fraction);
  translate(graphics_left, graphics_top);
  rectMode(CORNER);
  noStroke();
  fill(g.liquid_color);
  rect(-80, -6, 1 + (1 - g.syringe_fraction) * 92, 12);
  stroke(0);
  fill(150);
  rect(-120, -1, 40, 2);
  fill(150);
  rect(12 - 90 * g.syringe_fraction, -1, 105, 2);
  rectMode(CENTER);
  fill(120);
  rect(12 - 90 * g.syringe_fraction, 0, 2, 11);
  rectMode(CORNER);
  fill(180);
  rect(117 - 90 * g.syringe_fraction, -6.5, 2, 13);
  rect(-82, -3, 2, 6);
  setGradient(-80, -10, 100, 20, color(240, 240, 240, 127), color(215, 215, 215, 127), 1);
  noFill();
  rectMode(CORNER);
  stroke(100);
  rect(-80, -6, 100, 12, 2, 2);
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
  translate(graphics_left, graphics_top);
  textSize(14 / relativeSize() ** 0.25);
  noStroke();
  fill(0);
  textAlign(CENTER, CENTER);
  textWrap(WORD);
  let text_above_syringe = "";
  let text_below_syringe = "";
  const V_to_add = (round(100 * (g.n_max - g.n) * g.rhoLm()) / 100).toFixed(2);
  const mL_in_tank = (round(100 * g.n_max * g.rhoLm()) / 100).toFixed(2);
  let liquid_in_syringe = g.syringe_fraction === 1 ? 0 : V_to_add;
  if (g.is_equilibrating && g.syringe_fraction === 1) {
    text_above_syringe = `you have injected a\ntotal of ${mL_in_tank} mL`;
    text_below_syringe = "system is equilibrating ...";
  } else if (!g.is_finished && !g.is_running) {
    if (g.syringe_fraction === 1) {
      if (g.n === 0) {
        text_above_syringe = "the tank is empty.\n";
      }
      text_above_syringe += "ready to fill the syringe";
    } else if (g.n === 0) {
      text_above_syringe = "ready to inject liquid into empty vessel";
    } else {
      text_above_syringe = "";
    }
    text_below_syringe = `syringe contains ${liquid_in_syringe} mL liquid`;
  } else if (g.is_running && !g.is_finished) {
    text_above_syringe = "";
    text_below_syringe = "injecting liquid ...";
  } else {
    if (mL_in_tank < 1000) {
      text_below_syringe = `system is at equilibrium.\nyou may refill the syringe`;
    } else {
      text_below_syringe = `tank is full`;
    }
    text_above_syringe = `you have injected a\ntotal of ${mL_in_tank} mL`;
    g.n = g.n_max;
  }
  text(text_above_syringe, -120, -45, 200);
  text(text_below_syringe, -10, 40);
  text(`tank volume = ${g.tank_volume} L`, -220, 180);
  if (!g.is_equilibrating) {
    noLoop();
  }
  pop();
}

function drawThermometer() {
  push();
  translate(graphics_left, graphics_top);
  const thermometer_color = color(200);
  const liquid_color = color(255, 100, 100);
  translate(-350, 120);
  strokeWeight(2 / relativeSize());
  stroke(thermometer_color);
  fill(thermometer_color);
  beginShape();
  vertex(-15 * sqrt(2) / 2, -15 * sqrt(2) / 2);
  vertex(-15 * sqrt(2) / 2, -200);
  for (let i = 0; i < 180; i += 10) {
    const x = -15 * sqrt(2) * cos(radians(i)) / 2;
    const y = -200 - 15 * sqrt(2) / 2 - 15 * sqrt(2) * sin(radians(i)) / 2;
    vertex(x, y);
  }
  vertex(15 * sqrt(2) / 2, -200);
  vertex(15 * sqrt(2) / 2, -15 * sqrt(2) / 2);
  beginContour();
  vertex(6.35, -15 * sqrt(2) / 2);
  vertex(6.35, -204);
  for (let i = 180; i >= 0; i -= 10) {
    const x = -6.35 * cos(radians(i));
    const y = -204 - 6.35 - 6.35 * sin(radians(i));
    vertex(x, y);
  }
  vertex(-6.35, -204);
  vertex(-6.35, -15 * sqrt(2) / 2);
  endContour();
  endShape();
  fill(liquid_color);
  stroke(thermometer_color);
  strokeWeight(4 / relativeSize());
  circle(0, 0, 30);
  fill(liquid_color);
  noStroke();
  rectMode(CORNER);
  rect(-5, 0, 10, -30 - g.T / 120 * 180);
  fill(0);
  strokeWeight(0.6 / relativeSize());
  textAlign(RIGHT, CENTER);
  textSize(8 / relativeSize());
  for (let i = 0; i <= 120; i += 5) {
    let line_length;
    if (i % 20 === 0) {
      line_length = 4;
      noStroke();
      text(i, -18, -30 - i * 1.5);
    } else if (i % 10 === 0) {
      line_length = 3;
    } else {
      line_length = 1.5;
    }
    stroke(0);
    line(-11.5, -30 - i * 1.5, -11.5 + line_length, -30 - i * 1.5);
  }
  noStroke();
  textAlign(CENTER, TOP);
  textSize(10 / relativeSize());
  text("°C", 0, 24);
  pop();
}

function drawAll() {
  drawTank();
  drawTankShell();
  drawSyringe();
  drawText();
  drawThermometer();
  if (g.is_running && g.percent_injected == 0) {
    document.getElementById("t-slider").setAttribute("disabled", "yes");
    document.getElementById("v-slider").setAttribute("disabled", "yes");
  }
}

module.exports = drawAll;