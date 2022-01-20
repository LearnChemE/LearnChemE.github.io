const tank_location = [gvs.p.width / 3, 2 * gvs.p.height / 3];
const tank_width = 200;
const tank_height = 250;
const deep_sky_blue = gvs.p.color(0, 191, 255, 100);

function drawTank(p) {
  p.push();
    p.translate(tank_location[0], tank_location[1] + tank_height / 2);

    // Draw the liquid in the tank
    const liquid_level = ( gvs.V / gvs.Vmax ) * tank_height;
    const number_of_waves = 6;
    const speed = 0.03;
    const wave_height = 3;
    p.noStroke();
    p.fill(deep_sky_blue);
    p.beginShape();
      for(let i = 0; i < 51; i++) {
        const fraction = i / 50;
        const x_px = -tank_width / 2 + fraction * tank_width;
        const y_px = Math.sin(5 * number_of_waves * fraction + speed * p.frameCount) * wave_height - liquid_level;
        p.vertex(x_px, y_px)
      }
      p.vertex(tank_width / 2, 0);
      p.vertex(-tank_width / 2, 0);
    p.endShape();
 
    // Draw the outline on top of the liquid in the tank
    p.stroke(100);
    p.strokeWeight(1);
    p.noFill();
    p.beginShape();
    for(let i = 0; i < 51; i++) {
      const fraction = i / 50;
      const x_px = -tank_width / 2 + fraction * tank_width;
      const y_px = Math.sin(5 * number_of_waves * fraction + speed * p.frameCount) * wave_height - liquid_level;
      p.vertex(x_px, y_px)
    }
    p.endShape();

    // Draw the tank itself
    p.translate(0, -tank_height / 2);
    p.stroke(0);
    p.strokeWeight(2);
    p.fill(0);
    p.line(-tank_width / 2, -tank_height / 2, -tank_width / 2, tank_height / 2);
    p.line(tank_width / 2, tank_height / 2, tank_width / 2, tank_height / 2 - 10);
    p.line(tank_width / 2, tank_height / 2 - 25, tank_width / 2, -tank_height / 2);
    p.fill(deep_sky_blue);
    p.noStroke();
    p.rectMode(p.CORNER);
    if(gvs.is_running) {
      p.rect(tank_width / 2, tank_height / 2 - 10, Math.min(30, (p.frameCount - gvs.start_frame) * 4), -15);
    } else {
      p.strokeWeight(4);
      p.stroke(0);
      p.line(tank_width / 2 + 1, 100, tank_width / 2 + 1, 115);
    }
    p.stroke(0);
    p.strokeWeight(2);
    p.line(tank_width / 2, tank_height / 2 - 25, tank_width / 2 + 30, tank_height / 2 - 25);
    p.line(tank_width / 2, tank_height / 2 - 10, tank_width / 2 + 30, tank_height / 2 - 10);
    p.line(-tank_width / 2, tank_height / 2, tank_width / 2, tank_height / 2);

  p.pop();
}

function drawImpeller(p) {
  p.push();
  p.translate(tank_location[0], tank_location[1]);
  p.stroke(180);
  p.strokeWeight(5);
  p.line(0, -130, 0, 70);
  const speed = 1.5; // how fast the impeller is spinning
  const inc = ( Math.abs( (50 / speed) - p.frameCount % (100 / speed)) ) / (50 / speed);
  p.line(-15 * inc, 70, 15 * inc, 70);
  p.strokeWeight(1);
  p.rectMode(p.CORNER);
  p.rect(-15 * inc, 80, -40 * inc, -20);
  p.rect(15 * inc, 80, 40 * inc, -20);
  p.stroke(0);
  p.fill(220);
  p.rect(-15, -130, 30, -50);
  p.pop();
}

function drawArrows(p) {
  p.push();
  p.translate(tank_location[0], tank_location[1]);
  p.translate(-tank_width / 2, -tank_height / 2);
  p.stroke(0);
  p.strokeWeight(2);
  if(!gvs.is_running) { // Only show the upper arrow if the simulation isn't running
    p.line(50, -48, 50, 0);
    p.fill(0);
    p.triangle(50, 0, 55, -12, 45, -12);
  }
  p.translate(tank_width, tank_height);
  p.line(25, -17.5, 80, -17.5);
  p.fill(0);
  p.triangle(80, -17.5, 68, -12.5, 68, -22.5);

  p.pop();
}

function drawPipe(p) {
  p.push();
  p.noStroke();
  p.fill(220);
  p.translate(tank_location[0], tank_location[1]);
  p.translate(-tank_width / 2, -tank_height / 2);
  p.rectMode(p.CORNER);
  p.rect(-200, -100, 257.5, 15);
  p.rect(42.5, -100, 15, 48);
  p.strokeWeight(1);
  p.stroke(0);
  p.line(-200, -100, 57.5, -100);
  p.line(57.5, -100, 57.5, -52);
  p.line(-200, -85, 42.5, -85);
  p.line(42.5, -85, 42.5, -52);
  p.fill(150);
  p.ellipse(50, -52, 15, 2);

  // Draw the liquid coming out of the pipe
  if(gvs.is_running) {
    p.fill(deep_sky_blue);
    p.noStroke();
    p.rect(42.5, -51, 15, Math.min(55 + (tank_height - ( gvs.V / gvs.Vmax ) * tank_height), (p.frameCount - gvs.start_frame) * 4) );
  }
  p.pop();
}

function drawText(p) {
  p.push();
  p.translate(tank_location[0], tank_location[1]);
  p.translate(-tank_width / 2, -tank_height / 2);
  p.translate(-100, -150);
  p.textSize(18);
  p.fill(0);
  p.noStroke(0);
  p.textAlign(p.LEFT);
  // Label for inlet pipe
  p.text(`𝜈  = ${(gvs.v0).toFixed(1)} L/s`, 1, 0);
  p.text(`C   = ${(gvs.CA0).toFixed(1)} mol/L`, -1, 30);
  p.textSize(10);
  p.text("0", 11, 4);
  p.text("A,0", 12, 35);

  // Label for tank
  p.translate(0, tank_height);
  p.textSize(18);
  p.text(`V = ${(gvs.V).toFixed(0)} L`, -40, 80);
  p.text(`C  = ${(gvs.CA).toFixed(2)} mol/L`, -41, 110);
  p.textSize(10);
  p.text("A", -28, 115);
  p.stroke(0);
  p.strokeWeight(1);
  p.line(88, 95, 120, 95);
  p.triangle(120, 95, 111, 98, 111, 92);
  p.noFill();
  p.rect(-50, 55, 138, 70);

  // Label for outlet
  p.translate(100, 150);
  p.translate(tank_width, 0);
  p.textSize(18);
  p.fill(0);
  p.noStroke();
  p.text(`𝜈    = ${gvs.v.toFixed(1)} L/s`, 50, 15);
  p.textSize(10);
  p.text("out", 59, 18);

  p.pop();

  p.push();
  // Reaction information label
  p.textSize(18);
  p.text(`Reaction:  A ⟶ B`, 280, 55);
  p.text(`Reaction rate:  r  = -kC`, 241, 85);
  p.textSize(10);
  p.text("A", 370.5, 90);
  p.text("A", 422.5, 90);
  p.pop();
}

function drawAll(p) {
  drawImpeller(p);
  drawTank(p);
  drawArrows(p);
  drawPipe(p);
  drawText(p);
}

module.exports = drawAll;