// Functions for the right triangle mode \\

function rightTriangle() {
    push();
    noFill();
    strokeWeight(2);
    triangle(100, 50, 100, 450, 500, 450)
    pop();
    
    rightLabels();
    if (g.gridTruth) {
        rightGrid();
    }
    if(!g.inPhaseEnvelope){
        rightMassFracs();
    }
    
    if(g.phaseTruth){
        let tieInfo = [];
        tieInfo = rightPhaseDraw();
        if(g.inPhaseEnvelope){
            rightPhaseRep(tieInfo);
        }
    }
    rightRep();
}

// Labels for right triangle
function rightLabels() {
    let labels = ['0.1', '0.2', '0.3', '0.4', '0.5', '0.6', '0.7', '0.8', '0.9'];
    // Solvent labels
    push();
    fill(128, 0, 128);
    textSize(18);
    for (let i = 0; i < labels.length; i++) {
        text(labels[i], 90 + 40 * (i + 1), 475);
        if (i == labels.length - 1) {
            textSize(22);
            text('solvent', 510, 460);
        }
    }
    pop();
    // Solute labels
    push();
    fill(0, 0, 255);
    textSize(18);
    for (let i = 0; i < labels.length; i++) {
        text(labels[i], 70, 450 - 40 * (i + 1));
        if (i == labels.length - 1) {
            textSize(22);
            noStroke();
            text('solute', 70, 40);
        }
    }
    pop();
    push();
    textSize(22);
    fill(255, 100, 0);
    noStroke();
    text('carrier', 35, 470)
    pop();
    push();
    textSize(22);
    text('solvent mass fraction', 200, 520);
    let angle1 = radians(270);
    translate(35, 350);
    rotate(angle1);
    text('solute mass fraction', 0, 0);
    pop();
}

// Grid lines for right triangle
function rightGrid() {
    // Solvent grid
    push();
    stroke(128, 0, 128, 80);
    for (let i = 0; i < 9; i++) {
        line(100 + 40 * (i + 1), 450, 100 + 40 * (i + 1), 40 * (i + 1) + 50);
    }
    pop();
    // Solute grid
    push();
    stroke(0, 0, 255, 80);
    for (let i = 0; i < 9; i++) {
        line(100, 450 - 40 * (i + 1), 500 - 40 * (i + 1), 450 - 40 * (i + 1))
    }
    pop();
    // Carrier grid
    push();
    stroke(255, 100, 0, 80);
    for (let i = 0; i < 9; i++) {
        line(100, 450 - 40 * (i + 1), 100 + 40 * (i + 1), 450);
    }
    pop();
}

