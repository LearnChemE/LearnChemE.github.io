
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

function enthalpValueDisp(){
    let temp = g.points[0];
    let ans = find2Dint(w.px);
    let x = ans[0]-50;
    let y = H.m*x + ans[2];

    push();
    if(y > g.ty && g.enthalp < 100 && g.enthalp > 9){
        stroke(g.blue); strokeWeight(1.5); rect(x-30,y-23,30,23); strokeWeight(2);
        line(temp.x,temp.y,x,y);
        noStroke(); fill(g.blue); textSize(18);
        text(g.enthalp,x-25,y-5);
    } else if (y > g.ty && g.enthalp >= 100){
        stroke(g.blue); strokeWeight(1.5); rect(x-35,y-23,35,23); strokeWeight(2);
        line(temp.x,temp.y,x,y);
        noStroke(); fill(g.blue); textSize(18);
        text(g.enthalp,x-33,y-5);
    } else if (y < g.ty){
        let xt = (g.ty - ans[2])/H.m-5;
        let yt = H.m*xt + ans[2];
        stroke(g.blue); strokeWeight(1.5); rect(xt-35,yt-23,35,23); strokeWeight(2);
        line(temp.x,temp.y,xt,yt);
        noStroke(); fill(g.blue); textSize(18);
        text(g.enthalp,xt-33,yt-5);
    } else if (g.enthalp <= 9 && x > g.lx){
        stroke(g.blue); strokeWeight(1.5); rect(x-25,y-23,25,23); strokeWeight(2);
        line(temp.x,temp.y,x,y);
        noStroke(); fill(g.blue); textSize(18);
        text(g.enthalp,x-18,y-5);
    } else if (x < g.lx){
        let xt = g.lx-1;
        let yt = H.m*xt + ans[2];
        stroke(g.blue); strokeWeight(1.5); rect(xt-25,yt-23,25,23); strokeWeight(2);
        line(temp.x,temp.y,xt,yt);
        noStroke(); fill(g.blue); textSize(18);
        text(g.enthalp,xt-20,yt-5);
    }
    
    pop();
}

function volValueDisp(){
    let temp = g.points[0];
    let b = temp.y - V.m*temp.x;
    let x = (g.by - b)/V.m + 25;
    let y = V.m*x + b;

    if(x > g.rx+40){
        x = g.rx + 40;
        y = V.m*x + b;
    }
    
    push();
    stroke(g.pink); strokeWeight(1.5); rect(x,y,44,23); strokeWeight(2);
    line(temp.x,temp.y,x,y);
    noStroke(); fill(g.pink); textSize(18);
    text(g.volume,x+4,y+18);
    pop();

}

