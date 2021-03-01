let cnv;

const coords = {
  topPlateY: 50,
  bottomPlateY: 350,
}

function setup() {
  cnv = createCanvas(500, 400);
}

function draw() {
  background(255, 255, 255);
  drawPlates();
  drawAxes();
  drawContour();
}

function drawPlates() {
  fill(200, 200, 200);
  noStroke();
  rect(30, coords.topPlateY, 420, 10);
  rect(30, coords.bottomPlateY, 420, 10);
}

function drawAxes() {
  // line()
  /*
  for( let i = 0; i < numberOfTicks; i++ ) {
    line() for each tick on x and y axis
  }
  */
}

// Write this to convert from coordinate plane to pixel location
function coordinateToPixel(x, y) {
  let pixels = [x, y];

  return pixels;
}

function drawContour() {

  noFill();
  stroke(0, 0, 255);
  beginShape();

    vertex(30, 50);
    vertex(35, 80);
    vertex(50, 90);
    vertex(90, 90);
    vertex(80, 180);

  endShape();
}
