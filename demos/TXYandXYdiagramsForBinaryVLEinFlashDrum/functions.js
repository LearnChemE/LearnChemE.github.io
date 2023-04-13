
function singleGraph(){
    g.lx = 100; g.rx = 100+550;
    push();
    fill(250);
    rect(100,50,550,400);
    pop();

    // x-labels are the same for both graphs
    let xLabels = ['0.0','0.2','0.4','0.6','0.8','1.0'];
    for(let i = 0; i < 20; i++){
        if((i+1)%4 == 0){
            if(i != 19){
                line(g.lx+(g.rx-g.lx)/20*(i+1),g.by,g.lx+(g.rx-g.lx)/20*(i+1),g.by-7);
                line(g.lx+(g.rx-g.lx)/20*(i+1),g.ty,g.lx+(g.rx-g.lx)/20*(i+1),g.ty+7);
            }
            push();
            noStroke(); textSize(18); 
            text(xLabels[(i+1)/4],g.lx+(g.rx-g.lx)/20*(i+1)-12,g.by+18)
            pop();
            if(i == 15){
                push();
                noStroke(); textSize(18);
                text('0.0',g.lx-10,g.by+18);
                pop();
            }
        } else {
            line(g.lx+(g.rx-g.lx)/20*(i+1),g.by,g.lx+(g.rx-g.lx)/20*(i+1),g.by-4);
            line(g.lx+(g.rx-g.lx)/20*(i+1),g.ty,g.lx+(g.rx-g.lx)/20*(i+1),g.ty+4);
        }
    }
    let yLabels = ['65','70','75','80','85','90','95','100'];
    // y-labels change
    if(g.diagram == "x-y"){
        for(let i = 0; i < 20; i++){
            if((i+1)%4 == 0){
                if(i != 19){
                    line(g.lx,g.by-(g.by-g.ty)/20*(i+1),g.lx+7,g.by-(g.by-g.ty)/20*(i+1));
                    line(g.rx,g.by-(g.by-g.ty)/20*(i+1),g.rx-7,g.by-(g.by-g.ty)/20*(i+1));
                }
                push();
                noStroke(); textSize(18);
                text(xLabels[(i+1)/4],g.lx-30,g.by-(g.by-g.ty)/20*(i+1)+7);
                if(i == 15){
                    text('0.0',g.lx-30,g.by+5);
                }
                pop();
            } else {
                line(g.lx,g.by-(g.by-g.ty)/20*(i+1),g.lx+4,g.by-(g.by-g.ty)/20*(i+1));
                line(g.rx,g.by-(g.by-g.ty)/20*(i+1),g.rx-4,g.by-(g.by-g.ty)/20*(i+1));
            }
        }

        push();
        noStroke(); textSize(20);
        text('liquid mole fraction methanol',width/2-120,g.by+50);
        textStyle(ITALIC);
        text('x',width/2+141,g.by+50);
        textStyle(NORMAL); textSize(16);
        text('m',width/2+151,g.by+54);
        pop();
        push();
        translate(50,height/2+130);
        rotate(radians(-90));
        noStroke(); textSize(20);
        text('vapor mole fraction methanol',0,0);
        textStyle(ITALIC);
        text('y',266,0);
        textSize(16); textStyle(NORMAL);
        text('m',276,4);
        pop();
    } else {
        for(let i = 0; i < 36; i++){
            if(i%5 == 0){
                if(i != 35){
                    line(g.lx,g.by-(g.by-g.ty)/36*(i+1),g.lx+7,g.by-(g.by-g.ty)/36*(i+1));
                    line(g.rx,g.by-(g.by-g.ty)/36*(i+1),g.rx-7,g.by-(g.by-g.ty)/36*(i+1));
                }
                push();
                noStroke(); textSize(18);
                if(i != 35){
                    text(yLabels[i/5],g.lx-25,g.by-(g.by-g.ty)/36*(i+1)+6);
                } else {
                    text(yLabels[i/5],g.lx-34,g.by-(g.by-g.ty)/36*(i+1)+6);
                }
                
                pop();
            } else {
                line(g.lx,g.by-(g.by-g.ty)/36*(i+1),g.lx+4,g.by-(g.by-g.ty)/36*(i+1));
                line(g.rx,g.by-(g.by-g.ty)/36*(i+1),g.rx-4,g.by-(g.by-g.ty)/36*(i+1));
            }
        }
        push();
        textSize(20); noStroke();
        text('mole fraction  methanol',width/2-80,g.by+50);
        translate(50,height/2+58);
        rotate(radians(-90));
        text('temperature (°C)',0,0);
        pop();
    }
}

