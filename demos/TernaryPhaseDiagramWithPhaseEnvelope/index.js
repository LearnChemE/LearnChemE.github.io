

window.g = {
  cnv : undefined,
  
  diagramORphase : 'diagram',
  gridTruth : true,
  tieTruth : true,
  alphaTruth : true,
  betaTruth : true,

  radius : 10,
  points : [],
  nP : 1,
  dragPoint : null,

  inPhaseEnvelope : false,
  ytip : 0,
  xtip : 0,
  dx : 0,
  dy : 0,

  // For storing m and b values of left and right edges of triangle
  L : [0,0],
  R : [0,0],
  
  
}


function setup() {
  g.cnv = createCanvas(700, 600);

  g.cnv.parent("graphics-wrapper");

  document.getElementsByTagName("main")[0].remove();
  for(let i = 0; i < g.nP; i++){
    g.points.push(createVector(347,276));
  }

  triSetup();
 
}

function draw() {
  background(250);

  switch (g.diagramORphase){
    case 'diagram':
      if(g.gridTruth){
        gridDraw();
      }
      if(g.tieTruth){
        tieDraw();
      }
      phaseCheck();
      diagramConstDraw();
      if(g.inPhaseEnvelope){
        inPhaseRep();
      } else {
        notInPhaseRep();
      }
      break;
    case 'phase':
      phasesMode();

      break;
  }

  if(g.diagramORphase == 'diagram'){
    push(); fill(0);
    for(let p of g.points){
      circle(p.x,p.y,g.radius*2);
    }
    pop();
  }

}





const gridLines = document.getElementById("grid-lines");
const tie = document.getElementById("tie-lines");
const alphap = document.getElementById("alphap");
const beta = document.getElementById("beta");

const gridLabel = document.getElementById("grid-lines-label");
const tieLabel = document.getElementById("tie-lines-label");
const alphapLabel = document.getElementById("alphap-label");
const betaLabel = document.getElementById("beta-label");

gridLines.addEventListener("click",() => {
  g.gridTruth = gridLines.checked;
});
tie.addEventListener("change",() => {
  g.tieTruth = tie.checked;
});
alphap.addEventListener("change",() => {
  g.alphaTruth = alphap.checked;
});
beta.addEventListener("change",() => {
  g.betaTruth = beta.checked;
});

const diaORphase = document.getElementById('diagram-or-phase').children;

for(let i = 0; i < diaORphase.length; i++){
  diaORphase[i].addEventListener("click",function(){
    for(let j = 0; j < diaORphase.length; j++){
      diaORphase[j].classList.remove("selected");
    };
    diaORphase[i].classList.add("selected");
    g.diagramORphase = diaORphase[i].value;
    switch (g.diagramORphase){
      case 'diagram':
        gridLines.disabled = false;
        tie.disabled = false;
        alphap.disabled = true;
        beta.disabled = true;
        g.points[0].x = 347;
        g.points[0].y = 276;
        break;
      case 'phase':
        gridLines.disabled = true;
        tie.disabled = true;
        alphap.disabled = true;
        beta.disabled = true;
        break;
    }
  })
}

function triSetup(){
  g.xtip = 350;
  g.ytip = 50;
  g.dy = 450;
  
  let angle = radians(30);
  g.dx = g.dy*Math.tan(angle);

  g.R[0] = (g.dy)/(g.dx); // Left line slope
  g.R[1] = g.ytip - g.R[0]*g.xtip; // Left line b-value

  g.L[0] = (g.dy)/(-g.dx); // Right line slope
  g.L[1] = g.ytip - g.L[0]*g.xtip; // Right line b-value

}

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
  if(g.dragPoint){
    if(mouseY-g.L[0]*mouseX >= g.L[1] && mouseY <= g.ytip+g.dy && mouseY - g.R[0]*mouseX >= g.R[1]){ // Within the triangle
      g.dragPoint.x = mouseX;
      g.dragPoint.y = mouseY;
    } else if(mouseY-g.L[0]*mouseX <= g.L[1] && mouseX < g.xtip && mouseX > g.xtip-g.dx){ // To the left of the triangle
      g.dragPoint.x = mouseX;
      g.dragPoint.y = g.L[0]*mouseX+g.L[1];
    } else if(mouseY > g.ytip+g.dy && mouseX > g.xtip-g.dx && mouseX < g.xtip+g.dx){ // Under the triangle
      g.dragPoint.x = mouseX;
      g.dragPoint.y = g.ytip+g.dy;
    } else if(mouseY - g.R[0]*mouseX <= g.R[1] && mouseX < g.xtip+g.dx){ // To the right of the triangle
      g.dragPoint.x = mouseX;
      g.dragPoint.y = g.R[0]*mouseX + g.R[1];
    }
  }
  
}
function mouseReleased(){
  g.dragPoint = null;
}
function inCircle(pos,radius){
  return dist(mouseX,mouseY,pos.x,pos.y) < radius;
}




