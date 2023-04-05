
function graphDraw(){
    let PE_xlabels = ['150','200','250','300','350','400','450','500'];
    let TS_xlabels = ['0.8','1.0','1.2','1.4','1.6','1.8','2.0'];
    let TS_ylabels = ['240','260','280','300','320','340','360','380'];

    rect(100,50,550,400);
   
    push();
    if(g.axes == 'pressure-enthalpy'){
        // x-axis labels & ticks
        for(let i = 0; i < 35; i++){
            if((i+1)%5 == 0){
                line(g.lx+(g.rx-g.lx)/35*(i+1),g.by,g.lx+(g.rx-g.lx)/35*(i+1),g.by-8);
                line(g.lx+(g.rx-g.lx)/35*(i+1),g.ty,g.lx+(g.rx-g.lx)/35*(i+1),g.ty+8);
                push();
                noStroke(); textSize(18);
                text(PE_xlabels[(i+1)/5],g.lx+(g.rx-g.lx)/35*(i+1)-15,g.by+18);
                pop();
            } else {
                line(g.lx+(g.rx-g.lx)/35*(i+1),g.by,g.lx+(g.rx-g.lx)/35*(i+1),g.by-3);
                line(g.lx+(g.rx-g.lx)/35*(i+1),g.ty,g.lx+(g.rx-g.lx)/35*(i+1),g.ty+3);
            }
            
        }
        // y-axis labels & ticks
        for(let i = 7; i <= 10; i++){
            let y = yPlotting(i/100);
            if(i == 10){
                line(g.lx,y,g.lx+8,y);
                line(g.rx,y,g.rx-8,y);
                push();
                noStroke(); textSize(18);
                text('0.1',g.lx-28,y+5);
                pop();
            } else {
                line(g.lx,y,g.lx+3,y);
                line(g.rx,y,g.rx-3,y);
            }
            
        }
        for(let i = 1; i <= 10; i++){
            let y = yPlotting(i/10);
            if(i == 5 || i == 10){
                line(g.lx,y,g.lx+8,y);
                line(g.rx,y,g.rx-8,y);
                push();
                noStroke(); textSize(18);
                text(i/10,g.lx-30+(i-5)*3,y+5);
                pop();
            } else {
                line(g.lx,y,g.lx+3,y);
                line(g.rx,y,g.rx-3,y);
            }
        }
        for(let i = 1; i <= 5; i++){
            let y = yPlotting(i);
            if(i == 5){
                line(g.lx,y,g.lx+8,y);
                line(g.rx,y,g.rx-8,y);
                push();
                noStroke(); textSize(18);
                text('5',g.lx-15,y+5);
                pop();
            } else {
                line(g.lx,y,g.lx+3,y);
                line(g.rx,y,g.rx-3,y);
            }
        }
        push();
        noStroke(); textSize(18);
        text(PE_xlabels[0],g.lx-15,g.by+18);
        textSize(20);
        text('enthalpy (kJ/kg)',width/2-45,g.by+45);
        translate(40,height/2+50);
        rotate(radians(-90));
        text('pressure (MPa)',0,0);
        pop();

        push();
        noStroke(); textSize(18); fill(100);
        text('liquid',g.lx+25,height/2+20);
        text('two phases',width/2-60,g.by-20);
        text('vapor',g.rx-70,height/2+20);
        pop();

        
    } else {
        // x-axis labels & ticks
        for(let i = 0; i < 24; i++){
            if((i+1)%4 == 0){
                line(g.lx+(g.rx-g.lx)/24*(i+1),g.by,g.lx+(g.rx-g.lx)/24*(i+1),g.by-8);
                line(g.lx+(g.rx-g.lx)/24*(i+1),g.ty,g.lx+(g.rx-g.lx)/24*(i+1),g.ty+8);
                push();
                noStroke(); textSize(18);
                text(TS_xlabels[(i+1)/4],g.lx+(g.rx-g.lx)/24*(i+1)-13,g.by+18);
                pop();
            } else {
                line(g.lx+(g.rx-g.lx)/24*(i+1),g.by,g.lx+(g.rx-g.lx)/24*(i+1),g.by-3);
                line(g.lx+(g.rx-g.lx)/24*(i+1),g.ty,g.lx+(g.rx-g.lx)/24*(i+1),g.ty+3);
            }
        }
        // y-axis labels & ticks
        for(let i = 0; i < 30; i++){
            if(i%4 == 0){
                line(g.lx,g.by-(g.by-g.ty)/31*(i+1),g.lx+8,g.by-(g.by-g.ty)/31*(i+1));
                line(g.rx,g.by-(g.by-g.ty)/31*(i+1),g.rx-8,g.by-(g.by-g.ty)/31*(i+1));
                push();
                noStroke(); textSize(18);
                text(TS_ylabels[i/4],g.lx-34,g.by-(g.by-g.ty)/31*(i+1)+5);
                pop();
            } else {
                line(g.lx,g.by-(g.by-g.ty)/31*(i+1),g.lx+3,g.by-(g.by-g.ty)/31*(i+1));
                line(g.rx,g.by-(g.by-g.ty)/31*(i+1),g.rx-3,g.by-(g.by-g.ty)/31*(i+1));
            }
        }
        push();
        noStroke(); textSize(18);
        text(TS_xlabels[0],g.lx-15,g.by+18);
        textSize(20);
        text('entropy (kJ/[kg K])',width/2-55,g.by+45);
        translate(40,height/2+59);
        rotate(radians(-90));
        text('temperature (K)',0,0);
        pop();
    }
    pop();

}

