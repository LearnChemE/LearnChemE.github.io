const colors = ["rgb(180, 180, 180)"]

const shapes = {
  pipeHorizontal : function(x, y, pipeDiameter, pipeLength) {
    push();
      fill(colors[0]);
      stroke(0);
      strokeWeight(1);
      rect(x, y, 10, pipeDiameter);
      rect(x + pipeLength - 10, y, 10, pipeDiameter);
      rect(x + 10, y + pipeDiameter / 6, pipeLength - 20, pipeDiameter * 2 / 3);
    pop();
  },
  elbow1: function(x, y, pipeDiameter) {
    push();
      fill(colors[0]);
      stroke(0);
      strokeWeight(1);
      arc(x + 20, y + pipeDiameter / 6, pipeDiameter * 4 / 3, pipeDiameter * 4 / 3, 0, HALF_PI);
      noStroke();
      rect(x + 10, y + pipeDiameter / 6, 10, pipeDiameter * 2 / 3);
      stroke(0);
      rect(x, y, 10, pipeDiameter);
      line(x + 10, y + pipeDiameter / 6, x + 20, y + pipeDiameter / 6);
      line(x + 10, y + 5 * pipeDiameter / 6, x + 20, y + 5 * pipeDiameter / 6);
      noStroke();
      rect(x + 20, y + pipeDiameter / 6 - 10, pipeDiameter * 2 / 3, 10 );
      stroke(0);
      line(x + 20, y + pipeDiameter / 6, x + 20, y + pipeDiameter / 6 - 10);
      line(x + 20 + 2 * pipeDiameter / 3, y + pipeDiameter / 6, x + 20 + 2 * pipeDiameter / 3, y + pipeDiameter / 6 - 10);
      rect(x + 20 - pipeDiameter / 6, y + pipeDiameter / 6 - 20, pipeDiameter, 10);
    pop();
  },
  elbow2: function(x, y, pipeDiameter) {
    push();
      fill(colors[0]);
      stroke(0);
      strokeWeight(1);
      arc(x + 7 * pipeDiameter / 6 + 10, y - 5 * pipeDiameter / 6 - 20, pipeDiameter * 4 / 3, pipeDiameter * 4 / 3, PI, 6 * PI / 4);
      noStroke();
      rect(x + pipeDiameter, y - 5 * pipeDiameter / 6 - 20, 2 * pipeDiameter / 3, 10);
      stroke(0);
      rect(x + 5 * pipeDiameter / 6, y - 5 * pipeDiameter / 6 - 10, pipeDiameter, 10);
      line(x + pipeDiameter, y - 5 * pipeDiameter / 6 - 20, x + pipeDiameter, y - 5 * pipeDiameter / 6 - 10);
      line(x + 5 * pipeDiameter / 3, y - 5 * pipeDiameter / 6 - 20, x + 5 * pipeDiameter / 3, y - 5 * pipeDiameter / 6 - 10);
      noStroke();
      rect(x + 5 * pipeDiameter / 3, y - 9 * pipeDiameter / 6 - 20, 10, pipeDiameter * 2 / 3);
      stroke(0);
      line(x + 5 * pipeDiameter / 3, y - 5 * pipeDiameter / 6 - 20, x + 5 * pipeDiameter / 3 + 10, y - 5 * pipeDiameter / 6 - 20 );
      line(x + 5 * pipeDiameter / 3, y - 5 * pipeDiameter / 6 - 20 - 2 * pipeDiameter / 3, x + 5 * pipeDiameter / 3 + 10, y - 5 * pipeDiameter / 6 - 20 - 2 * pipeDiameter / 3 );
      rect(x + 5 * pipeDiameter / 3 + 10, y - 5 * pipeDiameter / 3 - 20, 10, pipeDiameter);
    pop();
  },
  pipeVertical : function(x, y, pipeDiameter, height) {
    push();
      fill(colors[0]);
      stroke(0);
      strokeWeight(1);
      rect(x + pipeDiameter, y - 5 * pipeDiameter / 6 - height, 2 * pipeDiameter / 3, height);
    pop();
  }
}

module.exports = shapes;