function drawPump(x, y, scaleX, scaleY) {
  push();
  translate(x, y);
  scale(scaleX, scaleY);
  const pumpColor = "rgb(180, 180, 255)";
  const pumpStroke = "rgb(140, 140, 225)";
  fill(pumpColor);
  stroke(pumpStroke);
  strokeWeight(0.15);
  let vertices = [
    [-2, -4],
    [-3, -4],
    [-3, 4],
    [-2, 4],
    [-2, 3.5],
    [4, 3.5],
    [7, 5],
    [7, 6],
    [8, 6],
    [8, -6],
    [7, -6],
    [7, -5],
    [4, -3.5],
    [-2, -3.5],
  ]
  beginShape();
  vertices.forEach(coord => vertex(coord[0], coord[1]))
  endShape(CLOSE);
  line(-2, -4, -2, 4);
  line(7, -6, 7, 6);
  strokeWeight(0.4);
  line(4, -2, 7, -3);
  line(-2, 0, 7, 0);
  line(4, 2, 7, 3);
  strokeWeight(0.15);
  fill("rgb(160, 160, 245)");
  vertices = [
    [15, 5],
    [12, 8],
    [14, 8],
    [17, 5],
  ];

  beginShape();
  vertices.forEach(coord => vertex(coord[0], coord[1]));
  endShape(CLOSE);

  vertices = [
    [28, 5],
    [31, 8],
    [29, 8],
    [26, 5],
  ];

  beginShape();
  vertices.forEach(coord => vertex(coord[0], coord[1]));
  endShape(CLOSE);

  fill(pumpColor);
  vertices = [
    [8, 6],
    [9, 6],
    [9, 4],
    [10, 4],
    [14, 5.75],
    [15, 6],
    [30, 6],
    [30.5, 5.5],
    [30.5, -5.5],
    [30, -6],
    [15, -6],
    [14, -5.75],
    [10, -4],
    [9, -4],
    [9, -6],
    [8, -6],
  ]
  beginShape();
  vertices.forEach(coord => vertex(coord[0], coord[1]));
  endShape(CLOSE);
  line(9, 6, 9, -6);
  strokeWeight(0.1);
  fill("rgb(200, 200, 255)");
  stroke("rgb(100, 100, 190)");
  rectMode(CENTER);
  for (let i = 0; i < 13; i++) {
    rect(22.5, -6 + i, 10, 0.25 + abs(i - 6) * 0.075);
  }
  stroke(pumpStroke);
  strokeWeight(0.4);
  line(9, -3, 11, -3);
  line(9, 0, 11, 0);
  line(9, 3, 11, 3);

  strokeWeight(0.15);
  fill("rgb(160, 160, 245)");
  rectMode(CORNER);
  rect(-2, 8, 34, 2, 0.25);

  fill("rgb(170, 170, 250)");
  rect(-0.5, -8, 3.5, 13, 0, 0, 2, 2);
  stroke("rgb(170, 170, 250)");
  line(-0.5, -8, 3, -8);

  vertices = [
    [-0.5, -8],
    [-2, -10],
    [4.5, -10],
    [3, -8],
  ]

  stroke(pumpStroke);

  beginShape();
  vertices.forEach(coord => vertex(coord[0], coord[1]));
  endShape();

  rect(-3.5, -11, 9.5, 1);

  const cableColor = "rgb(40, 40, 40)";

  noFill();
  stroke(cableColor);
  strokeWeight(0.3);

  beginShape();
  vertex(30.5, 0);
  quadraticVertex(33, 0, 35, 2);
  quadraticVertex(40, 8, 35, 15);
  quadraticVertex(31, 20, 20, 18);
  endShape();

  strokeWeight(0.1);
  const mX = mouseX / relativeSize();
  const mY = mouseY / relativeSize();
  if (mX > 16.5 + x - 7.5 && mX < 16.5 + x + 7.5 && mY > 31 + y - 5 && mY < 31 + y + 2.75) {
    stroke("rgb(140, 140, 40)");
    strokeWeight(0.2);
  } else {
    stroke("rgb(20, 20, 20)");
  }
  push();
  fill("rgb(80, 80, 80)");
  translate(16.5, 18.75);
  if (state.pump.on) {
    rotate(-12 * PI / 32);
  } else {
    rotate(-20 * PI / 32);
  }
  rect(-1, -1, 7.5, 2, 0.5);
  pop();
  fill("rgb(60, 60, 60)");
  rectMode(CENTER, CENTER);
  rect(16.5, 16, 8, 1.5, 0.5);
  rect(16.5, 18.75, 13, 5.5, 1);
  stroke("rgb(150, 150, 150)");
  strokeWeight(0.05);
  fill("white");
  textSize(2.5);
  textAlign(CENTER, CENTER);
  text("off    on", 16.5, 18.75);
  pop();
}

