
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
            line(g.lx+(g.rx-g.lx)/20*(i+1),g.by,g.lx+(g.rx-g.lx)/20*(i+1),g.by-7);
            line(g.lx+(g.rx-g.lx)/20*(i+1),g.ty,g.lx+(g.rx-g.lx)/20*(i+1),g.ty+7);
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
                line(g.lx,g.by-(g.by-g.ty)/20*(i+1),g.lx+7,g.by-(g.by-g.ty)/20*(i+1));
                line(g.rx,g.by-(g.by-g.ty)/20*(i+1),g.rx-7,g.by-(g.by-g.ty)/20*(i+1));
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
                line(g.lx,g.by-(g.by-g.ty)/36*(i+1),g.lx+7,g.by-(g.by-g.ty)/36*(i+1));
                line(g.rx,g.by-(g.by-g.ty)/36*(i+1),g.rx-7,g.by-(g.by-g.ty)/36*(i+1));
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
            line(g.lx+(g.rx-g.lx)/20*(i+1),g.by,g.lx+(g.rx-g.lx)/20*(i+1),g.by-7);
            line(g.lx+(g.rx-g.lx)/20*(i+1),g.ty,g.lx+(g.rx-g.lx)/20*(i+1),g.ty+7);
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
            line(g.lx1+(g.rx1-g.lx1)/20*(i+1),g.by,g.lx1+(g.rx1-g.lx1)/20*(i+1),g.by-7);
            line(g.lx1+(g.rx1-g.lx1)/20*(i+1),g.ty,g.lx1+(g.rx1-g.lx1)/20*(i+1),g.ty+7);
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
            line(g.lx,g.by-(g.by-g.ty)/20*(i+1),g.lx+7,g.by-(g.by-g.ty)/20*(i+1));
            line(g.rx,g.by-(g.by-g.ty)/20*(i+1),g.rx-7,g.by-(g.by-g.ty)/20*(i+1));
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
            line(g.lx1,g.by-(g.by-g.ty)/36*(i+1),g.lx1+7,g.by-(g.by-g.ty)/36*(i+1));
            line(g.rx1,g.by-(g.by-g.ty)/36*(i+1),g.rx1-7,g.by-(g.by-g.ty)/36*(i+1));
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


let Tx = [[0., 96.58], [0.05, 93.66], [0.1, 91.], [0.15, 88.56], [0.2, 86.31], [0.25, 84.22], [0.3, 82.28], [0.35, 80.47], [0.4, 78.77], [0.45, 77.17], [0.5, 75.66], [0.55, 74.23], [0.6, 72.88], [0.65, 71.6], [0.700, 70.38], [0.75, 69.21], [0.8, 68.1], [0.85, 67.03], [0.9, 66.01], [0.950, 65.03], [1., 64.09]];
let Ty = [[0., 96.58], [0.05, 95.57], [0.1, 94.52], [0.15, 93.45], [0.2, 92.33], [0.25, 91.17], [0.3, 89.97], [0.35, 88.72], [0.4, 87.42], [0.45, 86.06], [0.5, 84.64], [0.55, 83.14], [0.6, 81.56], [0.65, 79.89], [0.700, 78.12], [0.75, 76.23], [0.8, 74.21], [0.85, 72.02], [0.9, 69.63], [0.950, 67.01], [1., 64.09]];
let xyCurve = [[0., 0.], [0.05, 0.14], [0.1, 0.258], [0.15, 0.357], [0.2, 0.441], [0.25, 0.514], [0.3, 0.578], [0.35, 0.633], [0.4, 0.682], [0.45, 0.726], [0.5, 0.765], [0.55, 0.799], [0.6, 0.831], [0.65, 0.859], [0.700, 0.885], [0.75, 0.908], [0.8, 0.93], [0.85, 0.950], [0.9, 0.968], [0.950, 0.985], [1., 1.]]