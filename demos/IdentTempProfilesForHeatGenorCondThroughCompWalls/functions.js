
// Draws general shape of and some layers
function frameDraw(){
    // Right side image
    push();
    fill(0);
    for(let i = 0; i <= 2; i++){ // Arrows that indicate air flow
        rect(640+50*i, 230, 1, 200);
        triangle(630+50*i,230,650+50*i,230,640+50*i,200);
    }
    textSize(25); noStroke();
    text("T  = 20\xB0C", 630, 130);
    text("h = 10 W/[m  K]", 595, 180);
    textSize(20);
    text("2",730,168); // superscript in W/[m^2K]
    text("∞",640,135);
    pop();

    // Wall segments
    push();
    strokeWeight(2);
    rect(70,100,500,450);
    for(let i = 0; i < 3; i++){
        if(i == 0){
            if(g.heatWall == 'A'){
                fill(0,181,226,g.alfa);
                rect(70+170*i,100,160,450);
            } else {
                fill(0,181,226);
                rect(70+170*i,100,160,450);
            }
        } else if (i == 1){
            if(g.heatWall == 'B'){
                fill(68,214,44,g.alfa);
                rect(70+170*i,100,160,450);
            } else {
                fill(68,214,44);
                rect(70+170*i,100,160,450);
            }
        } else {
            fill(255,233,0);
            rect(70+170*i,100,160,450);
        } 
    }
    pop();

    // Lines that approximate resistance between walls
    push();
    if(g.Rtc != 0){
        for(let i = 0; i < 2; i++){

            let j = 0;
            let shift = 1/g.Rtc/2;
            while(110+j*shift <= 600){
                line(230+170*i,100+j*shift,240+170*i,110+j*shift);
                line(240+170*i,100+j*shift,230+170*i,110+j*shift);    
                j++;
            }
        }
    }
    fill(250); noStroke();
    rect(228,551,200,150);
    pop();

    // Insulation lines
    push(); strokeWeight(2);
    for(let i = 0; i < 24; i++){
        line(30,140+(350/20)*i,70,120+(350/20)*i);
    }
    pop();

    // Insulation labels
    push(); textSize(25);
    translate(60,height/2+90);
    rotate(radians(-90));
    noStroke(); fill(255);
    rect(-3,-20,110,22);
    fill(0);
    text('insulation',0,0);
    pop();

    // Temperature & distance axes plus label
    push(); strokeWeight(2);
    line(110,500,170,500);
    line(110,500,110,440);
    arrow([110,500],[180,500],0,15,5);
    arrow([110,500],[110,430],0,15,5);
    noStroke();
    textSize(20);
    text('distance',130,485);
    translate(95,510);
    rotate(radians(-90));
    text('temperature',0,0);
    pop();

    // Thermal conductivity labels
    push();
    textSize(19);
    text('k  = '+g.kvalues[0]+' W/[m K]',76,537);
    text('k  = '+g.kvalues[1]+' W/[m K]',246,537);
    text('k  = '+g.kvalues[2]+' W/[m K]',416,537);
    textSize(15);
    text('A',85,543);
    text('B',255,543);
    text('C',425,543);
    pop();
}

// This is used to modify the alpha value to highlight the wall segment that is generating heat
function alphaManipulation(){
    if(g.alfa < 255 && g.upORdown){
        g.alfa += 1.2;
        if(g.alfa >= 255){
            g.upORdown = false;
        }
    } else if (!g.upORdown){
        g.alfa -= 1.2;
        if(g.alfa <= 25){
            g.upORdown = true;
        }
    }
}

// *Randomly* assigns wall for either A or B
function assignWall(){
    let wall = Math.round(Math.random());
    if(wall == 0){
        g.heatWall = 'A';
    } else {
        g.heatWall = 'B';
    }
}

function assignThermalProps(){
    let temp;

    // Wall A
    temp = 15 + Math.round(Math.random()*5); // Between .20 and .25
    g.kvalues[0] = (temp/100).toFixed(2);

    // Wall B
    temp = 14 + Math.round(Math.random()*2); // Between .12 and .14
    g.kvalues[1] = (temp/100).toFixed(2);

    // Wall C
    temp = 14 + Math.round(Math.random()*5); // Between .14 and .19
    g.kvalues[2] = (temp/100).toFixed(2);

    // Thermal resistance
    g.Rtc = Math.round(Math.random()*6)/100;
    while(g.Rtc == 0.01){
        g.Rtc = Math.round(Math.random()*6)/100;
    }

    // Thermal generation
    g.Q = 3 + Math.round(Math.random()*4);

}

function question(){
    push();
    textSize(22);
    if(g.problemPart == 0){
        text('Select the button that shows the correct temperature profile for wall A.',70,40);
    } else if (g.problemPart == 1 && !nextPart.disabled){
        text('Select the button that shows the correct temperature profile for wall B.',70,40);
    } else if (nextPart.disabled){
        text('Select the button that shows the correct temperature profile for wall C.',70,40);
    }

    text('Heat generation in wall '+g.heatWall+' = '+g.Q+' kW/m.',70,65);
    if(g.Rtc == 0){
        text('Contact resistance between walls: '+g.Rtc+' [m  K]/W',70,90);
        push(); textSize(17);
        text('2',453,83);
        pop();
    } else {
        text('Contact resistance between walls: '+g.Rtc+' [m  K]/W',70,90);
        textSize(17);
        text('2',483,83);
    }
    pop();
}

// Used to assign the answer orders
function assignAnswers(){
    let answerVec = [];
    let options = ['A','B','C','D','E'];
    let iter = options.length;

    for(let i = 0; i < iter; i++){
        let temp = Math.round(Math.random()*(options.length-1));
        answerVec.push(options[temp]);
        options.splice(temp,1);
    }
    
    return(answerVec);
}

// For drawing arrows
function arrow(base,tip,color,arrowLength,arrowWidth){ 
    let dx, dy, mag;
    let u_hat, u_perp;
    let point = new Array(2); // Point along unit vector that is base of triangle
    let vert = new Array(6); // Holds vertices of arrow

    // Need to define a unit vector
    dx = tip[0] - base[0];
    dy = tip[1] - base[1];
    mag = (dx**2 + dy**2)**(1/2);
    u_hat = [dx/mag,dy/mag];

    vert[0] = tip[0] - 2*u_hat[0]; // Shifts the arrow back some to keep the tip from going out too far
    vert[1] = tip[1] - 2*u_hat[1];

    // Perpendicular unit vector
    u_perp = [-u_hat[1],u_hat[0]];

    // Base of arrow
    point[0] = vert[0]+ -arrowLength*u_hat[0];
    point[1] = vert[1]+ -arrowLength*u_hat[1];
    
    vert[2] = point[0] + u_perp[0]*arrowWidth;
    vert[3] = point[1] + u_perp[1]*arrowWidth;

    vert[4] = point[0] + -u_perp[0]*arrowWidth;
    vert[5] = point[1] + -u_perp[1]*arrowWidth;

    push();
    stroke(color); fill(color);
    triangle(vert[0],vert[1],vert[2],vert[3],vert[4],vert[5]);
    pop();

}

