import { calcAll } from "./calcs.js";

function drawPump(x, y, scaleX, scaleY) {
  push();
  translate(x, y);
  translate(0, 19);
  scale(scaleX, scaleY);
  const pumpColor = "rgb(180, 180, 255)";
  const pumpStroke = "rgb(140, 140, 225)";
  fill(pumpColor);
  stroke(pumpStroke);
  strokeWeight(0.15);

  // Pump nose
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

  // Pump nose supports
  strokeWeight(0.4);
  line(4, -2, 7, -3);
  line(-2, 0, 7, 0);
  line(4, 2, 7, 3);

  // Pump legs
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

  // Pump body
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

  // Pump heat sink
  strokeWeight(0.1);
  fill("rgb(200, 200, 255)");
  stroke("rgb(100, 100, 190)");
  rectMode(CENTER);
  for (let i = 0; i < 13; i++) {
    rect(22.5, -6 + i, 10, 0.25 + abs(i - 6) * 0.075);
  }

  // Pump body supports
  stroke(pumpStroke);
  strokeWeight(0.4);
  line(9, -3, 11, -3);
  line(9, 0, 11, 0);
  line(9, 3, 11, 3);

  // Pump base
  strokeWeight(0.15);
  fill("rgb(160, 160, 245)");
  rectMode(CORNER);
  rect(-2, 8, 34, 2, 0.25);

  // Pump outlet
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

  // Pump power cable
  const cableColor = "rgb(40, 40, 40)";

  noFill();
  stroke(cableColor);
  strokeWeight(0.3);

  beginShape();
  vertex(30.5, 0);
  quadraticVertex(33, 0, 35, -2);
  quadraticVertex(40, -8, 35.5, -13);
  quadraticVertex(31, -18, 18, -13);
  endShape();

  drawPumpSwitch(4, 5, x + 13, y + 18.5);
  pop();
}

function drawPumpSwitch(offsetX, offsetY, cursorX, cursorY) {
  translate(offsetX, offsetY);
  strokeWeight(0.1);
  const mX = mouseX / relativeSize();
  const mY = mouseY / relativeSize();
  if (mX > cursorX && mX < cursorX + 15 && mY > cursorY && mY < cursorY + 7.75) {
    state.hand = true;
    stroke("rgb(140, 140, 40)");
    strokeWeight(0.2);
  } else {
    stroke("rgb(20, 20, 20)");
  }
  push();
  fill("rgb(80, 80, 80)");
  translate(16.5, -18.75);
  if (state.pump.on) {
    rotate(-12 * PI / 32);
  } else {
    rotate(-20 * PI / 32);
  }
  rect(-1, -1, 7.5, 2, 0.5);
  pop();
  fill("rgb(60, 60, 60)");
  rectMode(CENTER, CENTER);
  rect(16.5, -21.5, 8, 1.5, 0.5);
  rect(16.5, -18.75, 13, 5.5, 1);
  stroke("rgb(150, 150, 150)");
  strokeWeight(0.05);
  fill("white");
  textSize(2.5);
  textAlign(CENTER, CENTER);
  text("off    on", 16.5, -18.75);
}

function drawInletPipe() {
  push();
  translate(state.pump.x, state.pump.y);
  translate(0, 19);
  stroke("rgb(40, 40, 40)");
  strokeWeight(0.1);
  fill("rgb(200, 200, 200)");

  // Horizontal pipe going into pump
  rect(-20, -2, 20, 4);

  // Mounting plate for said pipe
  rect(-3.25, -3.25, 0.75, 6.5);
  strokeWeight(0.05);
  for (let i = 0; i < 4; i++) {
    rect(-3.75, -2.75 + i * (27 / 16), 0.5);
  }


  strokeWeight(0.1);
  // Vertical pipe going out of pump
  rect(-1, -9.375, 4, -27);

  // Mounting plate for said pipe
  rect(-2.8725, -9.375, 7.75, 0.5);
  strokeWeight(0.05);
  for (let i = 0; i < 4; i++) {
    rect(-1.8725 + i * (33 / 16), -9.375, -0.5);
  }

  // Vertical pipe elbow joint
  strokeWeight(0.1);
  translate(0, -19);
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

  // Outlet horizontal pipe
  rect(5, -22.5, 40, 4);

  // Elbow joint supports
  rect(-1.5, -17.5, 5, 1);
  rect(4.5, -22.5 - 0.5, 1, 5);

  // Outlet pipe mounting plate on flash column
  rect(44.5, -24, 1, 7);
  strokeWeight(0.05);
  for (let i = 0; i < 4; i++) {
    rect(44, -23.5 + i * (15 / 8), 0.5);
  }

  translate(-20, 19);
  strokeWeight(0.1);

  // Inlet pipe elbow joint
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

  // Inlet pipe elbow joint supports
  rect(-1, -2.5, 1, 5);
  rect(-6.5, -4, 5, 1);

  // Inlet vertical pipe
  rect(-6, -4, 4, -20);

  // Inlet vertical pipe mounting plate
  rect(-7, -24.75, 6, 0.75);
  strokeWeight(0.05);
  for (let i = 0; i < 4; i++) {
    rect(-6.75 + i * 1.6725, -24, 0.5);
  }
  strokeWeight(0.1);

  // Feed tank front leg (here because it needs to be in front of inlet pipe)
  rect(5.5, -24.75, 3, 33);
  drawInletFlowMeter();
  pop();
}