function doubleGraph(){
    g.rx = 325; 
    push();
    fill(250);
    rect(g.lx,g.ty,225,400);
    rect(g.lx1,g.ty,225,400);
    pop();

    let xLabels = ['0.0','0.2','0.4','0.6','0.8','1.0'];
    let yLabels = ['65','70','75','80','85','90','95','100'];

    // left graph x
    for(let i = 0; i < 20; i++){
        if((i+1)%4 == 0){
            if(i != 19){
                line(g.lx+(g.rx-g.lx)/20*(i+1),g.by,g.lx+(g.rx-g.lx)/20*(i+1),g.by-7);
                line(g.lx+(g.rx-g.lx)/20*(i+1),g.ty,g.lx+(g.rx-g.lx)/20*(i+1),g.ty+7);
            }
            push();
            noStroke(); textSize(16); 
            text(xLabels[(i+1)/4],g.lx+(g.rx-g.lx)/20*(i+1)-12,g.by+18)
            pop();
            if(i == 15){
                push();
                noStroke(); textSize(16);
                text('0.0',g.lx-12,g.by+18);
                pop();
            }
        } else {
            line(g.lx+(g.rx-g.lx)/20*(i+1),g.by,g.lx+(g.rx-g.lx)/20*(i+1),g.by-4);
            line(g.lx+(g.rx-g.lx)/20*(i+1),g.ty,g.lx+(g.rx-g.lx)/20*(i+1),g.ty+4);
        }
    }

    // right graph x
    for(let i = 0; i < 20; i++){
        if((i+1)%4 == 0){
            if(i != 19){
                line(g.lx1+(g.rx1-g.lx1)/20*(i+1),g.by,g.lx1+(g.rx1-g.lx1)/20*(i+1),g.by-7);
                line(g.lx1+(g.rx1-g.lx1)/20*(i+1),g.ty,g.lx1+(g.rx1-g.lx1)/20*(i+1),g.ty+7);
            }
            push();
            noStroke(); textSize(16); 
            text(xLabels[(i+1)/4],g.lx1+(g.rx1-g.lx1)/20*(i+1)-12,g.by+18)
            pop();
            if(i == 15){
                push();
                noStroke(); textSize(16);
                text('0.0',g.lx1-12,g.by+18);
                pop();
            }
        } else {
            line(g.lx1+(g.rx1-g.lx1)/20*(i+1),g.by,g.lx1+(g.rx1-g.lx1)/20*(i+1),g.by-4);
            line(g.lx1+(g.rx1-g.lx1)/20*(i+1),g.ty,g.lx1+(g.rx1-g.lx1)/20*(i+1),g.ty+4);
        }
    }

    // left graph y
    for(let i = 0; i < 20; i++){
        if((i+1)%4 == 0){
            if(i != 19){
                line(g.lx,g.by-(g.by-g.ty)/20*(i+1),g.lx+7,g.by-(g.by-g.ty)/20*(i+1));
                line(g.rx,g.by-(g.by-g.ty)/20*(i+1),g.rx-7,g.by-(g.by-g.ty)/20*(i+1));
            }
            push();
            noStroke(); textSize(16);
            text(xLabels[(i+1)/4],g.lx-27,g.by-(g.by-g.ty)/20*(i+1)+6);
            if(i == 15){
                text('0.0',g.lx-28,g.by+4);
            }
            pop();
        } else {
            line(g.lx,g.by-(g.by-g.ty)/20*(i+1),g.lx+4,g.by-(g.by-g.ty)/20*(i+1));
            line(g.rx,g.by-(g.by-g.ty)/20*(i+1),g.rx-4,g.by-(g.by-g.ty)/20*(i+1));
        }
    }

    // right graph y
    for(let i = 0; i < 36; i++){
        if(i%5 == 0){
            if(i != 35){
                line(g.lx1,g.by-(g.by-g.ty)/36*(i+1),g.lx1+7,g.by-(g.by-g.ty)/36*(i+1));
                line(g.rx1,g.by-(g.by-g.ty)/36*(i+1),g.rx1-7,g.by-(g.by-g.ty)/36*(i+1));
            }
            push();
            noStroke(); textSize(16);
            if(i != 35){
                text(yLabels[i/5],g.lx1-22,g.by-(g.by-g.ty)/36*(i+1)+6);
            } else {
                text(yLabels[i/5],g.lx1-31,g.by-(g.by-g.ty)/36*(i+1)+6);
            }
            
            pop();
        } else {
            line(g.lx1,g.by-(g.by-g.ty)/36*(i+1),g.lx1+4,g.by-(g.by-g.ty)/36*(i+1));
            line(g.rx1,g.by-(g.by-g.ty)/36*(i+1),g.rx1-4,g.by-(g.by-g.ty)/36*(i+1));
        }
    }

    // Graph axes labels
    push();
    textSize(16);
    text('mole fraction methanol',g.lx1+35,g.by+50);
    text('liquid mole fraction methanol',g.lx,g.by+50);
    textStyle(ITALIC);
    text('x',g.lx+208,g.by+50);
    textStyle(NORMAL); textSize(12);
    text('m',g.lx+217,g.by+53);
    pop();
    push();
    textSize(17); noStroke();
    translate(50,height/2+58);
    rotate(radians(-90));
    text('vapor mole fraction methanol',-50,0);
    textStyle(ITALIC);
    text('y',178,0);
    textSize(13); textStyle(NORMAL);
    text('m',185,4);
    textSize(17);
    text('temperature (°C)',10,330);
    pop();
}

