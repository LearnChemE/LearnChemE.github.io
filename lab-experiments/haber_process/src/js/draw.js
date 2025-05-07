import { calcAll } from "./calcs.js";

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
  // Pressure regulator
  drawPressureRegulator(50.75, -10);
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

function drawPressureRegulator(x, y) {
  push();
  fill(steelColor);
  stroke(0);
  strokeWeight(0.05);
  translate(x, y);
  // Transducer stem
  rect(-1.25, -0.125, 3, 0.25);
  // Top cap
  rect(-0.75, -3, 1.5, 0.5, 0.125);
  // Bottom cap
  rect(-0.75, 2.5, 1.5, 0.5, 0.125);
  // Body
  rect(-0.75, -2.45, 1.5, 4.9, 0.5);
  // Transducer
  rect(1.5, -0.5, 4, 1, 0.375);
  fill(80);
  // Pressure gauge display body
  circle(-2.5, 0, 2.5);
  // Pressure gauge display background
  fill("white");
  circle(-2.5, 0, 2.375);
  // Pressure gauge ticks
  for (let i = 0; i <= 24; i++) {
    const angle = radians(60 - i * 10);
    const xPos = -2.5 + cos(angle) * 1;
    const yPos = sin(angle) * 1;
    const tickLength = i % 4 === 0 ? i % 2 === 0 ? 0.25 : 0.25 - 0.125 / 2 : 0.125;
    const xPos2 = -2.5 + cos(angle) * (1 - tickLength);
    const yPos2 = sin(angle) * (1 - tickLength);
    stroke(0);
    line(xPos, yPos, xPos2, yPos2);
  }
  fill("red");
  const needleAngle = -HALF_PI + state.P * PI / 11;
  push();
  translate(-2.5, 0);
  rotate(needleAngle);
  // Pressure gauge needle
  triangle(-0.125, 0, 0.125, 0, 0, -1);
  pop();
  strokeWeight(0.1);
  stroke(0);
  noFill();
  // Transducer cable
  beginShape();
  vertex(5.5, 0);
  quadraticVertex(9.5, 0, 9.5, 2);
  endShape();
  strokeWeight(0.05);
  fill(80);
  // Regulator cap base
  rect(0.75, 7.25, 1.5, 1.5);
  // Regulator cap cable support tube bottom
  rect(2.75, 6, 0.5, 1);
  // Regulator cap cable support tube right
  rect(3.5, 5.5, 0.5, 0.5);
  // Regulator cap cable support body
  rect(2.5, 5.25, 1, 1, 0.125);
  // Regulator cap body
  rect(2, 6.5, 2, 3, 0.25);
  fill(steelColor);
  // Regulator body
  rect(-1, 6, 2, 4, 0.25);
  strokeWeight(0.1);
  noFill();
  beginShape();
  vertex(4, 5.75);
  vertex(6, 5.75);
  endShape();
  translate(9.75, 5.75);
  fill(240);
  strokeWeight(0.05);
  rectMode(CENTER);
  // Controller body
  rect(0, 0, 8, 8, 0.5);
  fill(100);
  // Controller background
  rect(0, -1, 7.25, 5.25, 0.25);
  fill(20);
  rectMode(CORNER);
  // Pressure value background
  rect(-2.05, -3.375, 5.3, 2.25, 0.125);
  // Pressure setpoint background
  rect(-1.25, -0.875, 4.5, 2, 0.125);
  noStroke();
  fill("white");
  textAlign(RIGHT, CENTER);
  textSize(0.75);
  text("PV", -2.375, -2.25);
  text("SP", -1.5, 0);
  fill("yellow");
  textAlign(CENTER, CENTER);
  textSize(2.25);
  textFont(state.meterFont);
  const P = round(state.P).toFixed(0);
  text(P, 0.875, -2.375);
  textSize(1.75);
  const P_sp = round(state.PSetPoint).toFixed(0);
  text(P_sp, 1, 0.125);
  const hover_coords = [
    [81.5, 83.5],
    [84.75, 86.75],
    [49, 50.75]
  ];
  fill(40);
  if (hover_coords[0][0] < mX && mX < hover_coords[0][1] && hover_coords[2][0] < mY && mY < hover_coords[2][1]) {
    fill(120);
    if (mouseIsPressed && frameCount - state.mouseDownFrame > 30 && (frameCount - state.mouseDownFrame) % 5 === 0 && state.purge_position !== 0) {
      state.PSetPoint = max(1, state.PSetPoint - 1);
      calcAll();
    }
  }
  // Left button
  rect(-2.5, 1.875, 1.75, 1.75, 0.25);
  fill(40);
  if (hover_coords[1][0] < mX && mX < hover_coords[1][1] && hover_coords[2][0] < mY && mY < hover_coords[2][1]) {
    fill(120);
    if (mouseIsPressed && frameCount - state.mouseDownFrame > 30 && (frameCount - state.mouseDownFrame) % 5 === 0 && state.purge_position !== 0) {
      state.PSetPoint = min(state.maxP, state.PSetPoint + 1);
      calcAll();
    }
  }
  // Right button
  rect(0.75, 1.875, 1.75, 1.75, 0.25);
  fill("red");
  // Left triangle
  push();
  translate(-0.4, 1.6);
  scale(0.8);
  beginShape();
  vertex(-2.0, 1.0);
  vertex(-1.0, 1.0);
  vertex(-0.9, 1.1);
  vertex(-1.45, 2.0);
  vertex(-1.55, 2.0);
  vertex(-2.1, 1.1);
  endShape(CLOSE);
  pop();

  push();
  translate(0.45, 4);
  rotate(PI);
  scale(0.8);
  beginShape();
  vertex(-2.0, 1.0);
  vertex(-1.0, 1.0);
  vertex(-0.9, 1.1);
  vertex(-1.45, 2.0);
  vertex(-1.55, 2.0);
  vertex(-2.1, 1.1);
  endShape(CLOSE);
  pop();
  fill(0);
  noStroke();
  textFont("Arial");
  textSize(2);
  text("pressure (bar)", 0, 6);
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
  noStroke();
  let m;
  if (frameCount - chemical.mFrame < 60) {
    fill("red");
    m = chemical.mSetPoint.toFixed(0);
  } else {
    fill("yellow");
    m = chemical.m.toFixed(0);
  }
  text(m, 0, -5.675);
  fill("black");
  textFont("Arial");
  textSize(1.5);
  text("mg / min", 0, 0);
  const hoverColor = "rgb(255, 150, 150)";
  fill("red");
  if (hover_coords[0][0] < mX && mX < hover_coords[0][1] && hover_coords[2][0] < mY && mY < hover_coords[2][1]) {
    fill(hoverColor);
    if (mouseIsPressed && frameCount - state.mouseDownFrame > 30 && (frameCount - state.mouseDownFrame) % 5 === 0 && state.purge_position !== 0) {
      chemical.mSetPoint = max(state.minFlowRate, chemical.mSetPoint - 1);
      chemical.mFrame = frameCount;
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
    if (mouseIsPressed && frameCount - state.mouseDownFrame > 30 && (frameCount - state.mouseDownFrame) % 5 === 0 && state.purge_position !== 0) {
      chemical.mSetPoint = min(state.maxFlowRate, chemical.mSetPoint + 1);
      chemical.mFrame = frameCount;
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
  const knobCoords = [
    [4, 9.5],
    [-8.5, -6]
  ];
  if (mX - x > knobCoords[0][0] && mX - x < knobCoords[0][1] && mY - y > knobCoords[1][0] && mY - y < knobCoords[1][1]) {
    stroke(255, 255, 100);
  }
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

  stroke(100);
  strokeWeight(0.05);

  // const regulatorCoords = [
  //   [10.5, 21],
  //   [-11.5, -0.5]
  // ];

  // if (mX - x > regulatorCoords[0][0] && mX - x < regulatorCoords[0][1] && mY - y > regulatorCoords[1][0] && mY - y < regulatorCoords[1][1]) {
  //   stroke(255, 255, 100);
  //   // strokeWeight(0.1);
  // }

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
  // Regulator right side
  rect(x + w / 2 + 12.375, y - 4, 1.25, -2)
  rect(x + w / 2 + 10, y - 4.5, 3, 1, 0.25);
  rect(x + w / 2 + 12, y - 4.875, 2, 1.75, 0.25, 0.25, 0.25, 0.25);
  const regulatorBodyColor = "rgb(180, 150, 50)";
  fill(regulatorBodyColor);
  // Regulator left side
  rect(x + w / 2 + 4, y - 4.75, 2, 1.5, 0.25);
  // Regulator circle body
  circle(x + w / 2 + 8, y - 4, 5);
  fill(40);
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

function drawReactor() {
  push();
  fill(220);
  stroke(0);
  strokeWeight(0.1);
  // Reactor sand bath body
  rect(55, height - 30, 20, 24, 0, 0, 0.5, 0.5);
  fill(150);
  // Reactor sand bath lid
  rect(55, height - 32, 20, 2, 0.5, 0.5, 0, 0);
  fill(ironColor);
  // Reactor sand bath legs
  quad(56, height - 6, 58, height - 6, 57, height - 2, 55, height - 2);
  quad(74, height - 6, 72, height - 6, 73, height - 2, 75, height - 2);
  rect(64, height - 6, 2, 4);
  // Reactor temperature display
  fill(40);
  stroke(0);
  strokeWeight(0.2);
  // Reactor temperature display screen
  rect(58, height - 25, 10, 5, 0.5);
  noStroke();
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(3.5);
  // Temperature units label
  text("°C", 71, height - 22.25);
  textFont(state.meterFont);
  textSize(4.5);
  fill("yellow");
  const T = round(state.T - 273);
  // Temperature text
  text(T, 63, height - 22.6);

  // Reactor temperature adjustment buttons
  push();
  const hover_coords = [
    [60, 62.5],
    [64, 66.5],
    [102.5, 105]
  ]
  const hoverColor = "rgb(255, 150, 150)";
  fill("red");
  if (hover_coords[0][0] < mX && mX < hover_coords[0][1] && hover_coords[2][0] < mY && mY < hover_coords[2][1]) {
    fill(hoverColor);
    if (mouseIsPressed && frameCount - state.mouseDownFrame > 30 && (frameCount - state.mouseDownFrame) % 3 === 0 && state.purge_position !== 0) {
      state.T = max(state.minT, state.T - 1);
    }
  }
  stroke(0);
  translate(61, 103);
  beginShape();
  vertex(-0.75, -0.75);
  vertex(0.75, -0.75);
  vertex(0.9, -0.6);
  vertex(0.075, 0.75);
  vertex(-0.075, 0.75);
  vertex(-0.9, -0.6);
  endShape(CLOSE);

  translate(4, 0);
  fill("red");
  if (hover_coords[1][0] < mX && mX < hover_coords[1][1] && hover_coords[2][0] < mY && mY < hover_coords[2][1]) {
    fill(hoverColor);
    if (mouseIsPressed && frameCount - state.mouseDownFrame > 30 && (frameCount - state.mouseDownFrame) % 3 === 0 && state.purge_position !== 0) {
      state.T = min(state.maxT, state.T + 1);
    }
  }
  beginShape();
  vertex(-0.75, 0.75);
  vertex(0.75, 0.75);
  vertex(0.9, 0.6);
  vertex(0.075, -0.75);
  vertex(-0.075, -0.75);
  vertex(-0.9, 0.6);
  endShape(CLOSE);
  pop();
  pop();
}

function drawOutletTubes() {
  push();
  fill(steelColor);
  stroke(0);
  strokeWeight(0.05);
  translate(72, height - 32);
  // First vertical reactor outlet tube
  rect(-0.375, 0, 0.75, -10);
  // First horizontal reactor outlet tube
  rect(0.375, -10.75, 35.375, 0.75);
  // Second vertical reactor outlet tube
  rect(35.375, -10, 0.75, 20);
  // Second horizontal reactor outlet tube
  rect(36.125, 10, 14.5, 0.75);
  // Outlet tube to vent
  rect(19.675, -7.5, 0.75, 30);
  // First elbow
  drawTubeElbow(0, -10, 0);
  // Second elbow
  drawTubeElbow(35.75, -10, 90);
  // Third elbow
  drawTubeElbow(35.75, 10.75, 270);
  // Purge Valve
  drawPurgeValve();
  // GC inlet cap
  rect(50.25, 9.75, 0.55, 1.25);
  rect(50.75, 9.625, 0.25, 1.5);
  // Vent label
  fill(0);
  stroke(0);
  strokeWeight(0.2);
  line(20.05, 23.5, 20.05, 30);
  noStroke();
  translate(20.05, 30);
  triangle(0, 1.15, -0.5, -0.5, 0.5, -0.5);
  textAlign(RIGHT);
  textSize(3);
  text("vent", -1.5, -2);
  pop();
}

function drawPurgeValve() {
  push();
  fill(ironColor);
  translate(20, -10.375);
  // "T" part
  beginShape();
  vertex(-3, 0.75);
  vertex(-0.75, 0.75);
  vertex(-0.75, 2.5);
  vertex(0.75, 2.5);
  vertex(0.75, 0.75);
  vertex(3, 0.75);
  vertex(3, -0.75);
  vertex(0.75, -0.75);
  vertex(0.75, -2.5);
  vertex(-0.75, -2.5);
  vertex(-0.75, -0.75);
  vertex(-3, -0.75);
  endShape(CLOSE);
  // Left cap
  rect(-3.5, -1, 0.75, 2);
  // Right cap
  rect(2.75, -1, 0.75, 2);
  // Top cap
  rect(-1, -3, 2, 0.75);
  // Bottom cap
  rect(-1, 2.25, 2, 0.75);

  const knob_coords = [
    [89.5, 94.5],
    [75.5, 80.5]
  ];

  fill(80);
  stroke(0);
  if (knob_coords[0][0] < mX && mX < knob_coords[0][1] && knob_coords[1][0] < mY && mY < knob_coords[1][1]) {
    stroke(255, 255, 100);
    strokeWeight(0.1);
  }
  circle(0, 0, 3);
  fill(60);
  if (state.purge_position === 0) {
    rotate(PI / 2);
  } else if (state.purge_position === 1) {
    rotate(0);
  } else {
    rotate(-PI);
  }
  beginShape();
  vertex(0, 0.75);
  vertex(0.75, 0.25);
  vertex(0.5, -2);
  vertex(0, -2.5);
  vertex(-0.5, -2);
  vertex(-0.75, 0.25);
  endShape(CLOSE);
  pop();
}

function drawHeTank(x, y, w, h, tank) {
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
  rect(x + w / 2 - 1, y - 4.5, -3, 1);
  // Outlet horizontal tube
  rect(x + w / 2 - 4, y - 4.325, -8.5, 0.675);
  // Outlet cap
  rect(x + w / 2 - 4.5, y - 4.625, 0.75, 1.25);
  // Outlet vertical tube
  rect(x + w / 2 - 12.875 + 0.125 / 2, y - 3.625, 0.675, 22);
  // Outlet elbow
  drawTubeElbow(x + w / 2 - 12.5 + 0.125 / 2, y - 3.625, 0);
  push();
  translate(x + w / 2 - 12.5, y + 6);
  // Pressure limiter top pressure fitting
  rect(-0.5, -2.75, 1, 0.25);
  // Pressure limiter bottom pressure fitting
  rect(-0.5, 2.5, 1, 0.25);
  fill(200, 170, 60);
  // Pressure limiter body
  rect(-1.25, -2, 2.5, 4, 0.5);
  fill(ironColor);
  // Pressure limiter top cap
  rect(-0.75, -2.5, 1.5, 0.5);
  // Pressure limiter bottom cap
  rect(-0.75, 2.0, 1.5, 0.5);
  // Pressure limiter knob base
  fill(80);
  quad(0, -1, 0, 1, -2.25, 0.75, -2.25, -0.75);
  // Pressure limiter knob
  rect(-5.5, -1.25, 3.5, 2.5, 0.75);
  fill(40);
  rectMode(CENTER);
  // Pressure limiter knob knurls
  for (let i = 1; i < 6; i++) {
    rect(-3.75, -1.375 + i * ((2.375 - 0.125 / 2) / 5), 2.5, 0.075 * (3 - abs(3 - i)), 0.5);
  }
  // Pressure limiter gauge body
  fill(steelColor);
  circle(0, 0, 3.5);
  fill("white");
  strokeWeight(0.05);
  // Pressure limiter gauge background
  circle(0, 0, 3.25);
  // Pressure limiter gauge ticks
  for (let i = 0; i <= 24; i++) {
    const angle = radians(60 - i * 10);
    const xPos = cos(angle) * 1.5;
    const yPos = sin(angle) * 1.5;
    const tickLength = i % 4 === 0 ? i % 2 === 0 ? 0.325 : 0.25 : 0.125;
    const xPos2 = cos(angle) * (1.5 - tickLength);
    const yPos2 = sin(angle) * (1.5 - tickLength);
    stroke(0);
    line(xPos, yPos, xPos2, yPos2);
  }
  fill("red");
  const needleAngle = -HALF_PI + tank.valvePosition * 5 * PI / 6;
  rotate(needleAngle);
  // Pressure limiter gauge needle
  triangle(-0.125, 0, 0.125, 0, 0, -1.25);
  fill("silver");
  // Pressure limiter gauge needle circle
  circle(0, 0, 0.5);
  pop();
  fill(200);

  // Tank valve knob
  const knobCoords = [
    [4, 9.5],
    [-8.5, -6]
  ];
  if (mX - x > knobCoords[0][0] && mX - x < knobCoords[0][1] && mY - y > knobCoords[1][0] && mY - y < knobCoords[1][1]) {
    stroke(255, 255, 100);
  }
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

  pop();
  push();
  fill(tank.color);
  noStroke();
  // tank label
  textAlign(CENTER, CENTER);
  textSize(5);
  text(tank.label, x + w / 2, y + h / 4);
  pop();
}

// function drawGC() {
//   push();
//   translate(123, height - 23.5);
//   fill(245);
//   strokeWeight(0.05);
//   rect(0, -1, 20, 21.5, 0, 0, 0.25, 0.25);
//   pop();
// }

function drawGC() {
  push();
  translate(132.5, height - 15);
  scale(0.3);
  fill("rgb(230, 230, 220)");
  stroke("rgb(150, 150, 120)");
  strokeWeight(0.1);

  // GC Base
  rect(-40, 0, 80, 40, 0, 0, 2, 2);

  fill("rgb(180, 50, 50)");
  stroke("rgb(200, 0, 0)");

  // Red GC cover
  rect(-40, -40, 80, 40, 2, 2, 0, 0);

  fill("rgb(200, 200, 200)");

  // Screws going around the outside of the top cover
  for (let i = 0; i < 18; i++) {
    if (i < 6) {
      stroke("rgb(150, 150, 150)");
      strokeWeight(0.05);
      circle(-38, 4 - i * 8, 1);
      strokeWeight(0.1);
      stroke(50);
      line(-37.75, 4 - i * 8, -38.25, 4 - i * 8);
      line(-38, 4 - i * 8 - 0.25, -38, 4 - i * 8 + 0.25);
    } else if (i < 12) {
      const j = i - 6;
      stroke("rgb(150, 150, 150)");
      strokeWeight(0.05);
      circle(-30 + j * 12, -38, 1);
      strokeWeight(0.1);
      stroke(50);
      line(-30 + j * 12 - 0.25, -38, -30 + j * 12 + 0.25, -38);
      line(-30 + j * 12, -38 - 0.25, -30 + j * 12, -38 + 0.25);
    } else {
      const j = i - 12;
      stroke("rgb(150, 150, 150)");
      strokeWeight(0.05);
      circle(38, 4 - j * 8, 1);
      strokeWeight(0.1);
      stroke(50);
      line(37.75, 4 - j * 8, 38.25, 4 - j * 8);
      line(38, 4 - j * 8 - 0.25, 38, 4 - j * 8 + 0.25);
    }
  }
  stroke(0);
  strokeWeight(0.1);
  fill(40);

  // Left cover clamp
  beginShape();
  vertex(-20.5, -3);
  vertex(-20, -3.5);
  vertex(-16, -3.5);
  vertex(-15.5, -3);
  vertex(-15.5, 3);
  vertex(-16, 3.5);
  vertex(-20, 3.5);
  vertex(-20.5, 3);
  beginContour();
  vertex(-19.25, -2.25);
  vertex(-19.25, 2.25);
  vertex(-16.75, 2.25);
  vertex(-16.75, -2.25);
  endContour();
  endShape();
  fill("rgb(200, 200, 200)");
  stroke("rgb(50, 50, 50)");
  strokeWeight(0.05);
  rect(-18.75, -2.25, 1.5, 1);
  rect(-18.75, 1.25, 1.5, 1);

  stroke(0);
  strokeWeight(0.1);
  fill(40);

  // Right cover clamp
  beginShape();
  vertex(20.5, -3);
  vertex(20, -3.5);
  vertex(16, -3.5);
  vertex(15.5, -3);
  vertex(15.5, 3);
  vertex(16, 3.5);
  vertex(20, 3.5);
  vertex(20.5, 3);
  beginContour();
  vertex(19.25, -2.25);
  vertex(19.25, 2.25);
  vertex(16.75, 2.25);
  vertex(16.75, -2.25);
  endContour();
  endShape();
  fill("rgb(200, 200, 200)");
  stroke("rgb(50, 50, 50)");
  strokeWeight(0.05);
  rect(17.25, -2.25, 1.5, 1);
  rect(17.25, 1.25, 1.5, 1);

  stroke("rgb(150, 150, 150)");
  strokeWeight(0.2);
  noFill();

  // Left, middle, and right rounded rectangles with the text and indicators inside them
  rect(-38, 7, 14, 31, 1);
  translate(0.5, 0);
  rect(-23, 7, 19.5, 31, 1);
  rect(-2, 7, 14, 31, 1);
  noStroke();
  fill("black");
  textSize(1.25);
  textAlign(CENTER, CENTER);

  // Text inside the rounded rectangles
  text("EPC CONTROLS", -31, 9.5);
  text("DETECTOR PARAMETERS", -13, 9.5);
  text("TEMPERATURES", 5, 9.5);
  textSize(0.75);
  text("LOCAL\nSETPOINT", -35, 13);
  text("TOTAL\nSETPOINT", -35, 16);
  text("STATUS", -35, 19);
  text("ACTUAL", -35, 22);
  textAlign(CENTER, TOP);
  text("C\nA\nR\nR\nI\nE\nR", -32, 24);
  text("H\nY\nD\nR\nO\nG\nE\nN", -29.5, 24);
  text("A\nI\nR", -27, 24);
  text("B\nE\nA\nD\n\nV\nO\nL\nT\nS", -21, 24);
  text("F\nL\nA\nM\nE\n\nI\nG\nN\nI\nT\nE", -18.5, 24);
  text("L\nA\nM\nP\n\nC\nU\nR\nR\nE\nN\nT", -16, 24);
  text("P\nM\nT\n\nV\nO\nL\nT\nS", -13.5, 24);
  text("E\nC\nD\n\nC\nU\nR\nR\nE\nN\nT", -11, 24);
  text("R\nE\nA\nC\nT\nO\nR\n\nT\nE\nM\nP", -8.5, 24);
  text("T\nC\nD\n\nP\nR\nO\nT\nE\nC\nT", -6, 24);
  text("D\nE\nT\nE\nC\nT\nO\nR\n\n1", 0, 24);
  text("D\nE\nT\nE\nC\nT\nO\nR\n\n2", 2.5, 24);
  text("I\nN\nJ\nE\nC\nT\nO\nR", 5, 24);
  text("C\nO\nL\nU\nM\nN\n\nO\nV\nE\nN", 7.5, 24);
  text("O\nV\nE\nN\n\nM\nA\nX", 10, 24);

  fill("rgb(80, 80, 80)");
  stroke(0);
  strokeWeight(0.1);
  randomSeed(125);

  // Indicators inside the rounded rectangles
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 4; j++) {
      if (random() < 0.2) {
        fill("yellow");
      } else {
        fill("rgb(80, 80, 80)");
      }
      circle(-32 + i * 2.5, 13 + j * 3, 0.5)
    }
  }
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 4; j++) {
      if (random() < 0.2) {
        fill("yellow");
      } else {
        fill("rgb(80, 80, 80)");
      }
      circle(-21 + i * 2.5, 13 + j * 3, 0.5)
    }
  }
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 4; j++) {
      if (random() < 0.2) {
        fill("yellow");
      } else {
        fill("rgb(80, 80, 80)");
      }
      circle(i * 2.5, 13 + j * 3, 0.5)
    }
  }

  translate(-0.5, 0);
  noStroke();
  fill("black");
  textSize(1.25);
  textAlign(CENTER, CENTER);

  // Text on the right side of the GC
  text("TEMPERATURE (°C)\nPRESSURE (PSI)", 25, 8);

  textSize(0.75);

  text("TEMPERATURE", 23, 18);
  text("PRESSURE", 23, 23);

  textSize(1.1);

  text("START", 30, 30);

  fill("rgb(220, 220, 220)");
  stroke("rgb(150, 150, 150)");
  strokeWeight(0.05);

  // Temperature/pressure switch
  circle(23, 20.5, 2.5);
  rectMode(CENTER);
  fill("rgb(230, 230, 230)");
  rect(23, 19.75, 0.75, 2, 0.5);

  fill(0);
  stroke(0);
  strokeWeight(0.1);
  rectMode(CORNER);

  // Temperature readout
  rect(20, 10.5, 10, 6);
  fill(40);
  rect(21, 11.5, 8, 4);
  rect(28.5, 25, 3, 3);

  // Power button
  fill("rgb(255, 255, 200)");
  stroke("rgb(200, 200, 200)");
  strokeWeight(0.2);
  rect(28.75, 25.25, 2.5, 2.5);

  noStroke();
  textFont(state.meterFont);
  fill("yellow");
  textSize(4);

  // Temperature text
  text("80", 25, 13.5);
  pop();
}

