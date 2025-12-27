
window.g = {
    cnv: undefined,

    // Slider values
    pointX: 0.5,  // Uranium mole fraction (0 to 1)
    pointT: 720,  // Temperature in °C (600 to 925)

    // Graph edges
    lx: 70,
    rx: 530,
    by: 490,
    ty: 40,

    // For moving the dot around
    radius: 5,
    points: [],
    dragPoint: null,

    // Colors for phases
    liquid: "#ff00ff",      // Magenta for liquid
    solidTi: "#0000ff",     // Blue for Ti(s)
    solidTiU2: "#008700ff",   // Green for TiU2(s)
    solidU: "#ff8400ee",      // Orange for U(s)
    pointColor: "#800080",  // Dark purple for the tracked point
}

function setup(){
    g.cnv = createCanvas(750,580);
    g.cnv.parent("graphics-wrapper");
    try { document.getElementsByTagName("main")[0].remove(); } catch(e) {}
    // Initialize point at (0.5, 720°C) mapped to canvas coordinates
    let initX = map(g.pointX, 0, 1, g.lx, g.rx);
    let initY = map(g.pointT, 600, 925, g.by, g.ty);
    g.points.push(createVector(initX, initY));
}

function draw(){
    background(250);
    
    // Update pointX and pointT from point position
    if(g.points.length > 0) {
        g.pointX = constrain(map(g.points[0].x, g.lx, g.rx, 0, 1), 0, 1);
        g.pointT = constrain(map(g.points[0].y, g.by, g.ty, 600, 925), 600, 925);
    }
    
    drawPhaseDiagram();
    drawPhasePoint();
    drawBarChart();
}

// Uranium mole fraction slider
const uraniumSlider = document.getElementById("uranium-slider");
const uraniumValue = document.getElementById("uranium-value");

uraniumSlider.addEventListener("input", function(){
    const val = Number(uraniumSlider.value);
    uraniumValue.innerHTML = val.toFixed(2);
    g.pointX = val;
    // Update point position
    if(g.points.length > 0) {
        g.points[0].x = map(g.pointX, 0, 1, g.lx, g.rx);
    }
});

// Temperature slider
const tempSlider = document.getElementById("temp-slider");
const tempValue = document.getElementById("temp-value");

tempSlider.addEventListener("input", function(){
    const temp = Number(tempSlider.value);
    tempValue.innerHTML = `${temp}`;
    g.pointT = temp;
    // Update point position
    if(g.points.length > 0) {
        g.points[0].y = map(g.pointT, 600, 925, g.by, g.ty);
    }
});

// For manipulating the position of the point
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
        if(mouseX >= g.lx && mouseX <= g.rx && mouseY >= g.ty && mouseY <= g.by){
            g.dragPoint.x = mouseX;
            g.dragPoint.y = mouseY;
        } else if (mouseX < g.lx && mouseY >= g.ty && mouseY <= g.by){
            g.dragPoint.x = g.lx;
            g.dragPoint.y = mouseY;
        } else if (mouseX < g.lx && mouseY < g.ty){
            g.dragPoint.x = g.lx;
            g.dragPoint.y = g.ty;
        } else if (mouseX >= g.lx && mouseX <= g.rx && mouseY < g.ty){
            g.dragPoint.x = mouseX;
            g.dragPoint.y = g.ty;
        } else if (mouseX > g.rx && mouseY < g.ty){
            g.dragPoint.x = g.rx;
            g.dragPoint.y = g.ty;
        } else if (mouseX > g.rx && mouseY >= g.ty && mouseY <= g.by){
            g.dragPoint.x = g.rx;
            g.dragPoint.y = mouseY;
        } else if (mouseX > g.rx && mouseY > g.by){
            g.dragPoint.x = g.rx;
            g.dragPoint.y = g.by;
        } else if (mouseX <= g.rx && mouseX >= g.lx && mouseY > g.by){
            g.dragPoint.x = mouseX;
            g.dragPoint.y = g.by;
        } else if (mouseX < g.lx && mouseY > g.by){
            g.dragPoint.x = g.lx;
            g.dragPoint.y = g.by;
        }
        
        // Update slider values when dragging
        g.pointX = constrain(map(g.dragPoint.x, g.lx, g.rx, 0, 1), 0, 1);
        g.pointT = constrain(map(g.dragPoint.y, g.by, g.ty, 600, 925), 600, 925);
        
        // Update slider displays
        document.getElementById("uranium-slider").value = g.pointX;
        document.getElementById("uranium-value").innerHTML = g.pointX.toFixed(2);
        document.getElementById("temp-slider").value = g.pointT;
        document.getElementById("temp-value").innerHTML = g.pointT.toFixed(0);
    }
}

function mouseReleased() {
    g.dragPoint = null;
}

function inCircle(pos, radius) {
    return dist(mouseX, mouseY, pos.x, pos.y) < radius;
}