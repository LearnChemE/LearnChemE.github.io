gvs.graph = {
  margin_left : 80,
  margin_top : 58,
  height: 400,
  width: 680,
  constant_temp_color: gvs.p.color(255, 100, 100),
  phase_label_color: gvs.p.color(84, 34, 11),
  constant_enthalpy_color: gvs.p.color(0, 150, 150),
  constant_entropy_color: gvs.p.color(0, 0, 255),
  constant_quality_color: gvs.p.color(155, 55, 0),
}

require("./water_properties.js");

function drawAxes(p) {
  p.push();
  p.translate(gvs.graph.margin_left, gvs.graph.margin_top);
  p.textAlign(p.CENTER, p.CENTER);
  p.textSize(13);
  p.fill(0);
  p.noStroke();
  p.text("0.01", -15, gvs.graph.height - 5);
  // p.text("0.0001", 0, gvs.graph.height + 15);
  p.textSize(16);
  p.text("Select the properties to display by clicking the checkboxes above", gvs.graph.width / 2, -35);
  p.stroke(0);
  p.strokeWeight(1);
  p.noFill();
  p.line(0, 0, 0, gvs.graph.height);
  p.line(0, gvs.graph.height, gvs.graph.width, gvs.graph.height);

  for(let i = 5; i <= 53; i++) {
    let x_value, y_value;
    if ( i <= 10 ) {
      x_value = Number((0.001 * (i / 10)).toFixed(4));
      y_value = Number((0.1 * (i / 10)).toFixed(2));
    } else if ( i <= 20 ) {
      x_value = Number((0.01 * ((i - 10) / 10)).toFixed(3));
      y_value = Number(((i - 10) / 10).toFixed(1));
    } else if ( i <= 30 ) {
      x_value = Number((0.1 * (i - 20) / 10).toFixed(2));
      y_value = Number((10 * (i - 20) / 10).toFixed(0));
    } else if ( i <= 40 ) {
      x_value = Number(((i - 30) / 10).toFixed(1));
      y_value = Number((100 * (i - 30) / 10).toFixed(0));
    } else if ( i <= 50 ) {
      x_value = Number((10 * (i - 40) / 10).toFixed(0));
      y_value = null;
    } else {
      x_value = Number((100 * (i - 50) / 10).toFixed(0));
      y_value = null;
    }
    const x_coord = gvs.graph.width * (Math.log10(x_value) + 3.5) / 5;
    const y_coord = gvs.graph.height - gvs.graph.height * (Math.log10(y_value) + 2) / 4;

    if(i % 10 == 0) {
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
      p.line(x_coord, gvs.graph.height, x_coord, gvs.graph.height - 3);
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
  for(let i = 0; i < eq.length; i++) {
    const TPHSV = eq[i];
    const P = TPHSV[1];
    const V = TPHSV[6];
    const P_coord = gvs.graph.height - gvs.graph.height * (Math.log10(P) + 2) / 4;
    const V_coord = gvs.graph.width * (Math.log10(V) + 3.5) / 5;
    if(P_coord <= gvs.graph.height && V_coord < gvs.graph.width) {
      p.vertex(V_coord, P_coord);
    }
  }
  p.endShape();
  p.beginShape();
  // Vapor Curve
  for(let i = 0; i < eq.length; i++) {
    const TPHSV = eq[i];
    const P = TPHSV[1];
    const V = TPHSV[7];
    const P_coord = gvs.graph.height - gvs.graph.height * (Math.log10(P) + 2) / 4;
    const V_coord = gvs.graph.width * (Math.log10(V) + 3.5) / 5;
    if(P_coord <= gvs.graph.height && V_coord < gvs.graph.width) {
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
  for(let i = 0; i < constant_temperature_lines.length; i++) {
    const constant_temperature = constant_temperature_lines[i];
    p.beginShape();
    for(let j = 0; j < constant_temperature.length; j++) {
      const V = constant_temperature[j][0];
      const P = constant_temperature[j][1];
      let V_coord = gvs.graph.margin_left + gvs.graph.width * (Math.log10(V) + 3.5) / 5;
      let P_coord = gvs.graph.margin_top + gvs.graph.height - gvs.graph.height * (Math.log10(P) + 2) / 4;
      if(
        P_coord <= gvs.graph.height + gvs.graph.margin_top &&
        V_coord < gvs.graph.width + gvs.graph.margin_left
      ) {
        P_coord = Math.max(gvs.graph.margin_top - 10, P_coord);
        p.vertex(V_coord, P_coord);
      }
    }
    p.endShape();
  }
  // Have to draw a white rectangle at the top to hide lines that extend above 100 MPa. Ghetto but it works
  p.fill(253);
  p.noStroke();
  p.rect(150, 40, 125, 20);
  p.pop();
}

function drawConstantEnthalpy(p) {
  p.push();
  p.stroke(gvs.graph.constant_enthalpy_color);
  p.strokeWeight(1);
  p.noFill();
  for(let i = 0; i < constant_enthalpy_lines.length; i += 1) {
    const constant_enthalpy = constant_enthalpy_lines[i];
    p.beginShape();
    for(let j = 0; j < constant_enthalpy.length; j++) {
      const V = constant_enthalpy[j][0];
      const P = constant_enthalpy[j][1];
      let V_coord = gvs.graph.margin_left + gvs.graph.width * (Math.log10(V) + 3.5) / 5;
      let P_coord = gvs.graph.margin_top + gvs.graph.height - gvs.graph.height * (Math.log10(P) + 2) / 4;
      if(
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
  for(let i = 0; i < constant_entropy_lines.length; i += 1) {
    const constant_entropy = constant_entropy_lines[i];
    p.beginShape();
    for(let j = 0; j < constant_entropy.length; j++) {
      const V = constant_entropy[j][0];
      const P = constant_entropy[j][1];
      let V_coord = gvs.graph.margin_left + gvs.graph.width * (Math.log10(V) + 3.5) / 5;
      let P_coord = gvs.graph.margin_top + gvs.graph.height - gvs.graph.height * (Math.log10(P) + 2) / 4;
      if(
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
  for(let i = 0; i < quality_indices.length; i += 1) {
    const index = quality_indices[i];
    const constant_quality = constant_quality_lines[index];
    p.beginShape();
    for(let j = 0; j < constant_quality.length; j++) {
      const V = constant_quality[j][0];
      const P = constant_quality[j][1];
      let V_coord = gvs.graph.margin_left + gvs.graph.width * (Math.log10(V) + 3.5) / 5;
      let P_coord = gvs.graph.margin_top + gvs.graph.height - gvs.graph.height * (Math.log10(P) + 2) / 4;
      if(
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

function drawPhaseLabels(p) {

  p.push();
  p.textSize(18);
  p.noStroke();
  p.fill(gvs.graph.phase_label_color);
  p.textAlign(p.CENTER, p.CENTER);
  p.translate(gvs.graph.margin_left, gvs.graph.margin_top);
  p.text("liquid", gvs.graph.width / 17 - 3, 3 * gvs.graph.height / 5);
  p.text("vapor", 9 * gvs.graph.width / 11, gvs.graph.height / 2);
  p.fill(253);
  const width = p.textWidth("supercritical");
  p.rectMode(p.CENTER);
  const supercritical_coords = [2 * gvs.graph.width / 7 + 5, gvs.graph.height / 40];
  p.rect(supercritical_coords[0], supercritical_coords[1], width + 3, 21);
  p.fill(gvs.graph.phase_label_color);
  p.text("supercritical", supercritical_coords[0], supercritical_coords[1]);
  p.text("two-phase region", 2 * gvs.graph.width / 5, 7 * gvs.graph.height / 8);
  p.pop();
}

function drawAll(p) {
  drawAxes(p);
  if(gvs.show_constant_temperature) {
    drawConstantTemperature(p);
  }
  if(gvs.show_constant_enthalpy) {
    drawConstantEnthalpy(p);
  }
  if(gvs.show_constant_entropy) {
    drawConstantEntropy(p);
  }
  if(gvs.show_constant_quality) {
    drawConstantQuality(p);
  }
  drawEquilibrium(p);
  drawPhaseLabels(p);
}

module.exports = drawAll;