function drawComputer() {
  push();
  translate(width - 17, height - 70);
  scale(0.5);
  fill(50);
  stroke(0);
  strokeWeight(0.05);

  // Computer screen body
  rect(-25, 0, 50, 40, 1);

  fill(245);

  // Computer screen screen
  rect(-23.5, 1.5, 47, 37, 0.5);

  fill(220);

  // Computer screen legs
  quad(-13, 40, -17, 58, -15, 58, -11, 40);
  quad(13, 40, 17, 58, 15, 58, 11, 40);

  fill(190);

  // Computer keyboard keys
  for (let i = 0; i < 16; i++) {
    const x = -22 + i * (46 - 2) / 16;
    const y = 54;
    rect(x, y, 2, 3);
  }

  fill(200);

  // Computer keyboard body
  rect(-23, 55, 46, 3);

  noFill();
  stroke(0);
  strokeWeight(0.4);

  // Computer cable to the GC
  beginShape();
  vertex(-25, 92);
  quadraticVertex(-35, 92, -36, 62);
  quadraticVertex(-35, 27, -25, 28);
  endShape();

  fill(255);
  strokeWeight(0.1);

  // Graph background
  rect(-19, 10, 38, 25);

  // Graph axes ticks
  for (let i = 0; i < 32; i++) {
    let x = -19;
    const y = 10 + i * 25 / 32;
    let x2 = i % 4 === 0 ? x + 0.5 : i % 2 === 0 ? x + 0.3 : x + 0.2;
    line(x, y, x2, y);
    x = 19;
    x2 = i % 4 === 0 ? x - 0.5 : i % 2 === 0 ? x - 0.3 : x - 0.2;
    line(x, y, x2, y);
  }
  for (let i = 0; i < 48; i++) {
    const x = -19 + i * 38 / 48;
    let y = 35;
    let y2 = i % 4 === 0 ? y - 0.5 : i % 2 === 0 ? y - 0.3 : y - 0.2;
    line(x, y, x, y2);
    y = 10;
    y2 = i % 4 === 0 ? y + 0.5 : i % 2 === 0 ? y + 0.3 : y + 0.2;
    line(x, y, x, y2);
  }

  noFill();
  strokeWeight(0.15);

  // Graph spectrograph
  beginShape();
  vertex(-19, 35 - 4 * 38 / 48);
  vertex(-16, 35 - 4 * 38 / 48);
  if (state.takingSampleTime >= 1 || (state.purgingTime > 0 && state.purgingTime < 1)) {
    for (let i = 0; i < 100; i++) {
      const x = -16 + i * 5 / 50;
      const y = 35 - 4 * 38 / 48 - state.outlet.yH2 * 15 * Math.exp(-0.5 * (PI * (i - 50) / 25) ** 2);
      vertex(x, y);
    }
    for (let i = 0; i < 100; i++) {
      const x = -6 + i * 5 / 50;
      const y = 35 - 4 * 38 / 48 - state.outlet.yN2 * 15 * Math.exp(-0.5 * (PI * (i - 50) / 25) ** 2);
      vertex(x, y);
    }
    for (let i = 0; i < 100; i++) {
      const x = 4 + i * 5 / 50;
      const y = 35 - 4 * 38 / 48 - state.outlet.yNH3 * 15 * Math.exp(-0.5 * (PI * (i - 50) / 25) ** 2);
      vertex(x, y);
    }
  }
  vertex(19, 35 - 4 * 38 / 48);
  endShape();

  fill(0);
  noStroke();
  textSize(4);
  textAlign(LEFT, CENTER);

  // Display the liquid composition after liquid is inject
  if (state.takingSampleTime >= 1) {
    text(`y     = ${(round(100 * state.outlet.yNH3) / 100).toFixed(2)}`, -7.5, 6);
    textSize(2);
    text("NH3", -5.4, 7.1);
  } else if (state.takingSampleTime > 0) {
    text("TAKING SAMPLE ...", -18, 6);
  } else if (state.purgingTime > 0 && state.purgingTime < 1) {
    text("PURGING ...", -11, 6);
  } else {
    text("READY FOR SAMPLE", -20, 6);
  }
  pop();
}

