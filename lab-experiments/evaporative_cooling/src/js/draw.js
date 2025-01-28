const coolerLocation = [120, 26];
const bladeLength = 15;
const beakerCoordinate = [120, 81];
const beakerWidth = 25;
const beakerHeight = 32;
const knobDiameter = 12;
const switchCenter = [beakerCoordinate[0] - 50 - 12, beakerCoordinate[1] - beakerHeight / 2 - 5.25 + 28];
const bladeRadius = () => { return sqrt(bladeLength ** 2 + (sin(radians(bladeLength) * bladeLength / 20) * 15) ** 2) }

export default function drawAll() {
  background(255);
  drawFan();
  drawGrid(false, 0);
  drawGrid(true, constrain(state.waterFlowCoordinate, 0, 100));
  drawIntakeHose();
  drawPump();
  drawWaterDistributor();
  drawBeaker();
}

function drawGrid(waterPresent, waterFlowCoordinate) {
  push();
  translate(coolerLocation[0], coolerLocation[1]);
  if (waterPresent) {
    noStroke();
    fill(200, 200, 255, 150);
  } else {
    stroke(0);
    strokeWeight(0.25 / relativeSize());
    fill(220);
  }
  beginShape();

  vertex(-16.65, -16.125);
  vertex(16.65, -16.125);
  if (waterPresent) {
    vertex(16.65, -16.125 + waterFlowCoordinate * 32.25 / 100);
    vertex(-16.65, -16.125 + waterFlowCoordinate * 32.25 / 100);
  } else {
    vertex(16.65, 16.125);
    vertex(-16.65, 16.125);
  }

  const s = waterPresent ? 0.5 : 1;
  const rows = waterPresent ? constrain(waterFlowCoordinate / 100 * 10, 0, 10) : 10;

  for (let i = 1; i < 15; i++) {
    for (let j = 1; j < rows; j++) {
      beginContour();
      vertex(i * 2.3 - 17.25 - s * 0.825, j * 3.45 - 17.25 - s * 0.0375);
      vertex(i * 2.3 - 17.25 - s * 0.825, j * 3.45 - 17.25 + s * 0.0375);
      vertex(i * 2.3 - 17.25 - s * 0.0375, j * 3.45 - 17.25 + s * 1.05);
      vertex(i * 2.3 - 17.25 + s * 0.0375, j * 3.45 - 17.25 + s * 1.05);
      vertex(i * 2.3 - 17.25 + s * 0.825, j * 3.45 - 17.25 + s * 0.0375);
      vertex(i * 2.3 - 17.25 + s * 0.825, j * 3.45 - 17.25 - s * 0.0375);
      vertex(i * 2.3 - 17.25 + s * 0.0375, j * 3.45 - 17.25 - s * 1.05);
      vertex(i * 2.3 - 17.25 - s * 0.0375, j * 3.45 - 17.25 - s * 1.05);
      endContour();
    }
  }

  for (let i = 0; i < 15; i++) {
    for (let j = 0; j < rows; j++) {
      beginContour();
      if (i > 0) {
        vertex(i * 2.3 - 17.25 + 1.150125 - s * 0.825, j * 3.45 - 17.25 + 1.725 - s * 0.0375);
        vertex(i * 2.3 - 17.25 + 1.150125 - s * 0.825, j * 3.45 - 17.25 + 1.725 + s * 0.0375);
      } else if (j == 0 || j == 9) {
        vertex(-17.25 + 1.150125, j * 3.45 - 17.25 + 1.725 - s * 0.0375);
      }
      if (j < 9) {
        vertex(i * 2.3 - 17.25 + 1.150125 - s * 0.0375, j * 3.45 - 17.25 + 1.725 + s * 1.05);
        vertex(i * 2.3 - 17.25 + 1.150125 + s * 0.0375, j * 3.45 - 17.25 + 1.725 + s * 1.05);
      }
      if (i < 14) {
        vertex(i * 2.3 - 17.25 + 1.150125 + s * 0.825, j * 3.45 - 17.25 + 1.725 + s * 0.0375);
        vertex(i * 2.3 - 17.25 + 1.150125 + s * 0.825, j * 3.45 - 17.25 + 1.725 - s * 0.0375);
      } else if (j == 0 || j == 9) {
        vertex(i * 2.3 - 17.25 + 1.150125, j * 3.45 - 17.25 + 1.725 + s * 0.0375);
      }
      if (j > 0) {
        vertex(i * 2.3 - 17.25 + 1.150125 + s * 0.0375, j * 3.45 - 17.25 + 1.725 - s * 1.05);
        vertex(i * 2.3 - 17.25 + 1.150125 - s * 0.0375, j * 3.45 - 17.25 + 1.725 - s * 1.05);
      }
      endContour();
    }
  }

  endShape(CLOSE);
  pop();
}

