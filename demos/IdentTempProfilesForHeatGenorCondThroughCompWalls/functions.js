
// Draws general shape of and some layers
function frameDraw(){
    // Right side image
    push();
    fill(0);
    for(let i = 0; i <= 2; i++){ // Arrows that indicate air flow
        rect(640+50*i, 230, 1, 300);
        triangle(630+50*i,230,650+50*i,230,640+50*i,200);
    }
    textSize(25); noStroke();
    text("T  = 20\xB0C", 630, 130);
    text("h = 10 W/[m  K]", 595, 180);
    textSize(20);
    text("2",730,168); // superscript in W/[m^2K]
    text("∞",640,135);
    pop();

    // Wall segments
    push();
    strokeWeight(2);
    rect(70,100,500,450);
    for(let i = 0; i < 3; i++){
        if(i == 0){
            if(g.heatWall == 'A'){
                fill(0,181,226,g.alfa);
                rect(70+170*i,100,160,450);
            } else {
                fill(0,181,226);
                rect(70+170*i,100,160,450);
            }
        } else if (i == 1){
            if(g.heatWall == 'B'){
                fill(68,214,44,g.alfa);
                rect(70+170*i,100,160,450);
            } else {
                fill(68,214,44);
                rect(70+170*i,100,160,450);
            }
        } else {
            fill(255,233,0);
            rect(70+170*i,100,160,450);
        } 
    }
    pop();

    // Insulation lines
    push(); strokeWeight(2);
    for(let i = 0; i < 24; i++){
        line(30,140+(350/20)*i,70,120+(350/20)*i);
    }
    pop();

    // Insulation labels
    push(); textSize(25);
    translate(60,height/2+90);
    rotate(radians(-90));
    noStroke(); fill(255);
    rect(-3,-20,110,22);
    fill(0);
    text('insulation',0,0);
    pop();

    // Temperature & distance axes plus label
    push(); strokeWeight(2);
    line(110,500,170,500);
    line(110,500,110,440);
    arrow([110,500],[180,500],0,15,5);
    arrow([110,500],[110,430],0,15,5);
    noStroke();
    textSize(20);
    text('distance',130,485);
    translate(95,510);
    rotate(radians(-90));
    text('temperature',0,0);
    pop();

    // Thermal conductivity labels
    push();
    textSize(19);
    text('k  = '+g.kvalues[0]+' W/[m K]',76,537);
    text('k  = '+g.kvalues[1]+' W/[m K]',246,537);
    text('k  = '+g.kvalues[2]+' W/[m K]',416,537);
    textSize(15);
    text('A',85,543);
    text('B',255,543);
    text('C',425,543);
    pop();
}

// This is used to modify the alpha value to highlight the wall segment that is generating heat
function alphaManipulation(){
    if(g.alfa < 255 && g.upORdown){
        g.alfa++;
        if(g.alfa >= 255){
            g.upORdown = false;
        }
    } else if (!g.upORdown){
        g.alfa--;
        if(g.alfa <= 25){
            g.upORdown = true;
        }
    }
}

// *Randomly* assigns wall for either A or B
function assignWall(){
    let wall = Math.round(Math.random());
    if(wall == 0){
        g.heatWall = 'A';
    } else {
        g.heatWall = 'B';
    }
}

function assignThermalProps(){
    let temp;

    // Wall A
    temp = 25 + Math.round(Math.random()*5); // Between .25 and .3
    g.kvalues[0] = (temp/100).toFixed(2);

    // Wall B
    temp = 12 + Math.round(Math.random()*2); // Between .12 and .14
    g.kvalues[1] = (temp/100).toFixed(2);

    // Wall C
    temp = 13 + Math.round(Math.random()*5); // Between .13 and .18
    g.kvalues[2] = (temp/100).toFixed(2);

    // Thermal resistance
    g.Rtc = Math.round(Math.random()*8)/100;

    // Thermal generation
    g.Q = 7 + Math.round(Math.random()*3);

}

function question(){
    push();
    textSize(27);
    text('Heat generation in wall '+g.heatWall+' = '+g.Q+' kW/m.',70,85);
    pop();
}

// Used to assign the answer orders
function assignAnswers(){
    let answerVec = [];
    let options = ['A','B','C','D','E'];
    let iter = options.length;

    for(let i = 0; i < iter; i++){
        let temp = Math.round(Math.random()*(options.length-1));
        answerVec.push(options[temp]);
        options.splice(temp,1);
    }


    return(answerVec);
}

// For drawing arrows
function arrow(base,tip,color,arrowLength,arrowWidth){ 
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
    stroke(color); fill(color);
    triangle(vert[0],vert[1],vert[2],vert[3],vert[4],vert[5]);
    pop();

}