const startButton = document.getElementById("start-button");
const ball = window.ballObj;

window.isRunning = false;
let start = Date.now();
let now = Date.now();
let dt = 0;
let elapsed = now - start;

function updateGraphs(positionArray, CdCoord) {

  window.positionPlot.setData([
    { data : positionArray, lines: { show: true } },
    { data : [positionArray[positionArray.length - 1]], color: "rgb(0, 0, 0)", points : { show: true } }
  ]);

  window.positionPlot.setupGrid(true);
  window.positionPlot.draw();

  roughnessPlot.getData()[5].datapoints.points = CdCoord;
  window.roughnessPlot.setupGrid(true);
  window.roughnessPlot.draw();
}

function animationFunction() {
  ball.update(dt);
  ball.updateDOM();
  if( ball.y < 0 ) { ball.y = 0; isRunning = false }
  window.positionLineData.push([ball.x, ball.y]); 
  updateGraphs(window.positionLineData, window.CdPlotCoord);
}

function step() {
  dt = (Date.now() - now) / 1000;
  now = Date.now();
  elapsed = now - start;

  if (isRunning) {
    animationFunction();
    window.requestAnimationFrame(step);
  } else {
    window.cancelAnimationFrame(step);
  }
}

function startAnimation() {
  if (!isRunning) {
    window.ballObj.resetLaunch();
    window.positionLineData.push([0, 0]);
    isRunning = true;
    start = Date.now();
    now = Date.now();
    yPosition = 0;
    window.requestAnimationFrame(step);
  }
}

startButton.addEventListener("click", startAnimation);