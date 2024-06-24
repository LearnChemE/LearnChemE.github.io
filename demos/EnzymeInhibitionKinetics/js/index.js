const LINE_BURKE = 0;
const MICH_MENT = 1;

const COMPETITIVE = 0;
const UNCOMPETITIVE = 1;
const NONCOMPETITIVE = 2;
const SELF_INHIBITED = 3;

window.g = {
    cnv: undefined,

    plotType: LINE_BURKE,
    mechType: COMPETITIVE,

    inhConc: 2.0,

    Vmax: 2,
    KM: .5,
    KI: 5,
}

function setup() {
    g.cnv = createCanvas(800, 480);
    g.cnv.parent("graphics-wrapper");
}

const graph = new P5_Graph(800, 480, {
    classList: [""],
    title: "A ⇌ B",
    titleFontSize: 20,
    padding: [
        [60, 20],
        [30, 50],
    ],
    parent: document.getElementById("graph-container"),
    xLabelPrecision: 1,
    yLabelPrecision: 1,
    xTitle: '1 / (substrate concentration) (L/mol)',
    yTitle: '-1 / (rate substrate) ([L s]/mol)',
})

function draw() {
    findGraphAxesRange();
    graph.on_draw();
    drawFunctions();
}

concElement = document.getElementById("conc-slider");
concLabel = document.getElementById("conc-slider-label");

concElement.addEventListener("input", function () {
    tmp = Number(concElement.value);
    g.inhConc = tmp;
    concLabel.innerHTML = `${tmp.toFixed(1)}`;
})