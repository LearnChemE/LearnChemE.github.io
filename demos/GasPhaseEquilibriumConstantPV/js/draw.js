import { calcAll } from "./calcs.js";
const selectionElement = document.getElementById("selection");
const p5container = document.getElementById("p5-container");
const eqText = document.getElementById("equilibrium-text");
const meter3 = document.getElementById("meter3-text");
const volumeSliderWrapper = document.getElementById("volume-slider-wrapper");
const pressureSliderWrapper = document.getElementById("pressure-slider-wrapper");

//defined local variables only needed in draw
let angleX = 0;
let angleY = 0;
let meter3Image;
let font;

//preload for loading images and fonts
window.preload = function () {
  font = loadFont("./assets/NotoSans-Regular.ttf");
  meter3Image = loadImage("./assets/imageMeterCubed.jpg");
};

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
window.setup = function () {
  createCanvas(p5container.offsetWidth, p5container.offsetHeight, WEBGL).parent(p5container);
  frameRate(60);
};

// Same with draw() - this should never be inside a conditional statement.
// Put the conditional statements inside the draw function.
window.draw = function () {
  // The "window" keyword is used to set global variables. So you can use
  // "selection" in any file, function, block, etc.

  const selectionElement = document.querySelector('input[name="selection"]:checked');
  window.selection = selectionElement.value;

  resize();
  background(255);
  calcAll();

  //A ⇋ rB must be drawn using HTML and is controlled by the radio buttons here
  const coeffB = document.querySelector('input[name="plot"]:checked');
  if (coeffB && coeffB.value != 1) {
    document.getElementById("equilibrium-text").textContent = `A ⇋ ${coeffB.value}B`;
  } else if (coeffB && coeffB.value == 1) {
    document.getElementById("equilibrium-text").textContent = `A ⇋ B`;
  }

  if (selection === "constant-pressure") {
    draw3DCylinderForConstPressureSelection();
    drawPlotForConstPressureSelection();
    drawTextForConstPressureSelection();
    drawBarsForConstPressurePlot();
    volumeSliderWrapper.style.display = "none";
    pressureSliderWrapper.style.display = "grid";
  } else if (selection === "constant-volume") {
    draw3DCylinderForConstVolumeSelection();
    drawPlotForConstVolumeSelection();
    drawTextForConstVolumeSelection();
    drawBarsForConstVolumePlot();
    volumeSliderWrapper.style.display = "grid";
    pressureSliderWrapper.style.display = "none";
  }
};

// Look this function up in p5.js documentation. The width and height of
// the #p5-container element are set in the css file.
window.windowResized = () => {
  resizeCanvas(p5container.offsetWidth, p5container.offsetHeight);
};

//const label = selection === "velocity-distribution" ? "Velocity Distribution" : "Velocity vs Height";

function draw3DCylinderForConstPressureSelection() {
  //blendMode(ADD);

  /*

  //This adds ability to rotate the cylinder if needed

  if (mouseIsPressed) {
    let deltaX = mouseX - lastMouseX;
    let deltaY = mouseY - lastMouseY;

    angleY += deltaX * damping;  
    angleX -= deltaY * damping;  
  }

  lastMouseX = mouseX;
  lastMouseY = mouseY;

  */

  push();

  ortho();
  rotateX(-PI / 24);

  translate(-350, 90);
  rotateX(angleX);
  rotateZ(angleY);
  rotateY(3 * HALF_PI);

  push();
  translate(0, -1 - z.cylHeight / 2);
  rotateX(HALF_PI);
  fill(0, 0, 0);
  torus(z.cylRadius - 1, 1, 64);
  pop();

  push();
  translate(0, 1 + z.cylHeight / 2);
  rotateX(HALF_PI);
  fill(0, 0, 0);
  torus(z.cylRadius - 1, 1, 64);
  pop();

  //piston head + outlines
  push();
  translate(0, -0.5 * (z.cylHeight - 280) - z.cylHeight * z.cylinderLiveVolumeFractionConstantPressureCase + 0.5 * z.cylHeight);
  fill(100, 100, 100);
  cylinder(z.cylRadius - 1, z.cylHeight - 280, 64, 1);

  push();
  translate(0, -0.5 * (z.cylHeight - 280));
  rotateX(HALF_PI);
  fill(0, 0, 0);
  torus(z.cylRadius - 1.5, 1, 64);
  pop();

  push();
  translate(0, 0.5 * (z.cylHeight - 280));
  rotateX(HALF_PI);
  fill(0, 0, 0);
  torus(z.cylRadius - 1.5, 1, 64);
  pop();

  pop();

  //piston rod + outlines
  push();
  translate(0, -0.5 * (z.cylHeight - 280) - z.cylHeight * z.cylinderLiveVolumeFractionConstantPressureCase);
  fill(120, 120, 120);
  cylinder(z.cylRadius - 80, z.cylHeight, 64, 1, false);

  push();
  translate(0, -11 + z.cylHeight / 2);
  rotateX(HALF_PI);
  fill(0, 0, 0);
  torus(z.cylRadius - 79, 1, 64);
  pop();

  pop();

  //green gas volume
  push();
  fill(0, 200, 0, 32 / z.cylinderLiveVolumeFractionConstantPressureCase);
  translate(0, (z.cylHeight * (1 - z.cylinderLiveVolumeFractionConstantPressureCase)) / 2);
  cylinder(z.cylRadius - 1, -1 - z.cylHeight * z.cylinderLiveVolumeFractionConstantPressureCase, 64, 1, false);

  pop();

  //Overall chamber + outlines
  fill(0, 0, 0, 9);
  cylinder(z.cylRadius, z.cylHeight, 64, 1, false, true);

  pop();
}

