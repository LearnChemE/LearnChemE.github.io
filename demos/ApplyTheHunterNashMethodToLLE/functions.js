
function frameDraw(){
    let x, y;
    let x1, y1;
    labels = ['0.1','0.2','0.3','0.4','0.5','0.6','0.7','0.8','0.9'];

    // Solute labels
    push();
    textSize(20); fill(g.blue); stroke(g.blue); strokeWeight(1.5);
    for(let i = 0; i < labels.length; i++){
        y = g.ytip + g.dy - g.dy/10*(i+1);
        x = (y - g.L[1])/g.L[0];
        line(x,y,x-15,y);
        push();
        noStroke();
        text(labels[i],x-47,y+6);
        pop();
    }

    // Carrier labels
    fill(g.green); stroke(g.green);
    for(let i = 0; i < labels.length; i++){
        y = g.ytip + g.dy/10*(i+1);
        x = (y - g.R[1])/g.R[0];
        line(x,y,x+7.5,y-7.5*Math.sqrt(3));
        push();
        noStroke(); translate(x+16,y-1-7.5*Math.sqrt(3));
        rotate(radians(-g.angle));
        text(labels[i],0,0);
        pop();
    }

    // Solvent labels
    fill(g.red); stroke(g.red); 
    for(let i = 0; i < labels.length; i++){
        y = g.ytip + g.dy;
        x = g.xtip+g.dx - 2*g.dx/10*(i+1);
        line(x,y,x+7.5,y+7.5*Math.sqrt(3));
        push();
        noStroke(); translate(x+3,y+12*Math.sqrt(3));
        rotate(radians(g.angle));
        text(labels[i],0,0);
        pop();
    }
    pop();

    // Grid on the triangle
    let dy = g.dy/20;
    let dx = 2*g.dx/20;
    if(g.problemPart < 4){
        push();
        stroke(0,80);
        for(let i = 0; i < 19; i++){
            // Solute lines
            y = g.ytip + g.dy - dy*(i+1);
            x = (y - g.L[1])/g.L[0];
            y1 = y;
            x1 = (y1 - g.R[1])/g.R[0];
            line(x,y,x1,y1);
            // Solvent lines
            // x and y remain the same
            y1 = g.ytip + g.dy;
            x1 = g.xtip - g.dx + dx*(i+1);
            line(x,y,x1,y1);
            // Carrier lines
            // y and y1 remain the same
            x = (y - g.R[1])/g.R[0];
            x1 = g.xtip + g.dx - dx*(i+1);
            line(x,y,x1,y1);
        }
    pop();
    }
    

    // Axes labels
    push();
    noStroke(); textSize(22);
    fill(g.blue);
    text('solute',g.xtip-30,g.ytip-5);
    fill(g.green);
    text('carrier',g.xtip+g.dx+5,g.ytip+g.dy+6);
    fill(g.red);
    text('solvent',g.xtip-g.dx-78,g.ytip+g.dy+8);
    pop();

    // Overall triangle
    push();
    strokeWeight(2); noFill();
    triangle(g.xtip,g.ytip,g.xtip-g.dx,g.ytip+g.dy,g.xtip+g.dx,g.ytip+g.dy);
    pop();

}

function phaseDraw(){
    let a, b, c, dx;
    a = g.phaseConstants[0];
    b = g.phaseConstants[1];
    c = g.phaseConstants[2];
    dx = (g.phaseLims[1]-g.phaseLims[0])/100;

    push();
    noFill(); strokeWeight(2); beginShape();
    for(let i = g.phaseLims[0]; i <= g.phaseLims[1]; i += dx){
        let x = map(i,0,1,g.xtip+g.dx,g.xtip-g.dx);
        let y = map(a*i**2 + b*i + c,0,Math.sqrt(3)/2,g.ytip+g.dy,g.ytip);
        vertex(x,y);
    }
    let xt = map(g.phaseLims[1],0,1,g.xtip+g.dx,g.xtip-g.dx);
    let yt = map(a*g.phaseLims[1]**2 + b*g.phaseLims[1] + c,0,Math.sqrt(3)/2,g.ytip+g.dy,g.ytip);
    vertex(xt,yt); // Additional vertex to account for numerical error in i
    endShape();

    for(let i = 1; i < g.tiepx.length; i++){
        line(g.tiepx[i][0],g.tiepx[i][2],g.tiepx[i][1],g.tiepx[i][3]);
    }
    pop(); 
}