// Generates and displays the various solutions for when wall A is generating heat
function solveProblemA(){
    let right = correctAsolution();
    let incorrect = incorrectAsolution(right);
    count = incorrect[incorrect.length-1];
    wrong = incorrect;

    let availableAnswers = g.answers;
    rightAnswer = availableAnswers[count[0]];
    let counter = 0;

    let incorrectPartB = incorrectApartBSolution(right);
    let incorrectPartC = incorrectApartCSolution(right);
    
    // Display answers
    if(g.problemPart == 0 && !g.solutionTruth){
        displayAnswersA();
    } else if (g.problemPart == 1 && !nextPart.disabled && !g.solutionTruth){
        displayAnswersApartB();
    } else if(nextPart.disabled && !g.solutionTruth) {
        displayAnswersApartC();
    }

    function displayAnswersA(){
        let x, y;
        let m, b;
        push();
        drawingContext.setLineDash([5,5]); noFill();
        strokeWeight(2); stroke(120,0,120);

        for(let i = 0; i < wrong.length-1; i++){
            if(i == 0){
                line(wrong[i][0],wrong[i][1],wrong[i][2],wrong[i][3]);
                if(i < wrong.length-1){
                    if(counter == count[0]){
                        counter++;
                    }
                    m = (wrong[i][3] - wrong[i][1])/(wrong[i][2] - wrong[i][0]);
                    b = wrong[i][1] - m*wrong[i][0];
                    push();
                    noStroke(); fill(255);
                    x = wrong[i][0]+30;
                    y = m*x + b;
                    rect(x-1,y-7,12,13);
                    fill(0), textSize(15);
                    text(availableAnswers[counter],x,y+5);
                    pop();
                    counter++;
                }
                
            } else if (i == 1){
                line(wrong[i][0],wrong[i][1],wrong[i][2],wrong[i][3]);
                if(i < wrong.length-1){
                    if(counter == count[0]){
                        counter++;
                    }
                    m = (wrong[i][3] - wrong[i][1])/(wrong[i][2] - wrong[i][0]);
                    b = wrong[i][1] - m*wrong[i][0];
                    push();
                    noStroke(); fill(255);
                    x = wrong[i][0]+50;
                    y = m*x + b;
                    rect(x-1,y-7,12,13);
                    fill(0), textSize(15);
                    text(availableAnswers[counter],x,y+5);
                    pop();
                    counter++;
                }
            } else if (i == 2){
                let t = wrong[i];
                bezier(t[0],t[1],t[2],t[3],t[4],t[5],t[6],t[7]);
                if(i < wrong.length-1){
                    if(counter == count[0]){
                        counter++;
                    }
                    m = (t[3] - t[1])/(t[2] - t[1]);
                    b = t[3] - m*t[2];
                    push();
                    noStroke(); fill(255);
                    x = t[2]+50;
                    y = m*x + b-13;
                    rect(x-1,y-7,12,13);
                    fill(0), textSize(15);
                    text(availableAnswers[counter],x,y+5);
                    pop();
                    counter++;
                }
            } else if (i == 3){
                let t = wrong[i];
                if(t.length == 4){
                    line(t[0],t[1],t[2],t[3]);
                    if(i < wrong.length-1){
                        if(counter == count[0]){
                            counter++;
                        }
                       
                        push();
                        noStroke(); fill(255);
                        x = 115;
                        y = t[1];
                        rect(x-1,y-7,12,13);
                        fill(0), textSize(15);
                        text(availableAnswers[counter],x,y+5);
                        pop();
                        counter++;
                    }
                } else {
                    bezier(t[0],t[1],t[2],t[3],t[4],t[5],t[6],t[7]);
                    if(i < wrong.length-1){
                        if(counter == count[0]){
                            counter++;
                        }
                        m = (t[7] - t[5])/(t[6] - t[4]);
                        b = t[3] - m*t[2];
                        push();
                        noStroke(); fill(255);
                        x = t[2]+30;
                        y = m*x + b-5;
                        rect(x-1,y-7,12,13);
                        fill(0), textSize(15);
                        text(availableAnswers[counter],x,y+5);
                        pop();
                        counter++;
                    }
                }
            }
        }

        beginShape();
        for(let i = 0; i < right[5].length; i++){
            vertex(right[5][i][0],right[5][i][1]);
            if(i == 5){
                x = right[5][i][0];
                y = right[5][i][1];
            }
        }
        endShape();
        push();
        noStroke(); fill(255);
        rect(x-1,y-7,12,13)
        fill(0); textSize(15);
        text(rightAnswer,x,y+5);
        g.correctAnswer = rightAnswer;
        pop();
        pop();
    }

    function displayAnswersApartB(){
        let ans = incorrectPartB;
        let m, b, x, y;
    
        push(); 
        drawingContext.setLineDash([5,5]); noFill();
        strokeWeight(2); stroke(120,0,120);
        for(let i = 0; i < ans.length; i++){
            if(i == 0){
                line(ans[i][0],ans[i][1],ans[i][2],ans[i][3]);
                push();
                noStroke(); fill(255);
                x = ans[i][2]-65;
                y = ans[i][3];
                rect(x-1,y-7,12,13);
                fill(0), textSize(15);
                text(g.answers[i],x,y+5);
                pop();
            } else if (i == 1){
                line(ans[i][0],ans[i][1],ans[i][2],ans[i][3]);
                m = (ans[i][3] - ans[i][1])/(ans[i][2] - ans[i][0]);
                b = ans[i][1] - m*ans[i][0];
                push();
                noStroke(); fill(255);
                x = ans[i][2] - 40;
                y = m*x + b;
                rect(x-1,y-7,12,13);
                fill(0); textSize(15);
                text(g.answers[i],x,y+5);
                pop();
            } else if (i == 2){
                if(ans[i].length == 4){
                    line(ans[i][0],ans[i][1],ans[1][2],ans[i][3]);
                    m = (ans[i][3] - ans[i][1])/(ans[i][2] - ans[i][0]);
                    b = ans[i][1] - m*ans[i][0];
                    push();
                    noStroke(); fill(255);
                    x = ans[i][2] - 20;
                    y = m*x + b;
                    rect(x-1,y-7,12,13);
                    fill(0); textSize(15);
                    text(g.answers[i],x,y+5);
                    pop();
                } else {
                    bezier(ans[i][0],ans[i][1],ans[i][2],ans[i][3],ans[i][4],ans[i][5],ans[i][6],ans[i][7]);
                    m = (ans[i][5] - ans[i][3])/(ans[i][4] - ans[i][2]);
                    b = ans[i][7] - m*ans[i][6];
                    push();
                    noStroke(); fill(255);
                    x = ans[i][2];
                    y = m*x + b-31;
                    rect(x-1,y-7,12,13);
                    fill(0); textSize(15);
                    text(g.answers[i],x,y+5);
                    pop();
                }
            } else if (i == 3){
                bezier(ans[i][0],ans[i][1],ans[i][2],ans[i][3],ans[i][4],ans[i][5],ans[i][6],ans[i][7]);
                m = (ans[i][5] - ans[i][3])/(ans[i][4] - ans[i][2]);
                b = ans[i][7] - m*ans[i][6];
                push();
                noStroke(); fill(255);
                x = ans[i][2];
                if(ans[i][7] >= right[2][1]){
                    y = ans[i][3]-22;
                } else {
                    y = ans[i][3]+18;
                }
                
                rect(x-1,y-7,12,13);
                fill(0); textSize(15);
                text(g.answers[i],x,y+5);
                pop();
            }
        }
        line(right[3][0],right[3][1],right[2][0],right[2][1]);
        m = (right[2][1] - right[3][1])/(right[2][0] - right[3][0]);
        b = right[3][1] - m*right[3][0];
        push();
        noStroke(); fill(255);
        x = right[2][0] - 20;
        y = m*x + b+6;
        rect(x-1,y-7,12,13);
        fill(0); textSize(15);
        text(g.answers[g.answers.length-1],x,y+5);
        pop();

        g.correctAnswer = g.answers[g.answers.length-1];

        beginShape();
        drawingContext.setLineDash([0,0]);
        for(let i = 0; i < right[5].length; i++){
            vertex(right[5][i][0],right[5][i][1]);
        }
        endShape();
        fill(120,0,120);
        ellipse(right[5][right[5].length-1][0],right[5][right[5].length-1][1],6);
        ellipse(right[5][0][0],right[5][0][1],6);
        pop();
    }
    
    function displayAnswersApartC(){
        let x, y;
        let m, b;
        push(); 
        drawingContext.setLineDash([5,5]); noFill();
        strokeWeight(2); stroke(120,0,120);

        let ans = incorrectPartC;
        for(let i = 0; i < ans.length; i++){
            if(i == 0){
                line(ans[i][0],ans[i][1],ans[i][2],ans[i][3]);
                push();
                noStroke(); fill(255);
                x = ans[i][2] - 65;
                y = ans[i][3];
                rect(x-1,y-7,12,13);
                fill(0); textSize(15);
                text(g.answers[i],x,y+5);
                pop();
            } else if (i == 1){
                line(ans[i][0],ans[i][1],ans[i][2],ans[i][3]);
                m = (ans[i][3] - ans[i][1])/(ans[i][2] - ans[i][0]);
                b = ans[i][1] - m*ans[i][0];
                push();
                noStroke(); fill(255);
                x = ans[i][2] - 40;
                y = m*x + b;
                rect(x-1,y-7,12,13);
                fill(0); textSize(15);
                text(g.answers[i],x,y+5);
                pop();
            } else if (i == 2){
                line(ans[i][0],ans[i][1],ans[i][2],ans[i][3]);
                m = (ans[i][3] - ans[i][1])/(ans[i][2] - ans[i][0]);
                b = ans[i][1] - m*ans[i][0];
                push();
                noStroke(); fill(255);
                x = ans[i][0] + 40;
                y = m*x + b;
                rect(x-1, y-4,12,13);
                fill(0); textSize(15);
                text(g.answers[i],x,y+8);
                pop();
            } else if (i == 3){
                push();
                noFill();
                bezier(ans[i][0],ans[i][1],ans[i][2],ans[i][3],ans[i][4],ans[i][5],ans[i][6],ans[i][7]);
                m = (ans[i][3] - ans[i][1])/(ans[i][2] - ans[i][0]);
                b = ans[i][3] - m*ans[i][2];
                noStroke(); fill(255);
                x = ans[i][2]+2; y = ans[i][3]-3;
                rect(x-1,y-4,12,13);
                fill(0); textSize(15);
                text(g.answers[i],x,y+8);
                pop();
            }
        }

        line(right[0][0],right[0][1],right[1][0],right[1][1]);
        m = (right[1][1] - right[0][1])/(right[1][0] - right[0][0]);
        b = right[1][1] - m*right[1][0];
        push();
        noStroke(); fill(255);
        x = right[0][0] - 40;
        y = m*x + b;
        rect(x-1,y-7,12,13);
        fill(0); textSize(15);
        text(g.answers[g.answers.length-1],x,y+5);
        g.correctAnswer = g.answers[g.answers.length-1];
        pop();
        
        // Profile so far
        beginShape();
        drawingContext.setLineDash([0,0]);
        for(let i = 0; i < right[5].length; i++){
            vertex(right[5][i][0],right[5][i][1]);
        }
        endShape();
        line(right[5][right[5].length-1][0],right[5][right[5].length-1][1],right[3][0],right[3][1]);
        line(right[3][0],right[3][1],right[2][0],right[2][1]);
        fill(120,0,120);
        ellipse(right[5][right[5].length-1][0],right[5][right[5].length-1][1],6);
        ellipse(right[5][0][0],right[5][0][1],6);
        ellipse(right[3][0],right[3][1],6);
        ellipse(right[2][0],right[2][1],6);
        
        

        pop();
    }

    if(g.solutionTruth){
        checkAnswerQuestionA(right);
    }
    
    
}

