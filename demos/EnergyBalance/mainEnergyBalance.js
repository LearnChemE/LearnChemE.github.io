// Global variables
let distColImg;
var nextButton;
var cnv;
var cnvWidth;
var cnvHeight;
var bG = [255, 200, 230];

function centerCanvas() {
  cnvWidth = Math.min(windowWidth, 1200);
  cnvHeight = Math.min(windowHeight, 1000);
  resizeCanvas(cnvWidth, cnvHeight);
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  cnv.position(x, y);
  nextButton.position(x + 10, y + 10);
}

function setup() {
  var F = random(10, 50);
  var D = 0.5 * F;
  var B = (1 - 0.5) * F;

  cnvWidth = Math.min(windowWidth, 600);
  cnvHeight = Math.min(windowHeight, 600);

  cnv = createCanvas(cnvWidth, cnvHeight);
  
  nextButton = createButton('next step');
  nextButton.mousePressed(performAction);
  
  centerCanvas();
  
  background(255, 200, 230);
}

function windowResized() {
  centerCanvas();
}

function performAction() {
  bG = [random(100, 200), random(200, 255), random(0, 255)];
}

function draw() {
  background.apply(this, bG);
}
