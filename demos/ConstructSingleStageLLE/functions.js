
function frameDraw(){
    let x, y, ytemp;
    let x1, y1;
    labels = ['10','20','30','40','50','60','70','80','90'];
    

    let dy = g.dy/20;
    let dx = 2*g.dx/20;
    let count = 8;

    push();
    // Grid
    stroke(0,80);
    for(let i = 0; i < 19; i++){
        // Solute lines
        y = g.ytip+g.dy - dy*(i+1);
        x = (y-g.L[1])/g.L[0];
        y1 = y;
        x1 = (y1-g.R[1])/g.R[0];
        line(x,y,x1,y1);
        // Solvent lines
        // x and y remain the same
        y1 = g.ytip + g.dy;
        x1 = (g.xtip-g.dx) + dx*(i+1);
        line(x,y,x1,y1);
        // Carrier lines
        // y and y1 remain the same
        x = (y-g.R[1])/g.R[0];
        x1 = (g.xtip+g.dx) - dx*(i+1);
        line(x,y,x1,y1);
    }
    pop();

    // Labels
    dy = dy*2;
    dx = dx*2;
    push();
    textSize(20); noStroke();
    for(let i = 0; i < labels.length; i++){
        // Solute labels
        fill(g.blue);
        y = g.ytip+g.dy - dy*(i+1);
        x = (y-g.R[1])/g.R[0];
        push();
        stroke(0,80);
        line(x,y,x+8,y);
        pop();
        text(labels[i],x+10,y+5);

        // Solvent labels
        fill(g.green);
        x = (y-g.L[1])/g.L[0];
        push();
        stroke(0,80);
        line(x,y,x-4,y-4*Math.sqrt(3));
        pop();
        push();
        translate(x-23,y-25);
        rotate(radians(g.angle));
        text(labels[count],0,0);
        count--;
        pop();

        // Carrier labels
        fill(g.red);
        y = g.ytip+g.dy;
        x = (g.xtip-g.dx) + dx*(i+1);
        push();
        stroke(0,80);
        line(x,y,x-4,y+4*Math.sqrt(3));
        pop();
        push();
        translate(x-10,y+32);
        rotate(radians(-g.angle));
        text(labels[i],0,0);
        pop();
    }
    pop();

    push();
    noStroke(); textSize(22);
    fill(g.blue);
    translate(590,200);
    rotate(radians(g.angle));
    text('solute',0,0);
    pop();
    push();
    noStroke(); textSize(22); 
    fill(g.red);
    text('carrier',g.xtip-30,g.ytip+g.dy+55);
    pop();
    push();
    noStroke(); textSize(22); 
    fill(g.green);
    translate(275,260);
    rotate(radians(-g.angle));
    text('solvent',0,0);
    pop();


    push();
    strokeWeight(2); noFill();
    triangle(g.xtip,g.ytip,g.xtip-g.dx,g.ytip+g.dy,g.xtip+g.dx,g.ytip+g.dy);
    pop();
  

    push();
    textSize(20); noStroke();
    text(g.question,10,25);
    pop();
}

function phaseAndTieDraw(){
    
    let tie = g.tiepx[g.phaseNumber];
    let fit = fits[g.phaseNumber];
    let lim = lims[g.phaseNumber];

    let dx = (lim[1] - lim[0])/100;
    let temp = [];

    for(let i = lim[0]; i <= lim[1]; i += dx){
        let x = i;
        let y = 0;
        let exp = fit.length-1;
        for(let j = 0; j < fit.length; j++){
            y = y + fit[j]*i**exp;
            exp--;
        }
        temp.push([x,y]);
        
        // Closing off the curve for the curve 0, numerical error in i
        if(lim[1]-i < dx && (g.phaseNumber == 0 || g.phaseNumber == 2 || g.phaseNumber == 3)){
            let x = lim[1];
            let y = 0;
            let exp = fit.length-1;
            for(let k = 0; k < fit.length; k++){
                y = y + fit[k]*x**exp;
                exp--;
            }
            temp.push([x,y]);
        }
    }
   

    push();
    noFill(); strokeWeight(2); 
    beginShape();
    for(let i = 0; i < temp.length; i++){
        x = map(temp[i][0],0,1,g.xtip-g.dx,g.xtip+g.dx);
        y = map(temp[i][1],0,Math.sqrt(3)/2,g.ytip+g.dy,g.ytip);
        vertex(x,y);
    }
    endShape();

    for(let i = 0; i < tie.length; i++){
        for(let j = 0; j < tie[i].length; j++){
            let x1 = tie[i][0][0];
            let y1 = tie[i][0][1];
            let x2 = tie[i][1][0];
            let y2 = tie[i][1][1];
            line(x1,y1,x2,y2);
        }
    }
    pop();
}


