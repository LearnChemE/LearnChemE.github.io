
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
        // Phase curve
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

        // Tie lines
        push();
        strokeWeight(2);
        let x1, x2, y1, y2;
        for(let i = 0; i < tie.pos.length; i++){
            x1 = tie.pos[i][0];
            x2 = tie.pos[i][1];
            y1 = tie.pos[i][2];
            y2 = tie.pos[i][3];
            line(x1,y1,x2,y2);
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
        let labels = ['0.9', '0.8', '0.7', '0.6', '0.5', '0.4', '0.3', '0.2', '0.1'];
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

        // Mass fraction display
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
    let xRn, yRn;

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

    push();
    strokeWeight(2);
    line(xSpx,ySpx,temp.x,temp.y);
    pop();

    if(g.e1Truth){
        e1func(); // e1 checkbox is checked
    } else {
        feed_solvent_flow(); // e1 checkbox isn't checked
    }
    

    // F, S, and R_N labels
    F_S_Rn_MLabels();
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
        ellipse(x-27,y+27,22*2);
        noStroke(); fill(0); textSize(30);
        text('S',x-38,y+38);
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
        // when it's bounded between 2 points (or equal to one) solve for x-coord
        // then plug solved x-coord into equation and get point
        let x1, x2, y1, y2;
        let m1, b1, m2, b2; // y = mx+b 

        x1 = xMpx; y1 = yMpx;
        x2 = xRnpx; y2 = yRnpx;
        
        m1 = (y2-y1)/(x2-x1); // slope of line through M and Rn
        b1 = y1 - m1*x1; // y intercept of line through M and Rn

        let yL, yU, yC, yUU; // lower and upper bounds and x & y current. Added yUU as yupperupper which resolved an issue when the line passed through one of the points that make up the phase curve
        let xe1, ye1;

        for(let i = 11; i < 19; i++){ // less than 19 because M never really gets past about .25 so we don't need to iterate through the full array
            yL = g.phaseInfopx[i][1];
            yU = g.phaseInfopx[i+1][1];
            yC = m1*g.phaseInfopx[i][0] + b1; 
            yUU = g.phaseInfopx[i+2][1];

            if(yC <= yL && yC >= yU){ // Finding where the line passes between lower and upper bounds
                m2 = (yL-yU)/(g.phaseInfopx[i][0]-g.phaseInfopx[i+1][0]);
                b2 = yL - m2*g.phaseInfopx[i][0];
                xe1 = (b2-b1)/(m1-m2); // x location of E1
                ye1 = m1*xe1 + b1; // y location of E1

            } else if(yC <= yU && yC > yUU){
                xe1 = g.phaseInfopx[i+1][0];
                ye1 = g.phaseInfopx[i+1][1];
            }
        }   

        // E1 dot
        push();
        strokeWeight(2);
        line(x2,y2,xe1,ye1);
        arrow([x2,y2],[xe1,ye1],[0,0,0],15,5);
        fill(255,100,51); noStroke();
        ellipse(xe1,ye1,g.radius*2);

        // E1 label
        fill(255); stroke(0); strokeWeight(1.5);
        ellipse(xe1-25,ye1-20,20*2);
        textStyle(ITALIC);
        noStroke(); fill(0); textSize(25);
        text('E',xe1-37,ye1-12);
        textSize(18); textStyle(NORMAL);
        text('1',xe1-22,ye1-7)
        pop();

        

    }

    function feed_solvent_flow(){
       let u_hat, u_perp;
       let dx, dy, mag;
       let p = []; // holds points where the arrows will go
       let size = 30;

       // unit vector from S to F points
       dx = temp.x - xSpx; 
       dy = temp.y - ySpx;
       mag = (dx**2 + dy**2)**(1/2);
       
       u_hat = [dx/mag,dy/mag]; // unit vec
       u_perp = [-u_hat[1],u_hat[0]]; // perpendicular unit vec

       p.push([xSpx - size*u_perp[0],ySpx - size*u_perp[1]]);
       p.push([xMpx - size*u_perp[0],yMpx - size*u_perp[1]]);
       p.push([temp.x - size*u_perp[0],temp.y - size*u_perp[1]]);

       push();
       strokeWeight(2.5);
       line(xSpx,ySpx,p[0][0],p[0][1]);
       line(xMpx,yMpx,p[1][0],p[1][1]);
       line(temp.x,temp.y,p[2][0],p[2][1]);
       line(p[0][0],p[0][1],p[1][0],p[1][1]);
       stroke(255,0,0);
       line(p[1][0],p[1][1],p[2][0],p[2][1]);
       pop();

       let angle = Math.atan((temp.y-ySpx)/(temp.x-xSpx));

       push();
       translate(p[0][0]+5*u_hat[0],p[0][1]+40*u_hat[1]);
       rotate(angle);
       push();
       fill(255); noStroke(); 
       rect(-3,-20,97,25);
       pop();
       textSize(23);
       text('feed flow',0,0);
       pop();
       push();
       translate(p[1][0]+5*u_hat[0],p[1][1]+20*u_hat[1]);
       rotate(angle);
       push();
       fill(255); noStroke();
       rect(-3,-20,124,25);
       pop();
       textSize(23);
       text('solvent flow',0,0);
       pop();

       arrow(p[1],p[0],[0,0,0],15,5);
       arrow(p[0],p[1],[0,0,0],15,5);
       arrow(p[1],p[2],[255,0,0],15,5);
       arrow(p[2],p[1],[255,0,0],15,5);


    }

    push();
    noStroke(); fill(100);
    ellipse(xMpx,yMpx,2*g.radius); // Mixing point
    fill(255,0,0);
    ellipse(xSpx,ySpx,2*g.radius); // Solvent point
    fill(0,100,100);
    ellipse(xRnpx,yRnpx,2*g.radius); // Raffinate point
    pop();
    

    let solv_nf, solu_nf; // unfixed
    let solv_f, solu_f, carrier_f; // fixed
    
    solv_nf = map(xMpx,lx,rx,0,1);
    solu_nf = map(yMpx,by,ty,0,1);
    carrier_f = (1-solv_nf-solu_nf).toFixed(2);
    solv_f = solv_nf.toFixed(2);
    solu_f = solu_nf.toFixed(2);

    // Mass fraction display
    push();
    textSize(22);
    text('mixing point mass fractions',360,90);
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