function drawFan() {
  push();
  translate(coolerLocation[0], coolerLocation[1]);
  fill(70);
  stroke(50);
  strokeWeight(1 / relativeSize());
  const vertices = [
    [-16.5, -16.5],
    [16.5, -16.5],
    [17.0, -16.0],
    [17.0, 16.0],
    [16.5, 16.5],
    [-16.5, 16.5],
    [-17.0, 16.0],
    [-17.0, -16.0]
  ];

  beginShape();

  vertices.forEach(([x, y]) => {
    vertex(x, y);
  });

  const r = bladeRadius() + 0.5;


  beginContour();
  for (let i = 0; i < 365; i++) {
    let x = r * cos(-1 * radians(i));
    let y = r * sin(-1 * radians(i));
    vertex(x, y);
  }
  endContour();

  endShape(CLOSE);

  fill(200);
  stroke(0);
  strokeWeight(0.5 / relativeSize());
  rotate(-1 * state.fanCount / 15);
  if (state.fanOn) {
    state.fanCount++;
  }
  for (let i = 0; i < 8; i++) {
    rotate(PI / 4);
    drawBlade();
  }
  fill(120, 120, 120);
  circle(0, 0, 7.5);
  pop();
}

function drawBlade() {
  push();
  noFill();
  strokeWeight(0.5 / relativeSize());
  let endColor = color(120, 120, 120);
  let startColor = color(200, 200, 200);
  for (let i = 0; i < 60; i++) {
    let amt = map(i, 0, 60, 0, 1);
    let gradColor = lerpColor(startColor, endColor, amt);
    if (i === 0 || i === 59) {
      stroke(0);
    } else {
      stroke(gradColor);
    }
    beginShape();
    for (let j = 0; j <= bladeLength; j++) {
      let x = j;
      let y = sin(radians(j) * j / 15) * 11.25;
      vertex(x, y);
    }
    endShape();
    rotate(PI / 480);
  }
  const startAngle = atan2(sin(radians(bladeLength) * bladeLength / 15) * 11.25, bladeLength);
  stroke(0);
  beginShape();
  for (let i = 0; i < bladeLength - 2; i++) {
    let x = bladeRadius() * cos(-1 * radians(i) + startAngle);
    let y = bladeRadius() * sin(-1 * radians(i) + startAngle);
    vertex(x, y);
  }
  endShape();
  pop();
}

function drawWaterDistributor() {
  push();
  translate(coolerLocation[0], coolerLocation[1]);
  const distributorFill = "rgba(240, 240, 240, 0.7)";
  const distrubutorStroke = "rgba(150, 150, 150, 0.8)";
  fill(distributorFill);
  stroke(distrubutorStroke);
  strokeWeight(0.5 / relativeSize());
  beginShape();

  const vertices = [
    [-20, -22.5],
    [18.75, -22.5],
    [18.75, 70],
    [17, 70],
    [17, 30],
    [2, 30],
    [2, 31],
    [-2, 31],
    [-2, 30],
    [-17, 30],
    [-17, 70],
    [-18.75, 70],
    [-18.75, -18.75],
    [-20, -18.75]
  ];

  const contourVertices = [
    [
      [-17, 18.75],
      [-9.75, 18.75],
      [-9.75, -18],
      [-17, -18]
    ],
    [
      [-8.25, 18.75],
      [-0.75, 18.75],
      [-0.75, -18],
      [-8.25, -18]
    ],
    [
      [0.75, 18.75],
      [8.25, 18.75],
      [8.25, -18],
      [0.75, -18]
    ],
    [
      [9.75, 18.75],
      [17, 18.75],
      [17, -18],
      [9.75, -18]
    ]
  ]

  vertices.forEach(([x, y]) => {
    vertex(x, y);
  });

  contourVertices.forEach(contour => {
    beginContour();
    contour.forEach((coord) => {
      vertex(coord[0], coord[1]);
    });
    // console.log({ x, y });
    endContour();
  });

  endShape(CLOSE);

  const reservoirVertices = [
    [-17, 20],
    [17, 20],
    [17, 29],
    [1.5, 29],
    [1.5, 30.5],
    [-1.5, 30.5],
    [-1.5, 29],
    [-17, 29]
  ];

  const reservoirColor = "rgba(255, 255, 255, 0.8)";
  const reservoirStroke = "rgba(220, 220, 220, 0.8)";

  stroke(reservoirStroke);
  fill(reservoirColor);

  beginShape();
  reservoirVertices.forEach(([x, y]) => {
    vertex(x, y);
  });
  endShape(CLOSE);

  fill(80);
  stroke(0);
  strokeWeight(0.5 / relativeSize());

  rect(-22, -23.5, 2, 5.75, 4);
  pop();
}

