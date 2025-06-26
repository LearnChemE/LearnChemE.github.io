/* 
  Basic placeholders for a p5.js canvas and simple 
  calculation stubs for demonstration.
  Expand or replace these with actual RO logic.
*/

let g = {
  feedPressure: 10,
  saltConc: 0.5,
  feedTemp: 15,
};

let graphicsWrapper = document.getElementById("graphics-wrapper");

// This is the size of the canvas. I set it to 800x600, but it could
// be any arbitrary height and width.
let containerDims = [1280, 720];

window.setup = function () {
  // Create the p5.js canvas inside #graphics-wrapper
  createCanvas(graphicsWrapper.offsetWidth, graphicsWrapper.offsetHeight).parent(graphicsWrapper);
  handleCanvasSize();
  handleMouseScaling();
};

window.mouseClicked = function () {
  //pressure switch interaction
  if (502 < window.mX && window.mX < 540 && 580 < window.mY && window.mY < 620) {
    state.pumpOn = !state.pumpOn;
  }
  //mouse click rectangle for switch
  /* push();
  stroke("red");
  noFill();
  rectMode(CORNERS);
  rect(503, 620, 540, 580);
  pop(); */
};

window.draw = function () {
  handleScaling();
  background(255);

  // Title and parameters display first
  textSize(18);
  fill(0);
  text("Reverse Osmosis Visualization", 20, 30);
  textSize(16);
  text(`Feed Pressure: ${g.feedPressure.toFixed(1)} bar`, 20, 60);
  text(`Salt Concentration: ${g.saltConc.toFixed(2)}%`, 20, 85);
  text(`Feed Temp: ${g.feedTemp} °C`, 20, 110);

  // Draw pipe first so it appears behind everything
  //drawPipeAndPump(150, 250);

  //drain settings

  if (state.pumpOn === true && -saltTankHeight - 1 + state.waterDrainTimer + 5 < 0) {
    state.waterDrainTimer = state.waterDrainTimer + 1;
  }

  /*  if (
    502 < window.mX &&
    window.mX < 540 &&
    580 < window.mY &&
    window.mY < 620 &&
    tank &&
    state.hasTankDrainedYet === false &&
    state.tankIsDraining === false
  ) {
    state.tankDrainTimer = 0;
    state.hasTankDrainedYet = true;
    state.tankIsDraining = true;
  }
  if (502 < window.mX && window.mX < 540 && 580 < window.mY && window.mY < 620 && tank && state.hasTankDrainedYet === true) {
    state.tankDrainTimer = 0;
    state.hasTankDrainedYet = true;
  } */

  // Draw pipes first, then water, then pipe connectors and equipment meant to cover the water
  drawSaltTank(state.figureX, state.figureY);
  drawPressureGauge(state.figureX, state.figureY);

  drawBeaker(830, 500, 160, 180); //drawBeaker(x, y, beakerThickness, beakerWidth, beakerHeight)
  drawBeaker(1095, 580, 80, 90);
  drawFilter(state.figureX, state.figureY);
  drawWater(state.figureX, state.figureY);
  drawPumpSwitch(state.figureX, state.figureY, state.pumpOn);
  drawPump(state.figureX, state.figureY);

  //draw text last so it appears over the water
  drawTextOnTopOfDiagram(state.figureX, state.figureY);

  state.frameCount = state.frameCount + 1;
};

function drawTextOnTopOfDiagram(x, y) {
  push();
  // Add text
  textAlign(CENTER, CENTER);
  fill(0);
  textSize(20);
  text("Salt", x, y);
  text("Solution", x, y + 25);
  pop();
}

let saltTankWidth = 200;
let saltTankHeight = 300;

