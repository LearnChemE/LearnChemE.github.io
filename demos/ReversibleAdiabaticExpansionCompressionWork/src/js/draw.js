function drawPistons(p) {
  p.push();
  p.translate(400, 450);

  if(gvs.condition_1 === "reversible adiabatic" || gvs.condition_1 === "irreversible adiabatic") {
    p.beginShape();
    p.vertex(-100, 0);
    p.vertex(100, 0);
    p.vertex(100, -250);
    p.vertex(130, -250);
    p.vertex(130, 30);
    p.vertex(-130, 30);
    p.vertex(-130, -250);
    p.vertex(-100, -250);
    p.endShape(p.CLOSE);
    for(let i = 0; i <= 10; i++) {
      const x1 = -130;
      const y1 = -250 + 250 * (i / 10);
      const x2 = -100;
      const y2 = -220 + 250 * (i / 10);
      p.line(x1, y1, x2, y2);
    }
    p.line(-100, 5, -75, 30);
    for(let i = 0; i <= 6; i++) {
      const x1 = -80 + 160 * (i / 6);
      const y1 = 0;
      const x2 = -50 + 160 * (i / 6);
      const y2 = 30;
      p.line(x1, y1, x2, y2);
    }
    for(let i = 0; i <= 9; i++) {
      const x1 = 100;
      const y1 = -250 + 250 * (i / 10);
      const x2 = 130;
      const y2 = -220 + 250 * (i / 10);
      p.line(x1, y1, x2, y2);
    }
  } else {
    p.strokeWeight(2);
    p.beginShape();
    p.vertex(-100, -250);
    p.vertex(-100, 0);
    p.vertex(100, 0);
    p.vertex(100, -250);
    p.endShape();
  }

  p.strokeWeight(1);
  let height_initial_1 = gvs.work_type === "compression" ? 200 : 20;
  let height_final_1 = height_initial_1 * (gvs.V_final_1 / gvs.V_initial_1);
  let height_1 = height_initial_1 - (height_initial_1 - height_final_1) * gvs.animation_fraction;

  p.fill(120);
  p.rect(-100, -1 * height_1, 200, -15);
  p.fill(240, 240, 200);
  p.rect(-100, 0, 200, -1 * height_1);

  const P_ext_1 = gvs.condition_1 == "reversible adiabatic" || gvs.condition_1 == "reversible isothermal" ? (gvs.P_initial / 1e6 + gvs.animation_fraction * (gvs.P_final - gvs.P_initial) / 1e6).toFixed(2) : (gvs.P_final / 1e6).toFixed(2);
  const P_int_1 = ((gvs.P_initial + (gvs.P_final - gvs.P_initial) * gvs.animation_fraction) / 1e6).toFixed(2);

  p.fill(0);
  p.noStroke();
  p.textSize(18);
  p.text(`P    = ${P_ext_1} MPa`, -60, -1 * height_1 - 60);
  p.text(`P = ${P_int_1} MPa`, -50, -0.5 * height_1 + 6);
  p.textSize(12);
  p.text("ext", -50, -1 * height_1 - 55);

  const number_of_blocks = Math.round((gvs.P_final / 2.00e6) * 20 - 1);

  let number_of_blocks_1;
  if(gvs.condition_1 == "reversible adiabatic" || gvs.condition_1 == "reversible isothermal") {
    if(gvs.work_type == "compression") {
      number_of_blocks_1 = Math.round(gvs.animation_fraction * number_of_blocks);
    } else {
      number_of_blocks_1 = Math.round(9 - gvs.animation_fraction * (9 - number_of_blocks));
    }
  } else {
    number_of_blocks_1 = number_of_blocks
  }

  p.fill(180);
  p.stroke(0);
  p.strokeWeight(1);
  if(number_of_blocks_1 <= 10) {
    for(let i = 0; i < number_of_blocks_1; i++) {
      p.rect(-90 + i * 18, -1 * height_1 - 15, 15, -15);
    }
  } else {
    for(let i = 0; i < 10; i++) {
      p.rect(-90 + i * 18, -1 * height_1 - 15, 15, -15);
    }
    for(let i = 11; i <= number_of_blocks_1; i++) {
      p.rect(-81 + (i - 11) * 18, -1 * height_1 - 32, 15, -15);
    }
  }

  if(!gvs.running && gvs.animation_fraction === 0) {
    p.stroke(0);
    p.strokeWeight(1);
    p.fill(255, 0, 0);
    if(gvs.work_type === "compression" && (gvs.condition_1 === "irreversible adiabatic" || gvs.condition_1 === "irreversible isothermal")) {
      p.triangle(-100, -1 * height_1, -80, -1 * height_1, -100, -1 * height_1 + 20);
      p.triangle(100, -1 * height_1, 80, -1 * height_1, 100, -1 * height_1 + 20);
    } else if(gvs.work_type === "expansion" && (gvs.condition_1 === "irreversible adiabatic" || gvs.condition_1 === "irreversible isothermal")) {
      p.triangle(-100, -1 * height_1 - 15, -80, -1 * height_1 - 15, -100, -1 * height_1 - 35);
      p.triangle(100, -1 * height_1 - 15, 80, -1 * height_1 - 15, 100, -1 * height_1 - 35);
    }
  }

  p.pop();
}

function drawLabels(p) {
  p.push();
  p.translate(400, 90);
  p.rectMode(p.CENTER);
  p.rect(0, -15, 250, 120);
  p.noStroke();
  p.fill(0);
  p.textSize(18);
  const label1 = gvs.condition_1;
  p.textAlign(p.CENTER);
  // p.text(label1, 0, -45);
  p.textAlign(p.LEFT);
  const W1 = (gvs.W_1 * gvs.animation_fraction / 1000).toFixed(1);
  const T1 = Math.round(300 + (gvs.T_final_1 - 300) * gvs.animation_fraction);
  let V1 = ((gvs.V_initial_1 - (gvs.V_initial_1 - gvs.V_final_1) * gvs.animation_fraction) / gvs.V_initial_1).toFixed(2);
  if(V1 == "10.00") {V1 = "10.0"}
  p.text(`W = ${W1} kJ/mol`, -60, -40);
  p.text(`T = ${T1} K`, -40, -10);
  p.text(`V = ${V1}V`, -40, 20);
  p.textSize(12);
  p.text("initial", 40, 25);
  p.pop();
}

function drawAll(p) {
  drawPistons(p);
  drawLabels(p);
}

module.exports = drawAll;