function answersAndUserInput(){
    switch (g.problemPart){
        case (0):
            partOneInput();
            partOneAnswer();
            break;
        case (1):
            
            break;
        case(2):
            
            break;
        case (3):
            
            break;
        case (4):
            
            break;
        case (5):
            
            break;
        case (6):
            
            break;
        case (7):
            
            break;
        case (8):
            
            break;
        case (9):
            
            break;
        case (10):
            
            break;

    }
}


function partOneInput(){
    let temp = g.points[0];
    push();
    fill(0); noStroke();
    ellipse(temp.x,temp.y,2*g.radius);
    fill(255);
    ellipse(temp.x,temp.y,g.radius);
    stroke(0);
    ellipse(temp.x,temp.y-27,30);
    noStroke(); fill(0);
    textSize(22); textStyle(ITALIC);
    text('F',temp.x-8,temp.y-20);
    pop();
}

function partOneAnswer(){
   let x, y;
   let dx, dy;
   y = map(ans.step1[0],0,1,g.ytip+g.dy,g.ytip);
   dy = g.ytip + g.dy - y;
   x = map(ans.step1[1],0,1,g.xtip+g.dx,g.xtip-g.dx);
   dx =  dy/Math.tan(radians(g.angle));
}

function startingPoints(){
    g.points[0].x = g.xtip;
    g.points[0].y = g.ytip+94;
}