function drawHeatExchanger() {
  push();
  translate(state.pump.x, state.pump.y);
  translate(38, -22);
  push();
  fill("rgb(150, 150, 150)");
  stroke(0);
  strokeWeight(0.05);
  translate(-6, -12);

  // Heat exchanger temperature controller
  push();
  translate(0, 3);
  rect(-6.5, -12, 15, 12, 2);
  fill(20);
  rect(-5, -10, 8, 4);
  const mX = mouseX / relativeSize();
  const mY = mouseY / relativeSize();

  if (mX > 62 && mX < 65 && mY < 52.75 && mY > 49.75) {
    fill("rgb(255, 50, 50)");
    state.hand = true;
    if (mouseIsPressed && frameCount % 10 === state.mousePressedFrameModulus) {
      state.heatExchanger.T = state.temperatureUnits === "C" ? constrain(state.heatExchanger.T - 1, state.heatExchanger.Tmin, state.heatExchanger.Tmax) : constrain(state.heatExchanger.T - 5 / 9 / 10, state.heatExchanger.Tmin, state.heatExchanger.Tmax);
      state.mousePressedTemperatureFrame = frameCount;
      state.heatExchanger.valvePosition = state.heatExchanger.T / state.heatExchanger.Tmax;
      calcAll();
    }
  } else {
    fill("rgb(255, 20, 20)");
  }

  // Left button
  rect(-3 + 1, -4.5, 3, 3, 0.25);

  if (mX > 62 + 3.5 && mX < 65 + 3.5 && mY < 52.75 && mY > 49.75) {
    fill("rgb(255, 50, 50)");
    state.hand = true;
    if (mouseIsPressed && frameCount % 10 === state.mousePressedFrameModulus) {
      state.heatExchanger.T = state.temperatureUnits === "C" ? constrain(state.heatExchanger.T + 1, state.heatExchanger.Tmin, state.heatExchanger.Tmax) : constrain(state.heatExchanger.T + 5 / 9 / 10, state.heatExchanger.Tmin, state.heatExchanger.Tmax);
      state.mousePressedTemperatureFrame = frameCount;
      state.heatExchanger.valvePosition = state.heatExchanger.T / state.heatExchanger.Tmax;
      calcAll();
    }
  } else {

    fill("rgb(255, 20, 20)");
  }

  // Right button
  rect(-3 + 4.5, -4.5, 3, 3, 0.25);

  fill("white");
  noStroke();
  textSize(1.75);
  textAlign(RIGHT, CENTER);
  push();
  textSize(3.5);
  text("▴", 4, -3.1);
  translate(1.55, -2.8);
  rotate(PI);
  text("▴", 3, 0);
  textSize(2.75);
  rotate(-PI);
  fill("black");
  text("°C", 5.5, -5);
  pop();
  push();
  textFont(state.meterFont);
  fill("yellow");
  textAlign(CENTER, CENTER);
  textSize(3);
  let T = state.temperatureUnits === "C" ? round(state.heatExchanger.T_current) : round(state.heatExchanger.T_current * 9 / 5 + 32);

  if (T > 480 && !(frameCount - state.mousePressedTemperatureFrame < 120)) {
    T = "off";
  }
  if (frameCount - state.mousePressedTemperatureFrame < 120) {
    if (state.temperatureUnits === "C") {
      T = round(state.heatExchanger.T).toFixed(0);
    } else {
      T = round(state.heatExchanger.T * 9 / 5 + 32).toFixed(0);
    }
    fill("red");
  }
  text(T, -1, -8);
  pop();
  pop();

  noFill();
  stroke(0);
  strokeWeight(0.2);

  // Temperature controller thermocouple cable
  beginShape();
  vertex(0, 3);
  vertex(0, 4);
  quadraticVertex(0, 6, -1.5, 7);
  quadraticVertex(-3, 7.5, -3, 8);
  endShape();
  pop();

  stroke("rgb(40, 40, 40)");
  strokeWeight(0.1);
  fill("rgb(200, 200, 200)");

  // Heat exchanger left/right mounting plates
  rect(-25, -2, 1, 7);
  rect(0, -2, 1, 7);
  strokeWeight(0.05);
  for (let i = 0; i < 4; i++) {
    rect(-25.5, -1.5 + i * (30 / 16), 0.5);
    rect(1, -1.5 + i * (30 / 16), 0.5);
  }

  fill("rgb(220, 220, 220)");
  strokeWeight(0.1);

  // Heat exchanger body
  rect(-24, -4, 24, 11, 0.25);

  fill("rgb(200, 200, 200)");

  // Heat exchanger top/bottom mounting plates
  rect(-23, -5, 5, 1);
  rect(-6, 7, 5, 1);

  // Heat exchanger steam pipes
  rect(-22, -5, 3, -30);
  rect(-5, 8, 3, 35);

  strokeWeight(0.05);

  // Heat exchanger top/bottom mounting plate bolts
  for (let i = 0; i < 3; i++) {
    rect(-22.25 + i * (12 / 8), -5.5, 0.5);
    rect(-5.25 + i * (12 / 8), 8, 0.5);
  }

  // Steam valve golden body
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

  fill("rgb(200, 200, 200)");
  stroke("rgb(100, 100, 100)");
  translate(5, 2.5);
  strokeWeight(0.05);

  // Steam valve pressure stem
  rect(0, -0.25, 8, 0.5);
  strokeWeight(0.1);

  // Steam valve support bracket
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

  // Steam valve diaphragm body
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

  fill("rgb(200, 200, 200)");
  stroke("rgb(150, 150, 150)");
  strokeWeight(0.05);

  // Steam valve diaphragm body bolts
  for (let i = 0; i < 7; i++) {
    rect(2, -6.5 + i * 2.0625, 0.5);
    rect(4, -6.5 + i * 2.0625, 0.5);
  }

  const p = state.heatExchanger.valvePosition;
  fill("gold");
  stroke("rgb(100, 100, 100)");
  strokeWeight(0.05);

  // Steam valve needle indicator
  rect(-6 + p * 3.5, -1.5, 0.25, 3);

  fill("rgb(150, 150, 40)");
  stroke("rgb(100, 100, 40)");
  translate(6.5, 0.625);

  // Steam in / steam out text labels and arrows
  fill(0);
  noStroke();
  textSize(2.5);
  textAlign(CENTER, CENTER);
  text("steam in", -19, 9.5);
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
  translate(-14, -5.75);
  noStroke();
  fill("rgb(200, 200, 255)");
  const liquidHeight = state.liquidHeight * 52;

  // Feed liquid
  rect(-14, -2, 28, -liquidHeight);
  stroke("rgb(40, 40, 40)");
  strokeWeight(0.1);
  fill("rgba(220, 220, 220, 0.2)");

  // Feed tank body
  rect(-14, -55, 28, 55);
  fill("rgb(200, 200, 200)");

  // Feed tank top and bottom support plates
  rect(-15, 0, 30, -2);
  rect(-15, -56, 30, 2);

  // Feed tank legs
  quad(-11, 0, -9, 0, -12, 32.75, -14, 32.75);
  quad(11, 0, 9, 0, 12, 32.75, 14, 32.75);
  pop();
}

