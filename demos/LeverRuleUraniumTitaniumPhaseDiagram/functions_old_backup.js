
function graphDraw(){
    push();
    rect(75,50,400,390);
    rect(g.rx,g.ty,200,390)

    let xLabels = ['0','0.2','0.4','0.6','0.8','1.0'];
    let yLabelsP = ['0','0.5','1.0','1.5'];
    let yLabelsT = ['50','60','70','80','90','100'];
    let count = 1;

    // Y-tick marks
    if(g.diagram == 'P-x-y'){
        for(let i = 0; i < 16; i++){
            if((i+1)%5 == 0){
                line(g.lx,g.by-(g.by-g.ty)/16*(i+1),g.lx+7,g.by-(g.by-g.ty)/16*(i+1));
                line(g.rx,g.by-(g.by-g.ty)/16*(i+1),g.rx-7,g.by-(g.by-g.ty)/16*(i+1));
                push();
                noStroke(); textSize(15);
                text(yLabelsP[count],g.lx-25,g.by-(g.by-g.ty)/16*(i+1)+6);
                count++;
                pop();
            } else {
                line(g.lx,g.by-(g.by-g.ty)/16*(i+1),g.lx+4,g.by-(g.by-g.ty)/16*(i+1));
                line(g.rx,g.by-(g.by-g.ty)/16*(i+1),g.rx-4,g.by-(g.by-g.ty)/16*(i+1));
            }
        }
        push();
        noStroke();
        textSize(20);
        text("mixture is at "+map(g.points[0].y,g.by,g.ty,0,1.6).toFixed(2)+" bar",width/2-170,g.ty-10);
        textSize(15);
        text(yLabelsP[0],g.lx-13,g.by+4);
        fill(100); textSize(18);
        text('vapor',g.rx-70,g.by-10);
        text('liquid',g.lx+20,g.ty+25);
        pop();
    } else {
        count = 0;
        for(let i = 0; i < 25; i++){
            if((i)%5 == 0){
                line(g.lx,g.by-(g.by-g.ty)/25*(i),g.lx+7,g.by-(g.by-g.ty)/25*(i));
                line(g.rx,g.by-(g.by-g.ty)/25*(i),g.rx-7,g.by-(g.by-g.ty)/25*(i));
                push();
                noStroke(); textSize(15);
                text(yLabelsT[count],g.lx-22,g.by-(g.by-g.ty)/25*(i)+6);
                count++;
                pop();
            } else {
                line(g.lx,g.by-(g.by-g.ty)/25*(i),g.lx+4,g.by-(g.by-g.ty)/25*(i));
                line(g.rx,g.by-(g.by-g.ty)/25*(i),g.rx-4,g.by-(g.by-g.ty)/25*(i));
            }
        }
        push();
        noStroke(); 
        textSize(20);
        text("mixture is at "+map(g.points[0].y,g.by,g.ty,50,100).toFixed(1)+"°C ",width/2-170,g.ty-10);
        textSize(15);
        text('100',g.lx-30,g.ty+6);
        fill(100); textSize(18);
        text('liquid',g.rx-70,g.by-10);
        text('vapor',g.lx+20,g.ty+25);
        pop();
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
                text(xLabels[0],g.lx-5,g.by+17);
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
    text('Titanium mole fraction',g.lx+105,g.by+45);
    translate(40,height/2+40);
    rotate(radians(-90));
    if(g.diagram == "P-x-y"){
        text('Pressure (bar)',0,-10);
    } else {
        text('Temperature (°C)',-20,-10);
    }
    pop();
}

function curveDraw(){
    let x,y;
    if(g.diagram == 'P-x-y'){
        push();
        noFill(); strokeWeight(2); stroke(g.blue);
        beginShape();
        for(let i = 0; i <= 1; i += 0.01){
            x = i;
            y = Px(i,g.slider);
            vertex(map(x,0,1,g.lx,g.rx),map(y,0,1.6,g.by,g.ty));
            if(i > .99){
                x = 1;
                y = Px(x,g.slider);
                vertex(map(x,0,1,g.lx,g.rx),map(y,0,1.6,g.by,g.ty));
            }
        }
        endShape();
        stroke(g.green);
        beginShape();
        for(let i = 0; i <= 1; i += 0.01){
            x = i;
            y = Py(i,g.slider);
            vertex(map(x,0,1,g.lx,g.rx),map(y,0,1.6,g.by,g.ty));
            if(i > .99){
                x = 1;
                y = Py(x,g.slider);
                vertex(map(x,0,1,g.lx,g.rx),map(y,0,1.6,g.by,g.ty));
            }
        }
        endShape();
        pop();
        
    } else {
        // liquid curve (blue)
        push();
        noFill(); strokeWeight(2); stroke(g.blue);
        beginShape();
        for(let i = 0; i < 1; i += 0.01){
            x = i;
            y = findRoot(i);
            vertex(map(x,0,1,g.lx,g.rx),map(y,50,100,g.by,g.ty));
            if(i > .99){
                x = 1; y = findRoot(1);
                vertex(map(x,0,1,g.lx,g.rx),map(y,50,100,g.by,g.ty));
            }
        }
        
        endShape();
        pop();

        // vapor curve (green)
        push();
        noFill(); strokeWeight(2); stroke(g.green);
        beginShape();
        for(let i = 0.01; i < 1; i += 0.01){
            if(i == 0.01){
                vertex(g.lx,map(findRoot(0),50,100,g.by,g.ty));
            }
            let Te = findRoot(i);
            y = (gammaB(i)*PsatB(Te)*i)/g.slider;
            vertex(map(y,0,1,g.lx,g.rx),map(Te,50,100,g.by,g.ty));
            if(i > .99){
                x = 1; y = findRoot(1);
                vertex(map(x,0,1,g.lx,g.rx),map(y,50,100,g.by,g.ty));
            }
        }
        endShape();
        pop();
    }
}

function pxyDraw(){
    let temp = g.points[0];
    let liquidTest = false;
    let vaporTest = true;

    let moleFrac = map(temp.x,g.lx,g.rx,0,1); // Mole fraction location of dot
    let pressure = map(temp.y,g.by,g.ty,0,1.6); // Pressure location of the dot

    // Liquid test - is dot above or below the liquid curve
    let liqPressure = Px(moleFrac,g.slider); // Equivalent pressure value at given mole fraction on liquid curve
    if(pressure > liqPressure){
        liquidTest = false;
    } else {
        liquidTest = true;
    }

    // Vapor test - is dot above or below the vapor curve
    let vapPressure = Py(moleFrac,g.slider);
    if(pressure > vapPressure){
        vaporTest = true;
    } else {
        vaporTest = false;
    }

    // Line down from the dot when not in between the curves and bar graph details
    push();
    drawingContext.setLineDash([2,6]); strokeWeight(1.5);
    if(!liquidTest && vaporTest){
        stroke(g.blue);
        line(temp.x,temp.y,temp.x,g.by);
        push();
        noStroke();
        textSize(14); textStyle(ITALIC);
        text('x  = ',g.rx+55,g.by-20);
        textStyle(NORMAL);
        text(moleFrac.toFixed(2),g.rx+80,g.by-20);
        textSize(11);
        text('B',g.rx+62,g.by-15);
        strokeWeight(.5); fill(g.blue);
        rect(g.rx+65,g.by-40,30,-300);
        pop();
    } else if(liquidTest && !vaporTest){
        stroke(g.green);
        line(temp.x,temp.y,temp.x,g.by);
        push();
        noStroke(); 
        textSize(14); textStyle(ITALIC);
        text('y  = ',g.rx+120,g.by-20);
        textStyle(NORMAL);
        text(moleFrac.toFixed(2),g.rx+145,g.by-20);
        textSize(11);
        text('B',g.rx+127,g.by-15);
        strokeWeight(.5); fill(g.green);
        rect(g.rx+130,g.by-40,30,-300);
        pop();
    }
    pop();

    // When in between the curves
    if(liquidTest && vaporTest){
        let greenMoleFrac = pressureVaporSolve(moleFrac,pressure); // Vapor mole fraction
        let greenPressure = Py(greenMoleFrac,g.slider); // Vapor pressure value
        let vaporX = map(greenMoleFrac,0,1,g.lx,g.rx); // Pixel x-coordinate of vapor connection
        let vaporY = map(greenPressure,0,1.6,g.by,g.ty); // Pixel y-coordinate of vapor connection

        let blueMoleFrac = pressureLiquidSolve(moleFrac,pressure); // Liquid mole fraction
        let bluePressure = Px(blueMoleFrac,g.slider); // Liquid pressure value
        let liquidX = map(blueMoleFrac,0,1,g.lx,g.rx); // Pixel x-coord of liquid connection
        let liquidY = map(bluePressure,0,1.6,g.by,g.ty); // Pixel y-coord of vapor connection

        // Apply lever rule to find relative amounts
        let vaporLever = (moleFrac - blueMoleFrac)/(greenMoleFrac - blueMoleFrac);
        let liquidLever = (greenMoleFrac - moleFrac)/(greenMoleFrac - blueMoleFrac);

        // Drawing lines, ellipses, and filling out bar graph
        push();
        drawingContext.setLineDash([5,5]);
        strokeWeight(2); stroke(g.blue);
        line(temp.x,temp.y,vaporX,vaporY);
        stroke(g.green);
        line(temp.x,temp.y,liquidX,liquidY);

        drawingContext.setLineDash([2,6]);
        strokeWeight(1.5); stroke(g.green);
        line(vaporX,vaporY,vaporX,g.by);
        stroke(g.blue);
        line(liquidX,liquidY,liquidX,g.by);

        noStroke(); fill(g.green);
        ellipse(vaporX,vaporY,2*g.radius)
        fill(g.blue);
        ellipse(liquidX,liquidY,2*g.radius);
        pop();

        push();
        noStroke(); 
        textSize(14); textStyle(ITALIC);
        text('y  = ',g.rx+120,g.by-20);
        text('x  = ',g.rx+55,g.by-20);
        textStyle(NORMAL);
        text(greenMoleFrac.toFixed(2),g.rx+145,g.by-20);
        text(blueMoleFrac.toFixed(2),g.rx+80,g.by-20);
        textSize(11);
        text('B',g.rx+127,g.by-15);
        text('B',g.rx+62,g.by-15);
        strokeWeight(.5); fill(g.green);
        pop();

        push();
        strokeWeight(.5); fill(g.green);
        rect(g.rx+130,g.by-40,30,map(vaporLever,0,1,0,-300));
        fill(g.blue);
        rect(g.rx+65,g.by-40,30,map(liquidLever,0,1,0,-300));
        pop();
    }
    
}

function pressureVaporSolve(x,P){
    let currentP = Py(x,g.slider); // Evaluate pressure value for current mole fraction value
    let storedDiff1 = P - currentP; // Used to change mole fraction iteration to account for the change in the curve's slope
    
    let difference = 100; // Variable to stop iteration
    let change = 0.01; // Value to change test mole fraction value
    let count = 0;
    let testFrac = x + change;

    while(Math.abs(difference) > 0.00001 && count < 200){
        // Refines step size
        if(count > 0 && count%10 == 0){
            change = change/2;
        }

        let testPressure = Py(testFrac,g.slider);
        difference = P - testPressure;

        // Test to make sure iteration is going the right way
        if(Math.abs(difference) < Math.abs(storedDiff1)){ // Heading in the right direction (difference is getting smaller)
            storedDiff1 = difference;
        } else if(Math.abs(difference) > Math.abs(storedDiff1)){ // Wrong dirrection (difference is getting larger thus need to iterate in the other direction)
            change = -change; 
            storedDiff1 = difference;
        }
    

        if(Math.abs(difference) > 0.00001){
            testFrac = testFrac + change;
        }
        count++;
    }
    return(testFrac);
}

function pressureLiquidSolve(x,P){
    let currentP = Px(x,g.slider); // Evaluate pressure value for current mole fraction value
    let storedDiff1 = P - currentP; // Used to change mole fraction iteration to account for the change in the curve's slope

    let difference = 100; // Variable to stop iteration
    let change = 0.01; // Value to change test mole fraction value
    let count = 0;
    let testFrac = x + change;

    while(Math.abs(difference) > 0.00001 && count < 200){
        // Refines step size
        if(count > 0 && count%10 == 0){
            change = change/2;
        }

        let testPressure = Px(testFrac,g.slider);
        difference = P - testPressure;

        // Test to make sure iteration is going the right way
        if(Math.abs(difference) < Math.abs(storedDiff1)){ // Heading in the right direction (difference is getting smaller)
            storedDiff1 = difference;
        } else if(Math.abs(difference) > Math.abs(storedDiff1)){ // Wrong dirrection (difference is getting larger thus need to iterate in the other direction)
            change = -change; 
            storedDiff1 = difference;
        }
    

        if(Math.abs(difference) > 0.00001){
            testFrac = testFrac + change;
        }
        count++;
    }
    return(testFrac);
}

function txyDraw(){
    let temp = g.points[0];
    let liquidTest = true;
    let vaporTest = false;

    let moleFrac = map(temp.x,g.lx,g.rx,0,1); // Mole fraction location of the dot
    let temperature = map(temp.y,g.by,g.ty,50,100); // Temperature location of the dot

    // Liquid test - is dot above or below liquid curve
    liqTemp = findRoot(moleFrac);
    if(temperature > liqTemp){
        liquidTest = true;
    } else {
        liquidTest = false;
    }

    // Vapor test - is dot above or below liquid curve
    // x-values for vapor are not directly in line with the x-value of the dot
    let T = findRoot(moleFrac);
    let vaporTestFrac = temperatureVaporTest(moleFrac,T);
    
    let vapTemp = findRoot(vaporTestFrac);
    if(temperature > vapTemp){
        vaporTest = false;
    } else {
        vaporTest = true;
    }

    // Line down from the dot when not in between the curves and bar graph details
    push();
    drawingContext.setLineDash([2,6]); strokeWeight(1.5);
    if(!liquidTest && vaporTest){
        stroke(g.blue);
        line(temp.x,temp.y,temp.x,g.by);
        push();
        noStroke();
        textSize(14); textStyle(ITALIC);
        text('x  = ',g.rx+55,g.by-20);
        textStyle(NORMAL);
        text(moleFrac.toFixed(2),g.rx+80,g.by-20);
        textSize(11);
        text('B',g.rx+62,g.by-15);
        strokeWeight(.5); fill(g.blue);
        rect(g.rx+65,g.by-40,30,-300);
        pop();
    } else if(liquidTest && !vaporTest){
        stroke(g.green);
        line(temp.x,temp.y,temp.x,g.by);
        push();
        noStroke(); 
        textSize(14); textStyle(ITALIC);
        text('y  = ',g.rx+120,g.by-20);
        textStyle(NORMAL);
        text(moleFrac.toFixed(2),g.rx+145,g.by-20);
        textSize(11);
        text('B',g.rx+127,g.by-15);
        strokeWeight(.5); fill(g.green);
        rect(g.rx+130,g.by-40,30,-300);
        pop();
    }
    pop();

    push();
    if(vaporTest && liquidTest){
        let liquidFrac = temperatureSolve(moleFrac,temperature); // Liquid mole fraction
        let liquidX = map(liquidFrac,0,1,g.lx,g.rx); // Pixel x-coord of liquid fraction
        let liquidY = map(findRoot(liquidFrac),50,100,g.by,g.ty); // Pixel y-coord of liquid fraction

        let vaporFrac = temperatureSolve(moleFrac,temperature); // Vapor mole fraction
        let vaporX = map((gammaB(vaporFrac)*PsatB(temperature)*vaporFrac)/g.slider,0,1,g.lx,g.rx); // Pixel x-coord of vapor fraction
        let vaporY = map(findRoot(vaporFrac),50,100,g.by,g.ty); // Pixel y-coord of vapor fraction
        vaporFrac = map(vaporX,g.lx,g.rx,0,1);

        // Apply lever rule to find relative amounts
        let vaporLever = (moleFrac - liquidFrac)/(vaporFrac - liquidFrac);
        let liquidLever = (vaporFrac - moleFrac)/(vaporFrac - liquidFrac);


        push();
        drawingContext.setLineDash([5,5]);
        strokeWeight(2); stroke(g.blue);
        line(temp.x,temp.y,vaporX,vaporY);
        stroke(g.green);
        line(temp.x,temp.y,liquidX,liquidY);

        drawingContext.setLineDash([2,6]);
        strokeWeight(1.5); stroke(g.green);
        line(vaporX,vaporY,vaporX,g.by);
        stroke(g.blue);
        line(liquidX,liquidY,liquidX,g.by);

        noStroke(); fill(g.green);
        ellipse(vaporX,vaporY,2*g.radius);
        fill(g.blue);
        ellipse(liquidX,liquidY,2*g.radius);
        pop();

        push();
        noStroke(); 
        textSize(14); textStyle(ITALIC);
        text('y  = ',g.rx+120,g.by-20);
        text('x  = ',g.rx+55,g.by-20);
        textStyle(NORMAL);
        text(vaporFrac.toFixed(2),g.rx+145,g.by-20);
        text(liquidFrac.toFixed(2),g.rx+80,g.by-20);
        textSize(11);
        text('B',g.rx+127,g.by-15);
        text('B',g.rx+62,g.by-15);
        strokeWeight(.5); fill(g.green);
        pop();

        push();
        strokeWeight(.5); fill(g.green);
        rect(g.rx+130,g.by-40,30,map(vaporLever,0,1,0,-300));
        fill(g.blue);
        rect(g.rx+65,g.by-40,30,map(liquidLever,0,1,0,-300));
        pop();
    }
    pop();
    

}

function temperatureVaporTest(x,T){
    // Need to align x-coordinates of dot and x value along the curve for associated temp
    let currentX = map((gammaB(x)*PsatB(T)*x)/g.slider,0,1,g.lx,g.rx); // Current x position 
    let temp = g.points[0];


    let storedDiff = temp.x - currentX; // Used to change mole fraction iteration to account for the change in the curve's slope

    let difference = 1000; // Variable to stop iteration
    let change = 0.01; // Value to change test mole fraction value
    let count = 0; // Used to refine step size
    let testFrac = x + change;


    while(Math.abs(difference) > 2 && count < 200){
        // Refines step size
        if(count > 0 && count%10 == 0){
            change = change/2;
        }

        let testTemp = findRoot(testFrac);
        let testX = (gammaB(testFrac)*PsatB(testTemp)*testFrac)/g.slider;

        currentX = map(testX,0,1,g.lx,g.rx);
        difference = temp.x - currentX;

        // Test to make sure iteration is going the right way
        if(Math.abs(difference) < Math.abs(storedDiff)){
            storedDiff = difference
        } else if(Math.abs(difference) > Math.abs(storedDiff)){
            change = -change;
            storedDiff = difference;
        }

        if(Math.abs(difference) > 2){
            testFrac = testFrac + change;
        }
        count++;
    }
    return(testFrac);
}

function temperatureSolve(x,T){
    let currentT = findRoot(x);
    let storedDiff = T - currentT;

    let difference = 100;
    let change = 0.01;
    let count = 0;
    let testFrac = x + change;

    while(Math.abs(difference) > 0.001 && count < 200){
        // Refines step size
        if(count > 0 && count%10 == 0){
            change = change/2;
        }

        let testTemp = findRoot(testFrac);
        difference = T - testTemp;

        // Test to make sure iteration is going the right way
        if(Math.abs(difference) < Math.abs(storedDiff)){
            storedDiff = difference;
        } else if(Math.abs(difference) > Math.abs(storedDiff)){
            change = -change;
            storedDiff = difference;
        }

        if(Math.abs(difference) > 0.001){
            testFrac = testFrac + change;
        }
        count++;
    }
    return(testFrac);
}

function PsatB(temp){
    return((1/750)*10**(6.87987 - 1196.76/(temp+219.161)));
}

function PsatE(temp){
    return((1/750)*10**(8.1122 - 1592.864/(temp+226.184)));
}

function gammaB(x){
    return(Math.exp(((1-x)**2)*(g.A12 + 2*(g.A21-g.A12)*x)));
}

function gammaE(x){
    return(Math.exp((x**2)*(g.A21 + 2*(g.A12 - g.A21)*(1-x))));
}

function Px(x,T){
    let val = gammaB(x)*x*PsatB(T) + gammaE(x)*(1-x)*PsatE(T);
    return(val);
}

function Py(x,T){
    let val = (x/(gammaB(x)*PsatB(T)) + (1-x)/(gammaE(x)*PsatE(T)))**(-1);
    return(val);
}

function findRoot(x){
    // 20 <= Te <= 190
    let count = 0;

    let difference = 100;
    let change = 10;
    let Te = 20;

    while (Math.abs(difference) > 0.000001){
        if(count > 0 && count%5 == 0){
            change = change/2;
        }
        
        let ans = Px(x,Te);
        difference = ans - g.slider;

        if(Math.abs(difference) > 0.000001){ // Prevents Te from being changed once difference is reached
            if(difference > 0){
                Te = Te - change;
            } else {
                Te = Te + change;
            }
        }
    
        count++;
    }
    return(Te);
}



function barGraphFrame(){
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
    textSize(15); noStroke(); fill(0);
    text('Liquid and vapor',g.rx+50,g.ty+20);
    text('mole amounts',g.rx+58,g.ty+35);
    pop();
}