function drawInletPipe() {
  push();
  translate(state.pump.x, state.pump.y);
  stroke("rgb(40, 40, 40)");
  strokeWeight(0.1);
  fill("rgb(200, 200, 200)");
  rect(-20, -2, 20, 4);
  rect(-3.25, -3.25, 0.75, 6.5);
  strokeWeight(0.05);
  for (let i = 0; i < 4; i++) {
    rect(-3.75, -2.75 + i * (27 / 16), 0.5);
  }
  strokeWeight(0.1);
  rect(-1, -9.375, 4, -8);
  rect(-2.8725, -9.375, 7.75, 0.5);
  strokeWeight(0.05);
  for (let i = 0; i < 4; i++) {
    rect(-1.8725 + i * (33 / 16), -9.375, -0.5);
  }
  strokeWeight(0.1);
  beginShape();
  for (let i = 0; i <= 90; i += 10) {
    const x = 3 - 4 * cos(radians(i));
    const y = -17.5 - 5 * sin(radians(i));
    vertex(x, y);
  }
  vertex(5, -22.5);
  vertex(5, -18.5);
  vertex(4, -18.5);
  for (let i = 90; i >= 0; i -= 10) {
    const x = 4 - cos(radians(i));
    const y = -17.5 - sin(radians(i));
    vertex(x, y);
  }
  vertex(3, -17.5);
  endShape(CLOSE);
  rect(5, -22.5, 40, 4);
  rect(-1.5, -17.5, 5, 1);
  rect(4.5, -22.5 - 0.5, 1, 5);
  rect(44.5, -24, 1, 7);
  strokeWeight(0.05);
  for (let i = 0; i < 4; i++) {
    rect(44, -23.5 + i * (15 / 8), 0.5);
  }
  translate(-20, 0);
  strokeWeight(0.1);
  beginShape();
  vertex(-1, 2);
  for (let i = 90; i >= 0; i -= 10) {
    const x = -1 - 5 * cos(radians(i));
    const y = -2 + 4 * sin(radians(i));
    vertex(x, y);
  }
  vertex(-6, -3);
  vertex(-2, -3);
  for (let i = 0; i <= 90; i += 10) {
    const x = -1 - cos(radians(i));
    const y = -3 + sin(radians(i));
    vertex(x, y);
  }
  endShape(CLOSE);
  rect(-1, -2.5, 1, 5);
  rect(-6.5, -4, 5, 1);
  rect(-6, -4, 4, -20);
  rect(-7, -24.75, 6, 0.75);
  strokeWeight(0.05);
  for (let i = 0; i < 4; i++) {
    rect(-6.75 + i * 1.6725, -24, 0.5);
  }
  pop();
}

