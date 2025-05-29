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

//preload for loading images and fonts
window.preload = function() {};

// This function is used to scale the canvas based on the size of the container
window.relativeSize = () => p5container.offsetWidth / 1280;
//window.relativeSizeY = () => p5container.offsetHeight;

function resize() {
  // Here I am reassigning the width and height of the canvas to a static value of 1280x720,
  // even though the actual canvas size is based on the size of the #p5-container element.
  // So you can effectively treat the canvas like it is 1280x720, even though it will scale to fit the screen.
  z.width;
  z.height;

  scale(relativeSize());
}

// Moved outside of the selection block - Do not call setup() more than once.
// So this should never be inside a conditional statement.
window.setup = function() {
  createCanvas(p5container.offsetWidth, p5container.offsetHeight).parent(p5container);
  frameRate(30);
};

// Same with draw() - this should never be inside a conditional statement.
// Put the conditional statements inside the draw function.
window.draw = function() {
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
    mu = z.muNH3[z.inletPressure - 1][(z.inletTemperature - 365) / 5];
  }
  if (gasSelection === "CO2") {
    inletTemperatureSlider.setAttribute("min", 290);
    inletTemperatureSlider.setAttribute("max", 1000);
    mu = z.muCO2[z.inletPressure - 1][(z.inletTemperature - 290) / 5];
  }
  if (gasSelection === "N2") {
    inletTemperatureSlider.setAttribute("min", 145);
    inletTemperatureSlider.setAttribute("max", 1000);
    mu = z.muN2[z.inletPressure - 1][(z.inletTemperature - 145) / 5];
  }
  if (gasSelection === "H2") {
    inletTemperatureSlider.setAttribute("min", 55);
    inletTemperatureSlider.setAttribute("max", 1000);
    mu = z.muH2[z.inletPressure - 1][(z.inletTemperature - 55) / 5];
  }

  z.outletTemperature = z.inletTemperature + mu * (z.outletPressure - z.inletPressure);

  if (selection === "throttle") {
    gasButtonsWrapper.style.display = "grid";
    inletPressureSliderWrapper.style.display = "grid";
    outletPressureSliderWrapper.style.display = "grid";
    inletTemperatureSliderWrapper.style.display = "grid";

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

function drawFigureText() {
  push();
  textAlign(CENTER);
  stroke("Black");
  strokeWeight(0.2);
  fill("Black");
  textSize(28);
  text("T out = " + z.outletTemperature.toFixed(1), z.width / 4, z.height / 2);
  pop();
}

function coverUpRectangle() {
  push();
  noStroke();
  rectMode(CORNERS);
  rect(z.graphLeftSideX, z.graphTopY - 1, z.graphRightSideX, -5);
  pop();
}

function jouleThomsonCoeffPlot() {
  push();

  stroke("black");
  strokeWeight(1.5);
  line(z.graphLeftSideX, z.graphTopY, z.graphRightSideX, z.graphTopY);
  line(z.graphLeftSideX, z.graphTopY, z.graphLeftSideX, z.graphBottomY);
  line(z.graphLeftSideX, z.graphBottomY, z.graphRightSideX, z.graphBottomY);
  line(z.graphRightSideX, z.graphTopY, z.graphRightSideX, z.graphBottomY);
  line(z.graphLeftSideX, z.graphBottomY - (z.graphBottomY - z.graphTopY) / 4, z.graphRightSideX, z.graphBottomY - (z.graphBottomY - z.graphTopY) / 4);
  pop();

  push();
  // Vertical dashes and number labels
  stroke("black");
  strokeWeight(1);
  for (let i = z.graphBottomY - (z.graphBottomY - z.graphTopY) / 20; i > z.graphTopY; i -= (z.graphBottomY - z.graphTopY) / 20) {
    line(z.graphLeftSideX, i, z.graphLeftSideX + 5, i);
    line(z.graphRightSideX, i, z.graphRightSideX - 5, i);
  }
  pop();

  push();
  textAlign(CENTER);
  stroke("Black");
  strokeWeight(0.2);
  fill("Black");
  textSize(22);
  for (let i = z.graphBottomY; i >= z.graphTopY; i -= (z.graphBottomY - z.graphTopY) / 4) {
    text(-1 - (i - z.graphBottomY) / ((z.graphBottomY - z.graphTopY) / 4), z.graphLeftSideX - 20, i + 5);
  }

  for (let i = z.graphLeftSideX; i <= z.graphRightSideX; i += (z.graphRightSideX - z.graphLeftSideX) / 5) {
    text((200 * (i - z.graphLeftSideX)) / ((z.graphRightSideX - z.graphLeftSideX) / 5), i, z.graphBottomY + 25);
  }

  pop();

  // Horizontal dashes and number labels
  push();
  stroke("black");
  strokeWeight(1);
  for (
    let i = z.graphLeftSideX + (z.graphRightSideX - z.graphLeftSideX) / 20; i < z.graphRightSideX; i += (z.graphRightSideX - z.graphLeftSideX) / 20
  ) {
    line(i, z.graphBottomY, i, z.graphBottomY - 5);
    line(i, z.graphTopY, i, z.graphTopY + 5);
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
  text("temperature (K)", z.width / 2, 680);

  let xH2 = z.graphLeftSideX + (z.graphRightSideX - z.graphLeftSideX) / 5 + 5;
  let yH2 = z.graphTopY + (3 * (z.graphBottomY - z.graphTopY)) / 4 - 15;
  let xN2 = z.graphLeftSideX + (z.graphRightSideX - z.graphLeftSideX) / 2 - 90;
  let yN2 = z.graphTopY + (z.graphBottomY - z.graphTopY) / 2;
  let xCO2 = z.graphLeftSideX + (6.5 * (z.graphRightSideX - z.graphLeftSideX)) / 10 - 10;
  let yCO2 = z.graphTopY + (2.25 * (z.graphBottomY - z.graphTopY)) / 8;
  let xNH3 = z.graphLeftSideX + (7 * (z.graphRightSideX - z.graphLeftSideX)) / 10;
  let yNH3 = z.graphTopY + (0.2 * z.graphBottomY - z.graphTopY);

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
  let p = z.inletPressure - 1;

  push();
  noFill();

  //CO2 line
  push();
  stroke("blue");
  strokeWeight(3);
  beginShape();
  curveVertex(
    z.graphLeftSideX + ((0 * 5 + 290) / 1000) * (z.graphRightSideX - z.graphLeftSideX),
    z.graphBottomY + ((z.muCO2[p][0] + 1) / 4) * (z.graphTopY - z.graphBottomY)
  );
  for (let i = 0; i < z.muCO2[p].length; i++) {
    curveVertex(
      z.graphLeftSideX + ((i * 5 + 290) / 1000) * (z.graphRightSideX - z.graphLeftSideX),
      z.graphBottomY + ((z.muCO2[p][i] + 1) / 4) * (z.graphTopY - z.graphBottomY)
    );
  }
  curveVertex(
    z.graphLeftSideX + ((z.muCO2[p].length * 5 + 290) / 1000) * (z.graphRightSideX - z.graphLeftSideX),
    z.graphBottomY + ((z.muCO2[p][z.muCO2[p].length - 1] + 1) / 4) * (z.graphTopY - z.graphBottomY)
  );
  endShape();
  pop();

  //N2 line
  push();
  stroke("green");
  strokeWeight(3);
  beginShape();
  curveVertex(
    z.graphLeftSideX + ((0 * 5 + 145) / 1000) * (z.graphRightSideX - z.graphLeftSideX),
    z.graphBottomY + ((z.muN2[p][0] + 1) / 4) * (z.graphTopY - z.graphBottomY)
  );
  for (let i = 0; i < z.muN2[p].length; i++) {
    curveVertex(
      z.graphLeftSideX + ((i * 5 + 145) / 1000) * (z.graphRightSideX - z.graphLeftSideX),
      z.graphBottomY + ((z.muN2[p][i] + 1) / 4) * (z.graphTopY - z.graphBottomY)
    );
  }
  curveVertex(
    z.graphLeftSideX + ((z.muN2[p].length * 5 + 145) / 1000) * (z.graphRightSideX - z.graphLeftSideX),
    z.graphBottomY + ((z.muN2[p][z.muN2[p].length - 1] + 1) / 4) * (z.graphTopY - z.graphBottomY)
  );
  endShape();
  pop();

  //H2 line
  push();
  stroke(242, 90, 2);
  strokeWeight(3);
  beginShape();
  curveVertex(
    z.graphLeftSideX + ((0 * 5 + 55) / 1000) * (z.graphRightSideX - z.graphLeftSideX),
    z.graphBottomY + ((z.muH2[p][0] + 1) / 4) * (z.graphTopY - z.graphBottomY)
  );
  for (let i = 0; i < z.muH2[p].length; i++) {
    curveVertex(
      z.graphLeftSideX + ((i * 5 + 55) / 1000) * (z.graphRightSideX - z.graphLeftSideX),
      z.graphBottomY + ((z.muH2[p][i] + 1) / 4) * (z.graphTopY - z.graphBottomY)
    );
  }
  curveVertex(
    z.graphLeftSideX + ((z.muH2[p].length * 5 + 55) / 1000) * (z.graphRightSideX - z.graphLeftSideX),
    z.graphBottomY + ((z.muH2[p][z.muH2[p].length - 1] + 1) / 4) * (z.graphTopY - z.graphBottomY)
  );
  endShape();
  pop();

  //NH3 lines
  push();
  stroke("purple");
  strokeWeight(3);
  /* 
    //liquid region incase needed
    beginShape();
    curveVertex(
      z.graphLeftSideX + ((0 * 5 + 200) / 1000) * (z.graphRightSideX - z.graphLeftSideX),
      z.graphBottomY + ((z.muNH3[p][0] + 1) / 4) * (z.graphTopY - z.graphBottomY)
    );
    for (let i = 0; i < 20; i++) {
      curveVertex(
        z.graphLeftSideX + ((i * 5 + 200) / 1000) * (z.graphRightSideX - z.graphLeftSideX),
        z.graphBottomY + ((z.muNH3[p][i] + 1) / 4) * (z.graphTopY - z.graphBottomY)
      );
    }
    curveVertex(
      z.graphLeftSideX + ((19 * 5 + 200) / 1000) * (z.graphRightSideX - z.graphLeftSideX),
      z.graphBottomY + ((z.muNH3[p][19] + 1) / 4) * (z.graphTopY - z.graphBottomY)
    );

    endShape(); */

  beginShape();
  curveVertex(
    z.graphLeftSideX + ((0 * 5 + 365) / 1000) * (z.graphRightSideX - z.graphLeftSideX),
    z.graphBottomY + ((z.muNH3[p][0] + 1) / 4) * (z.graphTopY - z.graphBottomY)
  );

  for (let i = 0; i < z.muNH3[p].length; i++) {
    curveVertex(
      z.graphLeftSideX + ((i * 5 + 365) / 1000) * (z.graphRightSideX - z.graphLeftSideX),
      z.graphBottomY + ((z.muNH3[p][i] + 1) / 4) * (z.graphTopY - z.graphBottomY)
    );
  }
  curveVertex(
    z.graphLeftSideX + ((z.muNH3[p].length * 5 + 365) / 1000) * (z.graphRightSideX - z.graphLeftSideX),
    z.graphBottomY + ((z.muNH3[p][z.muNH3[p].length - 1] + 1) / 4) * (z.graphTopY - z.graphBottomY)
  );
  endShape();
  pop();
  pop();
}

function drawMouseGraphInteraction() {
  let p = z.inletPressure - 1;

  let mouseXCalibrated = mouseX / relativeSize();
  let mouseYCalibrated = mouseY / relativeSize();

  let textOffSetX = 0;
  let textOffSetY = 25;

  //Mouse interaction for CO2 line
  for (let i = 0; i < z.muCO2[p].length; i++) {
    let calibratedXPointOnCO2Line = z.graphLeftSideX + ((i * 5 + 290) / 1000) * (z.graphRightSideX - z.graphLeftSideX);
    let calibratedYPointOnCO2Line = z.graphBottomY + ((z.muCO2[p][i] + 1) / 4) * (z.graphTopY - z.graphBottomY);

    if (
      Math.abs(mouseXCalibrated - calibratedXPointOnCO2Line) < 4 &&
      Math.abs(mouseYCalibrated - calibratedYPointOnCO2Line) < 40 &&
      z.muCO2[p][i] < 3.0049
    ) {
      if (z.muCO2[p][i] > 2.7) {
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
      text(i * 5 + 290 + ", " + z.muCO2[p][i].toFixed(2), calibratedXPointOnCO2Line + textOffSetX, calibratedYPointOnCO2Line - textOffSetY);
      pop();

      break;
    }
  }

  //Mouse interaction for N2 line
  for (let i = 0; i < z.muN2[p].length; i++) {
    let calibratedXPointOnN2Line = z.graphLeftSideX + ((i * 5 + 145) / 1000) * (z.graphRightSideX - z.graphLeftSideX);
    let calibratedYPointOnN2Line = z.graphBottomY + ((z.muN2[p][i] + 1) / 4) * (z.graphTopY - z.graphBottomY);

    if (
      Math.abs(mouseXCalibrated - calibratedXPointOnN2Line) < 4 &&
      Math.abs(mouseYCalibrated - calibratedYPointOnN2Line) < 40 &&
      z.muN2[p][i] < 3.0049
    ) {
      if (z.muN2[p][i] > 2.7) {
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
      text(i * 5 + 145 + ", " + z.muN2[p][i].toFixed(2), calibratedXPointOnN2Line + textOffSetX, calibratedYPointOnN2Line - textOffSetY);
      pop();

      break;
    }
  }

  //Mouse interaction for H2 line
  for (let i = 0; i < z.muH2[p].length; i++) {
    let calibratedXPointOnH2Line = z.graphLeftSideX + ((i * 5 + 55) / 1000) * (z.graphRightSideX - z.graphLeftSideX);
    let calibratedYPointOnH2Line = z.graphBottomY + ((z.muH2[p][i] + 1) / 4) * (z.graphTopY - z.graphBottomY);

    console.log(z.muH2[p][i]);
    if (
      Math.abs(mouseXCalibrated - calibratedXPointOnH2Line) < 4 &&
      Math.abs(mouseYCalibrated - calibratedYPointOnH2Line) < 40 &&
      z.muH2[p][i] < 3.0049
    ) {
      if (z.muH2[p][i] > 2.7 || z.muH2[p][i] < 0) {
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
      text(i * 5 + 55 + ", " + z.muH2[p][i].toFixed(2), calibratedXPointOnH2Line + textOffSetX, calibratedYPointOnH2Line - textOffSetY);
      pop();

      break;
    }
  }

  //Mouse interaction for NH3 line
  for (let i = 0; i < z.muNH3[p].length; i++) {
    let calibratedXPointOnNH3Line = z.graphLeftSideX + ((i * 5 + 365) / 1000) * (z.graphRightSideX - z.graphLeftSideX);
    let calibratedYPointOnNH3Line = z.graphBottomY + ((z.muNH3[p][i] + 1) / 4) * (z.graphTopY - z.graphBottomY);

    if (
      Math.abs(mouseXCalibrated - calibratedXPointOnNH3Line) < 4 &&
      Math.abs(mouseYCalibrated - calibratedYPointOnNH3Line) < 40 &&
      z.muNH3[p][i] < 3.0049
    ) {
      if (z.muNH3[p][i] > 2.7) {
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
      text(i * 5 + 365 + ", " + z.muNH3[p][i].toFixed(2), calibratedXPointOnNH3Line + textOffSetX, calibratedYPointOnNH3Line - textOffSetY);
      pop();

      break;
    }
  }
}