function drawTable() {
  push();
  fill(100);
  stroke(0);
  strokeWeight(0.1);
  rectMode(CENTER);
  rect(width - 17.5, height / 2 + 20.25, 34, 2, 0.5);
  fill("rgb(200, 180, 160)");
  stroke("rgb(180, 160, 120)");
  rectMode(CORNER);
  rect(width - 32, height / 2 + 21.4, 2, 35);
  rect(width - 5, height / 2 + 21.4, 2, 35);
  rect()
  pop();
}

function drawInstructionText() {
  push();
  translate(width - 35, 10);
  fill(0);
  textSize(3);
  textAlign(CENTER, TOP);
  if (state.tanks.he.valvePosition === 0 || (state.tanks.n2.valvePosition === 0 && state.tanks.nh3.valvePosition === 0 && state.tanks.h2.valvePosition === 0)) {
    text("All reactant tanks or the helium tank is closed.\nOpen the helium tank and at least one\nreactant tank to begin taking measurements.", 0, 0);
  } else if (state.tanks.h2.m === 0 && state.tanks.n2.m === 0 && state.tanks.nh3.m === 0) {
    text("No gas is flowing through the reactor.\nSet the mass flow rates using the controllers.", 0, 0);
  } else if (state.purge_position === 2 && (!state.hasAdjustedPressure || !state.hasAdjustedTemperature)) {
    text("Adjust pressure using the pressure controller\nand temperature on the sand bath.", 0, 0);
  } else if (state.purge_position == 2 && state.reaction_time < 1) {
    text("System is reaching equilibrium ... please wait", 0, 0);
  } else if (state.purge_position === 2) {
    text("Ready to take sample. Click the three-way valve\nto take a sample, or adjust reaction conditions\nfor a new trial.", 0, 0);
  } else if (state.purge_position === 0 && state.takingSampleTime >= 1) {
    text("Sample has been taken. Purge the GC\nby clicking the three-way valve when ready.", 0, 0);
  } else if (state.purge_position === 1 && state.purgingTime >= 1) {
    text("GC has been purged. Click the three-way valve\nto set new reaction conditions.", 0, 0);
  }
  pop();
}