function questionOrHintDisplay(){
    let x = 20;
    let y = 30;
    let x2 = 70;
    let y2 = 120;
    push();
    noStroke(); textSize(20);
    switch (g.problemPart){
        case (0):
            if(!g.hintTruth){
                text('Step 1: move the feed point     to the correction location, then check solution',x,y);
                push();
                textStyle(ITALIC);
                text('F',x+252,y);
                pop();
            } else {
                text('Hint: read the compositions on the axes',x,y);
            }
            push(); 
            textSize(22);
            text('feed mole fractions',x2-5,y2-5);
            stroke(0); strokeWeight(1.5);
            rect(x2+20,y2,135,80);
            textSize(20); noStroke();
            fill(g.blue);
            text('solute = '+ans.step1[0],x2+30,y2+20);
            fill(g.red);
            text('solvent = '+ans.step1[1],x2+26,y2+45);
            fill(g.green);
            text('carrier = '+ans.step1[2],x2+30,y2+70);
            pop();
            break;
        case (1):
            if(!g.hintTruth){
                text('Step 2: move the solvent point     to the correct location, then check solution',x,y);
                push();
                textStyle(ITALIC);
                text('S',x+275,y);
                pop();
            } else {
                text('Hint: read the compositions on the axes',x,y);
            }
            push(); 
            textSize(22);
            text('solvent mole fractions',x2-14,y2-5);
            stroke(0); strokeWeight(1.5);
            rect(x2+20,y2,135,80);
            textSize(20); noStroke();
            fill(g.blue);
            text('solute = '+ans.step2[0],x2+40,y2+20);
            fill(g.red);
            text('solvent = '+ans.step2[1],x2+36,y2+45);
            fill(g.green);
            text('carrier = '+ans.step2[2],x2+39,y2+70);
            pop();
            break;
        case (2):
            if(!g.hintTruth){
                text('Step 3: move the desired raffinate point      to the correct location, then check solution',x,y);
                push();
                textStyle(ITALIC);
                text('R',x+353,y);
                textSize(15);
                text('N',x+366.5,y+4);
                pop();
            } else {
                text('Hint: read the compositions on the axes',x,y);
            }
            push(); 
            textSize(22);
            text('raffinate mole fractions',x2-14,y2-5);
            stroke(0); strokeWeight(1.5);
            rect(x2+20,y2,135,80);
            textSize(20); noStroke();
            fill(g.blue);
            text('solute = '+ans.step3[0],x2+30,y2+20);
            fill(g.red);
            text('solvent = '+ans.step3[1],x2+26,y2+45);
            fill(g.green);
            text('carrier = '+ans.step3[2],x2+30,y2+70);
            pop();
            break;
        case (3):
            if(!g.hintTruth){
                text('Step 4: use mass balance for two entering stream (  ,   ) to determine the average',x,y);
                text('composition    , then check solution',x+70,y+25);
                push();
                textStyle(ITALIC);
                text('F S',x+453,y);
                text('M',x+183,y+25);
                pop();
            } else {
                text('Hint: use the lever rule',x,y);
            }
            break;
        case (4):
            if(!g.hintTruth){
                text('Step 5: move the point for the first extract composition      to the correct location,',x,y)
                text('then check solution',x+70,y+25);
                push();
                textStyle(ITALIC);
                text('E',x+485,y);
                textSize(15); textStyle(NORMAL);
                text('1',x+497,y+4);
                pop();
            } else {
                text('Hint: use mass balance for two exit streams (     ,     )',x,y);
                push();
                textStyle(ITALIC);
                text('R    E',x+400,y);
                textSize(15);
                text('N',x+414,y+4);
                textStyle(NORMAL);
                text('1',x+450,y+4);
                pop();
            }
            break;
        case (5):
            if(!g.hintTruth){
                text('Step 6: move the operating point     to the correct location, then check solution',x,y);
                push();
                textStyle(ITALIC);
                text('P',x+296,y);
                pop();
            } else {
                text('Hint: the operating point is at the intersection of a line through    and      and a line',x,y);
                text('through    and   ',x+48,y+25);
                push();
                textStyle(ITALIC);
                text('F',x+549,y);
                text('E',x+607,y);
                text('S',x+119,y+25);
                text('R',x+177,y+25);
                textSize(15);
                text('N',x+191,y+29);
                textStyle(NORMAL);
                text('1',x+620,y+4);
                pop();
            }
            break;
        case (6):
            if(!g.hintTruth){
                text('Step 7: move the blue point to the correct raffinate composition',x,y);
            } else {
                text('Hint: follow the tie line to the other side of the phase boundary',x,y);
            }
            break;
        case (7):
            if(!g.hintTruth){
                text('Step 8: move the yellow point to the correct extraction composition',x,y);
            } else {
                text('Hint: draw a line to the operating point',x,y);
            }
            break;
        case (8): 
            if(!g.hintTruth){
                text('Step 9: mvoe the blue point to the correct raffinate composition',x,y);
            } else {
                text('Hint: follow the tie line to the other side of the phase boundary',x,y);
            }
            break;
        case (9):
            if(!g.hintTruth){
                text('Step 10: move the yellow point to the correct extract composition',x,y);
            } else {
                text('Hint: draw a line to the operating point',x,y);
            }
            break;
        case (10):
            if(!g.hintTruth){
                text('Finished, five stages needed',x,y);
            } else {
                
            }
            break;
    }
    pop();
}

function triSetup(){
    g.xtip = 450;
    g.ytip = 100;
    g.dy = 375;
    g.dx = g.dy*Math.tan(radians(g.angle/2));

    g.R[0] = g.dy/g.dx;
    g.R[1] = g.ytip - g.R[0]*g.xtip;

    g.L[0] = -g.dy/g.dx;
    g.L[1] = g.ytip - g.L[0]*g.xtip;
}

