PISTON = 0;
BAR = 1;

window.g = {
    cnv: undefined,
    width: 800,
    height: 480,

    orange: [230, 100, 0],
    blue: [0, 0, 255],

    display: PISTON,
    temp: 122,
    x_b: .25,
    pistonHeight: 0,
    labels: false,
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
}, [0, 1], [0, 7])

function draw() {
    graph.on_draw();
    drawExtraGraphLabels();
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
    g.pistonHeight = Number(pistSlider.value);
})