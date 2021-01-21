const startButton = document.getElementById("start-button");
const ball = window.ballObj;

window.isRunning = false;
let start = Date.now();
let now = Date.now();
let dt = 0;
let elapsed = now - start;
let index = 0;

function updateGraphs(positionArray, CdCoord) {

  window.positionPlot.setData([
    { data : positionArray, lines: { show: true } },
    { data : [positionArray[positionArray.length - 1]], points : { show: true, color: "rgb(0, 0, 0)", fillColor: "rgb(155, 205, 0)" } }
  ]);
  window.positionPlot.getData()[1].color = "rgb(0, 0, 0)";
  window.positionPlot.setupGrid(true);
  window.positionPlot.draw();

  const roughnessPlot = window.roughnessPlot;
  const CdPointData = roughnessPlot.getData()[5];
  CdPointData.data = [CdCoord];
  CdPointData.datapoints.points = CdCoord;
  roughnessPlot.setupGrid(true);
  roughnessPlot.draw();
}

function animationFunction() {
  index++;
  ball.update(dt);
  ball.updateDOM();
  if( ball.y < 0 ) { isRunning = false }
  window.positionPlotData.push([ball.x, ball.y]); 
  updateGraphs(window.positionPlotData, window.CdPlotCoord);
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
    window.positionPlotData.push([0, 0]);
    isRunning = true;
    index = 0;
    graphData = [[0, 0]];
    start = Date.now();
    now = Date.now();
    yPosition = 0;
    window.requestAnimationFrame(step);
  }
}

startButton.addEventListener("click", startAnimation);