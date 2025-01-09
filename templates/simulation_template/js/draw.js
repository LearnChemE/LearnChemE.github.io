import { calcAll } from './calcs.js';

window.setup = function() {
  createCanvas(800, 600);
  background(255);
}

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

  noStroke();
  fill("red");

  for (let i = 0; i < g.particles; i++) {
    ellipse(50 + 5 * i, height / 2, 3, 3);
  }

  pop();
}