function curveDraw(){
    if(g.axes == 'pressure-enthalpy'){
        let xStored, yStored;
        push();
        strokeWeight(2); stroke(0,0,200); noFill(); beginShape();
        for(let i = 0; i < plh.length; i++){
            let x = map(plh[i][0],150,500,g.lx,g.rx);
            let y = yPlotting(plh[i][1]);
            if(y > g.by){
                y = g.by;
            }
            vertex(x,y);
            if(i == plh.length-1){ // To close off the curves
                xStored = x;
                yStored = y;
            }
        }
        endShape();
        beginShape();
        for(let i = 0; i < pvh.length; i++){
            let x = map(pvh[i][0],150,500,g.lx,g.rx);
            let y = yPlotting(pvh[i][1]);
            if(y > g.by){
                y = g.by;
            }
            vertex(x,y);
        }
        vertex(xStored,yStored);
        endShape();
        pop();
    } else {
        push();
        strokeWeight(2); stroke(0,150,0); noFill(); beginShape();
        for(let i = 0; i < tls.length; i++){
            let x = map(tls[i][0],.8,2,g.lx,g.rx);
            let y = map(tls[i][1],235,390,g.by,g.ty);
            vertex(x,y);
        }
        vertex(map(tvs[tvs.length-1][0],.8,2,g.lx,g.rx),map(tvs[tvs.length-1][1],235,390,g.by,g.ty)); // closes the loop
        endShape(); 
        beginShape();
        for(let i = 0; i < tvs.length; i++){
            let x = map(tvs[i][0],.8,2,g.lx,g.rx);
            let y = map(tvs[i][1],235,390,g.by,g.ty);
            vertex(x,y);
        }
        endShape(); pop();
    }
}

function PE_OVC(){
    let P1, P2, P3, P4;
    let H1, H2, H3, H4;

    // To hold pixel coordinates
    let one = new Array(2);
    let two = new Array(2);
    let three = new Array(2);
    let four = new Array(2);

    // Based on slider information
    P4 = g.Pcond;
    H4 = find2D(P4,plh,1);
    four[0] = map(H4,150,500,g.lx,g.rx);
    four[1] = yPlotting(P4);
    
    // Based on slider information
    P2 = g.Pevap;
    H2 = find2D(P2,pvh,1);
    two[0] = map(H2,150,500,g.lx,g.rx);
    two[1] = yPlotting(P2);

    // Point 1 at intersection of 4 and 2
    P1 = P2; 
    H1 = H4;
    one[0] = four[0];
    one[1] = two[1];

    // Point 3 at same y-value as 4
    P3 = P4;
    three[1] = four[1];
    let S3;
    switch (g.Pcond){
        case (.6):
            S3 = find2D(P2,svp,0,true);
            H3 = find2D(S3,s06,0,true);
            break;
        case (.7):
            S3 = find2D(P2,svp,0,true);
            H3 = find2D(S3,s07,0,true);
            break;
        case (.8):
            S3 = find2D(P2,svp,0,true);
            H3 = find2D(S3,s08,0,true);
            break;
        case (.9):
            S3 = find2D(P2,svp,0,true);
            H3 = find2D(S3,s09,0,true);
            break;
        case (1):
            S3 = find2D(P2,svp,0,true);
            H3 = find2D(S3,s10,0,true);
            break;
    }
    three[0] = map(H3,150,500,g.lx,g.rx);

    // COP calculation
    let COP = (H2 - H1)/(H3 - H2);

    // Labels for the points
    push();
    ellipse(four[0]-18,four[1]-18,30);
    ellipse(one[0]-18,one[1]+18,30);
    ellipse(two[0]+18,two[1]+18,30);
    ellipse(three[0]+18,three[1]-18,30);
    noStroke(); textSize(20);
    text('4',four[0]-24,four[1]-11);
    text('1',one[0]-24,one[1]+25);
    text('2',two[0]+13,two[1]+25);
    text('3',three[0]+12.5,three[1]-11);
    text('condenser',four[0]+(three[0]-four[0])/2-50,four[1]-5)
    text('evaporator',one[0]+(two[0]-one[0])/2-50,two[1]-5)
    text('COP = '+COP.toFixed(1),width/2-25,g.ty-10);
    pop();

    // Lines and arrows between points
    push();
    drawingContext.setLineDash([5,7]); strokeWeight(2);
    line(four[0],four[1],one[0],one[1]);
    line(two[0],two[1],three[0],three[1]);
    stroke(g.orange);
    line(one[0],one[1],two[0],two[1]);
    stroke(g.purple);
    line(three[0],three[1],four[0],four[1]);
    pop();
    arrow(four,one,0,17,5);
    arrow(one,two,g.orange,17,5);
    arrow(two,three,0,17,5);
    arrow(three,four,g.purple,17,5);

    // Dots at each point
    push();
    noStroke(); fill(0);
    ellipse(one[0],one[1],10);
    ellipse(two[0],two[1],10);
    ellipse(three[0],three[1],10);
    ellipse(four[0],four[1],10);
    pop();

    
}

