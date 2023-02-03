

window.g = {
  cnv: undefined,
 
  gridTruth: false,
  compTruth: false,
  pointType : 'plot-points',
  
  mix : 'feed',
  tieSlider : 0,

  radius: 7,
  points: [],
  nP: 1,
  dragPoint: null,

  phaseInfopx : [],

  
  R : [1,-100], // m and b values for right edge of triangle
}

let sFracs = {
  solu : 0,
  solv : 0.05,
  carr : 0.95,
}

let rFracs = {
  solu : 0.02,
  solv : 0.88,
  carr : 0.10,
}

// Holds info about tie lines slope and y-intercept and x & y coords of intercepts
let tie = {
  b : [500],
  m : [0],
  pos : [[195,555,500,500]],
  // x-coords of tie lines from mathematica
  xLeft : [0.1014, 0.1036, 0.1072, 0.1127, 0.1218, 0.1391],
  xRight : [0.8404, 0.7544, 0.6532, 0.5463, 0.4395, 0.3322],
}

function setup() {
  g.cnv = createCanvas(700, 600);

  g.cnv.parent("graphics-wrapper");

  document.getElementsByTagName("main")[0].remove();
  for (let i = 0; i < g.nP; i++) {
    g.points.push(createVector(300, 250));
  }
  phaseToPixels();
  tieInfo();

}

function draw() {
  background(250);
  triangleDraw();
  disabler(); // This function is used for enabling/disabled the extraneous buttons
  
  switch (g.pointType){
    case 'plot-points':
      plotPoints();
      break;
    case 'mixing-point':
      mixingPoint();
      break;
    case 'determine-e1':
      determineE1();
      break;
    case 'operating-point':
      operatingPoint();
      break;
    case 'count-stages':
      countStages();
      break;
  }
 
  push();
  fill(0);
  for (let p of g.points) {
    circle(p.x, p.y, g.radius * 2);
  }
  pop();
}

const plotPointsOptions = document.getElementById("plot-points-options");
const pointType = document.getElementById("point-type");
const sliderContainer = document.getElementById("slider-container");
const firstRadio = document.getElementById("point-type").children;
const gridLines = document.getElementById("grid-lines");
const carrierComp = document.getElementById("carrier-compositions");


const secondRadio = document.getElementById("plot-points-options").children;
const tie_slider = document.getElementById("tie-slider");
const tie_label = document.getElementById("tie-slider-value");



gridLines.addEventListener("change", () => {
  g.gridTruth = gridLines.checked;
});
carrierComp.addEventListener("change", () =>{
  g.compTruth = carrierComp.checked;
});

for(let i = 0; i < firstRadio.length; i++){
  firstRadio[i].addEventListener("click",function (){
    for(let j = 0; j < firstRadio.length; j++){
      firstRadio[j].classList.remove("selected");
    };
    firstRadio[i].classList.add("selected");
    g.pointType = firstRadio[i].value;
  });
};


pointType.addEventListener("input", () => {
  if(firstRadio[0].checked) {
    plotPointsOptions.style.display = "inline-flex";
    sliderContainer.style.display = "none";
  }
  
  if(firstRadio[2].checked) {
    plotPointsOptions.style.display = "none";
    sliderContainer.style.display = "none";
  }
  
  if(firstRadio[4].checked) {
    plotPointsOptions.style.display = "none";
    sliderContainer.style.display = "none";
  }
  
  if(firstRadio[6].checked) {
    plotPointsOptions.style.display = "none";
    sliderContainer.style.display = "none";
  }
  
  if(firstRadio[8].checked) {
    plotPointsOptions.style.display = "none";
    sliderContainer.style.display = "grid";
  }
});

for(let i = 0; i < secondRadio.length; i++){
  secondRadio[i].addEventListener("click", function(){
    for(let j = 0; j < secondRadio.length; j++){
      secondRadio[j].classList.remove("selected");
    };
    secondRadio[i].classList.add("selected");
    g.mix = secondRadio[i].value;
  });
}

tie_slider.addEventListener("input", function(){
  const temp = Number(tie_slider.value);
  tie_label.innerHTML = `${temp}`;
  g.tieSlider = temp;
});


function disabler(){
  switch (g.pointType){
    case 'plot-points':
      secondRadio.disabled = false;
      tie_slider.disabled = true;
      break;
    case 'mixing-point':
      secondRadio.disabled = true;
      tie_slider.disabled = true;
      break;
    case 'determine-e1':
      secondRadio.disabled = true;
      tie_slider.disabled = true;
      break;
    case 'operating-point':
      secondRadio.disabled = true;
      tie_slider.disabled = true;
      break;
    case 'count-stages':
      secondRadio.disabled = true;
      tie_slider.disabled = false;
      break;
  }
}

