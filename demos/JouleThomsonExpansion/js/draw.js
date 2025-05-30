import { calcAll } from "./calcs.js";
const p5container = document.getElementById("p5-container");
const inletPressureSlider = document.getElementById("inlet-pressure-slider");
const outletPressureSlider = document.getElementById("outlet-pressure-slider");
const inletTemperatureSlider = document.getElementById("inlet-temperature-slider");
const inletPressureSliderWrapper = document.getElementById("inlet-pressure-slider-wrapper");
const outletPressureSliderWrapper = document.getElementById("outlet-pressure-slider-wrapper");
const inletTemperatureSliderWrapper = document.getElementById("inlet-temperature-slider-wrapper");
const gasButtonsWrapper = document.getElementById("gas-buttons-wrapper");
let mu = 5.468;
let digitalReadoutFont;

//preload for loading images and fonts
window.preload = function () {
  digitalReadoutFont = loadFont("./assets/digital-7.ttf");
};

// This function is used to scale the canvas based on the size of the container
window.relativeSize = () => p5container.offsetWidth / 1280;
//window.relativeSizeY = () => p5container.offsetHeight;

function resize() {
  // Here I am reassigning the width and height of the canvas to a static value of 1280x720,
  // even though the actual canvas size is based on the size of the #p5-container element.
  // So you can effectively treat the canvas like it is 1280x720, even though it will scale to fit the screen.
  state.width;
  state.height;

  scale(relativeSize());
}

// Moved outside of the selection block - Do not call setup() more than once.
// So this should never be inside a conditional statement.
window.setup = function () {
  createCanvas(p5container.offsetWidth, p5container.offsetHeight).parent(p5container);
  frameRate(30);
};

// Same with draw() - this should never be inside a conditional statement.
// Put the conditional statements inside the draw function.
window.draw = function () {
  // The "window" keyword is used to set global variables. So you can use
  // "selection" in any file, function, block, etc.

  const selectionElement = document.querySelector('input[name="selection"]:checked');
  window.selection = selectionElement.value;

  const gasSelectionElement = document.querySelector('input[name="gas"]:checked');
  window.gasSelection = gasSelectionElement.value;

  resize();
  background(255);
  calcAll();

  if (gasSelection === "NH3") {
    inletTemperatureSlider.setAttribute("min", 365);
    inletTemperatureSlider.setAttribute("max", 725);
    mu = state.muNH3[state.inletPressure - 1][(state.inletTemperature - 365) / 5];
  }
  if (gasSelection === "CO2") {
    inletTemperatureSlider.setAttribute("min", 290);
    inletTemperatureSlider.setAttribute("max", 1000);
    mu = state.muCO2[state.inletPressure - 1][(state.inletTemperature - 290) / 5];
  }
  if (gasSelection === "N2") {
    inletTemperatureSlider.setAttribute("min", 145);
    inletTemperatureSlider.setAttribute("max", 1000);
    mu = state.muN2[state.inletPressure - 1][(state.inletTemperature - 145) / 5];
  }
  if (gasSelection === "H2") {
    inletTemperatureSlider.setAttribute("min", 55);
    inletTemperatureSlider.setAttribute("max", 1000);
    mu = state.muH2[state.inletPressure - 1][(state.inletTemperature - 55) / 5];
  }

  state.outletTemperature = state.inletTemperature + mu * (state.outletPressure - state.inletPressure);

  if (selection === "throttle") {
    gasButtonsWrapper.style.display = "grid";
    inletPressureSliderWrapper.style.display = "grid";
    outletPressureSliderWrapper.style.display = "grid";
    inletTemperatureSliderWrapper.style.display = "grid";
    throttleFigureAndPressureGauges();
    temperatureGauges();

    drawFigureText();
  } else if (selection === "JTcoeff-vs-temperature") {
    inletTemperatureSliderWrapper.style.display = "none";
    inletPressureSliderWrapper.style.display = "grid";
    outletPressureSliderWrapper.style.display = "none";
    gasButtonsWrapper.style.display = "none";
    jouleThomsonCoeffPlot();
    jouleThomsonPlotLines();
    coverUpRectangle();
    drawMouseGraphInteraction();
  }
};

// Look this function up in p5.js documentation. The width and height of
// the #p5-container element are set in the css file.
window.windowResized = () => {
  resizeCanvas(p5container.offsetWidth, p5container.offsetHeight);
};