function definePhaseCurve(){
    let x1, x2, x3;
    let y1, y2, y3;

    y1 = 0; y3 = 0;
    y2 = .3 + Math.random()*.1;

    x1 = .02 + Math.random()*.05;
    x2 = .45 + Math.random()*.1;
    x3 = .85 + Math.random()*.13;

    // Equation to solve
    // ax1^2 + bx1 + c = y1
    // ax2^2 + bx2 + c = y2
    // ax3^2 + bx3 + c = y3

    // Solve with least-squares closed form solution
    // (A^TA)^-1A^Tb (in the form Ax = b)

    // Define A matrix and Atranspose
    let A = [[x1**2, x1, 1],[x2**2, x2, 1],[x3**2,x3,1]];
    let AT = math.transpose(A);

    // Define AT*A
    let t1 = x1**3 + x2**3 + x3**3; // Repeated twice
    let t2 = x1**2 + x2**2 + x3**2; // Repeated thrice
    let t3 = x1 + x2 + x3; // Repeated twice
    let ATA = [[x1**4+x2**4+x3**4,t1,t2],[t1,t2,t3],[t2,t3,3]];
    let ATAinv = math.inv(ATA);

    // To help solve (ATA)^-1 * AT
    let row1, row2, row3;
    let col1, col2, col3;

    row1 = ATAinv[0];
    row2 = ATAinv[1];
    row3 = ATAinv[2];
    col1 = [AT[0][0],AT[1][0],AT[2][0]];
    col2 = [AT[0][1],AT[1][1],AT[2][1]];
    col3 = [AT[0][2],AT[1][2],AT[2][2]];

    // b vec
    let bvec = [y1,y2,y3];

    // (ATA)^-1 * AT
    let last = [[math.dot(row1,col1),math.dot(row1,col2),math.dot(row1,col3)],[math.dot(row2,col1),math.dot(row2,col2),math.dot(row2,col3)],[math.dot(row3,col1),math.dot(row3,col2),math.dot(row3,col3)]];
    let ans = [math.dot(last[0],bvec),math.dot(last[1],bvec),math.dot(last[2],bvec)];
    
    g.phaseConstants[0] = ans[0];
    g.phaseConstants[1] = ans[1];
    g.phaseConstants[2] = ans[2];
    g.phaseLims[0] = x1;
    g.phaseLims[1] = x3;
    g.yVals[0] = y1;
    g.yVals[1] = y2;
    g.yVals[2] = y3;
}

