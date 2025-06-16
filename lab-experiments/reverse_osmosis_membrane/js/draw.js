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

  // Draw pipes first, then water, then pipe connectors and equiptment meant to cover the water
  drawSaltTank(175, 400);
  drawPressureGauge(175, 400);
  drawWater(175, 400);
  drawPump(175, 400);
  //draw text last so it appears over the water
  drawTextOnTopOfDiagram(175, 400);
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
  //translate(40, 0);
  rect(335, 400, 15, 50);
  rect(307, 450, 70, 13, 10, 10, 0, 0);
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
  fill(53, 57, 53);
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

  fill("LightCyan");
  beginShape();
  vertex(x - saltTankWidth / 2, y - saltTankHeight / 2 - 1);
  vertex(x + saltTankWidth / 2, y - saltTankHeight / 2 - 1);
  vertex(x + saltTankWidth / 2, y + saltTankHeight / 2 - 5);
  vertex(x, y + saltTankHeight / 2 + 24);
  vertex(x - saltTankWidth / 2, y + saltTankHeight / 2 - 5);

  endShape();

  pop();

  //---------------------bottom of the tank pipe turn right---------------------
  push();

  rectMode(CENTER);
  noStroke();

  fill("white");
  rect(x, y + saltTankHeight / 2 + 38, 20, 36);
  rectMode(CORNER);
  fill("white");
  rect(x - 10, y + saltTankHeight / 2 + 53, 20, 26, 0, 0, 0, 10);
  rect(x - 10, y + saltTankHeight / 2 + 59, 156, 20, 0, 0, 0, 10);

  rectMode(CENTER);
  fill("LightCyan");
  rect(x, y + saltTankHeight / 2 + 38, 20, 36);
  rectMode(CORNER);
  fill("LightCyan");
  rect(x - 10, y + saltTankHeight / 2 + 53, 20, 26, 0, 0, 0, 10);
  rect(x - 10, y + saltTankHeight / 2 + 59, 156, 20, 0, 0, 0, 10);

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
}

/* function drawPipeCornerConnector(x, y) {}

function drawPipeCornerConnector(x, y) {} */

