//import { calcAll } from "./calcs.js";
const p5container = document.getElementById("p5-container");
const positiveSliderWrapper = document.getElementById("positive-slider-wrapper");
const negativeSliderWrapper = document.getElementById("negative-slider-wrapper");

// This function is used to scale the canvas based on the size of the container
window.relativeSize = () => p5container.offsetWidth / 1280;

function resize() {
  // Here I am reassigning the width and height of the canvas to a static value of 1280x720,
  // even though the actual canvas size is based on the size of the #p5-container element.
  // So you can effectively treat the canvas like it is 1280x720, even though it will scale to fit the screen.
  state.width;
  state.height;

  scale(relativeSize());
}

// Moved outside of the selection block - Do not call setup() more than once.
// So this should never be inside a conditional statement.
window.setup = function () {
  createCanvas(p5container.offsetWidth, p5container.offsetHeight).parent(p5container);
};

window.draw = function () {
  state.drawTimer++;
  /* console.log("drawing"); */
  //control slider variables here so that it checks each frame if the selection is "positive" or "negative"
  const deviationSelectionElement = document.querySelector('input[name="deviation"]:checked');
  state.deviationSelection = deviationSelectionElement.value;

  const plotSelectionElement = document.querySelector('input[name="plot"]:checked');
  state.plotSelection = plotSelectionElement.value;

  if (state.deviationSelection == "positive") {
    /* console.log("im positve"); */
    positiveSliderWrapper.style.display = "flex";
    negativeSliderWrapper.style.display = "none";
  } else if (state.deviationSelection == "negative") {
    /* console.log("im negative"); */
    positiveSliderWrapper.style.display = "none";
    negativeSliderWrapper.style.display = "flex";
  }
  resize();
  background(255);
  //calcAll();

  if (state.plotSelection === "P-x-y") {
    drawPxyLeftGraph();
    drawPxyRightGraph();
  } else if (state.plotSelection === "T-x-y") {
    drawTxyLeftGraph();
    drawTxyRightGraph();
  }
};

window.windowResized = () => {
  resizeCanvas(p5container.offsetWidth, p5container.offsetHeight);
};

