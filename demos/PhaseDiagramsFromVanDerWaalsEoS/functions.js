let xTicks = [];

function graphDraw(){
    push();
    rect(100,75,650,450);
    g.lx = 100; g.rx = 100 + 650;
    g.ty = 75; g.by = 75 + 450;

    // Y ticks for temperature and pressure
    textSize(20); fill(0);
    if(g.diagram == "P-V-diagram"){
        for(let i = 0; i < 27; i++){
            if((i+1)%5 == 0){
                line(g.lx,g.by-(g.by-g.ty)/28*(i+1),g.lx+8,g.by-(g.by-g.ty)/28*(i+1));
                line(g.rx,g.by-(g.by-g.ty)/28*(i+1),g.rx-8,g.by-(g.by-g.ty)/28*(i+1));
            } else {
                line(g.lx,g.by-(g.by-g.ty)/28*(i+1),g.lx+3,g.by-(g.by-g.ty)/28*(i+1));
                line(g.rx,g.by-(g.by-g.ty)/28*(i+1),g.rx-3,g.by-(g.by-g.ty)/28*(i+1));
            }
        }
        
    } else {
        for(let i = 0; i < 25; i++){
            if((i-1)%5 == 0){
                line(g.lx,g.by+10-(g.by+10-g.ty)/25*(i+1),g.lx+8,g.by+10-(g.by+10-g.ty)/25*(i+1));
                line(g.rx,g.by+10-(g.by+10-g.ty)/25*(i+1),g.rx-8,g.by+10-(g.by+10-g.ty)/25*(i+1));
            } else {
                line(g.lx,g.by+10-(g.by+10-g.ty)/25*(i+1),g.lx+3,g.by+10-(g.by+10-g.ty)/25*(i+1));
                line(g.rx,g.by+10-(g.by+10-g.ty)/25*(i+1),g.rx-3,g.by+10-(g.by+10-g.ty)/25*(i+1));
            }
        }
       
    }

    // Primary x-tick marks
    xTicks = [];
    for(let i = 0; i < 3; i++){
        let x = g.lx + g.dx*(i+1);
        xTicks.push(x);
        line(x,g.by,x,g.by-8);
    }

    // Sub x-tick marks
    for(let i = 0; i < 24; i++){
        let pxStart;

        if(i < 8){
            pxStart = g.lx;
            let val = 10*(i+2);
            let x = pxStart + g.dx*(Math.log10(val)-1);
            if(i == 3){
                line(x,g.by,x,g.by-8);
                line(x,g.ty,x,g.ty+8);
            } else {
                line(x,g.by,x,g.by-3);
                line(x,g.ty,x,g.ty+3);
            }
        } else if (i < 16){
            pxStart = xTicks[0];
            let val = 100*(i-6);
            let x = pxStart + g.dx*(Math.log10(val)-2);
            if(i == 11){
                line(x,g.by,x,g.by-8);
                line(x,g.ty,x,g.ty+8);
            } else {
                line(x,g.by,x,g.by-3);
                line(x,g.ty,x,g.ty+3);
            }
        } else {
            pxStart = xTicks[1];
            let val = 1000*(i-14);
            let x = pxStart + g.dx*(Math.log10(val)-3);
            if(i == 19){
                line(x,g.by,x,g.by-8);
                line(x,g.ty,x,g.ty+8);
            } else {
                line(x,g.by,x,g.by-3);
                line(x,g.ty,x,g.ty+3);
            }
        }
    }
    
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

    push();
    noStroke(); fill(100);
    textSize(20);
    text('Liquid',g.lx+20,330)
    text('Supercritical',230,g.ty+50);
    text('Vapor',g.rx-150,330);
    text('Two phases',320,g.by-20);
    pop();
}

// Creates the custom curve for P-V diagram
function pressureVolume(){

    let curve = [];
    let dV = 1; // Initial value for change in volume

    // Plot volume between 35 and 10E4
    for(let i = 35; i <= 40000; i+=dV){

        let x = i;
        let y = (g.R * g.slider)/(x - g.b) - g.a/x**2;
        curve.push([x,y]);

        if(i >= 100){
            dV = 5;
        } else if (i >= 1000){
            dV = 50;
        }
    }

    push(); noFill(); strokeWeight(2); stroke(0,0,255);
    beginShape();
    for(let i = 0; i < curve.length; i++){
        let x = xPlotting(curve[i][0]);
        let y = map(curve[i][1],0,28,g.by,g.ty);
        vertex(x,y);
        
    }
    endShape();
    pop();

    // This covers up the part of the curve that exceeds the graph's bounds
    push();
    fill(250); noStroke();
    rect(0,0,g.lx-1,height);
    rect(0,0,width,g.ty-.5);
    rect(0,g.by+.5,width,height-g.by);
    rect(g.rx+1,0,width-g.rx,height);
    pop();
}

