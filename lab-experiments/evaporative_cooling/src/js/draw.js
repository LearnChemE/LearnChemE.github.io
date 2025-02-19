const coolerLocation = [90, 26];
const bladeLength = 15;
const beakerCoordinate = [90, 81];
const beakerWidth = 25;
window.beakerHeight = 32;
const knobDiameter = 12;
const pumpSwitchCenter = [beakerCoordinate[0] - 50 - 12, beakerCoordinate[1] - beakerHeight / 2 - 5.25 + 28];
const fanSwitchCenter = [coolerLocation[0] + bladeLength * 3.15, coolerLocation[1] - bladeLength * 1.25];
const bladeRadius = () => { return sqrt(bladeLength ** 2 + (sin(radians(bladeLength) * bladeLength / 20) * 15) ** 2) }

export default function drawAll() {
  background(255);
  drawFan();
  drawGrid(false, 0);
  drawGrid(true, state.flowState[10]);
  drawWater(state.pumpOn);
  drawIntakeHose();
  drawOutletHose();
  drawPump();
  drawBeaker();
  drawWaterDistributor();
}

function drawWater(pumpOn) {
  const flowRate = state.valvePosition;
  const waterFill = "rgba(180, 180, 255, 1)";
  const bc = beakerCoordinate;
  const bw = beakerWidth;
  const bh = beakerHeight;
  const cl = coolerLocation;
  const bl = bladeLength;
  const s = state.flowState;
  push();
  fill(waterFill);
  noStroke();

  let totalWaterInSystem = 0;

  state.flowState.forEach((waterLevel, index) => {
    if (index === 12) {
      totalWaterInSystem += waterLevel * 10;
    } else if (index === 10 && waterLevel > 100) {
      totalWaterInSystem += 200 - waterLevel
    } else {
      totalWaterInSystem += waterLevel;
    }
  });

  state.beakerWaterLevel = 1000 - totalWaterInSystem / 12;

  if (pumpOn && state.valvePosition > 0) {
    const check1 = s[0] === beakerHeight;
    const check2 = s[1] === 30 && check1;
    const check3 = s[2] === 20 && check2;
    const check4 = s[3] === 50 && check3;
    const check5 = s[4] === 49 && check4;
    const check6 = s[10] === 100 && check5;
    const check7 = s[11] === 12.4 && check6;
    const check8 = s[12] > 0 && check7;
    if (s[0] <= beakerHeight) {
      s[0] = min(s[0] + flowRate, beakerHeight);
      push();
      translate(bc[0], bc[1]);
      rect(-beakerWidth / 2 + 1.65, beakerHeight / 2 - 3, 2.2, -s[0]);
      pop();
    }
    if (check1 && s[1] <= 30) {
      s[1] = min(s[1] + flowRate, 30);
      push();
      translate(bc[0], bc[1]);
      rect(-beakerWidth / 2 + 1.5, -beakerHeight / 2 - 6.35, -s[1], 2.2);
      pop();
    }
    if (check2 && s[2] <= 20) {
      s[2] = min(s[2] + flowRate, 20);
      push();
      translate(bc[0] - 50, bc[1] - bh / 2 - 5.25);
      rect(0, -1.1, -s[2], 2.2);
      pop();
    }
    if (check3 && s[3] <= 50) {
      s[3] = min(s[3] + flowRate, 50);
      push();
      translate(bc[0] - 50, bc[1] - bh / 2 - 5.25);
      rect(-22.85, -2, 2.2, -s[3]);
      pop();
    }
    if (check4 && s[4] <= 49) {
      s[4] = min(s[4] + flowRate, 49);
      push();
      translate(bc[0] - 50, bc[1] - bh / 2 - 5.25);
      rect(-20, -55.6, s[4], 2.2);
      pop();
    }

    push();
    translate(cl[0], cl[1]);

    if (check5 && s[5] <= 38.5) {
      s[5] = min(s[5] + flowRate, 38.5);
      rect(-20, -22.35, s[5], 3.5);
      const offset = 3;
      if (s[5] > offset) {
        rect(-20 + offset, -18.9, s[5] - offset, 0.72);
      }
    }

    if (check5 && s[5] > 5.125) {
      s[6] = min(s[6] + 1, 2);
      rect((-17 + -9.75) / 2 - 1, -17.85, 1.5, s[6]);
    }

    if (check5 && s[5] > 13.875) {
      s[7] = min(s[7] + 1, 2);
      rect((-8.25 + -0.75) / 2 - 1, -17.85, 1.5, s[7]);
    }

    if (check5 && s[5] > 22.625) {
      s[8] = min(s[8] + 1, 2);
      rect((0.75 + 8.25) / 2 - 1, -17.85, 1.5, s[8]);
    }

    if (check5 && s[5] > 31.375) {
      s[9] = min(s[9] + 1, 2);
      rect((9.75 + 17) / 2 - 1, -17.85, 1.5, s[9]);
    }

    if (check5 && s[5] > 18.25) {
      s[10] = min(s[10] + 1, 100);
    }

    if (check6) {
      s[11] = min(s[11] + 1, 12.4);
      rect(-14, 16.5, 1.5, s[11])
      rect(-11.5, 16.5, 1.5, s[11])
      rect(-7.75, 16.5, 1.5, s[11])
      rect(-4, 16.5, 1.5, s[11])
      rect(1.5, 16.5, 1.5, s[11])
      rect(4, 16.5, 1.5, s[11])
      rect(7.8, 16.5, 1.5, s[11])
      rect(11, 16.5, 1.5, s[11])
      rect(13, 16.5, 1.5, s[11])
    }

    if (check7) {
      const inverseFullness = Math.max((8 - s[12]), 0.0001) / 8;

      state.reservoirVolume = 100 * (1 - inverseFullness);

      s[12] = min(s[12] + inverseFullness * flowRate / 100, 8);
      rect(-1.5, 30.5, 3, -s[12]);
      if (s[12] > 1.5) {
        rect(-17, 29, 34, -s[12] + 1.5);
      }
    }

    if (check8) {
      s[13] = min(s[13] + 1, 16.43 + (beakerHeight * 10 / 11 * 8 / 10) * (1000 - state.beakerWaterLevel) / 1000);
    }

    fill("rgba(100, 100, 255, 0.4)");
    rect(-1.5, 30.5, 3, s[13]);

    pop();

    if (check5) {
      state.waterOnMesh = true;
    }

    if (check6) {
      state.waterInReservoir = true;
    }
  } else {
    push();
    translate(cl[0], cl[1]);

    if (s[5] > 0) {
      s[5] = max(s[5] - 1, 0);
      rect(-20, -22.35 + 3.5 * (38.5 - s[5]) / 38.5, 38.5, 3.5 - 3.5 * (38.5 - s[5]) / 38.5);
    } else {
      s[6] = max(s[6] - 1, 0);
      s[7] = max(s[7] - 1, 0);
      s[8] = max(s[8] - 1, 0);
      s[9] = max(s[9] - 1, 0);
    }

    if (s[6] > 0) {
      rect((-17 + -9.75) / 2 - 1, -16.35, 2, -s[6]);
      rect((-8.25 + -0.75) / 2 - 1, -16.35, 2, -s[7]);
      rect((0.75 + 8.25) / 2 - 1, -16.35, 2, -s[8]);
      rect((9.75 + 17) / 2 - 1, -16.35, 2, -s[9]);
    }

    pop();

    push();

    translate(bc[0], bc[1]);

    if (s[4] > 0) {
      s[4] = max(s[4] - flowRate, 0);
      push();
      translate(-50, -bh / 2 - 5.25);
      rect(-20, -55.6, s[4], 2.2);
      pop();
    }

    if (s[4] === 0) {
      s[3] = max(s[3] - flowRate, 0);
    }

    if (s[3] === 0) {
      s[2] = max(s[2] - flowRate, 0);
    }

    if (s[2] === 0) {
      s[1] = max(s[1] - flowRate, 0);
    }

    if (s[1] === 0) {
      s[0] = max(s[0] - flowRate, 0);
    }

    if (s[0] > 0) {
      rect(-beakerWidth / 2 + 1.65, beakerHeight / 2 - 3, 2.2, -s[0]);
    }

    if (s[1] > 0) {
      rect(-beakerWidth / 2 + 1.5, -beakerHeight / 2 - 6.35, -s[1], 2.2);
    }

    if (s[2] > 0) {
      push();
      translate(-50, -bh / 2 - 5.25);
      rect(0, -1.1, -s[2], 2.2);
      pop();
    }

    if (s[3] > 0) {
      push();
      translate(-50, -bh / 2 - 5.25);
      rect(-22.85, -2, 2.2, -s[3]);
      pop();
    }

    if (s[6] === 0 && s[10] !== 0) {
      s[10] = min(s[10] + 1, 200);
      if (s[10] === 200) {
        s[10] = 0;
      }
    }

    pop();

    push();

    translate(cl[0], cl[1]);

    if (s[10] === 0) {
      s[11] = max(s[11] - 1, 0);
    }

    rect(-14, 28.9, 1.5, -s[11])
    rect(-11.5, 28.9, 1.5, -s[11])
    rect(-7.75, 28.9, 1.5, -s[11])
    rect(-4, 28.9, 1.5, -s[11])
    rect(1.5, 28.9, 1.5, -s[11])
    rect(4, 28.9, 1.5, -s[11])
    rect(7.8, 28.9, 1.5, -s[11])
    rect(11, 28.9, 1.5, -s[11])
    rect(13, 28.9, 1.5, -s[11])

    const fullness = Math.max(s[12], 5);

    state.reservoirVolume = 100 * (1 - (8 - s[12]) / 8);

    if (s[11] === 0) {
      s[12] = max(s[12] - fullness / 200, 0);
    }

    rect(-1.5, 30.5, 3, -s[12]);
    if (s[12] > 1.5) {
      rect(-17, 29, 34, -s[12] + 1.5);
    }

    if (s[12] === 0) {
      s[13] = max(s[13] - 1, 0);
    } else {
      s[13] = 16.43 + (beakerHeight * 10 / 11 * 8 / 10) * (1000 - state.beakerWaterLevel) / 1000
    }

    const beakerWaterCoord = 30.5 + 16.43 + (beakerHeight * 10 / 11 * 8 / 10) * (1000 - state.beakerWaterLevel) / 1000;

    fill("rgba(100, 100, 255, 0.4)");
    rect(-1.5, beakerWaterCoord, 3, -s[13]);

    pop();

    if (s[10] === 0) {
      state.waterOnMesh = false;
    }

    if (s[12] === 0) {
      state.waterInReservoir = false;
    }
  }
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

  if (waterFlowCoordinate <= 100) {
    vertex(-16.65, -16.125);
    vertex(16.65, -16.125);
    if (waterPresent) {
      vertex(16.65, -16.125 + waterFlowCoordinate * 32.25 / 100);
      vertex(-16.65, -16.125 + waterFlowCoordinate * 32.25 / 100);
    } else {
      vertex(16.65, 16.125);
      vertex(-16.65, 16.125);
    }
  } else {
    vertex(16.65, 16.125);
    vertex(-16.65, 16.125);
    if (waterPresent) {
      vertex(-16.65, -16.125 + (waterFlowCoordinate - 100) * 32.25 / 100);
      vertex(16.65, -16.125 + (waterFlowCoordinate - 100) * 32.25 / 100);
    } else {
      vertex(-16.65, -16.125);
      vertex(16.65, -16.125);
    }
  }

  const s = waterPresent ? 0.5 : 1;
  const maxRows = waterPresent ? constrain(waterFlowCoordinate / 100 * 10, 0, 10) : 10;
  const minRows = waterPresent ? constrain(round((waterFlowCoordinate - 100) / 100 * 10), 0, 10) : 0;

  for (let i = 1; i < 15; i++) {
    for (let j = minRows + 1; j < maxRows; j++) {
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
    for (let j = minRows; j < maxRows; j++) {
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
  drawFanPowerSwitch();
  drawAirThermocouple();
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
  rotate(-1 * state.fanCount / 6);
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

function drawAirThermocouple() {
  push();
  translate(coolerLocation[0], coolerLocation[1]);
  const w = bladeLength;
  translate(w * 0.25, -w * 0.25);
  noFill();
  stroke(0);
  strokeWeight(1 / relativeSize());
  beginShape();
  vertex(0, 0);
  quadraticVertex(1.25 * w, w * 0.05, 1.75 * w, w * 0.25);
  quadraticVertex(2.5 * w, w * 0.5, 2.75 * w, w * 0.5);
  endShape();
  drawTemperatureAndHumidityMeter(
    state.airInletTemperature,
    state.ambientHumidity,
    w * 2.5, -w * 0.15,
    "Air In"
  );
  pop();
}

function drawTemperatureMeter(temp, x, y, str) {
  push();
  translate(x, y);
  const meterFill = "rgb(120, 120, 120)";
  const meterStroke = "rgb(0, 0, 0)";
  fill(meterFill);
  stroke(meterStroke);
  strokeWeight(0.5 / relativeSize());
  rect(0, 0, 15, 9, 0.75);
  fill(10);
  strokeWeight(1 / relativeSize());
  rectMode(CENTER);
  rect(7.5, 5.5, 11, 4);
  textAlign(CENTER, CENTER);
  stroke(0);
  fill(255);
  strokeWeight(0.75 / relativeSize());
  textSize(1.5 * relativeSize() ** 0.125);
  text(str, 7.5, 1.75);
  textFont(state.temperatureFont);
  noStroke();
  fill(255, 255, 0);
  textSize(2.5 * relativeSize() ** 0.125);
  textAlign(RIGHT, CENTER);
  let temperature;
  if (state.temperatureUnits === "C") {
    temperature = Math.round(temp);
  } else {
    temperature = Math.round(temp * 9 / 5 + 32);
  }
  text(temperature, 8, 5.5);
  textAlign(LEFT, CENTER);
  const units = state.temperatureUnits === "C" ? "C" : "F";
  text(units, 10, 5.5);
  textFont("Arial");
  textSize(1.75 * relativeSize() ** 0.125);
  text("°", 8.75, 5.5);
  pop();
}

function drawTemperatureAndHumidityMeter(temp, humidity, x, y, str) {
  push();
  translate(x, y);
  const meterFill = "rgb(120, 120, 120)";
  const meterStroke = "rgb(0, 0, 0)";
  fill(meterFill);
  stroke(meterStroke);
  strokeWeight(0.5 / relativeSize());
  rect(0, 0, 15, 18, 0.75);
  fill(10);
  strokeWeight(1 / relativeSize());
  rectMode(CENTER);
  rect(7.5, 5.5, 11, 4);
  rect(7.5, 13.5, 11, 4);
  textAlign(CENTER, CENTER);
  stroke(0);
  fill(255);
  strokeWeight(0.75 / relativeSize());
  textSize(1.5 * relativeSize() ** 0.125);
  text(str, 7.5, 1.75);
  textSize(1.35 * relativeSize() ** 0.125);
  text("Humidity (kg/m³)", 7.5, 9.75);
  textFont(state.temperatureFont);
  noStroke();
  fill(255, 255, 0);
  textSize(2.5 * relativeSize() ** 0.125);
  textAlign(RIGHT, CENTER);
  let temperature;
  if (state.temperatureUnits === "C") {
    temperature = Math.round(temp);
  } else {
    temperature = Math.round(temp * 9 / 5 + 32);
  }
  text(temperature, 8, 5.5);
  textAlign(CENTER, CENTER);
  text((Math.round(humidity * 1000) / 1000).toFixed(3), 8, 13.5);
  textAlign(LEFT, CENTER);
  const units = state.temperatureUnits === "C" ? "C" : "F";
  text(units, 10, 5.5);
  textFont("Arial");
  textSize(1.75 * relativeSize() ** 0.125);
  text("°", 8.75, 5.5);
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
  drawWaterInletTemperatureMeter();
  drawAirOutletTemperatureMeter();
  drawReservoirTemperatureMeter();
  const distributorFill = "rgba(240, 240, 240, 0.55)";
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

  const reservoirColor = "rgba(255, 255, 255, 0.5)";
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

function drawWaterInletTemperatureMeter() {
  push();
  stroke(0);
  noFill();
  strokeWeight(1 / relativeSize());
  beginShape();
  vertex(-12, -15);
  quadraticVertex(-25, -5.5, -30, -7);
  endShape();
  push();
  stroke(color("brown"))
  fill(color("gold"));
  strokeWeight(0.25 / relativeSize());
  translate(-12, -15.25);
  rotate(-PI / 6);
  rect(0, 0, 5, 1);
  pop();
  drawTemperatureMeter(
    state.apparatusTemperatureTop, -44, -12,
    "Water In"
  )
  pop();
}

function drawAirOutletTemperatureMeter() {
  push();
  stroke(0);
  noFill();
  strokeWeight(1 / relativeSize());
  beginShape();
  vertex(-5, 7);
  quadraticVertex(-25, 11, -30, 10);
  endShape();
  push();
  stroke(color("brown"))
  fill(color("gold"));
  strokeWeight(0.25 / relativeSize());
  rotate(-PI / 18);
  translate(-8, 5.5);
  rect(0, 0, 5, 1);
  pop();
  drawTemperatureAndHumidityMeter(
    state.airOutletTemperature,
    state.outletHumidity, -44, 5,
    "Air Out"
  )
  pop();
}

function drawReservoirTemperatureMeter() {
  push();
  stroke(0);
  noFill();
  strokeWeight(1 / relativeSize());
  beginShape();
  vertex(12, 25);
  quadraticVertex(13, 10, 30, 22);
  quadraticVertex(38, 27, 43, 19);
  endShape();
  push();
  stroke(color("brown"))
  fill(color("gold"));
  strokeWeight(0.25 / relativeSize());
  translate(11.7, 23.5);
  rect(0, 0, 1, 5);
  pop();
  drawTemperatureMeter(
    state.waterOutletTemperature, 39, 17,
    "Water Out"
  )
  pop();
}

function drawBeaker() {
  const beakerStroke = "rgba(0, 0, 0, 0.5)";
  const beakerFill = "rgba(230, 230, 230, 1)";
  const waterFill = "rgba(100, 100, 255, 0.4)";

  push();

  translate(beakerCoordinate[0], beakerCoordinate[1]);
  fill(waterFill);
  noStroke();

  const beakerPx = (state.beakerWaterLevel / 1000) * beakerHeight * 10 / 11 * 8 / 10;
  rect(-beakerWidth / 2 - 1, beakerHeight / 2 - 0.8, beakerWidth + 2, -beakerPx);

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

  textSize(1.25 * relativeSize() ** 0.125);
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

  drawBeakerThermocouple();
  pop();
}

function drawBeakerThermocouple() {
  push();
  const w = beakerWidth;
  translate(-w / 2, beakerHeight / 2 - 1.7);
  noFill();
  stroke(0);
  strokeWeight(1 / relativeSize());
  beginShape();
  vertex(5 * w / 8, 0);
  quadraticVertex(3 * w / 8, -beakerHeight * 1.7, w * 1.85, -beakerHeight * 0.9);
  endShape();
  push();
  stroke(color("brown"))
  fill(color("gold"));
  strokeWeight(0.25 / relativeSize());
  translate(w * 0.59, -beakerHeight * 0.15);
  rotate(-PI / 38);
  rect(0, 0, 1, 5);
  pop();
  drawTemperatureMeter(
    state.beakerTemperature, 45, -beakerHeight,
    "Beaker"
  )
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

function drawOutletHose() {
  push();
  translate(beakerCoordinate[0] - 50, beakerCoordinate[1] - beakerHeight / 2 - 5.25);
  const outletTubeFill = "rgba(240, 240, 240, 0.5)";
  const outletTubeStroke = "rgba(150, 150, 150, 0.8)";
  fill(outletTubeFill);
  stroke(outletTubeStroke);
  strokeWeight(0.5 / relativeSize());
  rect(0, -1.25, -20, 2.5, 0.5);
  rect(-23, -2, 2.5, -50, 0.5);
  rect(-20, -55.75, 49, 2.5, 0.5);
  fill(255);
  stroke(200);
  translate(-20, 0);
  beginShape();
  vertex(1, -1.5);
  vertex(1, 1.5);
  vertex(0, 1.5);
  vertex(0, 1.25);
  for (let i = 10; i < 90; i += 10) {
    vertex(cos(radians(i + 90)) * 3, sin(radians(i + 90)) * 3 - 1.75);
  }
  vertex(-3, -1.75);
  vertex(-3.25, -1.75);
  vertex(-3.25, -2.75);
  vertex(-0.25, -2.75);
  vertex(-0.25, -1.75);
  vertex(-0.5, -1.75);
  vertex(-0.5, -1.25);
  vertex(0, -1.25);
  vertex(0, -1.5);
  endShape(CLOSE);
  translate(-3.5, -51.5);
  beginShape();
  vertex(0, 0);
  vertex(3.5, 0);
  vertex(3.5, -1);
  vertex(3.25, -1);
  vertex(3.25, -1.5);
  vertex(3.75, -1.5);
  vertex(3.75, -1.25);
  vertex(4.75, -1.25);
  vertex(4.75, -4.75);
  vertex(3.75, -4.75);
  vertex(3.75, -4.5);
  vertex(3.25, -4.5);
  for (let i = 10; i < 90; i += 10) {
    vertex(cos(radians(i + 90)) * 3 + 3.25, -sin(radians(i + 90)) * 3 - 1.5);
  }
  vertex(0.25, -1);
  vertex(0, -1);
  endShape(CLOSE);
  pop();
}

function drawPump() {
  push();
  translate(beakerCoordinate[0] - 50, beakerCoordinate[1] - beakerHeight / 2 - 5.25);
  drawPumpPowerSwitch();
  strokeWeight(0.25 / relativeSize());
  rectMode(CENTER);
  fill(220);
  stroke(0);
  rect(8, 0, 20, 8, 1);
  drawPumpKnob();
  drawPumpLabel();
  pop();
}

function drawPumpLabel() {
  push();
  translate(8, -6);
  // noFill();
  // stroke(0);
  // strokeWeight(0.25 / relativeSize());

  // beginShape();
  // for (let i = 0; i < 90; i++) {
  //   vertex(-cos(radians(i)) * 6, -sin(radians(i)) * 5);
  // }
  // endShape();

  noStroke();
  fill(0);
  // triangle(-6, 0, -6.5, -0.8, -5.5, -0.8);
  // triangle(0, -4.9, -0.8, -5.4, -0.8, -4.4);

  textSize(1.5 * relativeSize() ** 0.125);
  // textAlign(RIGHT, CENTER);
  // text("OPEN", -8, 0);
  // textAlign(LEFT, CENTER);
  // text("CLOSE", 2, -6);
  textAlign(CENTER, TOP);
  text("PUMP POWER", -20, 40);
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

function drawPumpPowerSwitch() {
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
  if (x > pumpSwitchCenter[0] - 19 && x < pumpSwitchCenter[0] + 19 && y > pumpSwitchCenter[1] - 8 && y < pumpSwitchCenter[1] + 4) {
    stroke(150, 150, 0);
    strokeWeight(1 / relativeSize());
  } else {
    stroke(0);
  }
  push();
  translate(-20, 24);
  rectMode(CORNER);
  fill(40);
  if (state.pumpOn) {
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
  textSize(1.5 * relativeSize() ** 0.125);
  textAlign(CENTER, CENTER);
  text("OFF", -24, 28);
  text("ON", -16, 28);
  pop();
}

function drawFanPowerSwitch() {
  push();
  const w = bladeLength;
  translate(coolerLocation[0], coolerLocation[1] + 2);
  noFill();
  stroke(0);
  strokeWeight(1 / relativeSize());
  beginShape();
  vertex(w, -w);
  quadraticVertex(w * 1.5, -w, w * 2, -7 * w / 6);
  quadraticVertex(w * 2.5, -w * 1.35, w * 3, -4 * w / 3);
  endShape();
  rectMode(CENTER);
  push();
  const buttonFill = color(30);
  const switchFill1 = color(80);
  const switchFill2 = color(90);
  let switchStroke = color(0);
  fill(buttonFill);
  const x = mouseX / relativeSize();
  const y = mouseY / relativeSize();
  const dx = x - fanSwitchCenter[0];
  const dy = y - fanSwitchCenter[1];
  if (abs(dx) < w * 15 / 24 && abs(dy) < w * 5 / 12) {
    switchStroke = color(150, 150, 0);
    strokeWeight(1 / relativeSize());
  }
  stroke(switchStroke);
  translate(w * 3.15, -w * 1.5);
  if (state.fanOn) {
    rotate(2 * PI / 3);
  } else {
    rotate(PI / 3);
  }
  translate(-w * 0.125, 0);
  rect(0, 0, w / 3, w / 8, 0.5);
  pop();
  stroke(switchStroke);
  fill(switchFill1);
  translate(w * 2.65, -w * 1.5);
  rect(w / 2, 0, w * 0.55, w * 0.1625, 0.5);
  fill(switchFill2);
  strokeWeight(0.5 / relativeSize());
  rect(w / 2, w / 5, w * 1.3, w * 0.5, 2);
  strokeWeight(0.25 / relativeSize());
  fill(255);
  textSize(1.5 * relativeSize() ** 0.125);
  textAlign(CENTER, CENTER);
  text("OFF", w * 0.25, w * 0.2);
  text("ON", w * 0.8, w * 0.2);
  fill(0);
  noStroke();
  textAlign(CENTER, TOP);
  text("FAN POWER", w * 0.525, w * 0.55);
  pop();
}

window.mousePressed = () => {
  const x = mouseX / relativeSize();
  const y = mouseY / relativeSize();
  const distanceFromKnob = dist(x, y, beakerCoordinate[0] - 50 + 8, beakerCoordinate[1] - beakerHeight / 2 - 5.25);
  // if (distanceFromKnob < knobDiameter / 2 + 1.5) {
  //   state.onKnob = true;
  //   state.valvePositionStart = state.valvePosition;
  //   state.mousePositionStart = [x, y];
  // }
  if (x > pumpSwitchCenter[0] - 19 && x < pumpSwitchCenter[0] + 19 && y > pumpSwitchCenter[1] - 8 && y < pumpSwitchCenter[1] + 4) {
    state.pumpOn = !state.pumpOn;
  }
  if (abs(x - fanSwitchCenter[0]) < bladeLength * 15 / 24 && abs(y - fanSwitchCenter[1]) < bladeLength * 5 / 12) {
    state.fanOn = !state.fanOn;
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