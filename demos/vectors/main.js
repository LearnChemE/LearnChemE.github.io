var basePlot2D;
var xAxisLimit = 4;
var yAxisLimit = 4;

var pts = [[200, 400], [400, 200]]; // Default location of coordinates. Note that this is px, not coordinate
var ptCoords = []; // Their corresponding coordinates (solved for in the program)
var n = pts.length; // number of lines

var rolloverPt = [false, 1]; // Is the mouse over the circle, if so, which circle?
var rolloverLine = [false, 1]; // Is the mouse over the line, if so, which line?
var draggingPt = [false, 1]; // Is a point being dragged, if so, which point?
var draggingLine = [false, 1]; // Is the line being dragged, if so, which line?
var mouseOffset = [0, 0]; // Mouseclick offset
var r; // point radius

var graphicsOffset = [[1, 1], [1, 1]]; // Quadrants for graphics offset. [1, 1] is top-right, [-1, 1] is top left, etc. Used to prevent graphics from overlapping.
let offset = [];

var i = 1; // iterator variables (comes in handy, since p5.js is a looping library)
var j = 1;

let iHat; // 70*153 original size
let jHat; // 85*196 original size
let kHat; // 121*206 original size

var selectOptions;
var newVectorButton;
let sumVectorButton;
let arrowsCheckbox;
let coordsCheckbox;
let drawArrows = false;
let drawCoords = false;

let ops;
let pageSelection = sessionStorage.getItem("pageVal");
let page;

if (sessionStorage.getItem("pageVal")) {page = pageSelection} else {page = "vector addition"}

let twoDimension = true;

var x1 = 1;
var y1 = 0;
var z1 = 1;
var x2 = 0.2;
var y2 = 0.8;
var z2 = -0.2;

function preload() {
  iHat = loadImage('../../media/iHatWhite.png');
  jHat = loadImage('../../media/jHatWhite.png');
  kHat = loadImage('../../media/kHatWhite.png');
}

class options {
  constructor(gPlot) {
    this.gPlot = gPlot;
  }
  
  defaultPlot() {
    this.gPlot.setPos(0, 0); // sets the top-left corner of the plot at the top-left corner of base canvas
    this.gPlot.setOuterDim(width-100, height); // sets the plot dimensions, pixels

    // axes range, labels
    this.gPlot.setXLim(-xAxisLimit, xAxisLimit); // x limits
    this.gPlot.setYLim(-yAxisLimit, xAxisLimit); // y limits
    this.gPlot.getXAxis().getAxisLabel().setText("x - axis"); // x-axis label
    this.gPlot.getYAxis().getAxisLabel().setText("y - axis"); // y-axis label
    this.gPlot.getXAxis().setFontSize(18);
    this.gPlot.getYAxis().setFontSize(18);
    this.gPlot.getXAxis().getAxisLabel().setFontSize(18);
    this.gPlot.getYAxis().getAxisLabel().setFontSize(18);

    this.gPlot.getTitle().setText("Learn About Vectors"); // title
    this.gPlot.getTitle().setFontSize(20);
  }

  static defaultSidebar() {
    newVectorButton = createButton('add vector');
    newVectorButton.position(width-100, 40);
    newVectorButton.mousePressed(newVector);
  
    sumVectorButton = createButton('sum vectors');
    sumVectorButton.position(width-100, 90);
    sumVectorButton.mousePressed(sumVector);

    arrowsCheckbox = createCheckbox('show arrows', false);
    arrowsCheckbox.position(width-100, 180);
    arrowsCheckbox.changed(mySelectEvent);

    coordsCheckbox = createCheckbox('show coordinates', false);
    coordsCheckbox.position(width-100, 210);
    coordsCheckbox.changed(mySelectEvent);


    selectOptions = createSelect();
    selectOptions.position(width-100, 140);
    selectOptions.option('vector addition');
    selectOptions.option('scalar multiplication');
    selectOptions.option('dot product');
    selectOptions.option('cross product');
    selectOptions.value(page);
    selectOptions.changed(reInitialize);
  }
}

class drawing {
  constructor(gPlot) {
    this.gPlot = gPlot;
  }

  drawMethod() {
  this.gPlot.beginDraw(); // draws the plot
  this.gPlot.drawBackground();
  this.gPlot.drawBox();
  this.gPlot.setHorizontalAxesNTicks(8);
  this.gPlot.setVerticalAxesNTicks(8);
  this.gPlot.drawGridLines(GPlot.BOTH);
  this.gPlot.drawXAxis();
  this.gPlot.drawYAxis();
  this.gPlot.drawTitle();
  this.gPlot.endDraw();
  }
}