function questionDetails(){
    // Part 1
    switch(g.problemPart){
        case (0):
            push(); strokeWeight(1.5);
            rect(80,90,150,80);
            pop();
            push();
            noStroke(); textSize(22);
            text('mass % in feed',80,80);
            textSize(20);
            text('solute = '+g.step1[0]+'%',100,110);
            text('carrier = '+g.step1[1]+'%',98,135);
            text('solvent = '+g.step1[2]+'%',100,160);
            pop();
            break;
        case (1):
            push(); strokeWeight(1.5);
            rect(80,90,150,80);
            pop();
            push();
            noStroke(); textSize(22);
            text('mass % in solvent',68,80);
            textSize(20);
            text('solute = '+g.step2[0]+'%',102,110);
            text('carrier = '+g.step2[1]+'%',100,135);
            text('solvent = '+g.step2[2]+'%',90,160);
            pop();
            break;
        case (3):
            push(); strokeWeight(1.5);
            rect(80,90,150,55);
            pop();
            push();
            noStroke(); textSize(22);
            text('mass flow (kg/h)',75,80);
            textSize(20);
            text('feed = '+g.step4[0],116,110);
            text('solvent = '+g.step4[2],90,135);
            textStyle(ITALIC);
            text('F/S',115,170);
            textStyle(NORMAL);
            text('= '+g.step4[1],155,170);
            pop();
            break;
        case (4):
            if(!g.solutionTruth){
                push(); strokeWeight(1.5);
                rect(80,90,150,55);
                pop();
                push();
                noStroke(); textSize(22);
                text('mass flow (kg/h)',75,80);
                textSize(20);
                text('feed = '+g.step4[0],116,110);
                text('solvent = '+g.step4[2],90,135);
                textStyle(ITALIC);
                text('F/S',115,170);
                textStyle(NORMAL);
                text('= '+g.step4[1],155,170);
                pop();
            }
            break;
    }
}

function answersAndInput(){   
    switch (g.problemPart){
        case (0):
            partOneInput();
            partOneAnswer();
            break;
        case (1):
            partTwoInput();
            partOneAnswer();
            partTwoAnswer();
            break;
        case (2):
            partThreeInput();
            partThreeAnswer(); // Three placed over one and two so line is under the F and S points
            partOneAnswer();
            partTwoAnswer();
            break;
        case (3):
            partThreeAnswer();
            partOneAnswer();
            partTwoAnswer();
            partFourInput();
            partFourAnswer();
            break;
        case (4):
            partThreeAnswer();
            partOneAnswer();
            partTwoAnswer();
            let temp = partFourAnswer();
            partFiveAnswer(temp[0],temp[1]); // Only displayed on part 4
            break;
        case (5):
            partThreeAnswer();
            partOneAnswer();
            partTwoAnswer();
            let temp2 = partFourAnswer();
            partSixInput();
            partSixAnswer(temp2[0],temp2[1]); 
            break;
    }
}

function partOneAnswer(){
    // Map feed coordinates to place on the ternary diagram
    let x, y;
    let dx, dy;
    y = map(g.step1[0],0,100,g.ytip+g.dy,g.ytip);
    dy = g.ytip + g.dy - y;
    x = map(g.step1[1],0,100,g.xtip-g.dx,g.xtip+g.dx);
    dx = dy/Math.tan(radians(g.angle));
    push();
    noStroke(); fill(g.color1);
    if(g.solutionTruth || g.problemPart != 0){
        ellipse(x+dx,y,14);
    }
    
    if(g.problemPart != 0){
        fill(255);
        rect(x+dx-10,y-30,20,20);
        fill(g.color1);
        textSize(20);
        text('F',x+dx-5,y-13);
    }
    pop();

    
}

function partOneInput(){
    let temp = g.points[0];
    push();
    noStroke(); fill(g.color1);
    ellipse(temp.x,temp.y,2*g.radius);
    fill(255);
    ellipse(temp.x,temp.y,g.radius);
    rect(temp.x-21,temp.y-30,41,18);
    fill(g.color1); textSize(20);
    text('feed',temp.x-20,temp.y-15);
    pop();
}

function partTwoAnswer(){
    // Map solvent coordinates to place on diagram
    let x, y;
    x = g.xtip - g.dx;
    y = g.ytip + g.dy;
    push();
    noStroke(); fill(g.color2);
    if(g.solutionTruth || g.problemPart > 1){
        ellipse(x,y,14);
    }
    if(g.problemPart > 1){
        fill(255);
        rect(x-11,y-30,21,20);
        fill(g.color2);
        textSize(20);
        text('S',x-7,y-13);
    }
    pop();
}

