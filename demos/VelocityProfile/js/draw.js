import { calcAll } from './calcs.js';
const selectionElement = document.getElementById('selection');
const p5container = document.getElementById('p5-container');



// This function is used to scale the canvas based on the size of the container
window.relativeSize = () => p5container.offsetWidth / 1280;

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
}

window.draw = function() {
  window.selection = selectionElement.value;
  resize();
  background(255);
  calcAll();

  if (selection === "velocity-distribution") {
    drawGraphDist();
    drawAxesLablesDist();
    drawMouseDist();
  } else if (selection === "velocity-vs-height") {
    drawGraphHeight();
    drawAxesLablesHeight();
    drawMouseHeight();
  }
}

window.windowResized = () => {
  resizeCanvas(p5container.offsetWidth, p5container.offsetHeight);
}

function drawGraphDist() {
  push();

  rectMode(CENTER);
  stroke('black');
  strokeWeight(5);
  rect(z.graphCenterX, z.graphCenterY, 854, 480);

  rectMode(CENTER);
  fill(205, 115, 215);
  noStroke();
  rect(z.graphCenterX, z.centerYTop, 854, (z.distBY - z.distTY) * z.hTop); // purple

  rectMode(CENTER);
  fill(30, 255, 55);
  noStroke();
  rect(z.graphCenterX, z.centerYMid, 854, (z.distBY - z.distTY) * z.hMid); // green

  rectMode(CENTER);
  fill(40, 95, 220);
  noStroke();
  rect(z.graphCenterX, z.centerYBot, 854, (z.distBY - z.distTY) * z.hBot); // blue

  rectMode(CENTER);
  fill(100, 100, 100);
  stroke('black');
  strokeWeight(3.25);
  rect(z.graphCenterX, (z.graphCenterY - 265), 856, 50);

  rectMode(CENTER);
  fill(100, 100, 100);
  stroke('black');
  strokeWeight(3.25);
  rect(z.graphCenterX, (z.graphCenterY + 265), 856, 50);

  stroke('black');
  strokeWeight(3);
  line(z.distLineX12, (-((z.distBY - z.distTY) * z.hBot) + z.distBY), z.distLX, z.distBY);
  line(z.distLineX12, (-((z.distBY - z.distTY) * z.hBot) + z.distBY), z.distLineX23, -((z.distBY - z.distTY) * z.hBot) - ((z.distBY - z.distTY) * z.hMid) + z.distBY);
  line(z.distLineX23, -((z.distBY - z.distTY) * z.hBot) - ((z.distBY - z.distTY) * z.hMid) + z.distBY, z.distRX, z.distTY);

  pop();
}

