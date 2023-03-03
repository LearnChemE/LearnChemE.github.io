let xTicks = [];

function graphDraw(){
    push();
    rect(100,75,650,450);
    g.lx = 100; g.rx = 100 + 650;
    g.ty = 75; g.by = 75 + 450;

    let temp = [];

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
                temp.push(g.by+10-(g.by+10-g.ty)/25*(i+1))
            } else {
                line(g.lx,g.by+10-(g.by+10-g.ty)/25*(i+1),g.lx+3,g.by+10-(g.by+10-g.ty)/25*(i+1));
                line(g.rx,g.by+10-(g.by+10-g.ty)/25*(i+1),g.rx-3,g.by+10-(g.by+10-g.ty)/25*(i+1));
            }
        }
    }

    console.log(temp)

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
            y = map(tvg[i][1],270.86,760,g.by,g.ty);
            x = xPlotting(tvg[i][0]);
            vertex(x,y);
        }
        endShape();
        beginShape();
        for(let i = 0; i < tvl.length; i++){
            y = map(tvl[i][1],270.86,760,g.by,g.ty);
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

    if(g.slider > 645){
        tempOver645(curve);
    } else {
        tempUnder645(curve);
    }

    

    // This covers up the part of the curve that exceeds the graph's bounds
    push();
    fill(250); noStroke();
    rect(0,0,g.lx-1,height);
    rect(0,0,width,g.ty-.5);
    rect(0,g.by+.5,width,height-g.by);
    rect(g.rx+1,0,width-g.rx,height);
    pop();
}

// Can just draw the curve when T > 645K
function tempOver645(curve){
    push(); noFill(); strokeWeight(2); stroke(0,0,255);
    beginShape();
    for(let i = 0; i < curve.length; i++){
        let x = xPlotting(curve[i][0]);
        let y = map(curve[i][1],0,28,g.by,g.ty);
        vertex(x,y);
    }
    endShape();
    pop();
}

