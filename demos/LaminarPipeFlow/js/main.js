let cnv;
let pressureGradient = 0.65;
let radius = 0.025;
let mu = 0.00112;
let oneMeter = 6000; //pix
let averageVelocity = 0;
let Q = 0;
let u_pix = 0;
let reynoldNumber = 2024;

const coords = {
  topPlateY: 40,// +0.025
  bottomPlateY: 350, // -0.025
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
  else if ( n >= 1 ) { return Number( Math.round( n * 100 ) / 100 ).toFixed(1) }
  else if ( n >= 0.01 ) {
      return Number( Math.round( n * 1000 ) / 1000 ).toFixed(3);
  }
  else if ( n >= 0.001 ) {
    return Number( Math.round( n * 10000 ) / 10000 ).toFixed(4);
  }

  else if ( n >= 0.0001 ) {
    return Number( Math.round( n * 1000000 ) / 1000000 ).toFixed(4);
  }
  else if ( n <= -1 ) { return Number.parseInt(n).toFixed(0) }
  else if ( n <= -0.0001 ) {
    return Number( Math.round( n * 10000 ) / 10000 ).toFixed(4);
  }
  
}

function update()
{
  radius = vRadius.value;
  pressureGradient = vPressureGradient.value;
  mu = Math.exp(vMu.value);
  updatePressureSlider();
  document.getElementById("radius-value").innerHTML = Number(radius*100).toFixed(1);
  document.getElementById("viscosity-value").innerHTML = formatNumber(mu);
  coords.topPlateY = 200 - radius * oneMeter - 10;
  coords.bottomPlateY = 200 + radius * oneMeter;
  redraw();

  document.getElementById("Qdata").innerHTML = formatNumber(Q*1000000);
  document.getElementById("averageVelocity-data").innerHTML = formatNumber(averageVelocity*100);
  document.getElementById("maxVelocity-data").innerHTML = formatNumber(velocityProfile(0, pressureGradient, mu)*100);
  document.getElementById("Re-data").innerHTML = formatNumber(reynolds());


  
}

function updatePressureSlider()
{
  //calculate max pressure
  maxAveV = 2100*mu/(50); //radius*2*1000
  maxQ = maxAveV*2.5**2*pi;
  maxP = maxQ*mu*128/3.1415926/625;
  console.log(maxP);
  
  if(pressureGradient>maxP)
  {
    pressureGradient = maxP;
    vPressureGradient.value = maxp;
    vPressureGradient.setAttribute("max",maxP);
    document.getElementById("dpdz-value").innerHTML = Number(pressureGradient*-1).toFixed(2);
    return;
  }
  if(pressureGradient<=maxP)
  {
    vPressureGradient.setAttribute("max",maxP);
    document.getElementById("dpdz-value").innerHTML = Number(pressureGradient*-1).toFixed(2);
    return;
  }
  

}

function reynolds()
{
  reynoldNumber = radius*2*1000*averageVelocity/mu;
  return reynoldNumber;
}

function setup() {
  cnv = createCanvas(500, 400);
  noLoop();
}

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
    for(j = 0.01; j <= 0.12; j= j+0.01)
    {
      x_pix = j*oneMeter/2+100;
      line(x_pix, 197, x_pix,200);
      text((j*100).toFixed(0),x_pix-15,212);
    }

    for(j = -0.25; j <= 0.25; j= j+0.05)
    {
      y_pix = 200-j*(oneMeter/10); //200 center line, 
      line(100, y_pix, 103, y_pix);
      if(j < 0)
        text((j*10).toFixed(1), 75,y_pix-2);
      else
        text((j*10).toFixed(1), 80,y_pix-2);
    }

    fill(0,0,0)
    //triangle(97, 25, 103,25, 100, 15);
    triangle(470, 197, 470, 203, 480, 200);
    text('r (cm)', 60, 25);
    text('u (cm/s)', 455, 225);

  pop();
}

// Write this to convert from coordinate plane to pixel location
function coordinateToPixel(x, y) {
  let pixels = [x, y];

  return pixels;
}

function velocityProfile(r,p,m)
{
  //pix to r
  
  u = radius**2/(4*m)*p*(1-r**2/radius**2);
  

  //u_pix = (rp-200)**2/100 + 100
  
  return u;
}

function drawContour() {
  push();
    noFill();
    stroke(0, 0, 255);
    beginShape();
      for(i = coords.topPlateY+10; i < coords.bottomPlateY+1; i++)
      {
        r = (i - 200)/oneMeter;
        u = velocityProfile(r,pressureGradient,mu);
        u_pix = u*oneMeter/2+100;
        vertex(u_pix, i);
      }
    endShape();
  pop();
}

function averageV(r,p,m)
{
  pi = 3.1415926;
  Q = pi * p*(2*r)**4/m/128;
  averageVelocity = Q/r**2/pi;
  return averageVelocity;

}

function drawAverage()
{
  v = averageV(radius,pressureGradient,mu);
  u_pix = v*oneMeter/2;
  push();
    noStroke();
    fill(255, 200,200);
    rect(100,coords.topPlateY+10, u_pix, coords.bottomPlateY - coords.topPlateY -10);
  pop();
}