function drawBeaker() {
  const beakerStroke = "rgba(0, 0, 0, 0.5)";
  const beakerFill = "rgba(230, 230, 230, 1)";

  push();

  translate(beakerCoordinate[0], beakerCoordinate[1]);
  fill(beakerFill);
  stroke(beakerStroke);
  strokeWeight(0.5 / relativeSize());

  beginShape();

  vertex(-beakerWidth / 2 - 0.69, beakerHeight / 2 - 1.7);
  for (let i = 4; i >= 0; i--) {
    vertex(-beakerWidth / 2 + 1.5 - cos(radians(48 + 180)) * 1.5 - 3 + cos(radians(10 * 24 + 90)) * 0.5 - cos(radians(-i * 12 + 240)) * 1.5 - 2.1, -beakerHeight / 2 + sin(radians(48)) * 1.5 + sin(radians(10 * 24 + 90)) * 0.5 - 2.75 + sin(radians(-i * 12 + 240)) * 1.5 + 1.32);
  }
  for (let i = 1; i < 10; i++) {
    vertex(-beakerWidth / 2 - sin(radians(48 - 180)) * 1.5 - 3 + sin(radians(i * 24 + 90)) * 0.5, -beakerHeight / 2 + sin(radians(48)) * 1.5 + cos(radians(i * 24 + 90)) * 0.5 - 2.75);
  }
  for (let i = 5; i > 0; i--) {
    vertex(-beakerWidth / 2 + sin(radians(i * 12 + 90)) * 1.5 - 3, -beakerHeight / 2 - cos(radians(-i * 12 + 90)) * 1.5);
  }
  vertex(-beakerWidth / 2 - 1.5, -beakerHeight / 2);
  for (let i = 0; i < 5; i++) {
    vertex(-beakerWidth / 2 + sin(radians(i * 24 - 90)) * 1.5, beakerHeight / 2 - cos(radians(-i * 24 - 90)) * 1.5 - 1.5);
  }
  vertex(-beakerWidth / 2, beakerHeight / 2);
  vertex(beakerWidth / 2, beakerHeight / 2);
  for (let i = 0; i < 5; i++) {
    vertex(beakerWidth / 2 + cos(radians(i * 24 - 90)) * 1.5, beakerHeight / 2 - sin(radians(-i * 24 - 90)) * 1.5 - 1.5);
  }
  vertex(beakerWidth / 2 + 1.5, -beakerHeight / 2);
  for (let i = 0; i < 5; i++) {
    vertex(beakerWidth / 2 - cos(radians(i * 12)) * 1.5 + 3, -beakerHeight / 2 + sin(radians(-i * 12)) * 1.5);
  }
  for (let i = 0; i < 10; i++) {
    vertex(beakerWidth / 2 - cos(radians(48)) * 1.5 + 3 - cos(radians(i * 24 + 90)) * 0.5, -beakerHeight / 2 + sin(radians(48)) * 1.5 + sin(radians(i * 24 + 90)) * 0.5 - 2.75);
  }
  for (let i = 0; i < 5; i++) {
    vertex(beakerWidth / 2 - 1.5 - cos(radians(48)) * 1.5 + 3 - cos(radians(10 * 24 + 90)) * 0.5 + cos(radians(-i * 12 + 240)) * 1.5 + 2.1, -beakerHeight / 2 + sin(radians(48)) * 1.5 + sin(radians(10 * 24 + 90)) * 0.5 - 2.75 + sin(radians(-i * 12 + 240)) * 1.5 + 1.32);
  }
  vertex(beakerWidth / 2 + 0.69, beakerHeight / 2 - 1.7);
  for (let i = 0; i < 5; i++) {
    vertex(beakerWidth / 2 - cos(radians(-i * 24 + 180)) * 1.0 - 0.29, beakerHeight / 2 + sin(radians(-i * 24 + 180)) * 1 - 1.7);
  }
  for (let i = 0; i < 5; i++) {
    vertex(-beakerWidth / 2 - cos(radians(-i * 24 + 90)) * 1.0 + 0.29, beakerHeight / 2 + sin(radians(-i * 24 + 90)) * 1 - 1.7);
  }
  endShape();

  textSize(0.3 * relativeSize());
  textAlign(RIGHT, CENTER);
  for (let i = 1; i < 21; i++) {
    let xOffset;
    if (i % 4 === 0) {
      xOffset = 1.25;
      push();
      noStroke();
      fill(100);
      text(i * 50, beakerWidth / 2 - 2.5, beakerHeight / 2 - 0.7 - i * beakerHeight / 22);
      pop();
    } else if (i % 2 === 0) {
      xOffset = 0.75;
    } else {
      xOffset = 0.5;
    }
    let x = beakerWidth / 2 - 0.5;
    let y = beakerHeight / 2 - 0.7 - i * beakerHeight / 22;
    line(x, y, x - xOffset, y);
  }

  pop();
}