function displayValues(){
    let c = 0;
    let ticks = [50,75,100,125,150,175,200,225];
    let temp = g.points[0];
    //°C

    push();
    noStroke(); textSize(20); 
    text('moisture content = '+(map(temp.y,g.by,g.ty,0,.033)).toFixed(3)+' kg/kg DA',g.lx+5,ticks[c]);
    c++;
    if(g.tempTruth){
        fill(100);
        text('dew point temperature = '+g.dewPoint+'°C',g.lx+5,ticks[c]);
        c++;
        text('wet-bulb temperature = '+g.wetBulb+'°C',g.lx+5,ticks[c]);
        c++;
        text('dry-bulb temperature = '+g.dryBulb+'°C',g.lx+5,ticks[c]);
        c++;
    }
    if(g.specVolTruth){
        fill(g.pink);
        text('volume = '+g.volume+' m /kg DA',g.lx+5,ticks[c]);
        textSize(16);
        text('3',g.lx+152,ticks[c]-8)
        c++;
        textSize(20);
    }
    if(g.enthalpTruth){
        fill(g.blue);
        text('enthalpy = '+g.enthalp+' kJ/kg DA',g.lx+5,ticks[c]);
        c++;
    }
    if(g.humidTruth){
        fill(g.green);
        text('relative humidity = '+g.relativeHum+'%',g.lx+5,ticks[c]);
        c++;
    }

    fill(0);
    text('DA = dry air',g.lx+5,ticks[c])
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
            }
        }
        if(i == endTemp.length-1){
            vertex(g.rx,map(vOmega(55,65.3),0,0.033,g.by,g.ty));  
        } else if (i == 3){
            vertex(map(46.7,-10,55,g.lx,g.rx),map(vOmega(46.7,endTemp[i]),0,0.033,g.by,g.ty));
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
    let xH = find2D(temp.y,w.px);
    let t = find2Dint(w.px);
    if(g.tempTruth){
        let test = true;
        let test1 = true;
        // Horizontal line (dew point temp)
        if(mouseX > xH && mouseX < temp.x && mouseY < temp.y+5 && mouseY > temp.y-5){
            
            if(temp.y <= g.by-20){
                push();
                strokeWeight(3); drawingContext.setLineDash([5,5]);
                line(temp.x,temp.y,xH+5,temp.y);
                push();
                drawingContext.setLineDash([0,0]);
                arrow([temp.x,temp.y],[xH,temp.y],0,20,6);
                pop();
                pop();  
                push();
                drawingContext.setLineDash([5,5]);
                rect(xH,temp.y+10,82,20);
                noStroke(); textSize(18);
                text('dew point',xH+2,temp.y+25);
                pop();
            } else {
                push();
                strokeWeight(3); drawingContext.setLineDash([5,5]);
                line(temp.x,temp.y,g.lx+5,temp.y);
                push();
                drawingContext.setLineDash([0,0]);
                arrow([temp.x,temp.y],[g.lx,temp.y],0,20,6);
                pop();
                pop();  
                push();
                drawingContext.setLineDash([5,5]);
                rect(g.lx,temp.y+10,82,20);
                noStroke(); textSize(18);
                text('dew point',g.lx+2,temp.y+25);
                pop();
            }
            test = false; test1 = false;
        } else {
            test = true; test1 = true;
            push();
            strokeWeight(2); drawingContext.setLineDash([5,5]);
            if(temp.y <= g.by-20){
                line(temp.x,temp.y,xH+5,temp.y);
                push();
                drawingContext.setLineDash([0,0]);
                arrow([temp.x,temp.y],[xH,temp.y],0,16,4);
                pop();
            } else {
                line(temp.x,temp.y,g.lx+5,temp.y);
                push();
                drawingContext.setLineDash([0,0]);
                arrow([temp.x,temp.y],[g.lx-2,temp.y],0,16,4);
                pop();
            }
            pop();
        }
        
        
        // Vertical line (dry bulb temp)
        if(mouseX > temp.x-5 && mouseX < temp.x+5 && mouseY > temp.y && mouseY < g.by && test){
            test = false;
            push();
            strokeWeight(3); drawingContext.setLineDash([5,5]);
            line(temp.x,temp.y,temp.x,g.by-5);
            strokeWeight(1);
            rect(temp.x+6,g.by-50,68,20);
            pop();
            arrow([temp.x,temp.y],[temp.x,g.by],0,20,6);
            push();
            noStroke(); textSize(18);
            text('dry bulb',temp.x+8,g.by-34)
            pop();
        } else {
            test = true; 
            push();
            strokeWeight(2); drawingContext.setLineDash([5,5]);
            line(temp.x,temp.y,temp.x,g.by-5);
            pop();
            arrow([temp.x,temp.y],[temp.x,g.by],0,16,4);
        }
        console.log(test,test1)
        // Sloped line (dew point)
        let ytest = H.m*mouseX + t[2];
        if(mouseX >= t[0] && mouseX < temp.x && mouseY < ytest+4 && mouseY > ytest-4 && test && test1){
            if(t[1] >= g.ty){
                push();
                strokeWeight(3); drawingContext.setLineDash([5,5]);
                line(temp.x,temp.y,t[0]+3,t[1]+2);
                strokeWeight(1);
                rect(temp.x-10,temp.y-30,72,20);
                pop();
                arrow([temp.x,temp.y],t,0,20,6);
                push();
                noStroke(); textSize(18);
                text('wet bulb',temp.x-8,temp.y-14);
                pop();
            } else {
                push();
                strokeWeight(3); drawingContext.setLineDash([5,5]);
                let xtemp = (g.ty - t[2])/H.m;
                line(temp.x,temp.y,xtemp,g.ty);
                strokeWeight(1);
                rect(temp.x-10,temp.y-30,72,20);
                noStroke(); textSize(18);
                text('wet bulb',temp.x-8,temp.y-14);
                pop();
            }
            
        } else {
            push();
            drawingContext.setLineDash([5,5]); strokeWeight(2);
            if(t[1] >= g.ty){
                line(temp.x,temp.y,t[0]+4,t[1]+3);
                push();
                drawingContext.setLineDash([0,0]);
                arrow([temp.x,temp.y],t,0,16,4);
                pop();
            } else {
                let xtemp = (g.ty - t[2])/H.m;
                line(temp.x,temp.y,xtemp,g.ty);
            }
            pop();
            
        }
        

        //pop();
        
        // if(temp.y <= g.by-20){
        //     //arrow([temp.x,temp.y],[xH,temp.y],0,16,4);
        // } else {
        //     arrow([temp.x,temp.y],[g.lx-2,temp.y],0,16,4);
        // }
        
    }

    let test = false;

    g.dewPoint = (map(xH,g.lx,g.rx,-10,55)).toFixed(0);
    g.dryBulb = (map(temp.x,g.lx,g.rx,-10,55)).toFixed(0);
    g.wetBulb = (map(t[0],g.lx,g.rx,-10,55)).toFixed(0);
}