// Creates the custom curve for T-V diagram
function temperatureVolume(){

    let curve = [];
    let dV = 1;
    // Plot volume between 35 and 10E4
    for(let i = 0; i <= 40000; i+=dV){
        let x = i;
        let y = ((g.slider + g.a/x**2)*(x - g.b))/g.R;
        curve.push([x,y]);
        if(i >= 100){
            dV = 5;
        } else if (i >= 1000){
            dV = 50;
        }

    }

    push(); noFill(); strokeWeight(2); stroke(0,0,255);
    beginShape();
    for(let i = 0; i < curve.length; i++){
        let x = xPlotting(curve[i][0]);
        let y = map(curve[i][1],275,760,g.by-10,g.ty);
        vertex(x,y);
        
    }
    endShape();
    pop();

    // This covers up the part of the curve that exceeds the graph's bounds
    push();
    fill(250); noStroke();
    rect(0,0,g.lx-1,height);
    rect(0,0,width,g.ty-.5);
    rect(0,g.by+.5,width,height-g.by);
    rect(g.rx+1,0,width-g.rx,height);
    pop();
}

// To avoid clipping the custom curve the labels are placed on afterwards so the part of the curve that exceeds the graph can be covered up
function graphLabels(){
    let yLabelsP = ['0','5','10','15','20','25'];
    let yLabelsT = ['300','400','500','600','700'];
    let count = 0;

    push();
    textSize(20); noStroke();
    if(g.diagram == "P-V-diagram"){
        count++;
        for(let i = 0; i < 27; i++){
            if((i+1)%5 == 0){
                if(count == 1){
                    text(yLabelsP[0],g.lx-14,g.by+6);
                    text(yLabelsP[1],g.lx-14,g.by-(g.by-g.ty)/28*(i+1)+7)
                } else {
                    text(yLabelsP[count],g.lx-25,g.by-(g.by-g.ty)/28*(i+1)+7);
                }
                count++; 
            }
        }
        push();
        textSize(22);
        translate(50,height/2+70);
        rotate(radians(-90));
        text('Pressure (MPa)',0,0);
        pop();
    } else {
        for(let i = 0; i < 25; i++){
            if((i-1)%5 == 0){
                text(yLabelsT[count],g.lx-35,g.by+10-(g.by+10-g.ty)/25*(i+1)+6);
                count++;
            }
        }
        push();
        textSize(22);
        translate(50,height/2+80);
        rotate(radians(-90));
        text('Temperature (K)',0,0);
        pop();
    
    }
    
    let xLabels = ['100','1000','10'];

    push();
    text(xLabels[0],xTicks[0]-18,g.by+22);
    text(xLabels[1],xTicks[1]-22,g.by+22);
    text(xLabels[2],xTicks[2]-12,g.by+22);
    textSize(15);
    text('4',xTicks[2]+10,g.by+13);
    pop();

    count = 0;
    labels = ['50','500','5000'];
    for(let i = 3; i < 20; i+=8){
        let pxStart;
        if(i < 8){
            pxStart = g.lx;
            let val = 10*(i+2);
            let x = pxStart + g.dx*(Math.log10(val)-1);
            if(i == 3){
                text(labels[count],x-12,g.by+22);
                count++;
            }
        } else if (i < 16){
            pxStart = xTicks[0];
            let val = 100*(i-6);
            let x = pxStart + g.dx*(Math.log10(val)-2);
            if(i == 11){
                text(labels[count],x-16,g.by+22);
                count++;
            }
        } else {
            pxStart = xTicks[1];
            let val = 1000*(i-14);
            let x = pxStart + g.dx*(Math.log10(val)-3);
            if(i == 19){
                text(labels[count],x-22,g.by+22);
            } 
        }
    }

    push();
    textSize(22);
    text('Volume (cm /mol)',width/2-60,g.by+60);
    textSize(17);
    text('3',width/2+54,g.by+50);
    pop();
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