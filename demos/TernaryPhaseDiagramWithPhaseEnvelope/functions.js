// Functions to be used
// Phase curve eq: -2.165*x^2 + 2.165*x -0.1949
function diagramConstDraw(){
    push();
    strokeWeight(2);
    noFill();
    triangle(g.xtip,g.ytip,g.xtip-g.dx,g.ytip+g.dy,g.xtip+g.dx,g.ytip+g.dy);
    
    // Drawing the phase envelope
    let x,y,ytemp;
    strokeWeight(2.5);
    beginShape();
    for(let i = 0.10; i < 0.91; i+=.01){
        x = map(i,0,1,g.xtip-g.dx,g.xtip+g.dx);
        ytemp = -2.165*Math.pow(i,2) + 2.165*i - .1949;
        y = map(ytemp,0,Math.sqrt(3)/2,g.ytip+g.dy,g.ytip);
        vertex(x,y);
    }
    endShape();
    pop();

    // Axis labels
    let labels = ['0.1','0.2','0.3','0.4','0.5','0.6','0.7','0.8','0.9'];
    
    let yVals = [];
    let yChange = g.dy/10;
    let xChange = 2*g.dx/10;
    let counter = 8;
    push();
    textSize(22); noStroke();
    for(let i = 0; i < labels.length; i++){
        fill(48,183,0); // A
        yVals.push((g.ytip+g.dy)-yChange*(i+1));
        y = yVals[i];
        x = (y-g.R[1])/g.R[0];
        text(labels[i],x+7,y+5);
        if(i==labels.length-1){
            push(); textSize(30);
            text('A',g.xtip-10,g.ytip-5);
            pop();
        }
        fill(0,0,255); // B
        x = (y-g.L[1])/g.L[0];
        push();
        translate(x-25,y-27);
        rotate(radians(60));
        text(labels[counter],0,0);
        pop();
        counter--;
        if(i == labels.length-1){
            push(); textSize(30);
            text('B',g.xtip-g.dx-25,g.ytip+g.dy+12);
            pop();
        }
        fill(170,0,0);
        y = g.ytip+g.dy;
        x = (g.xtip-g.dx)+xChange*(i+1);
        push();
        translate(x-10,y+38);
        rotate(radians(-60));
        text(labels[i],0,0);
        pop();
        if(i == labels.length-1){
            push(); textSize(30);
            text('C',g.xtip+g.dx+4,g.ytip+g.dy+12);
            pop();
        }
    }
    pop();
}

function gridDraw(){
    let yVals = [];
    let yChange = g.dy/20;
    let xChange = 2*g.dx/20;
    for(let i = 0; i < 19; i++){
        yVals.push((g.ytip+g.dy)-yChange*(i+1));
    }
    push();
    stroke(0,50);
    let x1, y1, x2, y2;
    for(let i = 0; i < yVals.length; i++){
        // A lines
        y1 = yVals[i];
        x1 = (y1-g.L[1])/g.L[0];
        y2 = y1;
        x2 = (y2-g.R[1])/g.R[0];
        line(x1,y1,x2,y2);
        // B lines
        // x1 and y1 remain the same
        y2 = g.ytip+g.dy;
        x2 = (g.xtip-g.dx)+xChange*(i+1);
        line(x1,y1,x2,y2);
        // C lines
        // y1 and y2 remain the same
        x1 = (y1-g.R[1])/g.R[0];
        x2 = (g.xtip+g.dx)-xChange*(i+1);
        line(x1,y1,x2,y2);

    }
    pop();
}
// Copied from mathematica source code
tiePos = [[[0.1088, 0.015], [0.8847, 0.02595]], [[0.1224, 0.03769], [0.8616, 0.06333]], [[0.1405, 0.0666], [0.8375, 0.09979]], [[0.163, 0.1005], [0.7921, 0.1617]], [[0.191, 0.1397], [0.7209, 0.2408]], [[0.2251, 0.1828], [0.6322, 0.3086]], [[0.2788, 0.2405], [0.512, 0.3461]]];

function tieDraw(){
    let x1, y1, x2, y2;
    push();
    strokeWeight(2); stroke(50);
    for(let i = 0; i < tiePos.length; i++){
        x1 = map(tiePos[i][0][0],0,1,g.xtip-g.dx,g.xtip+g.dx);
        y1 = map(tiePos[i][0][1],0,Math.sqrt(3)/2,g.ytip+g.dy,g.ytip);
        x2 = map(tiePos[i][1][0],0,1,g.xtip-g.dx,g.xtip+g.dx);
        y2 = map(tiePos[i][1][1],0,Math.sqrt(3)/2,g.ytip+g.dy,g.ytip);
        line(x1,y1,x2,y2);
    }
    pop();
}

