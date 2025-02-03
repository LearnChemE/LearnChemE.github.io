function triangleDraw() {
  if (g.gridTruth) {
    gridDraw();
  }

  push();
  noFill();
  strokeWeight(2);
  triangle(g.xtip, g.ytip, g.xtip - g.dx, g.ytip + g.dy, g.xtip + g.dx, g.ytip + g.dy);


  beginShape();
  for (let i = 0; i < 1; i += 0.01) {
    let x = map(i, 0, 1, g.xtip - g.dx, g.xtip + g.dx);
    let y = map(-1.551 * i ** 2 + 1.536 * i, 0, 3 ** (1 / 2) / 2, g.ytip + g.dy, g.ytip);
    vertex(x, y);
  }
  endShape();

  for (let i = 0; i < tie.xLeft.length; i++) {
    let x1 = map(tie.xLeft[i], 0, 1, g.xtip - g.dx, g.xtip + g.dx);
    let x2 = map(tie.xRight[i], 0, 1, g.xtip - g.dx, g.xtip + g.dx);
    let y1 = map(-1.551 * tie.xLeft[i] ** 2 + 1.536 * tie.xLeft[i], 0, 3 ** (1 / 2) / 2, g.ytip + g.dy, g.ytip);
    let y2 = map(-1.551 * tie.xRight[i] ** 2 + 1.536 * tie.xRight[i], 0, 3 ** (1 / 2) / 2, g.ytip + g.dy, g.ytip);
    line(x1, y1, x2, y2);
  }
  pop();

  let labels = ['0.1', '0.2', '0.3', '0.4', '0.5', '0.6', '0.7', '0.8', '0.9'];
  push();
  textSize(25);

  // Solute labels
  fill(0, 0, 255);
  for (let i = 0; i < labels.length; i++) {
    let y = g.ytip + g.dy - g.dy / 10 * (i + 1);
    let x = (y - g.L[1]) / g.L[0];
    line(x, y, x - 20, y);
    push();
    noStroke();
    text(labels[i], x - 60, y + 8);
    if (i == labels.length - 1) {
      text('solute', g.xtip - 35, g.ytip - 10);
    }
    pop();

  }

  // Carrier labels
  fill(0, 100, 0);
  for (let i = 0; i < labels.length; i++) {
    let y1 = g.ytip + g.dy / 10 * (i + 1);
    let x1 = (y1 - g.R[1]) / g.R[0];
    let x2 = x1 + 9;
    let y2 = g.L[0] * x2 + (y1 - g.L[0] * x1);
    line(x1, y1, x2, y2);
    push();
    noStroke();
    translate(x2 + 10, y2);
    rotate(-g.angle);
    text(labels[i], 0, 0);
    pop();
    if (i == labels.length - 1) {
      push();
      noStroke();
      text('carrier', g.xtip + g.dx - 15, g.ytip + g.dy + 20);
      pop();
    }
  }

  // Solvent labels
  fill(255, 0, 0);
  for (let i = 0; i < labels.length; i++) {
    let y1 = g.ytip + g.dy;
    let x1 = g.xtip + g.dx - 2 * g.dx / 10 * (i + 1);
    let x2 = x1 + 9;
    let y2 = g.R[0] * x2 + (y1 - g.R[0] * x1);
    line(x1, y1, x2, y2);
    push();
    noStroke();
    translate(x2 - 6, y2 + 8);
    rotate(g.angle);
    text(labels[i], 0, 0);
    pop();
    if (i == labels.length - 1) {
      push();
      noStroke();
      text('solvent', g.xtip - g.dx - 40, g.ytip + g.dy + 23);
      pop();
    }
  }
  pop();


}

function triangleDataFill() {
  g.angle = 60 * Math.PI / 180;
  g.dx = 500 * Math.cos(g.angle);
  g.dy = 500 * Math.sin(g.angle);

  let m, b;

  // Left edge 
  m = -g.dy / g.dx;
  b = (g.ytip + g.dy) - m * (g.xtip - g.dx);
  g.L = [m, b];

  // Right edge
  m = g.dy / g.dx;
  b = (g.ytip + g.dy) - m * (g.xtip + g.dx);
  g.R = [m, b];
}

function gridDraw() {
  push();
  stroke(0, 25);
  let x1, x2, x3, y1, y2, y3;
  for (let i = 0; i < 19; i++) {
    y1 = g.ytip + g.dy / 20 * (i + 1);
    y2 = y1;
    y3 = g.ytip + g.dy;
    x1 = (y1 - g.L[1]) / g.L[0];
    x2 = (y2 - g.R[1]) / g.R[0];
    x3 = g.xtip + g.dx - 2 * g.dx / 20 * (i + 1);
    line(x1, y1, x2, y2);
    line(x1, y1, x3, y3);
  }
  for (let i = 0; i < 19; i++) {
    y1 = g.ytip + g.dy / 20 * (i + 1);
    y2 = g.ytip + g.dy;

    x1 = (y1 - g.R[1]) / g.R[0];
    x2 = g.xtip - g.dx + 2 * g.dx / 20 * (i + 1);
    line(x1, y1, x2, y2);
  }
  pop();
}