function TS_OVC(){
    let P1, P2, P3, P4;
    let T1, T2, T3, T4;
    let S1, S2, S3, S4;
    let H1, H2, H3, H4;

    // To hold pixel coordinates
    let one = new Array(2);
    let two = new Array(2);
    let three = new Array(2);
    let four = new Array(2);

    // Point 4 based on slider input
    P4 = g.Pcond;
    H4 = find2D(P4,plh,1);
    S4 = find2D(P4,slp,0);
    T4 = find2D(S4,tls,0);
    four[0] = map(S4,.8,2,g.lx,g.rx);
    four[1] = map(T4,235,390,g.by,g.ty);

    // Point 2 based on slider input
    P2 = g.Pevap;
    H2 = find2D(P2,pvh,1);
    S2 = find2D(P2,svp,0);
    T2 = find2D(S2,tvs,0);
    two[0] = map(S2,.8,2,g.lx,g.rx);
    two[1] = map(T2,235,390,g.by,g.ty);

    // Point 1
    T1 = T2;
    P1 = P2;
    one[1] = two[1];
    // Solving for S1
    H1 = find2D(P4,plh,1);
    let q = (H1 - find2D(P1,plh,1))/(find2D(P1,pvh,1) - find2D(P1,plh,1));
    S1 = q*(find2D(T1,tvs,1) - find2D(T1,tls,1)) + find2D(T1,tls,1);
    one[0] = map(S1,.8,2,g.lx,g.rx);
    

    // Point 3
    S3 = S2;
    three[0] = two[0];
    switch (g.Pcond){
        case (.6):
            T3 = find2D(S3,s6,0,true);
            H3 = find2D(S3,s06,0,true);
            break;
        case (.7):
            T3 = find2D(S3,s7,0,true);
            H3 = find2D(S3,s07,0,true);
            break;
        case (.8):
            T3 = find2D(S3,s8,0,true);
            H3 = find2D(S3,s08,0,true);
            break;
        case (.9):
            T3 = find2D(S3,s9,0,true);
            H3 = find2D(S3,s09,0,true);
            break;
        case (1):
            T3 = find2D(S3,s1,0,true);
            H3 = find2D(S3,s10,0,true);
            break;
    }
    three[1] = map(T3,235,390,g.by,g.ty);

    // Need to define intercept point between points 4 and 3
    let interceptS = find2D(T4,tvs,1);
    let px_int = map(interceptS,.8,2,g.lx,g.rx);

    // COP calculation
    let COP = (H2 - H1)/(H3 - H2);

    // Lines between each point
    push();
    drawingContext.setLineDash([5,7]); strokeWeight(2);
    line(four[0],four[1],one[0],one[1]);
    line(two[0],two[1],three[0],three[1]);
    line(three[0],three[1],px_int,four[1]);
    stroke(g.purple);
    line(four[0],four[1],px_int,four[1]);
    stroke(g.orange);
    line(one[0],one[1],two[0],two[1]);
    pop();
    arrow(four,one,0,17,5);
    arrow(one,two,g.orange,17,5);
    arrow(two,three,0,17,5);
    arrow([px_int,four[1]],four,g.purple,17,5);

    // Dots at each point
    push();
    noStroke(); fill(0);
    ellipse(one[0],one[1],10);
    ellipse(two[0],two[1],10);
    ellipse(three[0],three[1],10);
    ellipse(four[0],four[1],10);
    pop();

    // Labels for the points
    push();
    ellipse(four[0]-18,four[1]-18,30);
    ellipse(one[0]-18,one[1]+18,30);
    ellipse(two[0]+18,two[1]+18,30);
    ellipse(three[0]+18,three[1]-18,30);
    noStroke(); textSize(20);
    text('4',four[0]-24,four[1]-11);
    text('1',one[0]-24,one[1]+25);
    text('2',two[0]+13,two[1]+25);
    text('3',three[0]+12.5,three[1]-11);
    text('condenser',four[0]+(three[0]-four[0])/2-50,four[1]-5)
    text('evaporator',one[0]+(two[0]-one[0])/2-50,two[1]-5)
    text('COP = '+COP.toFixed(1),width/2-25,g.ty-10);
    pop();

    console.log(H1,H2,H3,H4)
}

