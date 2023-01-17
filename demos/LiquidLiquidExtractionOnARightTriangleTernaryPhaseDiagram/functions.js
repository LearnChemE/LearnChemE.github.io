

// Overall drawing function
function triangleDraw(){
    push();

    noFill();
    strokeWeight(2);
    triangle(150, 50, 150, 500, 600, 500)
    pop();

    labels();
    phase();
    //line(150,60,590,500);

    if(g.gridTruth){
        grid();
    }
    if(g.compTruth){
        carrier();
    }
    
}

// Labels for the triangle
function labels() {
    let labels = ['0.1', '0.2', '0.3', '0.4', '0.5', '0.6', '0.7', '0.8', '0.9'];
    let by = 500;
    let lx = 150;
    
    
    push();
    textSize(22); strokeWeight(1.5);
    for(let i = 0; i < labels.length; i++){
        line(lx+45*(i+1),by-5,lx+45*(i+1),by+5);
        line(lx-5,by-45*(i+1),lx+5,by-45*(i+1));
        push();
        noStroke();
        fill(255,0,0);
        text(labels[i],lx+45*(i+1)-16,by+25);
        if(i == labels.length-1){
            text('solvent',610,510);
        }
        fill(0,0,255);
        text(labels[i],lx-40,by-45*(i+1)+8);
        if(i == labels.length-1){
            text('solute',120,40);
        }
        pop();
    }
    
    pop();
    
   
   
   
    push();
    textSize(22);
    fill(0, 100, 0);
    noStroke();
    text('carrier', 85, 520)
    pop();

    push();
    textSize(24);
    text('solvent mass fraction', 250, 560);
    translate(75, 375);
    rotate(radians(270));
    text('solute mass fraction', 0, 0);
    pop();
}

// Draws the phase curve
function phase(){
    push();
    strokeWeight(2.5); beginShape(); noFill();
    for(let i = 0; i < phaseInfo.length; i++){
        let x, y;
        x = map(phaseInfo[i][0],0,1,150,600);
        y = map(phaseInfo[i][1],0,1,500,50);
        vertex(x,y);
    }
    endShape();
    pop();

    let xLeft = [0.1014, 0.1036, 0.1072, 0.1127, 0.1218, 0.1391];
    let xRight = [0.8404, 0.7544, 0.6532, 0.5463, 0.4395, 0.3322];
    let yLeft = []; let yRight = [];
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
    push();
    strokeWeight(2);
    for(let i = 0; i < xLeft.length; i++){
        x1 = map(xLeft[i],0,1,150,600);
        x2 = map(xRight[i],0,1,150,600);
        y1 = map(yLeft[i],0,1,500,50);
        y2 = map(yRight[i],0,1,500,50);
        line(x1,y1,x2,y2);
        b = y1 - ((y2-y1)/(x2-x1))*x1;
        bvec.push(b)
        positions.push([x1,y1,x2,y2]);
        slopes.push((y2-y1)/(x2-x1))
    }
    pop();
}

// Draws the grid lines
function grid(){
   let lx = 150; let by = 500; // left x and bottom y
   let temp;
   let x, y;
    
    // Solvent lines
    push(); strokeWeight(1.5); stroke(0,60);
    for(let i = 0; i < 20; i++){
        x = lx+45/2*(i+1); y = lx+45/2*(i+1)+g.R[1];
        line(x,by,x,y);
        y = by-45/2*(i+1); x = y-g.R[1];
        line(lx,y,x,y);
        y = by-45/2*(i+1); x = lx+45/2*(i+1);
        line(lx,y,x,by);
    }
    pop();
}

// Displays carrier compositions
function carrier(){
    let labels = ['0.1', '0.2', '0.3', '0.4', '0.5', '0.6', '0.7', '0.8', '0.9'];
    let by = 500; let lx = 150;
    let x, y;

    push();
    strokeWeight(2);
    for(let i = 0; i < labels.length; i++){
        x = lx; y = by-45*(i+1);
        line(x,y,x+10,y+10);
        line(x+40,y+40,lx+45*(i+1),by);
        push();
        textSize(22); noStroke(); fill(0,100,0);
        translate(x+8,y+20);
        rotate(radians(45));
        push(); 
        fill(255); noStroke();
        rect(-5,-18,37,18)
        pop();
        text(labels[i],0,0);
        pop();
    }
    pop();
}

function interpolate(xcurrent, x1, x2, y1, y2){
    let y;
    y = y1 + (xcurrent-x1)*(y2-y1)/(x2-x1);
    return(y);
}