function drawSaltTank(x, y) {
  //--------------------Tank Stand Back Leg--------------------
  push();
  fill("gray");
  rectMode(CENTER);
  rect(x, y + 240, 20, 40);
  pop();

  //---------------------bottom of the tank pipe turn right---------------------
  push();
  stroke("black");
  strokeWeight(1);
  rectMode(CORNER);
  fill("gray");
  rect(x - 15, y + saltTankHeight / 2 + 54, 160, 30, 0, 0, 0, 15);

  pop();

  //--------------------Tank outline--------------------
  push();
  fill("gray");
  stroke("black");
  strokeWeight(1);
  line(x - saltTankWidth / 2 - 5, y - saltTankHeight / 2, x - saltTankWidth / 2 - 5, y + saltTankHeight / 2);
  beginShape();
  vertex(x - saltTankWidth / 2 - 5, y - saltTankHeight / 2);
  vertex(x + saltTankWidth / 2 + 5, y - saltTankHeight / 2);
  vertex(x + saltTankWidth / 2 + 5, y + saltTankHeight / 2);
  vertex(x, y + saltTankHeight / 2 + 30);
  vertex(x - saltTankWidth / 2 - 5, y + saltTankHeight / 2);

  endShape();

  pop();

  //--------------------Tank Stand Front Legs and Feet--------------------
  push();
  rectMode(CORNERS);
  fill("gray");
  rect(x - 100, y + 140, x - 80, y + 280);
  rect(x + 100, y + 140, x + 80, y + 280);
  //feet
  rectMode(CENTER);
  rect(x, y + 253, 30, 15, 10, 10, 0, 0);
  rect(x + 90, y + 273, 30, 15, 10, 10, 0, 0);
  rect(x - 90, y + 273, 30, 15, 10, 10, 0, 0);

  pop();

  //---------------------bottom of the tank spout---------------------
  push();
  stroke("black");
  strokeWeight(1);
  rectMode(CENTER);
  fill("gray");
  rect(x, y + saltTankHeight / 2 + 40, 30, 30);
  noStroke();
  rectMode(CENTER);
  fill("gray");
  rect(x, y + saltTankHeight / 2 + 40, 29, 34);

  pop();
}

function drawPump(x, y) {
  push();
  //adjustment so that the same coordinates can be used for pump as are used for the tank
  translate(-16 + 160, saltTankHeight / 2 + 41 + 28);

  //---------------------left side of pump connecting to the water pipe---------------------
  push();
  fill("gray");
  beginShape();

  vertex(x + 14, y - 15); //top left corner
  vertex(x + 14, y + 15);
  vertex(x + 14 + 45, y + 15);
  vertex(x + 14 + 45 + 15, y + 15 + 10);
  vertex(x + 14 + 45 + 15, y - 15 - 10);
  vertex(x + 14 + 45, y - 15);
  endShape();
  line(x + 14 + 45, y - 15, x + 14, y - 15);
  rectMode(CORNER);
  rect(x + 25, y - 35, 30, 70, 10, 10, 10, 10);
  rect(x + 30, y - 65, 20, 50);
  noStroke();
  rect(x + 31, y - 45, 18, 40);

  pop();
  //---------------------stand for the pump---------------------
  push();
  translate(-25, 0);
  push();
  fill("gray");
  push(); //important
  rect(x + 160, y, 15, 50);
  rect(x + 132, y + 50, 70, 13, 10, 10, 0, 0);
  pop();

  pop();

  //---------------------right side of the pump---------------------
  push();
  fill("gray");
  beginShape();

  vertex(x + 14 + 60 + 25, y - 15 - 10); //top left corner
  vertex(x + 14 + 60 + 25, y + 15 + 10);
  vertex(x + 99 + 15, y + 25);
  vertex(x + 130, y + 25 + 10);
  vertex(x + 144 + 100 - 40, y + 35); //
  vertex(x + 244 + 5 - 40, y + 35 - 5); //
  vertex(x + 249 - 40, y + 30); //
  vertex(x + 249 - 40, y - 30); //
  vertex(x + 249 - 45, y - 30 - 5);
  vertex(x + 249 - 45, y - 30 - 5);
  vertex(x + 130, y - 35);
  vertex(x + 114, y - 25);

  endShape();
  line(x + 114, y - 25, x + 14 + 60 + 25, y - 15 - 10);
  pop();

  pop();

  //---------------------left side of the pump pipe junction w/bolts---------------------
  push();
  rectMode(CORNER);
  fill("gray");
  //right bolts
  rect(x + 11.5, y - 25, 7, 7);
  rect(x + 11.5, y + 18, 7, 7);
  rect(x + 11.5, y - 12, 7, 7);
  rect(x + 11.5, y + 5, 7, 7);

  //left bolts
  rect(x + 3, y - 25, -7, 7);
  rect(x + 3, y + 18, -7, 7);
  rect(x + 3, y - 12, -7, 7);
  rect(x + 3, y + 5, -7, 7);

  rect(x, y - 28, 14, 56);

  line(x + 7, y - 28, x + 7, y + 28);

  //---------------------details on the right side of the pump---------------------

  push();
  fill("gray");
  rectMode(CENTER);
  rect(x + 75, y, 14, 65);
  line(x + 75, y + 65 / 2, x + 75, y - 65 / 2);
  pop();

  push();
  rectMode(CENTER);
  fill("gray");
  translate(-58, 0);
  rect(x + 200, y, 70, 3);
  rect(x + 200, y + 13, 70, 3);
  rect(x + 200, y - 13, 70, 3);
  rect(x + 200, y + 23, 70, 2.5);
  rect(x + 200, y - 23, 70, 2.5);
  rect(x + 200, y + 31, 70, 2);
  rect(x + 200, y - 31, 70, 2);

  pop();

  pop();

  push();
  //connector out of the pump
  fill(53, 57, 53); //Dark gray pipe color
  rectMode(CENTER);
  rect(x + 40, y - 75, 20, 20);
  rect(x + 40, y - 60, 30, 20, 5, 5, 0, 0);
  rect(x + 40, y - 90, 30, 20, 0, 0, 5, 5);

  pop();

  pop();
}