function drawPxyLeftGraph() {
  push();

  //Border of graph
  rectMode(CENTER);
  stroke("black");
  strokeWeight(1);
  rect(state.graphCenterX, state.graphCenterY, state.graphWidth, state.graphHeight);

  push();

  //x-axis label
  textAlign(CENTER, CENTER);
  textSize(32);
  noStroke();
  fill("black");
  text("mole fraction of component 1", state.graphCenterX, state.graphCenterY + state.graphHeight / 2 + 64);

  //y-axis label
  push();
  rotate(3 * HALF_PI);
  text("pressure (bar)", -state.graphCenterY, state.graphCenterX - state.graphWidth / 2 - 86);
  pop();

  //on graph labels
  fill("grey");
  text("liquid", state.graphCenterX - 280, state.graphCenterY - 225);
  text("vapor", state.graphCenterX + 280, state.graphCenterY + 225);

  fill("black");
  text("𝘛 = " + 110 + " °C", state.graphCenterX, state.graphCenterY - 320);
  text("𝘗 = " + " bar", state.graphCenterX + 655, state.graphCenterY - 320);

  pop();

  //Tick marks
  if (state.deviationSelection == "positive") {
    //x-marks
    for (let i = state.graphCenterX - state.graphWidth / 2; i <= state.graphCenterX + state.graphWidth / 2; i += state.graphWidth / 5) {
      stroke("black");
      strokeWeight(1);
      line(i, state.graphCenterY + state.graphHeight / 2, i, state.graphCenterY + state.graphHeight / 2 - 10);
      line(i, state.graphCenterY - state.graphHeight / 2, i, state.graphCenterY - state.graphHeight / 2 + 10);

      push();

      textAlign(CENTER, CENTER);
      textSize(32);
      noStroke();
      fill("black");
      text(((i - (state.graphCenterX - state.graphWidth / 2)) / state.graphWidth).toFixed(1), i, state.graphCenterY + state.graphHeight / 2 + 24);

      pop();
    }

    for (let i = state.graphCenterX - state.graphWidth / 2; i < state.graphCenterX + state.graphWidth / 2; i += state.graphWidth / 20) {
      stroke("black");
      strokeWeight(1);
      line(i, state.graphCenterY + state.graphHeight / 2, i, state.graphCenterY + state.graphHeight / 2 - 5);
      line(i, state.graphCenterY - state.graphHeight / 2, i, state.graphCenterY - state.graphHeight / 2 + 5);
    }

    //y-axis
    for (
      let i = state.graphCenterY - state.graphHeight / 2 + state.graphHeight / 9;
      i < state.graphCenterY + state.graphHeight / 2;
      i += state.graphHeight / (18 / 5)
    ) {
      stroke("black");
      strokeWeight(1);
      line(state.graphCenterX - state.graphWidth / 2, i, state.graphCenterX - state.graphWidth / 2 + 10, i);
      line(state.graphCenterX + state.graphWidth / 2, i, state.graphCenterX + state.graphWidth / 2 - 10, i);

      //Normalized i

      let N_i = (
        5 -
        (i - (state.graphCenterY - state.graphHeight / 2 + state.graphHeight / 9)) /
          (state.graphHeight - state.graphHeight / 2 - (state.graphCenterY - state.graphHeight / 2 + state.graphHeight / 18))
      ).toFixed(1);
      push();

      textAlign(CENTER, CENTER);
      textSize(32);
      noStroke();
      fill("black");
      text(N_i / 2, state.graphCenterX - state.graphWidth / 2 - 32, i);
      pop();
    }
    for (let i = state.graphCenterY - state.graphHeight / 2; i < state.graphCenterY + state.graphHeight / 2 - 1; i += state.graphHeight / 18) {
      stroke("black");
      strokeWeight(1);
      line(state.graphCenterX - state.graphWidth / 2, i, state.graphCenterX - state.graphWidth / 2 + 5, i);
      line(state.graphCenterX + state.graphWidth / 2, i, state.graphCenterX + state.graphWidth / 2 - 5, i);
    }
  } else if (state.deviationSelection == "negative") {
    //x-marks
    for (let i = state.graphCenterX - state.graphWidth / 2; i <= state.graphCenterX + state.graphWidth / 2; i += state.graphWidth / 5) {
      stroke("black");
      strokeWeight(1);
      line(i, state.graphCenterY + state.graphHeight / 2, i, state.graphCenterY + state.graphHeight / 2 - 10);
      line(i, state.graphCenterY - state.graphHeight / 2, i, state.graphCenterY - state.graphHeight / 2 + 10);

      push();
      textAlign(CENTER, CENTER);
      textSize(32);
      noStroke();
      fill("black");
      text(((i - (state.graphCenterX - state.graphWidth / 2)) / state.graphWidth).toFixed(1), i, state.graphCenterY + state.graphHeight / 2 + 24);
      pop();
    }

    for (let i = state.graphCenterX - state.graphWidth / 2; i < state.graphCenterX + state.graphWidth / 2; i += state.graphWidth / 20) {
      stroke("black");
      strokeWeight(1);
      line(i, state.graphCenterY + state.graphHeight / 2, i, state.graphCenterY + state.graphHeight / 2 - 5);
      line(i, state.graphCenterY - state.graphHeight / 2, i, state.graphCenterY - state.graphHeight / 2 + 5);
    }

    //y-axis
    for (
      let i = state.graphCenterY - state.graphHeight / 2 + state.graphHeight / 16;
      i < state.graphCenterY + state.graphHeight / 2;
      i += state.graphHeight / 8
    ) {
      stroke("black");
      strokeWeight(1);
      line(state.graphCenterX - state.graphWidth / 2, i, state.graphCenterX - state.graphWidth / 2 + 10, i);
      line(state.graphCenterX + state.graphWidth / 2, i, state.graphCenterX + state.graphWidth / 2 - 10, i);

      //Normalized i

      let N_i = (0.6 + (8 - (i - (state.graphCenterY - state.graphHeight / 2 + state.graphHeight / 16)) / (state.graphHeight / 8)) * 0.2).toFixed(1);

      push();

      textAlign(CENTER, CENTER);
      textSize(32);
      noStroke();
      fill("black");
      text(N_i, state.graphCenterX - state.graphWidth / 2 - 32, i);
      pop();
    }
    for (let i = state.graphCenterY - state.graphHeight / 2; i < state.graphCenterY + state.graphHeight / 2 - 1; i += state.graphHeight / 32) {
      stroke("black");
      strokeWeight(1);
      line(state.graphCenterX - state.graphWidth / 2, i, state.graphCenterX - state.graphWidth / 2 + 5, i);
      line(state.graphCenterX + state.graphWidth / 2, i, state.graphCenterX + state.graphWidth / 2 - 5, i);
    }
  }

  pop();
}

