const shift_left = -200;

function drawCylinder(p) {

  const centerX = 3 * p.width / 5;
  const centerY = p.height / 2;
  const c_height = p.height * 3 / 4; // cylinder height, pixels
  const c_width = 250; // cylinder width, pixels

  p.push();
  p.translate(shift_left, 0);
  if(gvs.piston_mode === "constant-t") {
    p.fill(245, 245, 255);
    p.noStroke();
    p.rect(centerX - c_width / 2 - 30, centerY - c_height / 2, 30, c_height + 50);
    p.rect(centerX + c_width / 2, centerY - c_height / 2, 30, c_height + 50);
    p.rect(centerX - c_width / 2 - 30, centerY + c_height / 2, c_width + 30, 50);
  }

  p.fill(230, 230, 250);
  p.stroke(0);
  p.strokeWeight(1);

  p.ellipse(centerX, centerY + c_height / 2, c_width, 15);
  p.noStroke();
  p.rectMode(p.CENTER);
  p.rect(centerX, centerY, c_width, c_height);

  const rect_height = c_height - (gvs.piston_height * c_height);
  p.fill(250, 250, 250);
  p.rectMode(p.CORNER);
  p.rect(centerX - c_width / 2, centerY - c_height / 2, c_width, rect_height);

  p.stroke(0);
  p.fill(200);
  p.ellipse(centerX, centerY - c_height / 2, c_width, 15);

  p.line(centerX - c_width / 2, centerY - c_height / 2, centerX - c_width / 2, centerY + c_height / 2);
  p.line(centerX + c_width / 2, centerY - c_height / 2, centerX + c_width / 2, centerY + c_height / 2);

  p.pop();
}