function plotPoints() {

  let xF, yF; // x and y of the feed locations
  let xtemp; // temporary location before accounting for y-height

  yF = map(g.feedMassFracs[0], 0, 1, g.ytip + g.dy, g.ytip);
  xtemp = map(g.feedMassFracs[1], 0, 1, g.xtip + g.dx, g.xtip - g.dx); // x location along the bottom axis
  xF = xtemp - (g.ytip + g.dy - yF) / Math.tan(radians(60)); // Solve for x location with some geometry

  let xS, yS; // x and y locations of the solvent 
  xS = g.xtip - g.dx;
  yS = g.ytip + g.dy;

  let xR, yR; // x and y locations of the raffinate
  yR = map(rFracs.solu, 0, 1, g.ytip + g.dy, g.ytip);
  xtemp = map(rFracs.solv, 0, 1, g.xtip + g.dx, g.xtip - g.dx);
  xR = xtemp - (g.ytip + g.dy - yR) / Math.tan(radians(60));


  switch (g.mix) {
    case 'feed':
      feedCase();
      break;
    case 'solvent':
      solventCase();
      break;
    case 'raffinate':
      raffinateCase();
      break;
  }

  fractionLabel();

  function feedCase() {
    let xtemp = map(g.feedMassFracs[1], 0, 1, g.xtip + g.dx, g.xtip - g.dx);
    let x1, x2, y1;

    // solute representation
    x1 = (yF - g.L[1]) / g.L[0];
    x2 = (yF - g.R[1]) / g.R[0];

    push();
    strokeWeight(2.5);
    stroke(0, 0, 255);
    line(x1, yF, x2, yF);

    // solvent representation
    let m, b;
    m = (g.ytip + g.dy - yF) / (xtemp - xF);
    b = yF - m * xF;
    x1 = (g.L[1] - b) / (m - g.L[0]);
    y1 = g.L[0] * x1 + g.L[1];

    stroke(255, 0, 0);
    line(x1, y1, xtemp, g.ytip + g.dy);

    // carrier representation
    b = yF - g.L[0] * xF;
    x1 = (g.R[1] - b) / (g.L[0] - g.R[0]);
    y1 = g.R[0] * x1 + g.R[1];
    x2 = (g.ytip + g.dy - b) / g.L[0];

    stroke(0, 100, 0);
    line(x1, y1, x2, g.ytip + g.dy);
    pop();


    push();
    fill(255);
    ellipse(xF + 25, yF - 25, 23 * 2);
    noStroke();
    fill(0);
    textStyle(ITALIC);
    textSize(30);
    text('F', xF + 14, yF - 15);
    pop();



  }

  function solventCase() {
    push();
    strokeWeight(2.5);
    stroke(0, 100, 0);
    line(xS, yS, g.xtip, g.ytip);
    stroke(0, 0, 255);
    line(xS, yS, g.xtip + g.dx, g.ytip + g.dy);
    pop();

    push();
    fill(255);
    ellipse(xS - 25, yS - 25, 23 * 2);
    noStroke();
    textStyle(ITALIC);
    textSize(30);
    fill(0);
    text('S', xS - 35, yS - 15);
    pop();
  }

  function raffinateCase() {
    let xtemp = map(rFracs.solv, 0, 1, g.xtip + g.dx, g.xtip - g.dx);

    let x1, x2, y1;

    // solute representation
    x1 = (yR - g.L[1]) / g.L[0];
    x2 = (yR - g.R[1]) / g.R[0];
    push();
    strokeWeight(2.5);
    stroke(0, 0, 255);
    line(x1, yR, x2, yR);

    // solvent representation
    let m, b;
    m = (g.ytip + g.dy - yR) / (xtemp - xR);
    b = yR - m * xR;
    x1 = (g.L[1] - b) / (m - g.L[0]);
    y1 = g.L[0] * x1 + g.L[1];

    stroke(255, 0, 0);
    line(x1, y1, xtemp, g.ytip + g.dy);

    // carrier representation
    b = yR - g.L[0] * xR;
    x1 = (g.R[1] - b) / (g.L[0] - g.R[0]);
    y1 = g.R[0] * x1 + g.R[1];
    x2 = (g.ytip + g.dy - b) / g.L[0];

    stroke(0, 100, 0);
    line(x1, y1, x2, g.ytip + g.dy);
    pop();

    push();
    fill(255);
    ellipse(xR + 25, yR - 25, 23 * 2);
    noStroke();
    fill(0);
    textStyle(ITALIC);
    textSize(27);
    text('R', xR + 10, yR - 17);
    textSize(18);
    textStyle(NORMAL);
    text('N', xR + 28, yR - 12);
    pop();
  }

  function fractionLabel() {
    push();
    strokeWeight(1.5);
    textSize(25);
    rect(100, 75, 170, 110);
    noStroke();
    if (g.mix == 'feed') {
      text('feed mass fractions', 75, 65);
      push();
      fill(0, 0, 255);
      text('solute = ' + g.feedMassFracs[0], 112, 105);
      fill(255, 0, 0);
      text('solvent = ' + g.feedMassFracs[1], 108, 135);
      fill(0, 100, 0);
      text('carrier = ' + g.feedMassFracs[2], 112, 165);
      pop();
    } else if (g.mix == 'solvent') {
      text('solvent mass fractions', 65, 65);
      push();
      fill(0, 0, 255);
      text('solute = 0.00', 112, 105);
      fill(255, 0, 0);
      text('solvent = 1.00', 108, 135);
      fill(0, 100, 0);
      text('carrier = 0.00', 112, 165);
      pop();
    } else {
      text('raffinate mass fractions', 62, 65);
      push();
      fill(0, 0, 255);
      text('solute = 0.03', 112, 105);
      fill(255, 0, 0);
      text('solvent =  0.01', 104, 135);
      fill(0, 100, 0);
      text('carrier = 0.96', 112, 165);
      pop();
    }


    pop();
  }

  push();
  fill(0);
  ellipse(xF, yF, 2 * g.radius);
  fill(255, 0, 0);
  stroke(255, 0, 0);
  ellipse(xS, yS, 2 * g.radius);
  fill(0, 100, 100);
  stroke(0, 100, 100);
  ellipse(xR, yR, 2 * g.radius);
  pop();
}

