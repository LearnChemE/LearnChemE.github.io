function drawTriangle(p) {
  p.push();
  p.stroke(0);
  p.strokeWeight(1);
  p.line(gvs.t[0][0], gvs.t[0][1], gvs.t[1][0], gvs.t[1][1]);
  p.line(gvs.t[1][0], gvs.t[1][1], gvs.t[2][0], gvs.t[2][1]);
  p.line(gvs.t[2][0], gvs.t[2][1], gvs.t[0][0], gvs.t[0][1]);
  p.pop();
}

function drawAll(p) {
  drawTriangle(p);
}

module.exports = drawAll;