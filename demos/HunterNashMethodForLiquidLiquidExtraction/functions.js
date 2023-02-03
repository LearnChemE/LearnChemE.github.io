

function triangleDraw(){
    if(g.gridTruth){
        gridDraw();
    }
    
    push();
    noFill(); strokeWeight(2);
    triangle(g.xtip,g.ytip,g.xtip-g.dx,g.ytip+g.dy,g.xtip+g.dx,g.ytip+g.dy);
    

    beginShape();
    for(let i = 0; i < 1; i += 0.01){
        let x = map(i,0,1,g.xtip-g.dx,g.xtip+g.dx);
        let y = map(-1.551*i**2 + 1.536*i,0,1,g.ytip+g.dy,g.ytip);
        vertex(x,y);
    }
    endShape();

    for(let i = 0; i < tie.xLeft.length; i++){
        let x1 = map(tie.xLeft[i],0,1,g.xtip-g.dx,g.xtip+g.dx);
        let x2 = map(tie.xRight[i],0,1,g.xtip-g.dx,g.xtip+g.dx);
        let y1 = map(-1.551*tie.xLeft[i]**2 + 1.536*tie.xLeft[i],0,1,g.ytip+g.dy,g.ytip);
        let y2 = map(-1.551*tie.xRight[i]**2 + 1.536*tie.xRight[i],0,1,g.ytip+g.dy,g.ytip);
        line(x1,y1,x2,y2);
    }
    pop();

    let labels = ['0.1','0.2','0.3','0.4','0.5','0.6','0.7','0.8','0.9'];
    let unitVec = new Array(2);
    push();
    textSize(25); 

    // Solute labels
    fill(0,0,255); 
    for(let i = 0; i < labels.length; i++){
        let y = g.ytip + g.dy - g.dy/10*(i+1);
        let x = (y-g.L[1])/g.L[0];
        line(x,y,x-20,y);
        push(); noStroke();
        text(labels[i],x-60,y+8);
        if(i == labels.length-1){
            text('solute',g.xtip-35,g.ytip-10);
        }
        pop();
        
    }

    // Carrier labels
    fill(0,100,0); 
    for(let i = 0; i < labels.length; i++){
        let y1 = g.ytip + g.dy/10*(i+1);
        let x1 = (y1-g.R[1])/g.R[0];
        let x2 = x1 + 9;
        let y2 = g.L[0]*x2 + (y1-g.L[0]*x1);
        line(x1,y1,x2,y2);
        push(); noStroke();
        translate(x2+10,y2);
        rotate(-g.angle);
        text(labels[i],0,0);
        pop();
        if(i == labels.length-1){
            push(); noStroke();
            text('carrier',g.xtip+g.dx-15,g.ytip+g.dy+20);
            pop();
        }
    }

    // Solvent labels
    fill(255,0,0); 
    for(let i = 0; i < labels.length; i++){
        let y1 = g.ytip+g.dy;
        let x1 = g.xtip+g.dx-2*g.dx/10*(i+1);
        let x2 = x1 + 9;
        let y2 = g.R[0]*x2 + (y1-g.R[0]*x1);
        line(x1,y1,x2,y2);
        push(); noStroke();
        translate(x2-6,y2+8);
        rotate(g.angle);
        text(labels[i],0,0);
        pop();
        if(i == labels.length-1){
            push(); noStroke();
            text('solvent',g.xtip-g.dx-40,g.ytip+g.dy+23);
            pop();
        }
    }
    pop();
    
    
}

function triangleDataFill(){
    g.angle = 60*Math.PI/180;
    g.dx = 500*Math.cos(g.angle);
    g.dy = 500*Math.sin(g.angle);

    let m, b;

    // Left edge 
    m = -g.dy/g.dx;
    b = (g.ytip+g.dy) - m*(g.xtip-g.dx);
    g.L = [m,b];

    // Right edge
    m = g.dy/g.dx;
    b = (g.ytip+g.dy) - m*(g.xtip+g.dx);
    g.R = [m,b];
}

function gridDraw(){
    push();
    stroke(0,25);
    let x1, x2, x3, y1, y2, y3;
    for(let i = 0; i < 19; i++){
        y1 = g.ytip + g.dy/20*(i+1);
        y2 = y1;
        y3 = g.ytip+g.dy;
        x1 = (y1 - g.L[1])/g.L[0];
        x2 = (y2 - g.R[1])/g.R[0];
        x3 = g.xtip+g.dx - 2*g.dx/20*(i+1);
        line(x1,y1,x2,y2);
        line(x1,y1,x3,y3);
    }
    for(let i = 0; i < 19; i++){
        y1 = g.ytip + g.dy/20*(i+1);
        y2 = g.ytip+g.dy;

        x1 = (y1-g.R[1])/g.R[0];
        x2 = g.xtip-g.dx + 2*g.dx/20*(i+1);
        line(x1,y1,x2,y2);
    }
    pop();
}