// Generates the correct solution when wall A is generating heat
function correctAsolution(){
    // Heat flux
    let HF = g.length*g.Q*1000; // Heatflux
    let tempVec = new Array(5); // Vec to hold temperatures
    
    tempVec[0] = HF/g.h + g.Tinf; // Ts1
    tempVec[1] = HF*g.length/g.kvalues[2] + tempVec[0]; // Ts2
    tempVec[2] = HF*g.Rtc + tempVec[1]; // Ts3
    tempVec[3] = HF*g.length/g.kvalues[1] + tempVec[2]; // Ts4
    tempVec[4] = HF*g.Rtc + tempVec[3]; // Ts5

    let c2 = tempVec[4] + g.Q*g.length**2*1000/(2*g.kvalues[0]);
    let answer = []; // Holds final solution in pixel form
   
    let Acurve = [];
    // Solves for the curve in wall A
    for(let i = 0; i < 10; i++){
        let x = 0.02*i;
        let y = -10*g.Q*x**2/(2*g.kvalues[0]) + c2; // Hand-solved the differential equation (the 10x is a unit correction)
        Acurve.push([x,y]);
    }
    Acurve.push([.2,tempVec[4]]);
    Acurvepx = [];
    
    let upperLim = 80; let lowerLim = 25;
    let upperPx = 170; let lowerPx = 375;

    // Converts the temperature values and x-locations into pixel coords
    for(let i = 0; i < tempVec.length; i++){
        let y = map(tempVec[i],lowerLim,upperLim,lowerPx,upperPx);
        answer.push([g.wallX[i],y]);
    }

    beginShape();
    for(let i = 0; i < Acurve.length; i++){
        let x = map(Acurve[i][0],0,.2,g.wallX[5],g.wallX[4]);
        let y = map(Acurve[i][1],lowerLim,upperLim,lowerPx,upperPx);
        Acurvepx.push([x,y]);
        //vertex(x,y);
    }
    endShape();
   
    // Returning correct coords
    answer.push(Acurvepx);
    return(answer);
}

