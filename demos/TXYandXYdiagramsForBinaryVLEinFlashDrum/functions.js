
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
}