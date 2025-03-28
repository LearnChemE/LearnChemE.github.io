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
  if (mX > 16.5 + x - 7.5 && mX < 16.5 + x + 7.5 && mY > 16 + y - 5 && mY < 16 + y + 2.75) {
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
  rect(-20, -2, 20, 4, 0.25);
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
  pop();
}

function drawHeatExchanger() {
  push();
  translate(state.pump.x, state.pump.y);
  translate(30, -22);
  stroke("rgb(40, 40, 40)");
  strokeWeight(0.1);
  fill("rgb(200, 200, 200)");
  rect(-21, -2, 1, 7);
  rect(0, -2, 1, 7);
  strokeWeight(0.05);
  for (let i = 0; i < 4; i++) {
    rect(-21.5, -1.5 + i * (30 / 16), 0.5);
    rect(1, -1.5 + i * (30 / 16), 0.5);
  }
  fill("rgb(220, 220, 220)");
  strokeWeight(0.1);
  rect(-20, -4, 20, 11, 0.25);
  pop();
}

export function drawAll() {
  drawInletPipe();
  drawHeatExchanger();
  const p = state.pump;
  drawPump(p.x, p.y, p.scaleX, p.scaleY, p.on);
}