function frameDraw() {
  let x, y;
  let x1, y1;
  labels = ['0.1', '0.2', '0.3', '0.4', '0.5', '0.6', '0.7', '0.8', '0.9'];

  // Solute labels
  push();
  textSize(20);
  fill(g.blue);
  stroke(g.blue);
  strokeWeight(1.5);
  for (let i = 0; i < labels.length; i++) {
    y = g.ytip + g.dy - g.dy / 10 * (i + 1);
    x = (y - g.L[1]) / g.L[0];
    line(x, y, x - 15, y);
    push();
    noStroke();
    text(labels[i], x - 47, y + 6);
    pop();
  }

  // Carrier labels
  fill(g.green);
  stroke(g.green);
  for (let i = 0; i < labels.length; i++) {
    y = g.ytip + g.dy / 10 * (i + 1);
    x = (y - g.R[1]) / g.R[0];
    line(x, y, x + 7.5, y - 7.5 * Math.sqrt(3));
    push();
    noStroke();
    translate(x + 16, y - 1 - 7.5 * Math.sqrt(3));
    rotate(radians(-g.angle));
    text(labels[i], 0, 0);
    pop();
  }

  // Solvent labels
  fill(g.red);
  stroke(g.red);
  for (let i = 0; i < labels.length; i++) {
    y = g.ytip + g.dy;
    x = g.xtip + g.dx - 2 * g.dx / 10 * (i + 1);
    line(x, y, x + 7.5, y + 7.5 * Math.sqrt(3));
    push();
    noStroke();
    translate(x + 3, y + 12 * Math.sqrt(3));
    rotate(radians(g.angle));
    text(labels[i], 0, 0);
    pop();
  }
  pop();

  // Grid on the triangle
  let dy = g.dy / 20;
  let dx = 2 * g.dx / 20;
  if (g.problemPart < 4) {
    push();
    stroke(0, 80);
    for (let i = 0; i < 19; i++) {
      // Solute lines
      y = g.ytip + g.dy - dy * (i + 1);
      x = (y - g.L[1]) / g.L[0];
      y1 = y;
      x1 = (y1 - g.R[1]) / g.R[0];
      line(x, y, x1, y1);
      // Solvent lines
      // x and y remain the same
      y1 = g.ytip + g.dy;
      x1 = g.xtip - g.dx + dx * (i + 1);
      line(x, y, x1, y1);
      // Carrier lines
      // y and y1 remain the same
      x = (y - g.R[1]) / g.R[0];
      x1 = g.xtip + g.dx - dx * (i + 1);
      line(x, y, x1, y1);
    }
    pop();
  }


  // Axes labels
  push();
  noStroke();
  textSize(22);
  fill(g.blue);
  text('solute', g.xtip - 70, g.ytip + 10);
  fill(g.green);
  text('carrier', g.xtip + g.dx, g.ytip + g.dy - 10);
  fill(g.red);
  text('solvent', g.xtip - g.dx - 50, g.ytip + g.dy + 30);
  pop();

  // Overall triangle
  push();
  strokeWeight(2);
  noFill();
  triangle(g.xtip, g.ytip, g.xtip - g.dx, g.ytip + g.dy, g.xtip + g.dx, g.ytip + g.dy);
  pop();

}

function phaseDraw() {
  let a, b, c, dx;
  a = g.phaseConstants[0];
  b = g.phaseConstants[1];
  c = g.phaseConstants[2];
  dx = (g.phaseLims[1] - g.phaseLims[0]) / 100;

  push();
  noFill();
  strokeWeight(2);
  beginShape();
  for (let i = g.phaseLims[0]; i <= g.phaseLims[1]; i += dx) {
    let x = map(i, 0, 1, g.xtip - g.dx, g.xtip + g.dx);
    let y = map(a * i ** 2 + b * i + c, 0, Math.sqrt(3) / 2, g.ytip + g.dy, g.ytip);
    vertex(x, y);
  }
  let xt = map(g.phaseLims[1], 0, 1, g.xtip - g.dx, g.xtip + g.dx);
  let yt = map(a * g.phaseLims[1] ** 2 + b * g.phaseLims[1] + c, 0, Math.sqrt(3) / 2, g.ytip + g.dy, g.ytip);
  vertex(xt, yt); // Additional vertex to account for numerical error in i
  endShape();

  for (let i = 1; i < g.tiepx.length; i++) {
    line(g.tiepx[i][0], g.tiepx[i][2], g.tiepx[i][1], g.tiepx[i][3]);
  }
  pop();
}

function answersAndUserInput() {
  switch (g.problemPart) {
    case (0):
      partOneInput();
      partOneAnswer();
      break;
    case (1):
      partTwoInput();
      partOneAnswer();
      partTwoAnswer();
      break;
    case (2):
      partThreeInput();
      partOneAnswer();
      partTwoAnswer();
      partThreeAnswer();
      break;
    case (3):
      partFourInput();
      partFourAnswer();
      partOneAnswer();
      partTwoAnswer();
      partThreeAnswer();
      break;
    case (4):
      partFourAnswer();
      partOneAnswer();
      partTwoAnswer();
      partFiveInput();
      partThreeAnswer();
      partFiveAnswer();
      break;
    case (5):
      partThreeAnswer();
      partSixAnswer();
      partFiveAnswer();
      partTwoAnswer();
      partSixInput();
      partOneAnswer();
      partThreeAnswer();
      break;
    case (6):
      partSevenInput();
      partSevenAnswer();
      partOneAnswer();
      partTwoAnswer();
      partThreeAnswer();
      partFiveAnswer();
      partSixAnswer();
      break;
    case (7):
      partEightInput();
      partEightAnswer();
      partOneAnswer();
      partTwoAnswer();
      partThreeAnswer();
      partSixAnswer();
      partSevenAnswer();
      partFiveAnswer();
      break;
    case (8):
      partThreeAnswer();
      partNineInput();
      partNineAnswer();
      partEightAnswer();
      partOneAnswer();
      partTwoAnswer();
      partSixAnswer();
      partSevenAnswer();
      partFiveAnswer();
      break;
    case (9):
      partTenInput();
      partThreeAnswer();
      partEightAnswer();
      partOneAnswer();
      partTwoAnswer();
      partSixAnswer();
      partSevenAnswer();
      partFiveAnswer();
      partTenAnswer();
      partNineAnswer();
      break;
    case (10):
      partThreeAnswer();
      partEightAnswer();
      partOneAnswer();
      partTwoAnswer();
      partSixAnswer();
      partSevenAnswer();
      partFiveAnswer();
      partTenAnswer();
      partNineAnswer();
      partElevenAnswer();
      break;
  }
}


function partOneInput() {
  let temp = g.points[0];
  push();
  fill(0);
  noStroke();
  ellipse(temp.x, temp.y, 2 * g.radius);
  fill(255);
  ellipse(temp.x, temp.y, g.radius);
  stroke(0);
  ellipse(temp.x, temp.y - 27, 30);
  noStroke();
  fill(0);
  textSize(22);
  textStyle(ITALIC);
  text('F', temp.x - 8, temp.y - 20);
  pop();
}