function cycleDraw(){
    
    generalDraw();
    step1();
    step2();
    step3();
    step4();

    function generalDraw(){
        push();
        translate(3,0);
        // Shapes
        push();
        fill(g.orange); strokeWeight(2); 
        rect(width/2-100,80,160,80); // Condenser
        fill(0,180,200);
        rect(width/2-100,360,160,80); // Evaporator
        fill(0,255,0);
        triangle(60,height/2,35,height/2-40,85,height/2-40); // Throttle
        triangle(60,height/2,35,height/2+40,85,height/2+40);
        quad(width/2+140,height/2-45,width/2+270,height/2-20,width/2+270,height/2+20,width/2+140,height/2+45); // Compressor
        pop();

        // Arrows and lines
        push();
        strokeWeight(2);

        // Condenser QH
        line(width/2-20,75,width/2-20,55);
        arrow([width/2-20,75],[width/2-20,40],0,17,5);

        // Condenser QC
        line(width/2-20,445,width/2-20,478);
        arrow([width/2-20,460],[width/2-20,442],0,17,5);

        // Condenser to throttle
        line(width/2-100,120,60,120); // horizontal
        line(60,120,60,height/2-45); // vertical
        arrow([60,120],[60,height/2-40],0,17,5);

        // Throttle to evaporator
        line(60,height/2+40,60,400); // vertical
        line(60,400,width/2-105,400); // horizontal
        arrow([60,400],[width/2-100,400],0,17,5);

        // Evaporator to compressor
        line(width/2+60,400,width/2+250,400); // horizontal
        line(width/2+250,400,width/2+250,290); // vertical
        arrow([width/2+250,400],[width/2+250,283],0,17,5);

        // Compressor to condenser
        line(width/2+250,235,width/2+250,120); // vertical
        line(width/2+250,120,width/2+65,120); // horizontal
        arrow([width/2+250,120],[width/2+60,120],0,17,5);

        // Compressor W
        line(width-40,height/2,width/2+273,height/2);
        arrow([width-40,height/2],[width/2+270,height/2],0,17,5);

        pop();

        // Labels
        push();
        noStroke(); textSize(22);
        text('condenser',width/2-72.5,125);
        text('evaporator',width/2-72.5,407);
        text('throttle',95,height/2-10);
        text('compressor',width/2+147,height/2+6);

        textSize(18); 
        text('Δ',width/2-48,180); // Condenser
        text('0',width/2-2,180);

        text('Δ',width/2-5,355); // Evap right
        text('0',width/2+43,355);

        text('Δ',width/2-94,355); // Evap left
        text('0',width/2-52,355);

        text('Δ',width/2+47,height/2-10); // Upper compressor
        text('0',width/2+93,height/2-10);

        text('> 0',width/2+90,height/2+20);
        text('Δ',width/2+27,height/2+20);

        // Throttle
        text('Δ',95,height/2+15);
        text('0',140,height/2+15);

        textStyle(ITALIC);
        text('P = ',width/2-35,180); // Condenser
        text('P = ',width/2+10,355); // Evaporator
        text('T = ',width/2-82,355); // Evaporator
        text('Q',width/2-30,33); // Condenser
        text('Q',width/2-30,494); // Evaporator
        text('H =',108,height/2+15);
        text('W',width-35,height/2+5); // Compressor

        text('S =',width/2+60,height/2-10);
        text('T',width/2+40,height/2+20);

        // Subscripts
        textStyle(NORMAL); textSize(14);
        text('H',width/2-16,38); // Condenser
        text('C',width/2-16,498); // Evaporator
        text('2     3',width/2+52,height/2+25);
        pop();

        push();
        line(width/2+63,height/2+21,width/2+75,height/2+21);
        arrow([width/2+63,height/2+21],[width/2+78,height/2+21],0,7,3);
        pop();
        pop();
    }   

    function step1(){
        let test = inCircle([140,430],17.5);
        if(test){
            push();
            line(100,415,200,415);
            line(100,445,200,445);
            arc(100,430,30,30,PI/2,3*PI/2);
            arc(200,430,30,30,3*PI/2,PI/2);
            noStroke(); textSize(20);
            text('two phases',100,436);
            pop();
        } else {
            ellipse(140,430,35);
            push();
            noStroke(); textSize(22);
            text('1',134,438);
            pop();
        }
    }

    function step2(){
        let test = inCircle([525,430],17.5);
        if(test){
            push();
            line(445,415,583,415);
            line(445,445,583,445);
            arc(445,430,30,30,PI/2,3*PI/2);
            arc(583,430,30,30,3*PI/2,PI/2);
            noStroke(); textSize(20);
            text('saturated vapor',445,436);
            pop();
        } else {
            ellipse(525,430,35);
            push();
            noStroke(); textSize(22);
            text('2',519,437);
            pop();
        }
    }

    function step3(){
        let test = inCircle([525,90],17.5);
        if(test){
            push();
            line(435,75,600,75);
            line(435,105,600,105);
            arc(435,90,30,30,PI/2,3*PI/2);
            arc(600,90,30,30,3*PI/2,PI/2);
            noStroke(); textSize(20);
            text('superheated vapor',435,96)
            pop();
        } else {
            ellipse(525,90,35);
            push();
            noStroke(); textSize(22);
            text('3',519,97.5);
            pop();
        }
    }

    function step4(){
        let test = inCircle([140,90],17.5);
        if(test){
            push();
            arc(80,90,30,30,PI/2,3*PI/2);
            line(80,75,220,75);
            line(80,105,220,105);
            arc(220,90,30,30,3*PI/2,PI/2);
            noStroke(); textSize(20);
            text('saturated liquid',80,96);
            pop();
        } else {
            ellipse(140,90,35);
            push();
            noStroke(); textSize(22);
            text('4',134,96.5);
            pop();
        }
    }
}

