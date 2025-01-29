import { calcAll } from './calcs.js';

/* 
  This file is responsible for drawing the simulation.
  Pretty much all of the functions in this file are part
  of the p5.js library. Documentation is available at p5js.org.
*/

// The setup function is called when the page loads.

/* I dont think this if statement thing works
if (getSelection(g.selection) == 'Velocity Distribution') {*/
window.setup = function () {
  createCanvas(1280, 720);
  background(255);
  frameRate(30);
  
}
//}
/*
  The draw function will be called at 30 frames per second,
  unless we call the noLoop() function, in which case it will pause
  until we call loop().
*/
// I had a while loop set here, I just had true inside of the loop parameters, I think this was the problem
  window.draw = function () {
    background(255);
    calcAll();
    drawGraphDist();
    drawText();
  }

  function drawText() {
    push();

    textAlign(CENTER);
    noStroke();
    fill("White");
    textSize(32);

    text(`Moving Plate`, width / 2, (height / 2 - 240 - 13));
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
    rect(width / 2, (height / 2 - 160), 854, 160 /*will change*/);

    rectMode(CENTER);
    fill(30, 255, 55);
    noStroke();
    rect(width / 2, (height / 2), 854, 160 /*will change*/);

    rectMode(CENTER);
    fill(40, 95, 220);
    noStroke();
    rect(width / 2, (height / 2 + 160), 854, 160 /*will change*/);

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