// Mass fraction lines for right triangle
function rightRep() {
    let temp = g.points[0];
    if(!g.inPhaseEnvelope){
        // Solute line
        push();
        stroke(0, 0, 255);
        strokeWeight(2);
        fill(0, 0, 255);
        for (let i = temp.x; i > 105; i -= 10) {
            line(i, temp.y, i - 5, temp.y);
        }
        if (temp.x - 100 > 5) {
            triangle(102, temp.y, 125, temp.y + 5, 125, temp.y - 5);
        }
        pop();
        let soluteVal = map(temp.y, 450, 50, 0, 1); // Defines mass fraction based on position
        let sVal = soluteVal.toFixed(2);
        g.soluteFrac = sVal; // Assigns to global variable for display in mass fractions box
        push();
        if (g.soluteTruth) { // Displaying on the triangle axis for when checkbox is checked
            fill(255);
            rect(45, temp.y - 20, 45, 30);
            textSize(18);
            noStroke();
            fill(0, 0, 255);
            text(sVal, 50, temp.y);

        }
        pop();
        // Solvent line
        push();
        stroke(128, 0, 128);
        strokeWeight(2);
        fill(128, 0, 128);
        for (let i = temp.y; i < 445; i += 10) {
            line(temp.x, i, temp.x, i + 5);
        }
        if (450 - temp.y > 5) {
            triangle(temp.x, 448, temp.x + 5, 425, temp.x - 5, 425);
        }
        pop();
        push();
        let solventVal = map(temp.x, 100, 500, 0, 1); // Defines mass fraction based on position
        let soVal = solventVal.toFixed(2);
        g.solventFrac = soVal; // Assigns to global variable
        if (g.solventTruth) { // Displaying on the triangle axis for when checkbox is checked
            fill(255);
            rect(temp.x - 20, 460, 45, 30);
            textSize(18);
            noStroke();
            fill(128, 0, 128);
            text(soVal, temp.x - 15, 480);
        }
        pop();

        // Draws the carrier line
        push();
        stroke(255, 100, 0);
        strokeWeight(2);
        drawingContext.setLineDash([5, 5]);
        let diff1, diff2;
        diff1 = 450 - temp.y;
        diff2 = temp.x - 100;
        line(temp.x, temp.y, diff1 + temp.x, 450);
        line(temp.x, temp.y, 100, temp.y - diff2);
        if (g.carrierTruth && diff1 > 25 && g.solventTruth) { // These conditionals keep the display nice when both solvent and carrier boxes are checked
            line(diff1 + temp.x, 450, diff1 + temp.x, 500);
            push();
            drawingContext.setLineDash([0, 0]);
            stroke(0);
            strokeWeight(1);
            fill(255);
            rect(diff1 + temp.x - 20, 500, 45, 30);
            textSize(18);
            noStroke();
            fill(255, 100, 0);
            text(g.carrierFrac, diff1 + temp.x - 15, 520);
            pop();
        } else if (g.carrierTruth && diff1 < 25 && g.solventTruth) {
            line(diff1 + temp.x, 450, diff1 + temp.x, 460);
            line(diff1 + temp.x, 492, diff1 + temp.x, 500);
            push();
            drawingContext.setLineDash([0, 0]);
            stroke(0);
            strokeWeight(1);
            fill(255);
            rect(diff1 + temp.x - 20, 500, 45, 30);
            strokeWeight(.8);
            textSize(18);
            noStroke();
            fill(255, 100, 0);
            text(g.carrierFrac, diff1 + temp.x - 15, 520);
            pop();
        } else if (g.carrierTruth && !g.solventTruth) {
            line(diff1 + temp.x, 450, diff1 + temp.x, 500);
            push();
            drawingContext.setLineDash([0, 0]);
            stroke(0);
            strokeWeight(1);
            fill(255);
            rect(diff1 + temp.x - 20, 500, 45, 30);
            strokeWeight(.8);
            textSize(18);
            noStroke();
            fill(255, 100, 0);
            text(g.carrierFrac, diff1 + temp.x - 15, 520);
            pop();
        }
        pop();
        let temp1 = 1 - sVal - soVal;
        let temp2 = temp1.toFixed(2);
        g.carrierFrac = temp2;
    } 
}

// Mass fraction display for right triangle
function rightMassFracs() {
    // Slight correction to avoid displaying -0.00
    
    if (g.carrierFrac == 0) {
        let temp = 0;
        let temp1 = temp.toFixed(2);
        g.carrierFrac = temp1;
    }
    push();
    textSize(22);
    text('mass fractions', 353, 90);
    strokeWeight(2);
    fill(255);
    rect(350, 100, 150, 88);
    textSize(20);
    strokeWeight(.2);
    noStroke();
    fill(0, 0, 255);
    text('solute = ' + g.soluteFrac, 365, 125);
    fill(128, 0, 128);
    text('solvent = ' + g.solventFrac, 363, 150);
    fill(255, 100, 0);
    text('carrier = ' + g.carrierFrac, 365, 175);
    pop();
    
}

