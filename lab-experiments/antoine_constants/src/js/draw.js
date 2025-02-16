const tank_diameter = 200;

function drawTank(p) {
  push();
  translate(width / 2, height / 2);
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
  strokeWeight(2);
  ellipse(-220, -137.5, 70, 45);
  fill(0);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(14);
  text(`${g.P.toFixed(2)} bar`, -218, -137);
  pop();
}

function drawLiquid(p) {
  push();
  translate(width / 2, height / 2);
  noStroke();
  fill(g.liquid_color);
  ellipse(-220, 0, tank_diameter, tank_diameter);
  fill(g.background_color);
  const triangle_height_top = 200 - 400 * Math.abs(0.5 - g.liquid_level);
  const triangle_height_bottom = 200 - triangle_height_top;
  const radius = tank_diameter * 0.5;
  let angle = Math.asin(triangle_height_bottom / (radius * 2));
  let angle2 = g.liquid_level >= 0.5 ? -angle : angle;
  beginShape();
  for (let i = -Math.PI - angle2; i < angle2; i += 0.01) {
    const x_value = Math.cos(i) * radius - 220;
    const y_value = Math.sin(i) * radius;
    vertex(x_value, y_value);
  }
  endShape();
  fill(g.liquid_color[0], g.liquid_color[1], g.liquid_color[2], g.vapor_density * 137);
  ellipse(-220, 0, tank_diameter, tank_diameter);

  const ellipse_width = Math.sin(Math.PI / 2 - angle) * 2 * radius - 3;
  const ellipse_y = -100 + (1 - g.liquid_level) * tank_diameter;
  const ellipse_height = 25 - 50 * Math.abs(g.liquid_level - 0.5);
  stroke(50);
  fill(g.liquid_color[0] - 30, g.liquid_color[1] - 30, g.liquid_color[2] - 30);
  ellipse(-220, ellipse_y, ellipse_width, ellipse_height);
  stroke(100);
  noFill();
  ellipse(-220, 0, tank_diameter, tank_diameter)
  pop();
}

function drawSyringe(p) {
  push();
  translate(width / 2, height / 2);
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
  setGradient(p, -80, -12.5, 100, 25, color(240, 240, 240, 127), color(215, 215, 215, 127), 1);
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

function drawGraph(p) {
  const graph_height = 350;
  const graph_width = 200;
  push();
  translate(3 * width / 4, height / 2);
  stroke(0);
  noFill();
  line(-50, -200, -50, -200 + graph_height);
  line(-50, 150, -50 + graph_width, 150);
  textSize(16);
  for (let i = 0; i <= 2; i += 0.1) {
    i = Number(Math.round(i * 10) / 10); // Floating point precision error
    const y = 150 - (i / 2) * 350;
    const x = -50;
    const length = i % 0.5 == 0 ? 4 : 2;
    stroke(0);
    noFill();
    line(x, y, x + length, y);
    if (length === 4) {
      noStroke();
      fill(0);
      text(`${i.toFixed(1)}`, x - 30, y + 5);
    }
  }
  const height_V_bar = (g.V / 2) * graph_height; // Divide by 2 because the max number of moles injected is 2
  const height_L_bar = (g.L / 2) * graph_height;
  const V_color = color(150, 150, 255);
  const L_color = color(0, 0, 255);

  rectMode(CORNERS);
  stroke(0);
  fill(V_color);
  rect(-30, -200 + graph_height, -30 + graph_width / 3, -200 + graph_height - height_V_bar);
  fill(L_color);
  rect(-30 + graph_width / 3 + 20, -200 + graph_height, -10 + 2 * graph_width / 3, -200 + graph_height - height_L_bar);
  noStroke();
  fill(0);
  textAlign(CENTER, BOTTOM);
  textSize(18);
  text("moles in tank", -55 + graph_width / 2, -230);
  textSize(16);
  const V_text = g.V == 0 ? "0.00" : g.V < 0.01 ? g.V.toPrecision(1) : g.V.toFixed(2);
  const L_text = g.L == 0 ? "0.00" : g.L < 0.01 ? g.L.toPrecision(1) : (Number(g.n.toFixed(2)) - Number(g.V.toFixed(2))).toFixed(2); // Have to be careful to avoid rounding errors .. make sure everything is exactly 2 significant figures
  if (g.is_running || g.is_finished) {
    text(`${V_text}`, -30 + graph_width / 6, -200 + graph_height - height_V_bar - 5);
    text(`${L_text}`, -10 + graph_width / 2, -200 + graph_height - height_L_bar - 5);
  }
  text("vapor", -30 + graph_width / 6, -200 + graph_height + 30);
  text("liquid", -10 + graph_width / 2, -200 + graph_height + 30);
  pop();
}

function drawText(p) {
  push();
  translate(width / 2, height / 2);
  textSize(16);
  noStroke();
  fill(0);
  textAlign(CENTER, CENTER);
  textWrap(WORD);
  let text_above_syringe = "";
  let text_below_syringe = "";
  let text_over_tank = "";
  const liquid_in_syringe = Number(g.n / g.rhoLm()).toFixed(2);
  if (!g.is_finished && !g.is_running) {
    text_above_syringe = "ready to inject liquid into empty vessel";
    text_below_syringe = `syringe contains ${liquid_in_syringe} L liquid`;
    text_over_tank = "";
  } else if (g.is_running && !g.is_finished) {
    text_above_syringe = "";
    text_below_syringe = "injecting liquid ...";
    text_over_tank = "";
  } else {
    text_below_syringe = `injected ${liquid_in_syringe} L liquid`;
    text_above_syringe = "";
    if (g.L_final == 0) {
      text_over_tank = "all vapor"
    } else {
      text_over_tank = "vapor-liquid mixture"
    }
  }
  text(text_over_tank, -220, 0);
  text(text_above_syringe, -120, -45, 200);
  text(text_below_syringe, -10, 40);
  text("tank volume = 2 L", -220, 180);
  pop();
}

function drawAll(p) {
  drawTank(p);
  drawLiquid(p);
  drawSyringe(p);
  drawGraph(p);
  drawText(p);
  if (!g.is_finished && !g.is_running) {
    document.getElementById("T-slider").removeAttribute("disabled");
    document.getElementById("n-slider").removeAttribute("disabled");
  } else if (g.is_running && g.percent_injected == 0) {
    document.getElementById("T-slider").setAttribute("disabled", "yes");
    document.getElementById("n-slider").setAttribute("disabled", "yes");
  }
  if (g.is_finished) {
    document.getElementById("T-slider").removeAttribute("disabled");
    document.getElementById("n-slider").removeAttribute("disabled");
    noLoop();
  }
}

module.exports = drawAll;