function curveDraw(){
    if(g.diagram == 'x-y'){
        push();
        noFill(); strokeWeight(2);
        beginShape();
        for(let i = 0; i < xyCurve.length; i++){
            vertex(map(xyCurve[i][0],0,1,g.lx,g.rx),map(xyCurve[i][1],0,1,g.by,g.ty));
        }
        endShape();
        line(g.lx,g.by,g.rx,g.ty);
        pop();
    } else if (g.diagram == 'T-x-y'){
        push();
        noFill(); strokeWeight(2); stroke(g.blue);
        beginShape();
        for(let i = 0; i < Tx.length; i++){
            vertex(map(Tx[i][0],0,1,g.lx,g.rx),map(Tx[i][1],64,100,g.by,g.ty))
        }
        endShape();
        stroke(g.green);
        beginShape();
        for(let i = 0; i < Ty.length; i++){
            vertex(map(Ty[i][0],0,1,g.lx,g.rx),map(Ty[i][1],64,100,g.by,g.ty));
        }
        endShape();
        pop();
    } else if (g.diagram == 'both'){
        push();
        noFill(); strokeWeight(2); stroke(g.blue);
        beginShape();
        for(let i = 0; i < Tx.length; i++){
            vertex(map(Tx[i][0],0,1,g.lx1,g.rx1),map(Tx[i][1],64,100,g.by,g.ty));
        }
        endShape();
        stroke(g.green);
        beginShape();
        for(let i = 0; i < Ty.length; i++){
            vertex(map(Ty[i][0],0,1,g.lx1,g.rx1),map(Ty[i][1],64,100,g.by,g.ty));
        }
        endShape();
        stroke(0);
        beginShape();
        for(let i = 0; i < xyCurve.length; i++){
            vertex(map(xyCurve[i][0],0,1,g.lx,g.rx),map(xyCurve[i][1],0,1,g.by,g.ty));
        }
        endShape();
        line(g.lx,g.by,g.rx,g.ty);
        pop();
    }
}