function drawAxesLablesDist() {
  push();

  let intervalV = 0;
  let intervalH = 0;

  // Vertical
  for (let i = z.distBY; i + 1 > z.distTY; i -= (z.distBY - z.distTY) / 5) {
    stroke('black');
    strokeWeight(2);
    line(z.distLX, i, z.distLX + 5, i);


    textAlign(CENTER);
    noStroke();
    fill("Black");
    textSize(24);

    let intervalVRound = intervalV.toFixed(1);
    text(intervalVRound, z.distLX - 24, i + 8);
    intervalV += 0.2;

  }

  for (let i = z.distBY; i + 1 > z.distTY; i -= (z.distBY - z.distTY) / 10) {
    stroke('black');
    strokeWeight(1);
    line(z.distLX, i, z.distLX + 5, i);
  }


  let divide = 4;

  if (0.34 * (3 / 4) < (1 - z.hTop - z.hMid)) {
    divide = 4;
  }
  if (0.34 * (2 / 4) < (1 - z.hTop - z.hMid) < 0.34 * (3 / 4)) {
    divide = 3;
  }
  if (0.07 < (1 - z.hTop - z.hMid) < (0.34 * (2 / 4))) {
    divide = 2;
  }
  if ((1 - z.hTop - z.hMid) < (0.07)) {
    divide = 1;
  }

  let divide2 = 4;

  if (0.34 * (3 / 4) < (z.hMid)) {
    divide2 = 4;
  }

  if (0.34 * (2 / 4) < (z.hMid) < 0.34 * (3 / 4)) {
    divide2 = 3;
  }

  if (0.05 < (z.hMid) < (0.34 * (2 / 4))) {
    divide2 = 2;
  }

  if ((z.hMid) < (0.05)) {
    divide2 = 1;
  }

  let divide3 = 4;

  if (0.34 * (3 / 4) < (z.hTop)) {
    divide3 = 4;
  }

  if (0.34 * (2 / 4) < (z.hTop) < 0.34 * (3 / 4)) {
    divide3 = 3;
  }

  if (0.05 < (z.hTop) < (0.34 * (2 / 4))) {
    divide3 = 2;
  }

  if ((z.hTop) < (0.05)) {
    divide3 = 1;
  }

  let h3 = z.hTop;
  let h2 = z.hMid;
  let h1 = 1 - z.hTop - z.hMid;

  function fluid1LineXOut(y) {
    return (((z.distBY - y) / (z.distBY - z.distTY)) * ((z.muMid * z.muTop) / (h3 * z.muMid + h2 * z.muTop + h1 * z.muMid * z.muTop))) * (z.distRX - z.distLX) + z.distLX;
  }

  function fluid2LineXOut(y) {
    return ((z.muTop * (((z.distBY - y) / (z.distBY - z.distTY)) - h1 + h1 * z.muMid)) / (h3 * z.muMid + h2 * z.muTop + h1 * z.muMid * z.muTop)) * (z.distRX - z.distLX) + z.distLX;
  }

  function fluid3LineXOut(y) {
    return ((z.muMid * (((z.distBY - y) / (z.distBY - z.distTY)) - h1 - h2) + z.muTop * (h2 + h1 * z.muMid)) / (h3 * z.muMid + h2 * z.muTop + h1 * z.muMid * z.muTop)) * (z.distRX - z.distLX) + z.distLX;
  }

  for (let i = z.distBY - (z.distBY - (z.distTY + ((z.distBY - z.distTY) * (z.hTop + z.hMid)))) / divide; i - 1 > (z.distTY + ((z.distBY - z.distTY) * (z.hTop + z.hMid))); i -= (z.distBY - (z.distTY + ((z.distBY - z.distTY) * (z.hTop + z.hMid)))) / divide) {
    stroke('black');
    strokeWeight(3);
    line(z.distLX, i, fluid1LineXOut(i), i);
    noStroke();
    triangle(fluid1LineXOut(i) - 25, i + 10, fluid1LineXOut(i) - 25, i - 10, fluid1LineXOut(i), i);
  }

  for (let i = (z.distTY + ((z.distBY - z.distTY) * (z.hTop + z.hMid))); i - 1 > (z.distTY + ((z.distBY - z.distTY) * (z.hTop))); i -= ((z.distTY + ((z.distBY - z.distTY) * (z.hTop + z.hMid))) - (z.distTY + ((z.distBY - z.distTY) * (z.hTop)))) / divide2) {
    stroke('black');
    strokeWeight(3);
    line(z.distLX, i, fluid2LineXOut(i), i);
    noStroke();
    triangle(fluid2LineXOut(i) - 25, i + 10, fluid2LineXOut(i) - 25, i - 10, fluid2LineXOut(i), i);
  }

  for (let i = (z.distTY + ((z.distBY - z.distTY) * (z.hTop))); i + 1 > z.distTY; i -= ((z.distTY + ((z.distBY - z.distTY) * (z.hTop))) - z.distTY) / divide3) {
    stroke('black');
    strokeWeight(3);
    line(z.distLX, i, fluid3LineXOut(i), i);
    noStroke();
    triangle(fluid3LineXOut(i) - 25, i + 10, fluid3LineXOut(i) - 25, i - 10, fluid3LineXOut(i), i);
  }

  push();
  textAlign(CENTER);
  stroke('Black');
  strokeWeight(0.2);
  fill("Black");
  textSize(28);
  translate(z.graphCenterX - z.graphCenterX * 49 / 64, z.graphCenterY);
  rotate(HALF_PI * 3);
  text('fraction of fluid height', 0, 0);
  pop();

  textAlign(CENTER);
  noStroke();
  fill("Black");
  textSize(24);

  // Horizontal
  for (let i = z.distLX; i - 1 < z.distRX; i += (z.distRX - z.distLX) / 5) {
    let intervalHRound = intervalH.toFixed(1);
    text(intervalHRound, i, z.distBY + 80);
    intervalH += 0.2;
  }

  textAlign(CENTER);
  noStroke();
  fill("White");
  textSize(32);
  text(`moving plate`, z.graphCenterX, (z.graphCenterY - 240 - 13));
  text(`stationary plate`, z.graphCenterX, (z.graphCenterY + 275));

  push();
  textAlign(CENTER);
  stroke('Black');
  strokeWeight(0.2);
  fill("Black");
  textSize(28);
  text('fluid velocity', z.graphCenterX, z.distBY + 120);
  pop();

  pop();
}