//--------------------Temperature Gauge Variables--------------------
const tempGaugeEdgeCurve = 5;
const tempGaugeWidth = 200;
const tempGaugeHeight = 90;
const tempGaugeInnerScreenWidth = 115;
const tempGaugeInnerScreenHeight = 75;
const tempScreenOffsetX = -30;
const tempScreenOffsetY = -3;
const kelvinLabelOffsetX = 60;
const kelvinLabelOffsetY = 4;

function temperatureGauges() {
  push();
  translate(state.width / 3, state.height / 4);
  push();
  fill("gray");
  rectMode(CENTER);
  rect(0, 0, tempGaugeWidth, tempGaugeHeight, tempGaugeEdgeCurve, tempGaugeEdgeCurve, tempGaugeEdgeCurve, tempGaugeEdgeCurve);
  fill("black");
  rect(tempScreenOffsetX, 0, tempGaugeInnerScreenWidth, tempGaugeInnerScreenHeight);
  pop();
  //--------------------Digital Temperature readout numbers--------------------
  push();

  textAlign(CENTER, CENTER);
  textSize(50);
  textFont(digitalReadoutFont);
  fill("yellow");
  text(state.inletTemperature.toFixed(1), tempScreenOffsetX, tempScreenOffsetY);

  pop();

  push();
  textAlign(CENTER, CENTER);
  stroke("Black");
  strokeWeight(0.2);
  fill("Black");
  textSize(42);
  text("K", kelvinLabelOffsetX, kelvinLabelOffsetY);
  pop();

  pop();
}