function drawPlotForConstPressureSelection() {
  line(50, -220, 50, 310);
  line(50, 310, 510, 310);

  for (let i = 310; i > -220; i -= 530 / 35) {
    line(50, i, 54, i);
  }

  for (let i = 310; i > -221; i -= 530 / 7) {
    line(50, i, 58, i);
  }
}

function drawTextForConstPressureSelection() {
  for (let i = 310; i > -221; i -= 530 / 7) {
    fill("Black");
    textFont(font);
    textSize(20);
    text(Math.floor(-(7 / 530) * (i - 310)), 25, i + 5);
  }

  push();
  rotate(3 * HALF_PI);
  fill("Black");
  textFont(font);
  textSize(20);
  text("final number of moles", -125, -30 + (310 - 220) / 2);
  pop();

  push();

  fill("Black");
  textFont(font);
  textSize(28);
  text("pressure = " + z.pressureConstPressureCase.toFixed(2) + " bar", -265, -320);
  text("final volume = " + z.volumeConstPressureCase.toFixed(2), -265, -280);
  if (z.volumeConstPressureCase < 10) {
    tint(255, 242);
    image(meter3Image, -13, -316);
  } else if (z.volumeConstPressureCase >= 10) {
    image(meter3Image, 0, -316);
  }

  pop();

  push();

  fill("Black");
  textFont(font);
  textSize(28);
  text("mol A", 90, 305 - z.molAForConstPressureSelection * (530 / 7));
  text("mol B", 90 + 450 / 3, 305 - z.molBForConstPressureSelection * (530 / 7));
  text("mol inerts", 62.5 + 450 * (2 / 3), 305 - z.molesInerts * (530 / 7));
  text(z.molAForConstPressureSelection.toFixed(1), 110, 265 - z.molAForConstPressureSelection * (530 / 7));
  text(z.molBForConstPressureSelection.toFixed(1), 110 + 450 / 3, 265 - z.molBForConstPressureSelection * (530 / 7));
  text(z.molesInerts.toFixed(1), 110 + 450 * (2 / 3), 265 - z.molesInerts * (530 / 7));

  pop();
}

function drawBarsForConstPressurePlot() {
  push();

  //strokeWeight(1);
  fill(239, 100, 255);
  rect(60, 310 - z.molAForConstPressureSelection * (530 / 7), 450 / 3 - 10, z.molAForConstPressureSelection * (530 / 7));

  pop();

  push();

  //strokeWeight(1);
  fill(248, 215, 146);
  rect(60 + 450 * (1 / 3), 310 - z.molBForConstPressureSelection * (530 / 7), 450 / 3 - 10, z.molBForConstPressureSelection * (530 / 7));

  pop();

  push();

  //strokeWeight(1);
  fill(55, 188, 239);
  rect(60 + 450 * (2 / 3), 310 - z.molesInerts * (530 / 7), 450 / 3 - 10, z.molesInerts * (530 / 7));

  pop();
}

