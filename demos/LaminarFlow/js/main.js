let cnv;
let pressureGradient = 0.5;
let radius = 0.05;
let mu = 0.00112;
let oneMeter = 3000;
const coords = {
  topPlateY: 40,// 1m
  bottomPlateY: 350, // 1m
}

vRadius = document.getElementById("radius-slider");
vPressureGradient = document.getElementById("dpdz-slider");
vMu = document.getElementById("viscosity-slider");

[vRadius,vPressureGradient,vMu].forEach(inp => {
  inp.addEventListener("input",()=>{
    try { update() } catch(e) {}
  })
})

function formatNumber(num) {
  let n = Number.parseFloat(num);
  if (isNaN(n)) { n = 0 }
  n = Math.round(n * 10000) / 10000;
  if ( n === 0 ) { return 0 }
  else if ( n >= 10 ) { return Number.parseInt(n).toFixed(0) }
  else if ( n >= 1 ) { return Number( Math.round( n * 100 ) / 100 ).toFixed(2) }
  else if ( n >= 0.01 ) {
      return Number( Math.round( n * 1000 ) / 1000 ).toFixed(3);
  }
  else if ( n >= 0.001 ) {
    return Number( Math.round( n * 10000 ) / 10000 ).toFixed(4);
  }

  else if ( n >= 0.0001 ) {
    return Number( Math.round( n * 100000 ) / 100000 ).toFixed(4);
  }
 
}

function update()
{
  radius = vRadius.value;
  pressureGradient = vPressureGradient.value;
  mu = Math.exp(vMu.value);
  document.getElementById("dpdz-value").innerHTML = pressureGradient;
  document.getElementById("radius-value").innerHTML = radius;
  document.getElementById("viscosity-value").innerHTML = formatNumber(mu);
  coords.topPlateY = 200 - radius * 3000 - 10;
  coords.bottomPlateY = 200 + radius * 3000;
  setup();
  draw();
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
  
  line(30,200,50,50);
}

// Write this to convert from coordinate plane to pixel location
function coordinateToPixel(x, y) {
  let pixels = [x, y];

  return pixels;
}

function velocityProfile(rp)
{
  //pix to r
  r = (rp - 200)/oneMeter;
  u = radius**2/(4*mu)*pressureGradient*(1-r**2/radius**2);
  u_pix = u*oneMeter/5+100;

  //u_pix = (rp-200)**2/100 + 100
  
  return u_pix;
}

function drawContour() {

  noFill();
  stroke(0, 0, 255);
  beginShape();
    for(i = coords.topPlateY+10; i < coords.bottomPlateY+1; i++)
    {
      pixCoord = velocityProfile(i);
      vertex(pixCoord, i);
    }
  endShape();
}