function operatingPoint(){
    let lx = 150; let rx = 600; // left and right edges of triangle
    let by = 500; let ty = 50; // top and bottom of triangle

    let xF, yF;
    let xS, yS;
    let xM, yM;
    let xRn, yRn;

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

    F_S_Rn_MLabels();
    let e1_coords = e1();
    operatingPointLine();
    upperRightImage();
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
        ellipse(x-27,y+27,22*2);
        noStroke(); fill(0); textSize(30);
        text('S',x-38,y+38);
        x = map(rFracs.solv,0,1,lx,rx);
        y = map(rFracs.solu,0,1,by,ty);
        fill(255); stroke(0); strokeWeight(1.5);
        ellipse(x+27,y-27,22*2);
        noStroke(); fill(0); textSize(25);
        text('R',x+10,y-19);
        textSize(17);
        text('N',x+28,y-14)
        pop();
    }


    function e1(){
        let x1, x2, y1, y2;
        let m1, b1, m2, b2; // y = mx+b 

        x1 = xMpx; y1 = yMpx;
        x2 = xRnpx; y2 = yRnpx;
        
        m1 = (y2-y1)/(x2-x1); // slope of line through M and Rn
        b1 = y1 - m1*x1; // y intercept of line through M and Rn

        let yL, yU, yC, yUU; // lower and upper bounds and x & y current. Added yUU as yupperupper which resolved an issue when the line passed through one of the points that make up the phase curve
        let xe1, ye1;

        for(let i = 11; i < 19; i++){ // less than 19 because M never really gets past about .25 so we don't need to iterate through the full array
            yL = g.phaseInfopx[i][1];
            yU = g.phaseInfopx[i+1][1];
            yC = m1*g.phaseInfopx[i][0] + b1; 
            yUU = g.phaseInfopx[i+2][1];

            if(yC <= yL && yC >= yU){ // Finding where the line passes between lower and upper bounds
                m2 = (yL-yU)/(g.phaseInfopx[i][0]-g.phaseInfopx[i+1][0]);
                b2 = yL - m2*g.phaseInfopx[i][0];
                xe1 = (b2-b1)/(m1-m2); // x location of E1
                ye1 = m1*xe1 + b1; // y location of E1

            } else if(yC <= yU && yC > yUU){
                xe1 = g.phaseInfopx[i+1][0];
                ye1 = g.phaseInfopx[i+1][1];
            }
        }

        push();
        // E1 label
        fill(255); stroke(0); strokeWeight(1.5);
        ellipse(xe1-25,ye1-20,20*2);
        textStyle(ITALIC);
        noStroke(); fill(0); textSize(25);
        text('E',xe1-37,ye1-12);
        textSize(18); textStyle(NORMAL);
        text('1',xe1-22,ye1-7)
        pop();
        return([xe1,ye1])
    }

    function operatingPointLine(){
        // line through E1 and F
        // line through Rn and S
        // Find the intersection of those two lines to get P
        let m_EF, b_EF, m_RS, b_RS;

        m_EF = (temp.y - e1_coords[1])/(temp.x - e1_coords[0]);
        b_EF = temp.y - m_EF*temp.x;

        m_RS = (yRnpx - ySpx)/(xRnpx - xSpx);
        b_RS = yRnpx - m_RS*xRnpx;

        let x = (b_RS - b_EF)/(m_EF - m_RS);
        let y = m_EF*x + b_EF;

        // Connecting lines
        push();
        stroke(112,41,99); fill(112,41,99);
        ellipse(x,y,2*g.radius);
        strokeWeight(3);
        drawingContext.setLineDash([5,10]);
        line(x,y,temp.x,temp.y);
        line(x,y,xRnpx,yRnpx);
        pop();

        // P label
        push();
        fill(255); stroke(0); strokeWeight(1.5);
        ellipse(x-22,y-23,20*2);
        textStyle(ITALIC);
        noStroke(); fill(0); textSize(30);
        text('P',x-32,y-12);
        pop();
    }

    function upperRightImage(){
        // Rectangles and label
        push();
        strokeWeight(2);
        for(let i = 0; i < 3; i++){
            rect(380+80*i,100,40,80);
        }
        noStroke(); textSize(25);
        text('1',393,150);
        text('n',473,150);
        text('N',551,150);
        pop();
        
        // Squiggly bit
        push();
        strokeWeight(2); noFill(); 
        for(let i = 0; i < 2; i++){
            beginShape();
            for(let j = 0; j < squiggle.length; j++){
                let x = squiggle[j][0]+290+80*i;
                let y = squiggle[j][1]+70;
                curveVertex(x,y);
            }
            endShape();
        }
        pop();

        // lines and arrows
        push(); strokeWeight(2);
        for(let i = 0; i < 2; i++){
            for(let j = 0; j < 4; j++){
                line(340+80*j,120+40*i,380+80*j,120+40*i);
                if(i == 0){
                    arrow([380+80*j,120+40*i],[340+80*j,120+40*i],[0,0,0],15,4);
                } else {
                    arrow([340+80*j,120+40*i],[380+80*j,120+40*i],[0,0,0],15,4);
                }
            }
        }
        pop();

        // Labels on arrows
        push();
        textSize(25); noStroke(); textStyle(ITALIC);
        text('E',313,127);
        text('F',315,167);
        text('S',620,129);
        text('R',620,168);
        textStyle(NORMAL); textSize(18);
        text('1',327,133);
        text('N',637,174);
        pop();


        // Equation
        push();
        textStyle(ITALIC); textSize(25);
        text('P = E  - F = R  - S',380,225);
        textStyle(NORMAL); textSize(18);
        text('1',442,232);
        text('N',532,232);
        pop();
    }

    push();
    noStroke(); fill(255,100,51);
    ellipse(e1_coords[0],e1_coords[1],2*g.radius);
    fill(255,0,0);
    ellipse(xSpx,ySpx,2*g.radius); // Solvent point
    fill(0,100,100);
    ellipse(xRnpx,yRnpx,2*g.radius); // Raffinate point
    pop();
}