function mixingPoint() {
  let xF, yF; // x and y of the feed locations
  let xtemp; // temporary location before accounting for y-height

  yF = map(g.feedMassFracs[0], 0, 1, g.ytip + g.dy, g.ytip);
  xtemp = map(g.feedMassFracs[1], 0, 1, g.xtip + g.dx, g.xtip - g.dx); // x location along the bottom axis
  xF = xtemp - (g.ytip + g.dy - yF) / Math.tan(radians(60)); // Solve for x location with some geometry

  let xS, yS; // x and y locations of the solvent 
  xS = g.xtip - g.dx;
  yS = g.ytip + g.dy;

  let xR, yR; // x and y locations of the raffinate
  yR = map(rFracs.solu, 0, 1, g.ytip + g.dy, g.ytip);
  xtemp = map(rFracs.solv, 0, 1, g.xtip + g.dx, g.xtip - g.dx);
  xR = xtemp - (g.ytip + g.dy - yR) / Math.tan(radians(60));

  let mixMassFracs; // manually defining them since they're built in to mathematica
  if (g.feedMassFracs[0] == .53) {
    mixMassFracs = [.21, .62, .17];
  } else if (g.feedMassFracs[0] == .45) {
    mixMassFracs = [.18, .63, .19];
  } else if (g.feedMassFracs[0] == .48) {
    mixMassFracs = [.19, .66, .15];
  }

  let xM, yM; // x and y locations of the mixing point
  yM = map(mixMassFracs[0], 0, 1, g.ytip + g.dy, g.ytip);
  xtemp = map(mixMassFracs[1], 0, 1, g.xtip + g.dx, g.xtip - g.dx);
  xM = xtemp - (g.ytip + g.dy - yM) / Math.tan(radians(60));

  push();
  strokeWeight(2.5);
  line(xS, yS, xF, yF);
  pop();

  flowRates();


  function labels() {
    push();
    fill(255);
    ellipse(xF + 25, yF - 25, 23 * 2);
    noStroke();
    fill(0);
    textStyle(ITALIC);
    textSize(30);
    text('F', xF + 14, yF - 15);
    pop();

    push();
    fill(255);
    ellipse(xS - 25, yS - 25, 23 * 2);
    noStroke();
    textStyle(ITALIC);
    textSize(30);
    fill(0);
    text('S', xS - 35, yS - 15);
    pop();

    push();
    fill(255);
    ellipse(xR + 25, yR - 25, 23 * 2);
    noStroke();
    fill(0);
    textStyle(ITALIC);
    textSize(27);
    text('R', xR + 10, yR - 17);
    textSize(18);
    textStyle(NORMAL);
    text('N', xR + 28, yR - 12);
    pop();

    push();
    fill(255);
    ellipse(xM + 7, yM + 33, 23 * 2);
    noStroke();
    fill(0);
    textStyle(ITALIC);
    textSize(30);
    text('M', xM - 7, yM + 43);
    pop();
  }

  function fractionLabel() {
    push();
    strokeWeight(1.5);
    textSize(25);
    rect(100, 75, 170, 110);
    noStroke();
    text('mixing point mass fractions', 45, 65);
    push();
    fill(0, 0, 255);
    text('solute = ' + mixMassFracs[0], 112, 105);
    fill(255, 0, 0);
    text('solvent = ' + mixMassFracs[1], 108, 135);
    fill(0, 100, 0);
    text('carrier = ' + mixMassFracs[2], 112, 165);
    pop();
    pop();
  }

  function flowRates() {
    let dx, dy, mag;
    let u_hat, u_perp;

    dx = xF - xS;
    dy = yF - yS;

    mag = (dx ** 2 + dy ** 2) ** (1 / 2);
    u_hat = [dx / mag, dy / mag];
    u_perp = [-u_hat[1], u_hat[0]];

    push();
    strokeWeight(2);
    line(xS, yS, xS - 120 * u_perp[0], yS - 120 * u_perp[1]);
    line(xM, yM, xM - 120 * u_perp[0], yM - 120 * u_perp[1]);
    line(xF, yF, xF - 120 * u_perp[0], yF - 120 * u_perp[1]);
    pop();

    let temp1 = -110 * u_perp[0];
    let temp2 = -110 * u_perp[1];
    push();
    strokeWeight(2);
    line(xS + temp1, yS + temp2, xM + temp1, yM + temp2);
    stroke(255, 0, 0);
    line(xM + temp1, yM + temp2, xF + temp1, yF + temp2);
    pop();
    arrow([xS + temp1, yS + temp2], [xM + temp1, yM + temp2], 0, 25, 6);
    arrow([xM + temp1, yM + temp2], [xS + temp1, yS + temp2], 0, 25, 6);
    arrow([xM + temp1, yM + temp2], [xF + temp1, yF + temp2], [255, 0, 0], 25, 6);
    arrow([xF + temp1, yF + temp2], [xM + temp1, yM + temp2], [255, 0, 0], 25, 6);

    push();
    textSize(22);
    translate(xS - 130 * u_perp[0] + 10 * u_hat[0], yS - 130 * u_perp[1] + 10 * u_hat[1]);
    let angle = Math.atan(dy / dx);
    rotate(angle);
    noStroke();
    fill(255);
    rect(-3, -18, 140, 23);
    fill(0);
    text('feed flow rate', 0, 0);
    pop();

    push();
    textSize(22);
    if (g.feedMassFracs[0] == .53) {
      translate(xM - 130 * u_perp[0] + 50 * u_hat[0], yM - 130 * u_perp[1] + 40 * u_hat[1]);
    } else {
      translate(xM - 130 * u_perp[0] + 30 * u_hat[0], yM - 130 * u_perp[1] + 20 * u_hat[1]);
    }

    rotate(angle);
    noStroke();
    fill(255);
    rect(-3, -18, 165, 23);
    fill(0);
    text('solvent flow rate', 0, 0);
    pop();
  }

  fractionLabel();
  labels();

  push();
  fill(0);
  ellipse(xF, yF, 2 * g.radius);
  fill(255, 0, 0);
  stroke(255, 0, 0);
  ellipse(xS, yS, 2 * g.radius);
  fill(0, 100, 100);
  stroke(0, 100, 100);
  ellipse(xR, yR, 2 * g.radius);
  fill(100);
  stroke(100);
  ellipse(xM, yM, 2 * g.radius);
  pop();
}

