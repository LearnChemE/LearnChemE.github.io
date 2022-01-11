function drawCylinder(p) {

  const centerX = 3 * p.width / 5;
  const centerY = p.height / 2 + 20;
  const c_height = p.height * 3 / 4;
  const c_width = 300;

  p.push();

  p.fill(240, 240, 240);
  p.stroke(0);
  p.strokeWeight(1);

  p.ellipse(centerX, centerY + c_height / 2, c_width, 15);
  p.noStroke();
  p.rectMode(p.CENTER);
  p.rect(centerX, centerY, c_width, c_height);

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
  const c_width = 300;

  p.push();

  const mode = gvs.piston_mode;
  switch(mode) {
    case "constant-p":
      const piston_height = centerY + c_height / 2 - gvs.piston_height * c_height;
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

    break;

    case "adiabatic-reversible":

    break;

    case "spring":

    break;

    case "constant-t":

    break;
  }

  p.pop();
}

module.exports = function drawAll(p) {
  drawCylinder(p);
  drawPiston(p);
}