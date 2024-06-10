window.g = {
    cnv: undefined,

    // Slider vars
    temp: 385,
    xa: .5,

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

    minY: 360,
    maxY: 432,
    maxInputY: 148,


}

function setup() {
    g.cnv = createCanvas(700, 420);
    g.cnv.parent("graphics-wrapper");
    console.log(map(409, g.minY, g.maxY, g.by, g.ty));
}

function draw() {
    background(250);
    frame();
    drawGraphTicks();
    drawEqFunction();
    findPhaseComps();
    drawDot();

    push();
    stroke('black');
    line(g.lx, g.maxInputY, g.rx, g.maxInputY);
    pop();
}

const temper = document.getElementById("temp");
const tempLabel = document.getElementById("temp-label");

const compos = document.getElementById("mole-frac");
const compLabel = document.getElementById("mole-frac-label");

temper.addEventListener("input", function () {
    let tmp = Number(temper.value);
    g.temp = tmp;
    tempLabel.innerHTML = `${tmp}`;
})

compos.addEventListener("input", function () {
    let tmp = Number(compos.value);
    g.xa = tmp;
    compLabel.innerHTML = `${tmp}`;
})