function otherCalcs(){
    // Enthalpy calculation
    let temp = g.points[0];

    // Need the perpendicular distance between each line
    let p1 = [0,0];
    p1[0] = g.lx;
    p1[1] = map(hOmega(0,-10),0,.033,g.by,g.ty);
    let m = -1/H.m;
    let b = p1[1] - m*p1[0];
    let p2 = [0,0];
    p2[0] = (H.b[1]-b)/(m - H.m);
    p2[1] = m*p2[0] + b;
    let Hmag_dist = ((p2[1]-p1[1])**2 + (p2[0]-p1[0])**2)**(1/2);


    for(let i = 0; i < H.b.length-1; i++){
        let y1 = H.m*temp.x + H.b[i];
        let y2 = H.m*temp.x + H.b[i+1];
        if(temp.y >= y1 && temp.y >= y2){ // Under the 0 line
            b = temp.y - m*temp.x;
            let inter = [0,0];
            inter[0] = (H.b[0]-b)/(m-H.m);
            inter[1] = m*temp.x + b;
            let currentDist = ((inter[1]-temp.y)**2 + (inter[0]-temp.x)**2)**(1/2);
        
            g.enthalp = (0-10*currentDist/Hmag_dist).toFixed(0)
        } else if(temp.y <= y1 && temp.y >= y2){ // Everywhere else
            let dY = (y1 - y2);
            let dC = (y1 - temp.y);
            g.enthalp = ((10*i)*(1-dC/dY) + (10*(i+1))*(dC/dY)).toFixed(0);
            break;
        } else if(temp.y <= y1 && temp.y <= y2){ // Above the 130 line
            b = temp.y - m*temp.x;
            let inter = [0,0];
            inter[0] = (H.b[H.b.length-1]-b)/(m-H.m);
            inter[1] = m*temp.x + b;
            let currentDist = ((inter[1]-temp.y)**2 + (inter[0]-temp.x)**2)**(1/2);
            
            g.enthalp = (130 + 10*currentDist/Hmag_dist).toFixed(0);
        }
    }

    p1[0] = map(-9.42,-10,55,g.lx,g.rx);
    p1[1] = map(vOmega(-9.42,-5.5),0,0.033,g.by,g.ty);
    m = -1/V.m;
    b = p1[1] - m*p1[0];
    p2[0] = (V.b[1]-b)/(m-V.m);
    p2[1] = m*p2[0] + b;
    let Vmag_dist = ((p2[1]-p1[1])**2 + (p2[0]-p1[1])**2)**(1/2);

    for(let i = 0; i < V.b.length-1; i++){
        let y1 = V.m*temp.x + V.b[i];
        let y2 = V.m*temp.x + V.b[i+1];
        if(temp.y >= y1 && temp.y >= y2){
            let inter = [0,0];
            inter[0] = (V.b[0]-b)/(m-V.m);
            inter[1] = m*temp.x + b;
            let currentDist = ((inter[1]-temp.y)**2 + (inter[0]-temp.x)**2)**(1/2);
            g.volume = (.75-.05*currentDist/Vmag_dist).toFixed(2);
        } else if(temp.y <= y1 && temp.y >= y2){
            let dY = (y1 - y2);
            let dC = (y1 - temp.y);
            g.volume = ((0.05*i+.75)*(1-dC/dY) + (0.05*(i+1)+.75)*(dC/dY)).toFixed(2);
            break;
        } else if (temp.y <= y1 && temp.y <= y2){ // Above the .95 line
            b = temp.y - m*temp.x;
            let inter = [0,0];
            inter[0] = (V.b[V.b.length-1]-b)/(m-V.m);
            inter[1] = m*temp.x + b;
            let currentDist = ((inter[1]-temp.y)**2 + (inter[0]-temp.x)**2)**(1/2);

            g.volume = (.95 + .05*currentDist/Vmag_dist).toFixed(2);
        }
    }

    // Calculating relative humidity value
    for(let i = 1; i < 10; i++){
        let T = map(temp.x,g.lx,g.rx,-10,55);
        let h = map(temp.y,g.by,g.ty,0,.033);
        let y1 = phiOmega(i/10,T);
        let y2 = phiOmega((i+1)/10,T);
        if(h >= y1 && h <= y2){
            let dY = y2 - y1;
            let dC = h - y1;
            g.relativeHum = ((10*i)*(1-dC/dY) + (10*(i+1))*(dC/dY)).toFixed(0);
        } else if (i == 1 && h < y1){
            let ratio = h/y1;
            g.relativeHum = (10-9*(1-ratio)).toFixed(0);
        }
    }
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

    for(let i = -100; i <= 55; i+=.01){
        let y = phiOmega(1,i);
        let x = i;
        w.px.push([map(x,-10,55,g.lx,g.rx),map(y,0,.033,g.by,g.ty)]);
    }
}


function find2D(y, arr) {
    let x;
    for (let i = 0; i < arr.length - 1; i++) {
        if (y <= arr[i][1] && y >= arr[i + 1][1]) {
            x = arr[i][0] + (y - arr[i][1]) * (arr[i + 1][0] - arr[i][0]) / (arr[i + 1][1] - arr[i][1]);
        }
    }
    return (x);
}

function find2Dint(arr){
    let m1, m2, b1, b2;
    let x1, x2, y1, y2;
    let x, y;
    
    let temp = g.points[0];
    m2 = H.m;
    b2 = temp.y - temp.x*m2;
    
    for(let i = 0; i < arr.length-1; i++){
        x1 = arr[i][0]; x2 = arr[i+1][0];
        y1 = arr[i][1]; y2 = arr[i+1][1];
        m1 = (y2 - y1)/(x2 - x1);
        b1 = y1 - m1*x1;
        let t = (b2 - b1)/(m1 - m2);
        if(t >= x1 && t <= x2){
            x = t;
        }
    }
    y = m2*x + b2;
    return([x,y,b2]);
    
}