function mathSolve(){
    // Solving xm and ym for x-y
    // Line info
    let m = (g.ty - g.by)/(g.rx - g.lx);
    let b = g.by - g.lx*m;

    let zm_xpx = map(g.x,0,1,g.lx,g.rx);
    let zm_ypx = m*zm_xpx + b;


    // Solving for intercept line slope
    let test_x = zm_xpx - .1*(g.rx-g.lx);
    let test_y = zm_ypx - g.ratio*.1*(g.rx-g.lx);

    let m_test = (test_y - zm_ypx)/(test_x - zm_xpx);
    let b_test = zm_ypx - m_test*zm_xpx;

    let sol = intersectionSolve(m_test,b_test);


    let xm = map(sol[0],g.lx,g.rx,0,1);
    let ym = map(sol[1],g.by,g.ty,0,1);
    
    // Drawing lines for x-y diagram
    if(g.diagram == 'x-y' || g.diagram == 'both'){
        push();
        strokeWeight(2); drawingContext.setLineDash([5,5]);
        stroke(g.green);
        line(g.lx,sol[1],sol[0],sol[1]);
        stroke(g.blue);
        line(sol[0],sol[1],sol[0],g.by);
        stroke(g.mag);
        line(sol[0],sol[1],zm_xpx,zm_ypx);
        line(zm_xpx,zm_ypx,zm_xpx,g.by);
        noStroke(); fill(g.mag);
        ellipse(sol[0],sol[1],11);
        pop();
    }

    // Solving temperature values
    let T = temperatureSolve(xm,ym);
    
    let y = map(T,64,100,g.by,g.ty);
    let xL, xR;

    if(g.diagram == "T-x-y"){
        xL = map(xm,0,1,g.lx,g.rx);
        xR = map(ym,0,1,g.lx,g.rx);
    } else {
        xL = map(xm,0,1,g.lx1,g.rx1);
        xR = map(ym,0,1,g.lx1,g.rx1);
    }

    let w, V, vSeg;

    if(g.diagram == 'T-x-y' || g.diagram == 'both'){
        push();
        strokeWeight(1.5); drawingContext.setLineDash([2,5]); stroke(g.blue);
        line(xL,g.by,xL,y);
        stroke(g.green);
        line(xR,g.by,xR,y);
        pop();

        w = xR-xL;
        V = g.ratio + 1;
        vSeg = w/V;
        push();
        strokeWeight(2); drawingContext.setLineDash([5,5]); stroke(g.green);
        line(xL,y,xL+vSeg,y);
        stroke(g.blue);
        line(xL+vSeg,y,xR,y);
        noStroke(); fill(g.mag);
        ellipse(xL+vSeg,y,11);
        pop();

    }

    if(g.diagram == 'x-y'){
        xyLabels();
    } else if (g.diagram == 'T-x-y'){
        TxyLabels();
    } else {
        bothLabels();
    }

    function xyLabels(){
        let tempx = (sol[0] + zm_xpx)/2; 
        let tempy = m_test*tempx + b_test;
        push();
        noStroke(); fill(250);
        rect(tempx+15,tempy-36,145,20);
        textSize(18); fill(0);
        text('slope = ',tempx+20,tempy-20);
        textStyle(ITALIC);
        text(' -L / V = ',tempx+80,tempy-20);
        textStyle(NORMAL); 
        text(g.ratio,tempx+147,tempy-20);
        pop();
        push();
        noStroke(); fill(250);
        rect(sol[0]-10,g.by-43,25,17);
        rect(zm_xpx-10,g.by-42,25,17);
        rect(g.lx+19,sol[1]-8,22,17);
        textStyle(ITALIC); textStyle(ITALIC); textSize(18); fill(g.blue);
        text('x',sol[0]-8,g.by-30);
        fill(g.green);
        text('y',g.lx+20,sol[1]+3)
        fill(g.mag);
        text('z',zm_xpx-8,g.by-30);
        textSize(15); textStyle(NORMAL);
        text('m',zm_xpx+1,g.by-28);
        fill(g.blue);
        text('m',sol[0]+1,g.by-28);
        fill(g.green);
        text('m',g.lx+27,sol[1]+7);
        pop();
        push();
        noStroke(); fill(250);
        rect(sol[0]-47,sol[1]-31,92,20)
        textSize(18); textStyle(ITALIC); fill(0);
        text('T',sol[0]-45,sol[1]-15);
        textStyle(NORMAL);
        text('= '+T.toFixed(1)+'°C',sol[0]-28,sol[1]-15);
        pop();

        let q = g.ratio/(g.ratio + 1);
        let Vamt = 100*(1-q);
        let Lamt = 100*q;
        console.log(Vamt,Lamt);

        // Lower right image
        push();
        fill(250); noStroke();
        rect(g.rx-241,g.by-165,100,40);
        pop();
        push();
        fill(150); strokeWeight(1.5);
        rect(g.rx-130,g.by-170,70,100);
        strokeWeight(2);
        line(g.rx-95,g.by-170,g.rx-95,g.by-185);
        line(g.rx-95,g.by-185,g.rx-50,g.by-185);
        arrow([g.rx-95,g.by-185],[g.rx-45,g.by-185],0,10,4);
        line(g.rx-95,g.by-70,g.rx-95,g.by-55);
        line(g.rx-95,g.by-55,g.rx-50,g.by-55);
        arrow([g.rx-95,g.by-55],[g.rx-45,g.by-55],0,10,4);
        line(g.rx-180,g.by-120,g.rx-135,g.by-120);
        arrow([g.rx-160,g.by-120],[g.rx-130,g.by-120],0,10,4);
        pop();

        push();
        noStroke(); textSize(15);
        text('= 100 mol/s',g.rx-220,g.by-150);
        text('= '+g.x.toFixed(2),g.rx-220,g.by-130);

        text('= '+ym.toFixed(2),g.rx-100,g.by-200);
        text('= '+Vamt.toFixed(1)+' mol/s',g.rx-100,g.by-220);
        text('= '+Lamt.toFixed(1)+' mol/s',g.rx-100,g.by-35);
        text('= '+xm.toFixed(2),g.rx-100,g.by-15);

        textStyle(ITALIC);
        text('F',g.rx-235,g.by-150);
        text('V',g.rx-115,g.by-220);
        text('L',g.rx-114,g.by-35);
        text('z',g.rx-239,g.by-130);
        text('y',g.rx-120,g.by-200);
        text('x',g.rx-120,g.by-15);

        textStyle(NORMAL); textSize(13);
        text('m',g.rx-232,g.by-127);
        text('m',g.rx-113,g.by-198);
        text('m',g.rx-112,g.by-12);
        pop();
    }

    function TxyLabels(){
        // Phase envelope lines
        push();
        stroke(g.green); strokeWeight(1.5);
        line(xL,y-10,xL,y-25);
        line(xL+vSeg,y-10,xL+vSeg,y-25);
        line(xL,y-17.5,xL+vSeg,y-17.5);
        stroke(g.blue);
        line(xL+vSeg,y-10,xL+vSeg,y-25);
        line(xR,y-10,xR,y-25);
        line(xL+vSeg,y-17.5,xR,y-17.5);
        // Phase envelope labels for L and V
        noStroke(); 
        fill(250); rect(xL+vSeg+(xR-(xL+vSeg))/2-5,y-45,12,18);
        fill(g.blue); textStyle(ITALIC); textSize(18);
        text('L',xL+vSeg + (xR-(xL+vSeg))/2 - 4,y-30);
        fill(250); rect(xL+(xL+vSeg-xL)/2-6,y-45,12,18);
        fill(g.green);
        text('V',xL+(xL+vSeg-xL)/2-5,y-30);
        pop();

        // xm, ym, and zm labels
        push();
        noStroke(); fill(250);
        rect(xL-10,g.by-43,25,17);
        rect(xR-10,g.by-42,25,17);
        rect(xL+vSeg-10,y+6,25,17);
        textStyle(ITALIC); textStyle(ITALIC); textSize(18); fill(g.blue);
        text('x',xL-8,g.by-30);
        fill(g.mag);
        text('z',xL+vSeg-8,y+19);
        fill(g.green);
        text('y',xR-8,g.by-30);
        textSize(15); textStyle(NORMAL);
        text('m',xR+1,g.by-28);
        fill(g.blue);
        text('m',xL+1,g.by-28);
        fill(g.mag);
        text('m',xL+vSeg+1,y+21);
        pop();

        // Upper right equation
        push();
        line(g.rx-155,g.ty+36,g.rx-133,g.ty+36);
        line(g.rx-115,g.ty+36,g.rx-30,g.ty+36);
        textSize(20); textStyle(ITALIC); noStroke();
        text('L',g.rx-150,g.ty+30);
        text('V',g.rx-152,g.ty+55);
        text('=',g.rx-130,g.ty+43);
        text('y',g.rx-105,g.ty+30);
        text('z',g.rx-105,g.ty+53);
        text('- z',g.rx-77,g.ty+30);
        text('- x',g.rx-77,g.ty+53);

        textStyle(NORMAL); textSize(16);
        text('m',g.rx-95,g.ty+33);
        text('m',g.rx-54,g.ty+33);
        text('m',g.rx-95,g.ty+56);
        text('m',g.rx-54,g.ty+56);
        pop();



    }

    function bothLabels(){
        push();
        stroke(g.green); strokeWeight(1.5);
        line(xL,y-10,xL,y-25);
        line(xL+vSeg,y-10,xL+vSeg,y-25);
        line(xL,y-17.5,xL+vSeg,y-17.5);
        stroke(g.blue);
        line(xL+vSeg,y-10,xL+vSeg,y-25);
        line(xR,y-10,xR,y-25);
        line(xL+vSeg,y-17.5,xR,y-17.5);
        noStroke(); fill(g.blue); textStyle(ITALIC); textSize(15);
        pop();

        let tempx = (sol[0] + zm_xpx)/2; 
        let tempy = m_test*tempx + b_test;
       
        push();
        noStroke(); fill(250);
        rect(sol[0]-10,g.by-33,25,17);
        rect(zm_xpx-10,g.by-52,25,17);
        rect(g.lx+9,sol[1]-8,22,17);
        textStyle(ITALIC); textStyle(ITALIC); textSize(18); fill(g.blue);
        text('x',sol[0]-8,g.by-20);
        fill(g.green);
        text('y',g.lx+10,sol[1]+3)
        fill(g.mag);
        text('z',zm_xpx-8,g.by-40);
        textSize(15); textStyle(NORMAL);
        text('m',zm_xpx+1,g.by-38);
        fill(g.blue);
        text('m',sol[0]+1,g.by-18);
        fill(g.green);
        text('m',g.lx+17,sol[1]+7);
        pop();
        push();
        noStroke(); fill(250);
        rect(sol[0]-47,sol[1]-31,92,20)
        textSize(18); textStyle(ITALIC); fill(0);
        text('T',sol[0]-45,sol[1]-15);
        textStyle(NORMAL);
        text('= '+T.toFixed(1)+'°C',sol[0]-28,sol[1]-15);
        pop();

        push();
        noStroke(); fill(250);
        rect(xL-10,g.by-43,25,17);
        rect(xR-10,g.by-42,25,17);
        rect(xL+vSeg-10,y+6,25,17);
        textStyle(ITALIC); textStyle(ITALIC); textSize(18); fill(g.blue);
        text('x',xL-8,g.by-30);
        fill(g.mag);
        text('z',xL+vSeg-8,y+19);
        fill(g.green);
        text('y',xR-8,g.by-30);
        textSize(15); textStyle(NORMAL);
        text('m',xR+1,g.by-28);
        fill(g.blue);
        text('m',xL+1,g.by-28);
        fill(g.mag);
        text('m',xL+vSeg+1,y+21);
        pop();
        
        push();
        noStroke(); 
        fill(250); rect(xL+vSeg+(xR-(xL+vSeg))/2-5,y-45,12,18);
        fill(g.blue); textStyle(ITALIC); textSize(18);
        text('L',xL+vSeg + (xR-(xL+vSeg))/2 - 4,y-30);
        fill(250); rect(xL+(xL+vSeg-xL)/2-6,y-45,12,18);
        fill(g.green);
        text('V',xL+(xL+vSeg-xL)/2-5,y-30);
        pop();

        // Upper right equation
        push();
        line(g.rx1-155,g.ty+36,g.rx1-133,g.ty+36);
        line(g.rx1-115,g.ty+36,g.rx1-30,g.ty+36);
        textSize(20); textStyle(ITALIC); noStroke();
        text('L',g.rx1-150,g.ty+30);
        text('V',g.rx1-152,g.ty+55);
        text('=',g.rx1-130,g.ty+43);
        text('y',g.rx1-105,g.ty+30);
        text('z',g.rx1-105,g.ty+53);
        text('- z',g.rx1-77,g.ty+30);
        text('- x',g.rx1-77,g.ty+53);

        textStyle(NORMAL); textSize(16);
        text('m',g.rx1-95,g.ty+33);
        text('m',g.rx1-54,g.ty+33);
        text('m',g.rx1-95,g.ty+56);
        text('m',g.rx1-54,g.ty+56);
        pop();
    }


    


}

