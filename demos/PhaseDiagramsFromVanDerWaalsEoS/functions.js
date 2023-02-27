let xTicks = [];

function graphDraw(){
    push(); 
    rect(100,75,650,450);
    g.lx = 100; g.rx = 100 + 650;
    g.ty = 75; g.by = 75 + 450;

    let yLabelsP = ['0','5','10','15','20','25'];
    let yLabelsT = ['300','400','500','600','700'];
    let count = 0;


    // Y ticks for temperature and pressure
    textSize(20); fill(0);
    if(g.diagram == "P-V-diagram"){
        count++;
        for(let i = 0; i < 27; i++){
            if((i+1)%5 == 0){
                line(g.lx,g.by-(g.by-g.ty)/28*(i+1),g.lx+8,g.by-(g.by-g.ty)/28*(i+1));
                line(g.rx,g.by-(g.by-g.ty)/28*(i+1),g.rx-8,g.by-(g.by-g.ty)/28*(i+1));
                push();
                noStroke();
                if(count == 1){
                    text(yLabelsP[0],g.lx-14,g.by+6);
                    text(yLabelsP[1],g.lx-14,g.by-(g.by-g.ty)/28*(i+1)+7)
                } else {
                    text(yLabelsP[count],g.lx-25,g.by-(g.by-g.ty)/28*(i+1)+7);
                }
                count++;
                pop();
            } else {
                line(g.lx,g.by-(g.by-g.ty)/28*(i+1),g.lx+3,g.by-(g.by-g.ty)/28*(i+1));
                line(g.rx,g.by-(g.by-g.ty)/28*(i+1),g.rx-3,g.by-(g.by-g.ty)/28*(i+1));

            }
        }
        push();
        noStroke(); textSize(22);
        translate(50,height/2+70);
        rotate(radians(-90));
        text('Pressure (MPa)',0,0);
        pop();
    } else {
        for(let i = 0; i < 25; i++){
            if((i-1)%5 == 0){
                line(g.lx,g.by+10-(g.by+10-g.ty)/25*(i+1),g.lx+8,g.by+10-(g.by+10-g.ty)/25*(i+1));
                push();
                noStroke();
                text(yLabelsT[count],g.lx-35,g.by+10-(g.by+10-g.ty)/25*(i+1)+6);
                pop();
                count++;
            } else {
                line(g.lx,g.by+10-(g.by+10-g.ty)/25*(i+1),g.lx+3,g.by+10-(g.by+10-g.ty)/25*(i+1));
            }
        }
        push();
        noStroke(); textSize(22);
        translate(50,height/2+80);
        rotate(radians(-90));
        text('Temperature (K)',0,0);
        pop();
    }

    // Primary x-tick marks
    let xLabels = ['100','1000','10'];
    g.dx = 190;
    xTicks = [];
    for(let i = 0; i < 3; i++){
        let x = g.lx + g.dx*(i+1);
        xTicks.push(x);
        line(x,g.by,x,g.by-8);
    }
    push();
    noStroke();
    text(xLabels[0],xTicks[0]-18,g.by+22);
    text(xLabels[1],xTicks[1]-22,g.by+22);
    text(xLabels[2],xTicks[2]-12,g.by+22);
    textSize(15);
    text('4',xTicks[2]+10,g.by+13);
    pop();

    // Sub x-tick marks
    count = 0;
    labels = ['50','500','5000'];
    textSize(20);
    for(let i = 0; i < 24; i++){
        let pxStart;

        if(i < 8){
            pxStart = g.lx;
            let val = 10*(i+2);
            let x = pxStart + g.dx*(Math.log10(val)-1);
            if(i == 3){
                line(x,g.by,x,g.by-8);
                text(labels[count],x-12,g.by+22);
                count++;
            } else {
                line(x,g.by,x,g.by-3);
            }
        } else if (i < 16){
            pxStart = xTicks[0];
            let val = 100*(i-6);
            let x = pxStart + g.dx*(Math.log10(val)-2);
            if(i == 11){
                line(x,g.by,x,g.by-8);
                text(labels[count],x-16,g.by+22);
                count++;
            } else {
                line(x,g.by,x,g.by-3);
            }
        } else {
            pxStart = xTicks[1];
            let val = 1000*(i-14);
            let x = pxStart + g.dx*(Math.log10(val)-3);
            if(i == 19){
                line(x,g.by,x,g.by-8);
                text(labels[count],x-22,g.by+22);
            } else {
                line(x,g.by,x,g.by-3);
            }
        }
    }
    
    push();
    noStroke(); textSize(22);
    text('Volume (cm /mol)',width/2-60,g.by+60);
    textSize(17);
    text('3',width/2+54,g.by+50);
    pop();
    pop();

    push(); noFill(); strokeWeight(2);
    let x,y;
    if(g.diagram == "P-V-diagram"){
        beginShape();
        for(let i = 0; i < pvg.length; i++){
            y = map(pvg[i][1],0,28,g.by,g.ty);
            x = xPlotting(pvg[i][0]);
            vertex(x,y);
        }
        endShape();
        beginShape();
        for(let i = 0; i < pvl.length; i++){
            y = map(pvl[i][1],0,28,g.by,g.ty);
            x = xPlotting(pvl[i][0]);
            vertex(x,y);
        }
        endShape();
    } else {
        beginShape();
        for(let i = 0; i < tvg.length; i++){
            y = map(tvg[i][1],270,780,g.by,g.ty);
            x = xPlotting(tvg[i][0]);
            vertex(x,y);
        }
        endShape();
        beginShape();
        for(let i = 0; i < tvl.length; i++){
            y = map(tvl[i][1],270,780,g.by,g.ty);
            x = xPlotting(tvl[i][0]);
            vertex(x,y);
        }
        endShape();
    }
    pop();
}

// Used for plotting on the logarithmic scale
function xPlotting(x){
    let pxStart, output;

    if(x <= 100){
        pxStart = g.lx;
        output = pxStart + g.dx*(Math.log10(x)-1);
    } else if (x <= 1000){
        pxStart = xTicks[0];
        output = pxStart + g.dx*(Math.log10(x)-2);
    } else if (x <= 10000){
        pxStart = xTicks[1];
        output = pxStart + g.dx*(Math.log10(x)-3);
    } else {
        pxStart = xTicks[2];
        output = pxStart + g.dx*(Math.log10(x)-4);
    }

    return(output);
}

// Fills in values for Vc, a, b
function fillConstants(){
    g.a = (27/64)*((g.R**2)*(g.Tc**2))/g.Pc
    g.b = (g.R*g.Tc)/(8*g.Pc);
    g.Vc = 0.359*(g.R*g.Tc)/g.Pc;
}