function throttleFigureAndPressureGauges() {
  //--------------------Rectangles portion of the figure--------------------
  push();

  rectMode(CENTER);
  noStroke();

  //--------------------Pipe--------------------
  push();
  fill("grey");
  line();
  rect(state.xMid, state.yMid + 100, state.width - 100, state.height * 0.5 - 30);
  pop();

  //--------------------gas inside the pipe--------------------
  push();
  fill(255, 115, 115);
  rect(state.xMid, state.yMid + 100, state.width - 100, state.height * 0.3);
  pop();

  //--------------------pipe borders--------------------
  push();
  fill("black");
  rect(state.xMid, state.yMid + 100 - 103, state.width - 100, 10);
  rect(state.xMid, state.yMid + 100 + 103, state.width - 100, 10);
  pop();

  pop();

  //--------------------The lines on the outer metal--------------------

  for (let i = 50; i < state.width - 50; i += (state.width - 100) / 38) {
    line(i, state.yMid + 100 - 165, i + 30, state.yMid + 100 - 108);
    line(i, state.yMid + 100 + 108, i + 30, state.yMid + 100 + 165);
  }

  //--------------------gauges--------------------
  push();
  rectMode(CORNERS);
  noStroke();
  //--------------------in pressure--------------------
  fill("gray");
  rect(state.width / 8 + 15, state.yMid - 100, state.width / 8 - 35, state.yMid - 64);
  fill("black");
  rect(state.width / 8 + 4, state.yMid - 100, state.width / 8 - 24, state.yMid + 1);
  fill(255, 115, 115);
  rect(state.width / 8, state.yMid - 100, state.width / 8 - 20, state.yMid + 4);
  rectMode(CENTER);
  fill("gray");
  stroke("black");
  strokeWeight(1);
  //--------------------bolts on the gauge--------------------
  rect(150 + 39, state.yMid - 94, 17, 12);
  rect(150 - 39, state.yMid - 94, 17, 12);
  rect(150 + 39, state.yMid - 139, 17, 12);
  rect(150 - 39, state.yMid - 139, 17, 12);
  //--------------------seal of the gauge--------------------
  rect(150, state.yMid - 116, 110, 34);
  line(95, state.yMid - 116, 205, state.yMid - 116);
  //--------------------top pressure reader--------------------
  rect(150, state.yMid - 153, 25, 40);
  circle(150, state.yMid - 250, 200);
  noStroke();
  fill("white");
  circle(150, state.yMid - 250, 190);
  stroke("black");
  angleMode(DEGREES);
  arc(150, state.yMid - 250, 120, 120, 135, 45);
  push();
  translate(150, state.yMid - 250);
  push();
  //--------------------ticks on gauge--------------------
  strokeWeight(2);
  for (let i = -45; i <= 225; i += (225 + 45) / 5) {
    line(60 * cos(i), -60 * sin(i), 68 * cos(i), -68 * sin(i));
  }
  strokeWeight(1);
  for (let i = -45; i <= 225; i += (225 + 45) / 20) {
    line(60 * cos(i), -60 * sin(i), 65 * cos(i), -65 * sin(i));
  }
  pop();
  //--------------------text on the gauge--------------------
  push();
  textAlign(CENTER, CENTER);
  stroke("Black");
  strokeWeight(0.2);
  fill("Black");
  textSize(12);
  for (let i = -45; i <= 225; i += (225 + 45) / 5) {
    text(-(i + 45) / (270 / 5) + 5, 80 * cos(i), -80 * sin(i));
  }
  pop();
  //--------------------Gauge Needle--------------------
  push();
  fill("black");
  noStroke();
  triangle(
    75 * cos(225 - (270 * state.inletPressure) / 5),
    -75 * sin(225 - (270 * state.inletPressure) / 5),
    25 * cos(225 - (270 * state.inletPressure) / 5 + 180 - 17),
    -25 * sin(225 - (270 * state.inletPressure) / 5 + 180 - 17),
    25 * cos(225 - (270 * state.inletPressure) / 5 + 180 + 17),
    -25 * sin(225 - (270 * state.inletPressure) / 5 + 180 + 17)
  );
  fill("gray");
  strokeWeight(5);
  circle(0, 0, 15);
  pop();

  textAlign(CENTER, CENTER);
  stroke("Black");
  strokeWeight(0.2);
  fill("Black");
  textSize(12);
  text("MPa", 0, 50);

  pop();
  //--------------------out pressure--------------------
  push();
  rectMode(CORNERS);
  noStroke();
  translate((6.135 * state.width) / 8, 0);
  //--------------------in pressure--------------------
  fill("gray");
  rect(state.width / 8 + 15, state.yMid - 100, state.width / 8 - 35, state.yMid - 64);
  fill("black");
  rect(state.width / 8 + 4, state.yMid - 100, state.width / 8 - 24, state.yMid + 1);
  fill(255, 115, 115);
  rect(state.width / 8, state.yMid - 100, state.width / 8 - 20, state.yMid + 4);
  rectMode(CENTER);
  fill("gray");
  stroke("black");
  strokeWeight(1);
  //--------------------bolts on the gauge--------------------
  rect(150 + 39, state.yMid - 94, 17, 12);
  rect(150 - 39, state.yMid - 94, 17, 12);
  rect(150 + 39, state.yMid - 139, 17, 12);
  rect(150 - 39, state.yMid - 139, 17, 12);
  //--------------------seal of the gauge--------------------
  rect(150, state.yMid - 116, 110, 34);
  line(95, state.yMid - 116, 205, state.yMid - 116);
  //--------------------top pressure reader--------------------
  rect(150, state.yMid - 153, 25, 40);
  circle(150, state.yMid - 250, 200);
  noStroke();
  fill("white");
  circle(150, state.yMid - 250, 190);
  stroke("black");
  angleMode(DEGREES);
  arc(150, state.yMid - 250, 120, 120, 135, 45);
  push();
  translate(150, state.yMid - 250);
  push();
  //--------------------ticks on gauge--------------------
  strokeWeight(2);
  for (let i = -45; i <= 225; i += (225 + 45) / 5) {
    line(60 * cos(i), -60 * sin(i), 68 * cos(i), -68 * sin(i));
  }
  strokeWeight(1);
  for (let i = -45; i <= 225; i += (225 + 45) / 20) {
    line(60 * cos(i), -60 * sin(i), 65 * cos(i), -65 * sin(i));
  }
  pop();
  //--------------------text on the gauge--------------------
  push();
  textAlign(CENTER, CENTER);
  stroke("Black");
  strokeWeight(0.2);
  fill("Black");
  textSize(12);
  for (let i = -45; i <= 225; i += (225 + 45) / 5) {
    text("0." + (-(i + 45) / (270 / 5) + 5), 80 * cos(i), -80 * sin(i));
  }
  pop();
  //--------------------Gauge Needle--------------------
  push();
  fill("black");
  noStroke();
  triangle(
    75 * cos(225 - (270 * state.outletPressure) / 0.5),
    -75 * sin(225 - (270 * state.outletPressure) / 0.5),
    25 * cos(225 - (270 * state.outletPressure) / 0.5 + 180 - 17),
    -25 * sin(225 - (270 * state.outletPressure) / 0.5 + 180 - 17),
    25 * cos(225 - (270 * state.outletPressure) / 0.5 + 180 + 17),
    -25 * sin(225 - (270 * state.outletPressure) / 0.5 + 180 + 17)
  );
  fill("gray");
  strokeWeight(5);
  circle(0, 0, 15);
  pop();

  textAlign(CENTER, CENTER);
  stroke("Black");
  strokeWeight(0.2);
  fill("Black");
  textSize(12);
  text("MPa", 0, 50);

  pop();

  pop();

  pop();
}

