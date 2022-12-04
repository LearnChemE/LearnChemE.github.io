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

    equilatLabels(leftLine,rightLine,dx,dy);
    

    if(g.gridTruth){
        equilatGrid(leftLine,rightLine,dx,dy);
    }

    if(!g.inPhaseEnvelope){
        equilatMassFracs();
    }

    if(g.phaseTruth){
        let tieInfo = [];
        equilatPhaseDraw(dx,dy);
        // if(g.inPhaseEnvelope){
        //     rightPhaseRep(tieInfo);
        // }
    }
    
    equilatRep(leftLine,rightLine,dx,dy);
    
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

    // Axis labels
    push();
    textSize(22);
    text('solvent mass fraction',205,520);
    push();
    translate(60,360);
    rotate(radians(-60));
    text('carrier mass fraction',0,0);
    pop();
    push();
    translate(440,200);
    rotate(radians(60));
    text('solute mass fraction',0,0);
    pop();

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
function equilatRep(L,R,dx,dy){
    let temp = g.points[0];
    let ytip = 70;
    let xtip = 300;
    
    if(!g.inPhaseEnvelope){
        // Solute line and box display
        let x1, y1, x2, y2;
        push();
        stroke(0,0,255);
        strokeWeight(2);
        fill(0,0,255);
        x1 = temp.x;
        y1 = temp.y;
        y2 = temp.y;
        x2 = (y2 - R[1])/R[0];
        push();
        drawingContext.setLineDash([5,5]);
        line(x1,y1,x2-3,y2);
        pop();
        triangle(x2,y2,x2-15,y2+5,x2-15,y2-5)
        pop();

        g.soluteFrac = (map(temp.y,ytip+dy,ytip,0,1)).toFixed(2);
        if(g.soluteFrac == 0){ // Correction for -0.00
            let t = (0).toFixed(2);
            g.soluteFrac == t;
        }

        if(g.soluteTruth){
            push();
            fill(255);
            rect(x2+10,y2-15,45,30);
            textSize(18); noStroke();
            fill(0,0,255);
            text(g.soluteFrac,x2+15,y2+5)
            pop();
        }

        //Solvent line
        push();
        let angle = 30*Math.PI/180;
        stroke(128,0,128); strokeWeight(2); fill(128,0,128);
        x1 = temp.x;
        y1 = temp.y;
        y2 = ytip+dy-5;
        let btemp = y1-L[0]*temp.x;
        x2 = (y2-btemp)/L[0];
        push();
        drawingContext.setLineDash([5,5]);
        line(x1,y1,x2,y2);
        pop();
        y2 = y2 + 5;
        x2 = (y2-btemp)/L[0];
        let pos = equilatSolventTriangleRep(x2,y2);
        triangle(pos[0],pos[1],pos[2],pos[3],pos[4],pos[5]);
        pop();

        g.solventFrac = (map(x2,xtip-dx,xtip+dx,0,1)).toFixed(2);
        if(g.solventFrac == 0){ // Correction for -0.00
            let t = (0).toFixed(2);
            g.solventFrac == t;
        }

        if(g.solventTruth){
            push();
            fill(255);
            rect(x2-22.5,y2+10,45,30);
            textSize(18); noStroke();
            fill(128,0,128);
            text(g.solventFrac,x2-17.5,y2+30);
            pop();
        }
        
        // Carrier line
        let carFrac = (1 - g.solventFrac - g.soluteFrac);
        g.carrierFrac = carFrac.toFixed(2);
        if(g.carrierFrac == 0){ // Correcting for -0.00
            let t = (0).toFixed(2);
            g.carrierFrac = t;
        }
        
        x2 = map(carFrac,0,1,xtip,xtip-dx); // This is kind of clunky -> I should work on a better method
        y2 = L[0]*x2 + L[1];
        push();
        stroke(255,100,0); strokeWeight(2); fill(255,100,0);
        push();
        drawingContext.setLineDash([5,5]);
        line(temp.x,temp.y,x2,y2);
        pop();
        
        if(g.carrierTruth){
            push();
            fill(255); stroke(0); strokeWeight(1);
            rect(x2-45,y2-30,45,30);
            textSize(18); noStroke();
            fill(255,100,0);
            text(g.carrierFrac,x2-40,y2-10);
            pop();
        }
        pos = equilatCarrierTriangleRep(x2,y2);
        triangle(pos[0],pos[1],pos[2],pos[3],pos[4],pos[5]);
        pop();  
    }
    
}
  
  

// Mass fraction display for equilateral triangle
function equilatMassFracs(){
    if(!g.inPhaseEnvelope){
        push();
        textSize(22);
        text('mass fractions',40,50);
        strokeWeight(2); fill(255);
        rect(37,60,150,88);
        textSize(20); noStroke();
        fill(0,0,255);
        text('solute = ' + g.soluteFrac, 52,85);
        fill(128,0,128);
        text('solvent = ' + g.solventFrac,50,110);
        fill(255,100,0);
        text('carrier = ' + g.carrierFrac,52,135);
        pop();
    }
}

function equilatPhaseDraw(dx,dy){
    let ytip = 70;
    let xtip = 300;
    let temp, x, y, xtemp;
    let angle = radians(60);
    let equilatPhasePositions = [];
    push(); noFill(); strokeWeight(2.5);
    beginShape();

    for(let i = 0; i < phaseInfo.length; i++){
        temp = phaseInfo[i];
        xtemp = map(temp[0],0,1,xtip-dx,xtip+dx);
        y = map(temp[1],0,1,ytip+dy,ytip);
        x = (ytip+dy-y)*Math.tan(angle) + xtemp;
        equilatPhasePositions.push([x,y]);
        vertex(x,y);
    }
    endShape();
    pop();
    //console.log(equilatPhasePositions)
}

// For evaluating vertices of triangle on solvent representation line
function equilatSolventTriangleRep(x1,y1){
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

function equilatCarrierTriangleRep(x1,y1){
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
