// This is the main program.  I just threw all of the functions not related to initializing the plot in here

// These are some elements you can find in "index.html"
const objImage = document.getElementById("objImage");
const startPauseButton = document.getElementById("start-pause-button");
const resetButton = document.getElementById("reset-button");
const selection = document.getElementById("object-selection");
const cdInp = document.getElementById("dragCoeff");
const aInp = document.getElementById("area");
const mInp = document.getElementById("mass");

let yPosition = 0; // Initial position of the objImage
let isRunning = false; // Animation is initially not running
let isPaused = false;
let start = Date.now(); // This is the time value when the animation starts - it is updated once when the animation begins
let now = Date.now(); // This is the time value during the animation - it is updated every animation frame
let elapsed = now - start; // This is the time elapsed - the difference between "now" and "start"
let graphData = [[0, 0]]; // This is the "graph data" variable that we will update then put into the graph
let index = 0; // This is just a number that increments every animation frame. You may find it useful for something
let dt = 1; //ms per calculation
let fallTime = 10; // The amount of time it takes to fall
let max_velocity = 50;
let tower_image_size = 285; // see style.css

// This function updates the Plot with a two-dimensional array of coordinates, e.g. [[0, 0], [5, 2], [3, 1], ...]
// See some examples of live updating at http://www.flotcharts.org/flot/examples/ . You can view the source code of the examples in the index.html file of each example page on this website.
function updateGraph(array) {
  Plot.setData([array]);
  Plot.setupGrid(true);
  Plot.draw();
}

function updateAxes() {
  const maxXAxis = Math.ceil(fallTime);
  const maxYAxis = Math.ceil(max_velocity);
  Plot.getOptions().xaxes[0].max = maxXAxis;
  Plot.getOptions().yaxes[0].max = Number( 20 + maxYAxis - maxYAxis % 20); // sets y axis to max velocity in increments of 20
  Plot.setupGrid();
  Plot.draw();
}

// This function is called once every animation frame.
function animationFunction() {
  index++; // Increment our arbitrary "index" variable by 1
  advance();
  graphData.push([elapsed / 1000, velocity]); // Add new data to the "graphData" variable
  updateDOM();
  updateGraph(graphData);
}

// This is an implementation based on https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
// This function just increments the "now" variable to the current time, calls animationFunction(), then calls itself until 5000 ms have elapsed
function step() {
  if ( !isPaused ) {
    dt = (Date.now() - now) / 1000;
    if ( dt == 0 ) { dt = 0.016 }
    now = Date.now();
    elapsed = now - start;
    animationFunction();
  } else {
    dt = (Date.now() - now) / 1000;
    now = Date.now();
    start += (dt * 1000);
    elapsed = now - start;
  }

  if ( height > 0 && isRunning) { // Stop the animation after 5 seconds
    window.requestAnimationFrame(step);
  } else {
    isRunning = false;
    window.cancelAnimationFrame(step);
  }
}

// This is the function that is called when you click the "start" button
// We do not want it to be called if the simulation is already running, hence the "isRunning" variable
function startPauseAnimation() {
  
  startPauseButton.innerHTML = "Pause"

  if (!isRunning) {
    [selection, cdInp, aInp, mInp].forEach(inp => { inp.setAttribute("disabled", "true") });
    VT();
    updateAxes();
    isRunning = true;
    index = 0;
    start = Date.now();
    yPosition = 0;
    window.requestAnimationFrame(step);
  
  } else {

    if (isPaused) {
      isPaused = false;
      startPauseButton.innerHTML = "Pause"
    } else {
      isPaused = true;
      startPauseButton.innerHTML = "Start"
    }
  
  }

}

function resetAnimation() {
  isRunning = false;
  isPaused = false;
  selection.removeAttribute("disabled");
  window.cancelAnimationFrame(step);
  initValue();
  graphData = [[0, 0]];
  fallTime = 10;
  startPauseButton.innerHTML = "Start"
  graphData = [[0, 0]];
  updateAxes();
  updateGraph(graphData);
}

function updateInput()
{
  // selection.value is a string, so make sure this switch statement uses strings
  switch(selection.value) {
    default:
      FallObject.setCustom();
      break;
    case "1":
      FallObject.setSoccer();
      break;
    case "2":
      FallObject.setJumper();
      break;
    case "-1":
      FallObject.setCustom();
      break;
  }
}

function fallObject() {

  this.setSoccer = () => {
    this.Cd = 0.5;
    this.A = 0.147;
    this.M = 0.75;
    this.src = "../img/ball.png";
    this.updateInputs(true);
  }

  this.setJumper = () => {
    this.Cd = 1.4;
    this.A = 95.03;
    this.M = 174,
    this.src = "../img/Parachute-Fallschirm.svg";
    this.updateInputs(true);
  }

  this.setCustom = () => {
    this.src = "../img/ball.png";
    this.updateInputs(false);
  }

  this.updateInputs = (disable) => {
    if(disable) {
      [cdInp, aInp, mInp].forEach(inp => {
        inp.setAttribute("disabled", "true");
      });
      cdInp.value = this.Cd;
      aInp.value = this.A;
      mInp.value = this.M;
    } else {
      [cdInp, aInp, mInp].forEach(inp => {
        inp.removeAttribute("disabled");
      });
    }
    objImage.setAttribute("src", this.src);
  }

  this.setSoccer();
}

let FallObject = new fallObject();

// Instruct the start button to call the startAnimation() function when we click it
startPauseButton.addEventListener("click", startPauseAnimation);
resetButton.addEventListener("click", resetAnimation);
selection.addEventListener("change", updateInput);