function partOneAnswer() {
  let x, y;
  let dx, dy;
  y = map(ans.step1[0], 0, 1, g.ytip + g.dy, g.ytip);
  dy = g.ytip + g.dy - y;
  x = map(ans.step1[1], 0, 1, g.xtip + g.dx, g.xtip - g.dx);
  dx = dy / Math.tan(radians(g.angle));
  if (g.solutionTruth || g.problemPart > 0) {
    push();
    noStroke();
    fill(0);
    ellipse(x - dx, y, 14);
    pop();
  }
  if (g.problemPart > 0) {
    push();
    fill(255);
    ellipse(x - dx, y - 27, 30);
    noStroke();
    fill(0);
    textSize(22);
    textStyle(ITALIC);
    text('F', x - 8 - dx, y - 20);
    pop();
  }
}

function partTwoInput() {
  let temp = g.points[0];
  push();
  fill(g.red);
  noStroke();
  ellipse(temp.x, temp.y, 2 * g.radius);
  fill(255);
  ellipse(temp.x, temp.y, g.radius);
  stroke(g.red);
  ellipse(temp.x, temp.y - 27, 30);
  noStroke();
  fill(g.red);
  textSize(22);
  textStyle(ITALIC);
  text('S', temp.x - 8, temp.y - 20);
  pop();
}

function partTwoAnswer() {
  let x = g.xtip - g.dx;
  let y = g.ytip + g.dy;

  if (g.solutionTruth || g.problemPart > 1) {
    push();
    noStroke();
    fill(g.red);
    ellipse(x, y, 14);
    pop();
  }
  if (g.problemPart > 1) {
    push();
    fill(255);
    stroke(g.red);
    ellipse(x, y - 27, 30);
    noStroke();
    fill(g.red);
    textSize(22);
    textStyle(ITALIC);
    text('S', x - 8, y - 20);
    pop();
  }
}

function partThreeInput() {
  let temp = g.points[0];
  push();
  fill(g.part4);
  noStroke();
  ellipse(temp.x, temp.y, 2 * g.radius);
  fill(255);
  ellipse(temp.x, temp.y, g.radius);
  stroke(g.part4);
  ellipse(temp.x, temp.y - 27, 30);
  noStroke();
  fill(g.part4);
  textSize(18);
  textStyle(ITALIC);
  text('R', temp.x - 12, temp.y - 22);
  textSize(14);
  textStyle(NORMAL);
  text('N', temp.x, temp.y - 17);
  pop();
}

function partThreeAnswer() {
  let x, y;
  let xRN = .99 * g.phaseLims[1];
  let yRN = g.phaseConstants[0] * xRN ** 2 + g.phaseConstants[1] * xRN + g.phaseConstants[2];
  y = map(yRN, 0, 1, g.ytip + g.dy, g.ytip);
  x = map(xRN, 0, 1, g.xtip - g.dx, g.xtip + g.dx);
  if (g.solutionTruth || g.problemPart > 2) {
    push();
    noStroke();
    fill(g.part4);
    ellipse(x, y, 14);
    pop();
  }
  if (g.problemPart > 2) {
    push();
    fill(255);
    stroke(g.part4);
    ellipse(x, y - 27, 30);
    noStroke();
    fill(g.part4);
    textSize(18);
    textStyle(ITALIC);
    text('R', x - 12, y - 22);
    textSize(14);
    textStyle(NORMAL);
    text('N', x, y - 17);
    pop();
  }



}

function partFourInput() {
  let temp = g.points[0];
  push();
  fill(60);
  noStroke();
  ellipse(temp.x, temp.y, 2 * g.radius);
  fill(255);
  ellipse(temp.x, temp.y, g.radius);
  stroke(60);
  ellipse(temp.x, temp.y - 27, 30);
  noStroke();
  fill(60);
  textSize(22);
  textStyle(ITALIC);
  text('M', temp.x - 10, temp.y - 20)
  pop();
}

function partFourAnswer() {
  let x, y;
  let dx, dy;
  y = map(ans.step1[0], 0, 1, g.ytip + g.dy, g.ytip);
  dy = g.ytip + g.dy - y;
  x = map(ans.step1[1], 0, 1, g.xtip + g.dx, g.xtip - g.dx);
  dx = dy / Math.tan(radians(g.angle));

  push();
  strokeWeight(2);
  stroke(60);
  if (g.problemPart == 3) {
    drawingContext.setLineDash([5, 5]);
    line(x - dx, y, g.xtip - g.dx, g.ytip + g.dy);
  }

  y = map(ans.step4[0], 0, 1, g.ytip + g.dy, g.ytip);
  dy = g.ytip + g.dy - y;
  dx = dy / Math.tan(radians(g.angle));
  x = map(ans.step4[1], 0, 1, g.xtip + g.dx, g.xtip - g.dx);
  if (g.solutionTruth || g.problemPart > 3) {
    noStroke();
    fill(60);
    ellipse(x - dx, y, 14);
  }
  if (g.problemPart > 3) {
    stroke(60);
    fill(255);
    strokeWeight(1);
    ellipse(x - dx, y - 27, 30);
    noStroke();
    fill(60);
    textSize(22);
    textStyle(ITALIC);
    text('M', x - dx - 10, y - 20);
  }
  pop();
}

function partFiveInput() {
  let temp = g.points[0];
  push();
  strokeWeight(2);
  stroke(g.part5);
  line(ans.step3px[0], ans.step3px[1], temp.x, temp.y);
  noStroke();
  fill(g.part5);
  ellipse(temp.x, temp.y, 2 * g.radius);
  fill(255);
  ellipse(temp.x, temp.y, g.radius);
  stroke(g.part5);
  strokeWeight(1);
  ellipse(temp.x, temp.y - 27, 30);
  noStroke();
  fill(g.part5);
  textSize(18);
  textStyle(ITALIC);
  text('E', temp.x - 10, temp.y - 22);
  textSize(14);
  textStyle(NORMAL);
  text('1', temp.x + 2, temp.y - 17);
  pop();
}

function partFiveAnswer() {
  push();
  if (g.solutionTruth || g.problemPart > 4) {
    noStroke();
    fill(g.part5);
    ellipse(ans.step5[0], ans.step5[1], 2 * g.radius);
  }
  pop();
  push();
  if (g.problemPart > 4) {
    stroke(g.part5);
    fill(255);
    ellipse(ans.step5[0], ans.step5[1] - 27, 30);
    noStroke();
    fill(g.part5);
    textSize(18);
    textStyle(ITALIC);
    text('E', ans.step5[0] - 10, ans.step5[1] - 22);
    textSize(14);
    textStyle(NORMAL);
    text('1', ans.step5[0] + 2, ans.step5[1] - 17);
  }
  pop();
}

