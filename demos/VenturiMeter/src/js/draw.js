

  const maxPressure = 120;

function drawTube(p) {
  p.push();

  p.translate(70, g.p.height / 1.5);
  const outer_dia = g.venturi_outer;
  const inner_dia = g.venturi_inner;
  const delta_dia = g.venturi_outer - g.venturi_inner;
  p.fill("cyan");
  
  p.stroke("blue");
  p.rect(100, 0, 20, manometerHeight(g.pressure_1));
  p.rect(240, 0, 20, manometerHeight(g.pressure_2));
  p.rect(335, 0, 20, manometerHeight(g.pressure_3));
  p.rect(440, 0, 20, manometerHeight(g.pressure_4));
  p.rect(585, 0, 20, manometerHeight(g.pressure_5));

  p.noStroke();
  p.beginShape();
  p.vertex(0, -0.5 * outer_dia);
  p.vertex(200, -0.5 * outer_dia);
  p.vertex(300, -0.5 * inner_dia);
  p.vertex(400, -0.5 * inner_dia);
  p.vertex(500, -0.5 * outer_dia);
  p.vertex(700, -0.5 * outer_dia);
  p.vertex(700, 0.5 * outer_dia);
  p.vertex(500, 0.5 * outer_dia);
  p.vertex(400, 0.5 * inner_dia);
  p.vertex(300, 0.5 * inner_dia);
  p.vertex(200, 0.5 * outer_dia);
  p.vertex(0, 0.5 * outer_dia);
  p.endShape();

  p.stroke(0);
  p.strokeWeight(1);
  p.noFill();
  // Top Line
  p.line(0, -0.5 * outer_dia, 100, -0.5 * outer_dia);
  p.line(120, -0.5 * outer_dia, 200, -0.5 * outer_dia);
  p.line(200, -0.5 * outer_dia, 240, -0.5 * outer_dia + 0.5 * delta_dia * (40 / 100));
  p.line(260, -0.5 * outer_dia + 0.5 * delta_dia * (60 / 100), 300, -0.5 * inner_dia);
  p.line(300, -0.5 * inner_dia, 335, -0.5 * inner_dia);
  p.line(355, -0.5 * inner_dia, 400, -0.5 * inner_dia);
  p.line(400, -0.5 * inner_dia, 440, -0.5 * outer_dia + 0.5 * delta_dia * (60 / 100));
  p.line(460, -0.5 * outer_dia + 0.5 * delta_dia * (40 / 100), 500, -0.5 * outer_dia);
  p.line(500, -0.5 * outer_dia, 585, -0.5 * outer_dia);
  p.line(605, -0.5 * outer_dia, 700, -0.5 * outer_dia);

  // Bottom line
  p.line(0, 0.5 * outer_dia, 200, 0.5 * outer_dia);
  p.line(200, 0.5 * outer_dia, 300, 0.5 * inner_dia);
  p.line(300, 0.5 * inner_dia, 400, 0.5 * inner_dia);
  p.line(400, 0.5 * inner_dia, 500, 0.5 * outer_dia);
  p.line(500, 0.5 * outer_dia, 700, 0.5 * outer_dia);

  // Manometers
  p.line(100, -0.5 * outer_dia, 100, -0.5 * outer_dia - 200);
  p.line(120, -0.5 * outer_dia, 120, -0.5 * outer_dia - 200);
  p.line(240, -0.5 * outer_dia + 0.5 * delta_dia * (40 / 100), 240, -0.5 * outer_dia - 200);
  p.line(260, -0.5 * outer_dia + 0.5 * delta_dia * (60 / 100), 260, -0.5 * outer_dia - 200);
  p.line(335, -0.5 * inner_dia, 335, -0.5 * outer_dia - 200);
  p.line(355, -0.5 * inner_dia, 355, -0.5 * outer_dia - 200);
  p.line(440, -0.5 * outer_dia + 0.5 * delta_dia * (60 / 100), 440, -0.5 * outer_dia - 200);
  p.line(460, -0.5 * outer_dia + 0.5 * delta_dia * (40 / 100), 460, -0.5 * outer_dia - 200);
  p.line(585, -0.5 * outer_dia, 585, -0.5 * outer_dia - 200);
  p.line(605, -0.5 * outer_dia, 605, -0.5 * outer_dia - 200);

  p.stroke(0);
  p.fill(0);
  p.line(50, -0.5 * outer_dia, 50, 0.5 * outer_dia);
  p.translate(50, -0.5 * outer_dia);
  p.line(0, 0, 10, 8);
  p.line(0, 0, -10, 8);
  p.translate(0, outer_dia);
  p.line(0, 0, 10, -8);
  p.line(0, 0, -10, -8);
  p.translate(0, -0.5 * outer_dia);
  p.textAlign(p.LEFT);
  p.textSize(14);
  p.noStroke();
  p.text("100 mm", 10, 0);

  sigmaCurve(p, 0);
  p.pop();

}

function manometerHeight(P) {
  const fraction = P / maxPressure;
  let height = -1 * fraction * 250;
  height = Math.min(height, -0.5 * g.venturi_inner) - 1;
  return height
}

function sigmaCurve(p, n) {
  p.push();

  for(let n = 0; n < 5; n++) {
    p.stroke(0);
    p.strokeWeight(1);
    p.noFill();
    const y_pix_start = ((n - 2) / 2) * 35;
    const y_pix_middle = ((n - 2) / 2) * 35 * g.venturi_inner / 100;
    
    p.beginShape();
    p.curveVertex(80, y_pix_start);
    p.curveVertex(80, y_pix_start);
    p.curveVertex(150, y_pix_start);
    p.curveVertex(250, y_pix_middle);
    p.curveVertex(350, y_pix_middle);
    p.curveVertex(450, y_pix_start);
    p.curveVertex(600, y_pix_start);
    p.curveVertex(600, y_pix_start);
    p.endShape();

    p.fill(0);
    p.noStroke();
    p.triangle(88, y_pix_start, 78, y_pix_start - 3, 78, y_pix_start + 3);
    p.triangle(258, y_pix_middle, 248, y_pix_middle - 3, 248, y_pix_middle + 3);
    p.triangle(358, y_pix_middle, 348, y_pix_middle - 3, 348, y_pix_middle + 3);
    p.triangle(608, y_pix_start, 598, y_pix_start - 3, 598, y_pix_start + 3);
  }

  p.pop();
}

function drawAxis(p) {
  p.push();
  p.translate(50, p.height / 1.5);
  p.textSize(15);
  p.textAlign(p.CENTER);
  p.text("mmH", -10, -275);
  p.text("O", 19, -275);
  p.textSize(10);
  p.text("2", 11, -270);
  p.textSize(15);
  p.line(0, 0, 0, -250);
  p.textAlign(p.RIGHT);
  const numberOfMajorTicks = 6;
  const minorTicksPerMajorTick = 5;
  const i_max = numberOfMajorTicks * minorTicksPerMajorTick;
  for(let i = 0; i <= i_max; i++) {
    const y = -250 * i / i_max;
    let tickWidth;
    if(i % minorTicksPerMajorTick === 0) {
      tickWidth = 8;
      const pressure = `${((i / i_max) * maxPressure)}`;
      p.text(pressure, -5, y + 5)
    } else {
      tickWidth = 3;
    }
    p.line(0, y, tickWidth, y);
  }
  p.pop();
}

function drawAll(p) {
  drawTube(p);
  drawAxis(p);
}

module.exports = drawAll;