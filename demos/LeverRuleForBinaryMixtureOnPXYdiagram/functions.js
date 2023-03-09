
// Draws constant elements like graph frame and constant curves (liquid and gas)
function graphDraw(){
    push();
    rect(75,50,400,390);
    rect(g.rx,g.ty,200,390)

    let xLabels = ['0.0','0.2','0.4','0.6','0.8','1.0'];
    let yLabels = ['3','4','5','6','7','8','9','10'];
    let count = 0;

    // Y-tick marks
    for(let i = 1; i < 39; i++){
        if((i-3)%5 == 0){ 
            line(g.lx,g.by-(g.by-g.ty)/38*(i),g.lx+7,g.by-(g.by-g.ty)/38*(i));
            line(g.rx,g.by-(g.by-g.ty)/38*(i),g.rx-7,g.by-(g.by-g.ty)/38*(i));
            push(); 
            noStroke(); textSize(15);
            if(count != 7){
                text(yLabels[count],g.lx-12,g.by-(g.by-g.ty)/38*(i)+5);
            } else {
                text(yLabels[count],g.lx-19,g.by-(g.by-g.ty)/38*(i)+5);
            }
            pop(); count++;
        } else {
            line(g.lx,g.by-(g.by-g.ty)/38*(i),g.lx+3,g.by-(g.by-g.ty)/38*(i));
            line(g.rx,g.by-(g.by-g.ty)/38*(i),g.rx-3,g.by-(g.by-g.ty)/38*(i));
        }
    }

    // X-tick marks
    count = 1;
    for(let i = 0; i < 20; i++){
        if((i-3)%4 == 0){
            line(g.lx+(g.rx-g.lx)/20*(i+1),g.by,g.lx+(g.rx-g.lx)/20*(i+1),g.by-7);
            line(g.lx+(g.rx-g.lx)/20*(i+1),g.ty,g.lx+(g.rx-g.lx)/20*(i+1),g.ty+7);
            
            push();
            noStroke(); textSize(15);
            if(count != 5){
                text(xLabels[count],g.lx+(g.rx-g.lx)/20*(i+1)-12,g.by+17);
                count++;
            } 

            if(i == 19){
                text(xLabels[0],g.lx-12,g.by+17);
                text(xLabels[xLabels.length-1],g.rx-12,g.by+17);
            }
            pop();
        } else {
            line(g.lx+(g.rx-g.lx)/20*(i+1),g.by,g.lx+(g.rx-g.lx)/20*(i+1),g.by-3);
            line(g.lx+(g.rx-g.lx)/20*(i+1),g.ty,g.lx+(g.rx-g.lx)/20*(i+1),g.ty+3);
        }
    }

    // X & Y-axis labels
    push();
    textSize(18); noStroke();
    text('Mole fraction benzene',g.lx+105,g.by+45);
    translate(40,height/2+40);
    rotate(radians(-90));
    text('Pressure (kPa)',0,0);
    pop();


    // Liquid curve
    let y1 = g.pStarB; let y2 = g.pStarA;
    let x1 = 0; let x2 = 1;

    let y1px, y2px, x1px, x2px;
    y1px = map(y1,2.4,10,g.by,g.ty);
    y2px = map(y2,2.4,10,g.by,g.ty);
    x1px = map(x1,0,1,g.lx,g.rx);
    x2px = map(x2,0,1,g.lx,g.rx);
    push();
    strokeWeight(2); stroke(g.red);
    line(x1px,y1px,x2px,y2px);
    pop();

    // Storing data about liquid line (to be used later for determining if dot is between the two curves)
    g.liquidLine[0] = (y2px - y1px)/(x2px - x1px); // Slope
    g.liquidLine[1] = y1px - g.liquidLine[0]*x1px; // y-shift value

    // Vapor curve
    // (pStarA*pStarB)/(pStarA + (pstarB - pstarA)*yA);
    push();
    noFill(); stroke(g.blue); strokeWeight(2);
    beginShape(); 
    for(let i = 0; i <= 1.01; i+=0.01){
        let x = map(i,0,1,g.lx,g.rx);
        let y = map((g.pStarA*g.pStarB)/(g.pStarA + (g.pStarB - g.pStarA)*i),2.4,10,g.by,g.ty);
        vertex(x,y);
    }
    endShape();
    pop();

    
}