function partSixInput() {
  let temp = g.points[0];
  // Need xF and yF
  yF = map(ans.step1[0], 0, 1, g.ytip + g.dy, g.ytip);
  let xtemp = map(ans.step1[1], 0, 1, g.xtip + g.dx, g.xtip - g.dx);
  let dx = (g.ytip + g.dy - yF) / Math.tan(radians(g.angle));
  xF = xtemp - dx;

  xRN = ans.step3px[0];
  yRN = ans.step3px[1];

  push();

  stroke(g.part6);
  ellipse(temp.x, temp.y - 27, 30);
  textSize(22);
  textStyle(ITALIC);
  noStroke();
  fill(g.part6);
  text('P', temp.x - 8, temp.y - 19);
  stroke(g.part6);
  strokeWeight(2);
  drawingContext.setLineDash([1, 6]);
  line(xF, yF, temp.x, temp.y);
  line(xRN, yRN, temp.x, temp.y);
  noStroke();
  fill(g.part6);
  ellipse(temp.x, temp.y, 2 * g.radius);
  fill(255);
  ellipse(temp.x, temp.y, g.radius);
  pop();
}

function partSixAnswer() {
  yF = map(ans.step1[0], 0, 1, g.ytip + g.dy, g.ytip);
  let xtemp = map(ans.step1[1], 0, 1, g.xtip + g.dx, g.xtip - g.dx);
  let dx = (g.ytip + g.dy - yF) / Math.tan(radians(g.angle));
  xF = xtemp - dx;

  xRN = ans.step3px[0];
  yRN = ans.step3px[1];

  if (g.problemPart == 5 && g.solutionTruth) {
    push();
    stroke(g.part6);
    strokeWeight(2);
    drawingContext.setLineDash([5, 5]);
    line(ans.step6[0], ans.step6[1], xF, yF);
    line(ans.step6[0], ans.step6[1], xRN, yRN);
    pop();
  }
  if (g.solutionTruth || g.problemPart > 5) {
    push();
    noStroke();
    fill(g.part6);
    ellipse(ans.step6[0], ans.step6[1], 14);
    pop();
  }
  if (g.problemPart > 5) {
    push();
    stroke(g.part6);
    fill(255);
    ellipse(ans.step6[0], ans.step6[1] - 27, 30);
    noStroke();
    textSize(22);
    textStyle(ITALIC);
    fill(g.part6);
    text('P', ans.step6[0] - 7, ans.step6[1] - 19);
    pop();
  }
}

function partSevenInput() {
  let temp = g.points[0];
  push();
  strokeWeight(2);
  drawingContext.setLineDash([5, 5]);
  stroke(g.part4);
  line(temp.x, temp.y, ans.step5[0], ans.step5[1]);
  pop();
  push();
  noStroke();
  fill(g.part4);
  ellipse(temp.x, temp.y, 2 * g.radius);
  fill(255);
  ellipse(temp.x, temp.y, g.radius);

  if (!g.solutionTruth) {
    stroke(g.part4);
    ellipse(temp.x, temp.y - 27, 30);
    noStroke();
    fill(g.part4);
    textSize(18);
    textStyle(ITALIC);
    text('R', temp.x - 10, temp.y - 22);
    textSize(14);
    textStyle(NORMAL);
    text('1', temp.x + 2, temp.y - 17);
  }

  pop();
}

function partSevenAnswer() {
  let temp = ans.step7[0];

  if (g.solutionTruth || g.problemPart > 6) {
    push();
    strokeWeight(2);
    drawingContext.setLineDash([5, 5]);
    stroke(g.part4);
    line(ans.step5[0], ans.step5[1], temp[0], temp[1]);
    pop();
    push();
    noStroke();
    fill(g.part4);
    ellipse(temp[0], temp[1], 14);
    stroke(g.part4);
    fill(255);
    ellipse(temp[0], temp[1] - 27, 30);
    noStroke();
    fill(g.part4);
    textSize(18);
    textStyle(ITALIC);
    text('R', temp[0] - 10, temp[1] - 22);
    textSize(14);
    textStyle(NORMAL);
    text('1', temp[0] + 2, temp[1] - 17);
    pop();
  }
}

function partEightInput() {
  let temp = g.points[0];
  push();
  if (g.problemPart == 7 && !g.solutionTruth) {
    strokeWeight(2);
    stroke(g.part5);
    drawingContext.setLineDash([5, 5]);
    line(ans.step6[0], ans.step6[1], ans.step7[0][0], ans.step7[0][1]);
  }
  pop();
  push();
  stroke(g.part5);
  if (!g.solutionTruth) {
    ellipse(temp.x, temp.y - 27, 30);
    noStroke();
    fill(g.part5);
    ellipse(temp.x, temp.y, 2 * g.radius);
    textSize(18);
    textStyle(ITALIC);
    text('E', temp.x - 10, temp.y - 22);
    textSize(14);
    textStyle(NORMAL);
    text('2', temp.x + 2, temp.y - 17);
  }
  noStroke();
  fill(g.part5);
  ellipse(temp.x, temp.y, 2 * g.radius);
  fill(255);
  ellipse(temp.x, temp.y, g.radius);
  pop();
}

function partEightAnswer() {
  let temp = ans.step8[0];
  if (g.solutionTruth || g.problemPart > 7) {
    push();
    strokeWeight(2);
    stroke(g.part5);
    drawingContext.setLineDash([5, 5]);
    line(ans.step7[0][0], ans.step7[0][1], temp[0], temp[1]);
    pop();
    push();
    noStroke();
    fill(g.part5);
    ellipse(temp[0], temp[1], 14);
    pop();
    push();
    stroke(g.part5);
    ellipse(temp[0], temp[1] - 27, 30);
    noStroke();
    fill(g.part5);
    textSize(18);
    textStyle(ITALIC);
    text('E', temp[0] - 10, temp[1] - 22);
    textSize(14);
    textStyle(NORMAL);
    text('2', temp[0] + 2, temp[1] - 17);
    pop();
  }


}

function partNineInput() {
  let temp = g.points[0];
  push();
  strokeWeight(2);
  drawingContext.setLineDash([5, 5]);
  stroke(g.part4);
  line(temp.x, temp.y, ans.step8[0][0], ans.step8[0][1]);
  pop();
  push();
  noStroke();
  fill(g.part4);
  ellipse(temp.x, temp.y, 2 * g.radius);
  fill(255);
  ellipse(temp.x, temp.y, g.radius);

  if (!g.solutionTruth) {
    stroke(g.part4);
    ellipse(temp.x, temp.y - 27, 30);
    noStroke();
    fill(g.part4);
    textSize(18);
    textStyle(ITALIC);
    text('R', temp.x - 10, temp.y - 22);
    textSize(14);
    textStyle(NORMAL);
    text('2', temp.x + 2, temp.y - 17);
  }

  pop();
}