function setup() {
  if(twoDimension) {
    createCanvas(800, 600, P2D); // Add base canvas, x-pixels by y-pixels

    basePlot2D = new GPlot(this); // see "grafica.js" library for info on GPlots
    
    ops = new options;
    ops.gPlot = basePlot2D;
    ops.defaultPlot();

    r = 20; // radius of the dragged points (pixels)

    extraCanvas = createGraphics(800, 600); // adds a second canvas on top of the first. this will be transparent, and where the points will be drawn onto.
    
    background(220); // background color of main canvas to RGB(220, 220, 220) "lighter gray"

    plotdraw2D = new drawing;
    plotdraw2D.gPlot = basePlot2D;
    options.defaultSidebar();
  }
  else {
    createCanvas(700, 600, WEBGL);
    normalMaterial();
    ambientMaterial(39, 235, 91);
    camera(100, -200, (height/2.0) / tan(PI*30.0 / 180.0), 0, 0, 0, 0, 1, 0);
    sliderRange(-2, 2, 0.05);
    gui = createGui('plot controls', width + 10, 0.42*height);
    gui.addGlobals('x1','y1','z1','x2','y2','z2');
    debugMode();
  }
}

function reInitialize() {
  if (page == "cross product") {sessionStorage.setItem("pageVal", selectOptions.value()); location.reload();}
  page = selectOptions.value();
  if (page == "cross product") {
    twoDimension = false;
    setup();
    selectOptions.value("cross product");
  }
}

function mySelectEvent() {
  drawArrows = arrowsCheckbox.checked();
  drawCoords = coordsCheckbox.checked();
}

function newVector() {
  let xyMin = getCoords(-xAxisLimit, -yAxisLimit, basePlot2D);
  let xyMax = getCoords(xAxisLimit, yAxisLimit, basePlot2D);
  pts.push([random(xyMin[0],xyMax[0]), random(xyMin[1],xyMax[1])]);
  graphicsOffset.push([1, 1]);
  n += 1;
}

function sumVector() {

}

// a quick function to get the plot coordinates (x, y) at pixels (xPix, yPix). gPlot is the ID of your GPlot.
function loc(xPix, yPix, gPlot) {
  return gPlot.getValueAt(xPix, yPix);
}

// this does the opposite of loc(x, y, gPlot) but with coordinates to pixels
function getCoords(x, y, gPlot) {
  return gPlot.getScreenPosAtValue(x, y);
}

function DrawArrows(parentLayer) {
  if (drawArrows)
  {for (j = 0; j < n - 1; j++) {
    //i-hat arrow
    this.parentLayer = parentLayer;
    this.parentLayer.push();
    this.parentLayer.strokeWeight(3);
    this.parentLayer.stroke(255, 30, 30);
    this.parentLayer.line(pts[j][0]-10*graphicsOffset[j][0], pts[j][1], pts[j+1][0]+10*graphicsOffset[j][0], pts[j][1]);
    this.parentLayer.fill(255, 30, 30);
    this.parentLayer.triangle(pts[j+1][0]+10*graphicsOffset[j][0], pts[j][1],  pts[j+1][0]+16*graphicsOffset[j][0], pts[j][1]+3,  pts[j+1][0]+16*graphicsOffset[j][0], pts[j][1]-3);
    this.parentLayer.tint(255, 50, 50);
    this.parentLayer.image(iHat, 0.5*pts[j][0]+0.5*pts[j+1][0]-30, pts[j][1]-20-30*graphicsOffset[j][1], 0.09*iHat.width, 0.12*iHat.height);
    this.parentLayer.fill(255, 30, 30);
    this.parentLayer.textSize(18);
    this.parentLayer.noStroke();
    this.parentLayer.textAlign(LEFT);
    this.parentLayer.text("= ".concat((ptCoords[j+1][0]-ptCoords[j][0]).toFixed(1)), 0.5*pts[j][0]+0.5*pts[j+1][0]-30+0.2*iHat.width, pts[j][1]-20-30*graphicsOffset[j][1]+0.12*iHat.height);
    this.parentLayer.pop();

    //j-hat arrow
    this.parentLayer.push();
    this.parentLayer.strokeWeight(3);
    this.parentLayer.stroke(30, 30, 255);
    this.parentLayer.line(pts[j+1][0], pts[j][1] + 4*graphicsOffset[j][1], pts[j+1][0], pts[j+1][1] - 16*graphicsOffset[j][1]);
    this.parentLayer.fill(30, 30, 255);
    this.parentLayer.triangle(pts[j+1][0], pts[j+1][1] - 14*graphicsOffset[j][1],  pts[j+1][0] + 3, pts[j+1][1] - 20*graphicsOffset[j][1],  pts[j+1][0] - 3, pts[j+1][1] - 20*graphicsOffset[j][1]);
    this.parentLayer.tint(50, 50, 255);
    this.parentLayer.image(jHat, pts[j+1][0]-35-50*graphicsOffset[j][0], 0.5*pts[j][1]+0.5*pts[j+1][1], 0.11*jHat.width, 0.12*jHat.height)
    this.parentLayer.fill(30, 30, 255)
    this.parentLayer.textAlign(LEFT);
    this.parentLayer.textSize(18);
    this.parentLayer.noStroke();
    this.parentLayer.text("= ".concat((ptCoords[j+1][1]-ptCoords[j][1]).toFixed(1)), pts[j+1][0]-35-50*graphicsOffset[j][0]+0.2*jHat.width, 0.5*pts[j][1]+0.5*pts[j+1][1]+0.1*jHat.height);
    this.parentLayer.pop();
    }
  }
}