function everythingElse(){

    let temp = g.points[0];
    ellipse(temp.x,temp.y,5)
    let x,y;

    // Location of purple dot
    push();
    x = temp.x
    y = temp.y
    
    mole = map(x,g.lx,g.rx,0,1);
    pres = map(temp.y,g.by,g.ty,2.4,10);
    

    // Determining if the dot is within the two curves
    let test1;
    let test2;

    // Pixel value of y-coord of liquid line at the x-coord of purple dot
    let ytest1 = g.liquidLine[0]*x + g.liquidLine[1];
    if(y > ytest1){ // Purple dot y-coord under liquid curve
        test1 = true;
    } else {
        test1 = false;
    }

    // Pixel value of y-coord of vapor curve at the x-coord of purple dot
    let ytest2 = map((g.pStarA*g.pStarB)/(g.pStarA + (g.pStarB-g.pStarA)*mole),2.4,10,g.by,g.ty);
    if(y < ytest2){ // Purple dot y-coord above vapor curve
        test2 = true;
    } else {
        test2 = false;
    }
    
    let xR;
    let xRpx, xLpx;
    if(test1 && test2){
        xR = ((g.pStarA*g.pStarB)/pres - g.pStarA)/(g.pStarB - g.pStarA);
        xRpx = map(xR,0,1,g.lx,g.rx);
        xLpx = (y - g.liquidLine[1])/(g.liquidLine[0]);

        push();
        drawingContext.setLineDash([5,5]); strokeWeight(1.5);
        stroke(g.red);
        line(x,y,xRpx,y); // Purple dot to vapor curve
        stroke(g.blue);
        line(x,y,xLpx,y); // Purple dot to liquid curve
        drawingContext.setLineDash([1,6]);
        stroke(g.red);
        line(xLpx,y,xLpx,g.by); // Liquid curve intersection down to mole frac axis
        stroke(g.blue);
        line(xRpx,y,xRpx,g.by); // Vapor curve intersection down to mole frac axis
        noStroke();
        fill(g.blue);
        ellipse(xRpx,y,9); // Vapor curve intersection
        fill(g.red);
        ellipse(xLpx,y,9); // Liquid curve intersection
        pop();

        // Determining mole fractions of each part
        g.xbz = (map(xLpx,g.lx,g.rx,0,1)).toFixed(2);
        g.ybz = (map(xRpx,g.lx,g.rx,0,1)).toFixed(2);


        // Lever rule
        let liquidLever = Math.abs(xLpx - x);
        let vaporLever = Math.abs(xRpx - x);

        let liquidAmt = (vaporLever/liquidLever)/(1 + (vaporLever/liquidLever));
        let vaporAmt = 1 - liquidAmt;

        let height1 = map(liquidAmt,0,1,0,-300);
        let height2 = map(vaporAmt,0,1,0,-300);
        
        push();
        strokeWeight(.5); fill(g.red);
        rect(g.rx+65,g.by-40,30,height1);
        fill(g.blue);
        rect(g.rx+130,g.by-40,30,height2);
        pop();

        // Right panel labels
        textSize(15); noStroke();
        text('Liquid and vapor',g.rx+50,g.ty+20);
        text('relative amounts',g.rx+50,g.ty+35);
        textSize(14); textStyle(ITALIC);
        text('x  = ',g.rx+55,g.by-20);
        text('y  = ',g.rx+120,g.by-20);
        textStyle(NORMAL); 
        text(g.xbz,g.rx+80,g.by-20);
        text(g.ybz,g.rx+145,g.by-20);
        textSize(11);
        text('B',g.rx+62,g.by-15);
        text('B',g.rx+127,g.by-15);
        pop();

    } else if (test1 && !test2){
        push();
        strokeWeight(.5); fill(g.blue);
        rect(g.rx+130,g.by-40,30,-300);
        pop();
        g.ybz = (map(x,g.lx,g.rx,0,1)).toFixed(2);
        g.xbz = (0).toFixed(2);

        // Right panel labels
        textSize(15); noStroke();
        text('Liquid and vapor',g.rx+50,g.ty+20);
        text('relative amounts',g.rx+50,g.ty+35);
        textSize(14); textStyle(ITALIC);
        text('y  = ',g.rx+120,g.by-20);
        textStyle(NORMAL); 
        text(g.ybz,g.rx+145,g.by-20);
        textSize(11);
        text('B',g.rx+127,g.by-15);
        pop();
    } else if (!test1 && test2){
        push();
        strokeWeight(.5); fill(g.red);
        rect(g.rx+65,g.by-40,30,-300);
        pop();
        g.ybz = (0).toFixed(2);
        g.xbz = (map(x,g.lx,g.rx,0,1)).toFixed(2);
        // Right panel labels
        textSize(15); noStroke();
        text('Liquid and vapor',g.rx+50,g.ty+20);
        text('relative amounts',g.rx+50,g.ty+35);
        textSize(14); textStyle(ITALIC);
        text('x  = ',g.rx+55,g.by-20);
        textStyle(NORMAL); 
        text(g.xbz,g.rx+80,g.by-20);
        textSize(11);
        text('B',g.rx+62,g.by-15);
        pop();
    }


    // Right panel labels
    //rect(g.rx+50,g.by-40,30,-300);
    let count = 0; let xLabels = ['0.0','0.2','0.4','0.6','0.8','1.0'];
    push(); strokeWeight(.5); textSize(15);
    for(let i = 0; i < 20; i++){
        if(i%4 == 0){
            line(g.rx+65,g.by-40-300*i/20,g.rx+75,g.by-40-300*i/20);
            line(g.rx+160,g.by-40-300*i/20,g.rx+150,g.by-40-300*i/20);
            text(xLabels[count],g.rx+40,g.by-35-300*i/20);
            count++;

        } else {
            line(g.rx+65,g.by-40-300*i/20,g.rx+70,g.by-40-300*i/20);
            line(g.rx+160,g.by-40-300*i/20,g.rx+155,g.by-40-300*i/20);
        }
        
    }
    line(g.rx+80,g.by-40,g.rx+80,g.by-45);
    line(g.rx+145,g.by-40,g.rx+145,g.by-45);
    text(xLabels[5],g.rx+40,g.by-335);
    noFill();
    
    rect(g.rx+65,g.by-40,95,-300);
    pop();

    noStroke(); fill(150,0,200);
    ellipse(temp.x,temp.y,10);
    pop();
    
}