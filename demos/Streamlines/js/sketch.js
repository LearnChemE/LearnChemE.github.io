// Setup function is from the p5.js library.  See https://p5js.org/reference/ for more info.  It is how I draw the grey canvas with the cylinder and arrows.
function setup() {
  createCanvas(600, 600);
  background(200);
}

// Initial reynolds number
let re = 50;
let viscosity = 1.19;
let velocity = 0.0425;
let density = 1400;

let diameter = 1;

//let visInp = document.getElementById("viscosity");
let vInp = document.getElementById("velocity");
let selection = document.getElementById("fluid-selection");
//let rhoInp = document.getElementById("density");
//let dInp = document.getElementById("diameter");

// Maximum arrow length (pixels)
let lineLength = 5;

// This means that the axis range is x = [-3, 3] and y = [-3, 3]
let canvasSize = 3;

// This updates the variable "re" to match the value of the slider

[vInp].forEach(inp => {
  inp.addEventListener("input",()=>{
    try { initValue() } catch(e) {}
  })
})

selection.addEventListener("change", updateFluid);

function updateFluid()
{
  switch(selection.value) {
    default:
      
      viscosity = 1.19;
      velocity = 0.0425;
      density = 1400;
      updateRe();
      updateProperty();
      break;
      
    break;

    //water
    case "1":
      
      viscosity = 0.00112;
      velocity = 0.0005;
      density = 999;
      updateRe();
      updateProperty();
      vInp.style.display = "none";
      break;
    //milk
    case "2":
      
      viscosity = 0.00336;
      velocity = 0.0005;
      density = 1027;
      updateRe();
      updateProperty();
      vInp.style.display = "none";
      break;
    //honey
    case "3":
      viscosity = 1.19;
      velocity = 0.0425;
      density = 1400;
      updateRe();
      updateProperty();
      vInp.style.display = "block";
      break;


    
  }
}

function initValue()
{
    velocity = Math.exp( vInp.value );  
    document.getElementById("velocityValue").innerHTML = `${formatNumber(velocity)}`;
    // We can span orders of magnitude by using Math.exp of the slider value
    //viscosity = Math.exp( visInp.value );
    //density = Math.exp( rhoInp.value );
    //diameter = Math.exp( dInp.value );

    //document.getElementById("viscosityValue").innerHTML = `${formatNumber(viscosity)}`;
    //document.getElementById("densityValue").innerHTML = `${formatNumber(density)}`;
    //document.getElementById("diameterValue").innerHTML = `${formatNumber(diameter)}`;
    updateRe();
    draw();
}

function updateRe()
{
  re = density * velocity * diameter / viscosity;
  document.getElementById("ReNumber").innerHTML = `${formatNumber(re)}`;
  return re;

}

function updateProperty(){
  document.getElementById("viscosityValue").innerHTML = `${formatNumber(viscosity)}`;
  document.getElementById("densityValue").innerHTML = `${formatNumber(density)}`;
  document.getElementById("velocityValue").innerHTML = `${formatNumber(velocity)}`;
 
}

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

// This function is from p5.js. It is called about 60 times per second 
function draw() {

  // Draw a grey background
  background(200);

  // Line thickness of 0.5 pixels (will default to 1 on most screens)
  strokeWeight(0.5);

  // Draw a circle in the middle of the canvas


  ellipse( width / 2, height / 2, width / canvasSize, width / canvasSize);

  // Every 20 pixels, draw an arrow from pt1 to pt2, except within the circle boundary
  for ( let canvasX = 0; canvasX < width; canvasX += 20 ) {
    for ( let canvasY = 0; canvasY < height; canvasY += 20 ) {

      // Normalize
      const x = ((canvasX - width / 2) / width) * 2 * canvasSize;
      const y = ((canvasY - height / 2) / height) * 2 * canvasSize;
      // const edge = ((height / 2 - d_pixels/2 ) / height) * 2 * canvasSize;
      
      if ( x**2 + y**2 > 1.05 ) {
        const u = U(re, x, y);

        const pt1 = { 
          x : canvasX - lineLength * u[0],
          y : canvasY - lineLength * u[1] 
        };

        const pt2 = {
          x : canvasX + lineLength * u[0],
          y : canvasY + lineLength * u[1]
        };

        // push(), pop(), translate(), rotate(), line(), and triangle() are part of p5.js
        push();
          translate( ( pt1.x + pt2.x ) / 2, ( pt1.y + pt2.y ) / 2);
          rotate( Math.atan2( pt2.y - pt1.y, pt2.x - pt1.x ) );
          const m = 10;
          // strokeWidth()
          // p5.js library for info on styling
          line( -m, 0, m, 0 );
          triangle( m, 0, m / 3, m / 6, m / 3, -m / 6 );
        pop();
      }

    }
  }
}

