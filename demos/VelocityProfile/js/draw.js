import { calcAll } from './calcs.js';
const selectionElement = document.getElementById('selection');
const p5container = document.getElementById('p5-container');



// This function is used to scale the canvas based on the size of the container
window.relativeSize = () => p5container.offsetWidth / 1280;

function resize() {
  // Here I am reassigning the width and height of the canvas to a static value of 1280x720,
  // even though the actual canvas size is based on the size of the #p5-container element.
  // So you can effectively treat the canvas like it is 1280x720, even though it will scale to fit the screen.
  width = 1280;
  height = 720;

  scale(relativeSize());
}

// Moved outside of the selection block - Do not call setup() more than once.
// So this should never be inside a conditional statement.
window.setup = function () {
  createCanvas(p5container.offsetWidth, p5container.offsetHeight).parent(p5container);
  frameRate(30);
}

// Same with draw() - this should never be inside a conditional statement.
// Put the conditional statements inside the draw function.
window.draw = function () {
  // The "window" keyword is used to set global variables. So you can use
  // "selection" in any file, function, block, etc.
  window.selection = selectionElement.value;
  
  window.graphCenterX = (width / 2);
  window.graphCenterY = (height / 2) - 32;
  resize();

  background(255);
  calcAll();



  if (selection === "velocity-distribution") {
    drawGraphDist();
    drawAxesLablesDist();
  } else if (selection === "velocity-vs-height") {
    drawGraphHeight();
    drawAxesLablesHeight();

  }
}

// Look this function up in p5.js documentation. The width and height of
// the #p5-container element are set in the css file.
window.windowResized = () => {
  resizeCanvas(p5container.offsetWidth, p5container.offsetHeight);
}

//const label = selection === "velocity-distribution" ? "Velocity Distribution" : "Velocity vs Height";


function drawGraphDist() {


  push();

  rectMode(CENTER);
  stroke('black');
  strokeWeight(5);
  rect(graphCenterX, graphCenterY, 854, 480);

  rectMode(CENTER);
  fill(205, 115, 215);
  noStroke();
  rect(graphCenterX, (graphCenterY - 160), 854, 160 /*will change*/);

  rectMode(CENTER);
  fill(30, 255, 55);
  noStroke();
  rect(graphCenterX, graphCenterY, 854, 160 /*will change*/);

  rectMode(CENTER);
  fill(40, 95, 220);
  noStroke();
  rect(graphCenterX, (graphCenterY + 160), 854, 160 /*will change*/);

  rectMode(CENTER);
  fill(100, 100, 100);
  stroke('black');
  strokeWeight(3.25);
  rect(graphCenterX, (graphCenterY - 265), 856, 50);

  rectMode(CENTER);
  fill(100, 100, 100);
  stroke('black');
  strokeWeight(3.25);
  rect(graphCenterX, (graphCenterY + 265), 856, 50);

  pop();


  /* //incase i need this
    
    noStroke();
    fill("blue");
   
    for (let i = 0; i < g.particles; i++) {
      const randX = (width / 2) + random(-200, 200);
      const randY = (height / 2) + random(-150, 150);
      ellipse(randX, randY, 5, 5);
    }
   
    pop();
    */
}

function drawAxesLablesDist() {

  push();
  const grayThickness = (graphCenterY - 265) - 50;
  const graphLX = (graphCenterX) - 428;
  const graphBY = (graphCenterY) + 240;
  const graphRX = (graphCenterX) + 428;
  const graphTY = (graphCenterY) - 240;
  let intervalV = 0;
  let intervalH = 0;
  //vertical
  for (let i = graphBY; i + 1 > graphTY; i -= (graphBY - graphTY) / 5) {
    stroke('black');
    strokeWeight(2);
    line(graphLX, i, graphLX + 5, i);


    textAlign(CENTER);
    noStroke();
    fill("Black");
    textSize(24);

    let intervalVRound = intervalV.toFixed(1);
    text(intervalVRound, graphLX - 24, i + 8);
    intervalV += 0.2;

  }
  for (let j = graphBY; j + 1 > graphTY; j -= (graphBY - graphTY) / 10) {
    stroke('black');
    strokeWeight(1);
    line(graphLX, j, graphLX + 5, j);
  }

  push();
  textAlign(CENTER);
  stroke('Black');
  strokeWeight(0.2);
  fill("Black");
  textSize(28);
  translate(graphCenterX - graphCenterX * 49 / 64, graphCenterY);
  rotate(HALF_PI * 3);
  text('Fraction of Fluid Height', 0, 0);
  pop();


  //Horizontal
  for (let k = graphLX; k - 1 < graphRX; k += (graphRX - graphLX) / 5) {
    textAlign(CENTER);
    noStroke();
    fill("Black");
    textSize(24);
    let intervalHRound = intervalH.toFixed(1);
    text(intervalHRound, k, graphBY + 80);
    intervalH += 0.2;
  }

  textAlign(CENTER);
  noStroke();
  fill("White");
  textSize(32);
  text(`Moving Plate Velocity vs Height`, graphCenterX, (graphCenterY - 240 - 13));
  text(`Stationary Plate`, graphCenterX, (graphCenterY + 275));

  push();
  textAlign(CENTER);
  stroke('Black');
  strokeWeight(0.2);
  fill("Black");
  textSize(28);
  text('Fluid Velocity', graphCenterX, graphBY + 120);
  pop();

  pop();
}