function intersectionSolve(mt,bt){
    let x1, y1, x2, y2;
    let m, b, xsol, ysol;
    for(let i = 0; i < xyCurve.length-1; i++){
        x1 = map(xyCurve[i][0],0,1,g.lx,g.rx);
        x2 = map(xyCurve[i+1][0],0,1,g.lx,g.rx);
        y1 = map(xyCurve[i][1],0,1,g.by,g.ty);
        y2 = map(xyCurve[i+1][1],0,1,g.by,g.ty);
        m = (y2 - y1)/(x2 - x1);
        b = y2 - m*x2;

        xsol = (b - bt)/(mt - m);
        if(xsol > x1 && xsol < x2){
            ysol = mt*xsol + bt;
            break;
        }
    }
    return([xsol,ysol]);
}

function temperatureSolve(x,y){
    let T;
    for(let i = 0; i < Tx.length-1; i++){
        if(x >= Tx[i][0] && x < Tx[i+1][0]){
            m = (Tx[i+1][1] - Tx[i][1])/(Tx[i+1][0] - Tx[i][0]);
            b = Tx[i][1] - m*Tx[i][0];
            T = m*x + b;
            break;
        }
    }
    return(T);
}

// For creating arrows
function arrow(base,tip,color,arrowLength,arrowWidth){ 
    // base = [x,y] tip = [x,y]

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
    stroke(color); fill(color); strokeWeight(1);
    triangle(vert[0],vert[1],vert[2],vert[3],vert[4],vert[5]);
    pop();

}


