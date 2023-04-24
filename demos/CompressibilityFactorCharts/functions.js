
// Draws the general graph shape 
function frameDraw(){
    push();
    fill(250);
    rect(75,50,600,400);
    pop();

    // Y-axis label
    push();
    translate(-20,height/2+170);
    rotate(radians(-90));
    push();
    noStroke(); textSize(18);
    text('compressibility factor',50,50)
    textStyle(ITALIC);
    text('Z =',225,50);
    textSize(15);
    text('P V',260,39);
    text('R T',260,60);
    pop();
    strokeWeight(1.5);
    line(257,43,290,43);
    pop();

    // X-axis label
    push();
    noStroke(); textSize(18);
    text('reduced pressure',width/2-100,g.by+40);
    textStyle(ITALIC);
    text('P  = P/P',width/2+45,g.by+40);
    textStyle(NORMAL); textSize(15);
    text('r',width/2+57,g.by+43);
    text('c',width/2+111,g.by+43);
    pop();

    // X-axis ticks
    let ticks = 5;
    let count = Math.round(5/.2);
    let xLabel = [0,1,2,3,4,5];
    for(let i = 0; i < count+1; i++){
        if(i%ticks == 0){
            line(g.lx+(g.rx-g.lx)/count*(i),g.by,g.lx+(g.rx-g.lx)/count*(i),g.by-6);
            line(g.lx+(g.rx-g.lx)/count*(i),g.ty,g.lx+(g.rx-g.lx)/count*(i),g.ty+6);
            push();
            noStroke(); textSize(17);
            text(xLabel[i/ticks],g.lx+(g.rx-g.lx)/count*i-5,g.by+20);
            pop();
        } else {
            line(g.lx+(g.rx-g.lx)/count*(i),g.by,g.lx+(g.rx-g.lx)/count*(i),g.by-3);
            line(g.lx+(g.rx-g.lx)/count*(i),g.ty,g.lx+(g.rx-g.lx)/count*(i),g.ty+3);
        }
    }

    // Y-axis ticks
    ticks = 4;
    count = Math.round(1.1/.05);
    let yLabel = [0.0,0.2,0.4,0.6,0.8,1.0];
    for(let i = 0; i < count+1; i++){
        if(i%ticks == 0){
            line(g.lx,g.by-(g.by-g.ty)/count*i,g.lx+6,g.by-(g.by-g.ty)/count*i);
            line(g.rx,g.by-(g.by-g.ty)/count*i,g.rx-6,g.by-(g.by-g.ty)/count*i);
            push();
            noStroke(); textSize(17);
            text(yLabel[i/ticks].toFixed(1),g.lx-26,g.by-(g.by-g.ty)/count*i+5);
            pop();
        } else {
            line(g.lx,g.by-(g.by-g.ty)/count*i,g.lx+3,g.by-(g.by-g.ty)/count*i);
            line(g.rx,g.by-(g.by-g.ty)/count*i,g.rx-3,g.by-(g.by-g.ty)/count*i);
        }
    }
}

function curveDraw(){
    for(let i = 0; i < g.vec.length; i++){
        push(); noFill(); strokeWeight(1.5); beginShape();
        for(let j = 0; j < g.vec[i].length; j++){
            vertex(map(g.vec[i][j][0],0,5,g.lx,g.rx),map(g.vec[i][j][1],0,1.1,g.by,g.ty));
        }
        endShape();
        pop();
    }
    push();
    strokeWeight(2); stroke(0,150,0);
    line(g.lx,map(1,0,1.1,g.by,g.ty),g.rx,map(1,0,1.1,g.by,g.ty));
    noStroke(); fill(0,150,0); textSize(18);
    text('ideal gas behavior',90,80);
    pop();

    let i = 0;
    push(); noFill(); strokeWeight(1.5); beginShape();
    while(Z10[i][0] < .8){
        vertex(map(Z10[i][0],0,5,g.lx,g.rx),map(Z10[i][1],0,1.1,g.by,g.ty));
        i++;
    }
    for(let k = i; k < Z10.length; k++){
        curveVertex(map(Z10[k][0],0,5,g.lx,g.rx),map(Z10[k][1],0,1.1,g.by,g.ty));
        if(k == Z10.length-1){
            curveVertex(map(Z10[k][0],0,5,g.lx,g.rx),map(Z10[k][1],0,1.1,g.by,g.ty));
            
        }
    }
    endShape();
    pop();
}

// For determining if black dot is in between the curves
function boundaryTest(){
    let temp = g.points[0]; let c = g.coeffs;

    // Higher test first checking dot is below Tr=1.8
    let Pr = map(temp.x,g.lx,g.rx,0,5);
    let Ztest = map(temp.y,g.by,g.ty,0,1.1);

    let Zhigher = find2D(Pr,g.vec[7]);
    if(Zhigher <= Ztest){
        g.higherTest = false;
    } else {
        g.higherTest = true;
    }

    let Zlower = find2D(Pr,Z10);
    //console.log(Zlower,Ztest)
    
    if(Zlower < Ztest){
        g.lowerTest = true;
    } else {
        g.lowerTest = false;
    }
    
    


}

function defineVecs(){
    g.vec = [];
    switch (g.element){
        case "n-hexane":
            g.vec.push(xZ11,xZ12,xZ13,xZ14,xZ15,xZ16,xZ17,xZ18);
            break;
        case "carbon-dioxide":
            g.vec.push(cZ11,cZ12,cZ13,cZ14,cZ15,cZ16,cZ17,cZ18);
            break;
        case "ethane":
            g.vec.push(eZ11,eZ12,eZ13,eZ14,eZ15,eZ16,eZ17,eZ18);
            break;
        case "nitrogen":
            g.vec.push(nZ11,nZ12,nZ13,nZ14,nZ15,nZ16,nZ17,nZ18);
            break;
        case "hydrogen":
            g.vec.push(hZ11,hZ12,hZ13,hZ14,hZ15,hZ16,hZ17,hZ18);
            break;
    }
}

function find2D(x,arr){
    let y;
    for(let i = 0; i < arr.length; i++){
        if(x >= arr[i][0] && x <= arr[i+1][0]){
            y = arr[i][1] + (x-arr[i][0])*(arr[i+1][1]-arr[i][1])/(arr[i+1][0]-arr[i][0]);
        }
    }
    return(y);
}
