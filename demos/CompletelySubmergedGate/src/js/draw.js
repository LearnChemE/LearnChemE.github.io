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
  p.rect(180, 40, 10, 210)
  p.pop();
}

function drawArrows(p) {

}

function drawDistances(p) {

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
  p.pop();
}

function drawDistances(p) {
  
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