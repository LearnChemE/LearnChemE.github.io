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
  },
  doubleArrow : function(x, y, length) {
    push();
      stroke(0);
      strokeWeight(1);
      fill(0);
      line(x, y, x, y - length - 55);
      triangle(x, y, x + 5, y - 10, x - 5, y - 10);
      triangle(x, y - length - 55, x + 5, y - length - 45, x - 5, y - length - 45);
      strokeWeight(0.5);
      line(x - 50, y + 0.5, x + 10, y + 0.5 );
    pop();
  },
  singleArrow : function(x, y, x2, y2) {
    push();
      stroke(0);
      strokeWeight(1);
      fill(0);
      line(x, y, x2, y2);
      triangle(x2, y2, x2 - 10, y2 - 5, x2 - 10, y2 + 5);
    pop();
  }
}

module.exports = shapes;