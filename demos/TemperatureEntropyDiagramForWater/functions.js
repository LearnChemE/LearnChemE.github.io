

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

    for(let i = 0; i < 10; i++){
        line(g.xL+10+(g.xR-g.xL-20)/9*i,g.by,g.xL+10+(g.xR-g.xL-20)/9*i,g.ty);
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
    text('critical point',width/2-65,height/2-82);
    push();
    
    translate(210,450);
    rotate(radians(-52));
    fill(255);
    rect(-2,-15,160,15);
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

    push();
    translate(250,500);
    rotate(radians(-54));
    noStroke(); textStyle(ITALIC); textSize(22);
    

    fill(100,0,100);
    text('0.2',0,0)
    pop();
}