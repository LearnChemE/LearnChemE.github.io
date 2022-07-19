// This is the main program.  I just threw all of the functions not related to initializing the plot in here

// These are some elements you can find in "index.html"
const objImage = document.getElementById("objImage");
const structureImage = document.getElementById("structureImage");
const startPauseButton = document.getElementById("start-pause-button");
const resetButton = document.getElementById("reset-button");
const selection = document.getElementById("object-selection");
const cdInp = document.getElementById("dragCoeff");
const aInp = document.getElementById("area");
const mInp = document.getElementById("mass");
const uSpeed = document.getElementById("playspeed");
const slider = document.getElementById("slider");


let yPosition = 0; // Initial position of the objImage
let isRunning = false; // Animation is initially not running
let isPaused = false;
let start = Date.now(); // This is the time value when the animation starts - it is updated once when the animation begins
let now = Date.now(); // This is the time value during the animation - it is updated every animation frame
let elapsed = now - start; // This is the time elapsed - the difference between "now" and "start"
let graphData = [[0, 0]]; // This is the "graph data" variable that we will update then put into the graph
let index = 0; // This is just a number that increments every animation frame. You may find it useful for something
let dt = 0.016; // default to 60 fps
let speed = 1; //default speed of animation
let fallTime = 10; // The amount of time it takes to fall - calculated every time VT() is called
let max_velocity = 50; // Also calculated every time VT() is called
let sd = 0; //indicator of skydiving
const image_height = structureImage.getBoundingClientRect().height; // automatically grab the height of the structure (e.g. the tower)
const object_height = objImage.getBoundingClientRect().height;

// This function updates the Plot with a two-dimensional array of coordinates, e.g. [[0, 0], [5, 2], [3, 1], ...]
// See some examples of live updating at http://www.flotcharts.org/flot/examples/ . You can view the source code of the examples in the index.html file of each example page on this website.
function updateGraph(array) {
  Plot.setData([array]);
  Plot.setupGrid(true);
  Plot.draw();
}

// This updates the x and y axes to match the maximum time and fall velocity
function loadAxes()
{
  obj = selection.value;
  if(obj != 3)
    {Plot.getOptions().xaxes[0].max = 3;}
  if(obj == 3)
    {
      Plot.getOptions().xaxes[0].max = 25;
    }
  
  Plot.getOptions().yaxes[0].max = 20*((obj==1)||(obj==-1)) + 10*(obj==2)+70*(obj==3); // sets y axis to max velocity in increments of 10
  Plot.setupGrid();
  Plot.draw();
}

function updateAxes(curT) {
  const maxXAxis = Math.ceil(fallTime);
  const maxYAxis = Math.ceil(max_velocity);
  if(obj == 3)
  {
    Plot.getOptions().xaxes[0].max = 25;
  }
  else
  { if(curT<3)
    {
      Plot.getOptions().xaxes[0].max = 3;
    }
    else
    {
      Plot.getOptions().xaxes[0].max = curT;
    }
    Plot.getOptions().yaxes[0].max = Number( 10 + maxYAxis - ( maxYAxis % 10 ) ); // sets y axis to max velocity in increments of 10
    Plot.setupGrid();
    Plot.draw();
  }
}

// This function is called once every animation frame.
function animationFunction() {
  index++; // Increment our arbitrary "index" variable by 1
  updateAxes(elapsed/1000*speed);
  advance(); // See calculation.js
  graphData.push([elapsed/1000*speed, velocity]); // Add new data to the "graphData" variable
  updateDOM();
  updateGraph(graphData);
}