function determineE1() {
  let xF, yF; // x and y of the feed locations
  let xtemp; // temporary location before accounting for y-height

  yF = map(g.feedMassFracs[0], 0, 1, g.ytip + g.dy, g.ytip);
  xtemp = map(g.feedMassFracs[1], 0, 1, g.xtip + g.dx, g.xtip - g.dx); // x location along the bottom axis
  xF = xtemp - (g.ytip + g.dy - yF) / Math.tan(radians(60)); // Solve for x location with some geometry

  let xS, yS; // x and y locations of the solvent 
  xS = g.xtip - g.dx;
  yS = g.ytip + g.dy;

  let xR, yR; // x and y locations of the raffinate
  yR = map(rFracs.solu, 0, 1, g.ytip + g.dy, g.ytip);
  xtemp = map(rFracs.solv, 0, 1, g.xtip + g.dx, g.xtip - g.dx);
  xR = xtemp - (g.ytip + g.dy - yR) / Math.tan(radians(60));

  let mixMassFracs; // manually defining them since they're built in to mathematica
  if (g.feedMassFracs[0] == .53) {
    mixMassFracs = [.21, .62, .17];
  } else if (g.feedMassFracs[0] == .45) {
    mixMassFracs = [.18, .63, .19];
  } else if (g.feedMassFracs[0] == .48) {
    mixMassFracs = [.19, .66, .15];
  }

  let xM, yM; // x and y locations of the mixing point
  yM = map(mixMassFracs[0], 0, 1, g.ytip + g.dy, g.ytip);
  xtemp = map(mixMassFracs[1], 0, 1, g.xtip + g.dx, g.xtip - g.dx);
  xM = xtemp - (g.ytip + g.dy - yM) / Math.tan(radians(60));

  let e1Fracs; // manually defining these as well since they're built into mathematica
  if (g.feedMassFracs[0] == .53) {
    e1Fracs = [.24, .72, .04];
  } else if (g.feedMassFracs[0] == .45) {
    e1Fracs = [.21, .76, .03];
  } else if (g.feedMassFracs[0] == .48) {
    e1Fracs = [.22, .75, .03];
  }

  let xe1, ye1;
  ye1 = map(e1Fracs[0], 0, 1, g.ytip + g.dy, g.ytip);
  xtemp = map(e1Fracs[1], 0, 1, g.xtip + g.dx, g.xtip - g.dx);
  xe1 = xtemp - (g.ytip + g.dy - ye1) / Math.tan(radians(60));


  labels();
  fractionLabel();

  function labels() {
    push();
    fill(255);
    ellipse(xF + 25, yF - 25, 23 * 2);
    noStroke();
    fill(0);
    textStyle(ITALIC);
    textSize(30);
    text('F', xF + 14, yF - 15);
    pop();

    push();
    fill(255);
    ellipse(xS - 25, yS - 25, 23 * 2);
    noStroke();
    textStyle(ITALIC);
    textSize(30);
    fill(0);
    text('S', xS - 35, yS - 15);
    pop();

    push();
    fill(255);
    ellipse(xR + 25, yR - 25, 23 * 2);
    noStroke();
    fill(0);
    textStyle(ITALIC);
    textSize(27);
    text('R', xR + 10, yR - 17);
    textSize(18);
    textStyle(NORMAL);
    text('N', xR + 28, yR - 12);
    pop();

    push();
    fill(255);
    ellipse(xM + 7, yM + 33, 23 * 2);
    noStroke();
    fill(0);
    textStyle(ITALIC);
    textSize(30);
    text('M', xM - 7, yM + 43);
    pop();

    push();
    fill(255);
    ellipse(xe1 - 25, ye1 - 25, 23 * 2);
    noStroke();
    fill(0);
    textStyle(ITALIC);
    textSize(27);
    text('E', xe1 - 38, ye1 - 16);
    textStyle(NORMAL);
    textSize(18);
    text('1', xe1 - 20, ye1 - 10);
    pop();
  }

  function fractionLabel() {
    push();
    strokeWeight(1.5);
    textSize(25);
    rect(100, 75, 170, 110);
    noStroke();
    text('extract mass fractions', 68, 65);
    push();
    fill(0, 0, 255);
    text('solute = ' + e1Fracs[0], 112, 105);
    fill(255, 0, 0);
    text('solvent = ' + e1Fracs[1], 108, 135);
    fill(0, 100, 0);
    text('carrier = ' + e1Fracs[2], 112, 165);
    pop();
    pop();
  }

  push();
  strokeWeight(2);
  line(xS, yS, xF, yF);
  if (e1Fracs[0] == .24 || e1Fracs[0] == .21) {
    line(xR, yR, xe1, ye1);
  } else {
    line(xR, yR, xe1, ye1 + 2);
  }

  pop();

  push();
  fill(0);
  ellipse(xF, yF, 2 * g.radius);
  fill(255, 0, 0);
  stroke(255, 0, 0);
  ellipse(xS, yS, 2 * g.radius);
  fill(0, 100, 100);
  stroke(0, 100, 100);
  ellipse(xR, yR, 2 * g.radius);
  fill(100);
  stroke(100);
  ellipse(xM, yM, 2 * g.radius);
  fill(255, 100, 51);
  stroke(255, 100, 51);
  ellipse(xe1, ye1, 2 * g.radius);
  pop();
}

