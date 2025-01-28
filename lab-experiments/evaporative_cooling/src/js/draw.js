const coolerLocation = [120, 26];
const bladeLength = 15;
const bladeRadius = () => { return sqrt(bladeLength ** 2 + (sin(radians(bladeLength) * bladeLength / 20) * 15) ** 2) }

export default function drawAll() {
  background(255);
  push();
  drawFan();
  drawGrid(false, 0);
  if (state.waterOn) {
    state.waterFlowCoordinate += 1;
  } else {
    state.waterFlowCoordinate = 0;
  }
  drawGrid(true, constrain(state.waterFlowCoordinate, 0, 100));
  drawWaterDistributor();
  pop();
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