// Generates incorrect solutions for wall A profile when wall A is generating heat
function incorrectAsolution(correct){

    // First check height between top of wall and top of correct A solution
    let difference = correct[5][0][1] - 100;

    // Determines the number of answer choices above and below the correct solution
    let aboveBelow = new Array(2);
    if(difference <= 60 && difference >= 30){
        aboveBelow[0] = 1;
    } else if (difference > 120){
        aboveBelow[0] = 2;
    } else if (difference < 30){
        aboveBelow[0] = 0;
    } else {
        aboveBelow[0] = 2;
    }
    aboveBelow[1] = 4 - aboveBelow[0];

    //let shift = 15; // Number of pixels between answer choices

    let incorrectPartA = [];


    incorrectPartA.push(upwardSlantPart1());
    incorrectPartA.push(downwardSlantPart1());
    incorrectPartA.push(upwardSlopePart1());
    incorrectPartA.push(curveyAnswerPart1());

    function upwardSlantPart1(){
        let temp = correct[5][10];
        let slope = g.qAprops[0];
        let x1, y1, b;
        b = temp[1]+g.qAprops[1] - slope*temp[0];
        x1 = 70;
        y1 = slope*x1 + b;
        //line(x1,y1,temp[0],temp[1]+g.qAprops[1]);
        return([x1,y1,temp[0],temp[1]+g.qAprops[1]]);
    }

    function downwardSlantPart1(){
        let x1, y1, x2, y2;
        let slope = -1.3*g.qAprops[0];

        if(aboveBelow[0] == 1 || aboveBelow[0] == 0){
            let temp = incorrectPartA[0];
            x1 = 70; 
            y1 = temp[1]+1.1*g.qAprops[1];
            x2 = g.wallX[4];
            y2 = y1 + (x2-x1)*slope;
            //line(x1,y1,x2,y2);return([x1,y1,x2,y2]);
            return([x1,y1,x2,y2])
        } else {
            let temp = correct[5][10];
            let b = temp[1]-g.qAprops[2] - slope*temp[0];
            x1 = 70;
            y1 = slope*x1 + b;
            //line(x1,y1,temp[0],temp[1]-g.qAprops[2]);
            return([x1,y1,temp[0],temp[1]-g.qAprops[2]]);
        }
    }
    
    function upwardSlopePart1(){
        let x1, y1, x2, y2, x3, y3, x4, y4;

        if(aboveBelow[0] == 1 || aboveBelow[0] == 0){
            let temp = incorrectPartA[1];
            
            x4 = temp[2];
            y4 = temp[3]+20;

            x3 = temp[0] + 100;
            y3 = temp[3] + 50;

            x2 = temp[0] + 40;
            y2 = temp[3] + 60;

            x1 = temp[0];
            y1 = temp[3] + 60;

            //bezier(x1,y1,x2,y2,x3,y3,x4,y4);
            return([x1,y1,x2,y2,x3,y3,x4,y4]);
        } else {
            let temp = incorrectPartA[0];
            x4 = temp[2];
            y4 = temp[3] + 20;

            x3 = temp[0] + 100;
            y3 = temp[3] + 50;

            x2 = temp[0] + 40;
            y2 = temp[3] + 60;

            x1 = temp[0];
            y1 = temp[3] + 60;
            //bezier(x1,y1,x2,y2,x3,y3,x4,y4);
            return([x1,y1,x2,y2,x3,y3,x4,y4]);
        }
    }

    function curveyAnswerPart1(){
        let temp;
        let x1, y1, x2, y2, x3, y3, x4, y4;
    
        if(aboveBelow[0] == 0){ // Flat line
            x1 = g.wallX[5];
            x2 = g.wallX[4];
            y1 = incorrectPartA[1][3] + .5*(incorrectPartA[2][7]-incorrectPartA[1][3])
            y2 = y1;
            //line(x1,y1,x2,y2);
            return([x1,y1,x2,y2]);
        } else if (aboveBelow[0] == 1){ // Flat line
            x1 = g.wallX[5];
            x2 = g.wallX[4];
            y1 = 100 + .5*difference;
            y2 = y1;
            //line(x1,y1,x2,y2);
            return([x1,y1,x2,y2]);
            
        } else { // Bezier
            temp = incorrectPartA[1];
            x1 = temp[0];
            y1 = temp[1];
            
            x2 = x1 + 20;
            y2 = y1 - 30;
            
            x3 = x2 + 30;
            y3 = y2;

            x4 = temp[2];
            y4 = temp[3];
            
            //bezier(x1,y1,x2,y2,x3,y3,x4,y4);
            return([x1,y1,x2,y2,x3,y3,x4,y4]);
        }
    }
    incorrectPartA.push(aboveBelow)

    return(incorrectPartA)
}

// Generates incorrect solutions for wall B profile when wall A is generating heat
function incorrectApartBSolution(correct){
    //let rightAnswer = Math.round(Math.random()*4);
    let incorrect = [];
    let x1, y1, x2, y2;
    let diff = correct[4][1] - correct[3][1];

    // Flat line with contact resistance accounted for
    x1 = correct[3][0]; y1 = correct[4][1] + 1.4*g.qAprops[3]*diff;
    x2 = g.wallX[2]; y2 = y1;
    incorrect.push([x1,y1,x2,y2]);
    
    // if contact resistance != 0, same line but at no height change
    let m = (correct[3][1] - correct[2][1])/(correct[3][0] - correct[2][0]);
    if(g.Rtc != 0){
        
        x1 = correct[3][0]; y1 = correct[4][1];
        x2 = g.wallX[2];
        y2 = y1 + m*(g.wallX[2]-correct[3][0]);
        //line(x1,y1,x2,y2);
        incorrect.push([x1,y1,x2,y2]);
    }
    
    // upward sloped line with negative contact resistance accounted for
    m = -.5*m;
    x1 = correct[3][0]; y1 = correct[3][1] + 2*diff;
    x2 = g.wallX[2]; y2 = y1 + m*(g.wallX[2]-correct[3][0]);
    if (y1 < 100){
        y1 = 100;
    } else if (y1 < 120){
        y1 = 120;
    }
    
    if(y2 < 100 && y1 != 100){
        y2 = 100;
    } else if (y2 < 100 && y1 == 100){
        y2 = 130;
    }
    incorrect.push([x1,y1,x2,y2]);

    // curved
    let x3, y3, x4, y4;
    x4 = g.wallX[2];
    y4 = correct[2][1]+22;

    y3 = correct[2][1] + 25;
    x3 = g.wallX[2] - 40;

    y2 = y3 + 15;
    x2 = x3 - 50;

    x1 = correct[3][0];
    y1 = correct[3][1] + 15;
    incorrect.push([x1,y1,x2,y2,x3,y3,x4,y4]);
 

    if(incorrect.length == 3){
        x4 = g.wallX[2];
        y4 = incorrect[1][3] - 1.2*g.qAprops[1];

        x3 = g.wallX[2] - 50;
        y3 = y4 - 10;

        x2 = x3 - 20;
        y2 = y3 - 25;

        x1 = correct[3][0];
        y1 = incorrect[1][1] - 2 - g.qAprops[1];
        incorrect.push([x1,y1,x2,y2,x3,y3,x4,y4]);
    }

    return(incorrect);
}

// Generates incorrect solutions for wall C profile when wall A is generating heat
function incorrectApartCSolution(correct){
    let incorrect = [];
    let x1, y1, x2, y2;
    let m;
    let diff = correct[2][1] - correct[1][1];

    // Flat line with contact resistance maybe accounted for
    x1 = correct[1][0]; y1 = correct[2][1] + 1.2*g.qAprops[3]*diff;
    x2 = g.wallX[0]; y2 = y1;
    incorrect.push([x1,y1,x2,y2]);

    // Upward sloped line
    m = (correct[0][1] - correct[1][1])/(correct[0][0] - correct[0][1]);
    m = -(g.qAprops[1]/10 + 1)*m;
    x1 = correct[1][0]; y1 = correct[1][1] - g.qAprops[2];
    x2 = correct[0][0]; y2 = m*(x2-x1) + y1;
    incorrect.push([x1,y1,x2,y2]);

    // More aggressive downward slope
    m = (correct[0][1] - correct[1][1])/(correct[0][0] - correct[0][1]);
    m = 4*m;
    x1 = correct[1][0]; y1 = correct[1][1]+12;
    x2 = correct[0][0]; y2 = m*(x2-x1) + y1;
    incorrect.push([x1,y1,x2,y2]);

    let x3, y3, x4, y4;
    if(g.Rtc < .03){
        x1 = correct[1][0]; y1 = correct[1][1]-2*g.qAprops[2]
        x2 = x1 + 20; y2 = y1 - 30;
        x3 = x2 + 25; y3 = y2 - 15;
        x4 = correct[0][0]; y4 = incorrect[1][3];
        //bezier(x1,y1,x2,y2,x3,y3,x4,y4);
        incorrect.push([x1,y1,x2,y2,x3,y3,x4,y4]);
    } else {
        x1 = correct[1][0]; y1 = correct[1][1]+12;
        x2 = x1 + 20; y2 = y1 + 70;
        x3 = x2 + 25; y3 = y2 + 45;
        x4 = correct[0][0]; y4 = incorrect[2][3]+1.4*g.qAprops[2];
        //bezier(x1,y1,x2,y2,x3,y3,x4,y4);
        incorrect.push([x1,y1,x2,y2,x3,y3,x4,y4]);
    }
    return(incorrect);

}