function operatingPoint() {
  let xF, yF; // x and y of the feed locations
  let xtemp; // temporary location before accounting for y-height

  yF = map(g.feedMassFracs[0], 0, 1, g.ytip + g.dy, g.ytip);
  xtemp = map(g.feedMassFracs[1], 0, 1, g.xtip + g.dx, g.xtip - g.dx); // x location along the bottom axis
  xF = xtemp - (g.ytip + g.dy - yF) / Math.tan(radians(60)); // Solve for x location with some geometry

  let xS, yS; // x and y locations of the solvent 
  xS = g.xtip - g.dx;
  yS = g.ytip + g.dy;

  let xR, yR; // x and y locations of the raffinate
  yR = map(rFracs.solu, 0, 1, g.ytip + g.dy, g.ytip);
  xtemp = map(rFracs.solv, 0, 1, g.xtip + g.dx, g.xtip - g.dx);
  xR = xtemp - (g.ytip + g.dy - yR) / Math.tan(radians(60));

  let mixMassFracs; // manually defining them since they're built in to mathematica
  if (g.feedMassFracs[0] == .53) {
    mixMassFracs = [.21, .62, .17];
  } else if (g.feedMassFracs[0] == .45) {
    mixMassFracs = [.18, .63, .19];
  } else if (g.feedMassFracs[0] == .48) {
    mixMassFracs = [.19, .66, .15];
  }

  let xM, yM; // x and y locations of the mixing point
  yM = map(mixMassFracs[0], 0, 1, g.ytip + g.dy, g.ytip);
  xtemp = map(mixMassFracs[1], 0, 1, g.xtip + g.dx, g.xtip - g.dx);
  xM = xtemp - (g.ytip + g.dy - yM) / Math.tan(radians(60));

  let e1Fracs; // manually defining these as well since they're built into mathematica
  if (g.feedMassFracs[0] == .53) {
    e1Fracs = [.24, .72, .04];
  } else if (g.feedMassFracs[0] == .45) {
    e1Fracs = [.21, .76, .03];
  } else if (g.feedMassFracs[0] == .48) {
    e1Fracs = [.22, .75, .03];
  }

  let xe1, ye1;
  ye1 = map(e1Fracs[0], 0, 1, g.ytip + g.dy, g.ytip);
  xtemp = map(e1Fracs[1], 0, 1, g.xtip + g.dx, g.xtip - g.dx);
  xe1 = xtemp - (g.ytip + g.dy - ye1) / Math.tan(radians(60));


  let m1, m2;
  let b1, b2;

  m1 = (yF - ye1) / (xF - xe1); // slope of line through feed and extract 1
  m2 = (yR - yS) / (xR - xS); // slope of line through Rn and S

  b1 = yF - m1 * xF; // b shift through feed and extract 1
  b2 = yR - m2 * xR; // b shift through Rn and S

  let xP, yP;
  xP = (b2 - b1) / (m1 - m2); // x solution for where the lines connect
  yP = m1 * xP + b1; // y location at that point

  labels();
  upperRightImage();

  function labels() {
    push();
    fill(255);
    ellipse(xF + 25, yF - 25, 23 * 2);
    noStroke();
    fill(0);
    textStyle(ITALIC);
    textSize(30);
    text('F', xF + 14, yF - 15);
    pop();

    push();
    fill(255);
    ellipse(xS - 25, yS - 25, 23 * 2);
    noStroke();
    textStyle(ITALIC);
    textSize(30);
    fill(0);
    text('S', xS - 35, yS - 15);
    pop();

    push();
    fill(255);
    ellipse(xR + 25, yR - 25, 23 * 2);
    noStroke();
    fill(0);
    textStyle(ITALIC);
    textSize(27);
    text('R', xR + 10, yR - 17);
    textSize(18);
    textStyle(NORMAL);
    text('N', xR + 28, yR - 12);
    pop();

    push();
    fill(255);
    ellipse(xM + 7, yM + 33, 23 * 2);
    noStroke();
    fill(0);
    textStyle(ITALIC);
    textSize(30);
    text('M', xM - 7, yM + 43);
    pop();

    push();
    fill(255);
    ellipse(xe1 - 25, ye1 - 25, 23 * 2);
    noStroke();
    fill(0);
    textStyle(ITALIC);
    textSize(27);
    text('E', xe1 - 38, ye1 - 16);
    textStyle(NORMAL);
    textSize(18);
    text('1', xe1 - 20, ye1 - 10);
    pop();

    push();
    fill(255);
    ellipse(xP - 25, yP - 25, 23 * 2);
    noStroke();
    fill(0);
    textStyle(ITALIC);
    textSize(30);
    text('P', xP - 34, yP - 14);
    pop();
  }

  function upperRightImage() {
    // Rectangles and label
    push();
    strokeWeight(2);
    for (let i = 0; i < 3; i++) {
      rect(80 + 80 * i, 50, 40, 80);
    }
    noStroke();
    textSize(25);
    text('1', 93, 100);
    text('n', 173, 100);
    text('N', 251, 100);
    pop();

    // Squiggly bit
    push();
    strokeWeight(2);
    noFill();
    for (let i = 0; i < 2; i++) {
      beginShape();
      for (let j = 0; j < squiggle.length; j++) {
        let x = squiggle[j][0] - 10 + 80 * i;
        let y = squiggle[j][1] + 20;
        curveVertex(x, y);
      }
      endShape();
    }
    pop();

    // lines and arrows
    push();
    strokeWeight(2);
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 4; j++) {
        line(40 + 80 * j, 70 + 40 * i, 80 + 80 * j, 70 + 40 * i);
        if (i == 0) {
          arrow([80 + 80 * j, 70 + 40 * i], [40 + 80 * j, 70 + 40 * i], [0, 0, 0], 15, 4);
        } else {
          arrow([40 + 80 * j, 70 + 40 * i], [80 + 80 * j, 70 + 40 * i], [0, 0, 0], 15, 4);
        }
      }
    }
    pop();

    // Labels on arrows
    push();
    textSize(25);
    noStroke();
    textStyle(ITALIC);
    text('E', 13, 77);
    text('F', 15, 117);
    text('S', 320, 79);
    text('R', 320, 118);
    textStyle(NORMAL);
    textSize(18);
    text('1', 27, 83);
    text('N', 337, 124);
    pop();


    // Equation
    push();
    textStyle(ITALIC);
    textSize(25);
    text('P = E  - F = R  - S', 80, 175);
    textStyle(NORMAL);
    textSize(18);
    text('1', 142, 182);
    text('N', 232, 182);
    pop();
  }

  push();
  strokeWeight(2);
  stroke(112, 41, 99);
  drawingContext.setLineDash([5, 5]);
  line(xP, yP, xF, yF);
  line(xP, yP, xR, yR);
  pop();

  push();
  fill(0);
  ellipse(xF, yF, 2 * g.radius);
  fill(255, 0, 0);
  stroke(255, 0, 0);
  ellipse(xS, yS, 2 * g.radius);
  fill(0, 100, 100);
  stroke(0, 100, 100);
  ellipse(xR, yR, 2 * g.radius);
  fill(255, 100, 51);
  stroke(255, 100, 51);
  ellipse(xe1, ye1, 2 * g.radius);
  fill(112, 41, 99);
  stroke(112, 41, 99);
  ellipse(xP, yP, 2 * g.radius);
  pop();
}

