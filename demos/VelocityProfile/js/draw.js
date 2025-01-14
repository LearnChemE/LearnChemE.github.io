import { calcAll } from './calcs.js';

/* 
  This file is responsible for drawing the simulation.
  Pretty much all of the functions in this file are part
  of the p5.js library. Documentation is available at p5js.org.
*/

// The setup function is called when the page loads.
window.setup = function() {
  createCanvas(800, 600);
  background(255);
  frameRate(30);
  if (!g.playing) {
    noLoop();
  }
}

/*
  The draw function will be called at 30 frames per second,
  unless we call the noLoop() function, in which case it will pause
  until we call loop().
*/
window.draw = function() {
  background(255);
  calcAll();
  drawText();
  drawParticles();
}

function drawText() {
  push();

  textAlign(CENTER);
  noStroke();
  fill("black");
  textSize(32);

  text(`You have selected ${g.selection}`, width / 2, 100);

  pop();
}

function drawParticles() {
  push();

  rectMode(CENTER);
  fill(0, 0, 0, 10);
  stroke(0, 0, 0);
  strokeWeight(1);
  rect(width / 2, height / 2, 400, 300);

  noStroke();
  fill("red");

  for (let i = 0; i < g.particles; i++) {
    const randX = (width / 2) + random(-200, 200);
    const randY = (height / 2) + random(-150, 150);
    ellipse(randX, randY, 5, 5);
  }

  pop();
}