function checkAnswerQuestionA(ans){
    let x,y;
    let m,b;
    if(g.problemPart == 0){
        if(g.chosenAnswer == null){
            g.bottomText = "Select an answer choice first.";
            g.solutionTruth = false;
        } else if (g.chosenAnswer == g.correctAnswer){
            g.bottomText = "Correct, move on to the next part."
            push(); noFill(); strokeWeight(2); stroke(120,0,120);
            beginShape();
            for(let i = 0; i < ans[5].length; i++){
                vertex(ans[5][i][0],ans[5][i][1]);
                if(i == 5){
                    x = ans[5][i][0];
                    y = ans[5][i][1];
                }
            }
            endShape();
            push();
            noStroke(); fill(255);
            rect(x-1,y-7,12,13);
            fill(0); textSize(15);
            text(g.correctAnswer,x,y+5);
            pop();
            pop();

            push();
            strokeWeight(2); stroke(120,0,120); fill(120,0,120);
            ellipse(ans[5][ans[5].length-1][0],ans[5][ans[5].length-1][1],6);
            ellipse(ans[5][0][0],ans[5][0][1],6);
            pop();
        } else if (g.chosenAnswer != g.correctAnswer){
            g.bottomText = "Incorrect, try again.";
            g.solutionTruth = false;
        }

    } else if (g.problemPart == 1 && !nextPart.disabled){
        if(g.chosenAnswer == null){
            g.bottomText = "Select an answer choice first.";
            g.solutionTruth = false;
        } else if (g.chosenAnswer == g.correctAnswer){
            g.bottomText = "Correct, move on to the next part."
            // Segment for wall A
            push(); noFill(); strokeWeight(2); stroke(120,0,120);
            beginShape();
            for(let i = 0; i < ans[5].length; i++){
                vertex(ans[5][i][0],ans[5][i][1]);
                if(i == 5){
                    x = ans[5][i][0];
                    y = ans[5][i][1];
                }
            }
            endShape();
            fill(120,0,120);
            ellipse(ans[5][ans[5].length-1][0],ans[5][ans[5].length-1][1],6);
            ellipse(ans[5][0][0],ans[5][0][1],6);
            line(ans[5][ans[5].length-1][0],ans[5][ans[5].length-1][1],ans[3][0],ans[3][1]);
            ellipse(ans[3][0],ans[3][1],6);
            ellipse(ans[2][0],ans[2][1],6);
            line(ans[3][0],ans[3][1],ans[2][0],ans[2][1]);
            pop();

        
            m = (ans[2][1] - ans[3][1])/(ans[2][0] - ans[3][0]);
            b = ans[3][1] - m*ans[3][0];
            push(); noStroke();
            x = ans[2][0] - 20;
            y = m*x + b+6;
            rect(x-1,y-9,12,13);
            fill(0); textSize(15);
            text(g.correctAnswer,x,y+3);
            pop();
        } else if (g.chosenAnswer != g.correctAnswer){
            g.bottomText = "Incorrect, try again.";
            g.solutionTruth = false;
        }
    } else if (nextPart.disabled){
        if(g.chosenAnswer == null){
            g.bottomText = "Select an answer choice first.";
            g.solutionTruth = false;
        } else if (g.chosenAnswer == g.correctAnswer){
            g.bottomText = "Correct, move on to a new problem."
            push(); noFill(); strokeWeight(2); stroke(120,0,120);
            beginShape();
            for(let i = 0; i < ans[5].length; i++){
                vertex(ans[5][i][0],ans[5][i][1]);
                if(i == 5){
                    x = ans[5][i][0];
                    y = ans[5][i][1];
                }
            }
            endShape();
            fill(120,0,120);
            ellipse(ans[5][ans[5].length-1][0],ans[5][ans[5].length-1][1],6);
            ellipse(ans[5][0][0],ans[5][0][1],6);
            line(ans[5][ans[5].length-1][0],ans[5][ans[5].length-1][1],ans[3][0],ans[3][1]);
            ellipse(ans[3][0],ans[3][1],6);
            ellipse(ans[2][0],ans[2][1],6);
            line(ans[3][0],ans[3][1],ans[2][0],ans[2][1]);
            line(ans[2][0],ans[2][1],ans[1][0],ans[1][1]);
            ellipse(ans[1][0],ans[1][1],6);
            line(ans[1][0],ans[1][1],ans[0][0],ans[0][1]);
            ellipse(ans[0][0],ans[0][1],6);

            m = (ans[1][1] - ans[0][1])/(ans[1][0] - ans[0][0]);
            b = ans[1][1] - m*ans[1][0];
            push();
            noStroke(); fill(255);
            x = ans[0][0] - 40; y = m*x + b;
            rect(x-1,y-7,12,13);
            fill(0); textSize(15);
            text(g.correctAnswer,x,y+5);
            pop();
            pop();
        } else if (g.chosenAnswer != g.correctAnswer){
            g.bottomText = "Incorrect, try again.";
            g.solutionTruth = false;
        }
    }
}

