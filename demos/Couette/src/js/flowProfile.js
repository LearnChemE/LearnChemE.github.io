gvs.flowRate = function(y) {
  const mu = 1e-3;
  const h = 0.1;
  const U0 = gvs.U0;
  const c = gvs.dpdx;
  return (U0 / 2) * (1 + y / h) + (((-1 * c) * h**2) / (2 * mu)) * (1 - (y / h)**2);
}

const profile = {
  drawArrows: function(p) {
    p.push();
    p.stroke(0, 0, 255);
    p.strokeWeight(1);
    for ( let i = -0.08; i < 0.1; i += 0.02 ) {
      const coord = [gvs.flowRate(-1 * i), i];
      const pixel1 = gvs.coordToPixel(0, i);
      const pixel2 = gvs.coordToPixel(coord[0], i);
      p.noFill();
      p.line(pixel1[0], pixel1[1], pixel2[0], pixel2[1]);
      p.fill(0, 0, 255);
      if(coord[0] < 0) {
        p.triangle(pixel2[0], pixel2[1], pixel2[0] + 12, pixel2[1] - 3, pixel2[0] + 12, pixel2[1] + 3);
      } else if(coord[0] > 0) {
        p.triangle(pixel2[0], pixel2[1], pixel2[0] - 12, pixel2[1] - 3, pixel2[0] - 12, pixel2[1] + 3);
      }
    }
    p.pop();
  },
  drawCurve: function(p) {
    p.push();
    p.stroke(0, 0, 255);
    p.strokeWeight(2);
    p.noFill();
    p.beginShape();
    for(let i = -0.1; i < 0.105; i += 0.005) {
      const coord = [gvs.flowRate(-1 * i), i];
      const pixels = gvs.coordToPixel(coord[0], coord[1]);
      p.vertex(pixels[0], pixels[1]);
    }
    p.endShape();
    p.pop();
  }
}

module.exports = profile;