// Everything from here down is just math copied from https://demonstrations.wolfram.com/FlowAroundASphereAtFiniteReynoldsNumberByGalerkinMethod/

function A1(re) {
  const r = re**2;

  const c1 = ( ( 2.7391417851819595e11 + r * (2.1079461581884886e9 + r * (3.609662630935375e4 + 3.3644813668472526 * r ) ) + 100 * re * Math.sqrt( ( 1.2735686181258997e17 + r * (4.388552339698552e14 + r * (1.776934907636144e10 + r * (1.1512716122770787e6 + 57.95077149780876 * r ) ) ) ) ) ) ) ** ( 1 / 3 );

  const c2 = 100 * (1.3636505692563244 * ( r - 85.79134132307645**2 ) * ( r - 50.51906885775793**2 ) );

  const c3 = c2 / c1 + 60.73294576824199 * c1;

  const c4 = Math.sqrt( 41.715270532950086 + ( -788846.5185368055 + c3 ) / r );
  
  return ( ( c4 - Math.sqrt( 83.43054106590017 + ( ( 5.686988475331831e7 + 1474.4854794642922 * r ) / ( r * c4 ) - ( 1.5776930370736108e6 + c3 ) / r ) ) ) / 2 - 2.8781637206259836 );
}

function A2(re) {
  return -15 / 29 * ( 8 + 5 * A1(re) )
}

function A3(re) {
  return 9 / 29 * ( 17 + 7 * A1(re) )
}

function A4(re) {
  return -1 / 58 * ( 95 + 34 * A1(re) )
}

function B1(re) {
  const c = A1(re);

  return - 1 * ( 44.689656 + 9.931035 * c ) / ( ( 0.011713 - 0.002546 * c ) * re )
}

function B2(re) {
  return -23/9 * B1(re)
}

function B3(re) {
  return 19 / 9 * B1(re)
}

function B4(re) {
  return - 5 / 9 * B1(re)
}

function Ur0(re, r, th) {
  const cos = Math.cos(th);
  const sin = Math.sin(th); 
  const r2 = 1 / (r * r);
  let r3, r4, r5, r6;

  r3 = r2 / r;
  r4 = r2 * r2;
  r5 = r2 * r3;
  r6 = r3 * r3;

  return [
    
    ( 1 + 2 * ( A1(re) * r3 + A2(re) * r4 + A3(re) * r5 + A4(re) * r6 ) ) * cos + ( B1(re) * r3 + B2(re) * r4 + B3(re) * r5 + B4(re) * r6 ) * ( 3 * cos**2 - 1 ),
    
    ( -1 + A1(re) * r3 + 2 * A2(re) * r4 + 3 * A3(re) * r5 + 4 * A4(re) * r6 ) * sin + ( B1(re) * r3 + 2 * B2(re) * r4 + 3 * B3(re) * r5 + 4 * B4(re) * r6 ) * sin * cos
  
  ]
}

function Psi(re, r, th) {
  let r2 = r * r;
  let r3, r4;
  let sin2 = Math.sin(th)**2;
  
  r3 = r2 * r;
  r4 = r2 * r2;
 
  return ( ( r2 / 2 + A1(re) / r + A2(re) / r2 + A3(re) / r3 + A4(re) / r4 ) * sin2 + ( B1(re) / r + B2(re) / r2 + B3(re) / r3 + B4(re) / r4 ) * Math.cos(th) * sin2 )
}

function U(re, x, y) {
  const r = Math.sqrt( x**2 + y**2 );
  const th = Math.atan2(y, x);

  function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1]
  }
  
  const ur = Ur0(re, r, th);
  const m1 = [ Math.cos(th), -1 * Math.sin(th) ];
  const m2 = [ Math.sin(th), Math.cos(th) ];

  return [ dot(ur, m1), dot(ur, m2) ]
}

