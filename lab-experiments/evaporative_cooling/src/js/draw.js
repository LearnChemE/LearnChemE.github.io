export default function drawAll() {
  background(250);
  drawFan();
  drawGrid(false, 0);
  if (state.waterOn) {
    state.waterLevel += 1;
  } else {
    state.waterLevel = 0;
  }
  drawGrid(true, constrain(state.waterLevel, 0, 100));
}

const coolerLocation = [110, 50];

function drawGrid(waterPresent, waterLevel) {
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

  vertex(-22.2, -21.5);
  vertex(22.2, -21.5);
  if (waterPresent) {
    vertex(22.2, -21.5 + waterLevel * 43 / 100);
    vertex(-22.2, -21.5 + waterLevel * 43 / 100);
  } else {
    vertex(22.2, 21.5);
    vertex(-22.2, 21.5);
  }

  const s = waterPresent ? 0.5 : 1;
  const rows = waterPresent ? constrain(waterLevel / 100 * 10, 0, 10) : 10;

  for (let i = 1; i < 15; i++) {
    for (let j = 1; j < rows; j++) {
      beginContour();
      vertex(i * 3.067 - 23 - s * 1.1, j * 4.6 - 23 - s * 0.05);
      vertex(i * 3.067 - 23 - s * 1.1, j * 4.6 - 23 + s * 0.05);
      vertex(i * 3.067 - 23 - s * 0.05, j * 4.6 - 23 + s * 1.4);
      vertex(i * 3.067 - 23 + s * 0.05, j * 4.6 - 23 + s * 1.4);
      vertex(i * 3.067 - 23 + s * 1.1, j * 4.6 - 23 + s * 0.05);
      vertex(i * 3.067 - 23 + s * 1.1, j * 4.6 - 23 - s * 0.05);
      vertex(i * 3.067 - 23 + s * 0.05, j * 4.6 - 23 - s * 1.4);
      vertex(i * 3.067 - 23 - s * 0.05, j * 4.6 - 23 - s * 1.4);
      endContour();
    }
  }

  for (let i = 0; i < 15; i++) {
    for (let j = 0; j < rows; j++) {
      beginContour();
      if (i > 0) {
        vertex(i * 3.067 - 23 + 1.5335 - s * 1.1, j * 4.6 - 23 + 2.3 - s * 0.05);
        vertex(i * 3.067 - 23 + 1.5335 - s * 1.1, j * 4.6 - 23 + 2.3 + s * 0.05);
      } else if (j == 0 || j == 9) {
        vertex(-23 + 1.5335, j * 4.6 - 23 + 2.3 - s * 0.05);
      }
      if (j < 9) {
        vertex(i * 3.067 - 23 + 1.5335 - s * 0.05, j * 4.6 - 23 + 2.3 + s * 1.4);
        vertex(i * 3.067 - 23 + 1.5335 + s * 0.05, j * 4.6 - 23 + 2.3 + s * 1.4);
      }
      if (i < 14) {
        vertex(i * 3.067 - 23 + 1.5335 + s * 1.1, j * 4.6 - 23 + 2.3 + s * 0.05);
        vertex(i * 3.067 - 23 + 1.5335 + s * 1.1, j * 4.6 - 23 + 2.3 - s * 0.05);
      } else if (j == 0 || j == 9) {
        vertex(i * 3.067 - 23 + 1.5335, j * 4.6 - 23 + 2.3 + s * 0.05);
      }
      if (j > 0) {
        vertex(i * 3.067 - 23 + 1.5335 + s * 0.05, j * 4.6 - 23 + 2.3 - s * 1.4);
        vertex(i * 3.067 - 23 + 1.5335 - s * 0.05, j * 4.6 - 23 + 2.3 - s * 1.4);
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
  scale(0.75);
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
  circle(0, 0, 10);
  pop();
}

function drawBlade() {
  push();
  const bladeLength = 25;
  noFill();
  const radius = sqrt(bladeLength ** 2 + (sin(radians(bladeLength) * bladeLength / 20) * 15) ** 2);
  strokeWeight(1 / relativeSize());
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
      let y = sin(radians(j) * j / 20) * 15;
      vertex(x, y);
    }
    endShape();
    rotate(PI / 480);
  }
  const startAngle = atan2(sin(radians(bladeLength) * bladeLength / 20) * 15, bladeLength);
  stroke(0);
  strokeWeight(0.5 / relativeSize());
  beginShape();
  for (let i = 0; i < bladeLength - 2; i++) {
    let x = radius * cos(-1 * radians(i) + startAngle);
    let y = radius * sin(-1 * radians(i) + startAngle);
    vertex(x, y);
  }
  endShape();
  pop();
}