// Generates the correct solution when wall B is generating heat
function solveProblemB(){
    ans = correctBsolution();

    let incorrectPartA = incorrectBsolution(ans);
    let incorrectPartB = incorrectBpartBsolution(ans);
    let incorrectPartC = incorrectBpartCsolution(ans);

    if(g.problemPart == 0 && !g.solutionTruth){
        BdisplayAnswersB();
    } else if (g.problemPart == 1 && !nextPart.disabled && !g.solutionTruth){
        BdisplayAnswersBpartB();
    } else if (nextPart.disabled && !g.solutionTruth && !solutionButton.disabled){
        BdisplayAnswersBpartC();
    }

    function BdisplayAnswersB(){
        let x, y;
        let m, b;
        push();
        drawingContext.setLineDash([5,5]); noFill();
        strokeWeight(2); stroke(120,0,120);
        for(let i = 0; i < incorrectPartA.length; i++){
            if(i == 0){
                let temp = incorrectPartA[i];
                beginShape();
                for(let j = 0; j < temp.length; j++){
                    vertex(temp[j][0],temp[j][1]);
                    if(j == 7){
                        x = temp[j][0]; y = temp[j][1];
                    }
                }
                endShape();
                push();
                noStroke(); fill(255);
                rect(x-1,y-7,12,13);
                fill(0); textSize(15);
                text(g.answers[i],x,y+5);
                pop();
            } else if (i == 1){
                let temp = incorrectPartA[i];
                line(temp[0],temp[1],temp[2],temp[3]);
                m = (temp[3] - temp[1])/(temp[2] - temp[0]);
                b = temp[1] - m*temp[0];
                x = g.wallX[4] - 30;
                y = m*x + b;
                push();
                noStroke(); fill(255);
                rect(x-1,y-7,12,13);
                fill(0); textSize(15);
                text(g.answers[i],x,y+5);
                pop();
            } else if (i == 2){
                let temp = incorrectPartA[i];
                if(temp.length == 8){
                    bezier(temp[0],temp[1],temp[2],temp[3],temp[4],temp[5],temp[6],temp[7]);
                    x = temp[2]; y = temp[3]+7;
                    push();
                    noStroke(); fill(255);
                    rect(x-1,y-7,12,13);
                    fill(0); textSize(15);
                    text(g.answers[i],x,y+5);
                pop();
                } else {
                    line(temp[0],temp[1],temp[2],temp[3]);
                    m = (temp[3] - temp[1])/(temp[2] - temp[0]);
                    b = temp[1] - m*temp[0];
                    x = g.wallX[5] + 30;
                    y = m*x + b;
                    push();
                    noStroke(); fill(255);
                    rect(x-1,y-7,12,13);
                    fill(0); textSize(15);
                    text(g.answers[i],x,y+5);
                    pop();
                }
            } else if (i == 3){
                let temp = incorrectPartA[i];
                bezier(temp[0],temp[1],temp[2],temp[3],temp[4],temp[5],temp[6],temp[7]);
                x = temp[2]; y = temp[3]-10;
                push();
                noStroke(); fill(255);
                rect(x-1,y-7,12,13);
                fill(0); textSize(15);
                text(g.answers[i],x,y+5);
                pop();
            }
        }

        line(ans[5][0],ans[5][1],ans[4][0],ans[4][1]);
        push();
        noStroke(); fill(255);
        rect(g.wallX[4]-30,ans[5][1]-7,12,13);
        fill(0); textSize(15);
        text(g.answers[4],g.wallX[4]-29,ans[5][1]+5);
        g.correctAnswer = g.answers[4];
        pop();
        pop();
    }

    function BdisplayAnswersBpartB(){
        let x, y, m, b;
        let temp1 = incorrectPartB;
        push();
        strokeWeight(2); stroke(120,0,120); fill(120,0,120);
        line(ans[5][0],ans[5][1],ans[4][0],ans[4][1]);
        ellipse(ans[5][0],ans[5][1],6);
        ellipse(ans[4][0],ans[4][1],6);
        noFill(); drawingContext.setLineDash([5,5]);

        for(let i = 0; i < temp1.length; i++){
            if(i == 0){
                let t = temp1[i];
                line(t[0],t[1],t[2],t[3]);
                m = (t[3] - t[1])/(t[2] - t[0]);
                b = t[1] - m*t[0];
                x = g.wallX[3] + 30;
                y = m*x + b;
                push();
                noStroke(); fill(255);
                rect(x-1,y-7,12,13);
                fill(0); textSize(15);
                text(g.answers[i],x,y+5);
                pop();
            } else if (i == 1){
                let t = temp1[i];
                line(t[0],t[1],t[2],t[3]);
                x = g.wallX[3] + 15;
                y = t[1];
                push();
                noStroke(); fill(255);
                rect(x-1,y-7,12,13);
                fill(0); textSize(15);
                text(g.answers[i],x,y+5);
                pop();
            } else if (i == 2){
                let t = temp1[i]; 
                beginShape();
                for(let j = 0; j < t.length; j++){
                    vertex(t[j][0],t[j][1]);
                    if(j == t.length-3){
                        x = t[j][0];
                        y = t[j][1];
                    }

                }
                endShape();push();
                noStroke(); fill(255);
                rect(x-1,y-7,12,13);
                fill(0); textSize(15);
                text(g.answers[i],x,y+5);
                pop();
            } else if (i == 3){
                let t = temp1[i];
                if(t.length == 8){
                    bezier(t[0],t[1],t[2],t[3],t[4],t[5],t[6],t[7]);
                    push();
                    noStroke(); fill(255);
                    rect(t[2],t[3],12,13);
                    fill(0); textSize(15);
                    text(g.answers[i],t[2]+1,t[3]+12);
                    pop();
                } else {
                    line(t[0],t[1],t[2],t[3]);
                    m = (t[3] - t[1])/(t[2] - t[0]);
                    b = t[1] - m*t[0];
                    x = g.wallX[3] + 80;
                    y = m*x + b;
                    push();
                    noStroke(); fill(255);
                    rect(x-1,y-7,12,13);
                    fill(0); textSize(15);
                    text(g.answers[i],x,y+5);
                    pop();

                }
            }
        }


        beginShape();
        let temp = ans[3];
        for(let i = 0; i < temp.length; i++){
            vertex(temp[i][0],temp[i][1]);
            if(i == temp.length-3){
                x = temp[i][0];
                y = temp[i][1];
            }
        }
        endShape();
        push();
        noStroke(); fill(255);
        rect(x-1,y-7,12,13);
        fill(0); textSize(15);
        text(g.answers[4],x,y+5);
        pop();
        pop();
        g.correctAnswer = g.answers[4];
    }

    function BdisplayAnswersBpartC(){
        let t = ans[3];
        let m, b;
        push();
        strokeWeight(2); stroke(120,0,120); fill(120,0,120);
        line(ans[5][0],ans[5][1],ans[4][0],ans[4][1]);
        ellipse(ans[5][0],ans[5][1],6);
        ellipse(ans[4][0],ans[4][1],6);
        line(ans[4][0],ans[4][1],t[0][0],t[0][1]);
        ellipse(t[0][0],t[0][1],6);
        ellipse(t[t.length-1][0],t[t.length-1][1],6);
        noFill(); beginShape();
        for(let i = 0; i < t.length; i++){
            vertex(t[i][0],t[i][1]);
            if(i == t.length-3){
                x = t[i][0]; y = t[i][1];
            }
        }
        endShape();
        drawingContext.setLineDash([5,5]);
        let temp = incorrectPartC;

        for(let i = 0; i < temp.length; i++){
            if(i == 0){
                let c = temp[i];
                line(c[0],c[1],c[2],c[3]);
                m = (c[3] - c[1])/(c[2] - c[0]);
                b = c[1] - m*c[0];
                x = g.wallX[0] - 20;
                y = m*x + b;
                push();
                noStroke(); fill(255);
                rect(x-1,y-7,12,13);
                fill(0); textSize(15);
                text(g.answers[i],x,y+5);
                pop();
            } else if (i == 1){
                let c = temp[i];
                bezier(c[0],c[1],c[2],c[3],c[4],c[5],c[6],c[7]);
                x = c[2]; y = c[3];
                push();
                noStroke(); fill(255);
                rect(x,y-15,12,13);
                fill(0); textSize(15);
                text(g.answers[i],x+1,y-3);
                pop();
            } else if (i == 2){
                let c = temp[i];
                line(c[0],c[1],c[2],c[3]);
                m = (c[3] - c[1])/(c[2] - c[0]);
                b = c[1] - m*c[0];
                x = g.wallX[0] - 40;
                y = m*x + b;
                push();
                noStroke(); fill(255);
                rect(x-1,y-7,12,13);
                fill(0); textSize(15);
                text(g.answers[i],x,y+5);
                pop();
            } else if (i == 3){
                let c = temp[i];
                if(c.length == 8){
                    bezier(c[0],c[1],c[2],c[3],c[4],c[5],c[6],c[7]);
                    x = c[2]; y = c[3];
                    push();
                    noStroke(); fill(255);
                    rect(x,y,12,13);
                    fill(0); textSize(15);
                    text(g.answers[i],x+1,y+12);
                    pop();
                } else {
                    line(c[0],c[1],c[2],c[3]);
                    m = (c[3] - c[1])/(c[2] - c[0]);
                    b = c[1] - m*c[0];
                    x = g.wallX[1] + 40;
                    y = m*x + b;
                    push();
                    noStroke(); fill(255);
                    rect(x-1,y-7,12,13);
                    fill(0); textSize(15);
                    text(g.answers[i],x,y+5);
                    pop();
                }
            }
        }

        line(ans[0][0],ans[0][1],ans[1][0],ans[1][1]);
        m = (ans[1][1] - ans[0][1])/(ans[1][0] - ans[0][0]);
        b = ans[1][1] - m*ans[1][0];
        x = g.wallX[1] + 50;
        y = m*x + b;
        push();
        noStroke(); fill(255);
        rect(x-1,y-5,12,13);
        fill(0); textSize(15);
        text(g.answers[4],x,y+7);
        pop();
        pop();
        g.correctAnswer = g.answers[4];
    }

    if(g.solutionTruth){
        checkAnswerQuestionB(ans);
    }

    
}