function countStages() {

  let xF, yF; // x and y of the feed locations
  let xtemp; // temporary location before accounting for y-height

  yF = map(g.feedMassFracs[0], 0, 1, g.ytip + g.dy, g.ytip);
  xtemp = map(g.feedMassFracs[1], 0, 1, g.xtip + g.dx, g.xtip - g.dx); // x location along the bottom axis
  xF = xtemp - (g.ytip + g.dy - yF) / Math.tan(radians(60)); // Solve for x location with some geometry

  let xS, yS; // x and y locations of the solvent 
  xS = g.xtip - g.dx;
  yS = g.ytip + g.dy;

  let xR, yR; // x and y locations of the raffinate
  yR = map(rFracs.solu, 0, 1, g.ytip + g.dy, g.ytip);
  xtemp = map(rFracs.solv, 0, 1, g.xtip + g.dx, g.xtip - g.dx);
  xR = xtemp - (g.ytip + g.dy - yR) / Math.tan(radians(60));

  let mixMassFracs; // manually defining them since they're built in to mathematica
  if (g.feedMassFracs[0] == .53) {
    mixMassFracs = [.21, .62, .17];
  } else if (g.feedMassFracs[0] == .45) {
    mixMassFracs = [.18, .63, .19];
  } else if (g.feedMassFracs[0] == .48) {
    mixMassFracs = [.19, .66, .15];
  }

  let xM, yM; // x and y locations of the mixing point
  yM = map(mixMassFracs[0], 0, 1, g.ytip + g.dy, g.ytip);
  xtemp = map(mixMassFracs[1], 0, 1, g.xtip + g.dx, g.xtip - g.dx);
  xM = xtemp - (g.ytip + g.dy - yM) / Math.tan(radians(60));

  let e1Fracs; // manually defining these as well since they're built into mathematica
  if (g.feedMassFracs[0] == .53) {
    e1Fracs = [.24, .72, .04];
  } else if (g.feedMassFracs[0] == .45) {
    e1Fracs = [.21, .76, .03];
  } else if (g.feedMassFracs[0] == .48) {
    e1Fracs = [.22, .75, .03];
  }

  let xe1, ye1;
  ye1 = map(e1Fracs[0], 0, 1, g.ytip + g.dy, g.ytip);
  xtemp = map(e1Fracs[1], 0, 1, g.xtip + g.dx, g.xtip - g.dx);
  xe1 = xtemp - (g.ytip + g.dy - ye1) / Math.tan(radians(60));


  let m1, m2;
  let b1, b2;

  m1 = (yF - ye1) / (xF - xe1); // slope of line through feed and extract 1
  m2 = (yR - yS) / (xR - xS); // slope of line through Rn and S

  b1 = yF - m1 * xF; // b shift through feed and extract 1
  b2 = yR - m2 * xR; // b shift through Rn and S

  let xP, yP;
  xP = (b2 - b1) / (m1 - m2); // x solution for where the lines connect
  yP = m1 * xP + b1; // y location at that point


  let ePoints = [];
  let rPoints = [];

  // Stop at R4
  ePoints.push([xe1, ye1]); // E1
  rPoints.push(nextRaffinate(ePoints[0])); // R1

  ePoints.push(nextExtract(rPoints[0], [xP, yP])); // E2
  rPoints.push(nextRaffinate(ePoints[1])); // R2

  ePoints.push(nextExtract(rPoints[1], [xP, yP])); // E3
  rPoints.push(nextRaffinate(ePoints[2])); // R3

  if (g.feedMassFracs[0] != .48) {
    ePoints.push(nextExtract(rPoints[2], [xP, yP])); // E4
    rPoints.push(nextRaffinate(ePoints[3])); // R4
  }



  let test = false;
  let stages;
  let counter = 0;

  while (!test) {
    if (g.feedMassFracs[0] != .48) {
      if (rPoints[counter][0] > xR || counter == 3) {
        stages = counter;
        test = true;
      }
      counter++;
    } else {
      if (rPoints[counter][0] > xR || counter == 2) {
        stages = counter;
        test = true;
      }
      counter++;
    }

  }
  stages = stages + 1;
  labels();
  push();
  fill(0);
  ellipse(xF, yF, 2 * g.radius);
  pop();
  drawEquilibLines(ePoints, rPoints, stages);

  upperRightImage();

  function upperRightImage() {
    push();
    strokeWeight(2);

    // Rectangles and text
    for (let i = 0; i < 4; i++) {
      push();
      noFill();
      rect(80 + 70 * i, 30, 35, 70);
      textSize(25);
      fill(0);
      text(i + 1, 90 + 70 * i, 73);
      pop();
    }

    // Lines, arrows, and labels
    push();
    textSize(20);
    textStyle(ITALIC);
    for (let j = 0; j < 2; j++) {
      for (let i = 0; i < 5; i++) {
        if (j == 0) {
          line(45 + 70 * i, 45, 80 + 70 * i, 45);
          arrow([80 + 70 * i, 45], [45 + 70 * i, 45], [0, 0, 0], 14, 4);
          if (i != 4) {
            text('E', 55 + 70 * i, 33);
            push();
            textStyle(NORMAL);
            textSize(15);
            text(i + 1, 68 + 70 * i, 37);
            pop();
          } else {
            text('S', 55 + 70 * i, 35);
          }

        } else {
          line(45 + 70 * i, 85, 80 + 70 * i, 85);
          arrow([45 + 70 * i, 85], [80 + 70 * i, 85], [0, 0, 0], 14, 4);
          if (i == 0) {
            text('F', 55 + 70 * i, 110);
          } else {
            text('R', 55 + 70 * i, 110);
            push();
            textStyle(NORMAL);
            textSize(15);
            text(i, 69 + 70 * i, 115);
            pop();
          }
        }
      }
    }
    pop();
    pop();
    push();
    textSize(25);
    text('number of orange lines = ', 40, 145);
    text('number of stages needed', 40, 170);
    pop();
  }

  function labels() {
    push();
    fill(255);
    ellipse(xF + 25, yF - 25, 23 * 2);
    noStroke();
    fill(0);
    textStyle(ITALIC);
    textSize(30);
    text('F', xF + 14, yF - 15);
    pop();

    push();
    fill(255);
    ellipse(xS - 25, yS - 25, 23 * 2);
    noStroke();
    textStyle(ITALIC);
    textSize(30);
    fill(0);
    text('S', xS - 35, yS - 15);
    pop();

    push();
    fill(255);
    ellipse(xR + 25, yR - 25, 23 * 2);
    noStroke();
    fill(0);
    textStyle(ITALIC);
    textSize(27);
    text('R', xR + 10, yR - 17);
    textSize(18);
    textStyle(NORMAL);
    text('N', xR + 28, yR - 12);
    pop();

    push();
    fill(255);
    ellipse(xe1 - 25, ye1 - 25, 23 * 2);
    noStroke();
    fill(0);
    textStyle(ITALIC);
    textSize(27);
    text('E', xe1 - 38, ye1 - 16);
    textStyle(NORMAL);
    textSize(18);
    text('1', xe1 - 20, ye1 - 10);
    pop();

    push();
    fill(255);
    ellipse(xP - 25, yP - 25, 23 * 2);
    noStroke();
    fill(0);
    textStyle(ITALIC);
    textSize(30);
    text('P', xP - 34, yP - 14);
    pop();
  }


  function drawEquilibLines(ex, raf, stages) {
    if (g.tieSlider <= stages) {
      for (let i = 0; i < g.tieSlider; i++) {
        push();
        strokeWeight(2);
        stroke(255, 100, 51);
        line(ex[i][0], ex[i][1], raf[i][0], raf[i][1]);
        noStroke();
        fill(0, 100, 190);
        ellipse(raf[i][0], raf[i][1], 2 * g.radius);
        pop();
        if (g.tieSlider == 1) {
          push();
          fill(255);
          stroke(0);
          strokeWeight(1.5);
          ellipse(raf[i][0] + 25, raf[i][1] - 25, 23 * 2);
          textStyle(ITALIC);
          noStroke();
          fill(0);
          textSize(25);
          text('R', raf[i][0] + 11, raf[i][1] - 17);
          textStyle(NORMAL);
          textSize(18);
          text('1', raf[i][0] + 28, raf[i][1] - 12);
          pop();

          push();
          noStroke();
          fill(255, 100, 51);
          rect(80 + 70 * i, 30, 35, 70);
          pop();
        } else if (i > 0 && i == g.tieSlider - 1) {
          push();
          stroke(0, 100, 190);
          strokeWeight(2);
          drawingContext.setLineDash([5, 5]);
          line(raf[i - 1][0], raf[i - 1][1], xP, yP);
          pop();

          push();
          fill(255);
          stroke(0);
          strokeWeight(1.5);
          ellipse(raf[i][0] + 25, raf[i][1] - 25, 23 * 2);
          ellipse(ex[i][0] - 25, ex[i][1] - 25, 23 * 2);
          textStyle(ITALIC);
          noStroke();
          fill(0);
          textSize(27);
          text('R', raf[i][0] + 11, raf[i][1] - 17);
          text('E', ex[i][0] - 38, ex[i][1] - 18);
          textStyle(NORMAL);
          textSize(18);
          text(i + 1, raf[i][0] + 30, raf[i][1] - 10);
          text(i + 1, ex[i][0] - 21, ex[i][1] - 12);
          pop();

          push();
          noStroke();
          fill(255, 100, 51);
          for (let j = i; j >= 0; j--) {
            rect(80 + 70 * j, 30, 35, 70);
          }
          pop();
        }
        push();
        fill(255, 100, 51);
        noStroke();
        ellipse(ex[i][0], ex[i][1], 2 * g.radius);
        pop();
      }
      push();
      textSize(25);
      noStroke();
      text(g.tieSlider + ' equilibrium stages drawn', 20, 225);
      pop();
    } else {
      for (let i = 0; i < stages; i++) {
        push();
        strokeWeight(2);
        stroke(255, 100, 51);
        line(ex[i][0], ex[i][1], raf[i][0], raf[i][1]);
        noStroke();
        fill(0, 100, 190);
        ellipse(raf[i][0], raf[i][1], 2 * g.radius);
        fill(255, 100, 51);
        ellipse(ex[i][0], ex[i][1], 2 * g.radius);
        pop();

        push();
        noStroke();
        fill(255, 100, 51);
        rect(80 + 70 * i, 30, 35, 70);
        pop();
      }
      push();
      textSize(25);
      text(stages + ' equilibrium stages drawn', 20, 225);
      pop();
    }
  }

  push();
  fill(255, 0, 0);
  stroke(255, 0, 0);
  ellipse(xS, yS, 2 * g.radius);
  fill(0, 100, 100);
  stroke(0, 100, 100);
  ellipse(xR, yR, 2 * g.radius);
  fill(255, 100, 51);
  stroke(255, 100, 51);
  ellipse(xe1, ye1, 2 * g.radius);
  fill(112, 41, 99);
  stroke(112, 41, 99);
  ellipse(xP, yP, 2 * g.radius);
  pop();
}

