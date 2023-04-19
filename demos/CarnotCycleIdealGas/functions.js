
// Draws overall graph shape and determines bounds on the axes
function graphDraw(){
    
}

// Figure on the right when in heat engine mode
function HE_figure(){

}

// Figure on the right when in heat pump mode
function HP_figure(){

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
            vertex(map(seg1[i][0],0,xMax,g.lx+10,g.rx-10),map(seg1[i][1],0,yMax,g.by-10,g.ty+10));
            if(i == Math.round(seg1.length/3) || i == 2*Math.round(seg1.length/3)){
                let x1 = map(seg1[i][0],0,xMax,g.lx+10,g.rx-10);
                let y1 = map(seg1[i][1],0,yMax,g.by-10,g.ty+10);
                let x2 = map(seg1[i+1][0],0,xMax,g.lx+10,g.rx-10);
                let y2 = map(seg1[i+1][1],0,yMax,g.by-10,g.ty+10);
                arrow([x2,y2],[x1,y1],g.red,12,4);
            }
        }
        endShape(); beginShape();
        for(let i = 0; i < seg3.length; i++){
            vertex(map(seg3[i][0],0,xMax,g.lx+10,g.rx-10),map(seg3[i][1],0,yMax,g.by-10,g.ty+10));
            if(i == Math.round(seg3.length/3) || i == 2*Math.round(seg3.length/3)){
                let x1 = map(seg3[i+1][0],0,xMax,g.lx+10,g.rx-10);
                let y1 = map(seg3[i+1][1],0,yMax,g.by-10,g.ty+10);
                let x2 = map(seg3[i][0],0,xMax,g.lx+10,g.rx-10);
                let y2 = map(seg3[i][1],0,yMax,g.by-10,g.ty+10);
                arrow([x2,y2],[x1,y1],g.red,12,4);
            }
        }
        endShape(); pop();

        // Blue segments 2 and 4
        push(); noFill(); strokeWeight(2); stroke(g.blue); beginShape();
        for(let i = 0; i < seg2.length; i++){
            vertex(map(seg2[i][0],0,xMax,g.lx+10,g.rx-10),map(seg2[i][1],0,yMax,g.by-10,g.ty+10));
            if(i == Math.round(seg2.length/3) || i == 2*Math.round(seg2.length/3)){
                let x1 = map(seg2[i+1][0],0,xMax,g.lx+10,g.rx-10);
                let y1 = map(seg2[i+1][1],0,yMax,g.by-10,g.ty+10);
                let x2 = map(seg2[i][0],0,xMax,g.lx+10,g.rx-10);
                let y2 = map(seg2[i][1],0,yMax,g.by-10,g.ty+10);
                arrow([x2,y2],[x1,y1],g.blue,12,4);
            }
        }
        endShape(); beginShape();
        for(let i = 0; i < seg4.length; i++){
            vertex(map(seg4[i][0],0,xMax,g.lx+10,g.rx-10),map(seg4[i][1],0,yMax,g.by-10,g.ty+10));
            if(i == Math.round(seg4.length/3) || i == 2*Math.round(seg4.length/3)){
                let x1 = map(seg4[i][0],0,xMax,g.lx+10,g.rx-10);
                let y1 = map(seg4[i][1],0,yMax,g.by-10,g.ty+10);
                let x2 = map(seg4[i+1][0],0,xMax,g.lx+10,g.rx-10);
                let y2 = map(seg4[i+1][1],0,yMax,g.by-10,g.ty+10);
                arrow([x2,y2],[x1,y1],g.blue,12,4);
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
            let xTemp = Math.round(seg3[seg3.length-1][0]);
            count = Math.round(xTemp/.5);
            ticks = 4;
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
            let xTemp = Math.round(seg3[seg3.length-1][0]);
            count = xTemp/1;
            ticks = 4;
            console.log(xMax)
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
        } else if (xMax < 76){
            xLabels = [0,10,20,30,40,50,60,70,80,90,100];
            let xTemp = Math.round(seg3[seg3.length-1][0]);
            count = xTemp/2;
            ticks = 4;
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