function partNineAnswer() {
  let temp = ans.step9[0];

  if (g.solutionTruth || g.problemPart > 8) {
    push();
    strokeWeight(2);
    drawingContext.setLineDash([5, 5]);
    stroke(g.part4);
    line(ans.step8[0][0], ans.step8[0][1], temp[0], temp[1]);
    pop();
    push();
    noStroke();
    fill(g.part4);
    ellipse(temp[0], temp[1], 14);
    stroke(g.part4);
    fill(255);
    ellipse(temp[0], temp[1] - 27, 30);
    noStroke();
    fill(g.part4);
    textSize(18);
    textStyle(ITALIC);
    text('R', temp[0] - 10, temp[1] - 22);
    textSize(14);
    textStyle(NORMAL);
    text('2', temp[0] + 2, temp[1] - 17);
    pop();
  }
}

function partTenInput() {
  let temp = g.points[0];
  push();
  if (g.problemPart == 9 && !g.solutionTruth) {
    strokeWeight(2);
    stroke(g.part5);
    drawingContext.setLineDash([5, 5]);
    line(ans.step6[0], ans.step6[1], ans.step9[0][0], ans.step9[0][1]);
  }
  pop();
  push();
  stroke(g.part5);
  if (!g.solutionTruth) {
    ellipse(temp.x, temp.y - 27, 30);
    noStroke();
    fill(g.part5);
    ellipse(temp.x, temp.y, 2 * g.radius);
    textSize(18);
    textStyle(ITALIC);
    text('E', temp.x - 10, temp.y - 22);
    textSize(14);
    textStyle(NORMAL);
    text('3', temp.x + 2, temp.y - 17);
  }
  noStroke();
  fill(g.part5);
  ellipse(temp.x, temp.y, 2 * g.radius);
  fill(255);
  ellipse(temp.x, temp.y, g.radius);
  pop();
}

function partTenAnswer() {
  let temp = ans.step10[0];
  if (g.solutionTruth || g.problemPart > 9) {
    push();
    strokeWeight(2);
    stroke(g.part5);
    drawingContext.setLineDash([5, 5]);
    line(ans.step9[0][0], ans.step9[0][1], temp[0], temp[1]);
    pop();
    push();
    noStroke();
    fill(g.part5);
    ellipse(temp[0], temp[1], 14);
    pop();
    push();
    stroke(g.part5);
    ellipse(temp[0], temp[1] - 27, 30);
    noStroke();
    fill(g.part5);
    textSize(18);
    textStyle(ITALIC);
    text('E', temp[0] - 10, temp[1] - 22);
    textSize(14);
    textStyle(NORMAL);
    text('3', temp[0] + 2, temp[1] - 17);
    pop();
  }
}

function partElevenAnswer() {

  // Lines between points
  push();
  strokeWeight(2);
  drawingContext.setLineDash([5, 5]);
  stroke(g.part4);
  line(ans.step10[0][0], ans.step10[0][1], ans.step11[0][0], ans.step11[0][1]); // E3 to R3
  stroke(g.part5);
  line(ans.step11[0][0], ans.step11[0][1], ans.step11[1][0], ans.step11[1][1]); // R3 to E4
  stroke(g.part4);
  line(ans.step11[1][0], ans.step11[1][1], ans.step11[2][0], ans.step11[2][1]); // E4 to R4
  if (ans.step11.length == 5) {
    stroke(g.part5);
    line(ans.step11[2][0], ans.step11[2][1], ans.step11[3][0], ans.step11[3][1]); // R4 to E5
    stroke(g.part4);
    line(ans.step11[3][0], ans.step11[3][1], ans.step11[4][0], ans.step11[4][1]); // E5 to R5
  }

  pop();

  // Raffinate labels and points
  push();
  noStroke();
  fill(g.part4);
  ellipse(ans.step11[0][0] - 3, ans.step11[0][1], 14);
  ellipse(ans.step11[2][0] - 3, ans.step11[2][1], 14);
  if (ans.step11.length == 5) {
    ellipse(ans.step11[4][0], ans.step11[4][1], 14);
  }
  pop();
  push();
  stroke(g.part4);
  fill(255);
  ellipse(ans.step11[0][0] - 3, ans.step11[0][1] - 27, 30);
  noStroke();
  fill(g.part4);
  textSize(18);
  textStyle(ITALIC);
  text('R', ans.step11[0][0] - 13, ans.step11[0][1] - 22);
  textSize(14);
  textStyle(NORMAL);
  text('3', ans.step11[0][0] - 1, ans.step11[0][1] - 17);
  pop();
  push();
  stroke(g.part4);
  fill(255);
  ellipse(ans.step11[2][0] - 3, ans.step11[2][1] - 27, 30);
  noStroke();
  fill(g.part4);
  textSize(18);
  textStyle(ITALIC);
  text('R', ans.step11[2][0] - 13, ans.step11[2][1] - 22);
  textSize(14);
  textStyle(NORMAL);
  text('4', ans.step11[2][0] - 1, ans.step11[2][1] - 17);
  pop();
  if (ans.step11.length == 5) {
    push();
    stroke(g.part4);
    fill(255);
    ellipse(ans.step11[4][0] - 3, ans.step11[4][1] - 27, 30);
    noStroke();
    fill(g.part4);
    textSize(18);
    textStyle(ITALIC);
    text('R', ans.step11[4][0] - 13, ans.step11[4][1] - 22);
    textSize(14);
    textStyle(NORMAL);
    text('5', ans.step11[4][0] - 1, ans.step11[4][1] - 17);
    pop();
  }

  // Extract labels and points
  push();
  fill(g.part5);
  noStroke();
  ellipse(ans.step11[1][0], ans.step11[1][1], 14);
  if (ans.step11.length == 5) {
    ellipse(ans.step11[3][0], ans.step11[3][1], 14);
  }
  pop();
  push();
  stroke(g.part5);
  fill(255);
  ellipse(ans.step11[1][0], ans.step11[1][1] - 27, 30);
  noStroke();
  fill(g.part5);
  textSize(18);
  textStyle(ITALIC);
  text('E', ans.step11[1][0] - 8, ans.step11[1][1] - 22);
  textSize(14);
  textStyle(NORMAL);
  text('4', ans.step11[1][0] + 3, ans.step11[1][1] - 17);
  pop();
  if (ans.step11.length == 5) {
    push();
    stroke(g.part5);
    fill(255);
    ellipse(ans.step11[3][0], ans.step11[3][1] - 27, 30);
    noStroke();
    fill(g.part5);
    textSize(18);
    textStyle(ITALIC);
    text('E', ans.step11[3][0] - 9, ans.step11[3][1] - 22);
    textSize(14);
    textStyle(NORMAL);
    text('5', ans.step11[3][0] + 3, ans.step11[3][1] - 17);
    pop();
  }

  // Labels for the stages
  let x1, x2, y1, y2;
  let m, b;
  let x, y;

  // E1 to R1
  x1 = ans.step5[0];
  y1 = ans.step5[1];
  x2 = ans.step7[0][0];
  y2 = ans.step7[0][1];
  m = (y2 - y1) / (x2 - x1);
  b = y2 - m * x2;
  x = x1 + 20;
  y = m * x + b;
  push();
  noStroke();
  rect(x, y - 8, 16, 16);
  textSize(18);
  text('1', x + 3, y + 6)
  pop();

  // E2 to R2
  x1 = ans.step8[0][0];
  y1 = ans.step8[0][1];
  x2 = ans.step9[0][0];
  y2 = ans.step9[0][1];
  m = (y2 - y1) / (x2 - x1);
  b = y2 - m * x2;
  x = x1 + 30;
  y = m * x + b;
  push();
  noStroke();
  rect(x, y - 8, 16, 16);
  textSize(18);
  text('2', x + 3, y + 6);
  pop();

  // E3 to R3
  x1 = ans.step10[0][0];
  y1 = ans.step10[0][1];
  x2 = ans.step11[0][0];
  y2 = ans.step11[0][1];
  m = (y2 - y1) / (x2 - x1);
  b = y2 - m * x2;
  x = x1 + 80;
  y = m * x + b;
  push();
  noStroke();
  rect(x, y - 8, 16, 16);
  textSize(18);
  text('3', x + 3, y + 6);
  pop();

  // E4 to R4
  x1 = ans.step11[1][0];
  y1 = ans.step11[1][1];
  x2 = ans.step11[2][0];
  y2 = ans.step11[2][1];
  m = (y2 - y1) / (x2 - x1);
  b = y2 - m * x2;
  x = x1 + 150;
  y = m * x + b;
  push();
  noStroke();
  rect(x, y - 8, 16, 16);
  textSize(18);
  text('4', x + 3, y + 6);
  pop();

  if (ans.step11.length == 5) {
    x1 = ans.step11[3][0];
    y1 = ans.step11[3][1];
    x2 = ans.step11[4][0];
    y2 = ans.step11[4][1];
    m = (y2 - y1) / (x2 - x1);
    b = y2 - m * x2;
    x = x1 + 200;
    y = m * x + b;
    push();
    noStroke();
    rect(x, y - 8, 16, 16);
    textSize(18);
    text('5', x + 3, y + 6);
    pop();
  }

}



