export function drawAll() {
  push();
  fill("red");
  strokeWeight(0.2);

  const T_adj = state.T / 20;

  rect(75, height - 5, 10, -T_adj);
  pop();
}