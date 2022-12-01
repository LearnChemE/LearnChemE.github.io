// Functions for equilateral triangle mode \\

function equilateralTriangle(){
    push();
    noFill(); strokeWeight(2);
    let angle = 60*Math.PI/180;
    let dx = 450*Math.cos(angle);
    let dy = 450*Math.sin(angle);
    triangle(300,70,300-dx,70+dy,300+dx,70+dy);
    pop();
    let ytip = 70; let xtip = 300;
    let mL, mR, bL, bR;
    mL = -dy/dx;
    mR = dy/dx;
    bL = (ytip+dy) - mL*(xtip-dx);
    bR = (ytip+dy) - mR*(xtip+dx);
    let leftLine = [mL, bL];
    let rightLine = [mR,bR];

    equilatRep(leftLine,rightLine,dx,dy);
    equilatLabels(leftLine,rightLine,dx,dy);
    if(g.gridTruth){
        equilatGrid(leftLine,rightLine,dx,dy);
    }
}
function equilatLabels(L,R,dx,dy){
    let labels = ['0.1','0.2','0.3','0.4','0.5','0.6','0.7','0.8','0.9'];

    let yVals = [];
    let ytip = 70;
    let xtip = 300;
    let yChange = dy/10;
    let xChange = 2*dx/10
    for(let i = 0; i < 9; i++){
        yVals.push((ytip+dy)-yChange*(i+1));
    }
    let x, y;
    // Solute labels
    push();
    fill(0,0,255); textSize(19); 
    for(let i = 0; i < labels.length; i++){
        y = yVals[i];
        x = (y-R[1])/R[0];
        text(labels[i],x+3,y+5)
        if(i==labels.length-1){
            textSize(21);
            text('solute',xtip-28,ytip-5);
        }
    }
    pop();
    // Solvent labels
    push();
    fill(128,0,128); textSize(19);
    for(let i = 0; i < labels.length; i++){
        y = ytip + dy;
        x = (xtip-dx) + xChange*(i+1);
        push();
        translate(x-7,y+31);
        rotate(radians(-60));
        text(labels[i],0,0)
        pop();
        if(i == labels.length-1){
            textSize(21);
            text('solvent',xtip+dx+3,ytip+dy+10);
        }
    }
    pop();
    // Carrier labels
    push();
    fill(255,100,0); textSize(19); 
    let counter = 8;
    for(let i = 0; i < labels.length; i++){
        y = (ytip+dy) - yChange*(i+1);
        x = (y-L[1])/L[0];
        push();
        translate(x-25,y-20);
        rotate(radians(60));
        text(labels[counter],0,0);
        pop();
        counter--;
        if(i == labels.length-1){
            textSize(21);
            text('carrier',xtip-dx-65,ytip+dy+10)
        }
    }
    pop();
} 

// Grid lines for equilateral triangle
function equilatGrid(L,R,dx,dy){
    let yVals = [];
    let ytip = 70;
    let xtip = 300;
    let yChange = dy/10;
    let xChange = 2*dx/10
    for(let i = 0; i < 9; i++){
        yVals.push((ytip+dy)-yChange*(i+1));
    }
    push();
    let x1, x2, y1, y2;
    // Carrier grid
    stroke(255,100,0,80);
    for(let i = 0; i < yVals.length; i++){
        y1 = yVals[i];
        x1 = (y1-L[1])/L[0];
        y2 = ytip + dy;
        x2 = (xtip-dx) + xChange*(i+1);
        line(x1,y1,x2,y2);
    }
    
    // Solvent grid
    stroke(128,0,128,80);
    for(let i = 0; i < yVals.length; i++){
        y1 = yVals[i];
        x1 = (y1-R[1])/R[0];
        y2 = ytip + dy;
        x2 = (xtip+dx) - xChange*(i+1);
        line(x1,y1,x2,y2);
    }
    // Solute grid
    stroke(0,0,255,80);
    for(let i = 0; i < yVals.length; i++){
        y1 = yVals[i];
        x1 = (y1-L[1])/L[0];
        y2 = y1;
        x2 = (y2-R[1])/R[0];
        line(x1,y1,x2,y2);
    }
    pop();
}
  
// Mass fraction lines for equilateral triangle
function equilatRep(){
  
}
  
  

// Mass fraction display for equilateral triangle
function equilatMassFracs(){
  
}