function drawHeatExchanger() {
  push();
  translate(state.pump.x, state.pump.y);
  translate(38, -22);
  push();
  fill("rgb(140, 140, 140)");
  stroke(0);
  strokeWeight(0.05);
  translate(-6, -12);
  rect(-6, -12, 12, 12, 2);
  fill(20);
  rect(-5, -10, 10, 4);
  fill("rgb(255, 20, 20)");
  const mX = mouseX / relativeSize();
  const mY = mouseY / relativeSize();
  if (mX > 61 && mX < 67 && mY < 49.75 && mY > 46.75) {
    fill("rgb(255, 50, 50)");
  }
  rect(-3, -4.5, 6, 3, 0.25);
  fill("white");
  noStroke();
  textSize(1.75);
  textAlign(RIGHT, CENTER);
  text("units", 1.875, -3);
  textFont(state.meterFont);
  fill("yellow");
  textSize(3);
  const T = state.temperatureUnits === "C" ? state.heatExchanger.T : state.heatExchanger.T * 9 / 5 + 32;
  text(`${round(T)}  ${state.temperatureUnits}`, 3.125, -8);
  textFont("Arial");
  text("°", 1.75, -8);
  noFill();
  stroke(0);
  strokeWeight(0.2);
  beginShape();
  vertex(0, 0);
  vertex(0, 4);
  quadraticVertex(0, 6, -1.5, 7);
  quadraticVertex(-3, 7.5, -3, 8);
  endShape();
  pop();
  stroke("rgb(40, 40, 40)");
  strokeWeight(0.1);
  fill("rgb(200, 200, 200)");
  rect(-25, -2, 1, 7);
  rect(0, -2, 1, 7);
  strokeWeight(0.05);
  for (let i = 0; i < 4; i++) {
    rect(-25.5, -1.5 + i * (30 / 16), 0.5);
    rect(1, -1.5 + i * (30 / 16), 0.5);
  }
  fill("rgb(220, 220, 220)");
  strokeWeight(0.1);
  rect(-24, -4, 24, 11, 0.25);
  fill("rgb(200, 200, 200)");
  rect(-23, -5, 5, 1);
  rect(-6, 7, 5, 1);
  rect(-22, -5, 3, -30);
  rect(-5, 8, 3, 35);
  strokeWeight(0.05);
  for (let i = 0; i < 3; i++) {
    rect(-22.25 + i * (12 / 8), -5.5, 0.5);
    rect(-5.25 + i * (12 / 8), 8, 0.5);
  }
  fill("rgb(150, 150, 40)");
  stroke("rgb(100, 100, 40)");
  strokeWeight(0.1);
  translate(-3.5, 40);
  beginShape();
  let vertices = [
    [2.5, -2],
    [2.5, -1],
    [2, -1],
    [2, -0.5],
    [2.25, 1],
    [4, 1],
    [4, 0.5],
    [5, 0.5],
    [5, 4.5],
    [4, 4.5],
    [4, 4],
    [2.25, 4],
    [2, 5.5],
    [2, 6],
    [2.5, 6],
    [2.5, 7],
    [2.5, 7],
    [-2.5, 7],
    [-2.5, 6],
    [-2, 6],
    [-2, 2],
    [-2, -1],
    [-2.5, -1],
    [-2.5, -2],
  ];

  vertices.forEach(coord => vertex(coord[0], coord[1]));
  endShape(CLOSE);
  fill("rgb(180, 180, 180)");
  stroke("rgb(100, 100, 100)");
  translate(5, 2.5);
  strokeWeight(0.05);
  rect(0, -0.25, 8, 0.5);
  strokeWeight(0.1);
  beginShape();
  vertices = [
    [0, -1.75],
    [1, -2.25],
    [1.5, -2.25],
    [7, -3],
    [7.75, -2.5],
    [7.75, 2.5],
    [7, 3],
    [1.5, 2.25],
    [1, 2.25],
    [0, 1.75],
  ]

  vertices.forEach(coord => vertex(coord[0], coord[1]));

  vertices = [
    [0.5, 1.25],
    [1, 1.75],
    [1.5, 1.75],
    [6.5, 2.5],
    [7, 2],
    [7, -2],
    [6.5, -2.5],
    [1.5, -1.75],
    [1, -1.75],
    [0.5, -1.25],
  ];

  beginContour();
  vertices.forEach(coord => vertex(coord[0], coord[1]));
  endContour();

  endShape(CLOSE);

  fill("rgb(255, 80, 80)");
  stroke("rgb(200, 60, 60)");
  translate(7.75, 0);

  beginShape();

  vertices = [
    [0, -3],
    [0.5, -3.5],
    [2.5, -5],
    [2.5, -7],
    [4, -7],
    [4, -5],
    [6, -3.5],
    [6.5, -3],
    [6.5, 3],
    [6, 3.5],
    [4, 5],
    [4, 7],
    [2.5, 7],
    [2.5, 5],
    [0.5, 3.5],
    [0, 3],
  ];

  vertices.forEach(coord => vertex(coord[0], coord[1]));

  endShape(CLOSE);
  rect(2.5, -7, 0.75, 14);
  rect(3.25, -7, 0.75, 14);
  fill("rgb(180, 180, 180)");
  stroke("rgb(150, 150, 150)");
  strokeWeight(0.05);
  for (let i = 0; i < 7; i++) {
    rect(2, -6.5 + i * 2.0625, 0.5);
    rect(4, -6.5 + i * 2.0625, 0.5);
  }
  const p = state.heatExchanger.valvePosition;
  fill("gold");
  stroke("rgb(100, 100, 100)");
  strokeWeight(0.05);
  rect(-6 + p * 3.5, -1.5, 0.25, 3);

  fill("rgb(150, 150, 40)");
  stroke("rgb(100, 100, 40)");
  translate(6.5, 0.625);

  beginShape();
  vertices = [
    [0, -1],
    [0.5, -1],
    [0.5, -0.75],
    [1.75, -0.75],
    [2, -0.5],
    [2, 0.5],
    [2.25, 0.5],
    [2.25, 1],
    [1, 1],
    [1, 0.5],
    [1.25, 0.5],
    [1.25, 0],
    [0.5, 0],
    [0.5, 0.25],
    [0, 0.25],
  ];

  vertices.forEach(coord => vertex(coord[0], coord[1]));

  endShape(CLOSE);

  fill("rgb(180, 180, 180)");
  stroke("rgb(150, 150, 150)");
  rect(1.625 - 0.25, 1, 0.5, 10);
  fill("rgb(220, 220, 220)")
  rect(1.625 - 0.375, 1, 0.75, 0.325);

  fill(0);
  noStroke();
  textSize(2.5);
  textAlign(RIGHT, CENTER);
  text("steam in", -22, 6);
  stroke(0);
  strokeWeight(0.2);
  line(-19.25, 5, -19.25, 8);
  noStroke();
  triangle(-19.25, 4.05, -18.8725, 5.25, -19.6725, 5.25);
  translate(-36.25, -80);
  textAlign(CENTER, CENTER);
  text("steam out", 0, -8);
  stroke(0);
  strokeWeight(0.2);
  line(0, -5, 0, 0.5);
  noStroke();
  triangle(0, -5.5, 0.375, -4.25, -0.375, -4.25);
  pop();
}