export function drawAll() {
  let maxPressure = 0;
  [state.tanks.h2, state.tanks.n2, state.tanks.nh3, state.tanks.he].forEach((tank) => {
    if (tank.isTurningOn) {
      tank.valvePosition = (1, tank.valvePosition + 0.01);
      if (tank.valvePosition >= 1) {
        tank.valvePosition = 1;
        tank.isTurningOn = false;
        state.doCalc = true;
      }
    }
    if (tank.isTurningOff) {
      tank.valvePosition = (0, tank.valvePosition - 0.01);
      if (tank.valvePosition <= 0) {
        tank.valvePosition = 0;
        tank.isTurningOff = false;
        state.doCalc = true;
      }
    }
    if (tank.valvePosition >= 1) {
      tank.m = tank.mSetPoint;
      if (state.doCalc) {
        calcAll();
        state.doCalc = false;
      }
    } else {
      tank.m = 0;
      if (state.doCalc) {
        calcAll();
        state.doCalc = false;
      }
    }
    if (tank.m > 0) {
      maxPressure = tank.valvePosition > 0 ? Math.max(maxPressure || 0, tank.P) : maxPressure;
    }
  });
  if (state.tanks.h2.m > 0 || state.tanks.n2.m > 0 || state.tanks.nh3.m > 0) {
    if (state.purge_position === 0) {
      state.purging = false;
      state.takingSample = true;
    }
  } else {
    state.outlet.yH2 = 0;
    state.outlet.yN2 = 0;
    state.outlet.yNH3 = 0;
  }
  if (state.tanks.he.valvePosition > 0 && state.purge_position === 1) {
    state.purging = true;
    state.takingSample = false;
  }
  if (state.takingSample) {
    state.takingSampleTime = min(1, state.takingSampleTime + 0.005);
    state.purgingTime = 0;
  } else {
    state.takingSampleTime = 0;
  }
  if (state.purging) {
    state.purgingTime = min(1, state.purgingTime + 0.0025);
  }
  state.reaction_time += state.purging ? 1 : state.takingSample ? 1 : 0.002;
  state.reaction_time = min(state.reaction_time, 1);
  state.P = min(state.PSetPoint, maxPressure);
  drawTanks();
  drawHeTank(98, height / 2 - 3, tankWidth, tankHeight, state.tanks.he);
  drawOutletTubes();
  drawReactor();
  drawGC();
  drawComputer();
  drawTable();
  drawInstructionText();
}