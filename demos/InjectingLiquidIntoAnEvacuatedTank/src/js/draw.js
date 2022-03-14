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
  p.text(`${gvs.P.toFixed(2)} bar`, -218, -137);
  p.pop();
}

function drawLiquid(p) {
  p.push();
  p.translate(width / 2, height / 2);
  p.noStroke();
  p.fill(gvs.liquid_color);
  p.ellipse(-220, 0, tank_diameter, tank_diameter);
  p.fill(gvs.background_color);
  const triangle_height_top = 200 - 400 * Math.abs(0.5 - gvs.liquid_level);
  const triangle_height_bottom = 200 - triangle_height_top;
  const radius = tank_diameter * 0.5;
  let angle = Math.asin(triangle_height_bottom / (radius * 2));
  let angle2 = gvs.liquid_level >= 0.5 ? -angle : angle;
  p.beginShape();
  for(let i = -Math.PI - angle2; i < angle2; i += 0.01) {
    const x_value = Math.cos(i) * radius - 220;
    const y_value = Math.sin(i) * radius;
    p.vertex(x_value, y_value);
  }
  p.endShape();
  p.fill(gvs.liquid_color[0], gvs.liquid_color[1], gvs.liquid_color[2], gvs.vapor_density * 137);
  p.ellipse(-220, 0, tank_diameter, tank_diameter);

  const ellipse_width = Math.sin(Math.PI / 2 - angle) * 2 * radius - 3;
  const ellipse_y = -100 + (1 - gvs.liquid_level) * tank_diameter;
  const ellipse_height = 25 - 50 * Math.abs(gvs.liquid_level - 0.5);
  p.stroke(50);
  p.fill(gvs.liquid_color[0] - 30, gvs.liquid_color[1] - 30, gvs.liquid_color[2] - 30);
  p.ellipse(-220, ellipse_y, ellipse_width, ellipse_height);
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
  p.rect(-82, -5, 2, 10);
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

function drawGraph(p) {
  const graph_height = 350;
  const graph_width = 200;
  p.push();
  p.translate(3 * width / 4, height / 2);
  p.stroke(0);
  p.noFill();
  p.line(-50, -200, -50, -200 + graph_height);
  p.line(-50, 150, -50 + graph_width, 150);
  p.textSize(16);
  for(let i = 0; i <= 2; i += 0.1) {
    i = Number(Math.round(i * 10) / 10); // Floating point precision error
    const y = 150 - (i / 2) * 350;
    const x = -50;
    const length = i % 0.5 == 0 ? 4 : 2;
    p.stroke(0);
    p.noFill();
    p.line(x, y, x + length, y);
    if(length === 4) {
      p.noStroke();
      p.fill(0);
      p.text(`${i.toFixed(1)}`, x - 30, y + 5);
    }
  }
  const height_V_bar = (gvs.V / 2) * graph_height; // Divide by 2 because the max number of moles injected is 2
  const height_L_bar = (gvs.L / 2) * graph_height;
  const V_color = p.color(150, 150, 255);
  const L_color = p.color(0, 0, 255);

  p.rectMode(p.CORNERS);
  p.stroke(0);
  p.fill(V_color);
  p.rect(-30, -200 + graph_height, -30 + graph_width / 3, -200 + graph_height - height_V_bar);
  p.fill(L_color);
  p.rect(-30 + graph_width / 3 + 20, -200 + graph_height, -10 + 2 * graph_width / 3, -200 + graph_height - height_L_bar);
  p.noStroke();
  p.fill(0);
  p.textAlign(p.CENTER, p.BOTTOM);
  p.textSize(18);
  p.text("moles in tank", -55 + graph_width / 2, -230);
  p.textSize(16);
  const V_text = gvs.V == 0 ? "0.00" : gvs.V < 0.01 ? gvs.V.toPrecision(1) : gvs.V.toFixed(2);
  const L_text = gvs.L == 0 ? "0.00" : gvs.L < 0.01 ? gvs.L.toPrecision(1) : (Number(gvs.n.toFixed(2)) - Number(gvs.V.toFixed(2))).toFixed(2); // Have to be careful to avoid rounding errors .. make sure everything is exactly 2 significant figures
  if(gvs.is_running || gvs.is_finished) {
    p.text(`${V_text}`, -30 + graph_width / 6, -200 + graph_height - height_V_bar - 5);
    p.text(`${L_text}`, -10 + graph_width / 2, -200 + graph_height - height_L_bar - 5);
  }
  p.text("vapor", -30 + graph_width / 6, -200 + graph_height + 30);
  p.text("liquid", -10 + graph_width / 2, -200 + graph_height + 30);
  p.pop();
}

function drawText(p) {
  p.push();
  p.translate(width / 2, height / 2);
  p.textSize(16);
  p.noStroke();
  p.fill(0);
  p.textAlign(p.CENTER, p.CENTER);
  p.textWrap(p.WORD);
  let text_above_syringe = "";
  let text_below_syringe = "";
  let text_over_tank = "";
  const liquid_in_syringe = Number(gvs.n / gvs.rhoLm()).toFixed(2);
  if(!gvs.is_finished && !gvs.is_running) {
    text_above_syringe = "ready to inject liquid into empty vessel";
    text_below_syringe = `syringe contains ${liquid_in_syringe} L liquid`;
    text_over_tank = "";
  } else if (gvs.is_running && !gvs.is_finished) {
    text_above_syringe = "";
    text_below_syringe = "injecting liquid ...";
    text_over_tank = "";
  } else {
    text_below_syringe = `injected ${liquid_in_syringe} L liquid`;
    text_above_syringe = "";
    if(gvs.L_final == 0) {
      text_over_tank = "all vapor"
    } else {
      text_over_tank = "vapor-liquid mixture"
    }
  }
  p.text(text_over_tank, -220, 0);
  p.text(text_above_syringe, -120, -45, 200);
  p.text(text_below_syringe, -10, 40);
  p.text("tank volume = 2 L", -220, 180);
  p.pop();
}

function drawAll(p) {
  drawTank(p);
  drawLiquid(p);
  drawSyringe(p);
  drawGraph(p);
  drawText(p);
  if(!gvs.is_finished && !gvs.is_running) {
    document.getElementById("T-slider").removeAttribute("disabled");
    document.getElementById("n-slider").removeAttribute("disabled");
  } else if(gvs.is_running && gvs.percent_injected == 0) {
    document.getElementById("T-slider").setAttribute("disabled", "yes");
    document.getElementById("n-slider").setAttribute("disabled", "yes");
  }
  if(gvs.is_finished) {
    document.getElementById("T-slider").removeAttribute("disabled");
    document.getElementById("n-slider").removeAttribute("disabled");
    gvs.p.noLoop();
  }
}

module.exports = drawAll;