function drawFeedTank() {
  push();
  translate(state.pump.x, state.pump.y);
  translate(-14, -24.75);
  noStroke();
  fill("rgb(200, 200, 255)");
  const liquidHeight = state.liquidHeight * 38;
  rect(-14, -2, 28, -liquidHeight);
  stroke("rgb(40, 40, 40)");
  strokeWeight(0.1);
  fill("rgba(220, 220, 220, 0.2)");
  rect(-14, -45, 28, 45);
  fill("rgb(200, 200, 200)");
  rect(-15, 0, 30, -2);
  rect(-15, -46, 30, 2);
  pop();
}

function drawFlashDrum() {
  push();
  translate(state.pump.x, state.pump.y);
  translate(45.5, -20.5);
  drawFlashLiquid();
  noStroke();
  fill(`rgba(${round(255 - 25 * state.vaporDensity)}, ${round(255 - 25 * state.vaporDensity)}, 255, ${0.5 * state.vaporDensity})`);
  rect(0, -35, 20, 65);
  stroke("rgb(40, 40, 40)");
  strokeWeight(0.1);
  fill("rgba(220, 220, 220, 0.2)");
  rect(0, -35, 20, 65);
  fill("rgb(200, 200, 200)");
  rect(-1, -36, 22, 2);
  rect(-1, 29, 22, 2);
  rect(-1, -13.3333, 22, 2);
  rect(-1, 8.3333, 22, 2);
  strokeWeight(0.05);
  for (let i = 0; i < 8; i++) {
    rect(i * 3 - 0.75, -34, 0.5, 0.5);
    rect(i * 3 - 0.75, -13.8333, 0.5, 0.5);
    rect(i * 3 - 0.75, -11.3333, 0.5, 0.5);
    rect(i * 3 - 0.75, 7.8333, 0.5, 0.5);
    rect(i * 3 - 0.75, 10.3333, 0.5, 0.5);
    rect(i * 3 - 0.75, 28.5, 0.5, 0.5);
  }
  strokeWeight(0.1);
  drawVaporOutletPipe();
  drawLiquidOutletPipe();
  pop();
}

