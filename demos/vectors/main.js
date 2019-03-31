var basePlot;
var point1;
var line1;
var xAxisLimit = 4;
var yAxisLimit = 4;

var pt1 = [[200, 400]]; // An array of points in 2D. Default is 1 point at 200, 200. Note that this is 200px right and 200px down, not coordinate (200, 200)
var pt2 = [[400, 200]]; // An array of corresponding points at the end of the vectors connecting to pt1
var pt1Coords = []; // Their corresponding coordinates
var pt2Coords = [];

var n = pt1.length; // number of vectors (equal to the total number of points / 2)

var rolloverPt1 = [false, 1]; // Is the mouse over the circle, if so, which circle?
var rolloverPt2 = [false, 1]; // corresponds to Pt2
var rolloverLine = [false, 1]; // Is the mouse over the line, if so, which line?

var draggingPt1 = [false, 1]; // Is a point being dragged, if so, which point?
var draggingPt2 = [false, 1]; // corresponds to Pt1
var draggingLine = [false, 1]; // Is the line being dragged, if so, which line?

var r; // point radius
var mouseOffset = [0, 0]; // Mouseclick offset
var graphicsOffset = [1, 1]; // Quadrants for graphics offset. [1, 1] is top-right, [-1, 1] is top left, etc. Used to prevent graphics from overlapping.

var i = 1; // iterator variables (comes in handy, since p5.js is a looping library)
var j = 1;

let iHat; // 70*153 original size
let jHat; // 85*196 original size
let kHat; // 121*206 original size

var selectOptions;

function preload() {
  iHat = loadImage('../../media/iHatWhite.png');
  jHat = loadImage('../../media/jHatWhite.png');
  kHat = loadImage('../../media/kHatWhite.png');
}

function setup() {
  createCanvas(800, 600); // Add base canvas, x-pixels by y-pixels

  basePlot2D = new GPlot(this); // see "grafica.js" library for info on GPlots
  basePlot2D.setPos(0, 0); // sets the top-left corner of the plot at the top-left corner of base canvas
  basePlot2D.setOuterDim(this.width-100, this.height); // gives the plot identical dimensions to base canvas

  basePlot2D.setXLim(-xAxisLimit, xAxisLimit); // x limits
  basePlot2D.setYLim(-yAxisLimit, xAxisLimit); // y limits
  basePlot2D.getXAxis().getAxisLabel().setText("x - axis"); // x-axis label
  basePlot2D.getYAxis().getAxisLabel().setText("y - axis"); // y-axis label
  basePlot2D.getXAxis().setFontSize(18);
  basePlot2D.getYAxis().setFontSize(18);
  basePlot2D.getXAxis().getAxisLabel().setFontSize(18);
  basePlot2D.getYAxis().getAxisLabel().setFontSize(18);

  basePlot2D.getTitle().setText("Learn About Vectors"); // title
  basePlot2D.getTitle().setFontSize(20);

  r = 20; // radius of the dragged points (pixels)

  extraCanvas = createGraphics(800, 600); // adds a second canvas on top of the first. this will be transparent, and where the points will be drawn onto.
 
  background(220); // background color of main canvas to RGB(220, 220, 220) "lighter gray"

  var addVectorButton = createButton('add vector');
  addVectorButton.position(this.width-100, 40);
  addVectorButton.mousePressed(addVector);

  selectOptions = createSelect();
  selectOptions.position(this.width-100, 100);
  selectOptions.option('vector addition');
  selectOptions.option('3D vectors');
  selectOptions.option('another option');
  selectOptions.changed(mySelectEvent);
}

function mySelectEvent() {
  var page = selectOptions.value();
}

function addVector() {

}

// a quick function to get the plot coordinates (x, y) at pixels (xPix, yPix). gPlot is the ID of your GPlot.
function loc(xPix, yPix, gPlot) {
  return gPlot.getValueAt(xPix, yPix);
}

// this does the opposite of loc(x, y, gPlot) but with coordinates to pixels
function getCoords(x, y, gPlot) {
  return gPlot.mainLayer.valueToPlot(x, y);
}