function startingPoints() {
  g.points[0].x = g.xtip;
  g.points[0].y = g.ytip + 94;

}

function questionOrHintDisplay() {
  let x = 20;
  let y = 30;
  let x2 = 70;
  let y2 = 120;
  let temp;
  push();
  noStroke();
  textSize(20);
  switch (g.problemPart) {
    case (0):
      if (!g.hintTruth) {
        text('Step 1: move the feed point     to the correction location, then submit answer', x, y);
        push();
        textStyle(ITALIC);
        text('F', x + 252, y);
        pop();
      } else {
        text('Hint: read the compositions on the axes', x, y);
      }
      push();
      textSize(22);
      text('feed mass fractions', x2 - 5, y2 - 5);
      stroke(0);
      strokeWeight(1.5);
      rect(x2 + 20, y2, 135, 80);
      textSize(20);
      noStroke();
      fill(g.blue);
      text('solute = ' + ans.step1[0], x2 + 30, y2 + 20);
      fill(g.red);
      text('solvent = ' + ans.step1[1], x2 + 26, y2 + 45);
      fill(g.green);
      text('carrier = ' + ans.step1[2], x2 + 30, y2 + 70);
      pop();
      break;
    case (1):
      if (!g.hintTruth) {
        text('Step 2: move the solvent point     to the correct location, then submit answer', x, y);
        push();
        textStyle(ITALIC);
        text('S', x + 275, y);
        pop();
      } else {
        text('Hint: read the compositions on the axes', x, y);
      }
      push();
      textSize(22);
      text('solvent mass fractions', x2 - 14, y2 - 5);
      stroke(0);
      strokeWeight(1.5);
      rect(x2 + 20, y2, 135, 80);
      textSize(20);
      noStroke();
      fill(g.blue);
      text('solute = ' + ans.step2[0], x2 + 40, y2 + 20);
      fill(g.red);
      text('solvent = ' + ans.step2[1], x2 + 36, y2 + 45);
      fill(g.green);
      text('carrier = ' + ans.step2[2], x2 + 39, y2 + 70);
      pop();
      break;
    case (2):
      if (!g.hintTruth) {
        text('Step 3: move the desired raffinate point      to the correct location, then submit answer', x, y);
        push();
        textStyle(ITALIC);
        text('R', x + 353, y);
        textSize(15);
        text('N', x + 366.5, y + 4);
        pop();
      } else {
        text('Hint: read the compositions on the axes', x, y);
      }
      push();
      textSize(22);
      text('raffinate mass fractions', x2 - 14, y2 - 5);
      stroke(0);
      strokeWeight(1.5);
      rect(x2 + 20, y2, 135, 80);
      textSize(20);
      noStroke();
      temp = [0, 0, 0];
      temp[0] = (Math.round(ans.step3[0] * 100) / 100).toFixed(2);
      temp[1] = (Math.round(ans.step3[1] * 100) / 100).toFixed(2);
      temp[2] = (1 - temp[0] - temp[1]).toFixed(2);
      fill(g.blue);
      text('solute = ' + temp[0], x2 + 30, y2 + 20);
      fill(g.red);
      text('solvent = ' + temp[1], x2 + 26, y2 + 45);
      fill(g.green);
      text('carrier = ' + temp[2], x2 + 30, y2 + 70);
      pop();
      break;
    case (3):
      if (!g.hintTruth) {
        text('Step 4: for the indicated flow rates (       ), use mass balances to determine the ', x, y);
        text('mixing point composition    , then submit answer', x + 70, y + 25);
        push();
        textStyle(ITALIC);
        text('F, S', x + 317, y);
        text('M', x + 295, y + 25);
        pop();
      } else {
        text('Hint: use the lever rule', x, y);
      }
      push();
      textSize(22);
      text('flow rates', x2 + 550, y2 - 7);
      stroke(0);
      strokeWeight(1.5);
      rect(x2 + 20, y2, 135, 80);
      rect(x2 + 527, y2, 140, 60);
      textSize(20);
      noStroke();
      push();
      textStyle(ITALIC);
      text('F', x2 + 534, y2 + 22);
      fill(g.red);
      text('S', x2 + 534, y2 + 49);
      textStyle(NORMAL);
      text(' = ' + ans.step4[4] + ' kg/h', x2 + 549, y2 + 49);
      fill(0);
      text(' = ' + ans.step4[3] + ' kg/h', x2 + 549, y2 + 22);
      pop();
      temp = [0, 0, 0];
      temp[0] = (Math.round(ans.step4[0] * 100) / 100).toFixed(2);
      temp[1] = (Math.round(ans.step4[1] * 100) / 100).toFixed(2);
      temp[2] = (1 - temp[0] - temp[1]).toFixed(2);
      fill(g.blue);
      text('solute = ' + temp[0], x2 + 30, y2 + 20);
      fill(g.red);
      text('solvent = ' + temp[1], x2 + 26, y2 + 45);
      fill(g.green);
      text('carrier = ' + temp[2], x2 + 30, y2 + 70);
      pop();
      break;
    case (4):
      if (!g.hintTruth) {
        text('Step 5: move the first extract point      to the correct location, then submit answer', x, y)
        push();
        textStyle(ITALIC);
        text('E', x + 310, y);
        textSize(15);
        textStyle(NORMAL);
        text('1', x + 323, y + 4);
        pop();
      } else {
        text('Hint: use mass balance for two exit streams (     ,     )', x, y);
        push();
        textStyle(ITALIC);
        text('R    E', x + 400, y);
        textSize(15);
        text('N', x + 414, y + 4);
        textStyle(NORMAL);
        text('1', x + 450, y + 4);
        pop();
      }
      break;
    case (5):
      if (!g.hintTruth) {
        text('Step 6: move the operating point     to the correct location, then submit answer', x, y);
        push();
        textStyle(ITALIC);
        text('P', x + 296, y);
        pop();
      } else {
        text('Hint: the operating point is at the intersection of a line through    and      and a line', x, y);
        text('through    and   ', x + 48, y + 25);
        push();
        textStyle(ITALIC);
        text('F', x + 549, y);
        text('E', x + 607, y);
        text('S', x + 119, y + 25);
        text('R', x + 177, y + 25);
        textSize(15);
        text('N', x + 191, y + 29);
        textStyle(NORMAL);
        text('1', x + 620, y + 4);
        pop();
      }
      break;
    case (6):
      if (!g.hintTruth) {
        text('Step 7: move the first raffinate point      to the correct location, then submit answer', x, y);
        push();
        textStyle(ITALIC);
        text('R', x + 323, y);
        textSize(15);
        textStyle(NORMAL);
        text('1', x + 336, y + 4);
        pop();
      } else {
        text('Hint: follow the tie line to the other side of the phase boundary', x, y);
      }
      break;
    case (7):
      if (!g.hintTruth) {
        text('Step 8: move the second extract point      to the correct location, then submit answer', x, y)
        push();
        textStyle(ITALIC);
        text('E', x + 342, y);
        textSize(15);
        textStyle(NORMAL);
        text('2', x + 355, y + 4);
        pop();
      } else {
        text('Hint: draw a line to the operating point', x, y);
      }
      break;
    case (8):
      if (!g.hintTruth) {
        text('Step 9: move the second raffinate point      to the correct location, then submit answer', x, y);
        push();
        textStyle(ITALIC);
        text('R', x + 354, y);
        textSize(15);
        textStyle(NORMAL);
        text('2', x + 368, y + 4);
        pop();
      } else {
        text('Hint: follow the tie line to the other side of the phase boundary', x, y);
      }
      break;
    case (9):
      if (!g.hintTruth) {
        text('Step 5: move the third extract point      to the correct location, then submit answer', x, y)
        push();
        textStyle(ITALIC);
        text('E', x + 316, y);
        textSize(15);
        textStyle(NORMAL);
        text('3', x + 329, y + 4);
        pop();
      } else {
        text('Hint: draw a line to the operating point', x, y);
      }
      break;
    case (10):
      if (ans.step11.length == 5) {
        text('Finished, five stages needed', x, y);
      } else {
        text('Finished, four stages needed', x, y);
      }
      break;
  }
  pop();
}

