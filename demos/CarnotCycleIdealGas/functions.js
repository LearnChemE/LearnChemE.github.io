
// Draws overall graph shape and determines bounds on the axes
function graphDraw(){
    g.eta = 1 - g.Tc/g.Th;
    g.COP = 1/(1-g.Tc/g.Th);
    //╖ η
   
    // Graph title
    push();
    noStroke(); textSize(21);
    if(g.engine == 'heat-engine'){
        text('heat engine',180,40);
    } else {
        text('heat pump',185,40);
    }
    pop();

    // Legend
    push();
    translate(-120,24)
    strokeWeight(3); stroke(g.red);
    line(g.rx+30,g.by,g.rx+45,g.by);
    stroke(g.blue);
    line(g.rx+30,g.by+16,g.rx+45,g.by+16);
    noStroke(); textSize(15);
    text('isothermal',g.rx+50,g.by+4);
    text('adiabatic',g.rx+50,g.by+20);
    pop();
}

// Figure on the right when in heat engine mode
function HE_figure(){
    
    let S1 = s1(g.V1,g.Th,g.ratio);
    let S2 = s2(g.V2,g.Th,g.ratio);
    let Q1 = (-1*g.Tc*(S2-S1)/1000).toFixed(2);
    let Q2 = (g.Th*(S2-S1)/1000).toFixed(2);
    let W = (g.eta*Q2).toFixed(2);

    efficiency(); // Top equation and label
    function efficiency(){
        push();
        noStroke(); textSize(20); textStyle(ITALIC);
        text('η = ',500,50);
        text('W',545,38);
        text('Q',540,64);
        textStyle(NORMAL);
        text('= '+g.eta.toFixed(2),583,50);
        textSize(16);
        text('H',557,69);
        pop();

        line(534,44,578,44);
        line(542,20,542,41);
        line(570,20,570,41);
    }
    
    push();
    translate(-30,0);
    TH(); // TH box and label
    function TH(){
        push();
        stroke(g.red); strokeWeight(3);
        line(535,height/2-80,535,height/2-35);
        arrow([535,height/2-80],[535,height/2-29],g.red,20,5);
        rect(480,height/2-115,110,35);
        noStroke(); fill(g.red); textSize(18);
        text('T  = '+g.Th+' K',495,height/2-90);
        textSize(16);
        text('Q   = '+Q2+' kJ/mol',550,height/2-55);
        textSize(15);
        text('H',504,height/2-86);
        textSize(14);
        text('H',563,height/2-51);
        pop();
    }
    

    TC(); // TC box and label
    function TC(){
        push();
        stroke(0,200,0); strokeWeight(3);
        line(535,height/2+30,535,height/2+75);
        arrow([535,height/2-80],[535,height/2+80],[0,200,0],20,5);
        rect(480,height/2+80,110,35);
        noStroke(); fill([0,200,0]); textSize(18);
        text('T  = '+g.Tc+' K',495,height/2+105);
        text('Q   = '+Q1+' kJ/mol',550,height/2+65);
        textSize(15);
        text('C',504,height/2+109);
        textSize(14);
        text('C',565,height/2+69)
        pop();
    }

    work(); // Work arrow and label
    function work(){
        push();
        strokeWeight(3);
        line(565,height/2,585,height/2);
        arrow([565,height/2],[605,height/2],0,20,5);
        noStroke(); fill(0); textSize(18);
        text('W = -'+W+' kJ/mol',570,height/2-12);
        pop();
    }
    

    push();
    fill(250); strokeWeight(4);
    ellipse(535,height/2,60);
    pop();
    pop();
}

