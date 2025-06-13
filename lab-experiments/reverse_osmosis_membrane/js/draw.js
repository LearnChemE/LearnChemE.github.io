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
  createCanvas(
    graphicsWrapper.offsetWidth,
    graphicsWrapper.offsetHeight
  ).parent(graphicsWrapper);
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

  // Draw tank last so it appears on top
  drawSaltTank(175, 400);
  drawPump(175, 400);
};

let saltTankWidth = 200;
let saltTankHeight = 300;

function drawSaltTank(x, y) {
  // Tank outline
  push();
  fill("gray");
  stroke("black");
  strokeWeight(1);
  line(
    x - saltTankWidth / 2 - 5,
    y - saltTankHeight / 2,
    x - saltTankWidth / 2 - 5,
    y + saltTankHeight / 2
  );
  beginShape();
  vertex(x - saltTankWidth / 2 - 5, y - saltTankHeight / 2);
  vertex(x + saltTankWidth / 2 + 5, y - saltTankHeight / 2);
  vertex(x + saltTankWidth / 2 + 5, y + saltTankHeight / 2);
  vertex(x, y + saltTankHeight / 2 + 30);
  vertex(x - saltTankWidth / 2 - 5, y + saltTankHeight / 2);

  endShape();

  noStroke();
  fill("LightCyan");
  beginShape();
  vertex(x - saltTankWidth / 2, y - saltTankHeight / 2 - 1);
  vertex(x + saltTankWidth / 2, y - saltTankHeight / 2 - 1);
  vertex(x + saltTankWidth / 2, y + saltTankHeight / 2 - 5);
  vertex(x, y + saltTankHeight / 2 + 24);
  vertex(x - saltTankWidth / 2, y + saltTankHeight / 2 - 5);

  endShape();

  pop();

  //---------------------bottom of the tank spout---------------------
  push();
  stroke("black");
  strokeWeight(1);
  rectMode(CENTER);
  fill("gray");
  rect(x, y + saltTankHeight / 2 + 40, 30, 30);

  pop();

  //---------------------bottom of the tank pipe turn right---------------------
  push();
  stroke("black");
  strokeWeight(1);
  rectMode(CORNER);
  fill("gray");
  rect(x - 15, y + saltTankHeight / 2 + 54, 160, 30, 0, 0, 0, 15);
  noStroke();
  rectMode(CENTER);
  fill("gray");
  rect(x, y + saltTankHeight / 2 + 40, 29, 34);
  noStroke();
  fill("LightCyan");
  rect(x, y + saltTankHeight / 2 + 38, 20, 36);
  rectMode(CORNER);
  fill("LightCyan");
  rect(x - 10, y + saltTankHeight / 2 + 53, 20, 26, 0, 0, 0, 10);
  rect(x - 10, y + saltTankHeight / 2 + 59, 156, 20, 0, 0, 0, 10);
  stroke("black");
  strokeWeight(1);
  fill("gray");
  rect(x - 16 + 160 - 4, y + saltTankHeight / 2 + 55 + 2, 7, 7);
  rect(x - 16 + 160 - 4, y + saltTankHeight / 2 + 72 + 2, 7, 7);
  rect(x - 16 + 160 - 4, y + saltTankHeight / 2 + 42 + 2, 7, 7);
  rect(x - 16 + 160 - 4, y + saltTankHeight / 2 + 85 + 2, 7, 7);
  rect(x - 16 + 160, y + saltTankHeight / 2 + 41, 7, 56);

  pop();

  // Add text
  textAlign(CENTER, CENTER);
  fill(0);
  textSize(20);
  text("Salt", x, y);
  text("Solution", x, y + 25);
  textAlign(LEFT);
}

function drawPump(x, y) {
  push();
  translate(-16 + 160, saltTankHeight / 2 + 41 + 28);

  push();
  fill("gray");
  beginShape();

  vertex(x + 14, y - 15); //top left corner
  vertex(x + 14, y + 15);
  vertex(x + 14 + 60, y + 15);
  vertex(x + 14 + 60 + 25, y + 15 + 10);
  vertex(x + 14 + 60 + 25, y - 15 - 10);
  vertex(x + 14 + 60, y - 15);
  endShape();
  line(x + 14 + 60, y - 15, x + 14, y - 15);
  rectMode(CORNER);
  rect(x + 30, y - 75, 30, 90);
  arc(x + 45, y + 15, 30, 30, 2 * PI, PI);
  noStroke();
  arc(x + 45, y + 10, 28, 30, 2 * PI, PI);

  pop();
  //---------------------stand for the pump---------------------

  push();

  fill("gray");
  quad(x + 140, y + 30, x + 150, y + 30, x + 120, y + 60, x + 110, y + 60);
  push();
  translate(40, 0);
  quad(x + 180, y + 30, x + 190, y + 30, x + 220, y + 60, x + 210, y + 60);
  pop();

  pop();

  //---------------------right side of the pump---------------------
  push();
  fill("gray");
  beginShape();

  vertex(x + 14 + 60 + 25, y - 15 - 10); //top left corner
  vertex(x + 14 + 60 + 25, y + 15 + 10);
  vertex(x + 99 + 15, y + 25);
  vertex(x + 114 + 30, y + 25 + 10);
  vertex(x + 144 + 100, y + 35);
  vertex(x + 244 + 5, y + 35 - 5);
  vertex(x + 249, y + 30);
  vertex(x + 249, y - 30);
  vertex(x + 249 - 5, y - 30 - 5);
  vertex(x + 249 - 5, y - 30 - 5);
  vertex(x + 144, y - 35);
  vertex(x + 144 - 25, y - 25);

  endShape();
  line(x + 144 - 25, y - 25, x + 14 + 60 + 25, y - 15 - 10);
  pop();

  push();
  rectMode(CORNER);
  fill("gray");
  rect(x + 11.5, y - 25, 7, 7);
  rect(x + 11.5, y + 18, 7, 7);
  rect(x + 11.5, y - 12, 7, 7);
  rect(x + 11.5, y + 5, 7, 7);
  rect(x + 7, y - 28, 7, 56);

  pop();

  push();
  fill("gray");
  rectMode(CENTER);
  rect(x + 100, y, 14, 65);
  line(x + 100, y + 65 / 2, x + 100, y - 65 / 2);
  pop();

  push();
  rectMode(CENTER);
  fill("gray");
  rect(x + 200, y, 75, 3);
  rect(x + 200, y + 13, 75, 3);
  rect(x + 200, y - 13, 75, 3);
  rect(x + 200, y + 23, 75, 2.5);
  rect(x + 200, y - 23, 75, 2.5);
  rect(x + 200, y + 31, 75, 2);
  rect(x + 200, y - 31, 75, 2);

  pop();

  push();

  rectMode(CENTER);
  fill("gray");
  rect(x + 54, y - 77, 7, 7);
  rect(x + 54, y - 63, 7, 7);
  rect(x + 37, y - 77, 7, 7);
  rect(x + 37, y - 63, 7, 7);

  rect(x + 67, y - 77, 7, 7);
  rect(x + 67, y - 63, 7, 7);
  rect(x + 24, y - 77, 7, 7);
  rect(x + 24, y - 63, 7, 7);
  rect(x + 45, y - 70, 56, 14);
  line(x + 17, y - 70, x + 73, y - 70);

  pop();

  pop();
}

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
