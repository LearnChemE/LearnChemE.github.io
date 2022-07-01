function offset(x, y, p) {
  p.translate(x, y, p);
}

function drawGate(p) {
  p.push();
  p.fill(0);
  p.noStroke();
  p.rect(30, 30, 10, 400);
  p.rect(30, 430, 400, 10);
  p.pop();
}

function drawArrows(p) {

}

function drawDistances(p) {

}

function drawWater(p) {

}

function drawDistances(p) {
  
}

function drawAll(p) {
  offset(100, 20, p);
  drawWater();
  drawGate(p);
  drawArrows(p);
  drawDistances(p);
}

module.exports = drawAll;