// Figure on the right when in heat pump mode
function HP_figure(){
    let S1 = s1(g.V1,g.Th,g.ratio);
    let S2 = s2(g.V2,g.Th,g.ratio);
    let Q1 = (-1*g.Tc*(S2-S1)/1000).toFixed(2);
    let Q2 = (g.Th*(S2-S1)/1000).toFixed(2);
    let W = (g.eta*Q2).toFixed(2);

    efficiency(); // Top equation and label
    function efficiency(){
        push();
        noStroke(); textSize(20); 
        text('COP = ',468,50);
        textStyle(ITALIC);
        text('W',545,64);
        text('Q',540,38);
        textStyle(NORMAL);
        text('= '+(-1*Q1/W).toFixed(2),583,50);
        textSize(16);
        text('C',557,42);
        pop();

        line(534,44,578,44);
        line(542,46,542,67);
        line(570,46,570,67);
    }
    
    push();
    translate(-30,0);
    TH(); // TH box and label
    function TH(){
        push();
        stroke(g.red); strokeWeight(3);
        line(535,height/2-80,535,height/2-35);
        arrow([535,height/2-80],[535,height/2-29],g.red,20,5);
        rect(480,height/2-115,110,35);
        noStroke(); fill(g.red); textSize(18);
        text('T  = '+g.Th+' K',495,height/2-90);
        textSize(16);
        text('Q   = '+-1*Q2+' kJ/mol',550,height/2-55);
        textSize(15);
        text('H',504,height/2-86);
        textSize(14);
        text('H',563,height/2-51);
        pop();
    }
    

    TC(); // TC box and label
    function TC(){
        push();
        stroke(0,200,0); strokeWeight(3);
        line(535,height/2+30,535,height/2+75);
        arrow([535,height/2-80],[535,height/2+80],[0,200,0],20,5);
        rect(480,height/2+80,110,35);
        noStroke(); fill([0,200,0]); textSize(18);
        text('T  = '+g.Tc+' K',495,height/2+105);
        text('Q   = '+-1*Q1+' kJ/mol',550,height/2+65);
        textSize(15);
        text('C',504,height/2+109);
        textSize(14);
        text('C',565,height/2+69)
        pop();
    }

    work(); // Work arrow and label
    function work(){
        push();
        strokeWeight(3);
        line(565,height/2,585,height/2);
        arrow([565,height/2],[605,height/2],0,20,5);
        noStroke(); fill(0); textSize(18);
        text('W = '+W+' kJ/mol',570,height/2-12);
        pop();
    }
    

    push();
    fill(250); strokeWeight(4);
    ellipse(535,height/2,60);
    pop();
    pop();
}

