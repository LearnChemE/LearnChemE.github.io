gvs.graph = {
  margin_left : 80,
  margin_top : 60,
  height: 400,
  width: 680,
}

require("./water_properties");
const calcs = require("./calcs.js");

function drawAxes(p) {
  p.push();
  p.translate(gvs.graph.margin_left, gvs.graph.margin_top);
  p.textAlign(p.CENTER, p.CENTER);
  p.textSize(14);
  p.fill(0);
  p.noStroke();
  p.text("0.01", -15, gvs.graph.height - 5);
  // p.text("0.0001", 0, gvs.graph.height + 15);
  p.textSize(16);
  p.text("Pressure-Volume Diagram for Water", gvs.graph.width / 2, -35);
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

    // p.stroke(120);
    // p.strokeWeight(1);
    // for(let j = 0; j < 40; j++) {
    //   let x_point_value;
    //   if ( j <= 10 ) {
    //     x_point_value = Number((0.01 * (j / 10)).toFixed(3));
    //   } else if ( j <= 20 ) {
    //     x_point_value = Number((0.1 * ((j - 10) / 10)).toFixed(2));
    //   } else if ( j <= 30 ) {
    //     x_point_value = Number(((j - 20) / 10).toFixed(1));
    //   } else if ( j <= 40 ) {
    //     x_point_value = Number((10 * (j - 30) / 10).toFixed(0));
    //   } else {
    //     x_point_value = null;
    //   }
    //   const x_point_coord = gvs.graph.width * (Math.log10(x_point_value) + 3) / 4;
    //   if(j % 1 == 0) {
    //     for(let k = 0; k < 40; k++) {
    //       let y_point_value;
    //       if ( k <= 10 ) {
    //         y_point_value = Number((0.1 * (k / 10)).toFixed(2));
    //       } else if ( k <= 20 ) {
    //         y_point_value = Number(((k - 10) / 10).toFixed(1));
    //       } else if ( k <= 30 ) {
    //         y_point_value = Number((10 * (k - 20) / 10).toFixed(0));
    //       } else if ( k <= 40 ) {
    //         y_point_value = Number((100 * (k - 30) / 10).toFixed(0));
    //       } else {
    //         y_point_value = null;
    //       }
    //       const y_point_coord = gvs.graph.height - gvs.graph.height * (Math.log10(y_value) + 2) / 4
    //       p.point(x_point_coord, y_point_coord);
    //     }
    //   }
    // }

    // p.stroke(230);
    // p.strokeWeight(1);
    // if(i != 1) {
    //   p.line(x_coord, gvs.graph.height, x_coord, 0);
    //   p.line(0, y_coord, gvs.graph.width, y_coord);
    // }

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
  p.stroke(255, 0, 0);
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

function drawAll(p) {
  drawAxes(p);
  drawEquilibrium(p);
  drawConstantTemperature(p);
}

module.exports = drawAll;