function draw() {
  background(255); // draws light gray background every frame

  basePlot2D.beginDraw(); // draws the plot
  basePlot2D.drawBackground();
  basePlot2D.drawBox();
  basePlot2D.setHorizontalAxesNTicks(8);
  basePlot2D.setVerticalAxesNTicks(8);
  basePlot2D.drawGridLines(GPlot.BOTH);
  basePlot2D.drawXAxis();
  basePlot2D.drawYAxis();
  basePlot2D.drawTitle();
  basePlot2D.endDraw();

  // iteratively checks to see if the mouse is over any points. if so, sets rollover to "true" and sets the rollover ID to the point ID.
  for (j = 1; j <= n; j++) {
    if (mouseX > pt1[j-1][0] - r &&
       mouseX < pt1[j-1][0] + r &&
        mouseY > pt1[j-1][1] - r &&
         mouseY < pt1[j-1][1] + r) 
         {rolloverPt1[0] = true; rolloverPt1[1] = j-1;} else {rolloverPt1[0] = false;}

    if (mouseX > pt2[j-1][0] - r &&
       mouseX < pt2[j-1][0] + r &&
        mouseY > pt2[j-1][1] - r &&
         mouseY < pt2[j-1][1] + r) 
         {rolloverPt2[0] = true; rolloverPt2[1] = j-1;} else {rolloverPt2[0] = false;}

    pt1Coords[j-1] = loc(pt1[j-1][0], pt1[j-1][1], basePlot2D);
    pt2Coords[j-1] = loc(pt2[j-1][0], pt2[j-1][1], basePlot2D);
    
    // put text to the right or left? above or below? helps with graphics placement
    if (pt1[j-1][0] < pt2[j-1][0]) {graphicsOffset[0] = -1} else {graphicsOffset[0] = 1}
    if (pt1[j-1][1] < pt2[j-1][1]) {graphicsOffset[1] = 1} else {graphicsOffset[1] = -1}
  }

  if (draggingPt1[0]) 
    {extraCanvas.fill (50); pt1[draggingPt1[1]] = [mouseX + mouseOffset[0], mouseY + mouseOffset[1]];}
  else if (rolloverPt1[0]) {extraCanvas.fill(100);}
  else {extraCanvas.fill(175, 200);}
  
  if (draggingPt2[0]) 
    {extraCanvas.fill (50); pt2[draggingPt2[1]] = [mouseX + mouseOffset[0], mouseY + mouseOffset[1]];}
  else if (rolloverPt2[0]) {extraCanvas.fill(100);}
  else {extraCanvas.fill(175, 200);}

  if (mouseIsPressed || i == 1) {
    image(extraCanvas, 0, 0);
    extraCanvas.background(255);
    extraCanvas.clear();
    extraCanvas.fill(255);
    extraCanvas.stroke(0);

    for (j = 1; j <= n; j++) {
      extraCanvas.push();
      extraCanvas.strokeWeight(5);
      extraCanvas.line(pt1[j-1][0], pt1[j-1][1], pt2[j-1][0], pt2[j-1][1]);
      extraCanvas.pop();

      //i-hat arrow
      extraCanvas.push();
      extraCanvas.strokeWeight(3);
      extraCanvas.stroke(255, 30, 30);
      extraCanvas.line(pt1[j-1][0]-10*graphicsOffset[0], pt1[j-1][1], pt2[j-1][0]+10*graphicsOffset[0], pt1[j-1][1]);
      extraCanvas.fill(255, 30, 30);
      extraCanvas.triangle(pt2[j-1][0]+10*graphicsOffset[0], pt1[j-1][1],  pt2[j-1][0]+16*graphicsOffset[0], pt1[j-1][1]+3,  pt2[j-1][0]+16*graphicsOffset[0], pt1[j-1][1]-3);
      extraCanvas.tint(255, 30, 30);
      extraCanvas.image(iHat, 0.5*pt1[j-1][0]+0.5*pt2[j-1][0]-30, pt1[j-1][1]-20-30*graphicsOffset[1], 0.12*iHat.width, 0.12*iHat.height);
      extraCanvas.pop();

      //j-hat arrow
      extraCanvas.push();
      extraCanvas.strokeWeight(3);
      extraCanvas.stroke(30, 30, 255);
      extraCanvas.line(pt2[j-1][0], pt1[j-1][1] + 4*graphicsOffset[1], pt2[j-1][0], pt2[j-1][1] - 16*graphicsOffset[1]);
      extraCanvas.fill(30, 30, 255);
      extraCanvas.triangle(pt2[j-1][0], pt2[j-1][1] - 14*graphicsOffset[1],  pt2[j-1][0] + 3, pt2[j-1][1] - 20*graphicsOffset[1],  pt2[j-1][0] - 3, pt2[j-1][1] - 20*graphicsOffset[1]);
      extraCanvas.tint(30, 30, 255);
      extraCanvas.image(jHat, pt2[j-1][0]-35-50*graphicsOffset[0], 0.5*pt1[j-1][1]+0.5*pt2[j-1][1], 0.12*jHat.width, 0.12*jHat.height)
      extraCanvas.pop();

      extraCanvas.push();
      extraCanvas.circle(pt1[j-1][0], pt1[j-1][1], r*0.25);
      extraCanvas.circle(pt2[j-1][0], pt2[j-1][1], r*0.25);
      extraCanvas.textAlign(CENTER);
      extraCanvas.textSize(18);
      extraCanvas.fill(0);
      extraCanvas.stroke(0);
      extraCanvas.text("(".concat(pt1Coords[j-1][0].toFixed(1),", ", pt1Coords[j-1][1].toFixed(1),")"), pt1[j-1][0]+50*graphicsOffset[0], pt1[j-1][1]-20);
      extraCanvas.text("(".concat(pt2Coords[j-1][0].toFixed(1),", ", pt2Coords[j-1][1].toFixed(1),")"), pt2[j-1][0]-50*graphicsOffset[0], pt2[j-1][1]-10);
      extraCanvas.textAlign(LEFT);
      extraCanvas.fill(255, 30, 30);
      extraCanvas.text("= ".concat((pt2Coords[j-1][0]-pt1Coords[j-1][0]).toFixed(1)), 0.5*pt1[j-1][0]+0.5*pt2[j-1][0]-30+0.2*iHat.width, pt1[j-1][1]-20-30*graphicsOffset[1]+0.12*iHat.height);
      extraCanvas.fill(30, 30, 255)
      extraCanvas.text("= ".concat((pt2Coords[j-1][1]-pt1Coords[j-1][1]).toFixed(1)), pt2[j-1][0]-35-50*graphicsOffset[0]+0.2*jHat.width, 0.5*pt1[j-1][1]+0.5*pt2[j-1][1]+0.1*jHat.height);
      extraCanvas.pop();
    }
  }

  image(extraCanvas, 0, 0);
  i++;

}