function tempUnder645(curve){
    let curvepx = [];
    
    for(let i = 0; i < curve.length; i++){
        let x = xPlotting(curve[i][0]);
        let y = map(curve[i][1],0,28,g.by,g.ty);
        curvepx.push([x,y]);
    }

    let x1c, y1c, x2c, y2c; // Points to be used with the custom curve
    let x1l, y1l, x2l, y2l; // Points to be used with the liquid part of the phase curve
    let mc, bc, ml, bl;
    let xVL, yVL;

    // FIRST INTERSECTION
    // Iterate through liquid curve and find where there is a line intersection with points of custom curve to find VL
    let c = 0;
    let test = true;
    let storage1 = 0; // Used to keep track of index in curve for later intersection points

    while (test){
        x1l = pvl_px[c][0]; y1l = pvl_px[c][1];
        x2l = pvl_px[c+1][0]; y2l = pvl_px[c+1][1];
        ml = (y2l - y1l)/(x2l - x1l);
        bl = y1l - ml*x1l;
        for(let i = 0; i < curvepx.length-1; i++){
            x1c = curvepx[i][0]; y1c = curvepx[i][1];
            x2c = curvepx[i+1][0]; y2c = curvepx[i+1][1];
            mc = (y2c - y1c)/(x2c - x1c);
            bc = y1c - mc*x1c;

            let xsol = (bl - bc)/(mc - ml); // Potential x-solution
            let ysol = mc*xsol + bc;
            // Checks to make sure xsol and ysol aren't intersected out of bounds
            if(xsol >= x1c && xsol <= x2c && ysol >= y1c && ysol <= y2c && xsol >= x1l && xsol <= x2l && ysol <= y1l && ysol >= y2l){ 
                xVL = xsol;
                yVL = ysol;
                storage1 = i;
                test = false;
            }
        }
        c++;
    }

    // SECOND INTERSECTION
    let x2, y2;
    let m, b;
    let storage2 = 0;
    for(let i = storage1+1; i < curvepx.length-1; i++){
        y2 = yVL;
        if(curvepx[i][1] >= y2 && curvepx[i+1][1] < y2){
            
            m = (curvepx[i+1][1] - curvepx[i][1])/(curvepx[i+1][0] - curvepx[i][0]);
            b = curvepx[i][1] - m*curvepx[i][0];
            x2 = (yVL - b)/m;
            storage2 = i;
            break;
        }
    }
    
    // THIRD INTERSECTION
    let x3, y3;
    let storage3;
    for(let i = storage2+1; i < curvepx.length-1; i++){
        y3 = yVL;
        if(curvepx[i][1] <= y3 && curvepx[i+1][1] > y3){
            m = (curvepx[i+1][1] - curvepx[i][1])/(curvepx[i+1][0] - curvepx[i][0]);
            b = curvepx[i][1] - m*curvepx[i][0];
            x3 = (yVL - b)/m;
            storage3 = i;
            break;
        }
    }

    g.topText = (map(yVL,g.by,g.ty,0,28)).toFixed(1); // Saturated Pressure

    // With all intersections defined the original curve needs to be broken up into 4 segments
    // Curve up to first intersection
    push();
    strokeWeight(2); stroke(0,0,255); noFill();
    beginShape();
    for(let i = 0; i <= storage1; i++){
        vertex(curvepx[i][0],curvepx[i][1]);
        if(i == storage1){
            vertex(xVL,yVL);
        }
    }
    endShape();
    pop();

    // Curve from first intersection to second intersection
    push();
    strokeWeight(2); drawingContext.setLineDash([5,7]); fill(0,255,0,100); stroke(0,0,255);
    beginShape();
    for(let i = storage1+1; i <= storage2; i++){
        if(i == storage1+1){
            vertex(xVL,yVL);
        }
        vertex(curvepx[i][0],curvepx[i][1]);
        if(i == storage2){
            vertex(x2,y2);
        }
    }
    endShape();

    // Curve from second intersection to third intersection
    beginShape();
    for(let i = storage2+1; i <= storage3; i++){
        if(i == storage2+1){
            vertex(x2,y2);
        }
        vertex(curvepx[i][0],curvepx[i][1]);
        if(i == storage3){
            vertex(x3,y3);
        }
    }
    endShape();
    pop();

    // Curve from third intersection on
    push();
    strokeWeight(2); noFill(); stroke(0,0,255);
    beginShape();
    for(let i = storage3+1; i < curvepx.length; i++){
        if(i == storage3+1){
            vertex(x3,y3);
        }
        vertex(curvepx[i][0],curvepx[i][1]);
    }
    endShape();
    pop();

    push();
    fill(255,87,51); noStroke();
    ellipse(xVL,yVL,12);
    ellipse(x3,y3,12);
    strokeWeight(2); stroke(255,87,51);
    drawingContext.setLineDash([5,7]);
    line(xVL,yVL,x3,y3);
    pop();

    let vL = reverseXPlotting(xVL);
    let vV = reverseXPlotting(x3);

    push();
    textSize(22); noStroke(); textStyle(ITALIC);
    text('V',550,150);
    text('V',550,190);
    textStyle(NORMAL); textSize(17);
    text('L',567,140);
    text('V',567,180);
    text('3',657,140);
    textSize(22);
    text('= '+vL+' cm /mol',580,150);
    if (vV < 1000){
        text('= '+vV+' cm /mol',580,190);
        textSize(17);
        text('3',669,180);
    } else {
        text('= '+vV+' cm /mol',580,190);
        textSize(17);
        text('3',682,180);
    }
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

    if(g.slider > 22){
        pressureOver22(curve);
    } else {
        pressureUnder22(curve);
    }
    

    // This covers up the part of the curve that exceeds the graph's bounds
    push();
    fill(250); noStroke();
    rect(0,0,g.lx-1,height);
    rect(0,0,width,g.ty-.5);
    rect(0,g.by+.5,width,height-g.by);
    rect(g.rx+1,0,width-g.rx,height);
    pop();
}