function arrow(base, tip, color, arrowLength, arrowWidth) {

  // let arrowLength = 20; // Length of arrow
  // let arrowWidth = 5; // width of arrow (1/2)
  let dx, dy, mag;
  let u_hat, u_perp;
  let point = new Array(2); // Point along unit vector that is base of triangle
  let vert = new Array(6); // Holds vertices of arrow

  // Need to define a unit vector
  dx = tip[0] - base[0];
  dy = tip[1] - base[1];
  mag = (dx ** 2 + dy ** 2) ** (1 / 2);
  u_hat = [dx / mag, dy / mag];

  vert[0] = tip[0] - 2 * u_hat[0]; // Shifts the arrow back some to keep the tip from going out too far
  vert[1] = tip[1] - 2 * u_hat[1];

  // Perpendicular unit vector
  u_perp = [-u_hat[1], u_hat[0]];

  // Base of arrow
  point[0] = vert[0] + -arrowLength * u_hat[0];
  point[1] = vert[1] + -arrowLength * u_hat[1];

  vert[2] = point[0] + u_perp[0] * arrowWidth;
  vert[3] = point[1] + u_perp[1] * arrowWidth;

  vert[4] = point[0] + -u_perp[0] * arrowWidth;
  vert[5] = point[1] + -u_perp[1] * arrowWidth;

  push();
  stroke(color);
  fill(color);
  triangle(vert[0], vert[1], vert[2], vert[3], vert[4], vert[5]);
  pop();

}