function drawAxesLablesHeight() {

  push();
  const grayThickness = (graphCenterY - 265) - 50;
  const graphLX = (graphCenterX) - 428;
  const graphBY = (graphCenterY) + 290;
  const graphRX = (graphCenterX) + 428;
  const graphTY = (graphCenterY) - 290;
  let intervalV = 0;
  let intervalH = 0;
  //Vertical
    //big ticks
  for (let i = graphBY - (graphBY - graphTY) / 5; i > graphTY; i -= (graphBY - graphTY) / 5) {
    stroke('black');
    strokeWeight(2);
    line(graphLX, i, graphLX + 5, i);
    line(graphRX, i, graphRX - 5, i);

  }
    //values
  for (let ii = graphBY; ii + 1 > graphTY; ii -= (graphBY - graphTY) / 5) {
    textAlign(CENTER);
    noStroke();
    fill("Black");
    textSize(24);

    let intervalVRound = intervalV.toFixed(1);
    text(intervalVRound, graphLX - 24, ii + 8);
    intervalV += 0.2;
  }
    //little ticks
  for (let j = graphBY - (graphBY - graphTY) / 10; j > graphTY; j -= (graphBY - graphTY) / 10) {
    stroke('black');
    strokeWeight(1);
    line(graphLX, j, graphLX + 5, j);
    line(graphRX, j, graphRX - 5, j);
  }



  //Horizontal
    //Big Ticks
  for (let k = graphLX+ (graphRX - graphLX)/5; k < graphRX; k += (graphRX - graphLX)/5) {

    stroke('black');
    strokeWeight(2);
    line(k, graphBY, k, graphBY - 5);
    line(k, graphTY, k, graphTY + 5);

  }
    //Values
  for (let k = graphLX; k - 1 < graphRX; k += (graphRX - graphLX)/5) {

    textAlign(CENTER);
    noStroke();
    fill("Black");
    textSize(24);
    let intervalHRound = intervalH.toFixed(1);
    text(intervalHRound, k, graphBY + 30);
    intervalH += 0.2;
  }
    //Little ticks
  for (let k = graphLX+(graphRX - graphLX)/10; k < graphRX; k += (graphRX - graphLX)/10) {

    stroke('black');
    strokeWeight(1);
    line(k, graphBY, k, graphBY - 5);
    line(k, graphTY, k, graphTY + 5);
  }


  push();
  textAlign(CENTER);
  stroke('Black');
  strokeWeight(0.2);
  fill("Black");
  textSize(28);
  translate(graphCenterX - graphCenterX * 49 / 64, graphCenterY);
  rotate(HALF_PI * 3);
  text('Fluid Velocity', 0, 0);
  pop();

  push();
  textAlign(CENTER);
  stroke('Black');
  strokeWeight(0.2);
  fill("Black");
  textSize(28);
  text('Fraction of Fluid Height', graphCenterX, graphBY + 70);
  pop();

  pop();

}

function drawGraphHeight() {


  push();

  
  rectMode(CENTER);
  stroke('black');
  strokeWeight(2);
  rect(graphCenterX, graphCenterY, 854, 580);
  

  rectMode(CENTER);
  fill(205, 115, 215); //purple
  noStroke();
  rect(graphCenterX, (graphCenterY - 160), 852, 160 /*will change*/);

  rectMode(CENTER);
  fill(30, 255, 55); //green
  noStroke();
  rect(graphCenterX, graphCenterY, 852, 160 /*will change*/);

  rectMode(CENTER);
  fill(40, 95, 220); //blue 
  noStroke();
  rect(graphCenterX, (graphCenterY + 160), 852, 160 /*will change*/);

  pop();

  
  
}