function drawPiston(p) {

  const centerX = 3 * p.width / 5;
  const centerY = p.height / 2;
  const c_height = p.height * 3 / 4;
  const c_width = 250;
  let piston_height;
  p.push();
  p.translate(shift_left, 0);
  const mode = gvs.piston_mode;
  switch(mode) {
    case "constant-p":
      piston_height = centerY + c_height / 2 - gvs.piston_height * c_height;
      p.stroke(0);
      p.fill(160);
      p.ellipse(centerX, piston_height, c_width, 15);
      p.noStroke();
      p.rectMode(p.CENTER);
      p.rect(centerX, piston_height - 6, c_width - 1, 12);
      p.stroke(0);
      p.ellipse(centerX, piston_height - 12, c_width, 15);
    break;

    case "constant-v":
      piston_height = centerY + c_height / 2 - gvs.piston_height * c_height;
      p.stroke(0);
      p.fill(160);
      p.ellipse(centerX, piston_height, c_width, 15);
      p.noStroke();
      p.rectMode(p.CENTER);
      p.rect(centerX, piston_height - 6, c_width - 1, 12);
      p.stroke(0);
      p.ellipse(centerX, piston_height - 12, c_width, 15);
      p.fill(230, 230, 230);
      p.rectMode(p.CORNER);
      p.rect(centerX - c_width / 2, piston_height - 36, 24, 24);
      p.rect(centerX + c_width / 2 - 24, piston_height - 36, 24, 24);
    break;

    case "adiabatic-reversible":
      piston_height = centerY + c_height / 2 - gvs.piston_height * c_height;
      p.stroke(0);
      p.fill(160);
      p.ellipse(centerX, piston_height, c_width, 15);
      p.noStroke();
      p.rectMode(p.CENTER);
      p.rect(centerX, piston_height - 6, c_width - 1, 12);
      p.stroke(0);
      p.ellipse(centerX, piston_height - 12, c_width, 15);
      p.rectMode(p.CORNER);
      p.fill(230, 230, 230);
      p.noStroke();
      p.rect(centerX - c_width / 2 - 20, centerY - c_height / 2, 20, c_height);
      p.rect(centerX + c_width / 2, centerY - c_height / 2, 20, c_height);
      p.stroke(0);
      for ( let i = centerY - c_height / 2; i < centerY + c_height / 2 - 20; i += c_height / 30 ) {
        p.line(centerX - c_width / 2 - 20, i, centerX - c_width / 2, i + 20);
        p.line(centerX + c_width / 2, i, centerX + c_width / 2 + 20, i + 20);
      }
    break;

    case "spring":
      p.push();
      p.imageMode(p.CORNERS);
      const spring_height = gvs.spring_length * 1000;
      const block_height = centerY - 100;

      piston_height = block_height + spring_height;
      p.fill(160);
      p.ellipse(centerX, piston_height, c_width, 15);
      p.noStroke();
      p.rectMode(p.CENTER);
      p.rect(centerX, piston_height - 6, c_width - 1, 12);
      p.stroke(0);
      p.ellipse(centerX, piston_height - 12, c_width, 15);

      p.image(gvs.spring_img, centerX - c_width / 2 + 5, block_height, centerX - c_width / 2 + 30, block_height + spring_height - 10);
      p.image(gvs.spring_img, centerX + c_width / 2 - 30, block_height, centerX + c_width / 2 - 5, block_height + spring_height - 10);
      p.fill(220);
      p.stroke(0);
      p.rectMode(p.CORNERS);
      p.rect(centerX - c_width / 2, block_height, centerX - c_width / 2 + 35, block_height - 30);
      p.rect(centerX + c_width / 2, block_height, centerX + c_width / 2 - 35, block_height - 30);


      p.pop();
    break;

    case "constant-t":
      piston_height = centerY + c_height / 2 - gvs.piston_height * c_height;
      p.stroke(0);
      p.fill(160);
      p.ellipse(centerX, piston_height, c_width, 15);
      p.noStroke();
      p.rectMode(p.CENTER);
      p.rect(centerX, piston_height - 6, c_width - 1, 12);
      p.stroke(0);
      p.ellipse(centerX, piston_height - 12, c_width, 15);
      p.rectMode(p.CORNER);
      p.stroke(150);
      p.strokeWeight(1);
      p.line(centerX - c_width / 2 - 30, centerY - c_height / 2, centerX - c_width / 2 - 30, centerY + c_height / 2 + 50);
      p.line(centerX + c_width / 2 + 30, centerY - c_height / 2, centerX + c_width / 2 + 30, centerY + c_height / 2 + 50);
      p.line(centerX - c_width / 2 - 30, centerY + c_height / 2 + 50, centerX + c_width / 2 + 30, centerY + c_height / 2 + 50);
      let i = Math.round( (-gvs.heat_added / 3100) * 10 ); // Number of ice cubes
      if(i > 0) {
        p.image(gvs.ice_cube_img, centerX, centerY + c_height / 2 + 15, 25, 25);
      }
      if(i > 1) {
        p.image(gvs.ice_cube_img, centerX - 30, centerY + c_height / 2 + 15, 25, 25);
      }
      if(i > 2) {
        p.image(gvs.ice_cube_img, centerX + 30, centerY + c_height / 2 + 12, 25, 25);
      }
      if(i > 3) {
        p.image(gvs.ice_cube_img, centerX - 60, centerY + c_height / 2 + 13, 25, 25);
      }
      if(i > 4) {
        p.image(gvs.ice_cube_img, centerX + 60, centerY + c_height / 2 + 18, 25, 25);
      }
      if(i > 5) {
        p.image(gvs.ice_cube_img, centerX - 90, centerY + c_height / 2 + 11, 25, 25);
      }
      if(i > 6) {
        p.image(gvs.ice_cube_img, centerX + 90, centerY + c_height / 2 + 12, 25, 25);
      }
      if(i > 7) {
        p.image(gvs.ice_cube_img, centerX - 120, centerY + c_height / 2 + 14, 25, 25);
      }
      if(i > 8) {
        p.image(gvs.ice_cube_img, centerX + 120, centerY + c_height / 2 + 15, 25, 25);
      }
      if(i > 9) {
        p.image(gvs.ice_cube_img, centerX - 150, centerY + c_height / 2 + 19, 25, 25);
      }
      if(i > 10) {
        p.image(gvs.ice_cube_img, centerX + 150, centerY + c_height / 2 + 11, 25, 25);
      }
    break;
  }

  p.pop();
}

