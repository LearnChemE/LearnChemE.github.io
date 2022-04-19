gvs.graph = {
  margin_left: 80,
  margin_top: 58,
  height: 400,
  width: 680,
  constant_temp_color: gvs.p.color(255, 120, 120),
  phase_label_color: gvs.p.color(84, 34, 11),
  constant_enthalpy_color: gvs.p.color(0, 150, 150),
  constant_entropy_color: gvs.p.color(0, 0, 255),
  constant_quality_color: gvs.p.color(100, 100, 100),
}

require("./water_properties.js");

function setLineDash(list) {
  gvs.p.drawingContext.setLineDash(list);
}

function drawAxes(p) {
  p.push();
  p.translate(gvs.graph.margin_left, gvs.graph.margin_top);
  p.textAlign(p.CENTER, p.CENTER);
  p.textSize(13);
  p.fill(0);
  p.noStroke();
  p.textSize(16);
  p.text("0.01", -18, gvs.graph.height - 1);
  p.text("Select the properties to display by clicking the checkboxes above", gvs.graph.width / 2, -35);
  p.stroke(0);
  p.strokeWeight(1);
  p.noFill();
  p.line(0, 0, 0, gvs.graph.height);
  p.line(0, gvs.graph.height, gvs.graph.width, gvs.graph.height);

  for (let i = 2; i <= 53; i++) {
    let x_value, y_value;
    if (i <= 10) {
      x_value = Number((0.001 * (i / 10)).toFixed(4));
      y_value = Number((0.1 * (i / 10)).toFixed(2));
    } else if (i <= 20) {
      x_value = Number((0.01 * ((i - 10) / 10)).toFixed(3));
      y_value = Number(((i - 10) / 10).toFixed(1));
    } else if (i <= 30) {
      x_value = Number((0.1 * (i - 20) / 10).toFixed(2));
      y_value = Number((10 * (i - 20) / 10).toFixed(0));
    } else if (i <= 40) {
      x_value = Number(((i - 30) / 10).toFixed(1));
      y_value = Number((100 * (i - 30) / 10).toFixed(0));
    } else if (i <= 50) {
      x_value = Number((10 * (i - 40) / 10).toFixed(0));
      y_value = null;
    } else {
      x_value = Number((100 * (i - 50) / 10).toFixed(0));
      y_value = null;
    }
    const x_coord = gvs.graph.width * (Math.log10(x_value) + 3.5) / 5;
    const y_coord = gvs.graph.height - gvs.graph.height * (Math.log10(y_value) + 2) / 4;

    if (gvs.show_grid) {
      p.strokeWeight(0.5);
      p.stroke(210);
      p.line(0, y_coord, gvs.graph.width, y_coord);
      if (i >= 4) {
        p.line(x_coord, gvs.graph.height, x_coord, 0);
      }
      p.stroke(0);
      p.strokeWeight(1);
    }

    if (i % 10 == 0) {
      p.noFill();
      p.stroke(0);
      p.line(x_coord, gvs.graph.height, x_coord, gvs.graph.height - 7);
      p.line(0, y_coord, 7, y_coord);

      p.fill(0);
      p.noStroke();
      p.text(`${x_value}`, x_coord, gvs.graph.height + 15);
      p.text(`${y_value}`, -15, y_coord);
    } else {
      p.noFill();
      p.stroke(0);
      if (i >= 4) {
        p.line(x_coord, gvs.graph.height, x_coord, gvs.graph.height - 3);
      }
      p.line(0, y_coord, 3, y_coord);
    }
  }
  p.pop();

  p.push();
  p.fill(0);
  p.noStroke();
  p.textSize(16);
  p.textAlign(p.CENTER, p.CENTER);
  p.translate(gvs.graph.margin_left - 40, gvs.graph.margin_top + gvs.graph.height / 2);
  p.rotate(-Math.PI / 2);
  p.text("Pressure (MPa)", 0, 0);
  p.pop();

  p.push();
  p.fill(0);
  p.noStroke();
  p.textSize(16);
  p.textAlign(p.CENTER, p.CENTER);
  p.translate(gvs.graph.margin_left + gvs.graph.width / 2, gvs.graph.margin_top + gvs.graph.height + 45);
  p.text("Specific Volume (m  /kg)", 0, 0);
  p.textSize(12);
  p.text("3", 54, -5);
  p.pop();
}