// For manipulating the position of dot within the triangle (limited range of compositions)
function mousePressed() {
  for (let i = g.points.length - 1; i >= 0; i--) {
    const isPressed = inCircle(g.points[i], g.radius);
    if (isPressed) {
      g.dragPoint = g.points.splice(i, 1)[0];
      g.points.push(g.dragPoint);

    }
  }
}

function mouseDragged() {
  let lx = 262.5; let rx = 316.5; // left and right x
  let by = 288.5; let ty = 230; // top and bottom y

  if(g.dragPoint){
    if(mouseX < lx && mouseY > ty && mouseY < by){ // left of square within y-lims
      g.dragPoint.x = lx;
      g.dragPoint.y = mouseY;
    } else if (mouseX < lx && mouseY < ty){ // left and above square
      g.dragPoint.x = lx;
      g.dragPoint.y = ty;
    } else if (mouseX < lx && mouseY > by){ // left and below square
      g.dragPoint.x = lx;
      g.dragPoint.y = by;
    } else if (mouseX > lx && mouseX < rx && mouseY < ty){ // above square
      g.dragPoint.x = mouseX;
      g.dragPoint.y = ty;
    } else if (mouseX > rx && mouseY < ty){// right and above square
      g.dragPoint.x = rx;
      g.dragPoint.y = ty;
    } else if (mouseX > rx && mouseY > ty && mouseY < by){ // right of square
      g.dragPoint.x = rx;
      g.dragPoint.y = mouseY;
    } else if (mouseX > rx && mouseY >= by){ // right and below square
      g.dragPoint.x = rx;
      g.dragPoint.y = by;
    } else if (mouseY > by){ // below square
      g.dragPoint.x = mouseX;
      g.dragPoint.y = by;
    } else if (mouseX < rx && mouseX > lx && mouseY > ty && mouseY < by){ // within the square
      g.dragPoint.x = mouseX;
      g.dragPoint.y = mouseY;
    }
  }
}

function mouseReleased() {
  g.dragPoint = null;
}
function inCircle(pos, radius) {
  return dist(mouseX, mouseY, pos.x, pos.y) < radius;
}


// Copied from Mathematica's source code
const phaseInfo = [[0.1, 0], [0.1021, 0.05104], [0.105, 0.098], [0.108, 0.1422], [0.113, 0.183], [0.1181, 0.22], [0.125, 0.254], [0.132, 0.2853], [0.14, 0.313], [0.149, 0.338], [0.159, 0.36], [0.17, 0.379], [0.181, 0.396], [0.194, 0.4093], [0.2082, 0.42], [0.222, 0.429], [0.2382, 0.435], [0.254, 0.438], [0.271, 0.44], [0.29, 0.438], [0.309, 0.435], [0.329, 0.429], [0.3503, 0.422], [0.372, 0.4123], [0.395, 0.4], [0.419, 0.387], [0.444, 0.371], [0.4703, 0.354], [0.497, 0.335], [0.525, 0.315], [0.554, 0.292], [0.584, 0.269], [0.615, 0.244], [0.647, 0.217], [0.68, 0.19], [0.714, 0.161], [0.749, 0.131], [0.785, 0.099], [0.8231, 0.067], [0.861, 0.034], [0.9, 0.]];
// Adds additional points to help the resolution on whether or not the dot is within the phase envelope
for (let i = 0; i < phaseInfo.length - 1; i += 2) {
  let x, y;
  x = phaseInfo[i][0] + 1 / 2 * (phaseInfo[i + 1][0] - phaseInfo[i][0]);
  y = phaseInfo[i][1] + 1 / 2 * (phaseInfo[i + 1][1] - phaseInfo[i][1]);
  phaseInfo.splice(i + 1, 0, [x, y]);
}


// For converting the phase info to pixel coordinates
function phaseToPixels(){
  for(let i = 0; i < phaseInfo.length; i++){
    let x,y;
    x = map(phaseInfo[i][0],0,1,150,600);
    y = map(phaseInfo[i][1],0,1,500,50);
    g.phaseInfopx.push([x,y]);
  }
}

// Data for generating squiggle thing in operating point mode
let squiggle = [[145.7205387205387, 11.176206509539844],[148.72951739618406, 16.334455667789],[154.31762065095398, 29.230078563411897],[147.86980920314255, 44.704826038159375],[154.74747474747474, 63.61840628507295],[147.43995510662177, 80.38271604938272],[154.74747474747474, 96.71717171717172],[147.86980920314255, 113.91133557800225],[147.86980920314255, 122.93827160493828]]