function drawText(p) {
  const centerX = 3 * p.width / 5;
  const centerY = p.height / 2;
  const c_width = 250;
  const c_height = p.height * 3 / 4;
  let Q_color, piston_height;
  const mode = gvs.piston_mode;
  switch(mode) {
    case "constant-p":
      piston_height = centerY + c_height / 2 - gvs.piston_height * c_height;
      p.push();
      p.translate(shift_left, 0);
      p.textSize(22);
      p.textAlign(p.CENTER);
      p.text(`V = ${Number(1000 * gvs.V).toFixed(1)} L`, centerX + 60, centerY + 120);
      p.text(`T = ${Number(gvs.T).toFixed(0)} K`, centerX + 60, centerY + 160);
      p.text(`n = 1.0 mol`, centerX - 60, centerY + 160);
      p.text(`P = 1.0 atm`, centerX - 60, centerY + 120);
      p.text(`P   = 1.0 atm`, centerX, piston_height - 50);
      p.textSize(12);
      p.text(`ext`, centerX - 42, piston_height - 46);
      p.text("total", centerX - c_width / 2 - 140, centerY + 145);
      p.textSize(22);
      p.text(`↓`, centerX, piston_height - 28);
      p.textAlign(p.RIGHT);
      Q_color = p.color(`${100 + 155 * gvs.heat_added / 10000}`, 100, 100);
      p.fill(Q_color);
      p.text(`Q    = ${Number(gvs.heat_added / 1000).toFixed(1)} kJ`, centerX - c_width / 2 - 50, centerY + 140);
      p.stroke(Q_color);
      p.strokeWeight(2);
      p.line(centerX - c_width / 2 - 8, centerY + 132, centerX - c_width / 2 - 44, centerY + 132);
      p.triangle(centerX - c_width / 2 - 8, centerY + 132, centerX - c_width / 2 - 20, centerY + 137, centerX - c_width / 2 - 20, centerY + 127);
      p.pop();
    break;

    case "constant-v":
      p.push();
      p.translate(shift_left, 0);
      p.textSize(22);
      p.textAlign(p.CENTER);
      p.text(`V = ${Number(1000 * gvs.V).toFixed(1)} L`, centerX + 60, centerY + 100);
      p.text(`T = ${Number(gvs.T).toFixed(0)} K`, centerX + 60, centerY + 140);
      p.text(`P = ${(gvs.P / 101325).toFixed(1)} atm`, centerX - 60, centerY + 100);
      p.text(`n = ${Number(gvs.n).toFixed(1)} mol`, centerX - 60, centerY + 140);
      p.textAlign(p.RIGHT);
      Q_color = p.color(`${100 + 155 * gvs.heat_added / 10000}`, 100, 100);
      p.fill(Q_color);
      p.text(`Q    = ${Number(gvs.heat_added / 1000).toFixed(1)} kJ`, centerX - c_width / 2 - 50, centerY + 140);
      p.stroke(Q_color);
      p.strokeWeight(2);
      p.line(centerX - c_width / 2 - 8, centerY + 132, centerX - c_width / 2 - 44, centerY + 132);
      p.triangle(centerX - c_width / 2 - 8, centerY + 132, centerX - c_width / 2 - 20, centerY + 137, centerX - c_width / 2 - 20, centerY + 127);
      p.textSize(12);
      p.noStroke();
      p.text("total", centerX - c_width / 2 - 128, centerY + 145);
      p.pop();
    break;

    case "adiabatic-reversible":
      p.push();
      p.translate(shift_left, 0);
      p.textSize(22);
      p.textAlign(p.CENTER);
      p.text(`V = ${Number(1000 * gvs.V).toFixed(1)} L`, centerX + 60, centerY + 150 * (1.2 - gvs.piston_height));
      p.text(`T = ${Number(gvs.T).toFixed(0)} K`, centerX + 60, centerY + 150 * (1.2 - gvs.piston_height) + 40);
      p.text(`P = ${(gvs.P / 101325).toFixed(1)} atm`, centerX - 60, centerY + 150 * (1.2 - gvs.piston_height));
      p.text(`n = ${Number(gvs.n).toFixed(1)} mol`, centerX - 60, centerY + 150 * (1.2 - gvs.piston_height) + 40);
      p.textAlign(p.LEFT);
      piston_height = centerY + c_height / 2 - gvs.piston_height * c_height;
      p.text(`P   = ${Number(gvs.P / 101325).toFixed(1)} atm`, centerX - 52, piston_height - 49);
      p.textSize(12);
      p.text(`ext`, centerX - 42, piston_height - 45);
      p.text("total", centerX - c_width / 2 - 171, centerY + 145);
      p.textSize(22);
      p.text(`↓`, centerX, piston_height - 28);
      p.textAlign(p.RIGHT);
      Q_color = p.color(`${100 + 155 * gvs.heat_added / 10000}`, 100, 100);
      p.fill(Q_color);
      p.text(`Q    = ${Number(gvs.heat_added / 1000).toFixed(1)} kJ`, centerX - c_width / 2 - 70, centerY + 140);
      p.stroke(Q_color);
      p.strokeWeight(2);
      p.line(centerX - c_width / 2 - 25, centerY + 132, centerX - c_width / 2 - 61, centerY + 132);
      p.triangle(centerX - c_width / 2 - 25, centerY + 132, centerX - c_width / 2 - 37, centerY + 137, centerX - c_width / 2 - 37, centerY + 127);
      p.pop();
    break;

    case "spring":
      p.push();
      p.translate(shift_left, 0);
      p.textSize(22);
      p.textAlign(p.CENTER);
      p.text(`V = ${Number(1000 * gvs.V).toFixed(1)} L`, centerX + 60, centerY + 150 * (1.2 - gvs.piston_height));
      p.text(`T = ${Number(gvs.T).toFixed(0)} K`, centerX + 60, centerY + 150 * (1.2 - gvs.piston_height) + 40);
      p.text(`P = ${(gvs.P / 101325).toFixed(1)} atm`, centerX - 60, centerY + 150 * (1.2 - gvs.piston_height));
      p.text(`n = ${Number(gvs.n).toFixed(1)} mol`, centerX - 60, centerY + 150 * (1.2 - gvs.piston_height) + 40);
      p.textAlign(p.LEFT);
      piston_height = centerY + c_height / 2 - gvs.piston_height * c_height;
      p.text(`P   = 1.0 atm`, centerX - 52, piston_height - 49);
      p.textSize(12);
      p.text(`ext`, centerX - 42, piston_height - 45);
      p.text("total", centerX - c_width / 2 - 150, centerY + 145);
      p.textSize(22);
      p.text(`↓`, centerX, piston_height - 28);
      p.textAlign(p.RIGHT);
      Q_color = p.color(`${100 + 155 * gvs.heat_added / 10000}`, 100, 100);
      p.fill(Q_color);
      p.text(`Q    = ${Number(gvs.heat_added / 1000).toFixed(1)} kJ`, centerX - c_width / 2 - 50, centerY + 140);
      p.stroke(Q_color);
      p.strokeWeight(2);
      p.line(centerX - c_width / 2 - 8, centerY + 132, centerX - c_width / 2 - 44, centerY + 132);
      p.triangle(centerX - c_width / 2 - 8, centerY + 132, centerX - c_width / 2 - 20, centerY + 137, centerX - c_width / 2 - 20, centerY + 127);
      p.pop();
    break;

    case "constant-t":
      p.push();
      p.translate(shift_left, 0);
      p.textSize(22);
      p.textAlign(p.CENTER);
      p.text(`V = ${Number(1000 * gvs.V).toFixed(1)} L`, centerX + 60, centerY + 150 * (1.2 - gvs.piston_height));
      p.text(`T = ${Number(gvs.T).toFixed(0)} K`, centerX + 60, centerY + 150 * (1.2 - gvs.piston_height) + 40);
      p.text(`P = ${(gvs.P / 101325).toFixed(1)} atm`, centerX - 60, centerY + 150 * (1.2 - gvs.piston_height));
      p.text(`n = ${Number(gvs.n).toFixed(1)} mol`, centerX - 60, centerY + 150 * (1.2 - gvs.piston_height) + 40);
      p.textAlign(p.LEFT);
      piston_height = centerY + c_height / 2 - gvs.piston_height * c_height;
      p.text(`P   = ${Number(gvs.P / 101325).toFixed(1)} atm`, centerX - 52, piston_height - 49);
      p.textSize(12);
      p.text(`ext`, centerX - 42, piston_height - 45);
      p.text("total", centerX - c_width / 2 - 164, centerY + 145);
      p.textSize(22);
      p.text(`↓`, centerX, piston_height - 28);
      p.textAlign(p.RIGHT);
      Q_color = p.color(100, 100, 100 + 155 * gvs.P / 800000);
      p.fill(Q_color);
      p.text(`Q    = ${Number(gvs.heat_added / 1000).toFixed(1)} kJ`, centerX - c_width / 2 - 64, centerY + 140);
      p.stroke(Q_color);
      p.strokeWeight(2);
      p.line(centerX - c_width / 2 - 13, centerY + 132, centerX - c_width / 2 - 54, centerY + 132);
      p.triangle(centerX - c_width / 2 - 54, centerY + 132, centerX - c_width / 2 - 42, centerY + 137, centerX - c_width / 2 - 42, centerY + 127);
      p.pop();
    break;
  }

}