function drawEquilibrium(p) {
  const eq = TPHSV;
  p.push();
  p.translate(gvs.graph.margin_left, gvs.graph.margin_top);
  p.stroke(0);
  p.strokeWeight(2);
  p.noFill();
  p.beginShape();
  // Liquid Curve
  for (let i = 0; i < eq.length; i++) {
    const TPHSV = eq[i];
    const P = TPHSV[1];
    const V = TPHSV[6];
    const P_coord = gvs.graph.height - gvs.graph.height * (Math.log10(P) + 2) / 4;
    const V_coord = gvs.graph.width * (Math.log10(V) + 3.5) / 5;
    if (P_coord <= gvs.graph.height && V_coord < gvs.graph.width) {
      p.vertex(V_coord, P_coord);
    }
  }
  p.endShape();
  p.beginShape();
  // Vapor Curve
  for (let i = 0; i < eq.length; i++) {
    const TPHSV = eq[i];
    const P = TPHSV[1];
    const V = TPHSV[7];
    const P_coord = gvs.graph.height - gvs.graph.height * (Math.log10(P) + 2) / 4;
    const V_coord = gvs.graph.width * (Math.log10(V) + 3.5) / 5;
    if (P_coord <= gvs.graph.height && V_coord < gvs.graph.width) {
      p.vertex(V_coord, P_coord);
    }
  }
  p.endShape();
  p.pop();
}

function drawConstantTemperature(p) {
  p.push();
  p.stroke(gvs.graph.constant_temp_color);
  p.strokeWeight(1);
  p.noFill();
  // temperatures: [60, 80, 100, 120, 160, 260, 300, 400, 800, 1800]
  const temperature_indices = [1, 2, 3, 4, 6, 8, 11, 13, 18, 38, 88];
  let temperature_list = [];
  for (let T = 40; T < 2000; T += 20) {
    temperature_list.push(T);
  }
  for (let i = 0; i < temperature_indices.length; i++) {
    const index = temperature_indices[i];
  }
  for (let i = 0; i < temperature_indices.length; i++) {
    const index = temperature_indices[i];
    const constant_temperature = constant_temperature_lines[index];
    p.beginShape();
    for (let j = 0; j < constant_temperature.length; j++) {
      const V = constant_temperature[j][0];
      const P = constant_temperature[j][1];
      let V_coord = gvs.graph.margin_left + gvs.graph.width * (Math.log10(V) + 3.5) / 5;
      let P_coord = gvs.graph.margin_top + gvs.graph.height - gvs.graph.height * (Math.log10(P) + 2) / 4;
      if (
        P_coord > gvs.graph.margin_top &&
        P_coord < gvs.graph.margin_top + gvs.graph.height &&
        V_coord < gvs.graph.width + gvs.graph.margin_left &&
        V_coord > gvs.graph.margin_left
      ) {
        P_coord = Math.max(gvs.graph.margin_top - 10, P_coord);
        p.vertex(V_coord, P_coord);
      }
    }
    p.endShape();
  }
  p.pop();
}

function drawConstantEnthalpy(p) {
  p.push();
  p.stroke(gvs.graph.constant_enthalpy_color);
  p.strokeWeight(1);
  p.noFill();
  setLineDash([7, 7]);
  for (let i = 0; i < constant_enthalpy_lines.length; i += 1) {
    const constant_enthalpy = constant_enthalpy_lines[i];
    p.beginShape();
    for (let j = 0; j < constant_enthalpy.length; j++) {
      const V = constant_enthalpy[j][0];
      const P = constant_enthalpy[j][1];
      let V_coord = gvs.graph.margin_left + gvs.graph.width * (Math.log10(V) + 3.5) / 5;
      let P_coord = gvs.graph.margin_top + gvs.graph.height - gvs.graph.height * (Math.log10(P) + 2) / 4;
      if (
        P_coord <= gvs.graph.height + gvs.graph.margin_top &&
        V_coord < gvs.graph.width + gvs.graph.margin_left
      ) {
        P_coord = Math.max(gvs.graph.margin_top - 10, P_coord);
        p.vertex(V_coord, P_coord);
      }
    }
    p.endShape();
  }
  p.pop();
}

function drawConstantEntropy(p) {
  p.push();
  p.stroke(gvs.graph.constant_entropy_color);
  p.strokeWeight(1);
  p.noFill();
  setLineDash([12, 4, 4, 4]);
  for (let i = 0; i < constant_entropy_lines.length; i += 1) {
    const constant_entropy = constant_entropy_lines[i];
    p.beginShape();
    for (let j = 0; j < constant_entropy.length; j++) {
      const V = constant_entropy[j][0];
      const P = constant_entropy[j][1];
      let V_coord = gvs.graph.margin_left + gvs.graph.width * (Math.log10(V) + 3.5) / 5;
      let P_coord = gvs.graph.margin_top + gvs.graph.height - gvs.graph.height * (Math.log10(P) + 2) / 4;
      if (
        P_coord <= gvs.graph.height + gvs.graph.margin_top &&
        V_coord < gvs.graph.width + gvs.graph.margin_left
      ) {
        P_coord = Math.max(gvs.graph.margin_top - 10, P_coord);
        p.vertex(V_coord, P_coord);
      }
    }
    p.endShape();
  }
  p.pop();
}

