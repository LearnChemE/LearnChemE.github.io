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
    let angle = radians(30);
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
    
    let tieLineInfo = [];
    let xLeft = [0.1014, 0.1036, 0.1072, 0.1127, 0.1218, 0.1391];
    let xRight = [0.8404, 0.7544, 0.6532, 0.5463, 0.4395, 0.3322];
    let yLeft = [];
    let yRight = [];
    // Solving for the y-points on the tie lines
    for(let i = 0; i < xLeft.length; i++){
        for(let j = 0; j < phaseInfo.length; j++){
            if(xLeft[i] > phaseInfo[j][0] && xLeft[i] < phaseInfo[j+1][0]){
                yLeft.push(interpolate(xLeft[i],phaseInfo[j][0],phaseInfo[j+1][0],phaseInfo[j][1],phaseInfo[j+1][1]));
            } else if(xLeft[i] == phaseInfo[j][0]){
                yLeft.push(phaseInfo[j][1]);
            }

            if(xRight[i] > phaseInfo[j][0] && xRight[i] < phaseInfo[j+1][0]){
                yRight.push(interpolate(xRight[i],phaseInfo[j][0],phaseInfo[j+1][0],phaseInfo[j][1],phaseInfo[j+1][1]));
            } else if(xRight[i] == phaseInfo[j][0]){
                yRight.push(phaseInfo[j][1]);
            } 
        }
    }

    // Drawing tie lines
    let x1, x2, y1, y2, b, x1temp, x2temp;
    let slopes = [];
    let positions = [];
    let bvec = [];
    for(let i = 0; i < xLeft.length; i++){
        x1temp = map(xLeft[i],0,1,xtip-dx,xtip+dx);
        x2temp = map(xRight[i],0,1,xtip-dx,xtip+dx);
        y1 = map(yLeft[i],0,1,ytip+dy,ytip);
        y2 = map(yRight[i],0,1,ytip+dy,ytip);
        x1 = (ytip+dy-y1)*Math.tan(angle) + x1temp;
        x2 = (ytip+dy-y2)*Math.tan(angle) + x2temp;
        line(x1,y1,x2,y2);
        b = y1 - ((y2-y1)/(x2-x1))*x1;
        bvec.push(b)
        positions.push([x1,y1,x2,y2]);
        slopes.push((y2-y1)/(x2-x1))
    }
    pop();
    tieLineInfo.push(positions,slopes,bvec);

    // Checking to see if dot is within the the phase envelope
    temp = g.points[0]; // Get coordinates of dot
    let index = findClosest2D(equilatPhasePositions,temp.x,0);
    // s1,2,3 are the indices for the points that make up sets 1, 2, and 3. These sets will be used to ensure the dot is within the phase envelope
    let s1 = findClosestLEFT(equilatPhasePositions,temp.y,1,index);
    let s2;
    if(index == equilatPhasePositions.length-1){
        s2 = [equilatPhasePositions.length-2, equilatPhasePositions.length-1];
    } else if (index == 0){
        s2 = [0, 1];
    } else {
        s2 = [index-1, index, index+1];
    }
    let s3 = findClosestRIGHT(equilatPhasePositions,temp.y,1,index);
    let ymin = 1000;
    for(let i = 0; i < equilatPhasePositions.length; i++){
        if(equilatPhasePositions[i][1] < ymin){
            ymin = equilatPhasePositions[i][1];
        }
    }
    let set1 = []; let set2 = []; let set3 = [];
    for(let i = 0; i < s1.length; i++){
        set1.push(equilatPhasePositions[s1[i]]);
    }
    for(let i = 0; i < s2.length; i++){
        set2.push(equilatPhasePositions[s2[i]]);
    }
    for(let i = 0; i < s3.length; i++){
        set3.push(equilatPhasePositions[s3[i]]);
    }

    // huge list of conditions to be met for the dot to be within the phase envelope curve
    if(temp.y >= ymin && temp.y <= 450 && temp.x > set1[0][0] && temp.y > set1[set1.length-1][1] && ((temp.x > set2[0][0]||temp.x < set2[set2.length-1][0])&&(temp.y > set2[0][1]||temp.y > set2[set2.length-1][1])) && temp.x < set3[set3.length-1][0] && temp.y > set3[0][1]){
        //console.log('in phase envelope')
        g.inPhaseEnvelope = true;
    } else{
        //console.log('not in phase envelope')
        g.inPhaseEnvelope = false;
    }

    return(tieLineInfo);
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