function partTwoInput(){
    let temp = g.points[0];
    push();
    noStroke(); fill(g.color2);
    ellipse(temp.x,temp.y,2*g.radius);
    fill(255);
    ellipse(temp.x,temp.y,g.radius);
    rect(temp.x-32,temp.y-30,65,18);
    fill(g.color2); textSize(20);
    text('solvent',temp.x-32,temp.y-15);
    pop();
}

function partThreeAnswer(){
    // Connect feed and solvent points
    let x, y;
    let dx, dy;
    y = map(g.step1[0],0,100,g.ytip+g.dy,g.ytip);
    dy = g.ytip + g.dy - y;
    x = map(g.step1[1],0,100,g.xtip-g.dx,g.xtip+g.dx);
    dx = dy/Math.tan(radians(g.angle));

    push(); 
    strokeWeight(3); stroke(g.color3);
    if(g.solutionTruth || g.problemPart > 2){
        line(g.xtip-g.dx,g.ytip+g.dy,x+dx,y);
    }
    pop();
}

function partThreeInput(){
    push();
    strokeWeight(2.5); stroke(g.color3); drawingContext.setLineDash([2,7]);
    line(g.points[0].x,g.points[0].y,g.points[1].x,g.points[1].y);
    noStroke(); fill(g.color3);
    for(let p of g.points){
        ellipse(p.x,p.y,2*g.radius);
        push();
        fill(255);
        ellipse(p.x,p.y,g.radius);
        pop();
    }
    pop();
}

function partFourAnswer(){
    // Solve for value of solvent in the mixing point
    // Where that value intersects feed to solvent line is the mixing point
    let x, y;
    let xtemp, ytemp;
    let m1, b1, m2, b2;
    let xM; // Value of solvent in the mixing point

    xM = g.step4[2]/(g.step4[0] + Number(g.step4[2]));
    ytemp = map(xM,0,1,g.ytip,g.ytip+g.dy); // Pixel y-coordinate of solvent value 
    xtemp = (ytemp - g.L[1])/g.L[0]; // Pixel x-coordinate of solvent value along the left edge of triangle
    
   

    m1 = g.R[0]; // Slope of line out of solvent position
    b1 = ytemp - m1*xtemp; // b balue of line out of solvent position

    let x1, y1, x2, y2; // For use in finding slope and b-value of Feed -> solvent line
    x1 = g.xtip-g.dx; y1 = g.ytip+g.dy;
    // Can now rewrite xtemp and ytemp
    y2 = map(g.step1[0],0,100,g.ytip+g.dy,g.ytip);
    ytemp = g.ytip + g.dy - y2;
    x2 = map(g.step1[1],0,100,g.xtip-g.dx,g.xtip+g.dx);
    xtemp = ytemp/Math.tan(radians(g.angle));
    x2 = x2 + xtemp;
    m2 = (y2 - y1)/(x2 - x1);
    b2 = y2 - m2*x2;

    x = (b2 - b1)/(m1 - m2);
    y = m2*x + b2;

    push(); noStroke(); fill(g.color4);
    if(g.solutionTruth || g.problemPart > 3){
        ellipse(x,y,14);
    }
    if(g.problemPart > 3){
        fill(255);
        rect(x-11,y-30,21,20);
        fill(g.color4);
        textSize(20);
        text('M',x-8,y-13);
    }
    pop();
    return([x,y]);
}

function partFourInput(){
    let temp = g.points[0];
    push();
    noStroke(); fill(g.color4);
    ellipse(temp.x,temp.y,2*g.radius);
    fill(255);
    ellipse(temp.x,temp.y,g.radius);
    rect(temp.x-29,temp.y-30,59,18);
    fill(g.color4); textSize(20);
    text('mixing',temp.x-29,temp.y-15);
    pop();
}