function drawPressureGauge(x, y) {
  push();
  translate(184, saltTankHeight / 2 - 100);

  //pipe with the bend in it
  push();

  rectMode(CENTER);
  fill("lightgray");
  rect(x, y + 20, 20, 100);

  fill(53, 57, 53);
  push();
  translate(0, 80);
  rectMode(CORNERS);
  rect(x - 10, y - 155, x + 10, y - 125, 10, 0, 0, 0);
  rect(x - 10, y - 155, x + 20, y - 135, 10, 0, 0, 0);
  noStroke();
  rect(x - 9.5, y - 145, x + 9.5, y - 130, 10, 0, 0, 0);
  pop();
  rectMode(CENTER);
  rect(x, y - 40, 30, 20, 5, 5, 0, 0);
  rect(x + 25, y - 65, 20, 30, 5, 0, 0, 5);
  pop();

  push();

  rectMode(CORNERS);
  stroke(0);
  fill("lightgray");
  rect(x + 35, y - 75, x + 70, y - 55);

  translate(-50, 0);

  fill("Goldenrod");
  stroke(0);
  rect(x + 120, y - 75, x + 180, y - 55);
  rect(x + 120, y - 80, x + 140, y - 50, 0, 5, 5, 0);
  rect(x + 180, y - 80, x + 200, y - 50, 5, 0, 0, 5);
  rectMode(CENTER);
  rect(x + 160, y - 80, 15, 30);
  noStroke();
  rect(x + 160, y - 65, 13, 10);
  stroke(0);
  rect(x + 160, y - 85, 25, 10);

  circle(x + 160, y - 145, 100);
  fill("white");
  noStroke();
  circle(x + 160, y - 145, 94);
  noFill();
  stroke(0);
  arc(x + 160, y - 145, 55, 55, -225, 45);

  //--------------------tick marks on pressure gauge--------------------
  translate(x + 160, y - 145);
  angleMode(DEGREES);
  strokeWeight(1.5);
  for (let i = -45; i <= 225; i += (225 + 45) / 4) {
    line(28 * cos(i), -28 * sin(i), 32 * cos(i), -32 * sin(i));
  }
  strokeWeight(1);
  for (let i = -45; i <= 225; i += (225 + 45) / 20) {
    line(28 * cos(i), -28 * sin(i), 30 * cos(i), -30 * sin(i));
  }
  //--------------------numbers on pressure gauge--------------------
  push();
  textAlign(CENTER, CENTER);
  noStroke();
  fill("Black");
  textSize(11);
  for (let i = -45; i <= 225; i += (225 + 45) / 4) {
    text(-(i + 45) / (270 / 20) + 30, 40 * cos(i), -40 * sin(i));
  }
  pop();

  //--------------------Gauge Needle--------------------

  fill("black");
  noStroke();
  triangle(
    35 * cos(-(270 * state.feedPressure) / 20),
    -35 * sin(-(270 * state.feedPressure) / 20),
    15 * cos(-(270 * state.feedPressure) / 20 + 180 - 17),
    -15 * sin(-(270 * state.feedPressure) / 20 + 180 - 17),
    15 * cos(-(270 * state.feedPressure) / 20 + 180 + 17),
    -15 * sin(-(270 * state.feedPressure) / 20 + 180 + 17)
  );
  fill("gray");
  strokeWeight(5);
  circle(0, 0, 10);

  textAlign(CENTER, CENTER);
  noStroke();
  fill("Black");
  textSize(14);
  text("bar", 0, 35);

  pop();

  pop();
}