// Fills the graph when diagram is on PV mode
function PV_diagram(){
    push(); fill(250); rect(70,50,350,350); pop();

    let seg1 = c1(g.Tc,g.Th,g.V1,g.V2,g.ratio);
    let seg3 = c3(g.Tc,g.Th,g.V1,g.V2,g.ratio);
    let seg2 = c2(g.Tc,g.Th,g.V1,g.V2,g.ratio);
    let seg4 = c4(g.Tc,g.Th,g.V1,g.V2,g.ratio);

    let yMax;
    let xMax;
    let V_right;
    

    // g.by-10 == 0.0 kPa
    // g.rx-10 == max value volume
    // g.lx+10 == 0 m^3

    yAxes();
    xAxes();
    curves(); // To clean it up 
    function curves(){
        // Red segments 1 and 3
        push(); noFill(); strokeWeight(2); stroke(g.red); beginShape();
        for(let i = 0; i < seg1.length; i++){
            vertex(map(seg1[i][0],0,V_right,g.lx+10,g.rx-10),map(seg1[i][1],0,yMax,g.by-10,g.ty+10));
            if(i == Math.round(seg1.length/3) || i == 2*Math.round(seg1.length/3)){
                let x1 = map(seg1[i][0],0,V_right,g.lx+10,g.rx-10);
                let y1 = map(seg1[i][1],0,yMax,g.by-10,g.ty+10);
                let x2 = map(seg1[i+1][0],0,V_right,g.lx+10,g.rx-10);
                let y2 = map(seg1[i+1][1],0,yMax,g.by-10,g.ty+10);
                if(g.engine == "heat-engine"){
                    arrow([x1,y1],[x2,y2],g.red,12,4);
                } else {
                    arrow([x2,y2],[x1,y1],g.red,12,4);
                }
                
            }
        }
        endShape(); beginShape();
        for(let i = 0; i < seg3.length; i++){
            vertex(map(seg3[i][0],0,V_right,g.lx+10,g.rx-10),map(seg3[i][1],0,yMax,g.by-10,g.ty+10));
            if(i == Math.round(seg3.length/3) || i == 2*Math.round(seg3.length/3)){
                let x1 = map(seg3[i+1][0],0,V_right,g.lx+10,g.rx-10);
                let y1 = map(seg3[i+1][1],0,yMax,g.by-10,g.ty+10);
                let x2 = map(seg3[i][0],0,V_right,g.lx+10,g.rx-10);
                let y2 = map(seg3[i][1],0,yMax,g.by-10,g.ty+10);
                if(g.engine == "heat-engine"){
                    arrow([x1,y1],[x2,y2],g.red,12,4);
                } else {
                    arrow([x2,y2],[x1,y1],g.red,12,4);
                }
            }
        }
        endShape(); pop();

        // Blue segments 2 and 4
        push(); noFill(); strokeWeight(2); stroke(g.blue); beginShape();
        for(let i = 0; i < seg2.length; i++){
            vertex(map(seg2[i][0],0,V_right,g.lx+10,g.rx-10),map(seg2[i][1],0,yMax,g.by-10,g.ty+10));
            if(i == Math.round(seg2.length/3) || i == 2*Math.round(seg2.length/3)){
                let x1 = map(seg2[i+1][0],0,V_right,g.lx+10,g.rx-10);
                let y1 = map(seg2[i+1][1],0,yMax,g.by-10,g.ty+10);
                let x2 = map(seg2[i][0],0,V_right,g.lx+10,g.rx-10);
                let y2 = map(seg2[i][1],0,yMax,g.by-10,g.ty+10);
                if(g.engine == "heat-engine"){
                    arrow([x1,y1],[x2,y2],g.blue,12,4);
                } else {
                    arrow([x2,y2],[x1,y1],g.blue,12,4);
                }
            }
        }
        endShape(); beginShape();
        for(let i = 0; i < seg4.length; i++){
            vertex(map(seg4[i][0],0,V_right,g.lx+10,g.rx-10),map(seg4[i][1],0,yMax,g.by-10,g.ty+10));
            if(i == Math.round(seg4.length/3) || i == 2*Math.round(seg4.length/3)){
                let x1 = map(seg4[i][0],0,V_right,g.lx+10,g.rx-10);
                let y1 = map(seg4[i][1],0,yMax,g.by-10,g.ty+10);
                let x2 = map(seg4[i+1][0],0,V_right,g.lx+10,g.rx-10);
                let y2 = map(seg4[i+1][1],0,yMax,g.by-10,g.ty+10);
                if(g.engine == "heat-engine"){
                    arrow([x1,y1],[x2,y2],g.blue,12,4);
                } else {
                    arrow([x2,y2],[x1,y1],g.blue,12,4);
                }
            }
        }
        endShape(); pop();
    }

    function yAxes(){
        let yLabels, ticks, count;
        yMax = Math.round(seg1[0][1]*10)/10+0.1;
        let by = g.by-10;
        
        if(yMax <= 1.5){
            yLabels = ['0.0','0.2','0.4','0.6','0.8','1.0','1.2','1.4'];
            ticks = 4;
            count = Math.round(seg1[0][1]/.05);
            for(let i = 0; i < count; i++){
                if(i%ticks == 0){
                    line(g.lx,by-(by-g.ty)/count*i,g.lx+6,by-(by-g.ty)/count*i);
                    line(g.rx,by-(by-g.ty)/count*i,g.rx-6,by-(by-g.ty)/count*i);
                    push();
                    textSize(15); noStroke();
                    text(yLabels[i/ticks],g.lx-23,by-(by-g.ty)/count*i+5);
                    pop();
                } else {
                    line(g.lx,by-(by-g.ty)/count*i,g.lx+3,by-(by-g.ty)/count*i);
                    line(g.rx,by-(by-g.ty)/count*i,g.rx-3,by-(by-g.ty)/count*i);
                }
            }
        } else {
            yLabels = ['0.0','0.5','1.0','1.5','2.0','2.5','3.0','3.5','4.0'];
            ticks = 5;
            count = Math.round(seg1[0][1]/.1)+1;
            for(let i = 0; i < count; i++){
                if(i%ticks == 0){
                    line(g.lx,by-(by-g.ty)/count*i,g.lx+6,by-(by-g.ty)/count*i);
                    line(g.rx,by-(by-g.ty)/count*i,g.rx-6,by-(by-g.ty)/count*i);
                    push();
                    textSize(15); noStroke();
                    text(yLabels[i/ticks],g.lx-23,by-(by-g.ty)/count*i+5);
                    pop();
                } else {
                    line(g.lx,by-(by-g.ty)/count*i,g.lx+3,by-(by-g.ty)/count*i);
                    line(g.rx,by-(by-g.ty)/count*i,g.rx-3,by-(by-g.ty)/count*i);
                }
            }
        }
    }

    // Need to update the ranges in the curve drawing portion
    function xAxes(){
        let xLabels, ticks;
        let rx = g.rx-10;
        let lx = g.lx+10;
        xMax = seg3[seg3.length-1][0];
        if(xMax < 15){
            xLabels = ['0','2','4','6','8','10','12','14'];
            let xTemp = seg3[seg3.length-1][0];
            count = Math.round(xTemp/.5+1);
            ticks = 4;
            V_right = (xLabels[1]-xLabels[0])/ticks*(count);
            for(let i = 0; i < count+1; i++){
                if(i%ticks == 0){
                    line(lx+(rx-lx)/count*i,g.by,lx+(rx-lx)/count*i,g.by-6);
                    line(lx+(rx-lx)/count*i,g.ty,lx+(rx-lx)/count*i,g.ty+6);
                    push();
                    textSize(15); noStroke();
                    text(xLabels[i/ticks],lx+(rx-lx)/count*i-4,g.by+14);
                    pop();
                } else {
                    line(lx+(rx-lx)/count*i,g.by,lx+(rx-lx)/count*i,g.by-3);
                    line(lx+(rx-lx)/count*i,g.ty,lx+(rx-lx)/count*i,g.ty+3);
                }
            }
        } else if (xMax < 39){
            xLabels = ['0','5','10','15','20','25','30','35','40'];
            let xTemp = seg3[seg3.length-1][0];
            ticks = 4;
            count = Math.round(xTemp/((xLabels[1]-xLabels[0])/ticks)+1);
            V_right = (xLabels[1]-xLabels[0])/ticks*(count);
            for(let i = 0; i < count+1; i++){
                if(i%ticks == 0){
                    line(lx+(rx-lx)/count*i,g.by,lx+(rx-lx)/count*i,g.by-6);
                    line(lx+(rx-lx)/count*i,g.ty,lx+(rx-lx)/count*i,g.ty+6);
                    push();
                    textSize(15); noStroke();
                    text(xLabels[i/ticks],lx+(rx-lx)/count*i-8,g.by+14);
                    pop();
                } else {
                    line(lx+(rx-lx)/count*i,g.by,lx+(rx-lx)/count*i,g.by-3);
                    line(lx+(rx-lx)/count*i,g.ty,lx+(rx-lx)/count*i,g.ty+3);
                }
            }
        } else if (xMax < 80){
            xLabels = [0,10,20,30,40,50,60,70,80,90,100];
            let xTemp = seg3[seg3.length-1][0];
            count = Math.round(xTemp/2.5+1);
            ticks = 4;
            V_right = (xLabels[1]-xLabels[0])/ticks*(count);
            for(let i = 0; i < count+1; i++){
                if(i%ticks == 0){
                    line(lx+(rx-lx)/count*i,g.by,lx+(rx-lx)/count*i,g.by-6);
                    line(lx+(rx-lx)/count*i,g.ty,lx+(rx-lx)/count*i,g.ty+6);
                    push();
                    textSize(15); noStroke();
                    text(xLabels[i/ticks],lx+(rx-lx)/count*i-8,g.by+14);
                    pop();
                } else {
                    line(lx+(rx-lx)/count*i,g.by,lx+(rx-lx)/count*i,g.by-3);
                    line(lx+(rx-lx)/count*i,g.ty,lx+(rx-lx)/count*i,g.ty+3);
                }
            }
        } else if (xMax < 150){
            xLabels = [0,20,40,60,80,100,120,140];
            ticks = 4;
            let xTemp = seg3[seg3.length-1][0];
            count = Math.round(xTemp/5 + 1);
            V_right = (xLabels[1]-xLabels[0])/ticks*count;
            
            for(let i = 0; i < count+1; i++){
                if(i%ticks == 0){
                    line(lx+(rx-lx)/count*i,g.by,lx+(rx-lx)/count*i,g.by-6);
                    line(lx+(rx-lx)/count*i,g.ty,lx+(rx-lx)/count*i,g.ty+6);
                    push();
                    textSize(15); noStroke();
                    if(xLabels[i/ticks] < 100){
                        text(xLabels[i/ticks],lx+(rx-lx)/count*i-8,g.by+14);
                    } else {
                        text(xLabels[i/ticks],lx+(rx-lx)/count*i-12,g.by+14);
                    }
                    pop();
                } else {
                    line(lx+(rx-lx)/count*i,g.by,lx+(rx-lx)/count*i,g.by-3);
                    line(lx+(rx-lx)/count*i,g.ty,lx+(rx-lx)/count*i,g.ty+3);
                }
            }
        } else if (xMax < 350){
            xLabels = [0,50,100,150,200,250,300,350];
            ticks = 5;
            let xTemp = seg3[seg3.length-1][0];
            count = Math.round(xTemp/10);
            V_right = (xLabels[1]-xLabels[0])/ticks*count;
            
            for(let i = 0; i < count+1; i++){
                if(i%ticks == 0){
                    line(lx+(rx-lx)/count*i,g.by,lx+(rx-lx)/count*i,g.by-6);
                    line(lx+(rx-lx)/count*i,g.ty,lx+(rx-lx)/count*i,g.ty+6);
                    push();
                    textSize(15); noStroke();
                    if(xLabels[i/ticks] < 100){
                        text(xLabels[i/ticks],lx+(rx-lx)/count*i-8,g.by+14);
                    } else {
                        text(xLabels[i/ticks],lx+(rx-lx)/count*i-12,g.by+14);
                    }
                    pop();
                } else {
                    line(lx+(rx-lx)/count*i,g.by,lx+(rx-lx)/count*i,g.by-3);
                    line(lx+(rx-lx)/count*i,g.ty,lx+(rx-lx)/count*i,g.ty+3);
                }
            }
        } else if (xMax < 800){
            xLabels = [0,100,200,300,400,500,600,700,800];
            ticks = 5;
            let xTemp = seg3[seg3.length-1][0];
            count = Math.round(xTemp/20);
            V_right = (xLabels[1]-xLabels[0])/ticks*count;
            for(let i = 0; i < count+1; i++){
                if(i%ticks == 0){
                    line(lx+(rx-lx)/count*i,g.by,lx+(rx-lx)/count*i,g.by-6);
                    line(lx+(rx-lx)/count*i,g.ty,lx+(rx-lx)/count*i,g.ty+6);
                    push();
                    textSize(15); noStroke();
                    if(xLabels[i/ticks] < 100){
                        text(xLabels[i/ticks],lx+(rx-lx)/count*i-8,g.by+14);
                    } else {
                        text(xLabels[i/ticks],lx+(rx-lx)/count*i-12,g.by+14);
                    }
                    pop();
                } else {
                    line(lx+(rx-lx)/count*i,g.by,lx+(rx-lx)/count*i,g.by-3);
                    line(lx+(rx-lx)/count*i,g.ty,lx+(rx-lx)/count*i,g.ty+3);
                }
            }
        } else {
            xLabels = [0,200,400,600,800,1000,1200];
            ticks = 4;
            let xTemp = seg3[seg3.length-1][0];
            count = Math.round(xTemp/50);
            V_right = (xLabels[1]-xLabels[0])/ticks*count;
            for(let i = 0; i < count+1; i++){
                if(i%ticks == 0){
                    line(lx+(rx-lx)/count*i,g.by,lx+(rx-lx)/count*i,g.by-6);
                    line(lx+(rx-lx)/count*i,g.ty,lx+(rx-lx)/count*i,g.ty+6);
                    push();
                    textSize(15); noStroke();
                    if(xLabels[i/ticks] < 1000){
                        text(xLabels[i/ticks],lx+(rx-lx)/count*i-12,g.by+14);
                    } else {
                        text(xLabels[i/ticks],lx+(rx-lx)/count*i-16,g.by+14);
                    }
                    pop();
                } else {
                    line(lx+(rx-lx)/count*i,g.by,lx+(rx-lx)/count*i,g.by-3);
                    line(lx+(rx-lx)/count*i,g.ty,lx+(rx-lx)/count*i,g.ty+3);
                }
            }
        }
    }

    push();
    translate(25,height/2+50); rotate(radians(-90));
    textSize(16); noStroke();
    text('pressure (kPa)',0,0);
    pop();
    push();
    textSize(16); noStroke();
    text('volume (     )',200,g.by+40);
    textStyle(ITALIC);
    text('m',262,g.by+40);
    textStyle(NORMAL); textSize(13);
    text('3',276,g.by+36);
    pop();
    
}