function triSetup() {
  g.xtip = 450;
  g.ytip = 100;
  g.dy = 375;
  g.dx = g.dy * Math.tan(radians(g.angle / 2));

  g.R[0] = g.dy / g.dx;
  g.R[1] = g.ytip - g.R[0] * g.xtip;

  g.L[0] = -g.dy / g.dx;
  g.L[1] = g.ytip - g.L[0] * g.xtip;
}

function definePhaseCurve() {
  let x1, x2, x3;
  let y1, y2, y3;

  y1 = 0;
  y3 = 0;
  y2 = .3 + Math.random() * .1;

  x1 = .02 + Math.random() * .05;
  x2 = .45 + Math.random() * .1;
  x3 = .85 + Math.random() * .13;

  // Equation to solve
  // ax1^2 + bx1 + c = y1
  // ax2^2 + bx2 + c = y2
  // ax3^2 + bx3 + c = y3

  // Solve with least-squares closed form solution
  // (A^TA)^-1A^Tb (in the form Ax = b)

  // Define A matrix and Atranspose
  let A = [
    [x1 ** 2, x1, 1],
    [x2 ** 2, x2, 1],
    [x3 ** 2, x3, 1]
  ];
  let AT = math.transpose(A);

  // Define AT*A
  let t1 = x1 ** 3 + x2 ** 3 + x3 ** 3; // Repeated twice
  let t2 = x1 ** 2 + x2 ** 2 + x3 ** 2; // Repeated thrice
  let t3 = x1 + x2 + x3; // Repeated twice
  let ATA = [
    [x1 ** 4 + x2 ** 4 + x3 ** 4, t1, t2],
    [t1, t2, t3],
    [t2, t3, 3]
  ];
  let ATAinv = math.inv(ATA);

  // To help solve (ATA)^-1 * AT
  let row1, row2, row3;
  let col1, col2, col3;

  row1 = ATAinv[0];
  row2 = ATAinv[1];
  row3 = ATAinv[2];
  col1 = [AT[0][0], AT[1][0], AT[2][0]];
  col2 = [AT[0][1], AT[1][1], AT[2][1]];
  col3 = [AT[0][2], AT[1][2], AT[2][2]];

  // b vec
  let bvec = [y1, y2, y3];

  // (ATA)^-1 * AT
  let last = [
    [math.dot(row1, col1), math.dot(row1, col2), math.dot(row1, col3)],
    [math.dot(row2, col1), math.dot(row2, col2), math.dot(row2, col3)],
    [math.dot(row3, col1), math.dot(row3, col2), math.dot(row3, col3)]
  ];
  let ans = [math.dot(last[0], bvec), math.dot(last[1], bvec), math.dot(last[2], bvec)];

  g.phaseConstants[0] = ans[0];
  g.phaseConstants[1] = ans[1];
  g.phaseConstants[2] = ans[2];
  g.phaseLims[0] = x1;
  g.phaseLims[1] = x3;
  g.yVals[0] = y1;
  g.yVals[1] = y2;
  g.yVals[2] = y3;
}

