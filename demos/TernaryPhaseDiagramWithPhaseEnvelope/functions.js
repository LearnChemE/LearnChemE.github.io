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

function phaseCheck(){
    let temp = g.points[0];
    let x, y;
    let yCurve;

    x = map(temp.x,g.xtip-g.dx,g.xtip+g.dx,0,1);
    y = map(temp.y,g.ytip+g.dy,g.ytip,0,Math.sqrt(3)/2);

    yCurve = -2.165*Math.pow(x,2) + 2.165*x - .1949;
    if(y < yCurve){
        g.inPhaseEnvelope = true;
        alphap.disabled = false;
        beta.disabled = false;
    } else {
        g.inPhaseEnvelope = false;
        alphap.disabled = true;
        beta.disabled = true;
    }
}

function notInPhaseRep(){
    let temp = g.points[0];
    let x1, y1, x2, y2;
    // A display
    push();
    stroke(48,183,0); fill(48,183,0); strokeWeight(2);
    x1 = temp.x;
    y1 = temp.y;
    y2 = temp.y;
    x2 = (y2 - g.R[1])/g.R[0];
    line(x1,y1,x2-3,y2);
    triangle(x2-3,y2,x2-18,y2+5,x2-18,y2-5)
    // Mass fractions -- storing a nonfixed version for improved graphics later
    let a_notfixed_frac = map(temp.y,g.ytip+g.dy,g.ytip,0,1);
    let a_fixed_frac = a_notfixed_frac.toFixed(2);
    if(a_fixed_frac <= 0){ // Correction for -0.00
        a_fixed_frac = a_fixed_frac.replace(/-/g,'');
    }
    pop();

    // C display
    push();
    let angle = 30*Math.PI/180;
    stroke(170,0,0); fill(170,0,0); strokeWeight(2);
    x1 = temp.x;
    x2 = temp.y;
    y2 = g.ytip+g.dy-2;
    let btemp = y1-g.L[0]*temp.x;
    x2 = (y2-btemp)/g.L[0];
    line(x1,y1,x2,y2);
    let pos = cTriangleRep(x2,y2);
    triangle(pos[0],pos[1],pos[2],pos[3],pos[4],pos[5]);
    pop();
    let c_notfixed_frac = map(x2,g.xtip-g.dx,g.xtip+g.dx,0,1);
    let c_fixed_frac = c_notfixed_frac.toFixed(2);
    if(c_fixed_frac <= 0){
        c_fixed_frac = c_fixed_frac.replace(/-/g,'');
    }

    // B display
    push();
    stroke(0,0,255); fill(0,0,255); strokeWeight(2);
    let b_notfixed_frac = 1 - a_notfixed_frac - c_notfixed_frac;
    let b_fixed_frac = b_notfixed_frac.toFixed(2);
    if(b_fixed_frac <= 0){
        b_fixed_frac = b_fixed_frac.replace(/-/g,'');
    }
    x2 = map(b_notfixed_frac,0,1,g.xtip,g.xtip-g.dx);
    y2 = g.L[0]*x2 + g.L[1];
    line(x1,y1,x2,y2);
    pos = bTriangleRep(x2,y2);
    triangle(pos[0],pos[1],pos[2],pos[3],pos[4],pos[5]);
    pop();

    push();
    textSize(25);
    text('mass fractions',43,45);
    strokeWeight(2); fill(255);
    rect(37,55,175,125);
    push();
    textStyle(ITALIC);
    fill(48,183,0);
    text('x  = ',85,85);
    fill(0,0,255);
    text('x  =',85,125);
    fill(170,0,0);
    text('x  =',85,165);
    pop();
    fill(48,183,0); textSize(23);
    text(a_fixed_frac,132,85);
    fill(0,0,255);
    text(b_fixed_frac,132,125);
    fill(170,0,0);
    text(c_fixed_frac,132,165);
    fill(48,183,0); textSize(18);
    text('A',97,93);
    fill(0,0,255);
    text('B',97,133);
    fill(170,0,0);
    text('C',97,173);
    pop();
    
}