function drawConstantQuality(p) {
  p.push();
  p.stroke(gvs.graph.constant_quality_color);
  p.strokeWeight(1);
  p.noFill();
  const quality_indices = [0, 8, 18, 38, 58, 78, 93, 98, 99]; // qualities of: 0.01, 0.1, 0.2, 0.4, 0.6, 0.8, 0.95, 0.99, 0.999
  for (let i = 0; i < quality_indices.length; i += 1) {
    const index = quality_indices[i];
    const constant_quality = constant_quality_lines[index];
    p.beginShape();
    for (let j = 0; j < constant_quality.length; j++) {
      const V = constant_quality[j][0];
      const P = constant_quality[j][1];
      let V_coord = gvs.graph.margin_left + gvs.graph.width * (Math.log10(V) + 3.5) / 5;
      let P_coord = gvs.graph.margin_top + gvs.graph.height - gvs.graph.height * (Math.log10(P) + 2) / 4;
      if (
        P_coord <= gvs.graph.height + gvs.graph.margin_top &&
        V_coord < gvs.graph.width + gvs.graph.margin_left
      ) {
        P_coord = Math.max(gvs.graph.margin_top - 10, P_coord);
        p.vertex(V_coord, P_coord);
      }
    }
    p.endShape();
  }
  p.pop();
}

function textBox(p, str, x_coord, y_coord, color, font_size) {
  p.push();
  p.textSize(font_size);
  p.noStroke();
  p.textAlign(p.CENTER, p.CENTER);
  p.rectMode(p.CENTER);
  p.fill(253);
  p.translate(x_coord, y_coord);
  const rect_length = p.textWidth(str) + 4;
  const rect_height = p.textAscent() + 4;
  p.rect(0, 0, rect_length, rect_height);
  p.fill(color);
  p.text(str, 0, 0);
  p.pop();
}

function drawPhaseLabels(p) {

  textBox(
    p,
    "supercritical",
    gvs.graph.margin_left + 2 * gvs.graph.width / 7 + 5,
    gvs.graph.margin_top + gvs.graph.height / 40,
    gvs.graph.phase_label_color,
    18
  );

  textBox(
    p,
    "liquid",
    gvs.graph.margin_left + gvs.graph.width / 17 - 3,
    gvs.graph.margin_top + 3 * gvs.graph.height / 5,
    gvs.graph.phase_label_color,
    18
  );

  textBox(
    p,
    "vapor",
    gvs.graph.margin_left + 9 * gvs.graph.width / 11,
    gvs.graph.margin_top + gvs.graph.height / 2,
    gvs.graph.phase_label_color,
    18
  );


}

