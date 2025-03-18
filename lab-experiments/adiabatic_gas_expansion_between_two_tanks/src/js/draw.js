function drawZoomText() {
  push();
  translate(2, height - 10);
  noStroke();
  fill(0);
  textSize(3);
  textAlign(LEFT, CENTER);
  text("Zoom using the scroll wheel, and drag the mouse to move the image", 0, -15, 29, 50);
  pop();
}

function drawLeftTank() {
  const x = state.leftTank.xCoord;
  const y = state.leftTank.yCoord;
  const width = state.leftTank.width;
  const height = state.leftTank.height;
  drawTank(x, y, width, height, state.leftTank);
  drawThermometer(62, 100, 4, state.leftTank.temperature, "°C");
}

function drawRightTank() {
  const x = state.rightTank.xCoord;
  const y = state.rightTank.yCoord;
  const width = state.rightTank.width;
  const height = state.rightTank.height;
  drawTank(x, y, width, height, state.rightTank);
  drawThermometer(90, 100, 4, state.rightTank.temperature, "°C");
}

function drawTank(x, y, width, height, tank) {
  push();
  drawRegulator(x + width / 2, y, 5, tank);
  const tankColor = "rgb(190, 190, 190)";
  const tankOutline = "rgb(100, 100, 100)";
  fill(tankColor);
  stroke(tankOutline);
  strokeWeight(0.1);
  rect(x, y, width, height, width / 2, width / 2, width / 10, width / 10);
  pop();
}

function drawRegulator(x, y, size, tank) {
  push();
  translate(x, y);
  const knobColor = "rgb(215, 215, 215)";
  const knobOutline = "rgb(180, 180, 180)";
  const metalColor = "rgb(230, 230, 230)";
  const metalOutline = "gray";
  push();
  fill(metalColor);
  stroke(metalOutline);
  strokeWeight(0.1);
  translate(0, -size);
  rectMode(CENTER);
  if (tank === state.rightTank) {
    rect(-size * 1.1, 0, size * 2, size / 3, size / 10);
    fill(240);
    rect(-size / 3.5, 0, size / 6, size / 2, size / 20);
    rect(size / 1.2, 0, size, size / 8);
    rect(size * 1.4, -size / 4, size / 16, size / 2, size / 40);
    rect(size * 1.4, 0, size / 6, size / 6, size / 40);
    rect(size / 3.5, 0, size / 6, size / 2, size / 20);
  } else {
    rect(size * 1.1, 0, size * 2, size / 3, size / 10);
    fill(240);
    rect(-size / 1.2, 0, size, size / 8);
    rect(-size * 1.4, -size / 4, size / 16, size / 2, size / 40);
    rect(-size * 1.4, 0, size / 6, size / 6, size / 40);
    rect(-size / 3.5, 0, size / 6, size / 2, size / 20);
    rect(size / 3.5, 0, size / 6, size / 2, size / 20);
  }
  pop();
  fill(knobColor);
  stroke(knobOutline);
  strokeWeight(0.1);
  const time = tank.valveRotation;
  const yPos = -3 * size / 2 - 1.05 * size / 4;
  const knobHeight = 1.1 * size / 4;
  for (let i = 0; i < 6; i++) {
    const offsetTime = (time + 0.16667 * i) % 1;
    const xPos = 1 * cos(offsetTime * TWO_PI) * size / 2;
    const w = (size / 10) * abs(sin((0.25 - (offsetTime - 0.25) % 0.25) * TWO_PI)) + size / 20;
    if (offsetTime > 0 && offsetTime < 0.5) {
      rect(xPos - w / 2, yPos, size / 3 * w, knobHeight, size / 40);
    }
  }
  fill(metalColor);
  stroke(metalOutline);
  rect(-size / 2, -size / 2, size, size, size / 10, size / 10, size / 10, size / 10);
  rect(-size / 4, -size / 2, size / 2, -size, size / 20);
  tank.knobCoords = [x - size / 2, y - 31 * size / 16, size, size / 2];
  rect(-size / 2, -3 * size / 2, size, -size / 4, size / 20);
  fill(knobColor);
  stroke(knobOutline);
  for (let i = 0; i < 3; i++) {
    const offsetTime = (time + 0.16667 * i + 0.5) % 0.5;
    const xPos = -1 * cos(offsetTime * TWO_PI) * size / 2;
    const w = (size / 10) * abs(sin((0.25 - (offsetTime - 0.25) % 0.25) * TWO_PI)) + size / 20;
    if (offsetTime < 0.5 && offsetTime > 0) {
      rect(xPos - w / 2, yPos, size / 3 * w, knobHeight, size / 40);
    }
  }
  translate(0, -size);
  if (tank === state.rightTank) {
    drawGauge(size * 1.4, -size, size, tank.pressure, 5e6, "MPa", x, y - size);
  } else {
    drawGauge(-size * 1.4, -size, size, tank.pressure, 5e6, "MPa", x, y - size);
  }
  pop();
}