function drawFlashDrum() {
  push();
  translate(state.pump.x, state.pump.y);
  translate(45.5, -20.5);
  noStroke();
  fill(`rgba(${round(255 - 25 * state.vaporDensity)}, ${round(255 - 25 * state.vaporDensity)}, 255, ${0.3 * state.vaporDensity})`);

  // Flash drum transparent vapor
  rect(0, -35, 20, 65);

  drawFlashLiquid();
  stroke("rgb(40, 40, 40)");
  strokeWeight(0.1);
  fill("rgba(220, 220, 220, 0.1)");

  // Flash drum body
  rect(0, -35, 20, 65);
  fill("rgb(200, 200, 200)");

  // Flash drum support plates and mounting bolts
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

  // Flash drum legs
  quad(1, 31, 3, 31, 1, 48, -1, 48);
  quad(19, 31, 17, 31, 19, 48, 21, 48);
  rect(9, 31, 2, 17);

  drawLiquidOutletPipe();
  drawFlashDrumTemperatureMeter();

  pop();
}

function drawFlashDrumTemperatureMeter() {
  push();
  translate(21, -12.5);
  noFill();
  stroke("rgb(20, 20, 20)");
  strokeWeight(0.2);

  // Thermocouple cable
  beginShape();
  vertex(-1, -10);
  quadraticVertex(2, -5.5, 5, -6);
  quadraticVertex(7, -6, 12, -7);
  endShape();

  // Flash column thermocouple
  fill("rgb(220, 180, 150)");
  stroke("rgb(120, 120, 120)");
  strokeWeight(0.1);
  rect(-4.5, -11, 3.75, 2);

  fill("rgb(150, 150, 150)");
  stroke(0);
  strokeWeight(0.05);
  translate(16, 1.5);

  // Body of the temperature meter
  rect(-6.5, -12, 15, 8.25, 2);
  fill(20);

  // Temperature meter display
  rect(-5.25, -10, 8, 4);

  noStroke();
  textAlign(CENTER, CENTER);
  textFont(state.meterFont);
  fill("yellow");
  textSize(3);
  const T = state.column.units === "C" ? state.column.T_current : state.column.T_current * 9 / 5 + 32;
  text(`${(round(T * 10) / 10).toFixed(1)}`, -1.25, -8);
  textSize(2.75);
  fill("black");
  textFont("Arial");
  text("°C", 5.5, -7.5);
  pop();
}