function DrawCoords(parentLayer) {
  if (drawCoords)
  {for (j = 0; j < n; j++) {
    this.parentLayer = parentLayer;
    //text
    this.parentLayer.push();
    if (j == 0) {
      let angle = atan2(pts[j][1]-pts[j+1][1], pts[j][0]-pts[j+1][0]);
      if (typeof offset[j] == "undefined")
        {offset.push(p5.Vector.fromAngle(angle, 50))}
      else if (typeof offset[j] == "object") {
        offset[j] = p5.Vector.fromAngle(angle, 50)
      };
    }
    else if (j < n - 1) {
      let midpointX = (pts[j+1][0]+pts[j-1][0])/2;
      let midpointY = (pts[j+1][1]+pts[j-1][1])/2;
      let angle = atan2(pts[j][1]-midpointY, pts[j][0]-midpointX);
      if (typeof offset[j] == "undefined")
        {offset.push(p5.Vector.fromAngle(angle, 50))}
      else if (typeof offset[j] == "object") {
        offset[j] = p5.Vector.fromAngle(angle, 50)
      };
    }
    else if (j == n - 1) {
      let angle = atan2(pts[j][1]-pts[j-1][1], pts[j][0]-pts[j-1][0]);
      if (typeof offset[j] == "undefined")
        {offset.push(p5.Vector.fromAngle(angle, 50))}
      else if (typeof offset[j] == "object") {
        offset[j] = p5.Vector.fromAngle(angle, 50)
      };
    }
    this.parentLayer.textAlign(CENTER);
    this.parentLayer.textSize(18);
    this.parentLayer.noStroke();
    this.parentLayer.fill(0);
    this.parentLayer.text("(".concat(ptCoords[j][0].toFixed(1),", ", ptCoords[j][1].toFixed(1),")"), pts[j][0] + offset[j].x, pts[j][1] + offset[j].y);
    /*if (j == n - 1) {//the for loop is 1 shorter than the number of points
      this.parentLayer.text("(".concat(ptCoords[j+1][0].toFixed(1),", ", ptCoords[j+1][1].toFixed(1),")"), pts[j+1][0]-50*graphicsOffset[j][0], pts[j+1][1]-10);
    }*/
    this.parentLayer.pop();
    }
  }
}

function DrawVectorText(parentLayer) {
  this.parentLayer = parentLayer;
  if (!drawArrows) {
    for (j = 0; j < n - 1; j++) {
      let angle = atan2(pts[j][1]-pts[j+1][1], pts[j][0]-pts[j+1][0]);
      if (angle > PI / 2 || angle < - PI / 2) {angle += -PI};
      this.parentLayer.push();
      this.parentLayer.textAlign(CENTER);
      this.parentLayer.textSize(18);
      this.parentLayer.noStroke();
      this.parentLayer.fill(0);
      this.parentLayer.translate((pts[j][0] + pts[j+1][0])/2, (pts[j][1] + pts[j+1][1])/2);
      this.parentLayer.rotate(angle);
      let jSign;
      if(ptCoords[j+1][1]-ptCoords[j][1] > 0) {jSign = "+ "} else {jSign = "- "}
      this.parentLayer.text("".concat((ptCoords[j+1][0]-ptCoords[j][0]).toFixed(1), " i ", jSign, abs(ptCoords[j+1][1]-ptCoords[j][1]).toFixed(1), " j"), 0, -10);
      this.parentLayer.pop();
    }
  }
}

