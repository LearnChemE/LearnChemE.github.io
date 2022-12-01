

window.g = {
  cnv : undefined,
  triangle : 'right-triangle',
  phaseTruth : false,
  gridTruth : true,
  soluteTruth : false,
  solventTruth : false,
  carrierTruth : false,

  radius : 8,
  points : [],
  nP : 1,
  dragPoint : null,

  soluteFrac : 0.25,
  solventFrac : 0.25,
  carrierFrac : 0.50,
  inPhaseEnvelope : null,



}


function setup() {
  g.cnv = createCanvas(600, 550);

  g.cnv.parent("graphics-wrapper");

  document.getElementsByTagName("main")[0].remove();
  for(let i = 0; i < g.nP; i++){
    g.points.push(createVector(200,350));
  }

  //frameRate(1)
  //noLoop();
 
}

function draw() {
  background(250);
  push(); fill(0);
  if(!g.phaseTruth){
    g.inPhaseEnvelope = null;
  }
  
 
 
  //temp.show();
  
  // console.log(`phase: ${g.phaseTruth}`)
  // console.log(`grid: ${g.gridTruth}`)
  // console.log(`solute: ${g.soluteTruth}`)
  // console.log(`solvent: ${g.solventTruth}`)
  // console.log(`carrier: ${g.carrierTruth}`)

  switch (g.triangle){
    case 'right-triangle':
      rightTriangle();
      // if(mouseX >= 100 && mouseY <= 450 && mouseX-mouseY <= 50){
      //   ellipse(mouseX,mouseY,10,10)
      // }
      break;
    case 'equilateral-triangle':
      equilateralTriangle();
      break;
  } 

  for(let p of g.points){
    circle(p.x,p.y,g.radius*2);
  }
  //console.log(g.points[0].y);
  pop();
 
}

function equilateralTriangle(){
  push();
  noFill(); strokeWeight(2);
  ellipse(100,100,50,50);
  pop();
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
    redraw();
  });
};

const phaseEnvelope = document.getElementById("phase-envelope");
const gridLines = document.getElementById("grid-lines");
const solute = document.getElementById("solute");
const solvent = document.getElementById("solvent");
const carrier = document.getElementById("carrier");


phaseEnvelope.addEventListener("change",() => {
  g.phaseTruth = phaseEnvelope.checked;
  redraw();
});
gridLines.addEventListener("change",() => {
  g.gridTruth = gridLines.checked;
  redraw();
});
solute.addEventListener("change",() => {
  g.soluteTruth = solute.checked;
  redraw();
});
solvent.addEventListener("change",() => {
  g.solventTruth = solvent.checked;
  redraw();
});
carrier.addEventListener("change",() => {
  g.carrierTruth = carrier.checked;
  redraw();
});


// For manipulating the position of dot within the triangle
function mousePressed(){
  for(let i = g.points.length-1; i >= 0; i--){
    const isPressed = inCircle(g.points[i],g.radius);
    if(isPressed){
      g.dragPoint = g.points.splice(i,1)[0];
      g.points.push(g.dragPoint);

    }
  }
}
function mouseDragged(){
 
  switch (g.triangle){
    case 'right-triangle':
      if(g.dragPoint){
        if(mouseX > 100 && mouseY <= 450 && mouseX-mouseY <= 50){ // Within the triangle
          g.dragPoint.x = mouseX;
          g.dragPoint.y = mouseY;
        } else if(mouseX <= 100 && mouseY <= 450 && mouseY >= 50){ // To the left of the triangle
          g.dragPoint.x = 100;
          g.dragPoint.y = mouseY;
        } else if(mouseX > 100 && mouseX < 500 && mouseY >= 450){ // Under the triangle
          g.dragPoint.x = mouseX;
          g.dragPoint.y = 450;
        } else if(mouseX-mouseY >= 50 && mouseX < 500 && mouseX > 100){ // Above the hypotenuse
          g.dragPoint.x = mouseX;
          g.dragPoint.y = mouseX-50;
        } 
      }
      break;
    case 'equilateral-triangle':

      break;
  
  }
}
function mouseReleased(){
  g.dragPoint = null;
}
function inCircle(pos,radius){
  return dist(mouseX,mouseY,pos.x,pos.y) < radius;
}