function countStages(){
    let lx = 150; let rx = 600; // left and right edges of triangle
    let by = 500; let ty = 50; // top and bottom of triangle

    let xF, yF;
    let xS, yS;
    let xM, yM;
    let xRn, yRn;

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

    let e1_coords = e1();

    push();
    noStroke(); fill(255,100,51);
    ellipse(e1_coords[0],e1_coords[1],2*g.radius);
    fill(255,0,0);
    ellipse(xSpx,ySpx,2*g.radius); // Solvent point
    fill(0,100,100);
    ellipse(xRnpx,yRnpx,2*g.radius); // Raffinate point
    pop();

    
    F_S_Rn_MLabels();
    let opPoint = operatingPointDot();
    equilibPoints();

    function upperRightImage(){
        push();
        strokeWeight(2);
        
        // Rectangles and text
        for(let i = 0; i < 6; i++){
            push();
            noFill();
            rect(260+70*i,30,35,70);
            textSize(25); fill(0);
            text(i+1,270+70*i,73);
            pop();
        }

        // Lines, arrows, and labels
        push();
        textSize(20); textStyle(ITALIC);
        for(let j = 0; j < 2; j++){
            for(let i = 0; i < 7; i++){
                if(j == 0){
                    line(225+70*i,45,260+70*i,45);
                    arrow([260+70*i,45],[225+70*i,45],[0,0,0],14,4);
                    if(i != 6){
                        text('E',235+70*i,33);
                        push();
                        textStyle(NORMAL); textSize(15);
                        text(i+1,248+70*i,37);
                        pop();
                    } else {
                        text('S',235+70*i,35);
                    }
                    
                } else {
                    line(225+70*i,85,260+70*i,85);
                    arrow([225+70*i,85],[260+70*i,85],[0,0,0],14,4);
                    if(i == 0){
                        text('F',235+70*i,110);
                    } else {
                        text('R',235+70*i,110);
                        push();
                        textStyle(NORMAL); textSize(15);
                        text(i,249+70*i,115);
                        pop();
                    }
                }
            }
        }
        pop();
        pop();
        push();
        textSize(25);
        text('number of orange lines = ',370,170);
        text('number of stages needed',370,200);
        pop();
    }
    
    function e1(){
        let x1, x2, y1, y2;
        let m1, b1, m2, b2; // y = mx+b 

        x1 = xMpx; y1 = yMpx;
        x2 = xRnpx; y2 = yRnpx;
        
        m1 = (y2-y1)/(x2-x1); // slope of line through M and Rn
        b1 = y1 - m1*x1; // y intercept of line through M and Rn

        let yL, yU, yC, yUU; // lower and upper bounds and x & y current. Added yUU as yupperupper which resolved an issue when the line passed through one of the points that make up the phase curve
        let xe1, ye1;

        for(let i = 11; i < 19; i++){ // less than 19 because M never really gets past about .25 so we don't need to iterate through the full array
            yL = g.phaseInfopx[i][1];
            yU = g.phaseInfopx[i+1][1];
            yC = m1*g.phaseInfopx[i][0] + b1; 
            yUU = g.phaseInfopx[i+2][1];

            if(yC <= yL && yC >= yU){ // Finding where the line passes between lower and upper bounds
                m2 = (yL-yU)/(g.phaseInfopx[i][0]-g.phaseInfopx[i+1][0]);
                b2 = yL - m2*g.phaseInfopx[i][0];
                xe1 = (b2-b1)/(m1-m2); // x location of E1
                ye1 = m1*xe1 + b1; // y location of E1

            } else if(yC <= yU && yC > yUU){
                xe1 = g.phaseInfopx[i+1][0];
                ye1 = g.phaseInfopx[i+1][1];
            }
        }

        push();
        // E1 label
        fill(255); stroke(0); strokeWeight(1.5);
        ellipse(xe1-25,ye1-20,20*2);
        textStyle(ITALIC);
        noStroke(); fill(0); textSize(25);
        text('E',xe1-37,ye1-12);
        textSize(18); textStyle(NORMAL);
        text('1',xe1-22,ye1-7)
        pop();
        return([xe1,ye1])
    }

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
        ellipse(x-27,y+27,22*2);
        noStroke(); fill(0); textSize(30);
        text('S',x-38,y+38);
        x = map(rFracs.solv,0,1,lx,rx);
        y = map(rFracs.solu,0,1,by,ty);
        fill(255); stroke(0); strokeWeight(1.5);
        ellipse(x+27,y-27,22*2);
        noStroke(); fill(0); textSize(25);
        text('R',x+10,y-19);
        textSize(17);
        text('N',x+28,y-14)
        pop();
    }

    function operatingPointDot(){
        let m_EF, b_EF, m_RS, b_RS;

        m_EF = (temp.y - e1_coords[1])/(temp.x - e1_coords[0]);
        b_EF = temp.y - m_EF*temp.x;

        m_RS = (yRnpx - ySpx)/(xRnpx - xSpx);
        b_RS = yRnpx - m_RS*xRnpx;

        let x = (b_RS - b_EF)/(m_EF - m_RS);
        let y = m_EF*x + b_EF;

        // P Dot
        push();
        stroke(112,41,99); fill(112,41,99);
        ellipse(x,y,2*g.radius);
        pop();

        // P label
        push();
        fill(255); stroke(0); strokeWeight(1.5);
        ellipse(x-22,y-23,20*2);
        textStyle(ITALIC);
        noStroke(); fill(0); textSize(30);
        text('P',x-32,y-12);
        pop();
        return([x,y]);
    }

    function equilibPoints(){
        // Generate the tie lines and then draw them depending on the slider
        let yVals = new Array(7);
        for(let i = 0; i < tie.m.length; i++){
            yVals[i] = tie.m[i]*e1_coords[0] + tie.b[i];
        }

        let extractPoints = [];
        let raffinatePoints = [];
        
        extractPoints.push(e1_coords); // E1
        raffinatePoints.push(nextRaffinate(extractPoints[0])); // R1

        extractPoints.push(nextExtract(raffinatePoints[0],opPoint)); // E2
        raffinatePoints.push(nextRaffinate(extractPoints[1])); // R2

        extractPoints.push(nextExtract(raffinatePoints[1],opPoint)); // E3
        raffinatePoints.push(nextRaffinate(extractPoints[2])); // R3

        extractPoints.push(nextExtract(raffinatePoints[2],opPoint)); // E4
        raffinatePoints.push(nextRaffinate(extractPoints[3])); // R4

        extractPoints.push(nextExtract(raffinatePoints[3],opPoint)); // E5
        raffinatePoints.push(nextRaffinate(extractPoints[4])); // R5

        extractPoints.push(nextExtract(raffinatePoints[4],opPoint)); // E6
        raffinatePoints.push(nextRaffinate(extractPoints[5])); // R6
        
        

        let test = false;
        let stages;
        let counter = 0;
        while(!test){
            if(raffinatePoints[counter][0] > xRnpx || counter == 5){
                stages = counter;
                test = true;
            }
            counter++;
        }
        stages = stages + 1;

        drawEquilibLines(extractPoints,raffinatePoints,stages);
    }

    function drawEquilibLines(ex,raf,stages){
        if(g.tieSlider <= stages){
            for(let i = 0; i < g.tieSlider; i++){
                push();
                strokeWeight(2); stroke(255,100,51);
                line(ex[i][0],ex[i][1],raf[i][0],raf[i][1]);
                noStroke(); fill(0,100,190);
                ellipse(raf[i][0],raf[i][1],2*g.radius);
                pop();
                if(g.tieSlider == 1){
                    push();
                    fill(255); stroke(0); strokeWeight(1.5);
                    ellipse(raf[i][0]+25,raf[i][1]-20,20*2);
                    textStyle(ITALIC);
                    noStroke(); fill(0); textSize(25);
                    text('R',raf[i][0]+11,raf[i][1]-13);
                    textStyle(NORMAL); textSize(18);
                    text('1',raf[i][0]+28,raf[i][1]-8)
                    pop();

                    push();
                    noStroke(); fill(255,100,51);
                    rect(260+70*i,30,35,70);
                    pop();
                    
                } else if (i > 0 && i == g.tieSlider-1){
                    push(); stroke(0,100,190); strokeWeight(2);
                    drawingContext.setLineDash([5,5]);
                    line(raf[i-1][0],raf[i-1][1],opPoint[0],opPoint[1]);
                    pop();

                    push();
                    fill(255); stroke(0); strokeWeight(1.5);
                    ellipse(raf[i][0]+25,raf[i][1]-20,20*2);
                    ellipse(ex[i][0]-23,ex[i][1]-17,20*2)
                    textStyle(ITALIC);
                    noStroke(); fill(0); textSize(25);
                    text('R',raf[i][0]+11,raf[i][1]-13);
                    text('E',ex[i][0]-35,ex[i][1]-10);
                    textStyle(NORMAL); textSize(18);
                    text(i+1,raf[i][0]+28,raf[i][1]-8);
                    text(i+1,ex[i][0]-19,ex[i][1]-5);
                    pop();

                    push();
                    noStroke(); fill(255,100,51);
                    for(let j = i; j >= 0; j--){
                        rect(260+70*j,30,35,70);
                    }
                    pop();
                }
                push();
                fill(255,100,51); noStroke();
                ellipse(ex[i][0],ex[i][1],2*g.radius);
                pop();
            }

            push();
            textSize(25); noStroke();
            text(g.tieSlider+' equilibrium stages drawn',380,270);
            pop();

        } else {
            for(let i = 0; i < stages; i++){
                push();
                strokeWeight(2); stroke(255,100,51);
                line(ex[i][0],ex[i][1],raf[i][0],raf[i][1]);
                noStroke(); fill(0,100,190);
                ellipse(raf[i][0],raf[i][1],2*g.radius);
                fill(255,100,51);
                ellipse(ex[i][0],ex[i][1],2*g.radius);
                pop();

                push();
                noStroke(); fill(255,100,51);
                rect(260+70*i,30,35,70);
                pop();
            }
            push();
            textSize(25); 
            text(stages+' equilibrium stages drawn',380,270);
            pop();
        }
    }

    upperRightImage();

}

