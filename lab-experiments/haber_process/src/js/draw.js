const tankHeight = 60;
const tankWidth = 13;
const steelColor = "rgb(220, 220, 220)";
const ironColor = "rgb(180, 180, 180)";

function drawTanks() {
  push();
  drawTankTubes();
  drawTank(4, height / 2 - 3, tankWidth, tankHeight, state.tanks.h2);
  drawTank(21, height / 2 - 3, tankWidth, tankHeight, state.tanks.n2);
  drawTank(38, height / 2 - 3, tankWidth, tankHeight, state.tanks.nh3);
  pop();
}

function drawTankTubes() {
  push();
  stroke(0);
  strokeWeight(0.05);
  fill(steelColor);
  translate(4 + tankWidth / 2 + 13, height / 2 - 3 - 6);
  // H2 tank vertical left tube
  rect(-0.375, 0, 0.75, -40);
  // H2 tank horizontal top tube
  rect(0.375, -40.75, 50, 0.75);
  // Right-side vertical top tube
  rect(50.375, -40, 0.75, 50);
  // Right-side horizontal tube
  rect(50.375, 10, -15, 0.75);
  // Right-side vertical bottom tube
  rect(34.625, 10.75, 0.75, 30);
  // N2 tank vertical tube
  rect(16.625, 0, 0.75, -30);
  // N2 tank horizontal tube
  rect(17.375, -30.75, 33, 0.75);
  // NH3 tank vertical tube
  rect(33.625, 0, 0.75, -20);
  // NH3 tank horizontal tube
  rect(34.375, -20.75, 16, 0.75);
  drawTubeElbow(0, -40, 0);
  drawTubeElbow(50.75, -40, 90);
  drawTubeElbow(50.75, 10.75, 180);
  drawTubeElbow(35, 10.75, 0);
  drawTubeElbow(17, -30, 0);
  drawTubeElbow(34, -20, 0);
  drawTJunction(50, -30, 0);
  drawTJunction(50, -20, 0);
  drawMassFlowMeter(41, -40.325, state.tanks.h2, [
    [62, 64.5],
    [65, 67.5],
    [7.9, 9.2]
  ]);
  drawMassFlowMeter(41, -30.325, state.tanks.n2, [
    [62, 64.5],
    [65, 67.5],
    [17.9, 19.2]
  ]);
  drawMassFlowMeter(41, -20.325, state.tanks.nh3, [
    [62, 64.5],
    [65, 67.5],
    [27.9, 29.2]
  ]);
  pop();
}

function drawMassFlowMeter(x, y, chemical, hover_coords) {
  push();
  fill(ironColor);
  stroke(0);
  strokeWeight(0.05);
  translate(x, y);
  rect(-3.5, -1.25, 7, 2.5, 0, 0, 0.25, 0.25);
  fill(100);
  rect(-3.5, -1.25, 7, -7, 0, 0, 0.25, 0.25);
  fill(20);
  rect(-3, -7.125, 6, 3);
  textFont(state.meterFont);
  textSize(3);
  textAlign(CENTER, CENTER);
  fill("yellow");
  noStroke();
  const m = chemical.m.toFixed(0);
  text(m, 0, -5.675);
  fill("black");
  textFont("Arial");
  textSize(1.5);
  text("mg / min", 0, 0);
  const hoverColor = "rgb(255, 150, 150)";
  fill("red");
  if (hover_coords[0][0] < mX && mX < hover_coords[0][1] && hover_coords[2][0] < mY && mY < hover_coords[2][1]) {
    fill(hoverColor);
    if (mouseIsPressed && frameCount - state.mouseDownFrame > 30 && (frameCount - state.mouseDownFrame) % 5 === 0 && chemical.valvePosition === 1) {
      chemical.m = max(state.minFlowRate, chemical.m - 1);
    }
  }
  stroke(0);
  scale(1.2);
  translate(0.25, 0.325);
  beginShape();
  vertex(-2.0, -3);
  vertex(-1.0, -3);
  vertex(-0.9, -2.9);
  vertex(-1.45, -2);
  vertex(-1.55, -2);
  vertex(-2.1, -2.9);
  endShape(CLOSE);

  translate(-0.5, 0);
  fill("red");
  if (hover_coords[1][0] < mX && mX < hover_coords[1][1] && hover_coords[2][0] < mY && mY < hover_coords[2][1]) {
    fill(hoverColor);
    if (mouseIsPressed && frameCount - state.mouseDownFrame > 30 && (frameCount - state.mouseDownFrame) % 5 === 0 && chemical.valvePosition === 1) {
      chemical.m = min(state.maxFlowRate, chemical.m + 1);
    }
  }
  beginShape();
  vertex(2.0, -2.0);
  vertex(1.0, -2.0);
  vertex(0.9, -2.1);
  vertex(1.45, -3);
  vertex(1.55, -3);
  vertex(2.1, -2.1);
  endShape(CLOSE);
  pop();
}