function draw3DCylinderForConstVolumeSelection() {
  /*
  //This adds ability to rotate the cylinder if needed

  if (mouseIsPressed) {
    let deltaX = mouseX - lastMouseX;
    let deltaY = mouseY - lastMouseY;

    angleY += deltaX * damping;  
    angleX -= deltaY * damping;  
  }
    
  lastMouseX = mouseX;
  lastMouseY = mouseY;
  */

  push();

  ortho();
  rotateX(-PI / 24);

  translate(-350, 90);
  rotateX(angleX);
  rotateZ(angleY);
  rotateY(3 * HALF_PI);

  push();
  translate(0, 1 + z.cylHeight / 2);
  rotateX(HALF_PI);
  fill(0, 0, 0);
  torus(z.cylRadius - 1, 1, 64);
  pop();

  //piston head + outlines
  push();
  translate(0, -0.5 * (z.cylHeight - 280) - z.cylHeight * z.cylinderLiveVolumeFractionConstantVolumeCase + 0.5 * z.cylHeight);

  push();
  translate(0, 0.5 * (z.cylHeight - 280));
  rotateX(HALF_PI);
  fill(0, 0, 0);
  torus(z.cylRadius - 1.5, 1, 64);
  pop();

  pop();

  //green gas volume
  push();
  fill(0, 200, 0, 32 / z.cylinderLiveVolumeFractionConstantVolumeCase + 70 / (6 / z.molesInerts));
  translate(0, (z.cylHeight * (1 - z.cylinderLiveVolumeFractionConstantVolumeCase)) / 2);
  cylinder(z.cylRadius - 1, -1 - z.cylHeight * z.cylinderLiveVolumeFractionConstantVolumeCase, 64, 1, false);

  pop();

  pop();
}

function drawPlotForConstVolumeSelection() {
  line(50, -220, 50, 310);
  line(50, 310, 510, 310);

  for (let i = 310; i > -220; i -= 530 / 35) {
    line(50, i, 54, i);
  }

  for (let i = 310; i > -221; i -= 530 / 7) {
    line(50, i, 58, i);
  }
}

function drawTextForConstVolumeSelection() {
  for (let i = 310; i > -221; i -= 530 / 7) {
    fill("Black");
    textFont(font);
    textSize(20);
    text(Math.floor(-(7 / 530) * (i - 310)), 25, i + 5);
  }

  push();
  rotate(3 * HALF_PI);
  fill("Black");
  textFont(font);
  textSize(20);
  text("final number of moles", -125, -30 + (310 - 220) / 2);
  pop();

  push();

  fill("Black");
  textFont(font);
  textSize(28);
  text("final pressure = " + z.pressureConstVolumeCase.toFixed(2) + " bar", -265, -320);
  text("volume = " + z.volumeConstVolumeCase.toFixed(2), -200, -280);
  if (z.volumeConstVolumeCase < 10) {
    tint(255, 242);
    image(meter3Image, -13, -316);
  } else if (z.volumeConstVolumeCase >= 10) {
    image(meter3Image, 0, -316);
  }

  pop();

  push();

  fill("Black");
  textFont(font);
  textSize(28);
  text("mol A", 90, 305 - z.molAForConstVolumeSelection * (530 / 7));
  text("mol B", 90 + 450 / 3, 305 - z.molBForConstVolumeSelection * (530 / 7));
  text("mol inerts", 62.5 + 450 * (2 / 3), 305 - z.molesInerts * (530 / 7));
  text(z.molAForConstVolumeSelection.toFixed(1), 110, 265 - z.molAForConstVolumeSelection * (530 / 7));
  text(z.molBForConstVolumeSelection.toFixed(1), 110 + 450 / 3, 265 - z.molBForConstVolumeSelection * (530 / 7));
  text(z.molesInerts.toFixed(1), 110 + 450 * (2 / 3), 265 - z.molesInerts * (530 / 7));

  pop();

  /*
  equation = createP();
  equation.style('font-size', '20px');
  equation.position(240, -290);
  katex.render('A 2B', equation.elt);
  */
}

function drawBarsForConstVolumePlot() {
  push();

  //strokeWeight(1);
  fill(239, 100, 255);
  rect(60, 310 - z.molAForConstVolumeSelection * (530 / 7), 450 / 3 - 10, z.molAForConstVolumeSelection * (530 / 7));

  pop();

  push();

  //strokeWeight(1);
  fill(248, 215, 146);
  rect(60 + 450 * (1 / 3), 310 - z.molBForConstVolumeSelection * (530 / 7), 450 / 3 - 10, z.molBForConstVolumeSelection * (530 / 7));

  pop();

  push();

  //strokeWeight(1);
  fill(55, 188, 239);
  rect(60 + 450 * (2 / 3), 310 - z.molesInerts * (530 / 7), 450 / 3 - 10, z.molesInerts * (530 / 7));

  pop();
}
