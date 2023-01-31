window.g = {
  cnv : undefined,

  pressureTruth : true,
  enthalpyTruth : false,
  qualityTruth : true,
  gridTruth : true,
  phaseTruth : false,

  // Edge locations of the graph, will be used repeatedly
  xL : 100,
  xR : 700,
  by : 540,
  ty : 40,

  
  
}

let SQ = []; 
let SL = []; // Saturated liquid
let SV = []; // Saturated vapor
let qualityLines = [];
let pressureLines = [];

function setup() {
  g.cnv = createCanvas(800, 600);
  g.cnv.parent("graphics-wrapper");
  document.getElementsByTagName("main")[0].remove();

  phaseEnvelopeCalcs();
  qualityLineCalcs();
  pressureLineCalcs();


}

function draw() {
  background(250);
  graphDraw();
 
  if(g.gridTruth){
    drawGrid();
  }
  if(g.phaseTruth){
    phaseCurveDraw();
  }
  
  if(g.pressureTruth){
    pressureLineDraw();
  }
  if(g.qualityTruth){
    qualityLineDraw();
  }
  
  
}


const pressure = document.getElementById("pressure");
const enthalpy = document.getElementById("enthalpy");
const quality = document.getElementById("quality");
const gridLines = document.getElementById("grid-lines");
const phaseEnvelope = document.getElementById("phase-envelope");

pressure.addEventListener("change", () =>{
  g.pressureTruth = pressure.checked;
});

enthalpy.addEventListener("change", () =>{
  g.enthalpyTruth = enthalpy.checked;
});

quality.addEventListener("change", () =>{
  g.qualityTruth = quality.checked;
});

gridLines.addEventListener("change", () =>{
  g.gridTruth = gridLines.checked;
});

phaseEnvelope.addEventListener("change", () =>{
  g.phaseTruth = phaseEnvelope.checked;
});


