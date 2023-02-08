

function graphDraw(){
    let temp_labels = ['0','50','100','150','200','250','300','350','400','450','500','550','600'];
    let s_labels = ['0','1','2','3','4','5','6','7','8','9'];
    
    push();
    textSize(18);
    

    for(let i = 0; i < temp_labels.length; i++){
        if(i > 0 && i < temp_labels.length-1){
            line(g.xL,g.by-(g.by-g.ty)/12*i,g.xL+5,g.by-(g.by-g.ty)/12*i);
        }

        if(i == 0){
            text(temp_labels[i],g.xL-15,g.by-(g.by-g.ty)/12*i+7)
        } else if (i == 1){
            text(temp_labels[i],g.xL-25,g.by-(g.by-g.ty)/12*i+7);
        } else {
            text(temp_labels[i],g.xL-35,g.by-(g.by-g.ty)/12*i+7);
        }
        
    
    }

    for(let i = 0; i < s_labels.length; i++){
        line(g.xL+10+(g.xR-g.xL-20)/9*i,g.by,g.xL+10+(g.xR-g.xL-20)/9*i,g.by-5);
        text(s_labels[i],g.xL+10+(g.xR-g.xL-20)/9*i-5,g.by+20);
    }
    noFill();
    rect(100,40,600,500);
    pop();


    push();
    textSize(20);
    text('entropy (kJ/[kg-K])',width/2-80,height-15);
    translate(35,height/2+70);
    rotate(radians(-90));
    text("temperature (\xB0C)",0,0);
    text("enthalpy (kJ/kg)",10,740)
    pop();

    if(!g.phaseTruth){
    // Drawing the phase curve 
    push();
    strokeWeight(2);
    beginShape();
    for(let i = 0; i < SL.length; i++){
        let x,y;
        x = map(SL[i][0],0,9,g.xL+10,g.xR-10);
        y = map(SL[i][1],0,600,g.by,g.ty);
        vertex(x,y);
    }
    endShape();
    beginShape();
    for(let i = 0; i < SV.length; i++){
        let x,y;
        x = map(SV[i][0],0,9,g.xL+10,g.xR-10);
        y = map(SV[i][1],0,600,g.by,g.ty);
        vertex(x,y);
    }
    endShape();
    pop();
    }
    
    
    
}

function drawGrid(){
    push();
    stroke(0,50);
    for(let i = 1; i < 12; i++){
        line(g.xL,g.by-(g.by-g.ty)/12*i,g.xR,g.by-(g.by-g.ty)/12*i);
    }

    for(let i = 0; i < 19; i++){
        line(g.xL+10+(g.xR-g.xL-20)/18*i,g.by,g.xL+10+(g.xR-g.xL-20)/18*i,g.ty);
    }
    pop();
}

function phaseCurveDraw(){
    push();
    strokeWeight(3); stroke(255,0,255); noFill();
    beginShape(); 
    for(let i = 0; i < SL.length; i++){
        let x = map(SL[i][0],0,9,g.xL+10,g.xR-10);
        let y = map(SL[i][1],0,600,g.by,g.ty);
        vertex(x,y);
        
    }
    endShape();
    stroke(204,85,0); noFill();
    beginShape();
    for(let i = 0; i < SV.length; i++){
        let x = map(SV[i][0],0,9,g.xL+10,g.xR-10);
        let y = map(SV[i][1],0,600,g.by,g.ty);
        vertex(x,y);
    
    }
    endShape();
    noStroke(); fill(0);
    ellipse(map(SV[SV.length-1][0],0,9,g.xL+10,g.xR-10),map(SV[SV.length-1][1],0,600,g.by,g.ty),13);
    textSize(23);
    fill(255);
    rect(width/2-68,height/2-100,130,20);
    fill(0);
    text('critical point',width/2-65,height/2-82);
    push();
    
    translate(210,450);
    rotate(radians(-52));
    fill(255);
    rect(-2,-18,160,20);
    fill(255,0,255);
    text('saturated liquid',0,0);
    pop();

    
    translate(492,330);
    rotate(radians(58));
    fill(255);
    rect(-2,-15,165,15);
    fill(204,85,0);
    text('saturated vapor',0,0);
    
    pop();
}



