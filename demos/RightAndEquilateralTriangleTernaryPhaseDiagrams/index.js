

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




}


function setup() {
  g.cnv = createCanvas(600, 550);

  g.cnv.parent("graphics-wrapper");

  document.getElementsByTagName("main")[0].remove();
  for(let i = 0; i < g.nP; i++){
    g.points.push(createVector(200,350));
  }

  
  //noLoop();
 
}

function draw() {
  background(250);
  push(); fill(0);
  
 
 
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





function rightTriangle(){
  push();
  noFill();
  strokeWeight(2);
  triangle(100,50,100,450,500,450)
  pop();
  rightRep();
  rightLabels();
  if(g.gridTruth){
    rightGrid();
  }
  rightMassFracs();
  rightRep();
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
        } else if(mouseX-mouseY >= 50 && mouseX < 500 && mouseY > 50){ // Above the hypotenuse
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

// Labels for right triangle
function rightLabels(){
  let labels = ['0.1','0.2','0.3','0.4','0.5','0.6','0.7','0.8','0.9'];
  // Solvent labels
  push(); fill(128,0,128); textSize(18);
  for(let i = 0; i < labels.length; i++){
    text(labels[i],90+40*(i+1),475);
    if(i == labels.length-1){
      textSize(22);
      text('solvent',510,460);
    }
  }
  pop();
  // Solute labels
  push(); fill(0,0,255); textSize(18);
  for(let i = 0; i < labels.length; i++){
    text(labels[i],70,450-40*(i+1));
    if(i == labels.length-1){
      textSize(22);
      text('solute',70,40);
    }
  }
  pop();
  push();
  textSize(22); fill(255,100,0);
  text('carrier',35,470)
  pop(); 
  push();
  textSize(22);
  text('solvent mass fraction',200,520);
  let angle1 = radians(270);
  translate(35,350);
  rotate(angle1);
  text('solute mass fraction',0,0);
  pop();

}

// Labels for equilateral triangle
function equilatLabels(){
  let labels = ['0.1','0.2','0.3','0.4','0.5','0.6','0.7','0.8','0.9'];
}

// Grid lines for right triangle
function rightGrid(){
  // Solvent grid
  push();
  stroke(128,0,128,80);
  for(let i = 0; i < 9; i++){
    line(100+40*(i+1),450,100+40*(i+1),40*(i+1)+50);
  }
  pop();
  // Solute grid
  push();
  stroke(0,0,255,80);
  for(let i = 0; i < 9; i++){
    line(100,450-40*(i+1),500-40*(i+1),450-40*(i+1))
  }
  pop();
  // Carrier grid
  push();
  stroke(255,100,0,80);
  for(let i = 0; i < 9; i++){
    line(100,450-40*(i+1),100+40*(i+1),450);
  }
  pop();
}

// Grid lines for equilateral triangle
function equilatGrid(){

}

// Mass fraction lines for right triangle
function rightRep(){
  let temp = g.points[0];
  // Solute line
  push();
  stroke(0,0,255); strokeWeight(2); fill(0,0,255);
  for(let i = temp.x; i > 105; i -= 10){
    line(i,temp.y,i-5,temp.y);
  }
  if(temp.x-100 > 5){
    triangle(102,temp.y,125,temp.y+5,125,temp.y-5);
  }
  pop();
  let soluteVal = map(temp.y,450,50,0,1); // Defines mass fraction based on position
  let sVal = soluteVal.toFixed(2);
  g.soluteFrac = sVal; // Assigns to global variable for display in mass fractions box
  push();
  if(g.soluteTruth){ // Displaying on the triangle axis for when checkbox is checked
    fill(255);
    rect(45,temp.y-20,45,30);
    textSize(18); stroke(0,0,255); fill(0,0,255);
    text(sVal,50,temp.y); 
    
  }
  pop();
  // Solvent line
  push();
  stroke(128,0,128); strokeWeight(2); fill(128,0,128);
  for(let i = temp.y; i < 445; i += 10){
    line(temp.x,i,temp.x,i+5);
  }
  if(450-temp.y > 5){
    triangle(temp.x,448,temp.x+5,425,temp.x-5,425);
  }
  pop();
  push();
  let solventVal = map(temp.x,100,500,0,1); // Defines mass fraction based on position
  let soVal = solventVal.toFixed(2);
  g.solventFrac = soVal; // Assigns to global variable
  if(g.solventTruth){ // Displaying on the triangle axis for when checkbox is checked
    fill(255);
    rect(temp.x-20,460,45,30);
    textSize(18); stroke(128,0,128); fill(128,0,128);
    text(soVal,temp.x-15,480);
  }
  pop();
  
  // Draws the carrier line
  push();
  stroke(255,100,0); strokeWeight(2);
  drawingContext.setLineDash([5,5]);
  let diff1, diff2;
  diff1 = 450 - temp.y;
  diff2 = temp.x - 100;
  line(temp.x,temp.y,diff1+temp.x,450);
  line(temp.x,temp.y,100,temp.y-diff2);
  if(g.carrierTruth && diff1 > 25 && g.solventTruth){
    line(diff1+temp.x,450,diff1+temp.x,500);
    push();
    drawingContext.setLineDash([0,0]); 
    stroke(0); strokeWeight(1); fill(255);
    rect(diff1+temp.x-20,500,45,30);
    strokeWeight(.8);
    textSize(18); stroke(255,100,0); fill(255,100,0);
    text(g.carrierFrac,diff1+temp.x-15,520);
    pop();
  } else if(g.carrierTruth && diff1 < 25 && g.solventTruth){
    line(diff1+temp.x,450,diff1+temp.x,460);
    line(diff1+temp.x,492,diff1+temp.x,500);
    push();
    drawingContext.setLineDash([0,0]); 
    stroke(0); strokeWeight(1); fill(255);
    rect(diff1+temp.x-20,500,45,30);
    strokeWeight(.8);
    textSize(18); stroke(255,100,0); fill(255,100,0);
    text(g.carrierFrac,diff1+temp.x-15,520);
    pop();
  } else if(g.carrierTruth && !g.solventTruth){
    line(diff1+temp.x,450,diff1+temp.x,500);
    push();
    drawingContext.setLineDash([0,0]); 
    stroke(0); strokeWeight(1); fill(255);
    rect(diff1+temp.x-20,500,45,30);
    strokeWeight(.8);
    textSize(18); stroke(255,100,0); fill(255,100,0);
    text(g.carrierFrac,diff1+temp.x-15,520);
    pop();
  }
  pop();

  let temp1 = 1 - sVal - soVal;
  let temp2 = temp1.toFixed(2);
  g.carrierFrac = temp2;
  

}

// Mass fraction lines for equilateral triangle
function equilatRep(){

}

// Mass fraction display for right triangle
function rightMassFracs(){
  // Slight correction to avoid displaying -0.00
  if(g.carrierFrac == 0){
    let temp = 0;
    let temp1 = temp.toFixed(2);
    g.carrierFrac = temp1;
  }
  push();
  textSize(22);
  text('mass fractions',353,90);
  strokeWeight(2); fill(255);
  rect(350,100,150,88);
  textSize(20); strokeWeight(.2);
  stroke(0,0,255); fill(0,0,255);
  text('solute = '+g.soluteFrac,365,125);
  stroke(128,0,128); fill(128,0,128);
  text('solvent = '+g.solventFrac,363,150);
  stroke(255,100,0); fill(255,100,0);
  text('carrier = '+g.carrierFrac,365,175);
  pop();
}

// Mass fraction display for equilateral triangle
function equilatMassFracs(){

}