function drawFilter(x, y) {
  push();
  translate(184, saltTankHeight / 2 - 100);

  push();
  rectMode(CORNERS);
  fill("lightgray");
  stroke(0);
  rect(x + 150, y - 75, x + 220, y - 55);

  pop();

  push();
  rectMode(CORNERS);
  fill("WhiteSmoke");
  rect(x + 250, y - 75, x + 280, y - 55);
  rect(x + 280, y - 100, x + 530, y - 30, 20, 20, 20, 20);
  rect(x + 285, y - 110, x + 320, y - 20, 10, 0, 0, 10);

  fill(53, 57, 53);
  rect(x + 220, y - 75, x + 250, y - 55);
  rect(x + 200, y - 80, x + 220, y - 50, 0, 5, 5, 0);
  rect(x + 250, y - 80, x + 270, y - 50, 5, 0, 0, 5);
  fill("WhiteSmoke");

  //rectangles on the RO inlet cap
  rectMode(CENTER);
  rect(x + 302.5, y - 104, 25, 5, 5, 5, 5, 5);
  rect(x + 302.5, y - 90, 25, 5, 5, 5, 5, 5);
  rect(x + 302.5, y - 77, 25, 5, 5, 5, 5, 5);
  rect(x + 302.5, y - 65, 25, 5, 5, 5, 5, 5);
  rect(x + 302.5, y - 53, 25, 5, 5, 5, 5, 5);
  rect(x + 302.5, y - 40, 25, 5, 5, 5, 5, 5);
  rect(x + 302.5, y - 26, 25, 5, 5, 5, 5, 5);

  //outlet streams
  rectMode(CORNERS);
  fill("lightgray");
  rect(x + 544, y - 25, x + 544 + 12, y + 180);
  rect(x + 567, y - 71, x + 650, y - 71 + 12);
  rect(x + 717, y - 71, x + 760, y - 71 + 12);
  rect(x + 770, y - 45, x + 770 + 12, y + 180);

  fill("whiteSmoke");
  rectMode(CENTER);
  rect(x + 530, y - 42, 30, 14);
  rect(x + 550, y - 34, 14, 30, 0, 10, 0, 0);
  rect(x + 550, y - 34, 14, 30, 0, 10, 0, 0);

  rect(x + 548, y - 65, 35, 14);

  noStroke();
  rect(x + 520, y - 42, 20, 13);
  rect(x + 538, y - 42, 20, 13);

  stroke(0);
  rect(x + 550, y - 20, 20, 15, 5, 5, 0, 0);
  rect(x + 560, y - 65, 15, 20, 5, 0, 0, 5);

  //back pressure regulator

  push();
  rectMode(CENTER);

  fill(53, 57, 53); //dark gray
  rect(x + 680, y - 65, 45, 12);
  rect(x + 680 + 14, y - 70, 15, 5);
  rect(x + 680 - 14, y - 70, 15, 5);
  rect(x + 680 + 14, y - 60, 15, 5);
  rect(x + 680 - 14, y - 60, 15, 5);
  rect(x + 680, y - 65, 15, 25, 5, 5, 5, 5);
  rect(x + 680 - 10, y - 65, 5, 25, 5, 5, 5, 5);
  rect(x + 680 + 10, y - 65, 5, 25, 5, 5, 5, 5);

  fill("Goldenrod");
  rect(x + 650, y - 65, 15, 20, 0, 5, 5, 0);
  rect(x + 710, y - 65, 15, 20, 5, 0, 0, 5);
  pop();

  //corner turn piece
  fill(53, 57, 53); //dark gray
  rectMode(CENTER);
  rect(x + 770, y - 65, 20, 12, 0, 7, 0, 0);
  rect(x + 776, y - 61, 12, 20, 0, 7, 0, 0);
  rect(x + 756, y - 65, 15, 20, 0, 5, 5, 0);
  rect(x + 776, y - 44, 20, 15, 5, 5, 0, 0);

  noStroke();
  rect(x + 770, y - 65, 5, 10, 0, 7, 0, 0);

  pop();

  pop();
}