// Generates the correct solution when wall B is generating heat
function correctBsolution(){
    
    let HF = g.length*g.Q*1000; // Heat flux
    let tempVec = new Array(3);

    tempVec[0] = HF/g.h + g.Tinf; // Ts1
    tempVec[1] = HF*g.length/g.kvalues[2] + tempVec[0]; // Ts2
    tempVec[2] = HF*g.Rtc + tempVec[1]; // Ts3

    let c2 = tempVec[2] + g.Q*g.length**2*1000/(2*g.kvalues[1]);
    let answer = [];
    let Bcurve = [];

    // Solves for the curve in wall B
    for(let i = 0; i < 10; i++){
        let x = 0.02*i;
        let y = -10*g.Q*x**2/(2*g.kvalues[1]) + c2;
        Bcurve.push([x,y]);
    }
    Bcurve.push([.2,tempVec[2]]);
    let Bcurvepx = [];

    let upperLim = 80; let lowerLim = 25;
    let upperPx = 170; let lowerPx = 325;

    // Converts the temperature values and x-locations into pixel coords
    for(let i = 0; i < tempVec.length; i++){
        let y = map(tempVec[i],lowerLim,upperLim,lowerPx,upperPx);
        answer.push([g.wallX[i],y]);
    }

    for(let i = 0; i < Bcurve.length; i++){
        let x = map(Bcurve[i][0],0,.2,g.wallX[3],g.wallX[2]);
        let y = map(Bcurve[i][1],lowerLim,upperLim,lowerPx,upperPx);
        Bcurvepx.push([x,y]);
    }

    answer.push(Bcurvepx);
    answer.push([g.wallX[4],Bcurvepx[0][1]]);
    answer.push([g.wallX[5],Bcurvepx[0][1]]);
    return(answer);
}

// Generates incorrect solutions for wall A profile when wall B is generating heat
function incorrectBsolution(ans){
    let incorrect = [];
    let x, y;
    let x1, y1, x2, y2, x3, y3;

    // Correct solution for part B as a choice
    let choice1 = []; 
    for(let i = 0; i < ans[3].length; i++){
        x = ans[3][i][0] - 170;
        y = ans[3][i][1] + g.qAprops[2];
        choice1.push([x,y]);
    }
    incorrect.push(choice1);

    // Upward sloped line
    let choice2 = [];
    x = g.wallX[5]; y = ans[5][1] - 1.2*g.qAprops[2];
    choice2.push(x,y);
    x = g.wallX[4]; y = ans[4][1] - 1*2*g.qAprops[2] - 20;
    choice2.push(x,y);
    incorrect.push(choice2);
    
    // Bezier or downward line
    if(g.Rtc <= 0.03){
        x = g.wallX[5]; y = choice2[3] - g.qAprops[3]*g.qAprops[1];
        x1 = x + 20; y1 = y - 25;
        x2 = x1 + 20 + g.qAprops[2]; y2 = y1 - g.qAprops[1];
        x3 = g.wallX[4]; y3 = choice2[3] - 1.3*g.qAprops[1];
        incorrect.push([x,y,x1,y1,x2,y2,x3,y3]);
    } else {
        x = g.wallX[5]; y = choice1[0][1] + 15 + g.qAprops[1];
        x1 = g.wallX[4]; y1 = choice1[choice1.length-1][1] + 5 + g.qAprops[2];
        incorrect.push([x,y,x1,y1]);
    }

    // Lower bezier
    if(incorrect[2].length == 8){
        x = g.wallX[5]; y = choice1[0][1] + g.qAprops[2];
        x1 = x + 40; y1 = y + 50;
        x2 = x1 + 30; y2 = y1 + g.qAprops[3]*g.qAprops[2];
        x3 = g.wallX[4]; y3 = y2;
        incorrect.push([x,y,x1,y1,x2,y2,x3,y3]);
    } else {
        x = g.wallX[5]; y = incorrect[2][1] + g.qAprops[2];
        x1 = x + 40; y1 = y + 50;
        x2 = x1 + 30; y2 = y1 + g.qAprops[3]*g.qAprops[2];
        x3 = g.wallX[4]; y3 = y2;
        incorrect.push([x,y,x1,y1,x2,y2,x3,y3]);
    }
    
    return(incorrect);
}

// Generates incorrect solutions for wall B profile when wall B is generating heat
function incorrectBpartBsolution(ans){
    let correct = ans[3];
    let incorrect = [];

    let x, y;
    let x1, y1, x2, y2, x3, y3;

    // Upward slanting answer
    x = g.wallX[3]; y = correct[0][1] - g.qAprops[2];
    x1 = g.wallX[2]; y1 = y - 25 - g.qAprops[1];
    incorrect.push([x,y,x1,y1]);

    // Flat answer
    let diff = correct[0][1] - y;
    x = g.wallX[3]; y = correct[correct.length-1][1] + diff/2;
    x1 = g.wallX[2]; y1 = y;
    incorrect.push([x,y,x1,y1]);

    // Inversion of correct answer
    let choice3 = []; 
    for(let i = 0; i < correct.length; i++){
        let ref = correct[0][1];
        let dif = correct[i][1] - ref;
        let y = ref - dif;
        choice3.push([correct[i][0],y]);
    }
    incorrect.push(choice3);

    // Downward slant or bezier
    if(g.Rtc >= 0.03){
        x = g.wallX[3]; y = incorrect[1][1] + g.qAprops[2]*1.4;
        x1 = g.wallX[2]; y1 = y + 10*g.qAprops[1];
        incorrect.push([x,y,x1,y1]);
    } else {
        x = g.wallX[3]; y = incorrect[1][1] + g.qAprops[2]*1.4;
        x1 = x + 30; y1 = y + 5*g.qAprops[1];
        x2 = x1 + 20; y2 = y1 + 30;
        x3 = g.wallX[2]; y3 = y2 + g.qAprops[3]*g.qAprops[1];
        incorrect.push([x,y,x1,y1,x2,y2,x3,y3])
    }

    return(incorrect);
}

