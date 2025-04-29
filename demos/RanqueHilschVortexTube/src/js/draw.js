export function drawAll() {
  push();
  fill("rgb(255, 0, 0)");
  noStroke();
  strokeWeight(0.1);
  for (let i = 0; i < 1000; i++) {
    const x = 20 + i / 10;
    const y = height / 2 + 10 * sin(radians(i * 3));
    fill(min(255, i), min(255, 255 - i), min(255, 511 - i));
    circle(x, y, 2);
  }
  pop();

  push();
  fill(0);
  textSize(5);
  textAlign(CENTER);
  noStroke();
  text(state.P.toFixed(1) + " bar", width / 2, height - 10);
  pop();

  push();
  const xOffset = state.z * 10;
  fill("white");
  stroke(0);
  strokeWeight(0.5);
  triangle(width - 20 + xOffset, height / 2 - 10, width - 20 + xOffset, height / 2 + 10, width - 30 + xOffset, height / 2);
  pop();
}