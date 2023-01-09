function drawPistons(p) {
  p.push();
  p.translate(230, 450);
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

  let height_initial_1 = gvs.work_type === "compression" ? 200 : 20;
  let height_final_1 = height_initial_1 * (gvs.V_final_1 / gvs.V_initial_1);
  let height_1 = height_initial_1 - (height_initial_1 - height_final_1) * gvs.animation_fraction;

  p.fill(120);
  p.rect(-100, -1 * height_1, 200, -15);
  p.fill(240, 240, 200);
  p.rect(-100, 0, 200, -1 * height_1);

  const number_of_blocks = Math.round((gvs.P_final / 2.00e6) * 20);

  const number_of_blocks_1 = gvs.condition_1 == "reversible adiabatic" || gvs.condition_1 == "reversible isothermal" ? Math.round(gvs.animation_fraction * number_of_blocks) : number_of_blocks;

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
      p.rect(-90 + (i - 11) * 18, -1 * height_1 - 31, 15, -15);
    }
  }

  p.fill(255);
  p.translate(350, 0);
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

  let height_initial_2 = gvs.work_type === "compression" ? 200 : 20;
  let height_final_2 = height_initial_2 * (gvs.V_final_2 / gvs.V_initial_2);
  let height_2 = height_initial_2 - (height_initial_2 - height_final_2) * gvs.animation_fraction;

  p.fill(120);
  p.rect(-100, -1 * height_2, 200, -15);
  p.fill(240, 240, 200);
  p.rect(-100, 0, 200, -1 * height_2);

  const number_of_blocks_2 = gvs.condition_2 == "reversible adiabatic" || gvs.condition_2 == "reversible isothermal" ? Math.round(gvs.animation_fraction * number_of_blocks) : number_of_blocks;

  p.fill(180);
  p.stroke(0);
  p.strokeWeight(1);
  if(number_of_blocks_2 <= 10) {
    for(let i = 0; i < number_of_blocks_2; i++) {
      p.rect(-90 + i * 18, -1 * height_2 - 15, 15, -15);
    }
  } else {
    for(let i = 0; i < 10; i++) {
      p.rect(-90 + i * 18, -1 * height_2 - 15, 15, -15);
    }
    for(let i = 11; i <= number_of_blocks_2; i++) {
      p.rect(-90 + (i - 11) * 18, -1 * height_2 - 31, 15, -15);
    }
  }

  p.pop();
}

function drawLabels(p) {
  p.push();
  p.translate(230, 100);
  p.rectMode(p.CENTER);
  p.rect(0, 0, 250, 150);
  p.noStroke();
  p.fill(0);
  p.textSize(18);
  const label1 = gvs.condition_1;
  p.text(label1, -75, -45);
  const W1 = (gvs.W_1 * gvs.animation_fraction / 1000).toFixed(1);
  const T1 = Math.round(300 + (gvs.T_final_1 - 300) * gvs.animation_fraction);
  let V1 = ((gvs.V_initial_1 - (gvs.V_initial_1 - gvs.V_final_1) * gvs.animation_fraction) / gvs.V_initial_1).toFixed(2);
  if(V1 == "10.00") {V1 = "10.0"}
  p.text(`W = ${W1} kJ/mol`, -60, -10);
  p.text(`T = ${T1} K`, -40, 20);
  p.text(`V = ${V1}V`, -40, 50);
  p.textSize(12);
  p.text("initial", 40, 55);

  p.translate(350, 0);
  p.fill(255);
  p.stroke(0);
  p.rect(0, 0, 250, 150);
  p.noStroke();
  p.fill(0);
  p.textSize(18);
  const label2 = gvs.condition_2;
  p.text(label2, -75, -45);
  const W2 = (gvs.W_2 * gvs.animation_fraction / 1000).toFixed(1);
  const T2 = Math.round(300 + (gvs.T_final_2 - 300) * gvs.animation_fraction);
  let V2 = ((gvs.V_initial_2 - (gvs.V_initial_2 - gvs.V_final_2) * gvs.animation_fraction) / gvs.V_initial_2).toFixed(2);
  if(V2 == "10.00") {V2 = "10.0"}
  p.text(`W = ${W2} kJ/mol`, -60, -10);
  p.text(`T = ${T2} K`, -40, 20);
  p.text(`V = ${V2}V`, -40, 50);
  p.textSize(12);
  p.text("initial", 40, 55);

  p.pop();
}

function drawAll(p) {
  drawPistons(p);
  drawLabels(p);
}

module.exports = drawAll;