// Fills the graph when diagram is on TS mode
function TS_diagram(){
    push(); fill(250); rect(70,50,350,350); pop();
    let S1 = s1(g.V1,g.Th,g.ratio);
    let S2 = s2(g.V2,g.Th,g.ratio);
    let sLower, sHigher;
    let tLower, tHigher;

    yAxes();
    xAxes();
    function yAxes(){
        let ylower = Math.round((g.Tc-20)/10)*10;
        let yupper = Math.round((g.Th+20)/10)*10;
        if(yupper-ylower < 150){
            let ticks = 4; let count = (yupper-ylower)/5;
            let labels = [];
            for(let i = ylower; i <= yupper; i+=20){
                labels.push(i);
            }
            for(let i = 0; i < count+1; i++){
                if(i%ticks == 0){
                    line(g.lx,g.by-(g.by-g.ty)/count*i,g.lx+6,g.by-(g.by-g.ty)/count*i);
                    line(g.rx,g.by-(g.by-g.ty)/count*i,g.rx-6,g.by-(g.by-g.ty)/count*i);
                    push();
                    textSize(15); noStroke();
                    text(labels[i/ticks],g.lx-30,g.by-(g.by-g.ty)/count*i+4)
                    pop();
                } else {
                    line(g.lx,g.by-(g.by-g.ty)/count*i,g.lx+3,g.by-(g.by-g.ty)/count*i);
                    line(g.rx,g.by-(g.by-g.ty)/count*i,g.rx-3,g.by-(g.by-g.ty)/count*i);
                }
            }
        } else {
            let ticks = 5; let count = (yupper-ylower)/10;
            let labels = [];
            for(let i = ylower; i <= yupper; i+=50){
                labels.push(i);
            }
            for(let i = 0; i < count+1; i++){
                if(i%ticks == 0){
                    line(g.lx,g.by-(g.by-g.ty)/count*i,g.lx+6,g.by-(g.by-g.ty)/count*i);
                    line(g.rx,g.by-(g.by-g.ty)/count*i,g.rx-6,g.by-(g.by-g.ty)/count*i);
                    push();
                    textSize(15); noStroke();
                    text(labels[i/ticks],g.lx-30,g.by-(g.by-g.ty)/count*i+4)
                    pop();
                } else {
                    line(g.lx,g.by-(g.by-g.ty)/count*i,g.lx+3,g.by-(g.by-g.ty)/count*i);
                    line(g.rx,g.by-(g.by-g.ty)/count*i,g.rx-3,g.by-(g.by-g.ty)/count*i);
                }
            }
        }
        tLower = ylower; tHigher = yupper;
    }

    function xAxes(){
        let labels = [100,150,200,250,300,350];
        let ticks = 5; let count = (350-100)/10;
        let temp = Math.round((S1-10)/10)*10;
        sLower = temp; sHigher = temp+30;
        labels = [temp,temp+10,temp+20,temp+30];
        ticks = 5; count = 30/2;
        for(let i = 0; i < count+1; i++){
            if(i%ticks == 0){
                line(g.lx+10+(g.rx-(g.lx+10))/count*i,g.by,g.lx+10+(g.rx-(g.lx+10))/count*i,g.by-6);
                push();
                textSize(15); noStroke();
                text(labels[i/ticks],g.lx+10+(g.rx-(g.lx+10))/count*i-12,g.by+14);
                pop();
            } else {
                line(g.lx+10+(g.rx-(g.lx+10))/count*i,g.by,g.lx+10+(g.rx-(g.lx+10))/count*i,g.by-3);
            }
        }

    }

    push();
    noStroke(); textSize(16);
    text('entropy (kJ/mol K)',180,g.by+35);
    translate(25,height/2+50);
    rotate(radians(-90));
    text('temperature (K)',0,0);
    pop();

    let x1, y1, x2, y2;
    x1 = map(S1,sLower,sHigher,g.lx+10,g.rx);
    x2 = map(S2,sLower,sHigher,g.lx+10,g.rx);
    y1 = map(g.Tc,tLower,tHigher,g.by,g.ty);
    y2 = map(g.Th,tLower,tHigher,g.by,g.ty);

    let xmid, ymid;
    xmid = x1 + (x2-x1)/2;
    ymid = y2 + (y1-y2)/2;
    if(g.engine == 'heat-engine'){
        arrow([x2,y1],[xmid-6,y1],g.red,12,4);
        arrow([x1,y2],[xmid+6,y2],g.red,12,4);
        arrow([x1,y1],[x1,ymid-6],g.blue,12,4);
        arrow([x2,y2],[x2,ymid+6],g.blue,12,4);
    } else {
        arrow([x1,y1],[xmid+6,y1],g.red,12,4);
        arrow([x2,y2],[xmid-6,y2],g.red,12,4);
        arrow([x1,y2],[x1,ymid+6],g.blue,12,4);
        arrow([x2,y1],[x2,ymid-6],g.blue,12,4);
    }

    push();
    strokeWeight(2);
    stroke(g.red);
    line(x1,y1,x2,y1);
    line(x1,y2,x2,y2);
    stroke(g.blue);
    line(x1,y1,x1,y2);
    line(x2,y1,x2,y2);
    pop();

  
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


// Various math functions
function r(T1,T2,gamma){
    return((T2/T1)**(1/(gamma-1)));
}

function c1(T1,T2,V1,V2,gamma){
    let arr = [];
    let dV = (V2-V1)/100;

    for(let i = V1; i <= V2; i+=dV){
        let val = g.R*T2/(1000*i);
        arr.push([i,val]);
    }
    return(arr);
}

function c2(T1,T2,V1,V2,gamma){
    let arr = [];
    let dV = (V1*r(T1,T2,gamma) - V1)/100;

    for(let i = V1; i <= V1*r(T1,T2,gamma); i+=dV){
        let val = g.R*T2*V1**(gamma-1)/(1000*i**gamma);
        arr.push([i,val]);
    }
    return(arr);
}

function c3(T1,T2,V1,V2,gamma){
    let arr = [];
    let dV = (V2*r(T1,T2,gamma) - V1*r(T1,T2,gamma))/100;
    for(let i = V1*r(T1,T2,gamma); i <= V2*r(T1,T2,gamma); i+=dV){
        let val = g.R*T1/(1000*i);
        arr.push([i,val]);
    }
    return(arr);
}

function c4(T1,T2,V1,V2,gamma){
    let arr = [];
    let dV = (V2*r(T1,T2,gamma) - V2)/100;

    for(let i = V2; i <= V2*r(T1,T2,gamma); i+=dV){
        let val = g.R*T2*V2**(gamma-1)/(1000*i**gamma);
        arr.push([i,val]);
    }
    return(arr);
}

function s1(V1,T2,gamma){
    let val = (g.R/(gamma-1))*Math.log(g.R*T2*V1**(gamma-1));
    return(val);
}

function s2(V2,T2,gamma){
    let val = (g.R/(gamma-1))*Math.log(g.R*T2*V2**(gamma-1));
    return(val);
}