function phaseEnvelopeCalcs(){
    
    for(let i = 0; i <= 10; i++){
        let temp = [];
        for(let j = 0; j < TPHSV.length; j++){
            temp.push(i/10*TPHSV[j][5] + (1-i/10)*TPHSV[j][4]);
        }
        SQ.push(temp);
    }

    // Saturated liquid curve
    for(let i = 0; i < SQ[0].length; i++){
        let temp = [];
        temp.push(SQ[0][i]); // entropy value
        temp.push(TPHSV[i][0]); // temperature value
        SL.push(temp); // storing in saturated liquid curve info
    }

    // Saturated vapor curve
    for(let i = 0; i < SQ[10].length; i++){
        let temp = [];
        temp.push(SQ[10][i]); // entropy value
        temp.push(TPHSV[i][0]); // temperature value
        SV.push(temp);
    }

}

function qualityLineCalcs(){
    let n = [1,2,3,4,5,6,7,8,9];
    let index;

    for(let i = 0; i < n.length; i++){
        index = n[i];
        let a_line = [];
        for(let j = 0; j < SQ[index].length; j++){
            let temp = [];
            temp.push(SQ[index][j]);
            temp.push(TPHSV[j][0]);
            a_line.push(temp);
        }
        qualityLines.push(a_line);
    }
}

function qualityLineDraw(){

    push(); noFill(); stroke(100,0,100);
    for(let i = 0; i < qualityLines.length; i++){
       
        beginShape();
        for(let j = 0; j < qualityLines[i].length; j++){
            let x = map(qualityLines[i][j][0],0,9,g.xL+10,g.xR-10);
            let y = map(qualityLines[i][j][1],0,600,g.by,g.ty);
            curveVertex(x,y);
    
        }
        endShape();

        if(i == 0){
            push();
            noStroke(); textStyle(ITALIC); textSize(22);
            translate(210,500);
            rotate(radians(-54));
            fill(255);
            rect(-3,-15,73,20);
            fill(100,0,100);
            text('q = 0.1',0,0);
            pop();
        } 
    }
    pop();

    labels();
    function labels(){
        push();
        translate(255,500);
        rotate(radians(-54));
        noStroke(); textStyle(ITALIC); textSize(22);
        fill(255);
        rect(-2,-17,36,21);
        fill(100,0,100);
        text('0.2',0,0)
        pop();

        push();
        translate(295,500);
        rotate(radians(-54));
        noStroke(); textStyle(ITALIC); textSize(22);
        fill(255);
        rect(-2,-17,36,21);
        fill(100,0,100);
        text('0.3',0,0);
        pop();

        push();
        translate(340,500);
        rotate(radians(-54));
        noStroke(); textStyle(ITALIC); textSize(22);
        fill(255);
        rect(-2,-16,36,22);
        fill(100,0,100);
        text('0.4',0,0);
        pop();

        push();
        translate(385,500);
        rotate(radians(-54));
        noStroke(); textStyle(ITALIC); textSize(22);
        fill(255);
        rect(-2,-18,35,20);
        fill(100,0,100);
        text('0.5',0,0);
        pop();

        push();
        translate(430,500);
        rotate(radians(-54));
        noStroke(); textStyle(ITALIC); textSize(22);
        fill(255);
        rect(-2,-17,35,20);
        fill(100,0,100);
        text('0.6',0,0);
        pop();

        push();
        translate(475,500);
        rotate(radians(-54));
        noStroke(); textStyle(ITALIC); textSize(22);
        fill(255);
        rect(-2,-17,35,20);
        fill(100,0,100);
        text('0.7',0,0);
        pop();

        push();
        translate(515,500);
        rotate(radians(-54));
        noStroke(); textStyle(ITALIC); textSize(22);
        fill(255);
        rect(-2,-17,35,20);
        fill(100,0,100);
        text('0.8',0,0);
        pop();

        push();
        translate(560,500);
        rotate(radians(-54));
        noStroke(); textStyle(ITALIC); textSize(22);
        fill(255);
        rect(-2,-17,37,20);
        fill(100,0,100);
        text('0.9',0,0);
        pop();
    }
    
}