function drawAxesLablesHeight() {
  push();

  let intervalV = 0;
  let intervalH = 0;

  // Vertical
  // Big ticks
  stroke('black');
  strokeWeight(2);
  for (let i = z.heightBY - (z.heightBY - z.heightTY) / 5; i > z.heightTY; i -= (z.heightBY - z.heightTY) / 5) {
    line(z.distLX, i, z.distLX + 5, i);
    line(z.distRX, i, z.distRX - 5, i);
  }

  // Values
  textAlign(CENTER);
  noStroke();
  fill("Black");
  textSize(24);
  for (let i = z.heightBY; i + 1 > z.heightTY; i -= (z.heightBY - z.heightTY) / 5) {
    let intervalVRound = intervalV.toFixed(1);
    text(intervalVRound, z.distLX - 24, i + 8);
    intervalV += 0.2;
  }

  // Little ticks
  stroke('black');
  strokeWeight(1);
  for (let i = z.heightBY - (z.heightBY - z.heightTY) / 10; i > z.heightTY; i -= (z.heightBY - z.heightTY) / 10) {
    line(z.distLX, i, z.distLX + 5, i);
    line(z.distRX, i, z.distRX - 5, i);
  }

  // Horizontal
  // Big Ticks
  stroke('black');
  strokeWeight(2);
  for (let i = z.distLX + (z.distRX - z.distLX) / 5; i < z.distRX; i += (z.distRX - z.distLX) / 5) {
    line(i, z.heightBY, i, z.heightBY - 5);
    line(i, z.heightTY, i, z.heightTY + 5);
  }

  // Values
  textAlign(CENTER);
  noStroke();
  fill("Black");
  textSize(24);
  for (let i = z.distLX; i - 1 < z.distRX; i += (z.distRX - z.distLX) / 5) {
    let intervalHRound = intervalH.toFixed(1);
    text(intervalHRound, i, z.heightBY + 30);
    intervalH += 0.2;
  }

  // Little ticks
  stroke('black');
  strokeWeight(1);
  for (let i = z.distLX + (z.distRX - z.distLX) / 10; i < z.distRX; i += (z.distRX - z.distLX) / 10) {
    line(i, z.heightBY, i, z.heightBY - 5);
    line(i, z.heightTY, i, z.heightTY + 5);
  }

  push();
  textAlign(CENTER);
  stroke('Black');
  strokeWeight(0.2);
  fill("Black");
  textSize(28);
  translate(z.graphCenterX - z.graphCenterX * 49 / 64, z.graphCenterY);
  rotate(HALF_PI * 3);
  text('fluid velocity', 0, 0);
  pop();

  push();
  textAlign(CENTER);
  stroke('Black');
  strokeWeight(0.2);
  fill("Black");
  textSize(28);
  text('fraction of fluid height', z.graphCenterX, z.heightBY + 70);
  pop();

  pop();
}

