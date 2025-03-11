import { calcAll } from './calcs.js';
const selectionElement = document.getElementById('selection');
const p5container = document.getElementById('p5-container');



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
  frameRate(500);
}

// Same with draw() - this should never be inside a conditional statement.
// Put the conditional statements inside the draw function.
window.draw = function() {
  // The "window" keyword is used to set global variables. So you can use
  // "selection" in any file, function, block, etc.
  window.selection = selectionElement.value;



  resize();

  background(255);
  calcAll();

  


  if (selection === "velocity-distribution") {
    drawGraphDist();
    drawAxesLablesDist();
    drawMousePos1();

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
  rect(z.graphCenterX, z.graphCenterY, 854, 480);

  rectMode(CENTER);
  fill(205, 115, 215);
  noStroke();
  rect(z.graphCenterX, z.centerYTop, 854, (z.distBY - z.distTY) * z.hTop); //purple

  rectMode(CENTER);
  fill(30, 255, 55);
  noStroke();
  rect(z.graphCenterX, z.centerYMid, 854, (z.distBY - z.distTY) * z.hMid); //green

  rectMode(CENTER);
  fill(40, 95, 220);
  noStroke();
  rect(z.graphCenterX, z.centerYBot, 854, (z.distBY - z.distTY) * z.hBot); //blue

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

  let intervalV = 0;
  let intervalH = 0;
  //vertical
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
  for (let j = z.distBY; j + 1 > z.distTY; j -= (z.distBY - z.distTY) / 10) {
    stroke('black');
    strokeWeight(1);
    line(z.distLX, j, z.distLX + 5, j);
  }

  /*
  for (let jj = z.distBY; jj + 1 > z.distTY; jj -= (z.distBY - z.distTY) / 9) {
    
    stroke('black');
    strokeWeight(5);
    line(z.distLX, jj, z.distRX, jj);
    triangle(z.distRX - 20, jj+7, z.distRX - 20 , jj-7, z.distRX, jj);
  }
  */
 
  push();
  textAlign(CENTER);
  stroke('Black');
  strokeWeight(0.2);
  fill("Black");
  textSize(28);
  translate(z.graphCenterX - z.graphCenterX * 49 / 64, z.graphCenterY);
  rotate(HALF_PI * 3);
  text('Fraction of Fluid Height', 0, 0);
  pop();


  //Horizontal
  for (let k = z.distLX; k - 1 < z.distRX; k += (z.distRX - z.distLX) / 5) {
    textAlign(CENTER);
    noStroke();
    fill("Black");
    textSize(24);
    let intervalHRound = intervalH.toFixed(1);
    text(intervalHRound, k, z.distBY + 80);
    intervalH += 0.2;
  }

  textAlign(CENTER);
  noStroke();
  fill("White");
  textSize(32);
  text(`Moving Plate Velocity vs Height`, z.graphCenterX, (z.graphCenterY - 240 - 13));
  text(`Stationary Plate`, z.graphCenterX, (z.graphCenterY + 275));

  push();
  textAlign(CENTER);
  stroke('Black');
  strokeWeight(0.2);
  fill("Black");
  textSize(28);
  text('Fluid Velocity', z.graphCenterX, z.distBY + 120);
  pop();

  pop();
}

function drawAxesLablesHeight() {

  push();

  let intervalV = 0;
  let intervalH = 0;
  //Vertical
  //big ticks
  for (let i = z.heightBY - (z.heightBY - z.heightTY) / 5; i > z.heightTY; i -= (z.heightBY - z.heightTY) / 5) {
    stroke('black');
    strokeWeight(2);
    line(z.distLX, i, z.distLX + 5, i);
    line(z.distRX, i, z.distRX - 5, i);

  }
  //values
  for (let ii = z.heightBY; ii + 1 > z.heightTY; ii -= (z.heightBY - z.heightTY) / 5) {
    textAlign(CENTER);
    noStroke();
    fill("Black");
    textSize(24);

    let intervalVRound = intervalV.toFixed(1);
    text(intervalVRound, z.distLX - 24, ii + 8);
    intervalV += 0.2;
  }
  //little ticks
  for (let j = z.heightBY - (z.heightBY - z.heightTY) / 10; j > z.heightTY; j -= (z.heightBY - z.heightTY) / 10) {
    stroke('black');
    strokeWeight(1);
    line(z.distLX, j, z.distLX + 5, j);
    line(z.distRX, j, z.distRX - 5, j);
  }



  //Horizontal
  //Big Ticks
  for (let k = z.distLX + (z.distRX - z.distLX) / 5; k < z.distRX; k += (z.distRX - z.distLX) / 5) {

    stroke('black');
    strokeWeight(2);
    line(k, z.heightBY, k, z.heightBY - 5);
    line(k, z.heightTY, k, z.heightTY + 5);

  }
  //Values
  for (let k = z.distLX; k - 1 < z.distRX; k += (z.distRX - z.distLX) / 5) {

    textAlign(CENTER);
    noStroke();
    fill("Black");
    textSize(24);
    let intervalHRound = intervalH.toFixed(1);
    text(intervalHRound, k, z.heightBY + 30);
    intervalH += 0.2;
  }
  //Little ticks
  for (let k = z.distLX + (z.distRX - z.distLX) / 10; k < z.distRX; k += (z.distRX - z.distLX) / 10) {

    stroke('black');
    strokeWeight(1);
    line(k, z.heightBY, k, z.heightBY - 5);
    line(k, z.heightTY, k, z.heightTY + 5);
  }


  push();
  textAlign(CENTER);
  stroke('Black');
  strokeWeight(0.2);
  fill("Black");
  textSize(28);
  translate(z.graphCenterX - z.graphCenterX * 49 / 64, z.graphCenterY);
  rotate(HALF_PI * 3);
  text('Fluid Velocity', 0, 0);
  pop();

  push();
  textAlign(CENTER);
  stroke('Black');
  strokeWeight(0.2);
  fill("Black");
  textSize(28);
  text('Fraction of Fluid Height', z.graphCenterX, z.heightBY + 70);
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


  rectMode(CENTER);
  fill(205, 115, 215); //purple
  noStroke();
  rect(z.centerXTop, z.graphCenterY, (z.distRX - z.distLX) * z.hTop, z.heightBY - z.heightTY);

  rectMode(CENTER);
  fill(30, 255, 55); //green
  noStroke();
  rect(z.centerXMid, z.graphCenterY, (z.distRX - z.distLX) * z.hMid, z.heightBY - z.heightTY);

  rectMode(CENTER);
  fill(40, 95, 220); //blue 
  noStroke();
  rect(z.centerXBot, z.graphCenterY, (z.distRX - z.distLX) * z.hBot, z.heightBY - z.heightTY);



  pop();



}

function drawMousePos1() {

  textAlign(CENTER);
  textSize(16);

  z.circleX = (mouseX) / relativeSize();
  z.circleY = (mouseY) / relativeSize();

  z.mouseXPtCalibrated = (mouseX) / relativeSize();
  z.mouseYPtCalibrated = (mouseY) / relativeSize();

  

  //line(z.mouseXPtCalibrated - 75, z.mouseYPtCalibrated - 15, z.mouseXPtCalibrated + 75, z.mouseYPtCalibrated - 15);
  //text(`x: ${Math.abs(((z.mouseXPtCalibrated-z.distLX)/854).toFixed(3))} y: ${Math.abs(((z.mouseYPtCalibrated-z.distBY)/-480).toFixed(3))}`, z.mouseXPtCalibrated, z.mouseYPtCalibrated - 25);
  
  //line(z.mouseXPtCalibrated - 75, z.mouseYPtCalibrated - 15, z.mouseXPtCalibrated + 75, z.mouseYPtCalibrated - 15);
  
  
 
  
//these if statements define what the mouse does and where to place the gray circle on the graph
  if( z.mouseYPtCalibrated > z.distTY && z.mouseXPtCalibrated > z.distLX && z.distRX> z.mouseXPtCalibrated && z.mouseYPtCalibrated < z.distBY){
   
    //If statements for points on the middle section of the plot
    if(z.circleX>z.distLineX12 && z.circleX<z.distLineX23 && Math.abs(z.circleY-z.plotCircleY2) < 20){

      
      fill(100, 100, 100);
      strokeWeight(2);
      ellipse(z.circleX, z.plotCircleY2, 15, 15);
      fill('black');
      text(`x: ${Math.abs(((z.mouseXPtCalibrated-z.distLX)/854).toFixed(3))} y: ${Math.abs(((z.plotCircleY2-z.distBY)/-480).toFixed(3))}`, z.mouseXPtCalibrated, z.plotCircleY2 - 25);

    }
    //if for top section
    if(z.circleX>z.distLineX23 && z.circleX<z.distRX && Math.abs(z.circleY-z.plotCircleY3) < 20){

      
      fill(100, 100, 100);
      strokeWeight(2);
      ellipse(z.circleX, z.plotCircleY3, 15, 15);
      fill('black');
      text(`x: ${Math.abs(((z.mouseXPtCalibrated-z.distLX)/854).toFixed(3))} y: ${Math.abs(((z.plotCircleY3-z.distBY)/-480).toFixed(3))}`, z.mouseXPtCalibrated, z.plotCircleY3 - 25);

    }
    //if for bottom section
    if(z.circleX>z.distLX && z.circleX<z.distLineX12 && Math.abs(z.circleY-z.plotCircleY1) < 20){

      
      fill(100, 100, 100);
      strokeWeight(2);
      ellipse(z.circleX, z.plotCircleY1, 15, 15);
      fill('black');
      text(`x: ${Math.abs(((z.mouseXPtCalibrated-z.distLX)/854).toFixed(3))} y: ${Math.abs(((z.plotCircleY1-z.distBY)/-480).toFixed(3))}`, z.mouseXPtCalibrated, z.plotCircleY1 - 25);

    }
    
    
    

    
    
  }
  else if( z.mouseYPtCalibrated < z.distTY || z.mouseXPtCalibrated < z.distLX || z.distRX< z.mouseXPtCalibrated || z.mouseYPtCalibrated > z.distBY){

    cursor(ARROW);

  }

  
  


}

function mouseTele() {

  
 
}