function rightPhaseDraw(){

    let rightPhasePositions = [];
    let temp, x, y;
    push(); noFill(); strokeWeight(2.5);
    beginShape();
    
    for(let i = 0; i < phaseInfo.length; i++){
        temp = phaseInfo[i];
        x = map(temp[0],0,1,100,500);
        y = map(temp[1],0,1,450,50);
        rightPhasePositions.push([x,y]); // Storing the x & y coords of the phase curve
        vertex(x,y);
    }
    endShape();
    
    let tieLineInfo = [];
    // Points from mathematica for tie lines
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
    let x1, x2, y1, y2, b;
    let slopes = [];
    let positions = [];
    let bvec = [];
    for(let i = 0; i < xLeft.length; i++){
        x1 = map(xLeft[i],0,1,100,500);
        x2 = map(xRight[i],0,1,100,500);
        y1 = map(yLeft[i],0,1,450,50);
        y2 = map(yRight[i],0,1,450,50);
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
    let index = findClosest2D(rightPhasePositions,temp.x,0);
    // s1,2,3 are the indices for the points that make up sets 1, 2, and 3. These sets will be used to ensure the dot is within the phase envelope
    let s1 = findClosestLEFT(rightPhasePositions,temp.y,1,index);
    let s2;
    if(index == rightPhasePositions.length-1){
        s2 = [rightPhasePositions.length-2, rightPhasePositions.length-1];
    } else if (index == 0){
        s2 = [0, 1];
    } else {
        s2 = [index-1, index, index+1];
    }
    let s3 = findClosestRIGHT(rightPhasePositions,temp.y,1,index);
    let ymin = 1000;
    for(let i = 0; i < rightPhasePositions.length; i++){
        if(rightPhasePositions[i][1] < ymin){
            ymin = rightPhasePositions[i][1];
        }
    }
    let set1 = []; let set2 = []; let set3 = [];
    for(let i = 0; i < s1.length; i++){
        set1.push(rightPhasePositions[s1[i]]);
    }
    for(let i = 0; i < s2.length; i++){
        set2.push(rightPhasePositions[s2[i]]);
    }
    for(let i = 0; i < s3.length; i++){
        set3.push(rightPhasePositions[s3[i]]);
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

function rightPhaseRep(tieInfo){
    let temp = g.points[0];
    let slopes = tieInfo[1];
    let pos = tieInfo[0]; // 6 vectors that hold x1,y1,x2,y2 
    let bvec = tieInfo[2];

    slopes.splice(0,0,0);
    pos.splice(0,0,[140,450,460,450]);
    bvec.splice(0,0,450);
    
    let tempYvals = new Array(7);
    // These are the points in each line in line with the current x position of the dot
    for(let i = 0; i < slopes.length; i++){
        tempYvals[i] = slopes[i]*temp.x + bvec[i];
    }

    // Plait point
    let xP = 0.1956;
    let index = findClosest2D(phaseInfo,xP,0);
    //let yP = interpolate(xP,phaseInfo[index][0],phaseInfo[index+1][0],phaseInfo[index][1],phaseInfo[index+1][1]);
    push();
    strokeWeight(3);
    stroke(50,205,50);
    beginShape();
    noFill();
    let x, y;
    for(let i = 0; i <= index; i++){
        x = map(phaseInfo[i][0],0,1,100,500);
        y = map(phaseInfo[i][1],0,1,450,50);
        vertex(x,y);
    }
    endShape();
    pop();
    push();
    strokeWeight(3);
    stroke(255,0,255);
    beginShape();
    noFill();
    for(let i = index; i < phaseInfo.length; i++){
        x = map(phaseInfo[i][0],0,1,100,500);
        y = map(phaseInfo[i][1],0,1,450,50);
        vertex(x,y);
    }
    endShape();
    pop();
    
    let temp2;
    let rightPhasePositions = [];
    for(let i = 0; i < phaseInfo.length; i++){
        temp2 = phaseInfo[i];
        x = map(temp2[0],0,1,100,500);
        y = map(temp2[1],0,1,450,50);
        rightPhasePositions.push([x,y]); // Storing the x & y coords of the phase curve  
    }
    
  
    let region = 0;
    let deltaY, deltaToCurrentPosition, mx, xL, xR, yL, yR, bx;
    for(let i = 0; i < slopes.length-1; i++){
        // To solve for the tie line at a given point, lever rule is used vertically between current position and the lines above and below it
        if(temp.y < tempYvals[i] && temp.y > tempYvals[i+1]){
            region = i+1;
            deltaY = tempYvals[i]-tempYvals[i+1]; // Total distance between lines
            deltaToCurrentPosition = tempYvals[i]-temp.y; // Distance from lower line to current position

            mx = slopes[i]*(1-deltaToCurrentPosition/deltaY) + slopes[i+1]*(deltaToCurrentPosition/deltaY); // Calculating line slope based on current position as fraction of slopes bounding the dot
            bx = temp.y - mx*temp.x; // Solving for y-intercept of line

            // Calculating left and right x-positions to represent tie-line at a given position
            xL = pos[i][0]*(1-deltaToCurrentPosition/deltaY) + pos[i+1][0]*(deltaToCurrentPosition/deltaY);
            xR = pos[i][2]*(1-deltaToCurrentPosition/deltaY) + pos[i+1][2]*(deltaToCurrentPosition/deltaY);
            yL = mx*xL + bx;
            yR = mx*xR + bx;
           
        } else if(temp.y < tempYvals[slopes.length-1]){
            let ratio = tempYvals[slopes.length-1]/temp.y;
            mx = slopes[slopes.length-1]*ratio;
            bx = temp.y - mx*temp.x;
            let t = rightRegionSevenCoordinates(mx,bx,rightPhasePositions,index);
            xL = t[0]; xR = t[1];
            yL = mx*xL + bx;
            yR = mx*xR + bx;
        } else if(temp.y == 450){ // Condition for the line being at the bottom of the triangle
            xL = 140; yL = 450; xR = 460; yR = 450;
        }
    }
    
    rightInPhaseDisplay(xL,xR,yL,yR);
    push();
    strokeWeight(3);
    drawingContext.setLineDash([10,10])
    line(xL,yL,xR,yR);
    pop();
    push();
    fill(255,0,255); noStroke();
    ellipse(xR,yR,13);
    fill(50,205,50);
    ellipse(xL,yL,13);
    pop();
    
    

}

function interpolate(xcurrent, x1, x2, y1, y2){
    let y;
    y = y1 + (xcurrent-x1)*(y2-y1)/(x2-x1);
    return(y);
}

function findClosest2D(arr,target,pos){ // Can only be used for 2D arrays as it's currently set up
    let best = 1000;
    let index, difference;
    for(let i = 0; i < arr.length; i++){
        difference = abs(arr[i][pos]-target); 
        if (difference < best){
            best = difference;
            index = i;
        }
    }
    return(index);
}

function findClosestRIGHT(arr,target,pos,start){
    let best = 1000;
    let index, difference;
    let temp;
    // Ensures position check is done against the right side of phase envelope for small 
   
    if (start <= 1){
        start = 2;
    }
    for(let i = start; i < arr.length; i++){
        difference = abs(arr[i][pos]-target);
        if(difference < best){
            best = difference;
            index = i;
        }
    }
    if(index == arr.length-1){
        temp = [arr.length-2, arr.length-1];
    } else {
        temp = [index-1, index, index+1];
    }
    return(temp);
}

function findClosestLEFT(arr,target,pos,start){
    let best = 1000;
    let index, difference;
    let temp;
    if (start == 0 || start == 1){
        index = 0;
    } else {
        for(let i = start-1; i > 0; i--){
            difference = abs(arr[i][pos]-target);
            if(difference<best){
                best = difference;
                index = i;
            }
        }
    }
    if(index == 0){
        temp = [0, 1];
    } else {
        temp = [index-1, index, index+1]
    }
    return(temp);
}

// This function is for finding the coordinates of left and right points when in region 7 of phase envelope (R7 is highest section)
function rightRegionSevenCoordinates(mx,bx,phasePos,index){
    
    //let temp = g.points[0];
    let xL, xR, m, b, x, y;
    for(let i = 0; i < phasePos.length-1; i++){
        m = (phasePos[i+1][1]-phasePos[i][1])/(phasePos[i+1][0]-phasePos[i][0]);
        b = phasePos[i][1] - m*phasePos[i][0];
        x = (bx-b)/(m-mx);
        
        if(x > phasePos[i][0] && x < phasePos[i+1][0] && i < index){
            xL = x;
        } else if(x == phasePos[i][0] && i < index){
            xL = phasePos[i][0];
        } 

        if(x > phasePos[i][0] && x < phasePos[i+1][0] && i > index){
            xR = x;
        } else if (x == phasePos[i][0] && i > index){
            xR = phasePos[i][0];
        }
    }
    return([xL,xR])
}

function rightInPhaseDisplay(xL,xR,yL,yR){
    let diff = new Array(4);
    push();
    // Orange carrier lines
    stroke(255,100,0);
    strokeWeight(2);
    drawingContext.setLineDash([5,5]);
    diff[0] = 450 - yL;
    diff[1] = xL - 100;
    line(xL,yL,xL+diff[0],450);
    line(xL,yL,100,yL-diff[1]);
    diff[2] = 450 - yR;
    diff[3] = xR - 100;
    line(xR,yR,xR+diff[2],450);
    line(xR,yR,100,yR-diff[3]);
    // Blue solute lines
    stroke(0,0,255); fill(0,0,255);
    line(xL,yL,105,yL);
    line(xR,yR,105,yR);
    push();
    drawingContext.setLineDash([0,0]);
    triangle(102,yL,125,yL+5,125,yL-5);
    triangle(102,yR,125,yR+5,125,yR-5);
    pop();

    // Purple solvent lines
    stroke(128,0,128); fill(128,0,128);
    line(xL,yL,xL,445);
    line(xR,yR,xR,445)
    push();
    drawingContext.setLineDash([0,0]);
    triangle(xL,448,xL+5,425,xL-5,425);
    triangle(xR,448,xR+5,425,xR-5,425);
    pop();
    pop();

    // Labels for display when checkboxes are selected
    // First determine mass fractions
    let solu_raf, solv_raf, car_raf;
    let solu_ext, solv_ext, car_ext;

    solu_raf = (map(yL,450,50,0,1)).toFixed(2);
    solv_raf = (map(xL,100,500,0,1)).toFixed(2);
    car_raf = (1 - solu_raf - solv_raf).toFixed(2);
    
    solu_ext = (map(yR,450,50,0,1)).toFixed(2);
    solv_ext = (map(xR,100,500,0,1)).toFixed(2);
    car_ext = (1 - solu_ext - solv_ext).toFixed(2);
    
    if(g.soluteTruth){
        push();
        textSize(18);
        fill(255);
        stroke(50,205,50);
        rect(45,yL-20,45,30);
        push();
        noStroke(); fill(0,0,255);
        text(solu_raf,50,yL);
        pop();
        stroke(255,0,255);
        rect(45,yR-20,45,30);
        noStroke(); fill(0,0,255);
        text(solu_ext,50,yR);
        pop();
    }

    // Using these conditions to prevent overlap
    if(g.carrierTruth){
        push();
        strokeWeight(2);
        drawingContext.setLineDash([5,5]);
        stroke(255,100,0);
        line(diff[0]+xL,450,diff[0]+xL,500);
        line(diff[2]+xR,450,diff[2]+xR,500);
        pop();
        push();
        stroke(50,205,50); fill(255);
        rect(diff[0]+xL-20,500,45,30);
        noStroke(); textSize(18);
        fill(255,100,0);
        text(car_raf,diff[0]+xL-15,520);
        stroke(255,0,255); fill(255);
        rect(diff[2]+xR-20,500,45,30);
        noStroke(); 
        fill(255,100,0);
        text(car_ext,diff[2]+xR-15,520);
        pop();
    }

    if(g.solventTruth){
        push();
        fill(255); stroke(50,205,50);
        rect(xL-20,460,45,30);
        textSize(18); noStroke();
        fill(128,0,128);
        text(solv_raf,xL-15,480);
        pop();
        push();
        fill(255); stroke(255,0,255);
        rect(xR-20,460,45,30);
        textSize(18); noStroke();
        fill(128,0,128);
        text(solv_ext,xR-15,480);
        pop();
    }

   
    
    
    
    
    // Mass fraction display
    push();
    textSize(22); noStroke();
    text('mass fractions',330,50);
    textSize(20)
    fill(50,205,50);
    text('raffinate phase',260,80);
    fill(255,0,255);
    text('extract phase',430,80);
    fill(0,0,255);
    text('solute = '+solu_raf,265,115);
    text('solute = '+solu_ext,432,115);
    fill(128,0,128);
    text('solvent = '+solv_raf,263,140);
    text('solvent = '+solv_ext,430,140);
    fill(255,100,0);
    text('carrier = '+car_raf,265,165);
    text('carrier = '+car_ext,432,165);
    noFill();
    stroke(50,205,50);
    rect(250,90,150,88);
    stroke(255,0,255);
    rect(417,90,150,88);
    pop();
}
