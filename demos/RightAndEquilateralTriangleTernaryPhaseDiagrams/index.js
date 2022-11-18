

window.g = {
  cnv : undefined,
  triangle : 'right-triangle',
  phaseTruth : false,
  gridTruth : true,
  soluteTruth : false,
  solventTruth : false,
  carrierTruth : false,


}

function setup() {
  g.cnv = createCanvas(800, 600);

  g.cnv.parent("graphics-wrapper");

  document.getElementsByTagName("main")[0].remove();
  noLoop();
}

function draw() {
  background(250);
  
  console.log(`phase: ${g.phaseTruth}`)
  console.log(`grid: ${g.gridTruth}`)
  console.log(`solute: ${g.soluteTruth}`)
  console.log(`solvent: ${g.solventTruth}`)
  console.log(`carrier: ${g.carrierTruth}`)

  switch (g.triangle){
    case 'right-triangle':
      rightTriangle();
      break;
    case 'equilateral-triangle':
      equilateralTriangle();
      break;
  } 
 
}





function rightTriangle(){
  rect(100,100,50,50);
}

function equilateralTriangle(){
  ellipse(100,100,50,50);
}


// For determining equilateral or right triangle
const triangleType = document.getElementById('triangle-type').children;

// Determines which radio button is selected
for(let i = 0; i < triangleType.length; i++){
  triangleType[i].addEventListener("click",function(){
    for(let j = 0; j < triangleType.length; j++){
      triangleType[j].classList.remove("selected");
    };
    triangleType[i].classList.add("selected");
    g.triangle = triangleType[i].value;
  });
};

const phaseEnvelope = document.getElementById("phase-envelope");
const gridLines = document.getElementById("grid-lines");
const solute = document.getElementById("solute");
const solvent = document.getElementById("solvent");
const carrier = document.getElementById("carrier");


phaseEnvelope.addEventListener("change",() => {
  g.phaseTruth = phaseEnvelope.checked;
});
gridLines.addEventListener("change",() => {
  g.gridTruth = gridLines.checked;
});
solute.addEventListener("change",() => {
  g.soluteTruth = solute.checked;
});
solvent.addEventListener("change",() => {
  g.solventTruth = solvent.checked;
});
carrier.addEventListener("change",() => {
  g.carrierTruth = carrier.checked;
});