function drawPipeAndPump(tankX, tankY) {
  // Calculate pipe start position
  let pipeStartX = tankX + 100;
  let pipeY = tankY + 75;

  // Draw pressure gauge base (behind pipe)
  let gaugeX = tankX + 260; // Positioned right after pump
  fill(150); // Same gray as pump
  noStroke();
  rect(gaugeX + 7, pipeY - 25, 10, 20); // Small rectangle poking up behind pipe

  // Add thin centered rectangle behind gauge
  rect(gaugeX - 2, pipeY - 10, 29, 10); // Slightly wider and thinner rectangle

  // Draw circle above the T structure
  circle(gaugeX + 12, pipeY - 28, 30); // Centered above the T structure

  fill(255); // White color
  circle(gaugeX + 12, pipeY - 28, 22); // Same center, slightly smaller diameter

  // Add red dot at bottom of gauge and needle
  fill(255, 0, 0); // Red color
  circle(gaugeX + 12, pipeY - 22, 4); // Small red circle near bottom

  // Add gauge needle from red dot at 45 degrees left
  stroke(255, 0, 0); // Red color
  strokeWeight(1); // Thin line
  let needleLength = 9; // Shorter needle
  let endX = gaugeX + 12 - needleLength * Math.cos(Math.PI / 4); // 45 degrees left
  let endY = pipeY - 22 - needleLength * Math.sin(Math.PI / 4);
  line(gaugeX + 12, pipeY - 22, endX, endY); // Line at 45 degrees

  // Reset stroke for pipe
  noStroke();

  // Draw horizontal pipe
  stroke(100);
  strokeWeight(8);
  line(pipeStartX, pipeY, pipeStartX + 520, pipeY);

  // Add 90-degree elbow bend at the end
  line(pipeStartX + 520, pipeY, pipeStartX + 520, pipeY + 30); // Vertical part of the elbow

  // Add faucet end (wider rectangle)
  noStroke();
  fill(100); // Same gray as pipe
  rect(pipeStartX + 515, pipeY + 28, 11, 7, 2); // Slightly wider than pipe, rounded corners

  // Add beaker under first faucet
  stroke(0);
  strokeWeight(2);
  fill(0);
  let beakerX1 = pipeStartX + 509; // Align with first faucet
  let beakerY1 = pipeY + 40; // Position below first faucet
  rect(beakerX1, beakerY1, 4, 70, 4); // Left vertical rectangle
  rect(beakerX1 - 7, beakerY1, 10, 4, 4); // Top horizontal rectangle protruding left
  rect(beakerX1, beakerY1 + 66, 56, 4, 4); // Bottom horizontal rectangle
  rect(beakerX1 + 52, beakerY1, 4, 70, 4); // Right vertical rectangle
  rect(beakerX1 + 52, beakerY1, 8, 4, 4); // Top horizontal rectangle protruding right

  // Draw pump
  let pumpX = tankX + 150;

  // T-valve (drawn first so it appears behind)
  stroke(0);
  strokeWeight(2);
  fill(0);
  rect(pumpX + 25, pipeY - 35, 10, 25);
  rect(pumpX + 15, pipeY - 35, 30, 8);

  // Pump body as wider rounded rectangle
  fill(150);
  stroke(0);
  strokeWeight(2);
  rect(pumpX - 5, pipeY - 20, 70, 40, 5);

  // Add "Pump" label
  noStroke();
  fill(0);
  textSize(16);
  textAlign(CENTER);
  text("Pump", pumpX + 30, pipeY - 45);

  textAlign(LEFT);

  // Add white rounded rectangle to right of gauge
  stroke(0); // Black outline
  strokeWeight(1);
  fill(255); // White fill
  rect(gaugeX + 75, pipeY - 35, 200, 70, 8); // Centered vertically on pipe

  // Add back pressure regulator
  noStroke();
  fill(0); // Black fill
  rect(gaugeX + 300, pipeY - 12.5, 40, 25, 5); // Centered on pipe (-12.5 to center 25px height on pipe)

  // Add vertical part centered on horizontal part
  rect(gaugeX + 310, pipeY - 29, 20, 46, 5); // Made wider (20px instead of 10px)

  // Add pentagon on top
  beginShape();
  let pentX = gaugeX + 320; // Center of pentagon
  let pentY = pipeY - 33; // Top position
  let pentSize = 14; // Size of pentagon

  // Calculate pentagon points
  vertex(pentX, pentY - pentSize); // Top point
  vertex(pentX + pentSize, pentY - pentSize / 3); // Upper right
  vertex(pentX + pentSize / 1.5, pentY + pentSize); // Lower right
  vertex(pentX - pentSize / 1.5, pentY + pentSize); // Lower left
  vertex(pentX - pentSize, pentY - pentSize / 3); // Upper left
  endShape(CLOSE);

  // Add gray rounded rectangle at bottom of membrane
  noStroke();
  fill(100); // Same gray as pipes
  rect(gaugeX + 246, pipeY + 35, 10, 25); // Vertical pipe section

  // Add faucet end at bottom (reusing existing faucet design)
  noStroke();
  fill(100); // Same gray as pipe
  rect(gaugeX + 244, pipeY + 58, 14, 8, 2); // Slightly wider than pipe, rounded corners

  // Add beaker prototype
  stroke(0);
  strokeWeight(2);
  fill(0);
  let beakerX = gaugeX + 238; // Align with faucet (moved 6px left from 244)
  let beakerY = pipeY + 70; // Position below faucet
  rect(beakerX, beakerY, 4, 70, 4); // Left vertical rectangle
  rect(beakerX - 7, beakerY, 10, 4, 4); // Top horizontal rectangle protruding left
  rect(beakerX, beakerY + 66, 56, 4, 4); // Bottom horizontal rectangle
  rect(beakerX + 52, beakerY, 4, 70, 4); // Right vertical rectangle
  rect(beakerX + 52, beakerY, 8, 4, 4); // Top horizontal rectangle protruding right
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