//note to self: make a "dragging3" that occurs if you drag the line instead of either dot.

function mousePressed() {
// Did I click on the point?
  for (j = 1; j <= n; j++) {
    if (mouseX > pt1[j-1][0] - r &&
      mouseX < pt1[j-1][0] + r &&
       mouseY > pt1[j-1][1] - r &&
        mouseY < pt1[j-1][1] + r)  {
      draggingPt1[0] = true;
      draggingPt1[1] = rolloverPt1[1];
      // If so, keep track of relative location of click to corner of rectangle
      mouseOffset = [pt1[draggingPt1[1]][0]-mouseX, pt1[draggingPt1[1]][1]-mouseY];
    } else if (mouseX > pt2[j-1][0] - r &&
      mouseX < pt2[j-1][0] + r &&
       mouseY > pt2[j-1][1] - r &&
        mouseY < pt2[j-1][1] + r) {
      draggingPt2[0] = true;
      draggingPt2[1] = rolloverPt2[1];
      // If so, keep track of relative location of click to corner of rectangle
      mouseOffset = [pt2[draggingPt2[1]][0]-mouseX, pt2[draggingPt2[1]][1]-mouseY];
    }
  }
}

function mouseReleased() {
  // Quit dragging
  draggingPt1[0] = false;
  draggingPt2[0] = false;
}