function drawGraphHeight() {
  push();

  push();
  rectMode(CENTER);
  stroke('black');
  strokeWeight(7);
  rect(z.graphCenterX, z.graphCenterY, 854, 580);
  pop();

  fill(205, 115, 215); // purple
  noStroke();
  quad((z.distRX - z.distLX) * (z.hBot + z.hMid) + z.distLX, z.heightY23, z.distRX, z.heightTY, z.distRX, z.heightBY, (z.distRX - z.distLX) * (z.hBot + z.hMid) + z.distLX, z.heightBY);

  fill(30, 255, 55); // green
  noStroke();
  quad((z.distRX - z.distLX) * z.hBot + z.distLX, z.heightY12, (z.distRX - z.distLX) * (z.hBot + z.hMid) + z.distLX, z.heightY23, (z.distRX - z.distLX) * (z.hBot + z.hMid) + z.distLX, z.heightBY, (z.distRX - z.distLX) * z.hBot + z.distLX, z.heightBY);

  fill(40, 95, 220); // blue 
  noStroke();
  quad(z.distLX, z.heightBY, (z.distRX - z.distLX) * z.hBot + z.distLX, z.heightY12, (z.distRX - z.distLX) * z.hBot + z.distLX, z.heightBY, z.distLX, z.heightBY);

  fill('white'); // white right
  noStroke();
  quad((z.distRX - z.distLX) * (z.hBot + z.hMid) + z.distLX, z.heightY23, z.distRX, z.heightTY, z.distRX, z.heightTY, (z.distRX - z.distLX) * (z.hBot + z.hMid) + z.distLX - 5, z.heightTY);

  fill('white'); // white mid
  noStroke();
  quad((z.distRX - z.distLX) * z.hBot + z.distLX, z.heightY12, (z.distRX - z.distLX) * (z.hBot + z.hMid) + z.distLX, z.heightY23, (z.distRX - z.distLX) * (z.hBot + z.hMid) + z.distLX, z.heightTY, (z.distRX - z.distLX) * z.hBot + z.distLX - 5, z.heightTY);

  fill('white'); // white left
  noStroke();
  quad(z.distLX, z.heightBY, (z.distRX - z.distLX) * z.hBot + z.distLX, z.heightY12, (z.distRX - z.distLX) * z.hBot + z.distLX, z.heightTY, z.distLX, z.heightTY);

  /*
    rectMode(CENTER);
    fill(205, 115, 215); // purple
    noStroke();
    rect(z.centerXTop, z.graphCenterY, (z.distRX - z.distLX) * z.hTop, z.heightBY - z.heightTY);

    rectMode(CENTER);
    fill(30, 255, 55); // green
    noStroke();
    rect(z.centerXMid, z.graphCenterY, (z.distRX - z.distLX) * z.hMid, z.heightBY - z.heightTY);

    rectMode(CENTER);
    fill(40, 95, 220); // blue 
    noStroke();
    rect(z.centerXBot, z.graphCenterY, (z.distRX - z.distLX) * z.hBot, z.heightBY - z.heightTY);
  */

  stroke('black');
  strokeWeight(3);
  line(z.distLX, z.heightBY, (z.distRX - z.distLX) * z.hBot + z.distLX, z.heightY12);
  line((z.distRX - z.distLX) * z.hBot + z.distLX, z.heightY12, (z.distRX - z.distLX) * (z.hBot + z.hMid) + z.distLX, z.heightY23);
  line((z.distRX - z.distLX) * (z.hBot + z.hMid) + z.distLX, z.heightY23, z.distRX, z.heightTY);

  pop();
}

