function drawPump(x, y, scaleX, scaleY) {
  push();
  translate(x, y);
  scale(scaleX, scaleY);
  const pumpColor = "rgb(180, 180, 255)";
  const pumpStroke = "rgb(140, 140, 225)";
  fill(pumpColor);
  stroke(pumpStroke);
  strokeWeight(0.15);
  let vertices = [
    [-2, -4],
    [-3, -4],
    [-3, 4],
    [-2, 4],
    [-2, 3.5],
    [4, 3.5],
    [7, 5],
    [7, 6],
    [8, 6],
    [8, -6],
    [7, -6],
    [7, -5],
    [4, -3.5],
    [-2, -3.5],
  ]
  beginShape();
  vertices.forEach(coord => vertex(coord[0], coord[1]))
  endShape(CLOSE);
  line(-2, -4, -2, 4);
  line(7, -6, 7, 6);
  strokeWeight(0.4);
  line(4, -2, 7, -3);
  line(-2, 0, 7, 0);
  line(4, 2, 7, 3);
  strokeWeight(0.15);
  fill("rgb(160, 160, 245)");
  vertices = [
    [15, 5],
    [12, 8],
    [14, 8],
    [17, 5],
  ];

  beginShape();
  vertices.forEach(coord => vertex(coord[0], coord[1]));
  endShape(CLOSE);

  vertices = [
    [28, 5],
    [31, 8],
    [29, 8],
    [26, 5],
  ];

  beginShape();
  vertices.forEach(coord => vertex(coord[0], coord[1]));
  endShape(CLOSE);

  fill(pumpColor);
  vertices = [
    [8, 6],
    [9, 6],
    [9, 4],
    [10, 4],
    [14, 5.75],
    [15, 6],
    [30, 6],
    [30.5, 5.5],
    [30.5, -5.5],
    [30, -6],
    [15, -6],
    [14, -5.75],
    [10, -4],
    [9, -4],
    [9, -6],
    [8, -6],
  ]
  beginShape();
  vertices.forEach(coord => vertex(coord[0], coord[1]));
  endShape(CLOSE);
  line(9, 6, 9, -6);
  strokeWeight(0.1);
  fill("rgb(200, 200, 255)");
  stroke("rgb(100, 100, 190)");
  rectMode(CENTER);
  for (let i = 0; i < 13; i++) {
    rect(22.5, -6 + i, 10, 0.25 + abs(i - 6) * 0.075);
  }
  stroke(pumpStroke);
  strokeWeight(0.4);
  line(9, -3, 11, -3);
  line(9, 0, 11, 0);
  line(9, 3, 11, 3);

  strokeWeight(0.15);
  fill("rgb(160, 160, 245)");
  rectMode(CORNER);
  rect(-2, 8, 34, 2, 0.25);

  fill("rgb(170, 170, 250)");
  rect(-0.5, -8, 3.5, 13, 0, 0, 2, 2);
  stroke("rgb(170, 170, 250)");
  line(-0.5, -8, 3, -8);

  vertices = [
    [-0.5, -8],
    [-2, -10],
    [4.5, -10],
    [3, -8],
  ]

  stroke(pumpStroke);

  beginShape();
  vertices.forEach(coord => vertex(coord[0], coord[1]));
  endShape();

  rect(-3.5, -11, 9.5, 1);

  const cableColor = "rgb(40, 40, 40)";

  noFill();
  stroke(cableColor);
  strokeWeight(0.3);

  beginShape();
  vertex(30.5, 0);
  quadraticVertex(33, 0, 35, 2);
  quadraticVertex(38, 6, 40, 5);
  endShape();



  pop();
}

export function drawAll() {
  state.pressureControllers.forEach(c => {
    drawPump(c.x, c.y, c.scaleX, c.scaleY);
  })
}