function find2D(x,array,ind,test){ // Value interpolating for, array to search in, and position in array either 0 or 1
    let ansIndex;
    if(ind == 1){
        ansIndex = 0;
    } else {
        ansIndex = 1;
    }

    let dx, dt, frac;
    let y;
    for(let i = 0; i < array.length-1; i++){
        if(x >= array[i][ind] && x < array[i+1][ind]){
            dx = x - array[i][ind];
            dt = array[i][ind] - array[i+1][ind];
            frac = dx/dt;
            y = array[i][ansIndex] + frac*(array[i][ansIndex] - array[i+1][ansIndex]);
        } else if (x <= array[i][ind] && x > array[i+1][ind]){
            dx = x - array[i][ind];
            dt = array[i][ind] - array[i+1][ind];
            frac = dx/dt;
            y = array[i][ansIndex] + frac*(array[i][ansIndex] - array[i+1][ansIndex]);
        } else if (x < array[0][ind] && test){ // Added test variable to prevent this ratio from automatically being used in cases where there are viable solutions
            let ratio = array[0][ind]/x;
            y = array[0][ansIndex]/ratio;
        }
    }
    return(y);
}

// For plotting on logarithmic axis
function yPlotting(y){
    let dx = (605 - 450)/(Math.log10(0.06) + 2);
    let yTicks = [605,605-dx,605-2*dx,605-3*dx];
    let output;

    if(y <= 0.1){
        output = yTicks[0] - dx*(Math.log10(y) + 2);
    } else if (y <= 1){
        output = yTicks[1] - dx*(Math.log10(y) + 1);
    } else if (y <= 10){
        output = yTicks[2] - dx*Math.log10(y);
    }
    return(output);
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

function inCircle(pos,radius){
    return dist(mouseX,mouseY,pos[0],pos[1]) < radius;
}