function partFiveAnswer(xM,yM){
   
    let dx, dy;

    let solute = Math.round(map(yM,g.ytip+g.dy,g.ytip,0,100)); // Solute mass fraction

    // Solving for carrier mass fraction
    dy = g.ytip + g.dy - yM;
    dx = dy*Math.tan(radians(g.angle/2));
    let xC = xM - dx;
    let carrier = Math.round(map(xC,g.xtip-g.dx,g.xtip+g.dx,0,100)); // Carrier mass fraction

    let solvent = 100 - solute - carrier; // Solvent mass fraction

    if(g.solutionTruth){
        push();
        strokeWeight(1.5);
        rect(80,90,150,80);
        pop();
        push();
        noStroke(); textSize(22);
        text('mass % at mixing point',46,80);
        textSize(20);
        fill(g.blue);
        text('solute = '+solute+'%',100,110);
        fill(g.red);
        text('carrier = '+carrier+'%',99,135);
        fill(g.green);
        text('solvent = '+solvent+'%',95,160);
        pop();
        soluteMass.disabled = true;
        carrierMass.disabled = true;
        solventMass.disabled = true;
        soluteSlider.style.color = "gray";
        carrierSlider.style.color = "gray";
        solventSlider.style.color = "gray";
    }

}

function partSixAnswer(xM,yM){
    let tempTie = g.tiepx[g.phaseNumber]; // Holds the pixels for each tie line point
    // Need to add bottom of the phase curve along carrier axis to tie lines 
    let fit = fits[g.phaseNumber];
    let lim = lims[g.phaseNumber];

    let temp = [];
    for(let i = 0; i < 2; i++){
        let x = lim[i];
        let y = 0;
        let exp = fit.length-1;
        for(let j = 0; j < fit.length; j++){
            y = y + fit[j]*x**exp;
            exp--;
        }
        let xpx = map(x,0,1,g.xtip-g.dx,g.xtip+g.dx);
        let ypx = map(y,0,Math.sqrt(3)/2,g.ytip+g.dy,g.ytip);
        temp.push([xpx,ypx])
    }
    let addedTie = [temp];
    // Final array that holds tie line pixels
    let tie = addedTie.concat(tempTie);
    let slopes = [];
    let bs = [];

    for(let i = 0; i < tie.length; i++){
        let f = tie[i];
        let m = (f[1][1] - f[0][1])/(f[1][0] - f[0][0]);
        let b = f[1][1] - m*f[1][0];
        slopes.push(m);
        bs.push(b);
    }


    let yVals = new Array(6);
    for(let i = 0; i < slopes.length; i++){
        yVals[i] = slopes[i]*xM + bs[i];
    }

    let region = 0;
    let dY, dC, mx, xL, xR, yL, yR, bx;
    for(let i = 0; i < slopes.length-1; i++){
        // To solve for the tie line at a given point, lever rule is applied vertically between current position of M and the lines above and below it
        if(yM <= yVals[i] && yM > yVals[i+1]){
            region = i + 1;
            dY = yVals[i] - yVals[i+1]; // Total distance between lines
            dC = yVals[i] - yM; // Distance from lower line to current position of mixing point

            mx = slopes[i]*(1-dC/dY) + slopes[i+1]*(dC/dY); // slope of line through point
            bx = yM - mx*xM; // y-intercept

            // Calculating left and right x-positions to represent tie-line at given point
            xL = tie[i][0][0]*(1-dC/dY) + tie[i+1][0][0]*(dC/dY);
            xR = tie[i][1][0]*(1-dC/dY) + tie[i+1][1][0]*(dC/dY);
            yL = mx*xL + bx;
            yR = mx*xR + bx;
        } else if (yM < yVals[slopes.length-1]){
            region = slopes.length;
            ratio = yVals[slopes.length-1]/yM;
            mx = slopes[slopes.length-1]*ratio;
            bx = yM - mx*xM;
            xL = tie[tie.length-1][0][0]*ratio;
            xR = tie[tie.length-1][1][0]/ratio;
            yL = mx*xL + bx;
            yR = mx*xR + bx;
        }
    }
    
    if(g.solutionTruth){
        push();
        drawingContext.setLineDash([3,8]); strokeWeight(2.5); stroke(g.color1);
        line(xL,yL,xR,yR);
        pop();
        push();
        noStroke(); fill(g.color6E);
        ellipse(xL,yL,14);
        fill(g.color6R);
        ellipse(xR,yR,14);
        pop();
        push();
        noStroke(); fill(255);
        rect(xL-10,yL-30,20,20);
        rect(xR-10,yR-30,20,20);
        textSize(20);
        fill(g.color6E);
        text('E',xL-7,yL-13);
        fill(g.color6R);
        text('R',xR-7,yR-13);
        fill(g.color4);
        ellipse(xM,yM,14);
        pop();
        g.question = 'Finished, start a new problem'
    }
}