function handleReadouts() {
  // Logic for showing what to display on the readouts
  if (!state.pump.on && frameCount % 60 === 0) {
    state.mF_current = state.mF_current * 0.2;
    state.heatExchanger.T_current = state.heatExchanger.T_current + (500 - state.heatExchanger.T_current) * 0.4;
  }
  if (state.liquidFlow.timeCoordinate > 0 && state.liquidFlow.timeCoordinate <= 1) {
    if (frameCount % 60 === 0) {
      state.column.T_current = state.column.T_current + (state.column.T - state.column.T_current) * 0.1;
      state.pressureController.P_current = state.pressureController.P_current + (state.pressureController.P - state.pressureController.P_current) * 0.1;
      state.mL_current = state.mL_current + (state.mL - state.mL_current) * 0.6;
    }
  } else {
    if (frameCount % 60 === 0) {
      state.column.T_current = state.column.T_current - (state.column.T_current - 22) * 0.1;
      state.pressureController.P_current = state.pressureController.P_current - (state.pressureController.P_current - 1) * 0.1;
      state.mL_current = state.mL_current - (state.mL_current - 0) * 0.6;
    }
  }
}

function drawFlashLiquid() {
  push();

  // Logic for the time coordinates of liquid flow and vapor "bubbles"
  if (state.pump.on) {
    state.liquidFlow.timeCoordinate = constrain(state.liquidFlow.timeCoordinate + 0.02, -1, 1);
    state.liquidHeight -= 0.000025;
    if (frameCount % 60 === 0) {
      state.mF_current = state.mF_current + (state.mF - state.mF_current) * 0.7;
      state.heatExchanger.T_current = state.heatExchanger.T_current + (state.heatExchanger.T - state.heatExchanger.T_current) * 0.4;
    }
  } else if (state.liquidFlow.timeCoordinate > 0 && !state.pump.on) {
    state.liquidFlow.timeCoordinate = constrain(state.liquidFlow.timeCoordinate + 0.02, 0, 2);
  }

  handleReadouts();

  let t = state.liquidFlow.timeCoordinate;
  noFill();
  stroke("rgb(200, 200, 255)");

  // Make inlet stream thickness inverse to the amount of liquid flashed to vapor
  const liquidThickness = 4 * (state.mL / state.mF);
  strokeWeight(liquidThickness);

  // Only draw the vapor "bubbles" about a second after the pump is turned on, and stop drawing new bubbles after the pump is turned off
  if (abs(t) < 0.001) {
    state.bubbleFrame = frameCount;
  } else if (abs(t) > 1.01 && abs(t) < 1.03) {
    state.bubbleEndTime = frameCount;
  }

  if (t > 0) {

    // Draw the liquid flow and liquid stream being "spit out" when the pump is turned off
    if (t < 2) {
      beginShape();
      if (t <= 1) {
        vertex(-4, 0);
        vertex(-1, 0);
        quadraticVertex(-1 + 10 * t, t, -1 + constrain(t, 0, 0.8) * 15, constrain(t - 0.1, 0, 1) * 32);
      } else {
        vertex(1 + 13 * (t - 1), 29 * (t - 1));
        quadraticVertex(-2 + 10 * t, 6 + (t - 1) * 25, -1 + constrain(t, 0, 0.8) * 15, constrain(t - 0.1, 0, 1) * 28);
      }
      endShape();
    }
    push();

    // This prevents the bubbles from occupying random coordinates every single frame
    randomSeed(1578459);

    const numberOfBubbles = 100 * (state.mV / state.mF) - 1;

    // Draw the vapor bubbles
    for (let i = 0; i < numberOfBubbles; i++) {
      push();

      // It takes a total of 4 seconds (240 frames) for the vapor to escape and disappear
      let m = random(0, 1) * (frameCount - state.bubbleFrame) % 240;

      // Logic for the vapor to stop coming out of the pipe when the pump is turned off
      if (t > 1) {
        const timeLeft = constrain((240 - (frameCount - state.bubbleEndTime)) / 240, 0, 1);
        if (timeLeft === 0) {
          state.liquidFlow.timeCoordinate = -1;
        }
        m = constrain(m, (1 - timeLeft) * 240, 240);
      }
      fill(`rgba(230, 230, 255, ${1 - m / 240})`);
      noStroke();
      const offsetX = random(5, 20);
      const offsetY = random(-10, 10);
      const c = m / 240;
      const bubbleSizeOffset = state.mV / state.mF;

      // Draw the vapor bubbles
      circle(offsetX * c ** 0.45, (-25 + offsetY) * c, 2.5 + 4.5 * c + bubbleSizeOffset);
      pop();
    }
    pop();
  }

  // Draw the liquid at the bottom of the flash drum
  if (t >= 1 && state.pump.on) {
    const maxLiquidHeight = 15 * (state.mL / state.mF)
    const l = state.liquidFlow.liquidHeight;
    state.liquidFlow.liquidHeight = l + (maxLiquidHeight - l) * 0.002;
    state.vaporDensity = state.vaporDensity + (1 - state.vaporDensity) * 0.02;
  } else {
    const l = state.liquidFlow.liquidHeight;
    state.liquidFlow.liquidHeight = constrain(l - 0.05, 0, 15);
    state.vaporDensity = state.vaporDensity - state.vaporDensity * 0.02;
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
  strokeWeight(0.1);
  translate(20, 1.5);
  push();
  fill("rgb(200, 200, 200)");
  stroke("rgb(40, 40, 40)");
  translate(-15, -13);

  // Horizontal vapor outlet pipe
  rect(-13, -1.5, 52, 3);
  push();
  translate(12, 0);
  translate(-24, 0);

  // Vapor outlet elbow joint
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

  // Vapor outlet vertical pipe
  rect(-4.25, 3, 3, 2.5);

  // Vapor outlet elbow joint supports
  rect(0, -2, 1, 4);
  rect(-4.75, 2.5, 4, 1);
  pop();
  pop();

  push();
  translate(-15, -13);
  fill("rgb(150, 150, 40)");
  stroke("rgb(100, 100, 40)");
  strokeWeight(0.1);
  rotate(-PI / 2);

  // Vapor outlet backpressure valve golden body
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
  fill("rgb(200, 200, 200)");
  stroke("rgb(100, 100, 100)");
  translate(5, 2.5);
  strokeWeight(0.05);

  // Vapor outlet backpressure valve pressure stem
  rect(0, -0.25, 8, 0.5);
  strokeWeight(0.1);

  // Vapor outlet backpressure valve support bracket
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

  // Vapor outlet backpressure valve diaphragm body
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
  fill("rgb(200, 200, 200)");
  stroke("rgb(150, 150, 150)");
  strokeWeight(0.05);

  // Vapor outlet backpressure valve diaphragm body bolts
  for (let i = 0; i < 7; i++) {
    rect(2, -6.5 + i * 2.0625, 0.5);
    rect(4, -6.5 + i * 2.0625, 0.5);
  }
  const p = state.pressureController.valvePosition;
  fill("gold");
  stroke("rgb(100, 100, 100)");
  strokeWeight(0.05);

  // Vapor outlet backpressure valve needle indicator
  rect(-6 + p * 3.5, -1.5, 0.25, 3);
  pop();

  // Draw the pressure controller
  push();
  translate(-30, -8);
  fill("rgb(150, 150, 150)");
  stroke(0);
  strokeWeight(0.05);
  translate(-13, -2);

  // Pressure controller body
  rect(-6.5, -12, 15, 12, 2);
  fill(20);

  // Pressure readout
  rect(-5, -10, 8, 4);
  const mX = mouseX / relativeSize();
  const mY = mouseY / relativeSize();

  if (mX > 72.75 && mX < 75.75 && mY < 25.25 && mY > 22.25) {
    state.hand = true;
    fill("rgb(255, 50, 50)");
    if (mouseIsPressed && frameCount % 10 === state.mousePressedFrameModulus) {
      state.pressureController.P = state.pressureUnits === "atm" ? constrain(state.pressureController.P - 0.01, state.pressureController.Pmin, state.pressureController.Pmax) : constrain(state.pressureController.P - 0.01 * 100000 / 101325, state.pressureController.Pmin, state.pressureController.Pmax);
      state.pressureController.valvePosition = 0.2 + (state.pressureController.Pmax - state.pressureController.P) * 0.8;
      state.mousePressedPressureFrame = frameCount;
      calcAll();
    }
  } else {

    fill("rgb(255, 20, 20)");
  }

  // Left button
  rect(-3 + 1, -4.5, 3, 3, 0.25);

  if (mX > 72.75 + 3.5 && mX < 75.75 + 3.5 && mY < 25.25 && mY > 22.25) {
    fill("rgb(255, 50, 50)");
    state.hand = true;
    if (mouseIsPressed && frameCount % 10 === state.mousePressedFrameModulus) {
      state.pressureController.P = state.pressureUnits === "atm" ? constrain(state.pressureController.P + 0.01, state.pressureController.Pmin, state.pressureController.Pmax) : constrain(state.pressureController.P + 0.01 * 100000 / 101325, state.pressureController.Pmin, state.pressureController.Pmax);
      state.mousePressedPressureFrame = frameCount;
      state.pressureController.valvePosition = 0.2 + (state.pressureController.Pmax - state.pressureController.P) * 0.8;
      calcAll();
    }
  } else {

    fill("rgb(255, 20, 20)");
  }

  // Right button
  rect(-3 + 4.5, -4.5, 3, 3, 0.25);

  // Text on the buttons
  fill("white");
  noStroke();
  textSize(1.75);
  textAlign(RIGHT, CENTER);
  push();
  textSize(3.5);
  text("▴", 4, -3.1);
  translate(1.55, -2.8);
  rotate(PI);
  text("▴", 3, 0);
  rotate(-PI);
  textSize(2.75);
  fill("black");
  text("bar", 6.125, -5);
  pop();

  // Text on the readout
  textAlign(CENTER, CENTER);
  textFont(state.meterFont);
  fill("yellow");
  textSize(3);
  let P = state.pressureUnits === "atm" ? state.pressureController.P_current : state.pressureController.P_current * 101325 / 100000;
  if (frameCount - state.mousePressedPressureFrame < 120) {
    P = state.pressureUnits === "atm" ? state.pressureController.P : state.pressureController.P * 101325 / 100000;
    fill("red");
  }
  text(`${(round(P * 100) / 100).toFixed(2)}`, -1, -8);
  noFill();
  stroke(0);
  strokeWeight(0.2);

  // Pressure controller cable
  beginShape();
  vertex(0, 0);
  vertex(0, 2);
  quadraticVertex(0, 6, 0.75, 7);
  quadraticVertex(2, 9.5, 3, 8.5);
  endShape();

  // Pressure transducer
  fill("rgb(180, 180, 180)");
  stroke("rgb(100, 100, 100)");
  strokeWeight(0.05);
  rect(3.0675, 8, 2.5, 1);
  fill(150);
  stroke(80);
  rect(5.5675, 8.25, 0.25, 0.5);

  pop();
  pop();
}

function drawLiquidOutletPipe() {
  push();
  translate(20, 37);
  // Vertical pipe mounting plate
  rect(-7, -6, 5, 1);

  // Horizontal pipe
  rect(-2, 0, 45, 3);

  // Vertical pipe
  rect(-6, -5, 3, 4);
  strokeWeight(0.05);

  // Mounting plate bolts
  for (let i = 0; i < 3; i++) {
    rect(-6.5 + i * 1.75, -5, 0.5);
  }
  strokeWeight(0.1);
  translate(-6, 0);

  // Elbow joint
  beginShape();
  vertex(0, -0.5);
  for (let i = 0; i <= 90; i += 10) {
    const x = 3.5 - 3.5 * cos(radians(i));
    const y = -0.5 + 3.5 * sin(radians(i));
    vertex(x, y);
  }
  vertex(3.5, -0.5);
  endShape();

  // Elbow joint supports
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

  // Dark grey caps on the ends of the mass flow meter
  rect(-5, 0, 2, 5, 0.5);
  rect(5, 0, 2, 5, 0.5);
  fill("rgb(240, 240, 240)");

  // Body of the mass flow meter
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

  // Middle dark grey cap
  rect(0, -1, 5, 6, 0.5);
  rectMode(CORNER);

  // Cable support
  rect(-1, -4.5, 2, 0.5);
  quad(-0.75, -4.5, -0.5, -6, 0.5, -6, 0.75, -4.5);
  noFill();
  stroke(0);
  strokeWeight(0.2);

  // Cable
  beginShape();
  vertex(0, -6);
  quadraticVertex(2, -10, 6, -8);
  quadraticVertex(10, -5, 15, -7);
  quadraticVertex(18, -9, 16, -12);
  endShape();

  // Mass flow readout
  fill("rgb(150, 150, 150)");
  stroke(0);
  strokeWeight(0.05);
  translate(16, -12);
  rect(-8, -8, 19, 8.125, 2);
  fill(20);
  rect(-7, -6, 8, 4);
  noStroke();
  textAlign(CENTER, CENTER);
  textFont(state.meterFont);
  fill("yellow");
  textSize(3);
  const m = state.liquidOutlet.units === "kg/min" ? (state.mL_current * 60).toFixed(2) : (state.mL_current * 1000).toFixed(1);
  text(m, -2.875, -4);
  textFont("Arial");
  textSize(2.75);
  fill("black");
  text("kg/min", 5.875, -4);
  pop();
}

function drawInletFlowMeter() {
  push();
  translate(21, -20.5);
  rotate(PI / 2);
  rectMode(CENTER);
  fill("rgb(80, 80, 80)");
  stroke("rgb(40, 40, 40)");
  strokeWeight(0.05);

  // Dark grey caps on the ends of the mass flow meter
  rect(-5, 0, 2, 5, 0.5);
  rect(5, 0, 2, 5, 0.5);
  fill("rgb(240, 240, 240)");

  // Body of the mass flow meter
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

  // Middle dark grey cap
  rect(0, -1, 5, 6, 0.5);
  rectMode(CORNER);

  // Cable support
  rect(-1, -4.5, 2, 0.5);
  quad(-0.75, -4.5, -0.5, -6, 0.5, -6, 0.75, -4.5);

  rotate(-PI / 2);
  translate(3, 12);
  noFill();
  stroke(0);
  strokeWeight(0.2);

  // Cable
  beginShape();
  vertex(3, -12);
  quadraticVertex(4, -12.5, 5, -14);
  quadraticVertex(6, -16, 8, -16);
  endShape();

  translate(0, 2);
  fill("rgb(150, 150, 150)");
  stroke(0);
  strokeWeight(0.05);
  translate(16, -12);

  // Mass flow readout
  rect(-8, -10, 19, 8.125, 2);
  fill(20);
  rect(-7, -8, 8, 4);
  noStroke();
  textAlign(CENTER, CENTER);
  textFont(state.meterFont);
  fill("yellow");
  textSize(3);
  const m = state.inlet.units === "kg/min" ? (state.mF_current * 60).toFixed(2) : (state.mF_current * 1000).toFixed(1);
  text(m, -2.875, -6);
  textFont("Arial");
  textSize(2.75);
  fill("black");
  text("kg/min", 5.875, -6);
  pop();
}

function drawSample() {
  push();
  translate(state.gc.x, state.gc.y);
  scale(state.gc.scale);
  fill("rgb(180, 180, 180)");
  stroke("rgb(120, 120, 120)");
  strokeWeight(0.025);

  // Syringe needle
  rect(-40, -20, -5, 0.2);
  fill("rgb(200, 200, 200)");
  const offsetX = 12 * state.gc.takingSampleTime;

  // Syringe handle
  rect(-58 + offsetX, -21, 0.5, 2);
  rect(-58 + offsetX, -20.25, -13, 0.5);
  rect(-71.5 + offsetX, -21.25, 0.5, 2.5);

  fill("rgb(150, 150, 255)");
  noStroke();

  // Syringe liquid
  rect(-57.5 + offsetX, -21, 12 - offsetX, 2);
  fill("rgba(150, 150, 150, 0.4)");
  stroke("rgb(150, 150, 150)");

  // Syringe body
  rect(-45, -21, -14, 2, 1, 0.5, 0.5, 1);

  stroke(50);
  strokeWeight(0.1);

  // Syringe volume markings
  for (let i = 0; i <= 12; i++) {
    const x = -58 + i;
    const y = -21;
    const y2 = i % 4 === 0 ? y + 0.75 : i % 2 === 0 ? y + 0.5 : y + 0.25;
    line(x, y, x, y2);
  }
  pop();
}

function drawGC() {
  push();
  translate(state.gc.x, state.gc.y);
  scale(state.gc.scale);
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

function drawTable() {
  push();
  fill(100);
  stroke(0);
  strokeWeight(0.1);
  rectMode(CENTER);
  rect(width / 2, height / 2 + 20.25, 140, 4, 0.5);
  fill("rgb(200, 180, 160)");
  stroke("rgb(180, 160, 120)");
  rectMode(CORNER);
  rect(width / 2 - 48, height / 2 + 22.3, 5, 35);
  rect(width / 2 + 48 - 5, height / 2 + 22.3, 5, 35);
  rect()
  pop();
}

function drawComputer() {
  push();
  translate(width / 2 + 40, height / 2 - 40);
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
  vertex(-36, 42);
  quadraticVertex(-32, 40, -30, 35);
  quadraticVertex(-28, 30, -25, 28);
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
  vertex(-14, 35 - 4 * 38 / 48);
  if (state.gc.takingSampleTime >= 1) {
    for (let i = 0; i < 100; i++) {
      const x = -14 + i * 8 / 50;
      const y = 35 - 4 * 38 / 48 - state.xL * 15 * Math.exp(-0.5 * (PI * (i - 50) / 25) ** 2);
      vertex(x, y);
    }
    for (let i = 0; i < 100; i++) {
      const x = 2 + i * 8 / 50;
      const y = 35 - 4 * 38 / 48 - (1 - state.xL) * 15 * Math.exp(-0.5 * (PI * (i - 50) / 25) ** 2);
      vertex(x, y);
    }
  }
  vertex(19, 35 - 4 * 38 / 48);
  endShape();

  fill(0);
  noStroke();
  textSize(3);
  textAlign(LEFT, CENTER);

  // Display the liquid composition after liquid is inject
  if (state.gc.takingSampleTime >= 1) {
    text(`x  = ${(round(100 * state.xL) / 100).toFixed(2)}`, -5, 6);
    textSize(2);
    text("L", -3.2, 7.1);
  } else {
    text("READY FOR SAMPLE", -15, 6);
  }
  pop();
}

// We only want to interact with the DOM for a single frame, but we want to disable when the pump is off,
// and enable it when the pump is on. This turns the button on and off when the pump on/off switch is pressed,
// and in drawAll we continually check whether the pump state is on or off, and trigger this accordingly.
function triggerSampleButton() {
  const takeSampleButton = document.getElementById("take-sample");
  if (state.pump.on) {
    takeSampleButton.classList.remove("disabled");
    state.sampleButtonOn = true;
  } else {
    takeSampleButton.classList.add("disabled");
    state.sampleButtonOn = false;
  }
}

export function drawAll() {
  state.hand = false;
  if (state.gc.takingSample) {
    drawTable();
    drawComputer();
    drawGC();
    drawSample();
  } else {
    drawFeedTank();
    drawFlashDrum();
    drawInletPipe();
    drawHeatExchanger();
    const p = state.pump;
    drawPump(p.x, p.y, p.scaleX, p.scaleY, p.on);
    if (state.liquidHeight <= 0) {
      state.pump.on = false;
      if (state.sampleButtonOn) {
        triggerSampleButton();
      }
    } else if (!state.sampleButtonOn && state.pump.on) {
      triggerSampleButton();
    }
  }
  if (state.hand) {
    cursor(HAND);
  } else {
    cursor(ARROW);
  }
}