function drawTJunction(x, y, rotation) {
  push();
  translate(x + 0.75, y - 0.375);
  rotate(radians(rotation));
  beginShape();
  vertex(-0.5, -0.5);
  vertex(0.5, -0.5);
  vertex(0.5, 0.5);
  vertex(-0.5, 0.5);
  endShape(CLOSE);
  pop();
}

function drawTubeElbow(x, y, rotation) {
  push();
  translate(x, y - 0.375);
  rotate(radians(rotation));
  rect(-0.5, 0.5, 1, 0.5);
  rect(0.5, -0.5, 0.5, 1);
  beginShape();
  vertex(-0.4, 0.5);
  vertex(-0.4, -0.2);
  vertex(-0.2, -0.4);
  vertex(0.5, -0.4);
  vertex(0.5, 0.4);
  endShape();
  pop();
}

function drawTank(x, y, w, h, tank) {
  push();
  fill(ironColor);
  stroke(0);
  strokeWeight(0.1);
  // Tank body
  rect(x, y, w, h, w / 2, w / 2, w / 10, w / 10);

  fill(steelColor);
  strokeWeight(0.05);
  // Tank valve base
  rect(x + w / 2 - 2.5, y - 1.5, 5, 2, 0.25);
  // Tank valve stem
  rect(x + w / 2 - 1, y - 1.5, 2, -6);
  // Tank valve outlet
  rect(x + w / 2 + 1, y - 4.5, 3, 1);

  fill(200);

  // Tank valve knob
  const time = tank.valvePosition;
  for (let i = 0; i < 3; i++) {
    const offsetTime = (time + 0.16667 * i + 0.5) % 0.5;
    const xPos = 1 * cos(offsetTime * TWO_PI) * 2.25;
    const wid = (0.55) * abs(sin((0.25 - (offsetTime - 0.25) % 0.25) * TWO_PI)) + 0.225;
    if (offsetTime < 0.5 && offsetTime > 0) {
      rect(x + xPos + w / 2 - wid / 2 - 0.125, y - 8.675, 5.5 / 3 * wid, 1.875, 0.25);
    }
  }
  fill(steelColor);
  rect(x + w / 2 - 2.5, y - 8.5, 5, 1.5, 0.5);
  fill(200);
  for (let i = 0; i < 6; i++) {
    const offsetTime = (time + 0.16667 * i) % 1;
    const xPos = -1 * cos(offsetTime * TWO_PI) * 2.25;
    const wid = (0.55) * abs(sin((0.25 - (offsetTime - 0.25) % 0.25) * TWO_PI)) + 0.225;
    if (offsetTime > 0 && offsetTime < 0.5) {
      rect(x + xPos + w / 2 - wid / 2 - 0.125, y - 8.675, 5.5 / 3 * wid, 1.875, 0.25);
    }
  }

  fill(steelColor);
  stroke(0);

  push();
  translate(x + w / 2 + 8, y - 4);
  push();
  rotate(-PI / 8);
  rect(-0.5, 0, 1, -5);
  translate(0, -6);
  circle(0, 0, 4);
  fill("white");
  circle(0, 0, 3.5);
  for (let i = 0; i <= 24; i++) {
    const angle = radians(60 - i * 10);
    const xPos = cos(angle) * 1.5;
    const yPos = sin(angle) * 1.5;
    const tickLength = i % 4 === 0 ? i % 2 === 0 ? 0.25 : 0.125 : 0.1;
    const xPos2 = cos(angle) * (1.5 - tickLength);
    const yPos2 = sin(angle) * (1.5 - tickLength);
    strokeWeight(0.075);
    stroke(0);
    line(xPos, yPos, xPos2, yPos2);
  }
  let needleAngle = 60 - 240 * (1 - tank.valvePosition);
  rotate(radians(needleAngle));
  line(0, 0, 1, 0);
  pop();

  push();
  rotate(PI / 8);
  rect(-0.5, 0, 1, -5);
  translate(0, -6);
  circle(0, 0, 4);
  fill("white");
  circle(0, 0, 3.5);
  rotate(-PI / 4);
  for (let i = 0; i <= 24; i++) {
    const angle = radians(60 - i * 10);
    const xPos = cos(angle) * 1.5;
    const yPos = sin(angle) * 1.5;
    const tickLength = i % 4 === 0 ? i % 2 === 0 ? 0.25 : 0.125 : 0.1;
    const xPos2 = cos(angle) * (1.5 - tickLength);
    const yPos2 = sin(angle) * (1.5 - tickLength);
    strokeWeight(0.075);
    stroke(0);
    line(xPos, yPos, xPos2, yPos2);
  }
  needleAngle = min(needleAngle, 60 - 240 * (1 - tank.P / state.tanks.maxP));
  rotate(radians(needleAngle));
  line(0, 0, 1, 0);
  pop();

  pop();
  fill(200, 170, 60);
  stroke(100);
  // Regulator right side
  rect(x + w / 2 + 12.375, y - 4, 1.25, -2)
  rect(x + w / 2 + 10, y - 4.5, 3, 1, 0.25);
  rect(x + w / 2 + 12, y - 4.875, 2, 1.75, 0.25, 0.25, 0.25, 0.25);
  const regulatorBodyColor = "rgb(180, 150, 50)";
  const regulatorOutlineColor = "rgb(100, 100, 100)";
  fill(regulatorBodyColor);
  stroke(regulatorOutlineColor);
  // Regulator left side
  rect(x + w / 2 + 4, y - 4.75, 2, 1.5, 0.25);
  // Regulator circle body
  circle(x + w / 2 + 8, y - 4, 5);
  fill(40);
  stroke(0);
  push();
  translate(x + w / 2 + 8, y - 4);
  // Regulator knob
  beginShape();
  for (let i = 0; i < 360; i++) {
    const angle = radians(i);
    let x = 2 * cos(angle);
    let y = 2 * sin(angle);
    if (i % 60 < 45 && i % 60 > 15) {
      x -= 0.175 * cos(angle);
      y -= 0.175 * sin(angle);
    }
    vertex(x, y);
  }
  endShape(CLOSE);
  fill(240);
  // Regulator sticker
  circle(0, 0, 2.5);
  pop();
  pop();
  push();
  fill(tank.color);
  noStroke();
  strokeWeight(0.05);
  // tank label
  textAlign(RIGHT, CENTER);
  textSize(5);
  if (tank.label1 !== "NH") {
    translate(-w / 8, 0);
  }
  text(tank.label1, x + w / 1.5 + 0.5, y + h / 3);
  textAlign(LEFT, CENTER);
  textSize(3);
  text(tank.label2, x + w / 1.5 + 0.75, y + h / 3 + 2);
  pop();
}

export function drawAll() {
  [state.tanks.h2, state.tanks.n2, state.tanks.nh3].forEach((tank) => {
    if (tank.isTurningOn) {
      tank.valvePosition = (1, tank.valvePosition + 0.01);
      if (tank.valvePosition >= 1) {
        tank.valvePosition = 1;
        tank.isTurningOn = false;
      }
    }
    if (tank.isTurningOff) {
      tank.valvePosition = (0, tank.valvePosition - 0.01);
      if (tank.valvePosition <= 0) {
        tank.valvePosition = 0;
        tank.isTurningOff = false;
      }
    }
  });
  drawTanks();
}