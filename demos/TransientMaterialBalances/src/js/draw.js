const tank_location = [gvs.p.width / 3, 2 * gvs.p.height / 3];
const tank_width = 200;
const tank_height = 250;
const deep_sky_blue = gvs.p.color(0, 191, 255);

function drawTank(p) {
  p.push();
    p.translate(tank_location[0], tank_location[1] + tank_height / 2);
    const Vmax = gvs.A * gvs.h_tank;
    const liquid_level = ( gvs.V / Vmax ) * tank_height;
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
    p.rect(tank_width / 2, tank_height / 2 - 10, 30, -15);
    p.stroke(0);
    p.strokeWeight(2);
    p.line(tank_width / 2, tank_height / 2 - 25, tank_width / 2 + 30, tank_height / 2 - 25);
    p.line(tank_width / 2, tank_height / 2 - 10, tank_width / 2 + 30, tank_height / 2 - 10);
    p.line(-tank_width / 2, tank_height / 2, tank_width / 2, tank_height / 2);
  p.pop();
}

function drawAll(p) {
  drawTank(p);
}

module.exports = drawAll;