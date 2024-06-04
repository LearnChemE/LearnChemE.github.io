window.g = {
    cnv: undefined,

    yN1: 1,
    xN: .11,
    x0: .35,
    P: 2.5,
    T: 13,

    show5: false,
    LVmin: false,

    // Colors to be used repeatedly
    blue: [0, 0, 200],
    green: [0, 130, 0],
    orange: [255, 80, 0],
    pink: [250, 0, 200],

    // Graph edges
    lx: 80,
    rx: 400,
    ty: 40,
    by: 360,

    // Constants to be used
    Ea: 5000,
    R: 8.314,
    T0: 298,
    H0: 211.19,


    // Diameter of circles
    diam: 9,

    stagesCount: 5,
    yOut: 25,
    y1: 25,
    LoverV: 100,
    maxX: .4,
    maxY: 30,

    // Equations of the pink and orange line
    // [slope, intercept]
    R: [0, 0], // Operating line
    L: [0, 0], // Equilibrium line



}

function setup() {
    g.cnv = createCanvas(700, 420);
    g.cnv.parent("graphics-wrapper");
}

function draw() {
    background(250);
    frame();
    graphLims();
    if (!g.LVmin && !g.show5) {
        lineDraw();
    }
}

// Event listeners
const IGMR = document.getElementById("inlet-vapor-mole-ratio");
const IGMRlabel = document.getElementById("inlet-vapor-mole-ratio-label");

const inletX = document.getElementById("inlet-x");
const inletXlabel = document.getElementById("inlet-x-label");

const tempe = document.getElementById("temperature");
const templabel = document.getElementById("temperature-label");

const TMR = document.getElementById("target-x");
const TMRlabel = document.getElementById("target-x-label");

const pres = document.getElementById("pressure");
const preslabel = document.getElementById("pressure-label");

const LVmin = document.getElementById("L-V-min");
const show5 = document.getElementById("show-diagram");

const stageSlider = document.getElementById("stage-slider");
const stageLabel = document.getElementById("stage-label");

const label1 = document.getElementById("label1");
const label2 = document.getElementById("label2");
const label3 = document.getElementById("label3");
const label4 = document.getElementById("label4");
const label5 = document.getElementById("label5");
const label6 = document.getElementById("label6");

IGMR.addEventListener("input", function () {
    const temp = Number(IGMR.value);
    IGMRlabel.innerHTML = `${temp}`;
    g.yN1 = temp;
});

inletX.addEventListener("input", function () {
    const temp = Number(inletX.value);
    inletXlabel.innerHTML = `${temp}`;
    g.x0 = temp;
});

tempe.addEventListener("input", function () {
    const temp = Number(tempe.value);
    templabel.innerHTML = `${temp}`;
    g.T = temp;
});

TMR.addEventListener("input", function () {
    const temp = Number(TMR.value);
    TMRlabel.innerHTML = `${temp}`;
    g.xN = temp;
});

pres.addEventListener("input", function () {
    const temp = Number(pres.value);
    preslabel.innerHTML = `${temp}`;
    g.P = temp;
});

stageSlider.addEventListener("input", function () {
    const temp = Number(stageSlider.value);
    stageLabel.innerHTML = `${temp}`;
    g.stagesCount = temp;
});

LVmin.addEventListener("change", () => {
    g.LVmin = LVmin.checked;
});

show5.addEventListener("change", () => {
    g.show5 = show5.checked;
    if (g.show5) {
        stageSlider.style.display = "grid";

        IGMR.value = 1;
        IGMRlabel.innerHTML = "1";
        label1.style.color = "grey";
        g.yN1 = 1;

        inletX.value = .35;
        inletXlabel.innerHTML = "0.35";
        label2.style.color = "grey";
        g.x0 = .35;

        tempe.value = 13;
        templabel.innerHTML = "13";
        label3.style.color = "grey";
        g.T = 13;

        TMR.value = .11;
        TMRlabel.innerHTML = "0.11";
        label4.style.color = "grey";
        g.xN = .11;

        pres.value = 2.4;
        preslabel.innerHTML = "2.4";
        label5.style.color = "grey";
        g.P = 2.4;

        label6.style.color = "grey";

        IGMR.disabled = true;
        inletX.disabled = true;
        tempe.disabled = true;
        TMR.disabled = true;
        pres.disabled = true;
    } else {
        stageSlider.style.display = "none";
        label1.style.color = "black";
        label2.style.color = "black";
        label3.style.color = "black";
        label4.style.color = "black";
        label5.style.color = "black";
        label6.style.color = "black";

        IGMR.disabled = false;
        inletX.disabled = false;
        tempe.disabled = false;
        TMR.disabled = false;
        pres.disabled = false;
    }
});