function drawPxyRightGraph() {
  push();

  rectMode(CENTER);
  stroke("black");
  strokeWeight(1);
  rect(state.graphCenterX + 660, state.graphCenterY, state.graphWidth / 4, state.graphHeight);

  pop();

  for (let i = state.graphCenterY - state.graphHeight / 2; i < state.graphCenterY + state.graphHeight / 2 - 1; i += state.graphHeight / 20) {
    push();
    stroke("black");
    strokeWeight(1);
    line(state.graphCenterX + 660 - state.graphWidth / 8, i, state.graphCenterX + 660 - state.graphWidth / 8 + 5, i);
    pop();
  }

  for (
    let i = state.graphCenterY - state.graphHeight / 2 - state.graphHeight / 5;
    i <= state.graphCenterY + state.graphHeight / 2 - 1;
    i += state.graphHeight / 5
  ) {
    push();
    stroke("black");
    strokeWeight(1);
    line(state.graphCenterX + 660 - state.graphWidth / 8, i, state.graphCenterX + 660 - state.graphWidth / 8 + 10, i);
    pop();

    push();
    textAlign(CENTER, CENTER);
    textSize(32);
    noStroke();
    fill("black");
    text(
      (0.8 - (i - (state.graphCenterY - state.graphHeight / 2)) / state.graphHeight).toFixed(1),
      state.graphCenterX + 660 - state.graphWidth / 8 - 32,
      i + state.graphHeight / 5,
    );
    pop();
  }
}
function drawTxyLeftGraph() {
  push();

  //Border of graph
  rectMode(CENTER);
  stroke("black");
  strokeWeight(1);
  rect(state.graphCenterX, state.graphCenterY, state.graphWidth, state.graphHeight);

  push();

  textAlign(CENTER, CENTER);
  textSize(32);
  noStroke();
  fill("black");
  text("mole fraction of component 1", state.graphCenterX, state.graphCenterY + state.graphHeight / 2 + 64);

  push();
  rotate(3 * HALF_PI);
  text("temperature (°C)", -state.graphCenterY, state.graphCenterX - state.graphWidth / 2 - 86);
  pop();

  //on graph labels
  fill("grey");
  text("liquid", state.graphCenterX - 280, state.graphCenterY + 225);
  text("vapor", state.graphCenterX + 280, state.graphCenterY - 225);

  fill("black");
  text("𝘗 = " + 1.6 + " bar", state.graphCenterX, state.graphCenterY - 320);
  text("𝘛 = " + " °C", state.graphCenterX + 655, state.graphCenterY - 320);

  pop();

  //Tick marks
  if (state.deviationSelection == "positive") {
    //x-marks
    for (let i = state.graphCenterX - state.graphWidth / 2; i <= state.graphCenterX + state.graphWidth / 2; i += state.graphWidth / 5) {
      stroke("black");
      strokeWeight(1);
      line(i, state.graphCenterY + state.graphHeight / 2, i, state.graphCenterY + state.graphHeight / 2 - 10);
      line(i, state.graphCenterY - state.graphHeight / 2, i, state.graphCenterY - state.graphHeight / 2 + 10);

      push();

      textAlign(CENTER, CENTER);
      textSize(32);
      noStroke();
      fill("black");
      text(((i - (state.graphCenterX - state.graphWidth / 2)) / state.graphWidth).toFixed(1), i, state.graphCenterY + state.graphHeight / 2 + 24);

      pop();
    }

    for (let i = state.graphCenterX - state.graphWidth / 2; i < state.graphCenterX + state.graphWidth / 2; i += state.graphWidth / 20) {
      stroke("black");
      strokeWeight(1);
      line(i, state.graphCenterY + state.graphHeight / 2, i, state.graphCenterY + state.graphHeight / 2 - 5);
      line(i, state.graphCenterY - state.graphHeight / 2, i, state.graphCenterY - state.graphHeight / 2 + 5);
    }

    //y-axis
    for (let i = state.graphCenterY - state.graphHeight / 2; i <= state.graphCenterY + state.graphHeight / 2; i += state.graphHeight / 4) {
      stroke("black");
      strokeWeight(1);
      line(state.graphCenterX - state.graphWidth / 2, i, state.graphCenterX - state.graphWidth / 2 + 10, i);
      line(state.graphCenterX + state.graphWidth / 2, i, state.graphCenterX + state.graphWidth / 2 - 10, i);

      //Normalized i

      let N_i = 130 - (10 * (i - (state.graphCenterY - state.graphHeight / 2))) / (state.graphHeight / 4);
      push();

      textAlign(CENTER, CENTER);
      textSize(32);
      noStroke();
      fill("black");
      text(N_i, state.graphCenterX - state.graphWidth / 2 - 32, i);
      pop();
    }
    for (let i = state.graphCenterY - state.graphHeight / 2; i < state.graphCenterY + state.graphHeight / 2 - 1; i += state.graphHeight / 20) {
      stroke("black");
      strokeWeight(1);
      line(state.graphCenterX - state.graphWidth / 2, i, state.graphCenterX - state.graphWidth / 2 + 5, i);
      line(state.graphCenterX + state.graphWidth / 2, i, state.graphCenterX + state.graphWidth / 2 - 5, i);
    }
  } else if (state.deviationSelection == "negative") {
    //x-marks
    for (let i = state.graphCenterX - state.graphWidth / 2; i <= state.graphCenterX + state.graphWidth / 2; i += state.graphWidth / 5) {
      stroke("black");
      strokeWeight(1);
      line(i, state.graphCenterY + state.graphHeight / 2, i, state.graphCenterY + state.graphHeight / 2 - 10);
      line(i, state.graphCenterY - state.graphHeight / 2, i, state.graphCenterY - state.graphHeight / 2 + 10);

      push();
      textAlign(CENTER, CENTER);
      textSize(32);
      noStroke();
      fill("black");
      text(((i - (state.graphCenterX - state.graphWidth / 2)) / state.graphWidth).toFixed(1), i, state.graphCenterY + state.graphHeight / 2 + 24);
      pop();
    }

    for (let i = state.graphCenterX - state.graphWidth / 2; i < state.graphCenterX + state.graphWidth / 2; i += state.graphWidth / 20) {
      stroke("black");
      strokeWeight(1);
      line(i, state.graphCenterY + state.graphHeight / 2, i, state.graphCenterY + state.graphHeight / 2 - 5);
      line(i, state.graphCenterY - state.graphHeight / 2, i, state.graphCenterY - state.graphHeight / 2 + 5);
    }

    //y-axis
    for (let i = state.graphCenterY - state.graphHeight / 2; i <= state.graphCenterY + state.graphHeight / 2; i += state.graphHeight / 5) {
      stroke("black");
      strokeWeight(1);
      line(state.graphCenterX - state.graphWidth / 2, i, state.graphCenterX - state.graphWidth / 2 + 10, i);
      line(state.graphCenterX + state.graphWidth / 2, i, state.graphCenterX + state.graphWidth / 2 - 10, i);

      //Normalized i

      let N_i = 140 - (12.5 * (i - (state.graphCenterY - state.graphHeight / 2))) / (state.graphHeight / 4);
      push();

      textAlign(CENTER, CENTER);
      textSize(32);
      noStroke();
      fill("black");
      text(N_i, state.graphCenterX - state.graphWidth / 2 - 32, i);
      pop();
    }
    for (let i = state.graphCenterY - state.graphHeight / 2; i < state.graphCenterY + state.graphHeight / 2 - 1; i += state.graphHeight / 25) {
      stroke("black");
      strokeWeight(1);
      line(state.graphCenterX - state.graphWidth / 2, i, state.graphCenterX - state.graphWidth / 2 + 5, i);
      line(state.graphCenterX + state.graphWidth / 2, i, state.graphCenterX + state.graphWidth / 2 - 5, i);
    }
  }

  pop();
}

