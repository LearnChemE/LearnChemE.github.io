/****************************/
/***** GLOBAL VARIABLES******/
/****************************/

let cnv; // p5.js canvas variable
let dPdz = 0.65; // default pressure gradiant = 0.65 Pa/m
let R = 0.025; // pipe radius, default 2.5 cm
let mu = 0.00112; // dynamic viscosity, default 1e-3 Pa*s
let pixelsPerMeter = 6000; // number of pixels corresponding to one meter
let averageVelocity = 0.045; // average fluid velocity
let Q = 0; // fluid volumetric flow rate (m^3 / s)
let u_pix = 0; // width in pixels of the average velocity bar
let Re = 2024; // Reynolds number, dimensionless parameter

const coords = {
  topPlateY: 40,// +0.025
  bottomPlateY: 350, // -0.025
}

const radiusSlider = document.getElementById("radius-slider");
const dPdzSlider = document.getElementById("dpdz-slider");
const muSlider = document.getElementById("viscosity-slider");

/****************************/
/********** SETUP ***********/
/****************************/

[radiusSlider, dPdzSlider, muSlider].forEach(inp => {
  inp.addEventListener("input",()=>{
    update();
  })
});

function setup() {
  cnv = createCanvas(500, 400);
  noLoop();
}

/****************************/
/******* CALCULATIONS *******/
/****************************/

function velocity(r) { return ( R**2 / ( 4 * mu ) ) * dPdz * ( 1 - ( r**2 / R**2 ) ) }

function calcAverageVelocity()
{
  Q = Math.PI * dPdz * ( 2 * R )**4 / ( mu * 128 );
  averageVelocity = Q / ( Math.PI * R**2 );
}

function calcReynolds()
{
  Re = R * 2 * 1000 * averageVelocity / mu;
}

function calcSliderLimits()
{

  const maxRadius = 0.025;
  const maxReynolds = 2100; 
  const reynoldsLimited = maxReynolds * mu / ( 1000 * 2 * maxRadius );
  let maxAveV;
  if ( dPdz > 0 ) { maxAveV = 0.06 < reynoldsLimited ? 0.06 : reynoldsLimited } else { maxAveV = 0.01 < reynoldsLimited ? 0.01 : reynoldsLimited }
  const maxQ = Math.PI * ( maxRadius**2 ) * maxAveV;
  const maxP = (maxQ * mu * 128) / ( Math.PI * ((maxRadius*2)**4 ));

  if( dPdz > maxP ) {
    dPdz = maxP;
    dPdzSlider.value = String( maxP );
    dPdzSlider.setAttribute("max", String( maxP ));
  } else {
    if( Math.abs( dPdz ) > maxP ) {
      dPdz = -1 * maxP;
      dPdzSlider.value = String( -1 * maxP );
    }
    dPdzSlider.setAttribute("min", String( -1 * maxP ) );
    dPdzSlider.setAttribute("max", String( maxP ) );
  }
  
  document.getElementById("dpdz-value").innerHTML = formatNumber( Number( -1 * dPdz ) );
  
}

/****************************/
/**** MAIN UPDATE EVENTS ****/
/****************************/

function update()
{
  R = Number( radiusSlider.value );
  dPdz = Number( dPdzSlider.value );
  mu = Math.exp( Number( muSlider.value ) );

  calcAverageVelocity();
  calcReynolds();
  calcSliderLimits();

  document.getElementById("radius-value").innerHTML = ( 100 * R ).toFixed(1);
  document.getElementById("viscosity-value").innerHTML = formatNumber( mu );
  coords.topPlateY = 200 - R * pixelsPerMeter - 10;
  coords.bottomPlateY = 200 + R * pixelsPerMeter;
  redraw();

  document.getElementById("Qdata").innerHTML = formatNumber( Q * ( 100**3 ) );
  document.getElementById("averageVelocity-data").innerHTML = formatNumber( 100 * averageVelocity );
  document.getElementById("maxVelocity-data").innerHTML = formatNumber( velocity( 0 ) * 100 );
  document.getElementById("Re-data").innerHTML = formatNumber( Re );

}

/****************************/
/********* GRAPHICS *********/
/****************************/


function draw() {
  background(255, 255, 255);
  drawPlates();
  drawAverage();
  drawAxes();
  drawContour();
}

function drawPlates() {
  push();
    fill(200, 200, 200);
    noStroke();
    rect(30, coords.topPlateY, 420, 10);
    rect(30, coords.bottomPlateY, 420, 10);
  pop();
}

function drawAxes() {
  push();
    line(100,25,100,375);
    line(30,200,470,200);

    textAlign(CENTER, TOP);
    for( let j = 0.01; j <= 0.12; j += 0.01 ) {
      const x_pix = j * pixelsPerMeter / 2 + 100;
      line( x_pix, 197, x_pix, 200 );
      text( ( j * 100 ).toFixed( 0 ), x_pix, 205 );
    }

    textAlign(RIGHT, CENTER);
    for( let j = -0.25; j <= 0.25; j += 0.05 ) {
      const y_pix = 200 - j * ( pixelsPerMeter / 10 ); //200 center line, 
      line(100, y_pix, 103, y_pix);
      if ( Math.abs(j) > 0.01 ) {
        text( ( j * 10 ).toFixed( 1 ), 95, y_pix );
      }
    }

    fill( 0, 0, 0 );
    triangle(470, 197, 470, 203, 480, 200);
    text('r (cm)', 60, 25);
    text('u (cm/s)', 455, 225);
  pop();
}

function drawAverage()
{
  const u_pix = averageVelocity * pixelsPerMeter / 2;
  push();
    noStroke();
    fill(255, 200,200);
    rect( 100, coords.topPlateY + 10, u_pix, coords.bottomPlateY - coords.topPlateY -10 );
  pop();
}

function drawContour() {
  push();
    noFill();
    stroke(0, 0, 255);
    beginShape();
      for( let i = coords.topPlateY + 10; i < coords.bottomPlateY + 1; i++ ) {
        const r = ( i - 200 ) / pixelsPerMeter;
        const u = velocity( r );
        u_pix = u * pixelsPerMeter / 2 + 100;
        vertex(u_pix, i);
      }
    endShape();
  pop();
}

/****************************/
/**** UTILITY FUNCTIONS *****/
/****************************/

function formatNumber(num) {
  let n = Number.parseFloat(num);
  if (isNaN(n)) { n = 0 }
  n = Math.round(n * 10000) / 10000;
  if ( n === 0 ) { return 0 }
  else if ( Math.abs( n ) >= 10 ) { return Number.parseInt(n).toFixed(0) }
  else if ( Math.abs( n ) >= 1 ) { return Number( Math.round( n * 100 ) / 100 ).toFixed(1) }
  else if ( Math.abs( n ) >= 0.01 ) {
      return Number( Math.round( n * 1000 ) / 1000 ).toFixed(2);
  }
  else if ( Math.abs( n ) >= 0.001 ) {
    return Number( Math.round( n * 10000 ) / 10000 ).toFixed(3);
  }

  else if ( Math.abs( n ) >= 0.0001 ) {
    return Number( Math.round( n * 1000000 ) / 1000000 ).toFixed(4);
  }

  else throw "wtf";
  
}