function drawGauge(x, y, diameter, pressure, maxPressure, units, offsetX, offsetY) {
  push();
  translate(x, y);
  const gaugeColor = "rgb(255, 255, 255)";
  const gaugeOutline = "rgb(110, 110, 110)";
  const needleColor = "rgb(255, 0, 0)";
  const needleOutline = "rgb(200, 0, 0)";
  const pressureFraction = pressure / maxPressure;
  fill(gaugeColor);
  stroke(gaugeOutline);
  strokeWeight(0.15);
  circle(0, 0, diameter);
  for (let i = 54; i >= -210; i -= 4.8) {
    i = round(i * 10) / 10;
    const x = diameter * cos(radians(i)) / 2;
    const y = diameter * sin(radians(i)) / 2;
    stroke(0);
    noFill();
    if ((i - 30) % 48 === 0) {
      strokeWeight(0.05);
      line(x / 1.4, y / 1.4, x / 1.12, y / 1.12);
    } else if ((i - 30) % 24 === 0) {
      strokeWeight(0.04);
      line(x / 1.3, y / 1.3, x / 1.12, y / 1.12);
    } else if ((i - 30) % 12 === 0) {
      strokeWeight(0.03);
      line(x / 1.23, y / 1.23, x / 1.12, y / 1.12);
    } else {
      strokeWeight(0.02);
      line(x / 1.2, y / 1.2, x / 1.12, y / 1.12);
    }
    if ((i - 30) % 48 === 0) {
      noStroke();
      fill(0);
      textSize(1);
      textAlign(CENTER, CENTER);
      const textX = diameter / 1.5 * cos(radians(i));
      const textY = diameter / 1.5 * sin(radians(i));
      const ratio = round(10 * (1 + ((i - 30) / 240))) / 10;
      if (units === "MPa") {
        const P = round(ratio * maxPressure / 1e6);
        text(P, textX, textY);
      }
    }
  }
  push();
  textAlign(CENTER, CENTER);
  textSize(0.75);
  fill(0);
  noStroke();
  text(units, 0, diameter / 3);
  pop();
  stroke(needleOutline);
  strokeWeight(0.05);
  fill(needleColor);
  const angle = 240 * pressureFraction - 30;
  rotate(radians(angle));
  line(0, 0, -diameter / 3.2, 0);
  triangle(-diameter / 8, -diameter / 35, -diameter / 8, diameter / 35, -diameter / 3.2, 0);
  noStroke();
  fill(150);
  circle(0, 0, diameter / 15);
  pop();
}