// This is an implementation based on https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
// This function just increments the "now" variable to the current time, calls animationFunction(), then calls itself until 5000 ms have elapsed
function step() {
  if ( !isPaused && height > 0 ) {
    dt = (Date.now() - now) / 1000*speed;
    if ( dt == 0 ) { dt = 0.016 }
    now = Date.now();
    elapsed = now - start;
    animationFunction();
  } else if ( height > 0 ) {
    dt = (Date.now() - now) / 1000*speed;
    now = Date.now();
    start += (dt * 1000*speed);
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

  slider.setAttribute("disabled","true");
  
  startPauseButton.innerHTML = "Pause"

  if (!isRunning && height > 0) {
    [selection, cdInp, aInp, mInp].forEach(inp => { inp.setAttribute("disabled", "true") });
    VT();
    updateAxes(index);
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

  slider.removeAttribute("disabled");
  isRunning = false;
  isPaused = false;
  selection.removeAttribute("disabled");
  updateInput();
  window.cancelAnimationFrame(step);
  initValue();
  graphData = [{data:[0, 0],color:'#3248a8'}];
  fallTime = 10;
  initSpeed();
  speed = 1;
  index = 0;
  startPauseButton.innerHTML = "Start"
  graphData = [{data:[0, 0],color:'#3248a8'}];
  updateAxes(index);
  updateGraph(graphData);
}

function updateInput()
{
  // selection.value is a string, so make sure this switch statement uses strings
  

  loadAxes();

  switch(selection.value) {
    default:
      sd = 0;
      fall_height = 169;      
      FallObject.setCustom();
      structureImage.src = "../img/monument1.png";
      
      break;
    case "1":
      sd = 0;
      fall_height = 169;
      FallObject.setSoccer();
      structureImage.src = "../img/monument1.png";
      objImage.style.height = "30px";
      objImage.style.width = "30px";
      break;
    case "2":
      sd = 0;
      fall_height = 169;
      FallObject.setJumper();
      structureImage.src = "../img/monument1.png";
      objImage.style.height = "35px";
      objImage.style.width = "35px";
      break;
    case "3":
      sd = 1;
      fall_height = 1500;
      FallObject.setSkyDiver();
      structureImage.src = "../img/sky.jpg";
      objImage.style.height = "21px";
      objImage.style.width = "42px";
      
      break;
      
    case "-1":
      sd = 0;
      fall_height = 169;
      FallObject.setCustom();
      structureImage.src = "../img/monument1.png";
      objImage.style.height = "20px";
      objImage.style.width = "20px";
      break;
  }
}

function fallObject() {

  this.setSoccer = () => {
    this.Cd = 0.5;
    this.A = 0.15;
    this.M = 0.41;
    this.src = "../img/ball.png";
    this.updateInputs(true);

  }

  this.setJumper = () => {
    this.Cd = 1.4;
    this.A = 24.92;
    this.M = 79;
    this.src = "../img/Parachute-Fallschirm.svg";
    this.updateInputs(true);

  }

  this.setSkyDiver = () => {
    this.Cd = 0.294;
    this.A = 1;
    this.M = 79;
    this.src = "../img/skydiver.png";
    this.updateInputs(true);

  }

  this.setCustom = () => {
    this.src = "../img/custom.png";
    this.updateInputs(false);

  }

  this.updateInputs = (disable) => {
    if(disable) {
      [cdInp, aInp, mInp].forEach(inp => {
        inp.setAttribute("disabled", "true");
        inp.setAttribute("title", `select the "custom" object below to adjust this slider`);
      });
      cdInp.value = Math.log( this.Cd );
      aInp.value = Math.log( this.A );
      mInp.value = Math.log( this.M );
    } else {
      [cdInp, aInp, mInp].forEach(inp => {
        inp.removeAttribute("disabled");
        inp.removeAttribute("title");
      });
    }
    objImage.setAttribute("src", this.src);

    try { initValue() } catch(e) {}
  }

  this.setSoccer();
}

function updateSpeed()
{
  document.getElementById("speed-display").innerHTML = slider.value;
  speed = slider.value;
}

function initSpeed()
{
  speed = 1;
  slider.value = 1;
  updateSpeed();
}

let FallObject = new fallObject();

// Instruct the start button to call the startAnimation() function when we click it
startPauseButton.addEventListener("click", startPauseAnimation);
resetButton.addEventListener("click", resetAnimation);
selection.addEventListener("change", updateInput);
slider.addEventListener("input",updateSpeed);
[cdInp, mInp, aInp].forEach(inp => {
  inp.addEventListener("input", () => {
    try { initValue() } catch(e) {}
  })
})