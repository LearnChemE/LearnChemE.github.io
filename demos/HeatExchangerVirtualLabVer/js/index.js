const DOUBLE_TUBE = 0;
const SHELL_TUBE = 1;

window.g = {
    cnv: undefined,
    width: 800,
    height: 640,
    state: -1,

    name: '',

    playS1: false,
    s1time: 0,
    s1measure: -1,
    animationStartTime: 0,

    orngTime: -1,
    blueTime: -1,

    // dT1selected: false,
    // dT2selected: false,
    // showLmtd: false,

    // s3select: -1,
    // s3measure: [-1, -1, -1, -1],

    orangeFluidColor: [255, 50, 0, 200],
    blueFluidColor: [0, 80, 255, 180],

    cpC: 4.186, // J / g / K
    cpH: 4.186, // J / g / K
    mDotC: 2, // g / s
    mDotH: 1, // g / s

    UA: 10, // W / K
    // eU: 10,

    vols: [1000, 0, 1000, 0],
    hIsFlowing: true,
    cIsFlowing: true,

    Th_in: 40.0,
    Tc_in: 10.0,
    Th_out: 40,
    Tc_out: 10,
    Th_out_observed: 25,
    Tc_out_observed: 25,

    lmtd: 26,
    Qdot: 0,
}

function preload() {
    font = loadFont('assets/Ubuntu-R.ttf');
}

// lmtdGraph = new P5_Graph(500, 450, {
//     title: '',
//     titleFontSize: 20,
//     padding:
//         [[70, 20],
//         [40, 50]],
//     parent: document.body,
//     fill: 250, // This is very slightly darker than the white of the page

//     xTitle: 'location in heat exchanger',
//     yTitle: 'temperature (°C)',
//     xLabelPrecision: 0,
//     yLabelPrecision: 0,

//     xTickEvery: 5,
//     xTickCount: 0,
//     yTickEvery: 5,
//     yTickCount: 25,

//     disableXLabels: true,
//     disableYLabels: false,
// }, [0, 1], [0, 50]);

function setup() {
    g.cnv = createCanvas(g.width, g.height);
    g.cnv.parent("graphics-wrapper");

    dt = doubleTubeGraphic(500, 400);
    dtb = doubleTubeBlue(500, 400, 50, 450, 50);
    dto = doubleTubeOrng(500, 400, 50, 450, 50);
    b = createBeaker();
    bt = beakersAndTubes();

    thiTubes(thi = createGraphics(g.width, g.height));
    thoTubes(tho = createGraphics(g.width, g.height));
    tciTubes(tci = createGraphics(g.width, g.height));
    tcoTubes(tco = createGraphics(g.width, g.height));

    var options = { placement: 'bottom' };
    $("#hi-tooltip").tooltip(options);
    $("#ho-tooltip").tooltip(options);
    $("#ci-tooltip").tooltip(options);
    $("#co-tooltip").tooltip(options);

    if (g.state != 0) { showSimulationControls() } // used for debug

    textFont(font);
    randStartVals();
}

function draw() {
    background(250);
    // labels.clear();

    heatTransferRate();
    drawAll();
}

function drag() {
    if (mouseIsPressed) {
        if (mouseX > 0 && mouseX < width &&
            mouseY > 0 && mouseY < height) {

            let dx = (mouseX - pmouseX) / width / 2;
            let dy = (mouseY - pmouseY) / height / 2;

            g.rotTargX += dx; g.rotTargX = constrain(g.rotTargX, -.5, .5);
            g.rotTargY += dy; g.rotTargY = constrain(g.rotTargY, -.5, .5);
        }
    }
    else {
        g.rotTargX = 0;
        g.rotTargY = 0;
    }

    g.rotX = lerp(g.rotX, g.rotTargX, .1);
    g.rotY = lerp(g.rotY, g.rotTargY, .1);
}

const hotFlowSlider = document.getElementById("hot-flow-slider");
const hotFlowLabel = document.getElementById("hot-flow-label");

const hotTempSlider = document.getElementById("hot-temp-slider");
const hotTempLabel = document.getElementById("hot-temp-label");

const coldFlowSlider = document.getElementById("cold-flow-slider");
const coldFlowLabel = document.getElementById("cold-flow-label");

const coldTempSlider = document.getElementById("cold-temp-slider");
const coldTempLabel = document.getElementById("cold-temp-label");

hotFlowSlider.addEventListener("input", function () {
    tmp = Number(hotFlowSlider.value);
    g.mDotH = tmp;
    hotFlowLabel.innerHTML = `${tmp.toFixed(1)}`;
})

hotTempSlider.addEventListener("input", function () {
    tmp = Number(hotTempSlider.value);
    g.Th_in = tmp;
    hotTempLabel.innerHTML = `${tmp.toFixed(1)}`;
})

coldFlowSlider.addEventListener("input", function () {
    tmp = Number(coldFlowSlider.value);
    g.mDotC = tmp;
    coldFlowLabel.innerHTML = `${tmp.toFixed(1)}`;
})

coldTempSlider.addEventListener("input", function () {
    tmp = Number(coldTempSlider.value);
    g.Tc_in = tmp;
    coldTempLabel.innerHTML = `${tmp.toFixed(1)}`;
})

