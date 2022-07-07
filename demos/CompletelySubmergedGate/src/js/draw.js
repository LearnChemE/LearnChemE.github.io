const theta = -0.92;
const gateLength = 320; // length of the gate horizontally
const gate_coords = [[186, 243], [432, 433]]; // the coordinates of the left and right edges of the gate

function offset(x, y, p) {
  p.push();
  p.translate(x, y, p);
  p.pop();
}

function drawGate(p) {
  p.push();
  p.fill(0);
  p.noStroke();
  p.rect(30, 30, 10, 400);
  p.rect(30, 430, 400, 10);
  p.rect(180, 40, 10, 210);
  p.translate(180, 250);
  p.rotate(-0.92);
  p.fill("#999999");
  p.rect(0, 0, 15, 320, 10);
  p.pop();

  p.push();
  p.fill("white");
  p.stroke(0);
  p.strokeWeight(2);
  p.circle(186, 243, 30);
  p.fill("purple");
  p.noStroke();
  p.circle(432, 433, 10);
  p.pop();
}

function textBox(p, str, fontSize, color) {
  p.push();
  p.textSize(fontSize);
  const height1 = p.textAscent(str);
  const height2 = p.textDescent(str);
  const padding = [15, 2.5];
  const height = height1 + height2 + padding[1];
  const length = p.textWidth(str) + padding[0];
  p.fill("white");
  p.noStroke();
  p.rectMode(p.CENTER);
  p.rect(0, 0, length, height);
  p.fill(color);
  p.noStroke();
  p.textAlign(p.CENTER, p.CENTER);
  p.text(str, 0, 0);
  p.pop();
}

function drawArrows(p) {

  p.push();
  p.fill("green");
  p.stroke("green");
  p.strokeWeight("5");
  p.translate(186, 243, 30);
  p.rotate(Math.PI / 2 + theta);
  p.translate( gateLength * (g.dF / 2.5), 2);
  p.circle(0, 0, 7);
  p.noStroke();
  p.triangle(0, 5, 6, 18, -6, 18);
  const minForceWater = 1500;
  const maxForceWater = 5000;
  const dForceWater = maxForceWater - minForceWater;
  p.stroke("green");
  p.strokeWeight(2);
  p.line(0, 0, 0, 95 + 75 * (g.waterValue * 1000 - minForceWater) / dForceWater);
  p.translate(0, 95 + 75 * (g.waterValue * 1000 - minForceWater) / dForceWater);
  p.translate(0, 20);
  p.rotate(-1 * (Math.PI / 2 + theta));
  textBox(p, `force from water = ${(g.FR / 1000).toFixed(1)} kN`, 15, "green");
  p.pop();

  p.push();
  p.fill(0, 0, 255);
  p.stroke(0, 0, 255);
  p.strokeWeight(5);
  p.translate(186, 243, 30);
  p.rotate(Math.PI / 2 + theta);
  p.translate(gateLength / 2, 2);
  p.circle(0, 0, 7);
  p.rotate(-1 * (Math.PI / 2 + theta));
  p.strokeWeight(2);
  const minForceGate = 1500;
  const maxForceGate = 5000;
  const dForceGate = maxForceGate - minForceGate;
  p.line(0, 0, 0, 25 + 25 * (g.weightValue * 1000 - minForceGate) / dForceGate);
  p.translate(0, 25 + 25 * (g.weightValue * 1000 - minForceGate) / dForceGate);
  p.noStroke();
  p.triangle(6, 0, -6, 0, 0, 13);
  p.translate(-40, 26);
  textBox(p, `gate weight = ${g.weightValue.toFixed(2)} kN`, 15, "blue");
  p.pop();
}

function drawDistances(p) {
  const dxy = 30; // distance in pixels between each distance line
  const edgeLength = 5; // length of the little "edge" perpendicular to the distance lines on both sides
  
  p.push();
  p.stroke(0);
  p.strokeWeight(1);
  p.translate(gate_coords[0][0], gate_coords[0][1]);
  p.rotate(Math.PI / 2 + theta);
  // gate length
  p.line(0, -3* dxy, gateLength, -3 * dxy);
  p.line(0, -3 * dxy - edgeLength, 0, -3 * dxy + edgeLength);
  p.line(gateLength, -3 * dxy - edgeLength, gateLength, -3 * dxy + edgeLength);
  // water force vector
  p.line(0, -2 * dxy, (g.dF / 2.5) * gateLength, -2 * dxy);
  p.line(0, -2 * dxy + edgeLength, 0, -2 * dxy - edgeLength);
  p.line((g.dF / 2.5) * gateLength, -2 * dxy + edgeLength, (g.dF / 2.5) * gateLength, -2 * dxy - edgeLength);
  // gate force vector
  p.line(0, -1 * dxy, gateLength / 2, -1 * dxy);
  p.line(gateLength / 2, -1 * dxy + edgeLength, gateLength / 2, -1 * dxy - edgeLength);
  p.line(0, -1 * dxy + edgeLength, 0, -1 * dxy - edgeLength);
  p.pop();

  p.push();
  p.translate(186, 430);
  p.stroke(0);
  p.strokeWeight(1);
  p.noFill();
  // hinge distance
  p.line(0, 0, 0, 243 - 430);
  p.line(-1*edgeLength, 243 - 430, edgeLength, 243 - 430);
  p.translate(-80, 0);
  const wHeightPixels = 250 + 0;
  const maximumHeight = 3;
  const heightOfWaterInPixels = -1 * (360 * (g.waterValue / maximumHeight));
  const trim = 20 - ( g.waterValue / 3.0 ) * 50;
  p.line(0, heightOfWaterInPixels + trim, 0, 0);
  p.line(-1*edgeLength, heightOfWaterInPixels + trim, edgeLength, heightOfWaterInPixels + trim);
  p.pop();

  p.push();
  p.translate(285, 280);
  textBox(p, `2.5 m`, 15, "black");
  p.translate(0, -80);
  textBox(p, `1.25 m`, 15, "black");
  p.translate(0, 40);
  textBox(p, `${g.dF.toFixed(2)} m`, 15, "black");
  p.translate(-123, 70);
  textBox(p, `1.43 m`, 15, "black");
  p.translate(-80, 0);
  textBox(p, `${g.waterValue.toFixed(2)} m`, 15, "black");
  p.pop();

  p.push();
  p.noFill();
  p.stroke(0);
  p.strokeWeight(1);
  p.translate(432, 433);
  p.arc(0, 0, 120, 120, Math.PI, 5 * Math.PI / 4.12);
  p.translate(-30, 20);
  textBox(p, "35°", 15, "black");
  p.pop();
  
}

function drawWater(p) {
  p.push();
  p.fill( p.color("#d4f1f9") );
  p.noStroke();
  const maximumHeight = 3;
  const heightOfWaterInPixels = 400 - 360 * (g.waterValue / maximumHeight);
  p.rectMode(p.CORNERS);
  const trim = 50 - ( g.waterValue / 3.0 ) * 50;
  p.rect(30, heightOfWaterInPixels + trim, 180, 250);
  p.beginShape();
  p.vertex(30, 250);
  p.vertex(30, 430);
  p.vertex(430, 430);
  p.vertex(180, 250);
  p.endShape();
  p.pop();
  p.push();
  p.translate(145, 265);
  textBox(p, "hinge", 16, "black");
  p.pop();
}

function drawContainer(p) {

}

function drawAll(p) {
  offset(100, 20, p);
  drawWater(p);
  drawGate(p);
  drawArrows(p);
  drawDistances(p);
}

module.exports = drawAll;