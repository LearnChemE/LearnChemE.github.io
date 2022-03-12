function drawArrows(p) {
  const center = gvs.arrows.center;
  const before = gvs.arrows.before;
  const after = gvs.arrows.after;
  const total = center.length + before.length + after.length - 1;
  for(let i = 0; i < before.length; i++) {
    const coord_1_x_pre = center[0][0] - 5;
    const coord_1_y_pre = center[0][1];
    const coord_2_x_pre = before[i][0];
    const coord_2_y_pre = before[i][1];
    const angle = gvs.p.atan2(coord_2_y_pre - coord_1_y_pre, coord_2_x_pre - coord_1_x_pre);
    let length = Math.sqrt((coord_2_x_pre - coord_1_x_pre)**2 + (coord_2_y_pre - coord_1_y_pre)**2);
    p.push();
    p.stroke(0);
    p.strokeWeight(2);
    p.noFill();
    p.translate(coord_1_x_pre, coord_1_y_pre);
    p.rotate(angle - Math.PI / 2);
    p.line(0, 0.38 * length, 0, 0.58 * length);
    p.noStroke();
    p.fill(0);
    p.triangle(0, 0.38 * length - 3, 5, 0.38 * length + 12, -5, 0.38 * length + 12)
    p.triangle
    p.pop();
  }

  for(let i = 0; i < after.length; i++) {
    const coord_1_x_pre = center[0][0] - 5;
    const coord_1_y_pre = center[0][1];
    const coord_2_x_pre = after[i][0];
    const coord_2_y_pre = after[i][1];
    const angle = gvs.p.atan2(coord_2_y_pre - coord_1_y_pre, coord_2_x_pre - coord_1_x_pre);
    let length = Math.sqrt((coord_2_x_pre - coord_1_x_pre)**2 + (coord_2_y_pre - coord_1_y_pre)**2);
    p.push();
    p.stroke(0);
    p.strokeWeight(2);
    p.noFill();
    p.translate(coord_1_x_pre, coord_1_y_pre);
    p.rotate(angle - Math.PI / 2);
    p.line(0, 0.38 * length, 0, 0.58 * length);
    p.noStroke();
    p.fill(0);
    p.triangle(0, 0.58 * length + 3, - 5, 0.58 * length - 12, 5, 0.58 * length - 12)
    p.triangle
    p.pop();
  }
}

function drawAll(p) {
  p.background(258);
  drawArrows(p)
}

module.exports = drawAll;