function pressureLineCalcs(){
    let n = [0,2,4,9,10,13,18,19,22,27,28,31,36,38,42,44,48];
    let index;

    for(let i = 0; i < n.length; i++){
        index = n[i];
        let a_line = [];
        for(let j = 0; j < PTSH[index].length; j++){
            let temp = [];
            temp.push(PTSH[index][j][2]);
            temp.push(PTSH[index][j][1]);
            a_line.push(temp);
        }
        pressureLines.push(a_line);
    }
}

function pressureLineDraw(){
    push(); noFill(); stroke(0,0,255);
    for(let i = 0; i < pressureLines.length; i++){
        beginShape();
        for(let j = 0; j < pressureLines[i].length; j++){
            let x = map(pressureLines[i][j][0],0,9,g.xL+10,g.xR-10);
            let y = map(pressureLines[i][j][1],0,600,g.by,g.ty);
            if(x <= g.xR){
                vertex(x,y);
            }
        }
        endShape();
    }
    pop();

    labels();

    function labels(){
        push();
        textSize(18); fill(0,0,255); noStroke();
        text('100',422,35);
        text('60',462,35);
        text('40',490,35);
        text('20',520,35);
        text('10',548,35);
        text('5',577,35);
        text('2',602,35);
        text('1',621,35);
        text('0.5',638,35);
        text('0.2',670,35);

        translate(390,155);
        rotate(radians(-63)); textStyle(ITALIC);
        fill(255);
        rect(-3,-12,110,15);
        fill(0,0,255);
        text('P = 100 MPa',0,0);
        pop();

        push();
        translate(504,240); textSize(18);
        rotate(radians(-71)); textStyle(ITALIC); noStroke();
        fill(255);
        rect(-3,-12,70,15);
        fill(0,0,255);
        text('10 MPa',0,0);
        pop();

        push();
        translate(570,310);
        rotate(radians(-75));
        textSize(18); textStyle(ITALIC); noStroke();
        fill(255);
        rect(-3,-12,57,15);
        fill(0,0,255);
        text('1 MPa',0,0);
        pop();

        push();
        translate(622,370);
        rotate(radians(-75));
        textSize(18); noStroke(); textStyle(ITALIC);
        fill(255);
        rect(-3,-12,72,15);
        fill(0,0,255);
        text('0.1 MPa',0,0);
        pop();

        push();
        translate(660,460);
        rotate(radians(-73));
        textSize(18); noStroke(); textStyle(ITALIC);
        fill(255);
        rect(-3,-12,83,15);
        fill(0,0,255);
        text('0.01 MPa',0,0);
        pop();
    }
}