function partSixInput(){
    push();
    strokeWeight(2.5); drawingContext.setLineDash([2,7]);
    line(g.points[0].x,g.points[0].y,g.points[1].x,g.points[1].y);
    // First need to compare x positions to make sure extract stays on the left side
    let comparison = [g.points[0].x,g.points[1].x];
    let index, index2;
    if(comparison[0] < comparison[1]){
        index = 0;
        index2 = 1 - index;
    } else {
        index = 1;
        index2 = 1 - index;
    }
    noStroke();
    for(let i = 0; i < g.points.length; i++){
        if(i == index2){
            fill(g.color6R);
        } else {
            fill(g.color6E);
        }
        ellipse(g.points[i].x,g.points[i].y,2*g.radius);
        push();
        fill(255);
        ellipse(g.points[i].x,g.points[i].y,g.radius);
        pop();
    }
    pop();
    
    let left = g.points[index]; let right = g.points[index2];
    if(!g.solutionTruth){
        push();
        noStroke(); textSize(20);
        fill(255);
        rect(left.x-33,left.y-30,63,18);
        rect(right.x-36,right.y-30,72,18);
        fill(g.color6E);
        text('extract',left.x-31,left.y-15);
        fill(g.color6R);
        text('raffinate',right.x-35,right.y-15);
        pop();
    }
}

// Changes the label in html side and adds text to the drawing
function questionTextLabel(){
    push();
    textSize(20); noStroke();
    if(g.problemPart == 0){
        questionText.style = "margin-top: 5px"
        questionText.innerHTML = "(1) Feed composition";
        g.question = 'Step 1: move the point to the correct feed composition';
    } else if (g.problemPart == 1){
        questionText.style = "margin-top: 5px"
        questionText.innerHTML = "(2) Solvent composition";
        g.question = 'Step 2: move the point to the correct solvent composition';
    } else if (g.problemPart == 2){
        questionText.style = "margin-top: 5px";
        questionText.innerHTML = "(3) Draw mass balance line";
        g.question = 'Step 3: draw a line connecting feed and solvent compositions';
    } else if (g.problemPart == 3){
        questionText.style = "margin-top: 5px";
        questionText.innerHTML = "(4) Mixing point composition";
        g.question = 'Step 4: move the point to the correct mixing point location';
    } else if (g.problemPart == 4){
        questionText.style = "margin-top: 5px";
        questionText.innerHTML = "(5) Mixing point composition";
        g.question = 'Step 5: use sliders to indicate the correct mass percentages of the mixing point';
    } else if (g.problemPart == 5){
        questionText.style = "margin-top: 5px";
        questionText.innerHTML = "(6) Outlet streams";
        g.question = 'Step 6: determine outlet compositions';
    }
    pop();
}

function assignPhase(){
    g.phaseNumber = Math.round(Math.random()*4);
}

function assignAnswers(){
    // Part 1
    g.step1[0] = 25 + Math.round(Math.random()*30);
    g.step1[1] = 100 - g.step1[0];
    g.step1[2] = 0;
    // Part 2
    g.step2[0] = 0;
    g.step2[1] = 0;
    g.step2[2] = 100;

    // Part 4
    g.step4[0] = 50;
    if(g.phaseNumber == 1){
        g.step4[1] = ((5 + Math.round(Math.random()*31))/10).toFixed(1);
    } else if (g.phaseNumber == 2){
        g.step4[1] = ((5 + Math.round(Math.random()*20))/10).toFixed(1);
    } else {
        g.step4[1] = ((5 + Math.round(Math.random()*40))/10).toFixed(1);
    }
    g.step4[2] = (g.step4[0]/g.step4[1]).toFixed(1);
}

function startingPoints(){
    if(g.problemPart == 0){
        soluteMass.disabled = false;
        carrierMass.disabled = false;
        solventMass.disabled = false;
        soluteSlider.style.color = "black";
        carrierSlider.style.color = "black";
        solventSlider.style.color = "black";
        g.nP = 1;
        g.points[0].x = g.xtip;
        g.points[0].y = g.ytip + 94;
    } else if(g.problemPart == 1){
        g.points[0].x = g.xtip;
        g.points[0].y = g.ytip + 94;
    } else if (g.problemPart == 2){
        g.nP = 2;
        g.points = [];
        for(let i = 0; i < g.nP; i++){
            g.points.push(createVector(g.xtip+30-60*i,g.ytip+94));
        }
    } else if (g.problemPart == 3){
        g.nP = 1;
        g.points = [];
        g.points.push(createVector(g.xtip,g.ytip+94));
    } else if (g.problemPart == 5){
        g.nP = 2;
        g.points = [];
        for(let i = 0; i < g.nP; i++){
            g.points.push(createVector(g.xtip+50-100*i,g.ytip+150));
        }
    }
}