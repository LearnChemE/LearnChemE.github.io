
window.g = {
    cnv: undefined,

    xbz: 0.5,
    ybz: 0.5,

    pStarA: 9.9,
    pStarB: 2.9,

    liquidLine: [0,0],

    // Graph edges
    lx: 75,
    rx: 475,
    by: 440,
    ty: 50,

    // Colors to be used repeatedly
    red: [175,0,0],
    blue: [0,70,250],

    // For moving the dot around
    radius: 8,
    points: [],
    nP: 1,
    dragPoint: null,

}

function setup(){
    g.cnv = createCanvas(700,500);
    g.cnv.parent("graphics-wrapper");
    document.getElementsByTagName("main")[0].remove();

    let x, y;
    x = map(.5,0,1,g.lx,g.rx);
    y = map(5,2.4,10,g.by,g.ty);
    g.points.push(createVector(x,y));

}

function draw() {
    background(250);
    graphDraw();
    everythingElse();
    
}

// For manipulating the position of the purple dot
function mousePressed() {
    for (let i = g.points.length - 1; i >= 0; i--) {
      const isPressed = inCircle(g.points[i], g.radius);
      if (isPressed) {
        g.dragPoint = g.points.splice(i, 1)[0];
        g.points.push(g.dragPoint);
      }
    }
}

function mouseDragged() {

    if(g.dragPoint){
        if(mouseX >= g.lx && mouseX <= g.rx && mouseY >= g.ty && mouseY <= g.by){ // Within the graph
            g.dragPoint.x = mouseX;
            g.dragPoint.y = mouseY;
        } else if (mouseX < g.lx && mouseY >= g.ty && mouseY <= g.by){ // Left of the graph
            g.dragPoint.x = g.lx;
            g.dragPoint.y = mouseY;
        } else if (mouseX < g.lx && mouseY < g.ty){ // Upper left corner of the graph
            g.dragPoint.x = g.lx;
            g.dragPoint.y = g.ty;
        } else if (mouseX >= g.lx && mouseX <= g.rx && mouseY < g.ty){ // Above the graph
            g.dragPoint.x = mouseX;
            g.dragPoint.y = g.ty;
        } else if (mouseX > g.rx && mouseY < g.ty){ // Upper right corner of the graph
            g.dragPoint.x = g.rx;
            g.dragPoint.y = g.ty;
        } else if (mouseX > g.rx && mouseY >= g.ty && mouseY <= g.by){ // Right of the graph
            g.dragPoint.x = g.rx;
            g.dragPoint.y = mouseY;
        } else if (mouseX > g.rx && mouseY > g.by){ // Lower right corner of the graph
            g.dragPoint.x = g.rx;
            g.dragPoint.y = g.by;
        } else if (mouseX <= g.rx && mouseX >= g.lx && mouseY > g.by){ // Below the graph
            g.dragPoint.x = mouseX;
            g.dragPoint.y = g.by;
        } else if (mouseX < g.lx && mouseY > g.by){
            g.dragPoint.x = g.lx;
            g.dragPoint.y = g.by;
        }
    }
}

function mouseReleased() {
    g.dragPoint = null;
}

function inCircle(pos, radius) {
    return dist(mouseX, mouseY, pos.x, pos.y) < radius;
}