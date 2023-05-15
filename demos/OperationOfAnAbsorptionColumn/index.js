window.g = {
    cnv: undefined,

    // Sliders
    yN1: 100, // Inlet vapor mole ratio
    T: 25, // Temperature
    P: 2.5, // Pressure (atm)
    L: 100, // Solvent flow rant
    y1: 10, // outlet vapor
    x0: 0.05, // inlet liquid
    stage: 1, // stage count (when show diagram with 5 steps is checked)

    // Checkboxes
    LVmin: false,
    show5: false,

    // Colors to be used repeatedly
    blue: [0,0,200],
    green: [0,130,0],
    orange: [255,80,0],
    pink: [250,0,200],

    // Graph edges
    lx: 80,
    rx: 400,
    ty: 40,
    by: 360,

    // X and Y limit values for as the graph limits change
    maxY: 105,
    maxX: 0,

    // Curve equations m and b values (pink and orange lines)
    Lo: [0,0], // lower
    Up: [0,0], // upper

    // Variables for determining if separation is possible
    leftTest: true,
    rightTest: true,

    // Constants to be used
    Ea: 5000,
    R: 8.314,
    T0: 298,
    H0: 211.19,

    diam: 9,


}

function setup(){
    g.cnv = createCanvas(700,420);
    g.cnv.parent("graphics-wrapper");
}

function draw(){
    background(250);
    frame();
    console.log(g.rightTest)
    if(g.show5){
        show5Display();
    } else {
        graphAxes();
        defineLines();
        if(!g.LVmin){
            displayStages(); 
        }
    }
    infiniteStageTest();
}

// EVENT LISTENERS
// Sliders
const IVMR = document.getElementById("inlet-vapor-mole-ratio");
const IVMRlabel = document.getElementById("inlet-vapor-mole-ratio-label");

const tempe = document.getElementById("temperature");
const tempelabel = document.getElementById("temperature-label");

const pres = document.getElementById("pressure");
const preslabel = document.getElementById("pressure-label");

const SFR = document.getElementById("solvent-flow-rate");
const SFRlabel = document.getElementById("solvent-flow-rate-label");

const OV = document.getElementById("outlet-vapor");
const OVlabel = document.getElementById("outlet-vapor-label");

const IL = document.getElementById("inlet-liquid");
const ILlabel = document.getElementById("inlet-liquid-label");

const stage = document.getElementById("stage");
const stagelabel = document.getElementById("stage-label");

// Checkboxes
const LVmin = document.getElementById("L-V-min");
const show5 = document.getElementById("show-diagram");

// Stages slider element for hiding and displaying it
const stageSlider = document.getElementById("stage-slider");

// For graying out slider
const label1 = document.getElementById("label1");
const label2 = document.getElementById("label2");
const label3 = document.getElementById("label3");
const label4 = document.getElementById("label4");
const label5 = document.getElementById("label5");
const label6 = document.getElementById("label6");
const label7 = document.getElementById("label7");

// For preventing movement when slider shows up
let control = document.getElementById("control");

IVMR.addEventListener("input", function(){
    const temp = Number(IVMR.value);
    IVMRlabel.innerHTML = `${temp}`;
    g.yN1 = temp;
});

tempe.addEventListener("input", function(){
    const temp = Number(tempe.value);
    tempelabel.innerHTML = `${temp}`;
    g.T = temp;
});

pres.addEventListener("input", function(){
    const temp = Number(pres.value);
    preslabel.innerHTML = `${temp}`;
    g.P = temp;
});

SFR.addEventListener("input", function(){
    const temp = Number(SFR.value);
    SFRlabel.innerHTML = `${temp}`;
    g.L = temp;
});

OV.addEventListener("input", function(){
    const temp = Number(OV.value);
    OVlabel.innerHTML = `${temp}`;
    g.y1 = temp;
});

IL.addEventListener("input", function(){
    const temp = Number(IL.value);
    ILlabel.innerHTML = `${temp}`;
    g.x0 = temp;
});

stage.addEventListener("input", function(){
    const temp = Number(stage.value);
    stagelabel.innerHTML = `${temp}`;
    g.stage = temp;
});

LVmin.addEventListener("change", () => {
    g.LVmin = LVmin.checked;
});

show5.addEventListener("change", () => {
    g.show5 = show5.checked;
    if(g.show5){
        stageSlider.style.display = "grid";

        IVMR.value = 59;
        IVMRlabel.innerHTML = "59";
        g.yN1 = 59;
        label1.style.color = "grey";

        tempe.value = 25;
        tempelabel.innerHTML = "25";
        g.T = 25;
        label2.style.color = "grey";

        pres.value = 2.5;
        preslabel.innerHTML = "2.5";
        g.P = 2.5;
        label3.style.color = "grey";

        SFR.value = 100;
        SFRlabel.innerHTML = "100";
        g.L = 100;
        label4.style.color = "grey";

        OV.value = 10;
        OVlabel.innerHTML = "10";
        g.y1 = 10;
        label5.style.color = "grey";

        IL.value = 0.05;
        ILlabel.innerHTML = "0.05";
        g.x0 = 0.05;
        label6.style.color = "grey";

        label7.style.color = "grey";
        //control.style.transform("translateY(-2px)")

        // Disabling sliders
        IVMR.disabled = true;
        tempe.disabled = true;
        pres.disabled = true;
        SFR.disabled = true;
        OV.disabled = true;
        IL.disabled = true;
        LVmin.disabled = true;
    } else {
        stageSlider.style.display = "none";
        label1.style.color = "black";
        label2.style.color = "black";
        label3.style.color = "black";
        label4.style.color = "black";
        label5.style.color = "black";
        label6.style.color = "black";
        label7.style.color = "black";

        // Reenabling sliders
        IVMR.disabled = false;
        tempe.disabled = false;
        pres.disabled = false;
        SFR.disabled = false;
        OV.disabled = false;
        IL.disabled = false;
        LVmin.disabled = false;
    }
});

//gridLabel.style.color = 'grey';