let Tx = [[0., 96.58], [0.05, 93.66], [0.1, 91.], [0.15, 88.56], [0.2, 86.31], [0.25, 84.22], [0.3, 82.28], [0.35, 80.47], [0.4, 78.77], [0.45, 77.17], [0.5, 75.66], [0.55, 74.23], [0.6, 72.88], [0.65, 71.6], [0.700, 70.38], [0.75, 69.21], [0.8, 68.1], [0.85, 67.03], [0.9, 66.01], [0.950, 65.03], [1., 64.09]];
let Ty = [[0., 96.58], [0.05, 95.57], [0.1, 94.52], [0.15, 93.45], [0.2, 92.33], [0.25, 91.17], [0.3, 89.97], [0.35, 88.72], [0.4, 87.42], [0.45, 86.06], [0.5, 84.64], [0.55, 83.14], [0.6, 81.56], [0.65, 79.89], [0.700, 78.12], [0.75, 76.23], [0.8, 74.21], [0.85, 72.02], [0.9, 69.63], [0.950, 67.01], [1., 64.09]];
let xyCurve = [[0., 0.], [0.05, 0.14], [0.1, 0.258], [0.15, 0.357], [0.2, 0.441], [0.25, 0.514], [0.3, 0.578], [0.35, 0.633], [0.4, 0.682], [0.45, 0.726], [0.5, 0.765], [0.55, 0.799], [0.6, 0.831], [0.65, 0.859], [0.700, 0.885], [0.75, 0.908], [0.8, 0.93], [0.85, 0.950], [0.9, 0.968], [0.950, 0.985], [1., 1.]]