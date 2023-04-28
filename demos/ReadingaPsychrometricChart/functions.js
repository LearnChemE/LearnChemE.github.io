
function frameDraw(){
    push(); fill(250);
    rect(g.lx,g.ty,g.rx-g.lx,g.by-g.ty);
    pop();

    // x-labels and ticks
    let xLabels = [-10,-5,0,5,10,15,20,25,30,35,40,45,50,55];
    let count = Math.round(65/5);
    for(let i = 0; i < count+1; i++){
        if(i > 0 && i < count){
            line(g.lx+(g.rx-g.lx)/count*i,g.by,g.lx+(g.rx-g.lx)/count*i,g.by-6);
        }
        
        push();
        noStroke(); textSize(19);
        if(xLabels[i] == 0 || xLabels[i] == 5){
            text(xLabels[i],g.lx+(g.rx-g.lx)/count*i-4,g.by+20);
        } else if(xLabels[i] == -10){
            text(xLabels[i],g.lx-15,g.by+20);
        } else {
            text(xLabels[i],g.lx+(g.rx-g.lx)/count*i-8,g.by+20);
        }
        pop();
    }
    push();
    noStroke(); textSize(22);
    text('temperature (°C)',230,510);
    pop();

    // y-labels and ticks
    let yLabels = [0,0.005,0.010,0.015,0.020,0.025,.030];
    count = 33;
    let ticks = 5;
    for(let i = 0; i < count; i++){
        if(i > 0 && i%ticks == 0){
            line(g.rx,g.by-(g.by-g.ty)/count*i,g.rx-6,g.by-(g.by-g.ty)/count*i);
            push();
            noStroke(); textSize(19);
            text(yLabels[i/ticks].toFixed(3),g.rx+5,g.by-(g.by-g.ty)/count*i+7);
            if(i == 5){
                text(yLabels[0].toFixed(3),g.rx+5,g.by+3);
            }
            pop();
        } else if (i!=0) {
            line(g.rx,g.by-(g.by-g.ty)/count*i,g.rx-3,g.by-(g.by-g.ty)/count*i);
        }
    }
    push();
    noStroke(); textSize(22);
    translate(g.rx+90,410);
    rotate(radians(-90));
    text('moisture content (kg/kg dry air)',0,0);
    pop();

    // Relative humidity lines are always displayed
    push();
    noFill(); stroke(g.green[0],g.green[1],g.green[2],150);
    for(let i = 1; i <= 10; i++){
        if(i == 10){
            stroke(g.green); strokeWeight(2);
        }
        beginShape();
        for(let j = -10; j <= 55; j++){
            let x = j;
            let y = phiOmega(i/10,j);
            vertex(map(x,-10,55,g.lx,g.rx),map(y,0,.033,g.by,g.ty));
        }
        endShape();
    }
    fill(250); noStroke();
    rect(g.lx,0,g.rx-g.lx,g.ty-1);
    pop();
}

function relHumDisplay(){
    let a = radians(-45);
    push();
    noStroke(); fill(g.green); textSize(19);

    push();
    translate(g.rx-160,g.by-43); rotate(a);
    push();
    fill(250); 
    rect(-3,-15,42,17);
    pop();
    text('10%',0,0);
    pop();
    push();
    translate(g.rx-166,g.by-98); rotate(a);
    push();
    fill(250); 
    rect(-3,-15,42,17);
    pop();
    text('20%',0,0);
    pop();
    push();
    translate(g.rx-172,g.by-150); rotate(a);
    push();
    fill(250); 
    rect(-3,-15,42,17);
    pop();
    text('30%',0,0);
    pop();
    push();
    translate(g.rx-178,g.by-195); rotate(a);
    push();
    fill(250); 
    rect(-3,-15,42,17);
    pop();
    text('40%',0,0);
    pop();
    push();
    translate(g.rx-184,g.ty+192); rotate(a);
    push();
    fill(250); 
    rect(-3,-15,42,17);
    pop();
    text('50%',0,0);
    pop();
    push();
    translate(g.rx-190,g.ty+150); rotate(a);
    push();
    fill(250); 
    rect(-3,-15,42,17);
    pop();
    text('60%',0,0);
    pop();
    push();
    translate(g.rx-196,g.ty+112); rotate(a);
    push();
    fill(250); 
    rect(-3,-15,42,17);
    pop();
    text('70%',0,0);
    pop();
    push();
    translate(g.rx-202,g.ty+80); rotate(a);
    push();
    fill(250); 
    rect(-3,-15,42,17);
    pop();
    text('80%',0,0);
    pop();
    push();
    translate(g.rx-208,g.ty+45); rotate(a);
    push();
    fill(250); 
    rect(-3,-15,42,17);
    pop();
    text('90%',0,0);
    pop();
    textSize(22);
    translate(385,170); rotate(radians(-63));
    text('saturation line',0,0);
    pop();
}

function enthalpDisplay(){
    push();
    noFill(); strokeWeight(2); beginShape();
    for(let i = -10; i <= 55; i++){
        vertex(map(i,-10,55,g.lx,g.rx),map(hOmega(50,i),0,.033,g.by,g.ty));
    }
    endShape();
    pop();
}

function Psat(T){
    return(10**(4.6543 - 1435.264/(T+208.152)));
}

// Relative humidity curves
function phiOmega(phi,T){
    return((1/g.MW)*phi*Psat(T)/g.P)
}

function hOmega(T,T1){
    return((-4)**(-4)*(T-T1))
}