function drawWater(x, y) {
  // Tank water
  push();

  noStroke();
  fill("white");
  beginShape();
  vertex(x - saltTankWidth / 2, y - saltTankHeight / 2 - 1);
  vertex(x + saltTankWidth / 2, y - saltTankHeight / 2 - 1);
  vertex(x + saltTankWidth / 2, y + saltTankHeight / 2 - 5);
  vertex(x, y + saltTankHeight / 2 + 24);
  vertex(x - saltTankWidth / 2, y + saltTankHeight / 2 - 5);

  endShape();

  fill("PaleTurquoise");
  beginShape();

  vertex(x - saltTankWidth / 2, y - saltTankHeight / 2 - 1 + state.waterDrainTimer);
  vertex(x + saltTankWidth / 2, y - saltTankHeight / 2 - 1 + state.waterDrainTimer);
  vertex(x + saltTankWidth / 2, y + saltTankHeight / 2 - 5);
  vertex(x, y + saltTankHeight / 2 + 24);
  vertex(x - saltTankWidth / 2, y + saltTankHeight / 2 - 5);

  endShape();

  pop();

  //---------------------bottom of the tank pipe turn right---------------------
  push();

  rectMode(CORNERS);
  noStroke();

  fill("white");
  rect(x - 10, y + saltTankHeight / 2 + 38 - 18, x - 10 + 20, y + saltTankHeight / 2 + 38 - 18 + 36);
  rectMode(CORNERS);
  fill("white");
  rect(x - 10, y + saltTankHeight / 2 + 53, x - 10 + 20, y + saltTankHeight / 2 + 53 + 26, 0, 0, 0, 10);
  rect(x - 10, y + saltTankHeight / 2 + 59, x - 10 + 156, y + saltTankHeight / 2 + 59 + 20, 0, 0, 0, 10);

  rectMode(CORNERS);
  fill("PaleTurquoise");
  rect(x - 10, y + saltTankHeight / 2 + 38 - 18, x - 10 + 20, y + saltTankHeight / 2 + 38 - 18 + 36);
  rectMode(CORNERS);
  fill("PaleTurquoise");
  rect(x - 10, y + saltTankHeight / 2 + 53, x - 10 + 20, y + saltTankHeight / 2 + 53 + 26, 0, 0, 0, 10);
  rect(x - 10, y + saltTankHeight / 2 + 59, x - 10 + 156, y + saltTankHeight / 2 + 59 + 20, 0, 0, 0, 10);

  pop();

  pop();

  //---------------------Cover up tank stand leg piece---------------------
  push();
  fill("gray");
  rectMode(CENTER);
  rect(x + 90, y + 220, 20, 50);
  noStroke();
  rect(x + 90, y + 220, 19, 55);
  pop();

  //---------------------Water between pump and pressure gauge---------------------

  push();

  rectMode(CORNERS);
  noStroke();
  fill("white");
  rect(x + 178, y + 21, x + 190, y + 119);
  rect(x + 220, y - 21, x + 253, y - 21 + 12);
  fill("PaleTurquoise");
  rect(x + 178, y + 21, x + 190, y + 119);
  rect(x + 220, y - 21, x + 253, y - 21 + 12);

  pop();

  //---------------------Water between pressure gauge and filter---------------------

  push();

  rectMode(CORNERS);
  noStroke();
  fill("white");
  rect(x + 335, y - 21, x + 383, y - 21 + 12);
  fill("PaleTurquoise");
  rect(x + 335, y - 21, x + 383, y - 21 + 12);

  pop();

  //---------------------Water filter and beaker---------------------

  push();

  //retentate
  rectMode(CORNERS);
  noStroke();
  fill("white");
  rect(x + 752, y - 18, x + 825, y - 18 + 6);
  rect(x + 902, y - 18, x + 932, y - 18 + 6);
  rect(x + 957, y + 14, x + 957 + 6, y + 230);
  fill(170, 255, 230); //retentate green
  rect(x + 752, y - 18, x + 825, y - 18 + 6);
  rect(x + 902, y - 18, x + 932, y - 18 + 6);
  rect(x + 957, y + 14, x + 957 + 6, y + 230);

  //permeate
  fill("white");
  rect(x + 731, y + 38, x + 731 + 6, y + 230);
  fill("LightCyan");
  rect(x + 731, y + 38, x + 731 + 6, y + 230);

  pop();
}