function nextExtract(r, op) {
  // Line from raffinate point to operating point
  // Find intersection of that line with phase envelope to get next extract point

  let x1, x2, y1, y2;
  let m1, b1, m2, b2;

  x1 = op[0];
  y1 = op[1];
  x2 = r[0];
  y2 = r[1];

  m1 = (y2 - y1) / (x2 - x1);
  b1 = y1 - m1 * x1;

  let yL, yU, yC, yUU;
  let xe, ye;

  for (let i = 0; i < 50; i++) {
    yL = tie.pix[i][1];
    yU = tie.pix[i + 1][1];
    yC = m1 * tie.pix[i][0] + b1;
    yUU = tie.pix[i + 2][1];
    if (yC <= yL && yC >= yU) {
      m2 = (yL - yU) / (tie.pix[i][0] - tie.pix[i + 1][0]);
      b2 = yL - m2 * tie.pix[i][0];
      xe = (b2 - b1) / (m1 - m2);
      ye = m1 * xe + b1;
    } else if (yC <= yU && yC > yUU) {
      xe = tie.pix[i + 1][0];
      ye = tie.pix[i + 1][1];
    }
  }
  return ([xe, ye]);
}

function nextRaffinate(e) {
  let yVals = new Array(6);
  for (let i = 0; i < tie.m.length; i++) {
    yVals[i] = tie.m[i] * e[0] + tie.b[i];
  }


  let dY, dC, mx, xR, yR, bx;
  for (let i = 0; i < tie.m.length - 1; i++) {
    if (e[1] < yVals[i] && e[1] > yVals[i + 1]) {
      dY = yVals[i] - yVals[i + 1];
      dC = yVals[i] - e[1];

      mx = tie.m[i] * (1 - dC / dY) + tie.m[i + 1] * (dC / dY);
      bx = e[1] - mx * e[0];

      xR = tie.pos[i][1] * (1 - dC / dY) + tie.pos[i + 1][1] * (dC / dY);
      yR = mx * xR + bx;

    } else if (e[1] == g.ytip + g.dy) {
      xR = map(.99, 0, 1, g.xtip - g.dx, g.xtip + g.dx);
      yR = g.ytip + g.dy;
    }
  }


  return ([xR, yR]);
}

// Gets m and b values of the tie lines and generates pixel array for the phase locations
function phaseInfo() {
  for (let i = 0; i < 1; i += 0.01) {
    let x = map(i, 0, 1, g.xtip - g.dx, g.xtip + g.dx);
    let y = map(-1.551 * i ** 2 + 1.536 * i, 0, 3 ** (1 / 2) / 2, g.ytip + g.dy, g.ytip);
    tie.pix.push([x, y]);
  }

  for (let i = 0; i < tie.xLeft.length; i++) {
    let x1 = map(tie.xLeft[i], 0, 1, g.xtip - g.dx, g.xtip + g.dx);
    let x2 = map(tie.xRight[i], 0, 1, g.xtip - g.dx, g.xtip + g.dx);
    let y1 = map(-1.551 * tie.xLeft[i] ** 2 + 1.536 * tie.xLeft[i], 0, 3 ** (1 / 2) / 2, g.ytip + g.dy, g.ytip);
    let y2 = map(-1.551 * tie.xRight[i] ** 2 + 1.536 * tie.xRight[i], 0, 3 ** (1 / 2) / 2, g.ytip + g.dy, g.ytip);

    let m = (y2 - y1) / (x2 - x1);
    let b = y1 - m * x1;
    tie.m.push(m);
    tie.b.push(b);
    tie.pos.push([x1, x2, y1, y2]);
  }

  let x1 = g.xtip - g.dx;
  let x2 = map(.99, 0, 1, g.xtip - g.dx, g.xtip + g.dx);

  tie.m.splice(0, 0, 0);
  tie.b.splice(0, 0, g.ytip + g.dy);
  tie.pos.splice(0, 0, [x1, x2, g.ytip + g.dy, g.ytip + g.dy]);

}