function drawTxyRightGraph() {
  push();

  rectMode(CENTER);
  stroke("black");
  strokeWeight(1);
  rect(state.graphCenterX + 660, state.graphCenterY, state.graphWidth / 4, state.graphHeight);

  pop();

  for (let i = state.graphCenterY - state.graphHeight / 2; i < state.graphCenterY + state.graphHeight / 2 - 1; i += state.graphHeight / 20) {
    push();
    stroke("black");
    strokeWeight(1);
    line(state.graphCenterX + 660 - state.graphWidth / 8, i, state.graphCenterX + 660 - state.graphWidth / 8 + 5, i);
    pop();
  }

  for (
    let i = state.graphCenterY - state.graphHeight / 2 - state.graphHeight / 5;
    i <= state.graphCenterY + state.graphHeight / 2 - 1;
    i += state.graphHeight / 5
  ) {
    push();
    stroke("black");
    strokeWeight(1);
    line(state.graphCenterX + 660 - state.graphWidth / 8, i, state.graphCenterX + 660 - state.graphWidth / 8 + 10, i);
    pop();

    push();
    textAlign(CENTER, CENTER);
    textSize(32);
    noStroke();
    fill("black");
    text(
      (0.8 - (i - (state.graphCenterY - state.graphHeight / 2)) / state.graphHeight).toFixed(1),
      state.graphCenterX + 660 - state.graphWidth / 8 - 32,
      i + state.graphHeight / 5,
    );
    pop();
  }
}
/* 
function drawAxesLabelsPxy() {
  push();

  let intervalV = 0;
  let intervalH = 0;

  // Vertical
  for (let i = state.distBY; i + 1 > state.distTY; i -= (state.distBY - state.distTY) / 5) {
    stroke("black");
    strokeWeight(2);
    line(state.distLX, i, state.distLX + 5, i);

    textAlign(CENTER);
    noStroke();
    fill("Black");
    textSize(24);

    let intervalVRound = intervalV.toFixed(1);
    text(intervalVRound, state.distLX - 24, i + 8);
    intervalV += 0.2;
  }

  for (let i = state.distBY; i + 1 > state.distTY; i -= (state.distBY - state.distTY) / 10) {
    stroke("black");
    strokeWeight(1);
    line(state.distLX, i, state.distLX + 5, i);
  }

  let divide = 4;

  if (0.34 * (3 / 4) < 1 - state.hTop - state.hMid) {
    divide = 4;
  }
  if (0.34 * (2 / 4) < 1 - state.hTop - state.hMid < 0.34 * (3 / 4)) {
    divide = 3;
  }
  if (0.07 < 1 - state.hTop - state.hMid < 0.34 * (2 / 4)) {
    divide = 2;
  }
  if (1 - state.hTop - state.hMid < 0.07) {
    divide = 1;
  }

  let divide2 = 4;

  if (0.34 * (3 / 4) < state.hMid) {
    divide2 = 4;
  }

  if (0.34 * (2 / 4) < state.hMid < 0.34 * (3 / 4)) {
    divide2 = 3;
  }

  if (0.05 < state.hMid < 0.34 * (2 / 4)) {
    divide2 = 2;
  }

  if (state.hMid < 0.05) {
    divide2 = 1;
  }

  let divide3 = 4;

  if (0.34 * (3 / 4) < state.hTop) {
    divide3 = 4;
  }

  if (0.34 * (2 / 4) < state.hTop < 0.34 * (3 / 4)) {
    divide3 = 3;
  }

  if (0.05 < state.hTop < 0.34 * (2 / 4)) {
    divide3 = 2;
  }

  if (state.hTop < 0.05) {
    divide3 = 1;
  }

  let h3 = state.hTop;
  let h2 = state.hMid;
  let h1 = 1 - state.hTop - state.hMid;

  function fluid1LineXOut(y) {
    return (
      ((state.distBY - y) / (state.distBY - state.distTY)) *
        ((state.muMid * state.muTop) / (h3 * state.muMid + h2 * state.muTop + h1 * state.muMid * state.muTop)) *
        (state.distRX - state.distLX) +
      state.distLX
    );
  }

  function fluid2LineXOut(y) {
    return (
      ((state.muTop * ((state.distBY - y) / (state.distBY - state.distTY) - h1 + h1 * state.muMid)) / (h3 * state.muMid + h2 * state.muTop + h1 * state.muMid * state.muTop)) *
        (state.distRX - state.distLX) +
      state.distLX
    );
  }

  function fluid3LineXOut(y) {
    return (
      ((state.muMid * ((state.distBY - y) / (state.distBY - state.distTY) - h1 - h2) + state.muTop * (h2 + h1 * state.muMid)) /
        (h3 * state.muMid + h2 * state.muTop + h1 * state.muMid * state.muTop)) *
        (state.distRX - state.distLX) +
      state.distLX
    );
  }

  for (
    let i = state.distBY - (state.distBY - (state.distTY + (state.distBY - state.distTY) * (state.hTop + state.hMid))) / divide;
    i - 1 > state.distTY + (state.distBY - state.distTY) * (state.hTop + state.hMid);
    i -= (state.distBY - (state.distTY + (state.distBY - state.distTY) * (state.hTop + state.hMid))) / divide
  ) {
    stroke("black");
    strokeWeight(3);
    line(state.distLX, i, fluid1LineXOut(i), i);
    noStroke();
    triangle(fluid1LineXOut(i) - 25, i + 10, fluid1LineXOut(i) - 25, i - 10, fluid1LineXOut(i), i);
  }

  for (
    let i = state.distTY + (state.distBY - state.distTY) * (state.hTop + state.hMid);
    i - 1 > state.distTY + (state.distBY - state.distTY) * state.hTop;
    i -= (state.distTY + (state.distBY - state.distTY) * (state.hTop + state.hMid) - (state.distTY + (state.distBY - state.distTY) * state.hTop)) / divide2
  ) {
    stroke("black");
    strokeWeight(3);
    line(state.distLX, i, fluid2LineXOut(i), i);
    noStroke();
    triangle(fluid2LineXOut(i) - 25, i + 10, fluid2LineXOut(i) - 25, i - 10, fluid2LineXOut(i), i);
  }

  for (let i = state.distTY + (state.distBY - state.distTY) * state.hTop; i + 1 > state.distTY; i -= (state.distTY + (state.distBY - state.distTY) * state.hTop - state.distTY) / divide3) {
    stroke("black");
    strokeWeight(3);
    line(state.distLX, i, fluid3LineXOut(i), i);
    noStroke();
    triangle(fluid3LineXOut(i) - 25, i + 10, fluid3LineXOut(i) - 25, i - 10, fluid3LineXOut(i), i);
  }

  push();
  textAlign(CENTER);
  stroke("Black");
  strokeWeight(0.2);
  fill("Black");
  textSize(28);
  translate(state.graphCenterX - (state.graphCenterX * 49) / 64, state.graphCenterY);
  rotate(HALF_PI * 3);
  text("fraction of fluid height", 0, 0);
  pop();

  textAlign(CENTER);
  noStroke();
  fill("Black");
  textSize(24);

  // Horizontal
  for (let i = state.distLX; i - 1 < state.distRX; i += (state.distRX - state.distLX) / 5) {
    let intervalHRound = intervalH.toFixed(1);
    text(intervalHRound, i, state.distBY + 80);
    intervalH += 0.2;
  }

  textAlign(CENTER);
  noStroke();
  fill("White");
  textSize(32);
  text(`moving plate`, state.graphCenterX, state.graphCenterY - 240 - 13);
  text(`stationary plate`, state.graphCenterX, state.graphCenterY + 275);

  push();
  textAlign(CENTER);
  stroke("Black");
  strokeWeight(0.2);
  fill("Black");
  textSize(28);
  text("fluid velocity", state.graphCenterX, state.distBY + 120);
  pop();

  pop();
}

function drawAxesLabelsTxy() {
  push();

  let intervalV = 0;
  let intervalH = 0;

  // Vertical
  // Big ticks
  stroke("black");
  strokeWeight(2);
  for (let i = state.heightBY - (state.heightBY - state.heightTY) / 5; i > state.heightTY; i -= (state.heightBY - state.heightTY) / 5) {
    line(state.distLX, i, state.distLX + 5, i);
    line(state.distRX, i, state.distRX - 5, i);
  }

  // Values
  textAlign(CENTER);
  noStroke();
  fill("Black");
  textSize(24);
  for (let i = state.heightBY; i + 1 > state.heightTY; i -= (state.heightBY - state.heightTY) / 5) {
    let intervalVRound = intervalV.toFixed(1);
    text(intervalVRound, state.distLX - 24, i + 8);
    intervalV += 0.2;
  }

  // Little ticks
  stroke("black");
  strokeWeight(1);
  for (let i = state.heightBY - (state.heightBY - state.heightTY) / 10; i > state.heightTY; i -= (state.heightBY - state.heightTY) / 10) {
    line(state.distLX, i, state.distLX + 5, i);
    line(state.distRX, i, state.distRX - 5, i);
  }

  // Horizontal
  // Big Ticks
  stroke("black");
  strokeWeight(2);
  for (let i = state.distLX + (state.distRX - state.distLX) / 5; i < state.distRX; i += (state.distRX - state.distLX) / 5) {
    line(i, state.heightBY, i, state.heightBY - 5);
    line(i, state.heightTY, i, state.heightTY + 5);
  }

  // Values
  textAlign(CENTER);
  noStroke();
  fill("Black");
  textSize(24);
  for (let i = state.distLX; i - 1 < state.distRX; i += (state.distRX - state.distLX) / 5) {
    let intervalHRound = intervalH.toFixed(1);
    text(intervalHRound, i, state.heightBY + 30);
    intervalH += 0.2;
  }

  // Little ticks
  stroke("black");
  strokeWeight(1);
  for (let i = state.distLX + (state.distRX - state.distLX) / 10; i < state.distRX; i += (state.distRX - state.distLX) / 10) {
    line(i, state.heightBY, i, state.heightBY - 5);
    line(i, state.heightTY, i, state.heightTY + 5);
  }

  push();
  textAlign(CENTER);
  stroke("Black");
  strokeWeight(0.2);
  fill("Black");
  textSize(28);
  translate(state.graphCenterX - (state.graphCenterX * 49) / 64, state.graphCenterY);
  rotate(HALF_PI * 3);
  text("fluid velocity", 0, 0);
  pop();

  push();
  textAlign(CENTER);
  stroke("Black");
  strokeWeight(0.2);
  fill("Black");
  textSize(28);
  text("fraction of fluid height", state.graphCenterX, state.heightBY + 70);
  pop();

  pop();
}

function drawTxy() {
  push();

  pop();
}

function drawMousePxy() {
  textAlign(CENTER);
  textSize(16);

  state.circleX = mouseX / relativeSize();
  state.circleY = mouseY / relativeSize();

  state.mouseXPtCalibrated = mouseX / relativeSize();
  state.mouseYPtCalibrated = mouseY / relativeSize();

  // line(state.mouseXPtCalibrated - 75, state.mouseYPtCalibrated - 15, state.mouseXPtCalibrated + 75, state.mouseYPtCalibrated - 15);
  // text(`x: ${Math.abs(((state.mouseXPtCalibrated-state.distLX)/854).toFixed(3))} y: ${Math.abs(((state.mouseYPtCalibrated-state.distBY)/-480).toFixed(3))}`, state.mouseXPtCalibrated, state.mouseYPtCalibrated - 25);

  // line(state.mouseXPtCalibrated - 75, state.mouseYPtCalibrated - 15, state.mouseXPtCalibrated + 75, state.mouseYPtCalibrated - 15);

  if (Math.abs(state.circleX - state.distLX) < 7.5 && Math.abs(state.circleY - state.distBY) < 7.5) {
    fill(100, 100, 100);
    strokeWeight(2);
    stroke("black");
    ellipse(state.distLX, state.distBY, 15, 15);
    fill("white");
    textSize(22);
    stroke("black");
    strokeWeight(3.5);
    text(`x: ${Math.abs((0).toFixed(3))} y: ${Math.abs((0).toFixed(3))}`, state.distLX, state.distBY + 35);
  }

  if (Math.abs(state.circleX - state.distRX) < 7.5 && Math.abs(state.circleY - state.distTY) < 7.5) {
    fill(100, 100, 100);
    strokeWeight(2);
    stroke("black");
    ellipse(state.distRX, state.distTY, 15, 15);
    fill("white");
    textSize(22);
    stroke("black");
    strokeWeight(3.5);
    text(`x: ${Math.abs((1).toFixed(3))} y: ${Math.abs((1).toFixed(3))}`, state.distRX, state.distTY + 35);
  }

  if (Math.abs(state.circleX - state.distLineX12) < 7.5 && Math.abs(state.circleY - ((state.distBY - state.distTY) * (1 - state.hBot) + state.distTY)) < 7.5) {
    fill(100, 100, 100);
    strokeWeight(2);
    stroke("black");
    ellipse(state.distLineX12, (state.distBY - state.distTY) * (1 - state.hBot) + state.distTY, 15, 15);
    fill("white");
    textSize(22);
    stroke("black");
    strokeWeight(3.5);
    text(
      `x: ${Math.abs(((state.distLineX12 - state.distLX) / (state.distRX - state.distLX)).toFixed(3))} y: ${Math.abs((((state.distBY - state.distTY) * (1 - state.hBot) + state.distTY - state.distBY) / (state.distTY - state.distBY)).toFixed(3))}0`,
      state.distLineX12,
      (state.distBY - state.distTY) * (1 - state.hBot) + state.distTY + 35,
    );
  }

  if (Math.abs(state.circleX - state.distLineX23) < 7.5 && Math.abs(state.circleY - ((state.distBY - state.distTY) * (1 - (state.hBot + state.hMid)) + state.distTY)) < 7.5) {
    fill(100, 100, 100);
    strokeWeight(2);
    stroke("black");
    ellipse(state.distLineX23, (state.distBY - state.distTY) * (1 - (state.hBot + state.hMid)) + state.distTY, 15, 15);
    fill("white");
    textSize(22);
    stroke("black");
    strokeWeight(3.5);
    text(
      `x: ${Math.abs(((state.distLineX23 - state.distLX) / (state.distRX - state.distLX)).toFixed(3))} y: ${Math.abs((((state.distBY - state.distTY) * (1 - (state.hBot + state.hMid)) + state.distTY - state.distBY) / (state.distTY - state.distBY)).toFixed(3))}0`,
      state.distLineX23,
      (state.distBY - state.distTY) * (1 - (state.hBot + state.hMid)) + state.distTY + 35,
    );
  }

  // These if statements define what the mouse does and where to place the gray circle on the graph
  if (state.mouseYPtCalibrated > state.distTY && state.mouseXPtCalibrated > state.distLX && state.distRX > state.mouseXPtCalibrated && state.mouseYPtCalibrated < state.distBY) {
    // cursor('grab');

    // if statements for points on the middle section of the plot
    if (state.circleX > state.distLineX12 && state.circleX < state.distLineX23 && Math.abs(state.circleY - state.plotCircleY2) < 20) {
      fill(100, 100, 100);
      strokeWeight(2);
      stroke("black");
      ellipse(state.circleX, state.plotCircleY2, 15, 15);
      fill("white");
      textSize(22);
      stroke("black");
      strokeWeight(3.5);
      text(
        `x: ${Math.abs(((state.mouseXPtCalibrated - state.distLX) / (state.distRX - state.distLX)).toFixed(3))} y: ${Math.abs(((state.plotCircleY2 - state.distBY) / (state.distTY - state.distBY)).toFixed(3))}`,
        state.mouseXPtCalibrated,
        state.plotCircleY2 - 25,
      );
    }
    // if for top section
    if (state.circleX > state.distLineX23 && state.circleX < state.distRX && Math.abs(state.circleY - state.plotCircleY3) < 20) {
      fill(100, 100, 100);
      strokeWeight(2);
      stroke("black");
      ellipse(state.circleX, state.plotCircleY3, 15, 15);
      fill("white");
      textSize(22);
      stroke("black");
      strokeWeight(3.5);
      text(
        `x: ${Math.abs(((state.mouseXPtCalibrated - state.distLX) / (state.distRX - state.distLX)).toFixed(3))} y: ${Math.abs(((state.plotCircleY3 - state.distBY) / (state.distTY - state.distBY)).toFixed(3))}`,
        state.mouseXPtCalibrated,
        state.plotCircleY3 - 25,
      );
    }

    // if for bottom section
    if (state.circleX > state.distLX && state.circleX < state.distLineX12 && Math.abs(state.circleY - state.plotCircleY1) < 20) {
      fill(100, 100, 100);
      strokeWeight(2);
      stroke("black");
      ellipse(state.circleX, state.plotCircleY1, 15, 15);
      fill("white");
      textSize(22);
      stroke("black");
      strokeWeight(3.5);
      text(
        `x: ${Math.abs(((state.mouseXPtCalibrated - state.distLX) / (state.distRX - state.distLX)).toFixed(3))} y: ${Math.abs(((state.plotCircleY1 - state.distBY) / (state.distTY - state.distBY)).toFixed(3))}`,
        state.mouseXPtCalibrated,
        state.plotCircleY1 - 25,
      );
    }
  } else if (
    state.mouseYPtCalibrated < state.distTY ||
    state.mouseXPtCalibrated < state.distLX ||
    state.distRX < state.mouseXPtCalibrated ||
    state.mouseYPtCalibrated > state.distBY
  ) {
    cursor(ARROW);
  }
}

function drawMouseTxy() {
  textAlign(CENTER);
  textSize(16);

  state.circleX = mouseX / relativeSize();
  state.circleY = mouseY / relativeSize();

  state.mouseXPtCalibrated = mouseX / relativeSize();
  state.mouseYPtCalibrated = mouseY / relativeSize();

  // line(state.mouseXPtCalibrated - 75, state.mouseYPtCalibrated - 15, state.mouseXPtCalibrated + 75, state.mouseYPtCalibrated - 15);
  // text(`x: ${Math.abs(((state.mouseXPtCalibrated-state.distLX)/854).toFixed(3))} y: ${Math.abs(((state.mouseYPtCalibrated-state.distBY)/-480).toFixed(3))}`, state.mouseXPtCalibrated, state.mouseYPtCalibrated - 25);

  // line(state.mouseXPtCalibrated - 75, state.mouseYPtCalibrated - 15, state.mouseXPtCalibrated + 75, state.mouseYPtCalibrated - 15);

  if (Math.abs(state.circleX - state.distLX) < 7.5 && Math.abs(state.circleY - state.heightBY) < 7.5) {
    fill(100, 100, 100);
    strokeWeight(2);
    stroke("black");
    ellipse(state.distLX, state.heightBY, 15, 15);
    fill("white");
    textSize(22);
    stroke("black");
    strokeWeight(3.5);
    text(`x: ${Math.abs((0).toFixed(3))} y: ${Math.abs((0).toFixed(3))}`, state.distLX, state.heightBY + 35);
  }

  if (Math.abs(state.circleX - state.distRX) < 7.5 && Math.abs(state.circleY - state.heightTY) < 7.5) {
    fill(100, 100, 100);
    strokeWeight(2);
    stroke("black");
    ellipse(state.distRX, state.heightTY, 15, 15);
    fill("white");
    textSize(22);
    stroke("black");
    strokeWeight(3.5);
    text(`x: ${Math.abs((1).toFixed(3))} y: ${Math.abs((1).toFixed(3))}`, state.distRX, state.heightTY + 35);
  }

  if (Math.abs(state.circleX - ((state.distRX - state.distLX) * state.hBot + state.distLX)) < 7.5 && Math.abs(state.circleY - state.heightY12) < 7.5) {
    fill(100, 100, 100);
    strokeWeight(2);
    stroke("black");
    ellipse((state.distRX - state.distLX) * state.hBot + state.distLX, state.heightY12, 15, 15);
    fill("white");
    textSize(22);
    stroke("black");
    strokeWeight(3.5);
    text(
      `x: ${Math.abs((((state.distRX - state.distLX) * state.hBot + state.distLX - state.distLX) / (state.distRX - state.distLX)).toFixed(3))}0 y: ${Math.abs(((state.heightY12 - state.distBY) / (state.distTY - state.distBY)).toFixed(3))}`,
      (state.distRX - state.distLX) * state.hBot + state.distLX,
      state.heightY12 + 35,
    );
  }

  if (Math.abs(state.circleX - ((state.distRX - state.distLX) * (state.hBot + state.hMid) + state.distLX)) < 7.5 && Math.abs(state.circleY - state.heightY23) < 7.5) {
    fill(100, 100, 100);
    strokeWeight(2);
    stroke("black");
    ellipse((state.distRX - state.distLX) * (state.hBot + state.hMid) + state.distLX, state.heightY23, 15, 15);
    fill("white");
    textSize(22);
    stroke("black");
    strokeWeight(3.5);
    text(
      `x: ${Math.abs((((state.distRX - state.distLX) * (state.hBot + state.hMid) + state.distLX - state.distLX) / (state.distRX - state.distLX)).toFixed(3))}0 y: ${Math.abs(((state.heightY23 - state.distBY) / (state.distTY - state.distBY)).toFixed(3))}`,
      (state.distRX - state.distLX) * (state.hBot + state.hMid) + state.distLX,
      state.heightY23 + 35,
    );
  }

  // These if statements define what the mouse does and where to place the gray circle on the graph
  if (state.mouseYPtCalibrated > state.heightTY && state.mouseXPtCalibrated > state.distLX && state.distRX > state.mouseXPtCalibrated && state.mouseYPtCalibrated < state.heightBY) {
    // if statements for points on the middle section of the plot
    if (
      state.circleX > (state.distRX - state.distLX) * state.hBot + state.distLX &&
      state.circleX < (state.distRX - state.distLX) * (state.hBot + state.hMid) + state.distLX &&
      Math.abs(state.circleY - state.plotCircleY5) < 20
    ) {
      fill(100, 100, 100);
      strokeWeight(2);
      stroke("black");
      ellipse(state.circleX, state.plotCircleY5, 15, 15);
      fill("white");
      textSize(22);
      stroke("black");
      strokeWeight(3.5);
      text(
        `x: ${Math.abs(((state.mouseXPtCalibrated - state.distLX) / (state.distRX - state.distLX)).toFixed(3))} y: ${Math.abs(((state.plotCircleY5 - state.heightBY) / (state.heightTY - state.heightBY)).toFixed(3))}`,
        state.mouseXPtCalibrated,
        state.plotCircleY5 - 25,
      );
    }

    // if for right section
    if (state.circleX > (state.distRX - state.distLX) * (state.hBot + state.hMid) + state.distLX && state.circleX < state.distRX && Math.abs(state.circleY - state.plotCircleY6) < 20) {
      fill(100, 100, 100);
      strokeWeight(2);
      stroke("black");
      ellipse(state.circleX, state.plotCircleY6, 15, 15);
      fill("white");
      textSize(22);
      stroke("black");
      strokeWeight(3.5);
      text(
        `x: ${Math.abs(((state.mouseXPtCalibrated - state.distLX) / (state.distRX - state.distLX)).toFixed(3))} y: ${Math.abs(((state.plotCircleY6 - state.heightBY) / (state.heightTY - state.heightBY)).toFixed(3))}`,
        state.mouseXPtCalibrated,
        state.plotCircleY6 - 25,
      );
    }

    // if for left section
    if (state.circleX > state.distLX && state.circleX < (state.distRX - state.distLX) * state.hBot + state.distLX && Math.abs(state.circleY - state.plotCircleY4) < 20) {
      fill(100, 100, 100);
      strokeWeight(2);
      stroke("black");
      ellipse(state.circleX, state.plotCircleY4, 15, 15);
      fill("white");
      textSize(22);
      stroke("black");
      strokeWeight(3.5);
      text(
        `x: ${Math.abs(((state.mouseXPtCalibrated - state.distLX) / (state.distRX - state.distLX)).toFixed(3))} y: ${Math.abs(((state.plotCircleY4 - state.heightBY) / (state.heightTY - state.heightBY)).toFixed(3))}`,
        state.mouseXPtCalibrated,
        state.plotCircleY4 - 25,
      );
    }
  } else if (
    state.mouseYPtCalibrated < state.distTY ||
    state.mouseXPtCalibrated < state.distLX ||
    state.distRX < state.mouseXPtCalibrated ||
    state.mouseYPtCalibrated > state.distBY
  ) {
    cursor(ARROW);
  }
}
 */
