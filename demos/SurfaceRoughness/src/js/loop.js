const startButton = document.getElementById("start-button");
const ball = window.ballObj;

window.isRunning = false;
let start = Date.now();
let now = Date.now();
let dt = 0;
let elapsed = now - start;

const inputElementIDs = ["start-button", "reset-button", "launch-angle", "launch-velocity", "select-ball"];
inputElementIDs.forEach(elt => document.getElementById(elt).style.opacity = "1");

function updateGraphs(positionArray, CdCoord) {

  const data = window.positionPlot.getData();

  data[0].data = positionArray;
  data[0].lines = { ...data[0].lines, show: true };

  for ( let i = 0; i < data.length - 1; i++ ) {
    data[i].color = window.ballObj.colorArray[i];
  }

  data[data.length - 1].data = [positionArray[positionArray.length - 1]];
  data[data.length - 1].color = "rgb(0, 0, 0)";
  data[data.length - 1].points = { ...data[data.length - 1].points, show: true };

  window.positionPlot.setData(data);

  window.positionPlot.setupGrid(true);
  window.positionPlot.draw();

  roughnessPlot.getData()[5].datapoints.points = CdCoord;
  window.roughnessPlot.setupGrid(true);
  window.roughnessPlot.draw();
}

function animationFunction() {

  ball.update(dt);
  ball.updateDOM();
  if( ball.y < 0 ) {
    ball.y = 0;
    isRunning = false;   
    inputElementIDs.forEach(elt => {
      document.getElementById(elt).style.pointerEvents = "initial";
      document.getElementById(elt).style.opacity = "1";
    });
    let data = window.positionPlot.getData();
    data.unshift({ data: [[0, 0]] });
    const n = Number(document.getElementById("select-ball").value) + 1;
    const color = window.lineColors[n];
    window.ballObj.colorArray.unshift(color);
    window.positionLineData = [];
    window.positionPlot.setData(data);
  } else {
    window.positionLineData.push([ball.x, ball.y]); 
    updateGraphs(window.positionLineData, window.CdPlotCoord);
  }
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
    inputElementIDs.forEach(elt => { 
      document.getElementById(elt).style.pointerEvents = "none";
      document.getElementById(elt).style.opacity = "0.75";
    });
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