function drawBarGraph(p) {
    const bar_graph_height = 350;
    p.push();
    p.stroke(0);
    p.strokeWeight(1);
    p.noFill();
    p.line(580, 100, 580, 100 + bar_graph_height);
    p.line(580, 450, 860, 100 + bar_graph_height);
    p.rectMode(p.CORNER);

    switch(gvs.piston_mode) {
      case "constant-p":
        p.fill(100, 254, 100);
        p.rect(610, 450, 55, -0.4 * bar_graph_height );
        p.fill(255, 100, 100);
        p.rect(695, 450, 55, - 0.4 * bar_graph_height * (gvs.T / 273) );
        p.fill(100, 100, 255);
        p.rect(780, 450, 55, - 0.4 * bar_graph_height * (gvs.V / 0.0224) );
      break;

      case "constant-v":
        p.fill(100, 254, 100);
        p.rect(610, 450, 55, -0.35 * bar_graph_height * gvs.P / 101325);
        p.fill(255, 100, 100);
        p.rect(695, 450, 55, - 0.35 * bar_graph_height * (gvs.T / 273) );
        p.fill(100, 100, 255);
        p.rect(780, 450, 55, - 0.35 * bar_graph_height );
      break;

      case "adiabatic-reversible":
        p.fill(100, 254, 100);
        p.rect(610, 450, 55, -0.1 * bar_graph_height * gvs.P / 101325);
        p.fill(255, 100, 100);
        p.rect(695, 450, 55, - 0.35 * bar_graph_height * (gvs.T / 273) );
        p.fill(100, 100, 255);
        p.rect(780, 450, 55, - 0.35 * bar_graph_height * (gvs.V / 0.0224) );
      break;

      case "spring":
        p.fill(100, 254, 100);
        p.rect(610, 450, 55, -0.35 * bar_graph_height * gvs.P / 101325);
        p.fill(255, 100, 100);
        p.rect(695, 450, 55, - 0.35 * bar_graph_height * (gvs.T / 273) );
        p.fill(100, 100, 255);
        p.rect(780, 450, 55, - 0.35 * bar_graph_height * (gvs.V / 0.0320) );
      break;

      case "constant-t":
        p.fill(100, 254, 100);
        p.rect(610, 450, 55, -0.2 * bar_graph_height * gvs.P / 101325);
        p.fill(255, 100, 100);
        p.rect(695, 450, 55, - 0.35 * bar_graph_height * (gvs.T / 273) );
        p.fill(100, 100, 255);
        p.rect(780, 450, 55, - 0.35 * bar_graph_height * (gvs.V / 0.0224) );
      break;
    }
    p.textSize(22);
    p.fill(0);
    p.noStroke();
    p.fill(50, 155, 50);
    p.text("P", 630, 475);
    p.fill(255, 100, 100);
    p.text("T", 715, 475);
    p.fill(100, 100, 255);
    p.text("V", 800, 475);
    p.fill(0);
    p.text("Relative values", 645, 80);
    p.pop();
}

module.exports = function drawAll(p) {
  drawCylinder(p);
  drawPiston(p);
  drawText(p);
  drawBarGraph(p);
}