function drawIntakeHose() {
  push();
  translate(beakerCoordinate[0], beakerCoordinate[1]);
  const intakeTubeFill = "rgba(240, 240, 240, 0.5)";
  const intakeTubeStroke = "rgba(150, 150, 150, 0.8)";
  fill(intakeTubeFill);
  stroke(intakeTubeStroke);
  strokeWeight(0.5 / relativeSize());
  rect(-beakerWidth / 2 + 1.5, -beakerHeight / 2 - 3, 2.5, beakerHeight, 0.5);
  rect(-beakerWidth / 2 + 1.5, -beakerHeight / 2 - 6.5, -22.5, 2.5, 0.5);
  fill(255);
  stroke(200);
  beginShape();
  vertex(-beakerWidth / 2 + 1.25, -beakerHeight / 2 - 2.5);
  vertex(-beakerWidth / 2 + 4.25, -beakerHeight / 2 - 2.5);
  vertex(-beakerWidth / 2 + 4.25, -beakerHeight / 2 - 3.5);
  vertex(-beakerWidth / 2 + 4, -beakerHeight / 2 - 3.5);
  for (let i = 10; i <= 90; i += 10) {
    vertex(-beakerWidth / 2 + 4 + cos(radians(i) + 270) * 3 - 3, -beakerHeight / 2 - 3.5 - sin(radians(i) + 270) * 3);
  }
  vertex(-beakerWidth / 2 + 1, -beakerHeight / 2 - 6.5);
  vertex(-beakerWidth / 2 + 1, -beakerHeight / 2 - 6.75);
  vertex(-beakerWidth / 2, -beakerHeight / 2 - 6.75);
  vertex(-beakerWidth / 2, -beakerHeight / 2 - 3.75);
  vertex(-beakerWidth / 2 + 1, -beakerHeight / 2 - 3.75);
  vertex(-beakerWidth / 2 + 1, -beakerHeight / 2 - 4);
  vertex(-beakerWidth / 2 + 1.5, -beakerHeight / 2 - 4);
  vertex(-beakerWidth / 2 + 1.5, -beakerHeight / 2 - 3.5);
  vertex(-beakerWidth / 2 + 1.25, -beakerHeight / 2 - 3.5);
  endShape(CLOSE);
  fill(intakeTubeFill);
  stroke(intakeTubeStroke);
  pop();
}