function arrow(base,tip,color,arrowLength,arrowWidth){ 

    // let arrowLength = 20; // Length of arrow
    // let arrowWidth = 5; // width of arrow (1/2)
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

function tieInfo(){
    let yLeft = [];
    let yRight = [];

    // Solving for the y-points on the tie lines
    for(let i = 0; i < tie.xLeft.length; i++){
        for(let j = 0; j < phaseInfo.length; j++){
            if(tie.xLeft[i] > phaseInfo[j][0] && tie.xLeft[i] < phaseInfo[j+1][0]){
                yLeft.push(interpolate(tie.xLeft[i],phaseInfo[j][0],phaseInfo[j+1][0],phaseInfo[j][1],phaseInfo[j+1][1]));
            } else if(tie.xLeft[i] == phaseInfo[j][0]){
                yLeft.push(phaseInfo[j][1]);
            }

            if(tie.xRight[i] > phaseInfo[j][0] && tie.xRight[i] < phaseInfo[j+1][0]){
                yRight.push(interpolate(tie.xRight[i],phaseInfo[j][0],phaseInfo[j+1][0],phaseInfo[j][1],phaseInfo[j+1][1]));
            } else if(tie.xRight[i] == phaseInfo[j][0]){
                yRight.push(phaseInfo[j][1]);
            } 
        }
    }

    let x1, x2, y1, y2;
    let b;
    for(let i = 0; i < tie.xLeft.length; i++){
        x1 = map(tie.xLeft[i],0,1,150,600);
        x2 = map(tie.xRight[i],0,1,150,600);
        y1 = map(yLeft[i],0,1,500,50);
        y2 = map(yRight[i],0,1,500,50);
        b = y1 - ((y2-y1)/(x2-x1))*x1;
        tie.b.push(b);
        tie.pos.push([x1,x2,y1,y2]);
        tie.m.push((y2-y1)/(x2-x1));
    }
}

function nextExtract(r,op){
    // Line from raffinate point to operating point
    // Find intersection of that line with phase envelope to get next extract point

    let x1, x2, y1, y2;
    let m1, b1, m2, b2;

    x1 = op[0]; y1 = op[1]; // operating point
    x2 = r[0]; y2 = r[1]; // last raffinate point

    m1 = (y2-y1)/(x2-x1);
    b1 = y1 - m1*x1;

    let yL, yU, yC, yUU;
    let xe, ye;

    for(let i = 0; i < 20; i++){
        yL = g.phaseInfopx[i][1];
        yU = g.phaseInfopx[i+1][1];
        yC = m1*g.phaseInfopx[i][0] + b1;
        yUU = g.phaseInfopx[i+2][1];

        if(yC <= yL && yC >= yU){
            m2 = (yL-yU)/(g.phaseInfopx[i][0]-g.phaseInfopx[i+1][0]);
            b2 = yL - m2*g.phaseInfopx[i][0];
            xe = (b2-b1)/(m1-m2);
            ye = m1*xe + b1;
        } else if (yC <= yU && yC > yUU){
            xe = g.phaseInfopx[i+1][0];
            ye = g.phaseInfopx[i+1][0];
        }
    }
    return([xe,ye]);
}

function nextRaffinate(e){
    let lx = 150; let rx = 600; // left and right edges of triangle
    let by = 500; let ty = 50; // top and bottom of triangle

    let yVals = new Array(7);
    for(let i = 0; i < tie.m.length; i++){
        yVals[i] = tie.m[i]*e[0] + tie.b[i];
    }

    let dY, dC, mx, xL, xR, yL, yR, bx;
    for(let i = 0; i < tie.m.length-1; i++){
        if(e[1] < yVals[i] && e[1] > yVals[i+1]){
            dY = yVals[i] - yVals[i+1];
            dC = yVals[i]-e[1];

            mx = tie.m[i]*(1-dC/dY) + tie.m[i+1]*(dC/dY);
            bx = e[1] - mx*e[0];

            xR = tie.pos[i][1]*(1-dC/dY) + tie.pos[i+1][1]*(dC/dY);
            yR = mx*xR + bx;
        } else if (e[1] < yVals[tie.m.length-1]){
            ratio = yVals[tie.m.length-1]/e[1];
            mx = tie.m[tie.m.length-1]*ratio;
            bx = e[1] - mx*e[0];
            xR = regionSevenCoords(mx,bx);
            yR = mx*xR + bx;
        } else if (e[1] == by){
            xR = map(.9,0,1,lx,rx);
            yR = by;
        }
    }
    return([xR,yR])
}


function regionSevenCoords(mx,bx){
    let xR, m, b, x;
    for(let i = 20; i < g.phaseInfopx.length-1; i++){
        m = (g.phaseInfopx[i+1][1]-g.phaseInfopx[i][1])/(g.phaseInfopx[i+1][0]-g.phaseInfopx[i][0]);
        b = g.phaseInfopx[i][1] - m*g.phaseInfopx[i][0];
        x = (bx-b)/(m-mx);

        if(x > g.phaseInfopx[i][0] && x < g.phaseInfopx[i+1][0]){
            xR = x;
        } else if (x == g.phaseInfopx[i][0]){
            xR = g.phaseInfopx[i][0];
        }
    }
    return(xR);
}