function drawFigureText() {
  push();
  textAlign(CENTER, CENTER);
  stroke("Black");
  strokeWeight(0.2);
  fill("Black");
  textSize(28);
  text("T out = " + state.outletTemperature.toFixed(1), (3 * state.width) / 4, state.yMid + 100);
  pop();
}

function coverUpRectangle() {
  push();
  noStroke();
  rectMode(CORNERS);
  rect(state.graphLeftSideX, state.graphTopY - 1, state.graphRightSideX, -5);
  pop();
}

function jouleThomsonCoeffPlot() {
  push();

  stroke("black");
  strokeWeight(1.5);
  line(state.graphLeftSideX, state.graphTopY, state.graphRightSideX, state.graphTopY);
  line(state.graphLeftSideX, state.graphTopY, state.graphLeftSideX, state.graphBottomY);
  line(state.graphLeftSideX, state.graphBottomY, state.graphRightSideX, state.graphBottomY);
  line(state.graphRightSideX, state.graphTopY, state.graphRightSideX, state.graphBottomY);
  line(
    state.graphLeftSideX,
    state.graphBottomY - (state.graphBottomY - state.graphTopY) / 4,
    state.graphRightSideX,
    state.graphBottomY - (state.graphBottomY - state.graphTopY) / 4
  );
  pop();

  push();
  //--------------------Vertical dashes and number labels--------------------
  stroke("black");
  strokeWeight(1);
  for (
    let i = state.graphBottomY - (state.graphBottomY - state.graphTopY) / 20;
    i > state.graphTopY;
    i -= (state.graphBottomY - state.graphTopY) / 20
  ) {
    line(state.graphLeftSideX, i, state.graphLeftSideX + 5, i);
    line(state.graphRightSideX, i, state.graphRightSideX - 5, i);
  }
  pop();

  push();
  textAlign(CENTER);
  stroke("Black");
  strokeWeight(0.2);
  fill("Black");
  textSize(22);
  for (let i = state.graphBottomY; i >= state.graphTopY; i -= (state.graphBottomY - state.graphTopY) / 4) {
    text(-1 - (i - state.graphBottomY) / ((state.graphBottomY - state.graphTopY) / 4), state.graphLeftSideX - 20, i + 5);
  }

  for (let i = state.graphLeftSideX; i <= state.graphRightSideX; i += (state.graphRightSideX - state.graphLeftSideX) / 5) {
    text((200 * (i - state.graphLeftSideX)) / ((state.graphRightSideX - state.graphLeftSideX) / 5), i, state.graphBottomY + 25);
  }

  pop();

  //--------------------Horizontal dashes and number labels--------------------
  push();
  stroke("black");
  strokeWeight(1);
  for (
    let i = state.graphLeftSideX + (state.graphRightSideX - state.graphLeftSideX) / 20;
    i < state.graphRightSideX;
    i += (state.graphRightSideX - state.graphLeftSideX) / 20
  ) {
    line(i, state.graphBottomY, i, state.graphBottomY - 5);
    line(i, state.graphTopY, i, state.graphTopY + 5);
  }

  pop();

  push();
  rotate(-PI / 2);
  textAlign(CENTER);
  stroke("Black");
  strokeWeight(0.2);
  fill("Black");
  textSize(22);
  text("Joule-Thomson coefficient (K/MPa)", -330, 60);

  pop();

  push();
  textAlign(CENTER);
  stroke("Black");
  strokeWeight(0.2);
  fill("Black");
  textSize(22);
  text("temperature (K)", state.width / 2, 680);

  let xH2 = state.graphLeftSideX + (state.graphRightSideX - state.graphLeftSideX) / 5 + 5;
  let yH2 = state.graphTopY + (3 * (state.graphBottomY - state.graphTopY)) / 4 - 15;
  let xN2 = state.graphLeftSideX + (state.graphRightSideX - state.graphLeftSideX) / 2 - 90;
  let yN2 = state.graphTopY + (state.graphBottomY - state.graphTopY) / 2;
  let xCO2 = state.graphLeftSideX + (6.5 * (state.graphRightSideX - state.graphLeftSideX)) / 10 - 10;
  let yCO2 = state.graphTopY + (2.25 * (state.graphBottomY - state.graphTopY)) / 8;
  let xNH3 = state.graphLeftSideX + (7 * (state.graphRightSideX - state.graphLeftSideX)) / 10;
  let yNH3 = state.graphTopY + (0.2 * state.graphBottomY - state.graphTopY);

  text("H", xH2, yH2);
  text("N", xN2, yN2);
  text("CO", xCO2, yCO2);
  text("NH", xNH3, yNH3);

  textSize(12);
  strokeWeight(0.4);
  text("2", xH2 + 11, yH2 + 5);
  text("2", xN2 + 11, yN2 + 5);
  text("2", xCO2 + 20, yCO2 + 5);
  text("3", xNH3 + 20, yNH3 + 5);
  pop();
}

