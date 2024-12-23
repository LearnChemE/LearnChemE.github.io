window.g = {
  cnv: undefined,
}

window.setup = function () {
  g.cnv = createCanvas(400, 400);
  g.cnv.parent("graphics-wrapper");
  background(220);
  noLoop();
}

window.draw = function () {
  for (let i = 0; i < 2; i++) {
    ellipse(random(width), random(height), 50, 50);
  }
}