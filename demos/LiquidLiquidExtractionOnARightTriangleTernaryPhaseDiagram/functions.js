
// Overall drawing function
function triangleDraw(){
    push();

    noFill();
    strokeWeight(2);
    triangle(150, 50, 150, 500, 600, 500)
    pop();

    labels();
    phase();

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




function plotPoints(){
    //console.log(g.points[0].x,g.points[0].y)
    let lx = 150; let rx = 600; // left and right edges of triangle
    let by = 500; let ty = 50; // top and bottom of triangle

    switch (g.mix){
        case 'feed':
            feedCase();
            break;
        case 'solvent':
            solventCase();
            break;
        case 'raffinate':
            raffinateCase();
            break;
    }

    push();
    noStroke(); fill(255,0,0);
    ellipse(map(sFracs.solv,0,1,lx,rx),map(sFracs.solu,0,1,by,ty),2*g.radius);
    fill(0,100,100);
    ellipse(map(rFracs.solv,0,1,lx,rx),map(rFracs.solu,0,1,by,ty),2*g.radius);
    pop();

    function feedCase(){
        let temp = g.points[0]; // position of the dot
        let diff1, diff2;
        
        push();
        strokeWeight(3); stroke(0,0,255);
        line(temp.x,temp.y,lx+2,temp.y); // solute line
        stroke(255,0,0);
        line(temp.x,temp.y,temp.x,by-2); // solvent line
        diff1 = by - temp.y;
        diff2 = temp.x - lx;
        stroke(0,100,0);
        line(lx+2,temp.y-diff2+2,diff1+temp.x-2,by-2); // carrier line
        pop();

        push();
        fill(255); stroke(0); strokeWeight(1.5);
        ellipse(temp.x+27,temp.y-27,22*2);
        textStyle(ITALIC);
        noStroke(); fill(0); textSize(30);
        text('F',temp.x+16,temp.y-16);
        pop();

        let solv_nf, solu_nf; // unfixed
        let solv_f, solu_f, carrier_f; // fixed

        solv_nf = map(temp.x,lx,rx,0,1);
        solu_nf = map(temp.y,by,ty,0,1);

        carrier_f = (1-solv_nf-solu_nf).toFixed(2);
        solv_f = solv_nf.toFixed(2);
        solu_f = solu_nf.toFixed(2);

        push();
        textSize(22);
        text('feed mass fractions',390,90);
        strokeWeight(2);
        rect(400,100,175,100);
        noStroke(); fill(0,0,255);
        text('solute = '+solu_f,425,125);
        fill(255,0,0);
        text('solvent = '+solv_f,415,155);
        fill(0,100,0);
        text('carrier = '+carrier_f,423,185);
        pop();
    }

    function solventCase(){
        let x = map(sFracs.solv,0,1,lx,rx);
        let y = map(sFracs.solu,0,1,by,ty);
        let diff = x - lx;

        push();
        strokeWeight(3); stroke(0,0,255);
        line(x,y,lx+2,y);
        stroke(0,100,0);
        line(x,y,lx,y-diff);
        pop();
        push();
        fill(255); stroke(0); strokeWeight(1.5);
        ellipse(x-27,y-27,22*2);
        textStyle(ITALIC);
        noStroke(); fill(0); textSize(30);
        text('S',x-38,y-16);
        pop();

        push();
        textSize(22);
        text('solvent mass fractions',375,90);
        strokeWeight(2);
        rect(400,100,175,100);
        noStroke(); fill(0,0,255);
        text('solute = '+sFracs.solu.toFixed(2),425,125);
        fill(255,0,0);
        text('solvent = '+sFracs.solv,415,155);
        fill(0,100,0);
        text('carrier = '+sFracs.carr,423,185);
        pop();
    }

    function raffinateCase(){
        let x = map(rFracs.solv,0,1,lx,rx);
        let y = map(rFracs.solu,0,1,by,ty);
        let diff1, diff2;

        diff1 = by - y;
        diff2 = x - lx;

        push();
        strokeWeight(3); stroke(0,0,255);
        line(x,y,lx+2,y);
        stroke(255,0,0);
        line(x,y,x,by);
        stroke(0,100,0);
        line(lx+2,y-diff2+2,diff1+x-2,by-2)
        pop();

        push();
        textSize(22);
        text('raffinate mass fractions',370,90);
        strokeWeight(2);
        rect(400,100,175,100);
        noStroke(); fill(0,0,255);
        text('solute = '+rFracs.solu.toFixed(2),425,125);
        fill(255,0,0);
        text('solvent = '+rFracs.solv,415,155);
        fill(0,100,0);
        text('carrier = '+rFracs.carr.toFixed(2),423,185);
        pop();

        push();
        fill(255); stroke(0); strokeWeight(1.5);
        ellipse(x+27,y-27,22*2);
        textStyle(ITALIC);
        noStroke(); fill(0); textSize(25);
        text('R',x+10,y-19);
        textSize(17);
        text('N',x+28,y-14)
        pop();
    }
}

function mixingPoint(){
    let lx = 150; let rx = 600; // left and right edges of triangle
    let by = 500; let ty = 50; // top and bottom of triangle

    let xF, yF;
    let xS, yS;
    let xM, yM;
    let x0, y0;
    let xRn, yRn;
    let xE, yE;

    let temp = g.points[0]; // Holds X and Y of feed in pixels
    xF = map(temp.x,lx,rx,0,1); yF = map(temp.y,by,ty,0,1); // X and Y feed 
    xS = sFracs.solv; yS = sFracs.solu; // X and Y solvent
    xRn = rFracs.solv; yRn = rFracs.solu; // X and Y raffinate
    xM = (xF + xS)/2; yM = (yF + yS)/2; // X and Y mixing point

    let xRnpx = map(xRn,0,1,lx,rx); // X raff (pixels) 
    let yRnpx = map(yRn,0,1,by,ty); // Y raff (pixels)
    let xSpx = map(xS,0,1,lx,rx); // X solv (pixels);
    let ySpx = map(yS,0,1,by,ty); // Y solv (pixels)
    let xMpx = map(xM,0,1,lx,rx); // X mixing point (pixels)
    let yMpx = map(yM,0,1,by,ty); // Y mixing point (pixels)

    

    if(g.e1Truth){
        e1func(); // e1 checkbox is checked
    } else {
        feed_solvent_flow(); // e1 checkbox isn't checked
    }
    

    // F, S, and R_N labels
    F_S_Rn_MLabels(); // I put this into a function so I could minimize the code for it
    function F_S_Rn_MLabels(){
        let x,y;
        push();
        fill(255); stroke(0); strokeWeight(1.5);
        ellipse(temp.x+27,temp.y-27,22*2);
        textStyle(ITALIC);
        noStroke(); fill(0); textSize(30);
        text('F',temp.x+16,temp.y-16);
        x = map(sFracs.solv,0,1,lx,rx);
        y = map(sFracs.solu,0,1,by,ty);
        fill(255); stroke(0); strokeWeight(1.5);
        ellipse(x-27,y-27,22*2);
        noStroke(); fill(0); textSize(30);
        text('S',x-38,y-16);
        x = map(rFracs.solv,0,1,lx,rx);
        y = map(rFracs.solu,0,1,by,ty);
        fill(255); stroke(0); strokeWeight(1.5);
        ellipse(x+27,y-27,22*2);
        noStroke(); fill(0); textSize(25);
        text('R',x+10,y-19);
        textSize(17);
        text('N',x+28,y-14)
        fill(255); stroke(0); strokeWeight(1.5);
        ellipse(xMpx+27,yMpx+18,22*2);
        noStroke(); fill(0); textSize(30);
        text('M',xMpx+13,yMpx+28)
        pop();
    }

    function e1func(){
        // Define line equation through Rn and M
        // using phaseInfopx, test x and y-coords against the y-coord Rn-M line would have
        // when it's bounded between 2 points (or equal to one)

    }

    function feed_solvent_flow(){
         
    }

    push();
    noStroke(); fill(100);
    ellipse(xMpx,yMpx,2*g.radius); // Mixing point
    fill(255,0,0);
    ellipse(xSpx,ySpx,2*g.radius); // Solvent point
    fill(0,100,100);
    ellipse(xRnpx,yRnpx,2*g.radius); // Raffinate point
    pop();
    
}

function operatingPoint(){

}

function countStages(){

}