function drawCurveLabels(p) {
  if (gvs.show_constant_temperature ) {
    // temperatures: [60, 80, 100, 120, 160, 200, 260, 300, 400, 800, 1500]
    p.push();
    textBox(p, "60", 240, 400, gvs.graph.constant_temp_color, 15);
    textBox(p, "80", 240, 358, gvs.graph.constant_temp_color, 15);
    textBox(p, "100", 240, 334, gvs.graph.constant_temp_color, 15);
    textBox(p, "120", 240, 305, gvs.graph.constant_temp_color, 15);
    textBox(p, "160", 240, 260, gvs.graph.constant_temp_color, 15);
    textBox(p, "200", 240, 224, gvs.graph.constant_temp_color, 15);
    textBox(p, "260", 240, 153, gvs.graph.constant_temp_color, 15);
    textBox(p, "300", 240, 155, gvs.graph.constant_temp_color, 15);
    p.translate(240, 111);
    p.rotate(Math.PI / 12);
    textBox(p, "400", 0, 0, gvs.graph.constant_temp_color, 15);
    p.rotate(Math.PI / 8.4);
    p.translate(50, -43);
    textBox(p, "800", 0, 0, gvs.graph.constant_temp_color, 15);
    p.rotate(Math.PI / 40);
    p.translate(40, -28);
    textBox(p, "1800", 0, 0, gvs.graph.constant_temp_color, 15);
    p.pop();
  }

  if (gvs.show_constant_enthalpy ) {
    p.push();
    // enthalpies: [500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500]
    p.translate(400, 362);
    p.rotate(Math.PI / 9);
    textBox(p, "500", 0, 0, gvs.graph.constant_enthalpy_color, 15);
    p.translate(10, -59);
    p.rotate(Math.PI / 13);
    textBox(p, "1000", 0, 0, gvs.graph.constant_enthalpy_color, 15);
    p.translate(5, -40);
    p.rotate(Math.PI / 30);
    textBox(p, "2000", 0, 0, gvs.graph.constant_enthalpy_color, 15);
    p.translate(0, -27);
    textBox(p, "3000", 0, 0, gvs.graph.constant_enthalpy_color, 15);
    p.pop();
  }

  if (gvs.show_constant_quality ) {

    p.push();
    p.translate(276, 430);
    p.rotate(Math.PI / 4);
    textBox(p, "0.999", 0, 0, gvs.graph.constant_quality_color, 15);
    p.pop();

    p.push();
    p.translate(406, 430);
    p.rotate(Math.PI / 4.4);
    textBox(p, "0.99", 0, 0, gvs.graph.constant_quality_color, 15);
    p.pop();
    
    p.push();
    p.translate(510, 430);
    p.rotate(Math.PI / 4.4);
    textBox(p, "0.90", 0, 0, gvs.graph.constant_quality_color, 15);
    p.pop();
    
    p.push();
    p.translate(584, 430);
    p.rotate(Math.PI / 4.6);
    textBox(p, "0.80", 0, 0, gvs.graph.constant_quality_color, 15);
    p.pop();
    
    p.push();
    p.translate(624, 430);
    p.rotate(Math.PI / 4.6);
    textBox(p, "0.70", 0, 0, gvs.graph.constant_quality_color, 15);
    p.pop();
  
  }

  if (gvs.show_constant_entropy ) {

    p.push();
    p.translate(320, 409);
    p.rotate(Math.PI / 40);
    textBox(p, "1.000", 0, 0, gvs.graph.constant_entropy_color, 15);
    p.pop();

    p.push();
    p.translate(320, 297);
    p.rotate(Math.PI / 10);
    textBox(p, "2.000", 0, 0, gvs.graph.constant_entropy_color, 15);
    p.pop();

    p.push();
    p.translate(330, 240);
    p.rotate(Math.PI / 6.5);
    textBox(p, "3.000", 0, 0, gvs.graph.constant_entropy_color, 15);
    p.pop();

    p.push();
    p.translate(355, 198);
    p.rotate(Math.PI / 4.8);
    textBox(p, "5.000", 0, 0, gvs.graph.constant_entropy_color, 15);
    p.pop();

    p.push();
    p.translate(390, 182);
    p.rotate(Math.PI / 3.9);
    textBox(p, "7.000", 0, 0, gvs.graph.constant_entropy_color, 15);
    p.pop();
  }
}

function drawLegend(p) {
  p.push();
  p.rectMode(p.CENTER);
  p.textSize(15);
  p.stroke(100);
  p.fill(253);
  p.translate(gvs.graph.margin_left, gvs.graph.margin_top);
  p.translate(gvs.graph.width - 85, 60);
  p.rect(0, 0, 180, 130);
  p.noStroke();
  p.fill(0);
  p.textAlign(p.CENTER, p.CENTER);
  p.text("Units:", 0, -48);
  p.textAlign(p.LEFT, p.CENTER);
  p.fill(gvs.graph.constant_enthalpy_color);
  p.text("enthalpy: kJ/kg", -40, -24);
  p.fill(gvs.graph.constant_entropy_color);
  p.text("entropy: kJ/(kg K)", -40, 0);
  p.fill(gvs.graph.constant_temp_color);
  p.text("temperature: K", -40, 24);
  p.fill(gvs.graph.constant_quality_color);
  p.text("quality: kg/kg", -40, 48);
  p.noFill();
  p.strokeWeight(2);
  p.stroke(gvs.graph.constant_enthalpy_color);
  p.line(-80, -24, -50, -24);
  p.stroke(gvs.graph.constant_entropy_color);
  p.line(-80, 0, -50, 0);
  p.stroke(gvs.graph.constant_temp_color);
  p.line(-80, 24, -50, 24);
  p.stroke(gvs.graph.constant_quality_color);
  p.line(-80, 48, -50, 48);
  p.pop();
}

function drawAll(p) {
  drawAxes(p);
  if (gvs.show_constant_temperature) {
    drawConstantTemperature(p);
  }
  if (gvs.show_constant_entropy) {
    drawConstantEntropy(p);
  }
  if (gvs.show_constant_quality) {
    drawConstantQuality(p);
  }
  if (gvs.show_constant_enthalpy) {
    drawConstantEnthalpy(p);
  }
  drawEquilibrium(p);
  drawPhaseLabels(p);
  drawCurveLabels(p);
  drawLegend(p);
}

module.exports = drawAll;