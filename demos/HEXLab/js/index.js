const DOUBLE_TUBE = 0;
const SHELL_TUBE = 1;

window.g = {
    cnv: undefined,
    width: 800,
    height: 480,

    orangeFluidColor: [255, 50, 0, 200],
    blueFluidColor: [0, 80, 255, 180],

    cpC: 4.186, // J / g / K
    cpH: 4.186, // J / g / K
    mDotC: 1, // g / s
    mDotH: 1, // g / s

    UA: 10, // W / K

    Th_in: 40.0,
    Tc_in: 10.0,
    Th_out: 40,
    Tc_out: 10,

    Qdot: 0,

    hexType: SHELL_TUBE,
    rotTargX: 0,
    rotTargY: 0,
    rotX: 0,
    rotY: 0,
}

function preload() {
    font = loadFont('assets/Ubuntu-R.ttf');
}

function setup() {
    g.cnv = createCanvas(g.width, g.height, WEBGL);
    g.cnv.parent("graphics-wrapper");

    dt = doubleTubeGraphic(500, 400);

    // labels = createGraphics(100, 100, WEBGL);
    textFont(font);
    // labels.background(250);
}

function draw() {
    background(250);
    // labels.clear();

    heatTransferRate();

    if (g.hexType == DOUBLE_TUBE) {
        labels = extraLabels();
        image(dt, -250, -200);
        image(labels, -250, -200);
    }
    else {

        clear();
        drag();

        push();
        rotateY(g.rotX);
        rotateX(-g.rotY);

        translate(0, 0, 90);
        shellTubeGraphic(500, 400);

        translate(0, 0, 50);
        shellTubeLabels();
        pop();
    }
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

const coldFlowSlider = document.getElementById("cold-flow-slider");
const coldFlowLabel = document.getElementById("cold-flow-label");

hotFlowSlider.addEventListener("input", function () {
    tmp = Number(hotFlowSlider.value);
    g.mDotH = tmp;
    hotFlowLabel.innerHTML = `${tmp.toFixed(1)}`;
})

coldFlowSlider.addEventListener("input", function () {
    tmp = Number(coldFlowSlider.value);
    g.mDotC = tmp;
    coldFlowLabel.innerHTML = `${tmp.toFixed(1)}`;
})