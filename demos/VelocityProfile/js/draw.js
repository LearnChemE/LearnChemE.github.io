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
window.setup = function() {
  createCanvas(p5container.offsetWidth, p5container.offsetHeight).parent(p5container);
  frameRate(30);
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
    drawText();
  } else if (selection === "velocity-vs-height") {
    drawGraphHeight();
    drawText();
  }
}

// Look this function up in p5.js documentation. The width and height of
// the #p5-container element are set in the css file.
window.windowResized = () => {
  resizeCanvas(p5container.offsetWidth, p5container.offsetHeight);
}

// I had a while loop set here, I just had true inside of the loop parameters, I think this was the problem

function drawText() {
  push();

  textAlign(CENTER);
  noStroke();
  fill("White");
  textSize(32);

  const label = selection === "velocity-distribution" ? "Velocity Distribution" : "Velocity vs Height";

  text(`Moving Plate ${label}`, width / 2, (height / 2 - 240 - 13));
  text(`Stationary Plate`, width / 2, (height / 2 + 275));

  pop();
}

function drawGraphDist() {
  push();

  rectMode(CENTER);
  stroke('black');
  strokeWeight(5);
  rect(width / 2, height / 2, 854, 480);

  rectMode(CENTER);
  fill(205, 115, 215);
  noStroke();
  rect(width / 2, (height / 2 - 160), 854, 160 /*will change*/ );

  rectMode(CENTER);
  fill(30, 255, 55);
  noStroke();
  rect(width / 2, (height / 2), 854, 160 /*will change*/ );

  rectMode(CENTER);
  fill(40, 95, 220);
  noStroke();
  rect(width / 2, (height / 2 + 160), 854, 160 /*will change*/ );

  rectMode(CENTER);
  fill(100, 100, 100);
  stroke('black');
  strokeWeight(3.25);
  rect(width / 2, (height / 2 - 265), 856, 50);

  rectMode(CENTER);
  fill(100, 100, 100);
  stroke('black');
  strokeWeight(3.25);
  rect(width / 2, (height / 2 + 265), 856, 50);

  const graphLX = (width/2)-428;
  const graphBY = (height / 2) + 240;
  const graphRX = (width/2)+428;
  const graphTY = (height/2)-240;

  for(let i=graphBY;i+1>graphTY;i-=(graphBY-graphTY)/10)
    {
      stroke('black');
      strokeWeight(1.5);
      line(graphLX, i , graphLX+2.5, i);
    }
  for(let j=graphBY;j+1>graphTY;j-=(graphBY-graphTY)/20)
      {
        stroke('black');
        strokeWeight(0.75);
        line(graphLX, j , graphLX+5, j);
      }

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

function drawGraphHeight() {

  push();

  rectMode(CENTER);
  stroke('black');
  strokeWeight(5);
  rect(width / 2, height / 2, 854, 480);

  rectMode(CENTER);
  fill(205, 115, 215);
  noStroke();
  rect(width / 2, (height / 2 - 160), 854, 160 /*will change*/ );

  rectMode(CENTER);
  fill(30, 255, 55);
  noStroke();
  rect(width / 2, (height / 2), 854, 160 /*will change*/ );

  rectMode(CENTER);
  fill(40, 95, 220);
  noStroke();
  rect(width / 2, (height / 2 + 160), 854, 160 /*will change*/ );

  rectMode(CENTER);
  fill(100, 100, 100);
  stroke('black');
  strokeWeight(3.25);
  rect(width / 2, (height / 2 - 265), 856, 50);

  rectMode(CENTER);
  fill(100, 100, 100);
  stroke('black');
  strokeWeight(3.25);
  rect(width / 2, (height / 2 + 265), 856, 50);

  line(1, 1, 1, 1);

  pop();

}