function drawFlashLiquid() {
  push();
  if (state.pump.on) {
    state.liquidFlow.timeCoordinate = constrain(state.liquidFlow.timeCoordinate + 0.02, -1, 1);
  }
  let t = state.liquidFlow.timeCoordinate;
  noFill();
  stroke("rgb(200, 200, 255)");
  strokeWeight(4);
  if (t > 0) {
    beginShape();
    vertex(-4, 0);
    vertex(-1, 0);
    quadraticVertex(-1 + 10 * t, t, -1 + constrain(t, 0, 0.8) * 15, constrain(t - 0.1, 0, 1) * 32);
    endShape();
  }
  if (t >= 1) {
    const l = state.liquidFlow.liquidHeight;
    state.liquidFlow.liquidHeight = l + (15 - l) * 0.002;
    state.vaporDensity = state.vaporDensity + (1 - state.vaporDensity) * 0.02;
  }
  noStroke();
  fill("rgb(200, 200, 255)");
  rect(0, 30, 20, -state.liquidFlow.liquidHeight);
  pop();
}

function drawVaporOutletPipe() {
  push();
  let vertices;
  translate(20, -30);
  rect(0, -1, 1, 5);
  rect(1, 0, 40, 3);
  strokeWeight(0.05);
  for (let i = 0; i < 3; i++) {
    rect(1, -0.6725 + i * 1.8725, 0.5);
  }
  strokeWeight(0.1);
  translate(20, 1.5);
  push();
  fill("rgb(200, 200, 200)");
  stroke("rgb(40, 40, 40)");
  rect(-1.5, -5, 3, -7);
  translate(-15, -13);
  rect(-13, -1.5, 27, 3);
  push();
  translate(12, 0);
  beginShape();
  vertex(0, -1.75);
  for (let i = 90; i >= 0; i -= 10) {
    const x = 1.75 + 3 * cos(radians(i));
    const y = 1.75 - 3.5 * sin(radians(i));
    vertex(x, y);
  }
  vertex(4.75, 3);
  vertex(1.25, 3);
  endShape(CLOSE);
  translate(-24, 0);
  beginShape();
  vertex(0, -1.75);
  for (let i = 90; i >= 0; i -= 10) {
    const x = -1 - 3.5 * cos(radians(i));
    const y = 1.75 - 3.5 * sin(radians(i));
    vertex(x, y);
  }
  vertex(-4.5, 3);
  vertex(-1, 3);
  vertex(-1, 1.75);
  vertex(0, 1.75);
  endShape(CLOSE);
  rect(-4.25, 3, 3, 2.5);
  rect(0, -2, 1, 4);
  rect(-4.75, 2.5, 4, 1);
  pop();
  rect(12, -2, 1, 4);
  rect(13, 2, 4, 1);
  pop();
  push();
  fill("rgb(150, 150, 40)");
  stroke("rgb(100, 100, 40)");
  beginShape();
  vertices = [
    [-5, -2.5],
    [-5, 2.5],
    [-4, 2.5],
    [-4, 2],
    [0, 1.75],
    [4, 2],
    [4, 2.5],
    [5, 2.5],
    [5, -2.5],
    [4, -2.5],
    [4, -2],
    [2, -2.25],
    [2, -4],
    [2.5, -4],
    [2.5, -5],
    [-2.5, -5],
    [-2.5, -4],
    [-2, -4],
    [-2, -2.25],
    [-4, -2],
    [-4, -2.5],
  ];

  vertices.forEach(coord => vertex(coord[0], coord[1]));
  endShape(CLOSE);

  translate(-15, -13);

  fill("rgb(150, 150, 40)");
  stroke("rgb(100, 100, 40)");
  strokeWeight(0.1);
  rotate(-PI / 2);
  beginShape();
  vertices = [
    [2.5, -2],
    [2.5, -1],
    [2, -1],
    [2, -0.5],
    [2.25, 1],
    [4, 1],
    [4, 0.5],
    [5, 0.5],
    [5, 4.5],
    [4, 4.5],
    [4, 4],
    [2.25, 4],
    [2, 5.5],
    [2, 6],
    [2.5, 6],
    [2.5, 7],
    [2.5, 7],
    [-2.5, 7],
    [-2.5, 6],
    [-2, 6],
    [-2, 2],
    [-2, -1],
    [-2.5, -1],
    [-2.5, -2],
  ];

  vertices.forEach(coord => vertex(coord[0], coord[1]));
  endShape(CLOSE);
  fill("rgb(180, 180, 180)");
  stroke("rgb(100, 100, 100)");
  translate(5, 2.5);
  strokeWeight(0.05);
  rect(0, -0.25, 8, 0.5);
  strokeWeight(0.1);
  beginShape();
  vertices = [
    [0, -1.75],
    [1, -2.25],
    [1.5, -2.25],
    [7, -3],
    [7.75, -2.5],
    [7.75, 2.5],
    [7, 3],
    [1.5, 2.25],
    [1, 2.25],
    [0, 1.75],
  ]

  vertices.forEach(coord => vertex(coord[0], coord[1]));

  vertices = [
    [0.5, 1.25],
    [1, 1.75],
    [1.5, 1.75],
    [6.5, 2.5],
    [7, 2],
    [7, -2],
    [6.5, -2.5],
    [1.5, -1.75],
    [1, -1.75],
    [0.5, -1.25],
  ];

  beginContour();
  vertices.forEach(coord => vertex(coord[0], coord[1]));
  endContour();

  endShape(CLOSE);

  fill("rgb(255, 80, 80)");
  stroke("rgb(200, 60, 60)");
  translate(7.75, 0);

  beginShape();

  vertices = [
    [0, -3],
    [0.5, -3.5],
    [2.5, -5],
    [2.5, -7],
    [4, -7],
    [4, -5],
    [6, -3.5],
    [6.5, -3],
    [6.5, 3],
    [6, 3.5],
    [4, 5],
    [4, 7],
    [2.5, 7],
    [2.5, 5],
    [0.5, 3.5],
    [0, 3],
  ];

  vertices.forEach(coord => vertex(coord[0], coord[1]));

  endShape(CLOSE);
  rect(2.5, -7, 0.75, 14);
  rect(3.25, -7, 0.75, 14);
  fill("rgb(180, 180, 180)");
  stroke("rgb(150, 150, 150)");
  strokeWeight(0.05);
  for (let i = 0; i < 7; i++) {
    rect(2, -6.5 + i * 2.0625, 0.5);
    rect(4, -6.5 + i * 2.0625, 0.5);
  }
  const p = state.pressureController.valvePosition;
  fill("gold");
  stroke("rgb(100, 100, 100)");
  strokeWeight(0.05);
  rect(-6 + p * 3.5, -1.5, 0.25, 3);

  fill("rgb(150, 150, 40)");
  stroke("rgb(100, 100, 40)");
  translate(6.5, 0.625);

  beginShape();
  vertices = [
    [0, -1],
    [0.5, -1],
    [0.5, -0.75],
    [1.75, -0.75],
    [2, -0.5],
    [2, 0.5],
    [2.25, 0.5],
    [2.25, 1],
    [1, 1],
    [1, 0.5],
    [1.25, 0.5],
    [1.25, 0],
    [0.5, 0],
    [0.5, 0.25],
    [0, 0.25],
  ];

  vertices.forEach(coord => vertex(coord[0], coord[1]));

  endShape(CLOSE);

  fill("rgb(180, 180, 180)");
  stroke("rgb(150, 150, 150)");
  rect(1.625 - 0.25, 1, 0.5, 50);
  fill("rgb(220, 220, 220)")
  rect(1.625 - 0.375, 1, 0.75, 0.325);
  pop();
  pop();
}