function jouleThomsonPlotLines() {
  //This variable p is for the first index of each array depending on each pressure case.
  let p = state.inletPressure - 1;

  push();
  noFill();

  //--------------------CO2 line--------------------
  push();
  stroke("blue");
  strokeWeight(3);
  beginShape();
  curveVertex(
    state.graphLeftSideX + ((0 * 5 + 290) / 1000) * (state.graphRightSideX - state.graphLeftSideX),
    state.graphBottomY + ((state.muCO2[p][0] + 1) / 4) * (state.graphTopY - state.graphBottomY)
  );
  for (let i = 0; i < state.muCO2[p].length; i++) {
    curveVertex(
      state.graphLeftSideX + ((i * 5 + 290) / 1000) * (state.graphRightSideX - state.graphLeftSideX),
      state.graphBottomY + ((state.muCO2[p][i] + 1) / 4) * (state.graphTopY - state.graphBottomY)
    );
  }
  curveVertex(
    state.graphLeftSideX + ((state.muCO2[p].length * 5 + 290) / 1000) * (state.graphRightSideX - state.graphLeftSideX),
    state.graphBottomY + ((state.muCO2[p][state.muCO2[p].length - 1] + 1) / 4) * (state.graphTopY - state.graphBottomY)
  );
  endShape();
  pop();

  //--------------------N2 line--------------------
  push();
  stroke("green");
  strokeWeight(3);
  beginShape();
  curveVertex(
    state.graphLeftSideX + ((0 * 5 + 145) / 1000) * (state.graphRightSideX - state.graphLeftSideX),
    state.graphBottomY + ((state.muN2[p][0] + 1) / 4) * (state.graphTopY - state.graphBottomY)
  );
  for (let i = 0; i < state.muN2[p].length; i++) {
    curveVertex(
      state.graphLeftSideX + ((i * 5 + 145) / 1000) * (state.graphRightSideX - state.graphLeftSideX),
      state.graphBottomY + ((state.muN2[p][i] + 1) / 4) * (state.graphTopY - state.graphBottomY)
    );
  }
  curveVertex(
    state.graphLeftSideX + ((state.muN2[p].length * 5 + 145) / 1000) * (state.graphRightSideX - state.graphLeftSideX),
    state.graphBottomY + ((state.muN2[p][state.muN2[p].length - 1] + 1) / 4) * (state.graphTopY - state.graphBottomY)
  );
  endShape();
  pop();

  //--------------------H2 line--------------------
  push();
  stroke(242, 90, 2);
  strokeWeight(3);
  beginShape();
  curveVertex(
    state.graphLeftSideX + ((0 * 5 + 55) / 1000) * (state.graphRightSideX - state.graphLeftSideX),
    state.graphBottomY + ((state.muH2[p][0] + 1) / 4) * (state.graphTopY - state.graphBottomY)
  );
  for (let i = 0; i < state.muH2[p].length; i++) {
    curveVertex(
      state.graphLeftSideX + ((i * 5 + 55) / 1000) * (state.graphRightSideX - state.graphLeftSideX),
      state.graphBottomY + ((state.muH2[p][i] + 1) / 4) * (state.graphTopY - state.graphBottomY)
    );
  }
  curveVertex(
    state.graphLeftSideX + ((state.muH2[p].length * 5 + 55) / 1000) * (state.graphRightSideX - state.graphLeftSideX),
    state.graphBottomY + ((state.muH2[p][state.muH2[p].length - 1] + 1) / 4) * (state.graphTopY - state.graphBottomY)
  );
  endShape();
  pop();

  //--------------------NH3 lines--------------------
  push();
  stroke("purple");
  strokeWeight(3);

  beginShape();
  curveVertex(
    state.graphLeftSideX + ((0 * 5 + 365) / 1000) * (state.graphRightSideX - state.graphLeftSideX),
    state.graphBottomY + ((state.muNH3[p][0] + 1) / 4) * (state.graphTopY - state.graphBottomY)
  );

  for (let i = 0; i < state.muNH3[p].length; i++) {
    curveVertex(
      state.graphLeftSideX + ((i * 5 + 365) / 1000) * (state.graphRightSideX - state.graphLeftSideX),
      state.graphBottomY + ((state.muNH3[p][i] + 1) / 4) * (state.graphTopY - state.graphBottomY)
    );
  }
  curveVertex(
    state.graphLeftSideX + ((state.muNH3[p].length * 5 + 365) / 1000) * (state.graphRightSideX - state.graphLeftSideX),
    state.graphBottomY + ((state.muNH3[p][state.muNH3[p].length - 1] + 1) / 4) * (state.graphTopY - state.graphBottomY)
  );
  endShape();
  pop();
  pop();
}

