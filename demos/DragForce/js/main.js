// This is the main program.  I just threw all of the functions not related to initializing the plot in here

// These are some elements you can find in "index.html"
const ball = document.getElementById("ball");
const startButton = document.getElementById("start-button");
const selection = document.getElementById("object-selection");

let yPosition = 0; // Initial position of the ball
let isRunning = false; // Animation is initially not running
let start = Date.now(); // This is the time value when the animation starts - it is updated once when the animation begins
let now = Date.now(); // This is the time value during the animation - it is updated every animation frame
let elapsed = now - start; // This is the time elapsed - the difference between "now" and "start"
let graphData = [[0, 0]]; // This is the "graph data" variable that we will update then put into the graph
let index = 0; // This is just a number that increments every animation frame. You may find it useful for something

// This function updates the Plot with a two-dimensional array of coordinates, e.g. [[0, 0], [5, 2], [3, 1], ...]
// See some examples of live updating at http://www.flotcharts.org/flot/examples/ . You can view the source code of the examples in the index.html file of each example page on this website.
function updateGraph(array) {
  Plot.setData([array]);
  Plot.setupGrid(true);
  Plot.draw();
}

// This function is called once every animation frame.
function animationFunction() {
  index++; // Increment our arbitrary "index" variable by 1
  graphData.push([elapsed / 1000, VTdict[elapsed]]); // Add new data to the "graphData" variable 
  if(elapsed<=max_t)
  {updateData();}
  updateGraph(graphData);
  ball.style.top = `${400-HTdict[elapsed]}px`; // Change the css property "top" of the ball to make it move
}

// This is an implementation based on https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
// This function just increments the "now" variable to the current time, calls animationFunction(), then calls itself until 5000 ms have elapsed
function step() {
  now = Date.now();
  elapsed = now - start;
  animationFunction();

  if (elapsed < max_t && isRunning) { // Stop the animation after 5 seconds
    window.requestAnimationFrame(step);
  } else {
    isRunning = false;
    window.cancelAnimationFrame(step);
  }
}

// This is the function that is called when you click the "start" button
// We do not want it to be called if the simulation is already running, hence the "isRunning" variable
function startAnimation() {
  
  if (!isRunning) {
    initValue();
    VT();
    isRunning = true;
    index = 0;
    graphData = [[0, 0]];
    start = Date.now();
    yPosition = 0;
    window.requestAnimationFrame(step);
  }
  


}

function stopAnimation()
{
if(isRunning)
  {
    window.cancelAnimationFrame(step);
    isRunning = false;
  }
}

function updateInput()
{
    if(selection.value != -1)
    {
        document.getElementById("dragCoeff").value = obj[selection.value]["Cd"];
        document.getElementById("area").value= obj[selection.value]["A"];
        document.getElementById("mass").value= obj[selection.value]["M"];
        document.getElementById("objImage").scr = obj[selection.value]["src"];
    }
    if(selection.value == -1)
    {
        log("something");
    }

}

// Instruct the start button to call the startAnimation() function when we click it
startButton.addEventListener("click", startAnimation);
selection.addEventListener("change", updateInput);