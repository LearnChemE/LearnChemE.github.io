// Functions for the right triangle

function rightTriangle() {
    push();
    noFill();
    strokeWeight(2);
    triangle(100, 50, 100, 450, 500, 450)
    pop();
    rightRep();
    rightLabels();
    if (g.gridTruth) {
        rightGrid();
    }
    if(!g.phaseTruth){
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

// Copied from Mathematica's source code
const rightPhaseinfo = [[0.1, 0], [0.1021, 0.05104], [0.105, 0.098], [0.108, 0.1422], [0.113, 0.183], [0.1181, 0.22], [0.125, 0.254], [0.132, 0.2853], [0.14, 0.313], [0.149, 0.338], [0.159, 0.36], [0.17, 0.379], [0.181, 0.396], [0.194, 0.4093], [0.2082, 0.42], [0.222, 0.429], [0.2382, 0.435], [0.254, 0.438], [0.271, 0.44], [0.29, 0.438], [0.309, 0.435], [0.329, 0.429], [0.3503, 0.422], [0.372, 0.4123], [0.395, 0.4], [0.419, 0.387], [0.444, 0.371], [0.4703, 0.354], [0.497, 0.335], [0.525, 0.315], [0.554, 0.292], [0.584, 0.269], [0.615, 0.244], [0.647, 0.217], [0.68, 0.19], [0.714, 0.161], [0.749, 0.131], [0.785, 0.099], [0.8231, 0.067], [0.861, 0.034], [0.9, 0.]];
// Adds additional points to help the resolution on whether or not the dot is within the phase envelope
for(let i = 0; i < rightPhaseinfo.length-1; i+=2){
    let x, y;
    x = rightPhaseinfo[i][0] + 1/2*(rightPhaseinfo[i+1][0]-rightPhaseinfo[i][0]);
    y = rightPhaseinfo[i][1] + 1/2*(rightPhaseinfo[i+1][1]-rightPhaseinfo[i][1]);
    rightPhaseinfo.splice(i+1,0,[x,y]);
}



function rightPhaseDraw(){

    let rightPhasePositions = [];
    let temp, x, y;
    push(); noFill(); strokeWeight(2.5);
    beginShape();
    
    for(let i = 0; i < rightPhaseinfo.length; i++){
        temp = rightPhaseinfo[i];
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
        for(let j = 0; j < rightPhaseinfo.length; j++){
            if(xLeft[i] > rightPhaseinfo[j][0] && xLeft[i] < rightPhaseinfo[j+1][0]){
                yLeft.push(interpolate(xLeft[i],rightPhaseinfo[j][0],rightPhaseinfo[j+1][0],rightPhaseinfo[j][1],rightPhaseinfo[j+1][1]));
            } else if(xLeft[i] == rightPhaseinfo[j][0]){
                yLeft.push(rightPhaseinfo[j][1]);
            }

            if(xRight[i] > rightPhaseinfo[j][0] && xRight[i] < rightPhaseinfo[j+1][0]){
                yRight.push(interpolate(xRight[i],rightPhaseinfo[j][0],rightPhaseinfo[j+1][0],rightPhaseinfo[j][1],rightPhaseinfo[j+1][1]));
            } else if(xRight[i] == rightPhaseinfo[j][0]){
                yRight.push(rightPhaseinfo[j][1]);
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
        // for(let i = 0; i < slopes.length; i++){
        //     let b = pos[i][1]-slopes[i]*pos[i][0];
        //     bvec.push(b)
        // }
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
    for(let i = 0; i < slopes.length; i++){
        tempYvals[i] = slopes[i]*temp.x + bvec[i];
    }
    
    let region = 0;
    let delY, delc, mx;
    for(let i = 0; i < slopes.length-1; i++){
        if(temp.y < tempYvals[i] && temp.y > tempYvals[i+1]){
            region = i+1;
            delY = tempYvals[i]-tempYvals[i+1];
            delc = tempYvals[i]-temp.y;
            mx = slopes[i]*(1-delc/delY) + slopes[i+1]*(delc/delY);
        } else if(temp.y < tempYvals[slopes.length-1]){
            region = 7;
            let ratio = tempYvals[slopes.length-1]/temp.y;
            mx = slopes[slopes.length-1]*ratio;
        } else if(temp.y == 450){
            region = 1;
            mx = 0;
        }
    }
    //console.log(`region: ${region}`)

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