function inPhaseRep(){
    let temp = g.points[0];

    // Determining m and b values of tie lines
    // Get the points first
    let x1, y1, x2, y2, m, b;
    let tieCoords = [];
    let tieSlopes = [];
    let tieBs = [];
    for(let i = 0; i < tiePos.length; i++){
        x1 = map(tiePos[i][0][0],0,1,g.xtip-g.dx,g.xtip+g.dx);
        y1 = map(tiePos[i][0][1],0,Math.sqrt(3)/2,g.ytip+g.dy,g.ytip);
        x2 = map(tiePos[i][1][0],0,1,g.xtip-g.dx,g.xtip+g.dx);
        y2 = map(tiePos[i][1][1],0,Math.sqrt(3)/2,g.ytip+g.dy,g.ytip);
        tieCoords.push([x1,y1,x2,y2]);

        m = (y2-y1)/(x2-x1);
        tieSlopes.push(m);

        b = y1-m*x1;
        tieBs.push(b);

    }

    // Adding the bottom of phase envelope to the coordinates, slopes, and b vectors
    x1 = map(.1,0,1,g.xtip-g.dx,g.xtip+g.dx);
    x2 = map(.9,0,1,g.xtip-g.dx,g.xtip+g.dx);
    tieCoords.splice(0,0,[x1,g.ytip+g.dy,x2,g.ytip+g.dy]);
    tieSlopes.splice(0,0,0);
    tieBs.splice(0,0,g.ytip+g.dy);

    // Drawing alpha and beta phase curves
    let xP = .3457;
    let ytemp = -2.165*Math.pow(xP,2) + 2.165*xP - 0.1949;
    xP = map(xP,0,1,g.xtip-g.dx,g.xtip+g.dx);
    let yP = map(ytemp,0,Math.sqrt(3)/2,g.ytip+g.dy,g.ytip);

    push();
    strokeWeight(2.5);
    stroke(255,172,28); noFill();
    beginShape();
    for(let i = .1; i < .35; i+=.01){
        x1 = map(i,0,1,g.xtip-g.dx,g.xtip+g.dx);
        ytemp = ytemp = -2.165*Math.pow(i,2) + 2.165*i - 0.1949;
        y1 = map(ytemp,0,Math.sqrt(3)/2,g.ytip+g.dy,g.ytip);
        vertex(x1,y1);
        if(i == .34){
            vertex(xP,yP);
        }
    }
    endShape();
    stroke(255,0,255);
    beginShape();
    for(let i = .34; i < .91; i+=.01){
        if(i == .34){
            vertex(xP,yP);
        }
        x1 = map(i,0,1,g.xtip-g.dx,g.xtip+g.dx);
        ytemp = ytemp = -2.165*Math.pow(i,2) + 2.165*i - 0.1949;
        y1 = map(ytemp,0,Math.sqrt(3)/2,g.ytip+g.dy,g.ytip);
        vertex(x1,y1);
    }
    endShape();
    pop();
    
     
}

function cTriangleRep(x1,y1){
    let dx1, dy1, dx2, dy2;
    let x2, y2, x3, y3;
    let angle = (60-18.435)*Math.PI/180;
    let hypot = Math.sqrt(250);

    dx1 = hypot*Math.cos(angle);
    dy1 = hypot*Math.sin(angle);
    x2 = x1 + dx1; 
    y2 = y1 - dy1;

    angle = (90-(60+18.435))*Math.PI/180;
    dx2 = hypot*Math.sin(angle);
    dy2 = hypot*Math.cos(angle);
    x3 = x1 + dx2;
    y3 = y1 - dy2;

    return([x1,y1,x2,y2,x3,y3])
}   

function bTriangleRep(x1,y1){
    let dx1, dy1, dx2, dy2;
    let x2, y2, x3, y3;
    let angle = (60-18.435)*Math.PI/180;
    let hypot = Math.sqrt(250);

    dx1 = hypot*Math.cos(angle);
    dy1 = hypot*Math.sin(angle);
    x2 = x1 + dx1; 
    y2 = y1 + dy1;

    angle = (90-(60+18.435))*Math.PI/180;
    dx2 = hypot*Math.sin(angle);
    dy2 = hypot*Math.cos(angle);
    x3 = x1 + dx2; 
    y3 = y1 + dy2;

    return([x1,y1,x2,y2,x3,y3])
}