function drawThermometer(x, y, size, temperature, units) {
  push();
  translate(x, y);
  const thermometer_color = color(200);
  const liquid_color = color(255, 100, 100);
  strokeWeight(0.5);
  stroke(thermometer_color);
  fill(thermometer_color);
  beginShape();
  vertex(-size * sqrt(2) / 2, -size * sqrt(2) / 2);
  vertex(-size * sqrt(2) / 2, -size * 13);
  for (let i = 0; i < 180; i += 10) {
    const xCoord = -size * sqrt(2) * cos(radians(i)) / 2;
    const yCoord = -size * 15.5 - size * sqrt(2) / 2 - size * sqrt(2) * sin(radians(i)) / 2;
    vertex(xCoord, yCoord);
  }
  vertex(size * sqrt(2) / 2, -size * 13);
  vertex(size * sqrt(2) / 2, -size * sqrt(2) / 2);
  beginContour();
  vertex(0.42333 * size, -size * sqrt(2) / 2);
  // vertex(-0.42333 * size, -size * 13.0205128);
  for (let i = 180; i >= 0; i -= 10) {
    const xCoord = -0.4324 * size * cos(radians(i));
    const yCoord = -size * 15.7 - size * .42333 - size * .42333 * sin(radians(i));
    vertex(xCoord, yCoord);
  }
  // vertex(0.42333 * size, -size * 13.0205128);
  vertex(-0.42333 * size, -size * sqrt(2) / 2);
  endContour();
  endShape();
  fill(liquid_color);
  stroke(thermometer_color);
  strokeWeight(2);
  circle(0, 0, size * 2);
  fill(liquid_color);
  noStroke();
  rectMode(CORNER);
  rect(-size / 3, 0, 2 * size / 3, -2 * size - ((temperature + 100) / state.maxTemperature) * size * 12);
  fill(0);
  strokeWeight(0.6 / relativeSize());
  textAlign(RIGHT, CENTER);
  textSize(1.9);
  for (let i = 0; i <= 140; i += 1) {
    let line_length;
    if (i % 20 === 0) {
      strokeWeight(0.1);
      line_length = size * 4 / 15;
      noStroke();
      text(-100 + state.maxTemperature * (i / 120), -size * 18 / 15, -2 * size - i * size / 10);
    } else if (i % 10 === 0) {
      strokeWeight(0.1);
      line_length = size / 5;
    } else if (i % 5 === 0) {
      strokeWeight(0.075);
      line_length = size / 7;
    } else {
      strokeWeight(0.05);
      line_length = size / 10;
    }
    stroke(0);
    line(-size * 11.5 / 15, -2 * size - i * size / 10, -size * 11.5 / 15 + line_length, -size * 2 - i * size / 10);
  }
  noStroke();
  textAlign(CENTER, TOP);
  textSize(3);
  text(units, 0, size * 24 / 15);
  pop();
}

function drawConnectingPipe() {
  push();
  translate(width / 2, state.leftTank.yCoord - 5);
  rectMode(CENTER);
  const pipeColor = "rgb(220, 220, 220)";
  const pipeOutline = "rgb(100, 100, 100)";
  const valveBodyColor = "#DDA520";
  const valveBodyOutline = "#885510";
  const valveKnobColor = "rgb(80, 80, 80)";
  const valveKnobOutline = "rgb(50, 50, 50)";
  fill(pipeColor);
  stroke(pipeOutline);
  strokeWeight(0.1);
  const distanceApart = state.rightTank.xCoord - state.leftTank.xCoord;
  rect(0, 0, distanceApart, 0.5);
  rect(-4, 0, 1.5, 1.5);
  rect(4, 0, 1.5, 1.5);
  fill(valveBodyColor);
  stroke(valveBodyOutline);
  strokeWeight(0.05);
  beginShape();
  const vertices = [
    [-3.5, 1.1],
    [-3.5, 1.3],
    [-4, 1.3],
    [-4, -1.3],
    [-3.5, -1.3],
    [-3.5, -1.1],
    [-1, -1.1],
    [-1, -2],
    [-1.5, -2],
    [-1.5, -2.8],
    [1.5, -2.8],
    [1.5, -2],
    [1, -2],
    [1, -1.1],
    [3.5, -1.1],
    [3.5, -1.3],
    [4, -1.3],
    [4, 1.3],
    [3.5, 1.3],
    [3.5, 1.1],
  ]
  vertices.forEach(v => {
    vertex(v[0], v[1]);
  });
  endShape(CLOSE);
  fill(200);
  stroke(120);
  rect(0, -4, 0.5, 2.5);
  fill(valveKnobColor);
  stroke(valveKnobOutline);
  const t = state.valvePosition * 2;
  rect(0, -5.25, 4 * abs(cos(t * TWO_PI)) + 1, 1, 0.25);
  pop();
}

export function drawAll() {
  drawConnectingPipe();
  drawLeftTank();
  drawRightTank();
  drawZoomText();
}