function defineTieLines() {
  g.tiepx = [];
  g.tieslopes = [];
  g.tiebs = [];

  let y = g.yVals[1];
  let a, b, c;
  let x1, x2, y1, y2;
  let x1px, x2px, y1px, y2px;

  // Line 1
  y1 = (.02 + Math.random() * .03) * y;
  y2 = (.06 + Math.random() * .04) * y;
  y1px = map(y1, 0, Math.sqrt(3) / 2, g.ytip + g.dy, g.ytip);
  y2px = map(y2, 0, Math.sqrt(3) / 2, g.ytip + g.dy, g.ytip);
  // x1
  a = g.phaseConstants[0];
  b = g.phaseConstants[1];
  c = g.phaseConstants[2] - y1;
  x1 = (-b + Math.sqrt(b ** 2 - 4 * a * c)) / (2 * a);
  x1px = map(x1, 0, 1, g.xtip - g.dx, g.xtip + g.dx);
  // x2
  c = g.phaseConstants[2] - y2;
  x2 = (-b - Math.sqrt(b ** 2 - 4 * a * c)) / (2 * a);
  x2px = map(x2, 0, 1, g.xtip - g.dx, g.xtip + g.dx);
  g.tiepx.push([x1px, x2px, y1px, y2px]);

  // Line 2
  y1 = (.15 + Math.random() * .05) * y;
  y2 = (.25 + Math.random() * .05) * y;
  y1px = map(y1, 0, Math.sqrt(3) / 2, g.ytip + g.dy, g.ytip);
  y2px = map(y2, 0, Math.sqrt(3) / 2, g.ytip + g.dy, g.ytip);
  // x1
  c = g.phaseConstants[2] - y1;
  x1 = (-b + Math.sqrt(b ** 2 - 4 * a * c)) / (2 * a);
  x1px = map(x1, 0, 1, g.xtip - g.dx, g.xtip + g.dx);
  // x2
  c = g.phaseConstants[2] - y2;
  x2 = (-b - Math.sqrt(b ** 2 - 4 * a * c)) / (2 * a);
  x2px = map(x2, 0, 1, g.xtip - g.dx, g.xtip + g.dx);
  g.tiepx.push([x1px, x2px, y1px, y2px]);

  // Line 3
  y1 = (.35 + Math.random() * .05) * y;
  y2 = (.5 + Math.random() * .05) * y;
  y1px = map(y1, 0, Math.sqrt(3) / 2, g.ytip + g.dy, g.ytip);
  y2px = map(y2, 0, Math.sqrt(3) / 2, g.ytip + g.dy, g.ytip);
  // x1
  c = g.phaseConstants[2] - y1;
  x1 = (-b + Math.sqrt(b ** 2 - 4 * a * c)) / (2 * a);
  x1px = map(x1, 0, 1, g.xtip - g.dx, g.xtip + g.dx);
  // x2
  c = g.phaseConstants[2] - y2;
  x2 = (-b - Math.sqrt(b ** 2 - 4 * a * c)) / (2 * a);
  x2px = map(x2, 0, 1, g.xtip - g.dx, g.xtip + g.dx);
  g.tiepx.push([x1px, x2px, y1px, y2px]);

  // Line 4
  y1 = (.72 + Math.random() * .05) * y;
  y2 = (.8 + Math.random() * .1) * y;
  y1px = map(y1, 0, Math.sqrt(3) / 2, g.ytip + g.dy, g.ytip);
  y2px = map(y2, 0, Math.sqrt(3) / 2, g.ytip + g.dy, g.ytip);
  // x1
  c = g.phaseConstants[2] - y1;
  x1 = (-b + Math.sqrt(b ** 2 - 4 * a * c)) / (2 * a);
  x1px = map(x1, 0, 1, g.xtip - g.dx, g.xtip + g.dx);
  // x2
  c = g.phaseConstants[2] - y2;
  x2 = (-b - Math.sqrt(b ** 2 - 4 * a * c)) / (2 * a);
  x2px = map(x2, 0, 1, g.xtip - g.dx, g.xtip + g.dx);
  g.tiepx.push([x1px, x2px, y1px, y2px]);

  // Define slopes and vertical shifts of tie lines
  // First add in bottom of the phase curve
  c = g.phaseConstants[2];
  x1 = g.phaseLims[1];
  x1px = map(x1, 0, 1, g.xtip + g.dx, g.xtip - g.dx);
  x2 = g.phaseLims[0];
  x2px = map(x2, 0, 1, g.xtip + g.dx, g.xtip - g.dx);
  y1px = map(a * x1 ** 2 + b * x1 + c, 0, Math.sqrt(3) / 2, g.ytip + g.dy, g.ytip);
  y2px = map(a * x2 ** 2 + b * x2 + c, 0, Math.sqrt(3) / 2, g.ytip + g.dy, g.ytip);
  g.tiepx.splice(0, 0, [x1px, x2px, y1px, y2px]);

  for (let i = 0; i < g.tiepx.length; i++) {
    let m = (g.tiepx[i][3] - g.tiepx[i][2]) / (g.tiepx[i][1] - g.tiepx[i][0]);
    let b = (g.tiepx[i][2] - m * g.tiepx[i][0]);
    g.tieslopes.push(m);
    g.tiebs.push(b);
  }
}

