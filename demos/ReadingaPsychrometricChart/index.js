window.g = {
    cnv: undefined,

    // Correspond to the checkboxes
    humidTruth: true,
    enthalpTruth: true,
    specVolTruth: true,
    tempTruth: false,
    displayTruth: false,
    gridTruth: false,

    // Graph edges
    lx: 30,
    rx: 670,
    ty: 30,
    by: 460,

    // Colors to be used repeatedly
    green: [0, 150, 0],
    blue: [0, 50, 255],
    pink: [150, 0, 200],

    // Constants
    MW: 28.97 / 18.02,
    P: 1,

    // For manipulating the dot
    radius: 5,
    points: [],
    nP: 1,
    dragPoint: null,
    test: true,

    // Values determined based on the position of the dot
    dewPoint: 0,
    wetBulb: 0,
    dryBulb: 0,
    enthalp: 0,
    volume: 0,
    relativeHum: 0,

}

// Test
// Test 2

H = { // For enthalpy info
    m: 0,
    b: [],
}
V = { // For specific volume info
    m: 0,
    b: [],
}
w = { // For relative humidity = 100%
    px: [],
}

function setup() {
    g.cnv = createCanvas(780, 600);
    g.cnv.parent("graphics-wrapper");
    g.points.push(createVector(350, 350));
    defineLines();
}

function draw() {
    background(250);
    frameDraw();
    pointTest();
    if (g.enthalpTruth) {
        enthalpDisplay();
        enthalpValueDisp();
    }
    if (g.gridTruth) {
        gridLinesFunc();
    }
    if (g.specVolTruth) {
        volDisplay();
        volValueDisp();
    }
    if (g.displayTruth) {
        displayValues();
    }

    tempDisplay();
    otherCalcs();
    if (g.humidTruth) {
        relHumDisplay();
    }
    //console.log(V.b)
    push();
    fill(0);
    noStroke();
    let temp = g.points[0];
    ellipse(temp.x, temp.y, 2 * g.radius);
    pop();
}

// Event listeners
const relHum = document.getElementById("rel-hum");
const enthalpy = document.getElementById("enthalpy");
const specVol = document.getElementById("spec-vol");
const temperature = document.getElementById("temps");
const displayVals = document.getElementById("disp-vals");
const gridLines = document.getElementById("grid-lines");

relHum.addEventListener("change", () => {
    g.humidTruth = relHum.checked;
});

enthalpy.addEventListener("change", () => {
    g.enthalpTruth = enthalpy.checked;
});

specVol.addEventListener("change", () => {
    g.specVolTruth = specVol.checked;
});

temperature.addEventListener("change", () => {
    g.tempTruth = temperature.checked;
});

displayVals.addEventListener("change", () => {
    g.displayTruth = displayVals.checked;
});

gridLines.addEventListener("change", () => {
    g.gridTruth = gridLines.checked;
});


// For manipulating the position of dot within the triangle
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

    if (g.dragPoint) {
        if (mouseX >= g.lx && mouseX <= g.rx && mouseY <= g.by - 2 && mouseY >= g.ty && g.test) { // Within the area
            g.dragPoint.x = mouseX;
            g.dragPoint.y = mouseY;
        } else if (mouseX < g.lx && g.test && mouseY <= g.by - 2) { // To the left under the curve and outside graph
            g.dragPoint.x = g.lx;
            g.dragPoint.y = mouseY;
        } else if (mouseX >= g.lx && mouseX <= g.rx && mouseY >= g.by - 2) { // Under the graph
            g.dragPoint.x = mouseX;
            g.dragPoint.y = g.by - 2;
        } else if (mouseX >= g.rx && mouseY <= g.by - 2 && mouseY >= g.ty) { // To the right of the graph
            g.dragPoint.x = g.rx;
            g.dragPoint.y = mouseY;
        } else if (mouseX <= g.rx && mouseX >= 462 && mouseY <= g.ty && g.test) { // Above the graph to the right of 100% rel hum
            g.dragPoint.x = mouseX;
            g.dragPoint.y = g.ty;
        } else if (!g.test && mouseX >= g.lx && mouseX <= 462) {
            g.dragPoint.x = mouseX;
            let T = map(mouseX, g.lx, g.rx, -10, 55);
            let phi = phiOmega(1, T);
            let y = map(phi, 0, .033, g.by, g.ty);
            g.dragPoint.y = y;
        }
    }
}

function mouseReleased() {
    g.dragPoint = null;
}

function inCircle(pos, radius) {
    return dist(mouseX, mouseY, pos.x, pos.y) < radius;
}