function drawMouseDist() {
  textAlign(CENTER);
  textSize(16);

  z.circleX = (mouseX) / relativeSize();
  z.circleY = (mouseY) / relativeSize();

  z.mouseXPtCalibrated = (mouseX) / relativeSize();
  z.mouseYPtCalibrated = (mouseY) / relativeSize();

  // line(z.mouseXPtCalibrated - 75, z.mouseYPtCalibrated - 15, z.mouseXPtCalibrated + 75, z.mouseYPtCalibrated - 15);
  // text(`x: ${Math.abs(((z.mouseXPtCalibrated-z.distLX)/854).toFixed(3))} y: ${Math.abs(((z.mouseYPtCalibrated-z.distBY)/-480).toFixed(3))}`, z.mouseXPtCalibrated, z.mouseYPtCalibrated - 25);

  // line(z.mouseXPtCalibrated - 75, z.mouseYPtCalibrated - 15, z.mouseXPtCalibrated + 75, z.mouseYPtCalibrated - 15);

  if (Math.abs(z.circleX - z.distLX) < 7.5 && Math.abs(z.circleY - z.distBY) < 7.5) {
    fill(100, 100, 100);
    strokeWeight(2);
    stroke('black');
    ellipse(z.distLX, z.distBY, 15, 15);
    fill('white');
    textSize(22);
    stroke('black');
    strokeWeight(3.5);
    text(`x: ${Math.abs((0).toFixed(3))} y: ${Math.abs((0).toFixed(3))}`, z.distLX, z.distBY + 35);
  }

  if (Math.abs(z.circleX - z.distRX) < 7.5 && Math.abs(z.circleY - z.distTY) < 7.5) {
    fill(100, 100, 100);
    strokeWeight(2);
    stroke('black');
    ellipse(z.distRX, z.distTY, 15, 15);
    fill('white');
    textSize(22);
    stroke('black');
    strokeWeight(3.5);
    text(`x: ${Math.abs((1).toFixed(3))} y: ${Math.abs((1).toFixed(3))}`, z.distRX, z.distTY + 35);
  }

  if (Math.abs(z.circleX - z.distLineX12) < 7.5 && Math.abs(z.circleY - (((z.distBY - z.distTY)) * (1 - z.hBot) + z.distTY)) < 7.5) {
    fill(100, 100, 100);
    strokeWeight(2);
    stroke('black');
    ellipse(z.distLineX12, (((z.distBY - z.distTY)) * (1 - z.hBot) + z.distTY), 15, 15);
    fill('white');
    textSize(22);
    stroke('black');
    strokeWeight(3.5);
    text(`x: ${Math.abs(((z.distLineX12-z.distLX)/(z.distRX-z.distLX)).toFixed(3))} y: ${Math.abs((((((z.distBY-z.distTY))*(1-z.hBot) + z.distTY)-z.distBY)/(z.distTY-z.distBY)).toFixed(3))}0`, z.distLineX12, (((z.distBY - z.distTY)) * (1 - z.hBot) + z.distTY) + 35);
  }

  if (Math.abs(z.circleX - z.distLineX23) < 7.5 && Math.abs(z.circleY - (((z.distBY - z.distTY)) * (1 - (z.hBot + z.hMid)) + z.distTY)) < 7.5) {
    fill(100, 100, 100);
    strokeWeight(2);
    stroke('black');
    ellipse(z.distLineX23, (((z.distBY - z.distTY)) * (1 - (z.hBot + z.hMid)) + z.distTY), 15, 15);
    fill('white');
    textSize(22);
    stroke('black');
    strokeWeight(3.5);
    text(`x: ${Math.abs(((z.distLineX23-z.distLX)/(z.distRX-z.distLX)).toFixed(3))} y: ${Math.abs((((((z.distBY-z.distTY))*(1-(z.hBot+z.hMid)) + z.distTY)-z.distBY)/(z.distTY-z.distBY)).toFixed(3))}0`, z.distLineX23, (((z.distBY - z.distTY)) * (1 - (z.hBot + z.hMid)) + z.distTY) + 35);
  }

  // These if statements define what the mouse does and where to place the gray circle on the graph
  if (z.mouseYPtCalibrated > z.distTY && z.mouseXPtCalibrated > z.distLX && z.distRX > z.mouseXPtCalibrated && z.mouseYPtCalibrated < z.distBY) {
    // cursor('grab');

    // if statements for points on the middle section of the plot
    if (z.circleX > z.distLineX12 && z.circleX < z.distLineX23 && Math.abs(z.circleY - z.plotCircleY2) < 20) {
      fill(100, 100, 100);
      strokeWeight(2);
      stroke('black');
      ellipse(z.circleX, z.plotCircleY2, 15, 15);
      fill('white');
      textSize(22);
      stroke('black');
      strokeWeight(3.5);
      text(`x: ${Math.abs(((z.mouseXPtCalibrated-z.distLX)/(z.distRX-z.distLX)).toFixed(3))} y: ${Math.abs(((z.plotCircleY2-z.distBY)/(z.distTY-z.distBY)).toFixed(3))}`, z.mouseXPtCalibrated, z.plotCircleY2 - 25);
    }
    // if for top section
    if (z.circleX > z.distLineX23 && z.circleX < z.distRX && Math.abs(z.circleY - z.plotCircleY3) < 20) {
      fill(100, 100, 100);
      strokeWeight(2);
      stroke('black');
      ellipse(z.circleX, z.plotCircleY3, 15, 15);
      fill('white');
      textSize(22);
      stroke('black');
      strokeWeight(3.5);
      text(`x: ${Math.abs(((z.mouseXPtCalibrated-z.distLX)/(z.distRX-z.distLX)).toFixed(3))} y: ${Math.abs(((z.plotCircleY3-z.distBY)/(z.distTY-z.distBY)).toFixed(3))}`, z.mouseXPtCalibrated, z.plotCircleY3 - 25);
    }

    // if for bottom section
    if (z.circleX > z.distLX && z.circleX < z.distLineX12 && Math.abs(z.circleY - z.plotCircleY1) < 20) {
      fill(100, 100, 100);
      strokeWeight(2);
      stroke('black');
      ellipse(z.circleX, z.plotCircleY1, 15, 15);
      fill('white');
      textSize(22);
      stroke('black');
      strokeWeight(3.5);
      text(`x: ${Math.abs(((z.mouseXPtCalibrated-z.distLX)/(z.distRX-z.distLX)).toFixed(3))} y: ${Math.abs(((z.plotCircleY1-z.distBY)/(z.distTY-z.distBY)).toFixed(3))}`, z.mouseXPtCalibrated, z.plotCircleY1 - 25);
    }
  } else if (z.mouseYPtCalibrated < z.distTY || z.mouseXPtCalibrated < z.distLX || z.distRX < z.mouseXPtCalibrated || z.mouseYPtCalibrated > z.distBY) {
    cursor(ARROW);
  }
}

