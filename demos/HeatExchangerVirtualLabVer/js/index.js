const DOUBLE_TUBE = 0;
const SHELL_TUBE = 1;

window.g = {
    cnv: undefined,
    width: 800,
    height: 640,
    state: 0,

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
    hIsFlowing: false,
    cIsFlowing: false,

    Th_in: 40.0,
    Tc_in: 10.0,
    Th_out: 40,
    Tc_out: 10,
    Th_out_observed: 25,
    Tc_out_observed: 25,

    lmtd: 26,
    Qdot: 0,

    dragging1: false,
    dragging2: false,
}

function preload() {
    font = loadFont('assets/Ubuntu-R.ttf');
}

function setup() {
    g.cnv = createCanvas(g.width, g.height);
    g.cnv.parent("graphics-wrapper");

    dt = doubleTubeGraphic(500, 400);
    dtb = doubleTubeBlue(500, 400, 50, 450, 50);
    dto = doubleTubeOrng(500, 400, 50, 450, 50);
    b = createBeaker();
    bt = beakersAndTubes();
    v = valve();

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
    // console.log((1000 / deltaTime).toFixed(1));
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

