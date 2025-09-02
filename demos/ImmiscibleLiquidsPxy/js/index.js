const PISTON = 0;
const BAR = 1;

const BENZ_ANT_A = 4.72583;
const BENZ_ANT_B = 1660.652;
const BENZ_ANT_C = -1.461;
const WATER_ANT_A = 3.55959;
const WATER_ANT_B = 643.748;
const WATER_ANT_C = -198.043;

window.g = {
    cnv: undefined,
    width: 800,
    height: 480,

    orange: [230, 100, 0],
    blue: [0, 0, 255],
    green: [0, 150, 0],

    display: PISTON,
    temp: 122,
    x_b: .25,
    pistonHeight: 10,
    press: 6,
    labels: false,
    targetHeight: 10,

    pistonHeightMax: 100,
    Pb: 3,
    Pw: 2,

    vap: 0,
    yb: 0,

}

function preload() {
    // font = loadFont('assets/Ubuntu-R.ttf');
}

function setup() {
    g.cnv = createCanvas(g.width, g.height);
    g.cnv.parent("graphics-wrapper");
}

const graph = new P5_Graph(g.width, g.height, {
    padding: [
        [60, 40],
        [300, 80]
    ],
    xLabelPrecision: 1,
    yLabelPrecision: 1,
    xTitle: 'benzene mole fraction',
    yTitle: 'pressure (bar)',

    yTickCount: 35,
}, [0, 1], [0, 7]);

const barGraph = new P5_Graph(g.width, g.height, {
    padding: [
        [graph.rx + 50, 40],
        [20, 80]
    ],
    xTickEvery: 1,
    xTickCount: 4,
    yLabelPrecision: 1,
    yTickCount: 25,
    disableXLabels: true,
}, [0, 4], [0, 1]);

function draw() {
    g.pistonHeight = lerp(g.pistonHeight, g.targetHeight, .2);

    background(250);
    push();
    // translate(-400, -240);
    // textFont(font);
    graph.on_draw();
    drawExtraGraphLabels();
    drawEqm();

    push();
    translate(0, 0, 1);

    noStroke(); fill('black');
    let pt = graph.mapPoint(g.x_b, g.press);
    circle(...pt, 10);
    if (g.press <= g.Pw + g.Pb) ybLabel();
    pop();

    pop();

    if (g.display == PISTON) {
        translate(400, 240);
        drawPiston();

        // text label
        push();
        translate(0, 0, 1);
        fill('black');
        noStroke();
        textSize(24); textAlign(CENTER, CENTER);
        text('log volume', 0, 130);
        pop();

    }
    else {
        push();
        // translate(-400, -240);
        drawBarGraph();
        pop();
    }

}

const tempSlider = document.getElementById("temp-slider");
const tempLabel = document.getElementById("temp-slider-label");

const pistSlider = document.getElementById("piston-slider");

tempSlider.addEventListener("input", function () {
    tmp = Number(tempSlider.value);
    g.temp = tmp;
    tempLabel.innerHTML = `${tmp}`;
})

pistSlider.addEventListener("input", function () {
    g.targetHeight = Number(pistSlider.value);
})

function liqLine() {
    // return [(g.temp - 125) / 20 * 2.5 + 5.75, 0];
    return [g.Pb + g.Pw, 0]
}

function eqmCurve(x) {
    // let y;
    // let s = (g.temp - 105) / 20;
    // if (x <= .6) {
    //     y = 4 + 2 * (x - 2) + 6.22 * x ** 2; // 6.31
    // }
    // else {
    //     y = 1.14 + 3 * (1 - x) + 6.875 * (1 - x) ** 2; // 3.45
    // }
    // return y * (s * .4 + .60) + 1.11 * s + 1.2;


    return Math.min(g.Pw / (1 - x), g.Pb / x);
}

function getPressure() {
    let p = 2 * (g.temp + 273) / (g.pistonHeight + 50) - 4.2;
    let bubble = g.Pw + g.Pb;
    let x_triple = map(g.temp, 105, 125, .68, .62);

    if (p > bubble) {
        let buffer = 3;
        g.vap = 0;

        if (p - buffer < bubble) {

            if (g.x_b == .85) {
                let maxVap = (1 - g.x_b) / (1 - x_triple)
                g.vap = map(p - bubble, buffer, 0, 0, maxVap);
            }
            else {
                let maxVap = g.x_b / x_triple;
                g.vap = map(p - bubble, buffer, 0, 0, maxVap);
            }

            p = bubble;
        }
        else p = p - buffer;
    }
    g.press = p;
    return p;
}