// iteratively checks to see if the mouse is over any points. if so, sets rollover to "true" and sets the rollover ID to the point ID.
function MovePoints(parentLayer) {
  this.parentLayer = parentLayer;
  rolloverPt[0] = false;
  for (j = 0; j < n; j++) {
    if (mouseX > pts[j][0] - r &&
      mouseX < pts[j][0] + r &&
        mouseY > pts[j][1] - r &&
        mouseY < pts[j][1] + r) 
        {rolloverPt[0] = true; rolloverPt[1] = j;}

    ptCoords[j] = loc(pts[j][0], pts[j][1], basePlot2D);
    
    // put text to the right or left? above or below? helps with graphics placement
    if (j > 0) {
      if (pts[j-1][0] < pts[j][0]) {graphicsOffset[j-1][0] = -1} else {graphicsOffset[j-1][0] = 1}
      if (pts[j-1][1] < pts[j][1]) {graphicsOffset[j-1][1] = 1} else {graphicsOffset[j-1][1] = -1}
    }

    if (j == n - 1) {
      if (pts[j][0] > pts[j-1][0]) {graphicsOffset[j][0] = 1} else {graphicsOffset[j][0] = -1}
      if (pts[j][1] > pts[j-1][1]) {graphicsOffset[j][1] = 1} else {graphicsOffset[j][1] = -1}
    }
  }

  if (draggingPt[0]) 
    {this.parentLayer.fill(50); pts[draggingPt[1]] = [mouseX + mouseOffset[0], mouseY + mouseOffset[1]];}
  else if (rolloverPt[0]) {this.parentLayer.fill(100);}
  else {this.parentLayer.fill(175, 200);}
}

function DrawVectors(parentLayer) {
  for (j = 0; j < n - 1; j++) {
    this.parentLayer.push();
    this.parentLayer.strokeWeight(5);
    this.parentLayer.line(pts[j][0], pts[j][1], pts[j+1][0], pts[j+1][1]);
    this.parentLayer.pop();
        
    //the "draggable circles"
    this.parentLayer.push();
    this.parentLayer.circle(pts[j][0], pts[j][1], r*0.25);
    this.parentLayer.circle(pts[j+1][0], pts[j+1][1], r*0.25);
    this.parentLayer.pop();
  }
}

class vector3D {
  constructor(x, y, z) {
    this.x = x;
    this.y = -y;
    this.z = -z;

    let v0 = createVector(0, 1, 0);
    let v1 = createVector(this.x, this.y, this.z);
    let crossProd = p5.Vector.cross(v0, v1);
    let phi = Math.acos(this.y / v1.mag());
        
    push();
    rotate(phi, crossProd);
    translate(0, v1.mag()*100 / 2, 0);

    cylinder(3, 100 * v1.mag());
    translate(0, v1.mag()*100 / 2 + 2, 0);
    cone(10, 25);
    pop();
  }

  static cross(X1, Y1, Z1, X2, Y2, Z2) {
    let v0 = createVector(X1, Y1, Z1);
    let v1 = createVector(X2, Y2, Z2);
    let crossProd = p5.Vector.cross(v0, v1);

    new vector3D(crossProd.x, crossProd.y, crossProd.z);
  }
}

function draw() {
  background(255); // draws light gray background every frame

  switch(page) {
    case "vector addition":
      plotdraw2D.drawMethod();
      image(extraCanvas, 0, 0);
      extraCanvas.background(255);
      extraCanvas.clear();
      extraCanvas.fill(255);
      extraCanvas.stroke(0);

      MovePoints(extraCanvas);  
      DrawArrows(extraCanvas);
      DrawCoords(extraCanvas);
      DrawVectors(extraCanvas);
      DrawVectorText(extraCanvas);
      break;
    case "cross product":
      background(200);
      ambientLight(160, 160, 160);
      pointLight(255, 255, 255, 20, 20, 200);
      orbitControl(5, 5);
      ambientMaterial(135, 91, 209);
      new vector3D(x1, y1, z1);
      ambientMaterial(135, 191, 109);
      new vector3D(x2, y2, z2);
      vector3D.cross(x1, y1, z1, x2, y2, z2);
      break;
  }
  i++;
}

//note to self: make a "dragging function" that occurs if you drag the line instead of either dot.

function mousePressed() {
// Did I click on the point?
  for (j = 0; j < n; j++) {
    if (mouseX > pts[j][0] - r &&
      mouseX < pts[j][0] + r &&
       mouseY > pts[j][1] - r &&
        mouseY < pts[j][1] + r)  {
      draggingPt[0] = true;
      draggingPt[1] = rolloverPt[1];
      // If so, keep track of relative location of click to corner of rectangle
      mouseOffset = [pts[draggingPt[1]][0]-mouseX, pts[draggingPt[1]][1]-mouseY];
    }
  }
}

function mouseReleased() {
  // Quit dragging
  draggingPt[0] = false; 
}