function generateAnswers() {
  // Step 1
  ans.step1[0] = (Math.round((46 + Math.random() * 6)) / 100).toFixed(2);
  ans.step1[2] = (Math.round((35 + Math.random() * 11)) / 100).toFixed(2);
  ans.step1[1] = (1 - ans.step1[0] - ans.step1[2]).toFixed(2);

  // Step 3
  let xRN = .99 * g.phaseLims[1];
  let yRN = (g.phaseConstants[0] * xRN ** 2 + g.phaseConstants[1] * xRN + g.phaseConstants[2]);
  ans.step3[0] = yRN;
  ans.step3[2] = xRN;
  ans.step3[1] = (1 - yRN - ans.step3[2]);

  // Step 4
  ans.step4[3] = Math.round(1000 + Math.random() * 500);
  ans.step4[4] = Math.round(1500 + Math.random() * 500);
  ans.step4[5] = ans.step4[3] + ans.step4[4];
  // solve mixing point with lever rule
  let xS, yS, xF, yF, xtemp, dx, dy;
  yF = map(ans.step1[0], 0, 1, g.ytip + g.dy, g.ytip);
  yS = g.ytip + g.dy;
  xS = g.xtip - g.dx;

  xtemp = map(ans.step1[1], 0, 1, g.xtip + g.dx, g.xtip - g.dx);
  dy = g.ytip + g.dy - yF;
  dx = dy / Math.tan(radians(g.angle));
  xF = xtemp - dx;

  let FS = dist(xF, yF, xS, yS);
  let SoverF = ans.step4[4] / ans.step4[3];
  let MSconstant = 1 + SoverF;
  let MS = FS / MSconstant; // Solvent to mixing point

  // Need unit vector now
  dx = xF - (g.xtip - g.dx);
  dy = yF - (g.ytip + g.dy);
  let mag = Math.sqrt(dx ** 2 + dy ** 2);
  let unit = [dx / mag, dy / mag];

  g.temp[0] = unit[0];
  g.temp[1] = unit[1];
  let xM = xS + unit[0] * MS; // in pixels
  let yM = yS + unit[1] * MS; // in pixels
  ans.step4[0] = map(yM, g.ytip + g.dy, g.ytip, 0, 1);
  dy = g.ytip + g.dy - yM;
  dx = dy / Math.tan(radians(g.angle));
  ans.step4[1] = map(xM + dx, g.xtip + g.dx, g.xtip - g.dx, 0, 1);
  ans.step4[2] = 1 - ans.step4[1] - ans.step4[0];

  // Step 5 solving for the first extract point
  // Generate points that make up the phase array
  let phasePx = [];
  let coeffs = g.phaseConstants;
  dx = (g.phaseLims[1] - g.phaseLims[0]) / 100;
  push();
  for (let i = g.phaseLims[0]; i <= g.phaseLims[1]; i += dx) {
    x = map(i, 0, 1, g.xtip - g.dx, g.xtip + g.dx);
    y = map(coeffs[0] * i ** 2 + coeffs[1] * i + coeffs[2], 0, Math.sqrt(3) / 2, g.ytip + g.dy, g.ytip);
    phasePx.push([x, y]);
  }
  x = map(g.phaseLims[1], 0, 1, g.xtip - g.dx, g.xtip + g.dx);
  y = map(coeffs[0] * g.phaseLims[1] ** 2 + coeffs[1] * g.phaseLims[1] + coeffs[2], 0, Math.sqrt(3) / 2, g.ytip + g.dy, g.ytip);
  phasePx.push([x, y]);

  // Get pixel locations of xRN and yRN
  let xRNpx, yRNpx;
  yRNpx = map(yRN, 0, 1, g.ytip + g.dy, g.ytip);
  xRNpx = map(xRN, 0, 1, g.xtip - g.dx, g.xtip + g.dx);
  ans.step3px[0] = xRNpx;
  ans.step3px[1] = yRNpx;

  // Equation of line that passes through M and Rn
  let x1, y1, x2, y2, m1, b1, m2, b2;
  x1 = xM;
  y1 = yM;
  x2 = xRNpx;
  y2 = yRNpx;
  m1 = (y2 - y1) / (x2 - x1);
  b1 = y1 - m1 * x1;

  let yL, yU, yC, yUU; // Lower and upper bounds and y current. yUU = yupperupper which helps with an issue when the line passes through one of the points that make up the phase curve
  for (let i = 0; i < phasePx.length - 2; i++) {
    yL = phasePx[i][1];
    yU = phasePx[i + 1][1];
    yC = m1 * phasePx[i][0] + b1;
    yUU = phasePx[i + 2][1];

    if (yC <= yL && yC >= yU) {
      m2 = (yL - yU) / (phasePx[i][0] - phasePx[i + 1][0]);
      b2 = yL - m2 * phasePx[i][0];
      ans.step5[0] = (b2 - b1) / (m1 - m2);
      ans.step5[1] = m1 * ans.step5[0] + b1;
      break;
    } else if (yC <= yU && yC > yUU) {
      ans.step5[0] = phasePx[i + 1][0];
      ans.step5[1] = phasePx[i + 1][1];
      break;
    }
  }

  // Step 6 solving for the operating point
  // At the intersection of E1F and RnS
  // Line 1 - F through E1
  let xe1 = ans.step5[0];
  let ye1 = ans.step5[1];
  m1 = (yF - ye1) / (xF - xe1);
  b1 = yF - m1 * xF;

  // Line 2- Rn through S
  m2 = (yRNpx - (g.ytip + g.dy)) / (xRNpx - (g.xtip - g.dx));
  b2 = yRNpx - m2 * xRNpx;
  ans.step6[0] = (b2 - b1) / (m1 - m2);
  ans.step6[1] = m1 * ans.step6[0] + b1;

  // Step 7 R1
  ans.step7 = [];
  ans.step7.push(nextRaffinate(ans.step5[0], ans.step5[1]));

  // Step 8 E2
  ans.step8 = [];
  ans.step8.push(nextExtract(ans.step7[0][0], ans.step7[0][1], phasePx));

  // Step 9 R2
  ans.step9 = [];
  ans.step9.push(nextRaffinate(ans.step8[0][0], ans.step8[0][1]));
  ans.step9[0][0] = ans.step9[0][0] - 2;

  // Step 10 E3
  ans.step10 = [];
  ans.step10.push(nextExtract(ans.step9[0][0], ans.step9[0][1], phasePx));

  // Step 11 R3, E4, R4, E5, and R5
  ans.step11 = [];
  ans.step11.push(nextRaffinate(ans.step10[0][0], ans.step10[0][1])); // R3
  ans.step11.push(nextExtract(ans.step11[0][0], ans.step11[0][1], phasePx)); // E4
  ans.step11.push(nextRaffinate(ans.step11[1][0], ans.step11[1][1])); // R4
  if (ans.step11[2][0] > xRNpx || ans.step11[2][0] < xRNpx) {
    let m1 = (ans.step11[0][1] - ans.step3px[1]) / (ans.step11[0][0] - ans.step3px[0]);
    let b1 = ans.step3px[1] - m1 * ans.step3px[0];
    ans.step11[2][0] = (ans.step11[2][1] - b1) / m1 + 2;
  }
  if (yRNpx - ans.step11[2][1] > 5) {
    ans.step11.push(nextExtract(ans.step11[2][0], ans.step11[2][1], phasePx)); // E5
    ans.step11.push([ans.step3px[0], ans.step3px[1]]); // R5
  }
}

function nextRaffinate(ex, ey) {
  let yVals = new Array(5);
  for (let i = 0; i < g.tieslopes.length; i++) {
    yVals[i] = g.tieslopes[i] * ex + g.tiebs[i];
  }

  let dY, dC, mx, xR, yR, bx;
  for (let i = 0; i < g.tieslopes.length - 1; i++) {

    if (ey < yVals[i] && ey > yVals[i + 1]) {
      dY = yVals[i] - yVals[i + 1];
      dC = yVals[i] - ey;
      mx = g.tieslopes[i] * (1 - dC / dY) + g.tieslopes[i + 1] * (dC / dY);
      bx = ey - mx * ex;
      xR = g.tiepx[i][1] * (1 - dC / dY) + g.tiepx[i + 1][1] * (dC / dY);
      yR = mx * xR + bx;
    }
  }
  return ([xR + 3, yR]);
}

function nextExtract(rx, ry, phasepx) {
  let m1, b1, m2, b2;

  m1 = (ry - ans.step6[1]) / (rx - ans.step6[0]);
  b1 = ry - m1 * rx;

  let yL, yU, yC, yUU;
  let xe, ye;
  for (let i = 0; i < phasepx.length - 2; i++) {
    yL = phasepx[i][1];
    yU = phasepx[i + 1][1];
    yC = m1 * phasepx[i][0] + b1;
    yUU = phasepx[i + 2][1];
    if (yC <= yL && yC >= yU) {
      m2 = (yL - yU) / (phasepx[i][0] - phasepx[i + 1][0]);
      b2 = yL - m2 * phasepx[i][0];
      xe = (b2 - b1) / (m1 - m2);
      ye = m1 * xe + b1;
    } else if (yC <= yU && yC > yUU) {
      xe = phasepx[i + 1][0];
      ye = phasepx[i + 1][1];
    }
  }
  return ([xe, ye]);
}