function enthalpyLineDraw(){
    push(); noFill(); stroke(0,150,0);
    for(let i = 0; i < HeqPlot.length; i++){
        beginShape();
        
        for(let j = 0; j < HeqPlot[i].length; j++){
            let x = map(HeqPlot[i][j][0],0,9,g.xL+10,g.xR-10);
            let y = map(HeqPlot[i][j][1],0,600,g.by,g.ty);
            vertex(x,y);
        }
        endShape();
    }

    for(let i = 0; i < consH.length; i++){
        beginShape();
        for(let j = 0; j < consH[i].length; j++){
            let x = map(consH[i][j][0],0,9,g.xL+10,g.xR-10);
            let y = map(consH[i][j][1],0,600,g.by,g.ty);
            vertex(x,y);
        }
        endShape();
    }

    for(let i = 0; i < consH3.length; i++){
        beginShape();
        for(let j = 0; j < consH3[i].length; j++){
            let x = map(consH3[i][j][0],0,9,g.xL+10,g.xR-10);
            let y = map(consH3[i][j][1],0,600,g.by,g.ty);
            vertex(x,y);
        }
        endShape();
    }

    beginShape();
    for(let i = 0; i < Heq2600.length; i++){
        let x = map(Heq2600[i][0],0,9,g.xL+10,g.xR-10);
        let y = map(Heq2600[i][1],0,600,g.by,g.ty);
        vertex(x,y);
    }   
    endShape();

    beginShape();
    for(let i = 0; i < Heq2700.length; i++){
        let x = map(Heq2700[i][0],0,9,g.xL+10,g.xR-10);
        let y = map(Heq2700[i][1],0,600,g.by,g.ty);
        vertex(x,y);
    }   
    endShape();


    beginShape();
    for(let i = 0; i < S26001.length; i++){
        let x = map(S26001[i][0],0,9,g.xL+10,g.xR-10);
        let y = map(S26001[i][1],0,600,g.by,g.ty);
        vertex(x,y);
    }
    endShape();

    beginShape();
    for(let i = 0; i < S26002.length; i++){
        let x = map(S26002[i][0],0,9,g.xL+10,g.xR-10);
        let y = map(S26002[i][1],0,600,g.by,g.ty);
        vertex(x,y);
    }
    endShape();

    beginShape();
    for(let i = 0; i < S27001.length; i++){
        let x = map(S27001[i][0],0,9,g.xL+10,g.xR-10);
        let y = map(S27001[i][1],0,600,g.by,g.ty);
        vertex(x,y);
    }
    endShape();
    beginShape();
    for(let i = 0; i < S27002.length; i++){
        let x = map(S27002[i][0],0,9,g.xL+10,g.xR-10);
        let y = map(S27002[i][1],0,600,g.by,g.ty);
        vertex(x,y);
    }
    endShape();
    pop();

    push(); // Enthalpy data runs over the graph edges and this covers those bits that fall off
    noStroke();
    fill(250);
    rect(g.xR+1,g.ty,150,height)
    rect(width/2,0,width,39);
    pop();

    push();
    textSize(20);
    translate(35,height/2+70);
    rotate(radians(-90));
    text("enthalpy (kJ/kg)",10,740)
    pop();

    labels();

    function labels(){
        push();
        textSize(18); noStroke(); fill(0,100,0);
        text('200',g.xL+10,g.by-30);
        text('400',g.xL+38,g.by-60);
        text('600',g.xL+70,g.by-105);
        text('800',g.xL+102,g.by-145);
        text('1000',g.xL+118,g.by-178);
        text('1200',g.xL+145,g.by-220);
        text('1400',g.xL+166,g.by-260);
        text('1600',g.xL+190,g.by-300);
        text('1800',g.xL+207,g.ty+160);
        text('2000',g.xL+228,g.ty+132);
        text('2200',g.xL+242,g.ty+103);
        text('2400',g.xL+257,g.ty+74);
        text('2600',g.xL+272,g.ty+44);
        
        text('2600',g.xR+7,g.by-40);
        text('2700',g.xR+7,g.by-82);
        text('2800',g.xR+7,g.by-124);
        text('2900',g.xR+7,g.by-168);
        text('3000',g.xR+7,g.by-211);
        text('3100',g.xR+7,g.by-252);
        text('3200',g.xR+7,g.by-293);
        text('3300',g.xR+7,g.ty+166);
        text('3400',g.xR+7,g.ty+126);
        text('3500',g.xR+7,g.ty+86);
        text('3600',g.xR+7,g.ty+47);
        pop();
    }
}