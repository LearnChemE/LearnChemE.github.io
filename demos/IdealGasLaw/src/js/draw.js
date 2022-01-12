function drawCylinder(p) {

  const centerX = 3 * p.width / 5;
  const centerY = p.height / 2 + 20;
  const c_height = p.height * 3 / 4; // cylinder height, pixels
  const c_width = 250; // cylinder width, pixels

  p.push();

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
  const centerY = p.height / 2 + 20;
  const c_height = p.height * 3 / 4;
  const c_width = 250;
  let piston_height;
  p.push();

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

    break;
  }

  p.pop();
}

function drawText(p) {
  const centerX = 3 * p.width / 5;
  const centerY = p.height / 2 + 20;
  const c_width = 250;
  const c_height = p.height * 3 / 4;
  let Q_color, piston_height;
  const mode = gvs.piston_mode;
  switch(mode) {
    case "constant-p":
      p.push();
      p.textSize(22);
      p.textAlign(p.CENTER);
      p.text(`V = ${Number(1000 * gvs.V).toFixed(1)} L`, centerX + 60, centerY + 120);
      p.text(`T = ${Number(gvs.T).toFixed(0)} K`, centerX + 60, centerY + 160);
      p.text(`n = 1.0 mol`, centerX - 60, centerY + 160);
      p.text(`P = 1 atm`, centerX - 60, centerY + 120);
      p.text(`P   = 1 atm`, centerX, centerY - 250);
      p.textSize(12);
      p.text(`ext`, centerX - 35, centerY - 246);
      p.textSize(22);
      p.text(`↓`, centerX, centerY - 223);
      p.textAlign(p.RIGHT);
      Q_color = p.color(`${255 * gvs.heat_added / 10000}`, 100, 100);
      p.fill(Q_color);
      p.text(`🔥 Q = ${Number(gvs.heat_added / 1000).toFixed(1)} kJ ⟶`, centerX - c_width / 2 - 20, centerY + 140);
      p.pop();
    break;

    case "constant-v":
      p.push();
      p.textSize(22);
      p.textAlign(p.CENTER);
      p.text(`V = ${Number(1000 * gvs.V).toFixed(1)} L`, centerX + 60, centerY + 100);
      p.text(`T = ${Number(gvs.T).toFixed(0)} K`, centerX + 60, centerY + 140);
      p.text(`P = ${(gvs.P / 101325).toFixed(1)} atm`, centerX - 60, centerY + 100);
      p.text(`n = ${Number(gvs.n).toFixed(1)} mol`, centerX - 60, centerY + 140);
      p.textAlign(p.RIGHT);
      Q_color = p.color(`${255 * gvs.heat_added / 10000}`, 100, 100);
      p.fill(Q_color);
      p.text(`🔥 Q = ${Number(gvs.heat_added / 1000).toFixed(1)} kJ ⟶`, centerX - c_width / 2 - 20, centerY + 140);
      p.pop();
    break;

    case "adiabatic-reversible":
      p.push();
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
      p.textSize(22);
      p.text(`↓`, centerX, piston_height - 28);
      p.textAlign(p.RIGHT);
      Q_color = p.color(`${255 * gvs.heat_added / 10000}`, 100, 100);
      p.fill(Q_color);
      p.text(`🔥 Q = ${Number(gvs.heat_added / 1000).toFixed(1)} kJ ⟶`, centerX - c_width / 2 - 30, centerY + 140);
      p.pop();
    break;

    case "spring":
      p.push();
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
      p.textSize(22);
      p.text(`↓`, centerX, piston_height - 28);
      p.textAlign(p.RIGHT);
      Q_color = p.color(`${255 * gvs.heat_added / 10000}`, 100, 100);
      p.fill(Q_color);
      p.text(`🔥 Q = ${Number(gvs.heat_added / 1000).toFixed(1)} kJ ⟶`, centerX - c_width / 2 - 30, centerY + 140);
      p.pop();
    break;

    case "constant-t":

    break;
  }

}

module.exports = function drawAll(p) {
  drawCylinder(p);
  drawPiston(p);
  drawText(p);
}