function drawPump() {
  push();
  translate(beakerCoordinate[0] - 50, beakerCoordinate[1] - beakerHeight / 2 - 5.25);
  drawPowerSwitch();
  strokeWeight(0.25 / relativeSize());
  rectMode(CENTER);
  fill(220);
  stroke(0);
  rect(8, 0, 20, 8, 1);
  drawPumpKnob();
  pop();
}

function drawPumpKnob() {
  const knobFill1 = "rgb(200, 200, 255)";
  const knobFill2 = "rgb(190, 190, 255)";
  const knobStroke = "rgb(20, 20, 205)";
  fill(knobFill1);
  stroke(knobStroke);
  push();
  translate(8, 0);
  circle(0, 0, knobDiameter);
  push();
  rotate(-1 * state.valvePosition * PI / 2 + PI / 2);
  translate(-knobDiameter / 8, 0);
  fill(knobFill2);
  rectMode(CORNERS);
  rect(-knobDiameter / 2, -knobDiameter / 8, knobDiameter / 4, knobDiameter / 8, 0.5);
  pop();
  pop();
}

function drawPowerSwitch() {
  push();
  translate(8, 0);
  noFill();
  stroke(0);
  strokeWeight(1 / relativeSize());
  beginShape();
  vertex(0, 0);
  quadraticVertex(0, 28, -10, 28);
  endShape();
  strokeWeight(0.5 / relativeSize());
  const x = mouseX / relativeSize();
  const y = mouseY / relativeSize();
  if (x > switchCenter[0] - 19 && x < switchCenter[0] + 19 && y > switchCenter[1] - 8 && y < switchCenter[1] + 4) {
    stroke(150, 150, 0);
    strokeWeight(1 / relativeSize());
  } else {
    stroke(0);
  }
  push();
  translate(-20, 24);
  rectMode(CORNER);
  fill(40);
  if (state.switchOn) {
    rotate(-PI / 3);
    translate(-1, 0);
    rect(0, 0, 5, 2, 0.5);
  } else {
    rotate(PI / 3);
    translate(1, 0);
    rect(0, 0, -5, 2, 0.5);
  }
  pop();
  fill(80);
  rectMode(CENTER);
  rect(-20, 24, 8, 1, 0.5);
  fill(90);
  rect(-20, 28, 20, 8, 2);
  fill(255);
  strokeWeight(0.2 / relativeSize());
  textSize(12 / relativeSize());
  textAlign(CENTER, CENTER);
  text("OFF", -24, 28);
  text("ON", -16, 28);
  pop();
}

window.mousePressed = () => {
  const x = mouseX / relativeSize();
  const y = mouseY / relativeSize();
  const distanceFromKnob = dist(x, y, beakerCoordinate[0] - 50 + 8, beakerCoordinate[1] - beakerHeight / 2 - 5.25);
  if (distanceFromKnob < knobDiameter / 2 + 1.5) {
    state.onKnob = true;
    state.valvePositionStart = state.valvePosition;
    state.mousePositionStart = [x, y];
  }
  if (x > switchCenter[0] - 19 && x < switchCenter[0] + 19 && y > switchCenter[1] - 8 && y < switchCenter[1] + 4) {
    state.switchOn = !state.switchOn;
  }
}

window.mouseDragged = () => {
  const centerX = beakerCoordinate[0] - 50 + 8;
  const centerY = beakerCoordinate[1] - beakerHeight / 2 - 5.25;
  const startX = state.mousePositionStart[0] - centerX;
  const startY = state.mousePositionStart[1] - centerY;
  const x = mouseX / relativeSize() - centerX;
  const y = mouseY / relativeSize() - centerY;
  if (state.onKnob) {
    let startAngle = atan2(startY, startX);
    let currentAngle = atan2(y, x);
    if (currentAngle < 0 && startAngle > 0) {
      currentAngle += 2 * PI;
    }
    if (currentAngle > 0 && startAngle < 0) {
      startAngle += 2 * PI;
    }
    let angle = (startAngle - currentAngle) / PI * 2;
    state.valvePosition = constrain(state.valvePositionStart + angle, 0, 1);
  }
}

window.mouseReleased = () => {
  state.onKnob = false;
}