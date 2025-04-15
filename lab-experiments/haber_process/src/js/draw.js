const tankHeight = 70;
const tankWidth = 15;
const steelColor = "rgb(220, 220, 220)";
const ironColor = "rgb(180, 180, 180)";

function drawTanks() {
  push();
  drawTank(5, height / 3 + 5, tankWidth, tankHeight, "H2", "blue", 0);
  drawTank(23, height / 3 + 5, tankWidth, tankHeight, "N2", "green", 0);
  drawTank(41, height / 3 + 5, tankWidth, tankHeight, "NH3", "red", 0);
  pop();
}

function drawTank(x, y, w, h, label, colr, valvePosition) {
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
  const time = valvePosition;
  for (let i = 0; i < 3; i++) {
    const offsetTime = (time + 0.16667 * i + 0.5) % 0.5;
    const xPos = -1 * cos(offsetTime * TWO_PI) * 2.25;
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
    const xPos = 1 * cos(offsetTime * TWO_PI) * 2.25;
    const wid = (0.55) * abs(sin((0.25 - (offsetTime - 0.25) % 0.25) * TWO_PI)) + 0.225;
    if (offsetTime > 0 && offsetTime < 0.5) {
      rect(x + xPos + w / 2 - wid / 2 - 0.125, y - 8.675, 5.5 / 3 * wid, 1.875, 0.25);
    }
  }

  fill(200, 170, 60);
  stroke(100);
  rect(x + w / 2 + 10, y - 4.5, 3, 1, 0.25);
  rect(x + w / 2 + 12, y - 4.875, 2, 1.75, 0.25, 0.25, 0.25, 0.25);
  const regulatorBodyColor = "rgb(180, 150, 50)";
  const regulatorOutlineColor = "rgb(100, 100, 100)";
  fill(regulatorBodyColor);
  stroke(regulatorOutlineColor);
  rect(x + w / 2 + 4, y - 4.75, 2, 1.5, 0.25);
  circle(x + w / 2 + 8, y - 4, 5);
  fill(40);
  stroke(0);
  translate(x + w / 2 + 8, y - 4);
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
  circle(0, 0, 2.5);
  pop();
}

export function drawAll() {
  drawTanks();
}