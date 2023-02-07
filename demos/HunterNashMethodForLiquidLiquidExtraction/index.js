

window.g = {
  cnv: undefined,
 
  gridTruth: true,
  pointType : 'count-stages',
  feedMoleFracs : [0.53,0.05,0.42],
  mix : 'raffinate',
  tieSlider : 0,
  radius: 7,
  phaseInfopx : [],


  // Info about triangle 
  xtip : 475,
  ytip : 70,
  dx : 0,
  dy : 0,
  angle : 60,
  L : [], // m and b value for left edge of triangle
  R : [], // m and b values for right edge of triangle
}

let sFracs = {
  solu : 0,
  solv : 1,
  carr : 0,
}

let rFracs = {
  solu : 0.03,
  solv : 0.01,
  carr : 0.96,
}

// Holds info about tie lines slope and y-intercept and x & y coords of intercepts
let tie = {
  // x-coords of tie lines from mathematica
  xLeft : [0.03507,0.05151,0.07973,0.1258,0.1839],
  xRight : [0.976,0.9318,0.8286,0.7182,0.5766],
}

function setup() {
  g.cnv = createCanvas(800, 600);

  g.cnv.parent("graphics-wrapper");

  document.getElementsByTagName("main")[0].remove();
  
  // phaseToPixels();
  // tieInfo();
  triangleDataFill();

}

function draw() {
  background(250);
  triangleDraw();
 
  
  
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

  
 
  
}

const plotPointsOptions = document.getElementById("plot-points-options");
const pointType = document.getElementById("point-type");
const sliderContainer = document.getElementById("slider-container");
const firstRadio = document.getElementById("point-type").children;
const gridLines = document.getElementById("grid-lines");
const feedFracs = document.getElementById("feed-mole-fracs");



const secondRadio = document.getElementById("plot-points-options").children;
const tie_slider = document.getElementById("tie-slider");
const tie_label = document.getElementById("tie-slider-value");



gridLines.addEventListener("change", () => {
  g.gridTruth = gridLines.checked;
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

feedFracs.addEventListener("change", function () {
  const temp = feedFracs.value;

  if(temp == "0.53/0.05/0.42"){
    g.feedMoleFracs[0] = 0.53;
    g.feedMoleFracs[1] = 0.05;
    g.feedMoleFracs[2] = 0.42;
  } else if (temp == "0.45/0.08/0.48"){
    g.feedMoleFracs[0] = 0.45;
    g.feedMoleFracs[1] = 0.08;
    g.feedMoleFracs[2] = 0.48;
  } else if (temp == "0.48/0.15/0.36"){
    g.feedMoleFracs[0] = 0.48;
    g.feedMoleFracs[1] = 0.15;
    g.feedMoleFracs[2] = 0.36;
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