// Can just draw the curve when P > 22
function pressureOver22(curve){
    push(); noFill(); strokeWeight(2); stroke(0,0,255);
    beginShape();
    for(let i = 0; i < curve.length; i++){
        let x = xPlotting(curve[i][0]);
        let y = map(curve[i][1],270.86,760,g.by,g.ty);
        vertex(x,y);
        
    }
    endShape();
    pop();
}

function pressureUnder22(curve){
    let curvepx = [];
    push(); noFill(); strokeWeight(2); stroke(0,0,255);
    beginShape();
    for(let i = 0; i < curve.length; i++){
        let x = xPlotting(curve[i][0]);
        let y = map(curve[i][1],270.86,760,g.by,g.ty);
        curvepx.push([x,y]);
    }
    endShape();
    pop();

    let tvgpx = []; // Have to redo this for some reason unsure why, the generate pixel data only works for the liquid data
    for(let i = 0; i < tvg.length; i++){
        let x = xPlotting(tvg[i][0]);
        let y = map(tvg[i][1],270.86,760,g.by,g.ty);
        tvgpx.push([x,y]);
    }

    let x1c, y1c, x2c, y2c; // Points to be used with the custom curve
    let x1g, y1g, x2g, y2g; // Points to be used with the gas part of the phase curve
    let mc, bc, mg, bg;
    let xVV, yVV;

    // FIRST INTERSECTION
    // Iterate through liquid curve and find where there is a line intersection with points of custom curve to find VL
    let c = tvgpx.length-1;
    let test = true;
    let storage1 = 0; // Used to keep track of index in curve for later intersection points

    while(test && c >= 1){
        x1g = tvgpx[c][0]; y1g = tvgpx[c][1];
        x2g = tvgpx[c-1][0]; y2g = tvgpx[c-1][1];
        mg = (y2g - y1g)/(x2g - x1g);
        bg = y1g - mg*x1g;
        for(let i = 0; i < curvepx.length-1; i++){
            x1c = curvepx[i][0]; y1c = curvepx[i][1];
            x2c = curvepx[i+1][0]; y2c = curvepx[i+1][1];
            mc = (y2c - y1c)/(x2c - x1c);
            bc = y1c - mc*x1c;
            let xsol = (bg - bc)/(mc - mg);
            let ysol = mc*xsol + bc;
            if(xsol >= x1c && xsol <= x2c && xsol <= x2g && xsol >= x1g && ysol <= y2g && ysol >= y1g && ysol <= y1c && ysol >= y2c){
                xVV = xsol;
                yVV = ysol;
                storage1 = i;
                test = false;
            }
    
        }
        c--;
    }

    g.topText = Math.round(map(yVV,g.by,g.ty,270.86,760));
    
    // SECOND INTERSECTION
    let x2, y2;
    let m, b;
    let storage2 = 0;
    for(let i = storage1; i >= 1; i--){
        y2 = yVV;
        if(curvepx[i][1] >= y2 && curvepx[i-1][1] <= y2){
            m = (curvepx[i][1] - curvepx[i-1][1])/(curvepx[i][0] - curvepx[i-1][0]);
            b = curvepx[i][1] - m*curvepx[i][0];
            x2 = (yVV - b)/m;
            storage2 = i;
            break;
        }
    }

    // THIRD INTERSECTION
    let x3, y3;
    let storage3;
    for(let i = storage2-1; i >= 1; i--){
        y3 = yVV;
        if(curvepx[i][1] <= y3 && curvepx[i-1][1] >= y3){
            m = (curvepx[i][1] - curvepx[i-1][1])/(curvepx[i][0] - curvepx[i-1][0]);
            b = curvepx[i][1] - m*curvepx[i][0];
            x3 = (yVV - b)/m;
            storage3 = i;
            break;
        }
    }

    // With all intersections defined the original curve needs to be broken up into 4 segments
    // Curve up to third intersection
    push();
    strokeWeight(2); stroke(0,0,255); noFill();
    beginShape();
    for(let i = 0; i < storage3; i++){
        vertex(curvepx[i][0],curvepx[i][1]);
        if(i == storage3-1){
            vertex(x3,y3);
        }
    }
    endShape();
    pop();

    // Curve from third to second intersection
    push();
    strokeWeight(2); drawingContext.setLineDash([5,7]); noFill(); stroke(0,0,255);
    beginShape();
    for(let i = storage3; i < storage2; i++){
        if(i == storage3){
            vertex(x3,y3);
        }
        vertex(curvepx[i][0],curvepx[i][1]);
        if(i == storage2-1){
            vertex(x2,y2);
        }
    }
    endShape();
    

    // Curve from second to first intersection
    beginShape();
    for(let i = storage2; i < storage1; i++){
        if(i == storage2){
            vertex(x2,y2);
        }
        vertex(curvepx[i][0],curvepx[i][1]);
        if(i == storage1-1){
            vertex(xVV,yVV);
        }
    }
    endShape();
    pop();

    // Remainder of curve after first intersection
    push();
    strokeWeight(2); noFill(); stroke(0,0,255);
    beginShape();
    for(let i = storage1; i < curvepx.length; i++){
        if(i == storage1){
            vertex(xVV,yVV);
        }
        vertex(curvepx[i][0],curvepx[i][1]);
    }
    endShape();
    pop();

    push();
    fill(255,87,51); noStroke();
    ellipse(xVV,yVV,12);
    ellipse(x3,y3,12);
    strokeWeight(2); stroke(255,87,51);
    drawingContext.setLineDash([5,7]);
    line(x3,y3,xVV,yVV);
    pop();

    let vV = reverseXPlotting(xVV);
    let vL = reverseXPlotting(x3);

    push();
    textSize(22); noStroke(); textStyle(ITALIC);
    text('V',550,150);
    text('V',550,190);
    textStyle(NORMAL); textSize(17);
    text('L',567,140);
    text('V',567,180);
    text('3',657,140);
    textSize(22);
    text('= '+vL+' cm /mol',580,150);
    if(vV < 100){
        text('= '+vV+' cm /mol',580,190);
        textSize(17);
        text('3',656,180);
    } else if (vV < 1000){
        text('= '+vV+' cm /mol',580,190);
        textSize(17);
        if(vV == 111){
            text('3',666,180);
        } else {  
            text('3',669,180);
        }
    } else {
        text('= '+vV+' cm /mol',580,190);
        textSize(17);
        text('3',682,180);
    }
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

// Used for converting pixel coordinates to logarithmic value
function reverseXPlotting(x){
    let output;

    if(x <= g.lx+g.dx){
        output = Math.round(10**(((x - g.lx)/g.dx) + 1));
    } else if (x <= xTicks[0]+g.dx){
        output = Math.round(10**(((x - xTicks[0])/g.dx) + 2));
    } else if (x <= xTicks[1]+g.dx){
        output = Math.round(10**(((x - xTicks[1])/g.dx) + 3));
    } else {
        output = Math.round(10**(((x - xTicks[2])/g.dx) + 4));
    }
    return(output)
}

// Fills in values for Vc, a, b
function fillConstants(){
    g.a = (27/64)*((g.R**2)*(g.Tc**2))/g.Pc
    g.b = (g.R*g.Tc)/(8*g.Pc);
    g.Vc = 0.359*(g.R*g.Tc)/g.Pc;
}

function PsatORTsat(){
    if(g.diagram == 'P-V-diagram'){
        if(g.slider <= 645){
            push();
            noStroke(); textSize(25); textStyle(ITALIC);
            text('P',width/2-50,60);
            textStyle(NORMAL);
            text('  = '+g.topText + ' MPa',width/2-20,60);
            textSize(18);
            text('sat',width/2-32,47);
            pop();
        }
    } else {
        if(g.slider <= 22){
            push();
            noStroke(); textSize(25); textStyle(ITALIC);
            text('T',width/2-50,60);
            textStyle(NORMAL);
            text('  = '+g.topText+' K',width/2-20,60);
            textSize(18);
            text('sat',width/2-32,47);
            pop();
        }
    }
}