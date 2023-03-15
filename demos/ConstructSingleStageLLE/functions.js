
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
        g.question = 'Step 5: use sliders to set the correct mass percentages of the mixing point';
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