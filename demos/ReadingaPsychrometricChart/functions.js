
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
    text('temperature (°C)',238,510);
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
    fill(250);
    rect(-5,-17,145,21);
    fill(g.green);
    text('saturation line',0,0);
    pop();
}

function enthalpDisplay(){
    let xStart = [-10,-4,1.5,6.0,10.5,14.0,17.5,20.3,22.5,24.5,26.4,27.55,37.55,47.55];
    let xEnd = [0,10,20,30,40,50,60,70,80,90,100,110,120,130];
   
    for(let i = 0; i < xStart.length; i++){
        push(); noFill(); strokeWeight(.8); stroke(g.blue[0],g.blue[1],g.blue[2],120); beginShape();
        for(let j = xStart[i]; j <= xEnd[i]; j++){
            if(i > 0 && i < 10 && j == xStart[i]){
                push();
                noStroke(); fill(g.blue); textSize(18);
                text(10*i,map(j,-10,55,g.lx,g.rx)-23,map(hOmega(xEnd[i],j),0,.033,g.by,g.ty)+5);
                pop();
            } else if (i == 10 && j == xStart[i]){
                push();
                noStroke(); fill(g.blue); textSize(18);
                text('100',355,85);
                pop();
            }
            if(j <= 55.3){
                vertex(map(j,-10,55,g.lx,g.rx),map(hOmega(xEnd[i],j),0,.033,g.by,g.ty));
            }
        }
        if(i > 5){
            vertex(g.rx,map(hOmega(xEnd[i],55),0,.033,g.by,g.ty));
        } else if (i == 5){
            vertex(map(50,-10,55,g.lx,g.rx),map(0,0,.033,g.by,g.ty));
        } else if (i == 4){
            vertex(map(40,-10,55,g.lx,g.rx),g.by);
        }
        endShape(); pop();
    }
    push();
    noStroke(); textSize(18); fill(g.blue);
    translate(50,g.by-85);
    rotate(radians(-30));
    text('enthalpy (kJ/kg)',0,0);
    pop();  
}

function volDisplay(){
    let endTemp = [-5.5, 12.2, 29.9, 47.6, 65.3]; // Values from mathematica
    let startTemp = [-9.42,6.35,20,31.1,46.50];

    for(let i = 0; i < endTemp.length; i++){
        push(); noFill(); strokeWeight(.8); stroke(g.pink[0],g.pink[1],g.pink[2],80); beginShape();
        for(let j = startTemp[i]; j <= endTemp[i]; j++){
            if(j < 55 && i != 3){
                vertex(map(j,-10,55,g.lx,g.rx),map(vOmega(j,endTemp[i]),0,.033,g.by,g.ty));
            }  else if (i == 3 && j < 47){
                vertex(map(j,-10,55,g.lx,g.rx),map(vOmega(j,endTemp[i]),0,.033,g.by,g.ty));
                vertex(map(46.7,-10,55,g.lx,g.rx),map(vOmega(46.7,endTemp[i]),0,0.033,g.by,g.ty));
            }
        }
        if(i == endTemp.length-1){
            vertex(g.rx,map(vOmega(55,65.3),0,0.033,g.by,g.ty));  
        }
        endShape(); pop();
    }
    push();
    noStroke(); fill(g.pink[0],g.pink[1],g.pink[2]); textSize(19);
    text('0.75',g.lx+20,g.by+80);
    text('0.80',g.lx+200,g.by+80);
    text('0.85',g.lx+370,g.by+80);
    text('0.90',g.lx+545,g.by+80);
    fill(0); textSize(22);
    text('volume (m  /kg dry air)',360,g.by+110);
    textSize(19);
    text('3',463,g.by+105);
    pop();
}

function gridLinesFunc(){
    // X lines
    let x = [-5,0,5,10,15,20,25,30,35,40,45,50];
    let yend = [.0025,.0036,.0052,.00745,.0103,.0142,0.01945,.0265,.033,.033,.033,.033];
    // Y lines
    let y = [.005,.01,.015,.02,.025,.03];
    let xstart = [4.8,14.5,20.7,25.3,29.05,32.3];

    push();
    stroke(0,50);
    for(let i = 0; i < x.length; i++){
        let xc = map(x[i],-10,55,g.lx,g.rx);
        let yc = map(yend[i],0,.033,g.by,g.ty);
        line(xc,g.by,xc,yc);
    }
    for(let i = 0; i < y.length; i++){
        let yc = map(y[i],0,.033,g.by,g.ty);
        let xc = map(xstart[i],-10,55,g.lx,g.rx);
        line(xc,yc,g.rx,yc);
    }
    pop();


}

function tempDisplay(){
    let temp = g.points[0];

    push();
    drawingContext.setLineDash([5,5]); strokeWeight(2);
    line(temp.x,temp.y,temp.x,g.by-5);
    pop();
    arrow([temp.x,temp.y],[temp.x,g.by],0,16,4);
}

function Psat(T){
    return(10**(4.6543 - 1435.264/(T+208.152)));
}

// Relative humidity curves
function phiOmega(phi,T){
    return((1/g.MW)*phi*Psat(T)/g.P)
}

function hOmega(T,T1){
    return((T-T1)/2500);
}

function vOmega(T,T1){
    return(-.0065 - .0021*(T-T1));
}

function pointTest(){
    let temp = g.points[0];
    let T = map(temp.x,g.lx,g.rx,-10,55);
    let Hlimit = phiOmega(1,T);
    let Hactual = map(mouseY,g.by,g.ty,0,.033);
    if(Hactual < Hlimit){
        g.test = true;
    } else {
        g.test = false;
    }
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

// Defines data sets and info for the lines displayed
// enthalpy info

function defineLines(){
    // Enthalpy info
    let HxStart = [-10,-4,1.5,6.0,10.5,14.0,17.5,20.3,22.5,24.5,26.4,27.55,37.55,47.55];
    let HxEnd = [0,10,20,30,40,50,60,70,80,90,100,110,120,130];
    for(let i = 0; i < HxStart.length; i++){
        let x1 = map(HxStart[i],-10,55,g.lx,g.rx);
        let x2 = map(HxEnd[i],-10,55,g.lx,g.rx);
        let y1 = map(hOmega(HxEnd[i],HxStart[i]),0,.033,g.by,g.ty);
        let y2 = g.by;
        if(i == 0){
            H.m = (y2 - y1)/(x2 - x1);
        }
        H.b.push(y1-H.m*x1)
    }

    // Volume info
    let endTemp = [-5.5, 12.2, 29.9, 47.6, 65.3];
    let startTemp = [-9.42,6.35,20,31.1,46.50];
    for(let i = 0; i < endTemp.length; i++){
        let x1 = map(startTemp[i],-10,55,g.lx,g.rx);
        let x2 = map(endTemp[i],-10,55,g.lx,g.rx);
        let y1 = map(vOmega(startTemp[i],endTemp[i]),0,.033,g.by,g.ty);
        let y2 = map(vOmega(endTemp[i],endTemp[i]),0,.033,g.by,g.ty);
        if(i == 0){
            V.m = (y2 - y1)/(x2 - x1);
        }
        V.b.push(y1-V.m*x1);
    }

    for(let i = -10; i <= 55; i+=.01){
        let y = phiOmega(1,i);
        let x = i;
        w.px.push([map(x,-10,55,g.lx,g.rx),map(y,0,.033,g.by,g.ty)]);
    }
}

