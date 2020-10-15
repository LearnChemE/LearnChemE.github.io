const startButton = document.getElementById("start-button");
const ball = window.ballObj;

let isRunning = false;
let start = Date.now();
let now = Date.now();
let dt = 0;
let elapsed = now - start;
let index = 0;

function updateGraph(array) {
  window.positionPlot.setData([array]);
  window.positionPlot.setupGrid(true);
  window.positionPlot.draw();
}

function animationFunction() {
  index++;
  ball.update(dt);
  ball.updateDOM();
  if( ball.y < 0 ) { isRunning = false }
  window.positionPlotData.push([ball.x, ball.y]); 
  updateGraph(window.positionPlotData);
}

function step() {
  dt = (Date.now() - now) / 1000;
  now = Date.now();
  elapsed = now - start;
  animationFunction();

  if (isRunning) {
    window.requestAnimationFrame(step);
  } else {
    window.cancelAnimationFrame(step);
  }
}

function startAnimation() {
  if (!isRunning) {
    window.ballObj.setToDefaults();
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