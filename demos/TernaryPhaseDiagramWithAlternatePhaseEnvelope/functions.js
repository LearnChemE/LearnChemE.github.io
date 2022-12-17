// Functions to be used
// Phase curve eq left: -0.8921*x^2 + 2.427*x -.3903
// Phase curve eq Right: 1.732*x - 1.438
function diagramConstDraw(){
    gridLabel.style.color = 'black';
    tieLabel.style.color = 'black';
    push();
    strokeWeight(2);
    noFill();
    triangle(g.xtip,g.ytip,g.xtip-g.dx,g.ytip+g.dy,g.xtip+g.dx,g.ytip+g.dy);
    
    // Drawing the phase envelope
    let x,y,ytemp;
    strokeWeight(3);
    beginShape();
    for(let i = 0.18; i < 0.59; i+=.01){
        if(i==.18){
            x = map(.1717,0,1,g.xtip-g.dx,g.xtip+g.dx);
            ytemp = -0.8921*Math.pow(.1717,2) + 2.427*.1717 - .3903;
            y = map(ytemp,0,Math.sqrt(3)/2,g.ytip+g.dy,g.ytip);
            vertex(x,y);
        }
        x = map(i,0,1,g.xtip-g.dx,g.xtip+g.dx);
        ytemp = -0.8921*Math.pow(i,2) + 2.427*i - .3903;
        y = map(ytemp,0,Math.sqrt(3)/2,g.ytip+g.dy,g.ytip);
        vertex(x,y);
        if(i == .58){
            x = map(.5833,0,1,g.xtip-g.dx,g.xtip+g.dx);
            ytemp = 1.732*.5833 - 1.438;
            y = map(ytemp,0,Math.sqrt(3)/2,g.ytip+g.dy,g.ytip);
            vertex(x,y);
        }
    }
    endShape();
    beginShape();
    for(let i = .83; i < .92; i+=.01){
        x = map(i,0,1,g.xtip-g.dx,g.xtip+g.dx);
        ytemp = 1.732*i - 1.438;
        y = map(ytemp,0,Math.sqrt(3)/2,g.ytip+g.dy,g.ytip);
        vertex(x,y);
        if(i == .91){
            x = map(.915,0,1,g.xtip-g.dx,g.xtip+g.dx);
            ytemp = 1.732*.915 - 1.438;
            y = map(ytemp,0,Math.sqrt(3)/2,g.ytip+g.dy,g.ytip);
            vertex(x,y);
        }
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
    stroke(0,20);
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
tiePos = [[[0.535, 0.645], [0.91, 0.14]], [[0.46, 0.54], [0.89, 0.11]], [[0.39, 0.42], [0.88, 0.09]], [[0.32, 0.3], [0.86, 0.06]], [[0.255, 0.17], [0.85, 0.04]], [[0.2, 0.05], [0.83, 0.01]]];

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
// Need work here
function phaseCheck(){
    let temp = g.points[0];
    let x, y;
    let a, b, c;
    let leftTest = false;
    let rightTest = false;
    
    let LphaseEq = [-.8921, 2.427, -.3903];
    let RphaseEq = [1.732, -1.438];

    y = map(temp.y,g.ytip+g.dy,g.ytip,0,Math.sqrt(3)/2);
    a = LphaseEq[0];
    b = LphaseEq[1];
    c = LphaseEq[2] - y;

    let xLeft = (-b + Math.sqrt(Math.pow(b,2)-4*a*c))/(2*a);
    xLeft = map(xLeft,0,1,g.xtip-g.dx,g.xtip+g.dx);
    if(temp.x >= xLeft){
        leftTest = true;
    } else {
        leftTest = false;
    }

    let x1, y1, x2, y2, m;
    y = RphaseEq[0]*.83 + RphaseEq[1];
    y1 = map(y,0,Math.sqrt(3)/2,g.ytip+g.dy,g.ytip);
    y = RphaseEq[0]*.915 + RphaseEq[1];
    y2 = map(y,0,Math.sqrt(3)/2,g.ytip+g.dy,g.ytip);
    x1 = map(.83,0,1,g.xtip-g.dx,g.xtip+g.dx);
    x2 = map(.915,0,1,g.xtip-g.dx,g.xtip+g.dx);

    m = (y2-y1)/(x2-x1);
    b = y1 - m*x1;

    let xRight = (temp.y-b)/m;
    if(temp.x <= xRight){
        rightTest = true;
    } else {
        rightTest = false;
    }

    if(leftTest && rightTest){
        g.inPhaseEnvelope = true;
    } else{
        g.inPhaseEnvelope = false;
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

// Need work here
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

    // Adding top right edge of phase envelope to coordinates, slopes, and b vectors
    tieCoords.splice(0,0,[g.xtip,g.ytip,g.xtip+g.dx,g.ytip+g.dy]);
    tieSlopes.splice(0,0,g.R[0]);
    tieBs.splice(0,0,g.R[1]);

    
    // Adding the bottom of phase envelope to the coordinates, slopes, and b vectors
    x1 = map(.1717,0,1,g.xtip-g.dx,g.xtip+g.dx);
    x2 = map(.83,0,1,g.xtip-g.dx,g.xtip+g.dx);
    tieCoords.splice(7,0,[x1,g.ytip+g.dy,x2,g.ytip+g.dy]);
    tieSlopes.splice(7,0,0);
    tieBs.splice(7,0,g.ytip+g.dy);

    push();
    strokeWeight(2.5);
    stroke(255,172,28); noFill();
    beginShape();
    for(let i = 0.18; i < 0.59; i+=.01){
        if(i==.18){
            x = map(.1717,0,1,g.xtip-g.dx,g.xtip+g.dx);
            ytemp = -0.8921*Math.pow(.1717,2) + 2.427*.1717 - .3903;
            y = map(ytemp,0,Math.sqrt(3)/2,g.ytip+g.dy,g.ytip);
            vertex(x,y);
        }
        x = map(i,0,1,g.xtip-g.dx,g.xtip+g.dx);
        ytemp = -0.8921*Math.pow(i,2) + 2.427*i - .3903;
        y = map(ytemp,0,Math.sqrt(3)/2,g.ytip+g.dy,g.ytip);
        vertex(x,y);
        if(i == .58){
            x = map(.5833,0,1,g.xtip-g.dx,g.xtip+g.dx);
            ytemp = 1.732*.5833 - 1.438;
            y = map(ytemp,0,Math.sqrt(3)/2,g.ytip+g.dy,g.ytip);
            vertex(x,y);
        }
    }
    endShape();
    stroke(255,0,255);
    beginShape();
    for(let i = .83; i < .92; i+=.01){
        x = map(i,0,1,g.xtip-g.dx,g.xtip+g.dx);
        ytemp = 1.732*i - 1.438;
        y = map(ytemp,0,Math.sqrt(3)/2,g.ytip+g.dy,g.ytip);
        vertex(x,y);
        if(i == .91){
            x = map(.915,0,1,g.xtip-g.dx,g.xtip+g.dx);
            ytemp = 1.732*.915 - 1.438;
            y = map(ytemp,0,Math.sqrt(3)/2,g.ytip+g.dy,g.ytip);
            vertex(x,y);
        }
    }
    endShape();
    pop();

    tieCoords = tieCoords.reverse();
    tieSlopes = tieSlopes.reverse();
    tieBs = tieBs.reverse();
    
    
    let yVals = new Array(8);
    for(let i = 0; i < yVals.length; i++){
        yVals[i] = tieSlopes[i]*temp.x + tieBs[i];
    }

    let dY, dC, mx, xL, xR, yL, yR, bx;
    let region = 0;
    for(let i = 0; i < tieSlopes.length-1; i++){
        if(temp.y < yVals[i] && temp.y > yVals[i+1]){
            dY = yVals[i]-yVals[i+1];
            dC = yVals[i]-temp.y;

            mx = tieSlopes[i]*(1-dC/dY) + tieSlopes[i+1]*(dC/dY);
            bx = temp.y - mx*temp.x;

            xL = tieCoords[i][0]*(1-dC/dY) + tieCoords[i+1][0]*(dC/dY);
            xR = tieCoords[i][2]*(1-dC/dY) + tieCoords[i+1][2]*(dC/dY);
            yL = mx*xL + bx;
            yR = mx*xR + bx;
            region = i+1;
        // } else if(temp.y < yVals[tieSlopes.length-1]){
        //     let ratio = yVals[tieSlopes.length-1]/temp.y;
        //     mx = tieSlopes[tieSlopes.length-1]*ratio;
        //     bx = temp.y - mx*temp.x;
            // let t = region8Coords(mx,bx,alphaPoints,betaPoints);
            // xL = t[0]; xR = t[1];
            // yL = mx*xL + bx;
            // yR = mx*xR + bx;
            region = i+1;
        } else if(temp.y == g.ytip+g.dy){
            xL = map(.1,0,1,g.xtip-g.dx,g.xtip+g.dx);
            xR = map(.9,0,1,g.xtip-g.dx,g.xtip+g.dx);
            yL = g.ytip+g.dy;
            yR = yL;
        }
    }
    console.log(region)
    push();
    drawingContext.setLineDash([10,10]);
    strokeWeight(3);
    line(xL,yL,xR,yR);
    pop();
    
    //alphaBetaMassFracs(xL,yL,xR,yR);
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

// function region8Coords(mx,bx,alphaP,betaP){
//     let xL, xR, m, b, x, y;
//     for(let i = 0; i < alphaP.length-1; i++){
//         m = (alphaP[i+1][1]-alphaP[i][1])/(alphaP[i+1][0]-alphaP[i][0]);
//         b = alphaP[i][1] - m*alphaP[i][0];
//         x = (bx-b)/(m-mx);

//         if(x > alphaP[i][0] && x < alphaP[i+1][0]){
//             xL = x;
//         } else if(x == alphaP[i][0]){
//             xL = alphaP[i][0];
//         }
//     }

//     for(let i = 0; i < betaP.length-1; i++){
//         m = (betaP[i+1][1]-betaP[i][1])/(betaP[i+1][0]-betaP[i][0]);
//         b = betaP[i][1] - m*betaP[i][0];
//         x = (bx-b)/(m-mx);

//         if(x > betaP[i][0] && x < betaP[i+1][0]){
//             xR = x;
//         } else if(x == betaP[i][0]){
//             xR = betaP[i][0];
//         }
//     }
//     return([xL,xR]);
// }

function alphaBetaMassFracs(xL,yL,xR,yR){
    let alpha_a_NF, alpha_a_F;
    let alpha_b_NF, alpha_b_F;
    let alpha_c_NF, alpha_c_F;
    let beta_a_NF, beta_a_F;
    let beta_b_NF, beta_b_F;
    let beta_c_NF, beta_c_F;
    // xL and yL
    if(g.alphaTruth){
        push();
        // A line
        stroke(28,183,0); fill(48,183,0); strokeWeight(2);
        x1 = xL; y1 = yL;
        y2 = yL; x2 = (y2 - g.R[1])/g.R[0];
        push(); drawingContext.setLineDash([6,6]);
        line(x1,y1,x2-3,y2);
        alpha_a_NF = map(yL,g.ytip+g.dy,g.ytip,0,1);
        alpha_a_F = alpha_a_NF.toFixed(2);
        pop(); 
        triangle(x2-3,y2,x2-18,y2+5,x2-18,y2-5)

    
    
        // C line
        stroke(170,0,0); fill(170,0,0);
        y2 = g.ytip+g.dy-2;
        let btemp = y1 - g.L[0]*x1;
        x2 = (y2-btemp)/g.L[0];
        push(); drawingContext.setLineDash([6,6]);
        line(x1,y1,x2,y2);
        alpha_c_NF = map(x2,g.xtip-g.dx,g.xtip+g.dx,0,1);
        alpha_c_F = alpha_c_NF.toFixed(2);
        let pos = cTriangleRep(x2,y2);
        pop();
        triangle(pos[0],pos[1],pos[2],pos[3],pos[4],pos[5]);

        // B line
        stroke(0,0,255); fill(0,0,255);
        alpha_b_NF = 1 - alpha_a_NF - alpha_c_NF;
        alpha_b_F = alpha_b_NF.toFixed(2);
        x2 = map(alpha_b_NF,0,1,g.xtip,g.xtip-g.dx);
        y2 = g.L[0]*x2 + g.L[1];
        push(); drawingContext.setLineDash([6,6]);
        line(x1,y1,x2,y2);
        pos = bTriangleRep(x2,y2);
        pop();
        triangle(pos[0],pos[1],pos[2],pos[3],pos[4],pos[5]);

        fill(255,172,28); stroke(255,172,28);
        ellipse(xL,yL,12);
        pop();

        // Mass fraction display
        push();
        textSize(25);
        text('mass fractions',43,45);push();
        strokeWeight(2); fill(255); stroke(255,172,28);
        rect(37,55,175,125);
        noStroke(); fill(255,172,28);
        text('alpha phase',60,210);
        pop();
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
        text(alpha_a_F,132,85);
        fill(0,0,255);
        text(alpha_b_F,132,125);
        fill(170,0,0);
        text(alpha_c_F,132,165);
        fill(48,183,0); textSize(18);
        text('A',97,93); text('α',98,75);
        fill(0,0,255);
        text('B',97,133); text('α',98,115);
        fill(170,0,0); 
        text('C',97,173); text('α',98,155);
        pop();
        
        
    }
    // xR and yR
    if(g.betaTruth){
        push();
        // A line
        stroke(28,183,0); fill(48,183,0); strokeWeight(2);
        x1 = xR; y1 = yR;
        y2 = yR; x2 = (y2 - g.R[1])/g.R[0];
        push(); drawingContext.setLineDash([5,5]);
        line(x1,y1,x2-3,y2);
        beta_a_NF = map(yR,g.ytip+g.dy,g.ytip,0,1);
        beta_a_F = beta_a_NF.toFixed(2);
        pop(); 
        triangle(x2-3,y2,x2-18,y2+5,x2-18,y2-5)

        // C line
        stroke(170,0,0); fill(170,0,0);
        y2 = g.ytip+g.dy-2;
        let btemp = y1 - g.L[0]*x1;
        x2 = (y2-btemp)/g.L[0];
        push(); drawingContext.setLineDash([6,6]);
        line(x1,y1,x2,y2);
        beta_c_NF = map(x2,g.xtip-g.dx,g.xtip+g.dx,0,1);
        beta_c_F = beta_c_NF.toFixed(2);
        let pos = cTriangleRep(x2,y2);
        pop();
        triangle(pos[0],pos[1],pos[2],pos[3],pos[4],pos[5]);

        // B line
        stroke(0,0,255); fill(0,0,255);
        beta_b_NF = 1 - beta_a_NF - beta_c_NF;
        beta_b_F = beta_b_NF.toFixed(2);
        x2 = map(beta_b_NF,0,1,g.xtip,g.xtip-g.dx);
        y2 = g.L[0]*x2 + g.L[1];
        push(); drawingContext.setLineDash([6,6]);
        line(x1,y1,x2,y2);
        pos = bTriangleRep(x2,y2);
        pop();
        triangle(pos[0],pos[1],pos[2],pos[3],pos[4],pos[5]);


        fill(255,0,255); stroke(255,0,255);
        ellipse(xR,yR,12);
        pop();

        // Mass fraction display
        push();
        textSize(25);
        text('mass fractions',494,45); push();
        strokeWeight(2); fill(255); stroke(255,0,255);
        rect(488,55,175,125);
        noStroke(); fill(255,0,255);
        text('beta phase',520,210)
        pop();
        push();
        textStyle(ITALIC);
        fill(48,183,0);
        text('x  = ',536,85);
        fill(0,0,255);
        text('x  =',536,125);
        fill(170,0,0);
        text('x  =',536,165);
        pop();
        fill(48,183,0); textSize(23);
        text(beta_a_F,583,85);
        fill(0,0,255);
        text(beta_b_F,583,125);
        fill(170,0,0);
        text(beta_c_F,583,165);
        fill(48,183,0); textSize(18);
        text('A',548,93); text('ß',549,75);
        fill(0,0,255);
        text('B',548,133); text('ß',549,115);
        fill(170,0,0);
        text('C',548,173); text('ß',549,155);
        pop();
         
    }
}

function phasesMode(){

    gridLabel.style.color = 'grey';
    tieLabel.style.color = 'grey';
    alphapLabel.style.color = 'grey';
    betaLabel.style.color = 'grey';
    push();
    strokeWeight(2);
    fill(255,130,10,60);
    triangle(g.xtip,g.ytip,g.xtip+g.dx,g.ytip+g.dy,g.xtip-g.dx,g.ytip+g.dy);
    pop();

    push();
    noStroke(); textSize(30);
    fill(48,183,0);
    text('A',g.xtip-10,g.ytip-5);
    fill(0,0,255);
    text('B',g.xtip-g.dx-25,g.ytip+g.dy+12);
    fill(170,0,0);
    text('C',g.xtip+g.dx+4,g.ytip+g.dy+12);
    pop();

    let x, y, ytemp;
    // Phase curve with solid white fill to avoid color blending
    push();
    noStroke(); fill(255);
    beginShape();
    for(let i = .1; i < .91; i+=0.01){
        x = map(i,0,1,g.xtip-g.dx,g.xtip+g.dx);
        ytemp = ytemp = -2.165*Math.pow(i,2) + 2.165*i - 0.1949;
        y = map(ytemp,0,Math.sqrt(3)/2,g.ytip+g.dy,g.ytip);
        vertex(x,y);
    }
    endShape();
    pop();

    // Blue background of curve
    push();
    noStroke(); fill(0,0,255,30);
    beginShape();
    for(let i = .1; i < .91; i+=0.01){
        x = map(i,0,1,g.xtip-g.dx,g.xtip+g.dx);
        ytemp = ytemp = -2.165*Math.pow(i,2) + 2.165*i - 0.1949;
        y = map(ytemp,0,Math.sqrt(3)/2,g.ytip+g.dy,g.ytip);
        vertex(x,y);
    }
    endShape();
    pop();
    

    // Alpha phase curve
    push();
    strokeWeight(2.5);
    stroke(255,172,28); noFill();
    beginShape();
    for(let i = .1; i < .35; i+=.01){
        x = map(i,0,1,g.xtip-g.dx,g.xtip+g.dx);
        ytemp = ytemp = -2.165*Math.pow(i,2) + 2.165*i - 0.1949;
        y = map(ytemp,0,Math.sqrt(3)/2,g.ytip+g.dy,g.ytip);
        vertex(x,y);
        
    }
    endShape();
    // Beta phase curve
    stroke(255,0,255);
    beginShape();
    for(let i = .34; i < .91; i+=.01){
        x = map(i,0,1,g.xtip-g.dx,g.xtip+g.dx);
        ytemp = ytemp = -2.165*Math.pow(i,2) + 2.165*i - 0.1949;
        y = map(ytemp,0,Math.sqrt(3)/2,g.ytip+g.dy,g.ytip);
        vertex(x,y);
        
    }
    endShape();
    pop();

    push();
    strokeWeight(2);
    line(g.xtip-g.dx,g.ytip+g.dy,g.xtip+g.dx,g.ytip+g.dy);
    strokeWeight(15);
    let xP = .3457;
    ytemp = -2.165*Math.pow(xP,2) + 2.165*xP - 0.1949;
    xP = map(xP,0,1,g.xtip-g.dx,g.xtip+g.dx);
    let yP = map(ytemp,0,Math.sqrt(3)/2,g.ytip+g.dy,g.ytip);
    point(xP,yP);
    pop();

    push();
    textSize(25);
    text('two phases',g.xtip-65,g.ytip+g.dy-50);
    text('one phase',g.xtip-60,g.ytip+150);
    text('plait point',g.xtip-70,g.ytip+230);
    pop();

    // Plait point arrow and curve
    let bpoints = [[0.349, 0.428], [0.3225, 0.417], [0.2754, 0.378], [0.333, 0.315]];
    let bezierpx = [];
    for(let i = 0; i < bpoints.length; i++){
        x = map(bpoints[i][0],0,1,g.xtip-g.dx,g.xtip+g.dx);
        y = map(bpoints[i][1],0,Math.sqrt(3)/2,g.ytip+g.dy,g.ytip);
        bezierpx.push([x,y]);
    }
    push();
    strokeWeight(2); noFill();
    bezier(bezierpx[0][0],bezierpx[0][1],bezierpx[1][0],bezierpx[1][1],bezierpx[2][0],bezierpx[2][1],bezierpx[3][0],bezierpx[3][1]);
    pop();

    x = bezierpx[3][0]; y = bezierpx[3][1];
    push();
    fill(0); strokeWeight(2);
    triangle(x,y,x-14,y-11,x-5,y-16);
    pop();

    push();
    noStroke(); textSize(22);
    translate(g.xtip-g.dx+75,g.ytip+g.dy-30);
    rotate(radians(-52));
    fill(255);
    rect(-2,-18,124,25);
    fill(255,172,28);
    text('alpha phase',0,0);
    pop();

    push();
    noStroke(); textSize(22);
    translate(g.xtip+g.dx-175,g.ytip+g.dy-145);
    rotate(radians(46))
    rect(-2,-18,114,25);
    fill(255,0,255);
    text('beta phase',0,0);
    pop();



}