function drawMouseGraphInteraction() {
  let p = state.inletPressure - 1;

  let mouseXCalibrated = mouseX / relativeSize();
  let mouseYCalibrated = mouseY / relativeSize();

  let textOffSetX = 0;
  let textOffSetY = 25;

  //--------------------Mouse interaction for CO2 line--------------------
  for (let i = 0; i < state.muCO2[p].length; i++) {
    let calibratedXPointOnCO2Line = state.graphLeftSideX + ((i * 5 + 290) / 1000) * (state.graphRightSideX - state.graphLeftSideX);
    let calibratedYPointOnCO2Line = state.graphBottomY + ((state.muCO2[p][i] + 1) / 4) * (state.graphTopY - state.graphBottomY);

    if (
      Math.abs(mouseXCalibrated - calibratedXPointOnCO2Line) < 4 &&
      Math.abs(mouseYCalibrated - calibratedYPointOnCO2Line) < 40 &&
      state.muCO2[p][i] < 3.0049
    ) {
      if (state.muCO2[p][i] > 2.7) {
        textOffSetY = -textOffSetY;
      }
      if (i * 5 + 290 > 960) {
        textOffSetX = -50;
      }
      push();
      fill("blue");
      stroke("blue");
      circle(calibratedXPointOnCO2Line, calibratedYPointOnCO2Line, 12);
      pop();

      push();
      rectMode(CENTER);
      fill(210, 210, 255);
      stroke("Blue");
      rect(calibratedXPointOnCO2Line + textOffSetX, calibratedYPointOnCO2Line - textOffSetY, 80, 25);
      pop();

      push();
      textAlign(CENTER, CENTER);
      stroke("Black");
      strokeWeight(0.2);
      fill("Black");
      textSize(16);
      text(i * 5 + 290 + ", " + state.muCO2[p][i].toFixed(2), calibratedXPointOnCO2Line + textOffSetX, calibratedYPointOnCO2Line - textOffSetY);
      pop();

      break;
    }
  }

  //--------------------Mouse interaction for N2 line--------------------
  for (let i = 0; i < state.muN2[p].length; i++) {
    let calibratedXPointOnN2Line = state.graphLeftSideX + ((i * 5 + 145) / 1000) * (state.graphRightSideX - state.graphLeftSideX);
    let calibratedYPointOnN2Line = state.graphBottomY + ((state.muN2[p][i] + 1) / 4) * (state.graphTopY - state.graphBottomY);

    if (
      Math.abs(mouseXCalibrated - calibratedXPointOnN2Line) < 4 &&
      Math.abs(mouseYCalibrated - calibratedYPointOnN2Line) < 40 &&
      state.muN2[p][i] < 3.0049
    ) {
      if (state.muN2[p][i] > 2.7) {
        textOffSetY = -textOffSetY;
      }
      if (i * 5 + 145 > 960) {
        textOffSetX = -50;
      }
      push();
      fill("green");
      stroke("green");
      circle(calibratedXPointOnN2Line, calibratedYPointOnN2Line, 12);
      pop();

      push();
      rectMode(CENTER);
      fill(210, 255, 210);
      stroke("green");
      rect(calibratedXPointOnN2Line + textOffSetX, calibratedYPointOnN2Line - textOffSetY, 80, 25);
      pop();

      push();
      textAlign(CENTER, CENTER);
      stroke("Black");
      strokeWeight(0.2);
      fill("Black");
      textSize(16);
      text(i * 5 + 145 + ", " + state.muN2[p][i].toFixed(2), calibratedXPointOnN2Line + textOffSetX, calibratedYPointOnN2Line - textOffSetY);
      pop();

      break;
    }
  }

  //--------------------Mouse interaction for H2 line--------------------
  for (let i = 0; i < state.muH2[p].length; i++) {
    let calibratedXPointOnH2Line = state.graphLeftSideX + ((i * 5 + 55) / 1000) * (state.graphRightSideX - state.graphLeftSideX);
    let calibratedYPointOnH2Line = state.graphBottomY + ((state.muH2[p][i] + 1) / 4) * (state.graphTopY - state.graphBottomY);

    console.log(state.muH2[p][i]);
    if (
      Math.abs(mouseXCalibrated - calibratedXPointOnH2Line) < 4 &&
      Math.abs(mouseYCalibrated - calibratedYPointOnH2Line) < 40 &&
      state.muH2[p][i] < 3.0049
    ) {
      if (state.muH2[p][i] > 2.7 || state.muH2[p][i] < 0) {
        textOffSetY = -textOffSetY;
      }
      if (i * 5 + 55 > 960) {
        textOffSetX = -50;
      }
      push();
      fill(242, 90, 2);
      stroke(242, 90, 2);
      circle(calibratedXPointOnH2Line, calibratedYPointOnH2Line, 12);
      pop();

      push();
      rectMode(CENTER);
      fill(252, 220, 187);
      stroke(242, 90, 2);
      rect(calibratedXPointOnH2Line + textOffSetX, calibratedYPointOnH2Line - textOffSetY, 80, 25);
      pop();

      push();
      textAlign(CENTER, CENTER);
      stroke("Black");
      strokeWeight(0.2);
      fill("Black");
      textSize(16);
      text(i * 5 + 55 + ", " + state.muH2[p][i].toFixed(2), calibratedXPointOnH2Line + textOffSetX, calibratedYPointOnH2Line - textOffSetY);
      pop();

      break;
    }
  }

  //--------------------Mouse interaction for NH3 line--------------------
  for (let i = 0; i < state.muNH3[p].length; i++) {
    let calibratedXPointOnNH3Line = state.graphLeftSideX + ((i * 5 + 365) / 1000) * (state.graphRightSideX - state.graphLeftSideX);
    let calibratedYPointOnNH3Line = state.graphBottomY + ((state.muNH3[p][i] + 1) / 4) * (state.graphTopY - state.graphBottomY);

    if (
      Math.abs(mouseXCalibrated - calibratedXPointOnNH3Line) < 4 &&
      Math.abs(mouseYCalibrated - calibratedYPointOnNH3Line) < 40 &&
      state.muNH3[p][i] < 3.0049
    ) {
      if (state.muNH3[p][i] > 2.7) {
        textOffSetY = -textOffSetY;
      }
      if (i * 5 + 365 > 960) {
        textOffSetX = -50;
      }
      push();
      fill("purple");
      stroke("purple");
      circle(calibratedXPointOnNH3Line, calibratedYPointOnNH3Line, 12);
      pop();

      push();
      rectMode(CENTER);
      fill(227, 201, 255);
      stroke("purple");
      rect(calibratedXPointOnNH3Line + textOffSetX, calibratedYPointOnNH3Line - textOffSetY, 80, 25);
      pop();

      push();
      textAlign(CENTER, CENTER);
      stroke("Black");
      strokeWeight(0.2);
      fill("Black");
      textSize(16);
      text(i * 5 + 365 + ", " + state.muNH3[p][i].toFixed(2), calibratedXPointOnNH3Line + textOffSetX, calibratedYPointOnNH3Line - textOffSetY);
      pop();

      break;
    }
  }
}