function drawLiquidOutletPipe() {
  push();
  translate(20, 37);
  rect(-7, -6, 5, 1);
  rect(-2, 0, 45, 3);
  rect(-6, -5, 3, 4);
  strokeWeight(0.05);
  for (let i = 0; i < 3; i++) {
    rect(-6.5 + i * 1.75, -5, 0.5);
  }
  strokeWeight(0.1);
  translate(-6, 0);
  beginShape();
  vertex(0, -0.5);
  for (let i = 0; i <= 90; i += 10) {
    const x = 3.5 - 3.5 * cos(radians(i));
    const y = -0.5 + 3.5 * sin(radians(i));
    vertex(x, y);
  }
  vertex(3.5, -0.5);
  endShape();
  rect(-0.5, -1.5, 4, 1);
  rect(3.5, -0.5, 1, 4);
  drawMassFlowMeter();
  pop();
}

function drawMassFlowMeter() {
  push();
  translate(20, 1.5);
  rectMode(CENTER);
  fill("rgb(80, 80, 80)");
  stroke("rgb(40, 40, 40)");
  strokeWeight(0.05);
  rect(-5, 0, 2, 5, 0.5);
  rect(5, 0, 2, 5, 0.5);
  fill("rgb(240, 240, 240)");
  beginShape();
  let vertices = [
    [-5, -2.5],
    [-5, 2.5],
    [-4, 2.5],
    [-4, 2],
    [-2, 1.75],
    [2, 1.75],
    [4, 2],
    [4, 2.5],
    [5, 2.5],
    [5, -2.5],
    [4, -2.5],
    [4, -2],
    [2, -1.75],
    [-2, -1.75],
    [-4, -2],
    [-4, -2.5],
  ];

  vertices.forEach(coord => vertex(coord[0], coord[1]));
  endShape(CLOSE);

  fill("rgb(80, 80, 80)");
  rect(0, -1, 5, 6, 0.5);
  rectMode(CORNER);
  rect(-1, -4.5, 2, 0.5);
  quad(-0.75, -4.5, -0.5, -6, 0.5, -6, 0.75, -4.5);
  noFill();
  stroke(0);
  strokeWeight(0.2);
  beginShape();
  vertex(0, -6);

  quadraticVertex(2, -10, 6, -8);
  quadraticVertex(10, -5, 15, -7);
  quadraticVertex(18, -9, 16, -12);
  endShape();
  fill("rgb(140, 140, 140)");
  stroke(0);
  strokeWeight(0.05);
  translate(16, -12);
  rect(-8, -12, 16, 12, 2);
  fill(20);
  rect(-7, -10, 14, 4);
  fill("rgb(255, 20, 20)");
  const mX = mouseX / relativeSize();
  const mY = mouseY / relativeSize();
  if (mX > 124.5 && mX < 131 && mY < 90.5 && mY > 86.5) {
    fill("rgb(255, 50, 50)");
  }
  rect(-3, -4.5, 6, 3, 0.25);
  fill("white");
  noStroke();
  textSize(1.75);
  textAlign(CENTER, CENTER);
  text("units", 0, -3);
  textFont(state.meterFont);
  fill("yellow");
  textSize(3);
  const m = state.massFlowRateUnits === "kg/min" ? (state.mL * 60).toFixed(2) : (state.mL * 1000).toFixed(1);
  text(`${m} ${state.massFlowRateUnits}`, 0.125, -8);
  pop();
}

export function drawAll() {
  drawFeedTank();
  drawFlashDrum();
  drawInletPipe();
  drawHeatExchanger();
  const p = state.pump;
  drawPump(p.x, p.y, p.scaleX, p.scaleY, p.on);
}