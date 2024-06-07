window.g = {
    cnv: undefined,

    // Slider vars
    temp: 385,
    xA: .5,

    // Colors
    orange: [255, 80, 0],
    pink: [250, 0, 200],
    blue: [0, 0, 150],
    green: [0, 80, 0],

    // Graph frame
    lx: 80,
    rx: 620,
    ty: 40,
    by: 380,
    w: 540,
    h: 340,


}

function setup() {
    g.cnv = createCanvas(700, 420);
    g.cnv.parent("graphics-wrapper");
}

function draw() {
    background(250);
    frame();
    drawGraphTicks();
    drawEqFunction();
}