// Generates incorrect solutions for wall C profile when wall B is generating heat
function incorrectBpartCsolution(ans){
    let incorrect = [];

    let x, y;
    let x1, y1, x2, y2, x3, y3;
    let m;

    // Downward sloping line with no Rtc or flat line
    if(g.Rtc > 0.02){
        m = (ans[0][1] - ans[1][1])/(ans[0][0] - ans[1][0]);
        x = g.wallX[1]; y = ans[3][ans[3].length-1][1];
        x1 = g.wallX[0]; y1 = y + m*(x1-x);
        incorrect.push([x,y,x1,y1]);
    } else {
        x = g.wallX[1]; y = ans[3][ans[3].length-1][1];
        x1 = g.wallX[0]; y1 = y;
        incorrect.push([x,y,x1,y1]);
    }

    // Low bezier
    x = g.wallX[1]; y = ans[1][1] + 5*g.qAprops[2];
    x1 = x + 20; y1 = y + 30;
    x2 = x1 + 30; y2 = y1 + 5;
    x3 = g.wallX[0]; y3 = ans[0][1] + 10 + g.qAprops[1];
    incorrect.push([x,y,x1,y1,x2,y2,x3,y3]);

    // Upward tilt
    x = g.wallX[1]; y = incorrect[0][1] - 3*g.qAprops[1];
    x1 = g.wallX[0]; y1 = y - 5*g.qAprops[1];
    incorrect.push([x,y,x1,y1]);

    // Upper bezier or another upward tilt
    if(g.Rtc < 0.04){
        x = g.wallX[1]; y = incorrect[2][1] - g.qAprops[2];
        x1 = x + 30; y1 = y - 25;
        x2 = x1 + 30; y2 = y1 - 10; 
        x3 = g.wallX[0]; y3 = incorrect[2][3] - g.qAprops[1];
        incorrect.push([x,y,x1,y1,x2,y2,x3,y3]);
    } else {
        x = g.wallX[1]; y = incorrect[1][1] - g.qAprops[1];
        x1 = g.wallX[0]; y1 = ans[0][1] + g.qAprops[1];
        incorrect.push([x,y,x1,y1]);
    }
    
    return(incorrect);
}

function checkAnswerQuestionB(ans){
    let x, y;
    let m, b;
    if(g.problemPart == 0){
        if(g.chosenAnswer == null){
            g.bottomText = "Select an answer choice first.";
            g.solutionTruth = false;
        } else if (g.chosenAnswer == g.correctAnswer){
            g.bottomText = "Correct, move on to the next part.";
            push(); 
            strokeWeight(2); stroke(120,0,120); fill(120,0,120);
            line(ans[5][0],ans[5][1],ans[4][0],ans[4][1]);
            ellipse(ans[5][0],ans[5][1],6);
            ellipse(ans[4][0],ans[4][1],6);
            push();
            noStroke(); fill(255);
            rect(g.wallX[4]-30,ans[5][1]-7,12,13);
            fill(0); textSize(15);
            text(g.answers[4],g.wallX[4]-29,ans[5][1]+5);
            pop();
            pop();
        } else if (g.chosenAnswer != g.correctAnswer){
            g.bottomText = "Incorrect, try again.";
            g.solutionTruth = false;
        }
    } else if (g.problemPart == 1 && !nextPart.disabled){
        if(g.chosenAnswer == null){
            g.bottomText = "Select an answer choice first.";
            g.solutionTruth = false;
        } else if (g.chosenAnswer == g.correctAnswer){
            g.bottomText = "Correct, move on to the next part.";
            let temp = ans[3];
            push();
            strokeWeight(2); stroke(120,0,120); fill(120,0,120);
            line(ans[5][0],ans[5][1],ans[4][0],ans[4][1]);
            ellipse(ans[5][0],ans[5][1],6);
            ellipse(ans[4][0],ans[4][1],6);
            line(ans[4][0],ans[4][1],temp[0][0],temp[0][1]);
            ellipse(temp[0][0],temp[0][1],6);
            ellipse(temp[temp.length-1][0],temp[temp.length-1][1],6);
            noFill(); beginShape();
            for(let i = 0; i < temp.length; i++){
                vertex(temp[i][0],temp[i][1]);
                if(i == temp.length-3){
                    x = temp[i][0]; y = temp[i][1];
                }
            }
            endShape();
            push();
            noStroke(); fill(255);
            rect(x-1,y-7,12,13);
            fill(0); textSize(15);
            text(g.correctAnswer,x,y+5);
            pop();
            pop();

        } else if (g.chosenAnswer != g.correctAnswer){
            g.bottomText = "Incorrect, try again.";
            g.solutionTruth = false;
        }
    } else if (nextPart.disabled){
        if(g.chosenAnswer == null){
            g.bottomText = "Select an answer choice first.";
            g.solutionTruth = false;
        } else if (g.chosenAnswer == g.correctAnswer){
            g.bottomText = "Correct, move on to a new problem.";
            let temp = ans[3];
            push();
            strokeWeight(2); stroke(120,0,120); fill(120,0,120);
            line(ans[5][0],ans[5][1],ans[4][0],ans[4][1]);
            ellipse(ans[5][0],ans[5][1],6);
            ellipse(ans[4][0],ans[4][1],6);
            line(ans[4][0],ans[4][1],temp[0][0],temp[0][1]);
            ellipse(temp[0][0],temp[0][1],6);
            ellipse(temp[temp.length-1][0],temp[temp.length-1][1],6);
            line(temp[temp.length-1][0],temp[temp.length-1][1],ans[1][0],ans[1][1]);
            line(ans[0][0],ans[0][1],ans[1][0],ans[1][1]);
            ellipse(ans[0][0],ans[0][1],6);
            ellipse(ans[1][0],ans[1][1],6);
            
            noFill(); beginShape();
            for(let i = 0; i < temp.length; i++){
                vertex(temp[i][0],temp[i][1]);
               
            }
            endShape();

            m = (ans[0][1] - ans[1][1])/(ans[0][0] - ans[1][0]);
            b = ans[0][1] - m*ans[0][0];
            x = g.wallX[1] + 50;
            y = m*x + b;
            push();
            noStroke(); fill(255);
            rect(x-1,y-5,12,13);
            fill(0); textSize(15);
            text(g.correctAnswer,x,y+7);
            pop();
            pop();
        } else if (g.chosenAnswer != g.correctAnswer){
            g.bottomText = "Incorrect, try again.";
            g.solutionTruth = false;
        }
    }
}



function bottomText(){
    push();
    textSize(25); noStroke();
    text(g.bottomText,70,580)
    pop();
}


// This is used to make the answer choices look a bit different each time 
function fillquestionAprops(){
    g.qAprops[0] = -.2*(.3+Math.random());
    g.qAprops[1] = Math.round(Math.random()*10);
    g.qAprops[2] = 10+Math.round(Math.random()*10);
    g.qAprops[3] = -1 + Math.round(Math.random()*2);
}

function hint(){
    if(g.heatWall == 'A'){
        if(g.problemPart == 0){
            g.bottomText = 'Hint: There is no heat transfer to the left side.';
        } else if (g.problemPart == 1){
            g.bottomText = 'Hint: Be sure to account for contact resistances.';
        }
    } else {
        if(g.problemPart == 0){
            g.bottomText = 'Hint: There is no heat transfer to the left side.';
        } else if (g.problemPart == 1 && !nextPart.disabled){
            g.bottomText = 'Hint: There is no heat transfer to the left side.';
        } else {
            g.bottomText = 'Hint: Be sure to account for contact resistances.';
        }
    }
}