function drawMouseHeight() {
  textAlign(CENTER);
  textSize(16);

  z.circleX = (mouseX) / relativeSize();
  z.circleY = (mouseY) / relativeSize();

  z.mouseXPtCalibrated = (mouseX) / relativeSize();
  z.mouseYPtCalibrated = (mouseY) / relativeSize();

  // line(z.mouseXPtCalibrated - 75, z.mouseYPtCalibrated - 15, z.mouseXPtCalibrated + 75, z.mouseYPtCalibrated - 15);
  // text(`x: ${Math.abs(((z.mouseXPtCalibrated-z.distLX)/854).toFixed(3))} y: ${Math.abs(((z.mouseYPtCalibrated-z.distBY)/-480).toFixed(3))}`, z.mouseXPtCalibrated, z.mouseYPtCalibrated - 25);

  // line(z.mouseXPtCalibrated - 75, z.mouseYPtCalibrated - 15, z.mouseXPtCalibrated + 75, z.mouseYPtCalibrated - 15);

  if (Math.abs(z.circleX - z.distLX) < 7.5 && Math.abs(z.circleY - z.heightBY) < 7.5) {
    fill(100, 100, 100);
    strokeWeight(2);
    stroke('black');
    ellipse(z.distLX, z.heightBY, 15, 15);
    fill('white');
    textSize(22);
    stroke('black');
    strokeWeight(3.5);
    text(`x: ${Math.abs((0).toFixed(3))} y: ${Math.abs((0).toFixed(3))}`, z.distLX, z.heightBY + 35);
  }

  if (Math.abs(z.circleX - z.distRX) < 7.5 && Math.abs(z.circleY - z.heightTY) < 7.5) {
    fill(100, 100, 100);
    strokeWeight(2);
    stroke('black');
    ellipse(z.distRX, z.heightTY, 15, 15);
    fill('white');
    textSize(22);
    stroke('black');
    strokeWeight(3.5);
    text(`x: ${Math.abs((1).toFixed(3))} y: ${Math.abs((1).toFixed(3))}`, z.distRX, z.heightTY + 35);
  }

  if (Math.abs(z.circleX - ((z.distRX - z.distLX) * (z.hBot) + z.distLX)) < 7.5 && Math.abs(z.circleY - z.heightY12) < 7.5) {
    fill(100, 100, 100);
    strokeWeight(2);
    stroke('black');
    ellipse(((z.distRX - z.distLX) * (z.hBot) + z.distLX), z.heightY12, 15, 15);
    fill('white');
    textSize(22);
    stroke('black');
    strokeWeight(3.5);
    text(`x: ${Math.abs(((((z.distRX-z.distLX)*(z.hBot) + z.distLX)-z.distLX)/(z.distRX-z.distLX)).toFixed(3))}0 y: ${Math.abs(((z.heightY12-z.distBY)/(z.distTY-z.distBY)).toFixed(3))}`, ((z.distRX - z.distLX) * (z.hBot) + z.distLX), z.heightY12 + 35);
  }

  if (Math.abs(z.circleX - ((z.distRX - z.distLX) * (z.hBot + z.hMid) + z.distLX)) < 7.5 && Math.abs(z.circleY - z.heightY23) < 7.5) {
    fill(100, 100, 100);
    strokeWeight(2);
    stroke('black');
    ellipse(((z.distRX - z.distLX) * (z.hBot + z.hMid) + z.distLX), z.heightY23, 15, 15);
    fill('white');
    textSize(22);
    stroke('black');
    strokeWeight(3.5);
    text(`x: ${Math.abs(((((z.distRX-z.distLX)*(z.hBot+z.hMid) + z.distLX)-z.distLX)/(z.distRX-z.distLX)).toFixed(3))}0 y: ${Math.abs(((z.heightY23-z.distBY)/(z.distTY-z.distBY)).toFixed(3))}`, ((z.distRX - z.distLX) * (z.hBot + z.hMid) + z.distLX), z.heightY23 + 35);
  }

  // These if statements define what the mouse does and where to place the gray circle on the graph
  if (z.mouseYPtCalibrated > z.heightTY && z.mouseXPtCalibrated > z.distLX && z.distRX > z.mouseXPtCalibrated && z.mouseYPtCalibrated < z.heightBY) {
    // if statements for points on the middle section of the plot
    if (z.circleX > ((z.distRX - z.distLX) * z.hBot + z.distLX) && z.circleX < ((z.distRX - z.distLX) * (z.hBot + z.hMid) + z.distLX) && Math.abs(z.circleY - z.plotCircleY5) < 20) {
      fill(100, 100, 100);
      strokeWeight(2);
      stroke('black');
      ellipse(z.circleX, z.plotCircleY5, 15, 15);
      fill('white');
      textSize(22);
      stroke('black');
      strokeWeight(3.5);
      text(`x: ${Math.abs(((z.mouseXPtCalibrated-z.distLX)/(z.distRX-z.distLX)).toFixed(3))} y: ${Math.abs(((z.plotCircleY5-z.heightBY)/(z.heightTY-z.heightBY)).toFixed(3))}`, z.mouseXPtCalibrated, z.plotCircleY5 - 25);
    }

    // if for right section
    if (z.circleX > ((z.distRX - z.distLX) * (z.hBot + z.hMid) + z.distLX) && z.circleX < z.distRX && Math.abs(z.circleY - z.plotCircleY6) < 20) {
      fill(100, 100, 100);
      strokeWeight(2);
      stroke('black');
      ellipse(z.circleX, z.plotCircleY6, 15, 15);
      fill('white');
      textSize(22);
      stroke('black');
      strokeWeight(3.5);
      text(`x: ${Math.abs(((z.mouseXPtCalibrated-z.distLX)/(z.distRX-z.distLX)).toFixed(3))} y: ${Math.abs(((z.plotCircleY6-z.heightBY)/(z.heightTY-z.heightBY)).toFixed(3))}`, z.mouseXPtCalibrated, z.plotCircleY6 - 25);
    }

    // if for left section
    if (z.circleX > z.distLX && z.circleX < ((z.distRX - z.distLX) * z.hBot + z.distLX) && Math.abs(z.circleY - z.plotCircleY4) < 20) {
      fill(100, 100, 100);
      strokeWeight(2);
      stroke('black');
      ellipse(z.circleX, z.plotCircleY4, 15, 15);
      fill('white');
      textSize(22);
      stroke('black');
      strokeWeight(3.5);
      text(`x: ${Math.abs(((z.mouseXPtCalibrated-z.distLX)/(z.distRX-z.distLX)).toFixed(3))} y: ${Math.abs(((z.plotCircleY4-z.heightBY)/(z.heightTY-z.heightBY)).toFixed(3))}`, z.mouseXPtCalibrated, z.plotCircleY4 - 25);
    }
  } else if (z.mouseYPtCalibrated < z.distTY || z.mouseXPtCalibrated < z.distLX || z.distRX < z.mouseXPtCalibrated || z.mouseYPtCalibrated > z.distBY) {
    cursor(ARROW);
  }
}