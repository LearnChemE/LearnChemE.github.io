function drawAxes(graph) {
  const margin = graph.margin;
  const graphHeight = graph.height;
  const graphWidth = graph.width;

  push();
  stroke(0);
  strokeWeight(0.2);

  // Y-axis
  line(margin.left, margin.top, margin.left, height - margin.bottom);
  textAlign(RIGHT, CENTER);
  fill(0);
  textSize(3);
  for (let i = 0; i <= 28; i++) {
    stroke(0);
    const x1 = margin.left;
    const y = margin.top + (i * graphHeight) / 28;
    let x2;
    if (i % 4 === 0) {
      x2 = margin.left + 1.75;
      strokeWeight(0.2);
      noStroke();
      const txt = String(Math.round(14 * (28 - i) / 28));
      text(txt, x2 - 3, y);
      stroke(0);
      line(x1, y, x2, y);
    } else if (i % 2 === 0) {
      x2 = margin.left + 1.25;
      strokeWeight(0.15);
      line(x1, y, x2, y);
    } else {
      x2 = margin.left + 1;
      strokeWeight(0.1);
      line(x1, y, x2, y);
    }
  }

  // X-axis
  strokeWeight(0.2);
  line(margin.left, height - margin.bottom, width - margin.right, height - margin.bottom);

  // Y-axis label
  push();
  translate(margin.left - 10, margin.top + graphHeight / 2);
  rotate(-HALF_PI);
  textAlign(CENTER, CENTER);
  textSize(4);
  fill(0);
  noStroke();
  text("equilibrium amount (mol)", 0, 0);
  pop();

  pop();
}

function drawBars(graph) {
  const margin = graph.margin;
  const graphHeight = graph.height;
  const graphWidth = graph.width;

  push();
  const n2color = color(0, 0, 255);
  const h2color = color(255, 0, 0);
  const nh3color = color(0, 255, 0);
  const barWidth = 28;

  strokeWeight(0.1);
  stroke(0);
  textAlign(LEFT, BOTTOM);
  textSize(3.5);

  push();
  translate(margin.left + graphWidth / 6, margin.top + graphHeight);
  fill(n2color);
  rect(-barWidth / 2, 0, barWidth, -state.outlet.nN2 * 2 * graphHeight / 28);
  noStroke();
  fill(0);
  const n2 = (round(state.outlet.nN2 * 100) / 100).toFixed(2);
  translate(-barWidth / 2.5, 0);
  text(`N   = ${n2} mol`, 0, -state.outlet.nN2 * 2 * graphHeight / 28 - 1.5);
  textSize(2.5);
  text("2", 2.7, -state.outlet.nN2 * 2 * graphHeight / 28 - 0.5);
  pop();

  push();
  translate(margin.left + 3 * graphWidth / 6, margin.top + graphHeight);
  fill(h2color);
  rect(-barWidth / 2, 0, barWidth, -state.outlet.nH2 * 2 * graphHeight / 28);
  noStroke();
  fill(0);
  const h2 = (round(state.outlet.nH2 * 100) / 100).toFixed(2);
  translate(-barWidth / 2.5, 0);
  text(`H   = ${h2} mol`, 0, -state.outlet.nH2 * 2 * graphHeight / 28 - 1.5);
  textSize(2.5);
  text("2", 2.7, -state.outlet.nH2 * 2 * graphHeight / 28 - 0.5);
  pop();

  push();
  translate(margin.left + 5 * graphWidth / 6, margin.top + graphHeight);
  fill(nh3color);
  rect(-barWidth / 2, 0, barWidth, -state.outlet.nNH3 * 2 * graphHeight / 28);
  noStroke();
  fill(0);
  const nh3 = (round(state.outlet.nNH3 * 100) / 100).toFixed(2);
  translate(-barWidth / 2.5 - 1, 0);
  text(`NH   = ${nh3} mol`, 0, -state.outlet.nNH3 * 2 * graphHeight / 28 - 1.5);
  textSize(2.5);
  text("3", 5.2, -state.outlet.nNH3 * 2 * graphHeight / 28 - 0.5);
  pop();

  pop();
}

export function drawAll() {
  const margin = { top: 40, right: 20, bottom: 15, left: 20 };
  const graphHeight = height - margin.top - margin.bottom;
  const graphWidth = width - margin.left - margin.right;
  const graph = { margin: margin, height: graphHeight, width: graphWidth };

  drawAxes(graph);
  drawBars(graph);
}