let beakerFlairX = 7;
let beakerThickness = 8;

function drawBeaker(x, y, beakerWidth, beakerHeight) {
  push();

  stroke("blue");
  fill("lightblue");
  beginShape();
  vertex(x, y);
  vertex(x, y + beakerHeight);
  vertex(x + beakerWidth, y + beakerHeight);
  vertex(x + beakerWidth, y);
  vertex(x + beakerWidth + beakerFlairX, y - 10);
  vertex(x + beakerWidth, y - 16);
  vertex(x + beakerWidth - beakerThickness, y - 0.75 * beakerThickness);
  vertex(x + beakerWidth - beakerThickness, y + beakerHeight - beakerThickness);
  vertex(x + beakerThickness, y + beakerHeight - beakerThickness);
  vertex(x + beakerThickness, y - 0.75 * beakerThickness);
  vertex(x, y - 16);
  vertex(x - beakerFlairX, y - 10);
  vertex(x, y);
  endShape();

  pop();
}

function drawTable() {}

function drawPumpSwitch(x, y, switchValue) {
  push();
  translate(333, 220);
  fill("lightgray");
  if (switchValue == true) {
    quad(x + 5, y, x + 20, y - 15, x + 15, y - 20, x, y - 5);
  } else {
    quad(x, y + 5, x + 15, y + 20, x + 20, y + 15, x + 5, y);
  }

  fill("gray");
  rectMode(CENTER);
  rect(x, y, 10, 40);

  pop();
}

/* Optionally add more complex math or animations here */

// When the window is resized, this changes the canvas size
// To match the size of the graphics-wrapper element.
window.windowResized = function () {
  resizeCanvas(graphicsWrapper.offsetWidth, graphicsWrapper.offsetHeight);
};

// This is used to calculate how large the canvas is compared to what
// you state in containerDims. For example, if the canvas is 1600x1200 px
// on the screen and canvasDims[0] is 800, then this will return 2. It is
// used to scale the canvas and mouse coordinates correctly.
window.relativeSize = () => graphicsWrapper.offsetWidth / containerDims[0];
/* function relativeSize() {
  return graphicsWrapper.offsetWidth / containerDims[0];
} */

// This function scales the image to fit the graphics wrapper element.
// Don't touch this.
function handleScaling() {
  window.width = containerDims[0];
  window.height = containerDims[1];
  window.mouseX = mX;
  window.mouseY = mY;
  scale(relativeSize());
}

// If you want to use mouseX and mouseY for whatever reason,
// this function corrects for the fact that the canvas scales in size.
// Don't touch this.
function handleMouseScaling() {
  document.querySelector("canvas").addEventListener("mousemove", (e) => {
    let rect = graphicsWrapper.getBoundingClientRect();
    let mX = e.clientX - rect.left;
    let mY = e.clientY - rect.top;

    // Scale mouse coordinates to match the canvas size
    window.mX = mX / relativeSize();
    window.mY = mY / relativeSize();
  });

  window.mX = 0;
  window.mY = 0;
}

function handleCanvasSize() {
  graphicsWrapper.style.width = "calc(100vw - 40px)";
  // When you remove the "Currently work in progress" element,
  // change 190px to 135px in the two statements below.
  graphicsWrapper.style.maxWidth = `calc(calc(100vh - 190px) * ${containerDims[0]} / ${containerDims[1]})`;
  graphicsWrapper.style.height = `calc(calc(100vw - 40px) * ${containerDims[1]} / ${containerDims[0]})`;
  graphicsWrapper.style.maxHeight = `calc(100vh - 190px)`;
  windowResized();
}