function defineTieLines(){
    g.tiepx = []; g.tieslopes = []; g.tiebs = [];

    let y = g.yVals[1];
    let a, b, c;
    let x1, x2, y1, y2;
    let x1px, x2px, y1px, y2px;

    // Line 1
    y1 = (.02 + Math.random()*.03)*y;
    y2 = (.06 + Math.random()*.04)*y;
    y1px = map(y1,0,Math.sqrt(3)/2,g.ytip+g.dy,g.ytip);
    y2px = map(y2,0,Math.sqrt(3)/2,g.ytip+g.dy,g.ytip);
    // x1
    a = g.phaseConstants[0]; b = g.phaseConstants[1]; c = g.phaseConstants[2]-y1;
    x1 = (-b - Math.sqrt(b**2 - 4*a*c))/(2*a);
    x1px = map(x1,0,1,g.xtip+g.dx,g.xtip-g.dx);
    // x2
    c = g.phaseConstants[2]-y2;
    x2 = (-b + Math.sqrt(b**2 -4*a*c))/(2*a);
    x2px = map(x2,0,1,g.xtip+g.dx,g.xtip-g.dx);
    g.tiepx.push([x1px,x2px,y1px,y2px]);

    // Line 2
    y1 = (.15 + Math.random()*.05)*y;
    y2 = (.25 + Math.random()*.05)*y;
    y1px = map(y1,0,Math.sqrt(3)/2,g.ytip+g.dy,g.ytip);
    y2px = map(y2,0,Math.sqrt(3)/2,g.ytip+g.dy,g.ytip);
    // x1
    c = g.phaseConstants[2]-y1;
    x1 = (-b - Math.sqrt(b**2 - 4*a*c))/(2*a);
    x1px = map(x1,0,1,g.xtip+g.dx,g.xtip-g.dx);
    // x2
    c = g.phaseConstants[2]-y2;
    x2 = (-b + Math.sqrt(b**2 - 4*a*c))/(2*a);
    x2px = map(x2,0,1,g.xtip+g.dx,g.xtip-g.dx);
    g.tiepx.push([x1px,x2px,y1px,y2px]);

    // Line 3
    y1 = (.35 + Math.random()*.05)*y;
    y2 = (.5 + Math.random()*.05)*y;
    y1px = map(y1,0,Math.sqrt(3)/2,g.ytip+g.dy,g.ytip);
    y2px = map(y2,0,Math.sqrt(3)/2,g.ytip+g.dy,g.ytip);
    // x1
    c = g.phaseConstants[2]-y1;
    x1 = (-b - Math.sqrt(b**2 - 4*a*c))/(2*a);
    x1px = map(x1,0,1,g.xtip+g.dx,g.xtip-g.dx);
    // x2
    c = g.phaseConstants[2]-y2;
    x2 = (-b + Math.sqrt(b**2 - 4*a*c))/(2*a);
    x2px = map(x2,0,1,g.xtip+g.dx,g.xtip-g.dx);
    g.tiepx.push([x1px,x2px,y1px,y2px]);

    // Line 4
    y1 = (.72 + Math.random()*.05)*y;
    y2 = (.8 + Math.random()*.1)*y;
    y1px = map(y1,0,Math.sqrt(3)/2,g.ytip+g.dy,g.ytip);
    y2px = map(y2,0,Math.sqrt(3)/2,g.ytip+g.dy,g.ytip);
    // x1
    c = g.phaseConstants[2]-y1;
    x1 = (-b - Math.sqrt(b**2 - 4*a*c))/(2*a);
    x1px = map(x1,0,1,g.xtip+g.dx,g.xtip-g.dx);
    // x2
    c = g.phaseConstants[2]-y2;
    x2 = (-b + Math.sqrt(b**2 - 4*a*c))/(2*a);
    x2px = map(x2,0,1,g.xtip+g.dx,g.xtip-g.dx);
    g.tiepx.push([x1px,x2px,y1px,y2px]);

    // Define slopes and vertical shifts of tie lines
    // First add in bottom of the phase curve
    c = g.phaseConstants[2];
    x1 = g.phaseLims[1];
    x1px = map(x1,0,1,g.xtip+g.dx,g.xtip-g.dx);
    x2 = g.phaseLims[0];
    x2px = map(x2,0,1,g.xtip+g.dx,g.xtip-g.dx);
    y1px = map(a*x1**2+b*x1+c,0,Math.sqrt(3)/2,g.ytip+g.dy,g.ytip);
    y2px = map(a*x2**2+b*x2+c,0,Math.sqrt(3)/2,g.ytip+g.dy,g.ytip);
    g.tiepx.splice(0,0,[x1px,x2px,y1px,y2px]);

    for(let i = 0; i < g.tiepx.length; i++){
        let m = (g.tiepx[i][3] - g.tiepx[i][2])/(g.tiepx[i][1] - g.tiepx[i][0]);
        let b = (g.tiepx[i][2] - m*g.tiepx[i][0]);
        g.tieslopes.push(m);
        g.tiebs.push(b);
    }
}

function generateAnswers(){
    // Part 1
    ans.step1[0] = (Math.round((46 + Math.random()*6))/100).toFixed(2);
    ans.step1[2] = (Math.round((35 + Math.random()*11))/100).toFixed(2);
    ans.step1[1] = (1 - ans.step1[0] - ans.step1[2]).toFixed(2);

    // Part 3
    let xRN = .99*g.phaseLims[1];
    let yRN = (g.phaseConstants[0]*xRN**2 + g.phaseConstants[1]*xRN + g.phaseConstants[2]).toFixed(2);
    ans.step3[0] = yRN;
    ans.step3[2] = xRN.toFixed(2);
    ans.step3[1] = (1 - yRN - ans.step3[2]).toFixed(2);

}

