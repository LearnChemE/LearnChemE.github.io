
window.g = {
    cnv: undefined,

    // Correspond to the checkboxes
    humidTruth: true,
    enthalpTruth: true,
    specVolTruth: true,
    tempTruth: false,
    displayTruth: false,
    gridTruth: false,

    // Graph edges
    lx: 30,
    rx: 670,
    ty: 30,
    by: 460,

    // Colors to be used repeatedly
    green: [0,150,0],
    blue: [0,50,255],
    pink: [200,0,200],

    // Constants
    MW: 28.97/18.02,
    P: 1,

}

function setup(){
    g.cnv = createCanvas(780,600);
    g.cnv.parent("graphics-wrapper");
}

function draw(){
    background(250);
    frameDraw();
    if(g.humidTruth){
        relHumDisplay();
    }
    if(g.enthalpTruth){
        enthalpDisplay();
    }
}

// Event listeners
const relHum = document.getElementById("rel-hum");
const enthalpy = document.getElementById("enthalpy");
const specVol = document.getElementById("spec-vol");
const temperature = document.getElementById("temps");
const displayVals = document.getElementById("disp-vals");
const gridLines = document.getElementById("grid-lines");

relHum.addEventListener("change", () => {
    g.humidTruth = relHum.checked;
});

enthalpy.addEventListener("change", () => {
    g.enthalpTruth = enthalpy.checked;
});

specVol.addEventListener("change", () => {
    g.specVolTruth = specVol.checked;
});

temperature.addEventListener("change", () => {
    g.tempTruth = temperature.checked;
});

displayVals.addEventListener("change", () => {
    g.displayTruth = displayVals.checked;
});

gridLines.addEventListener("change", () => {
    g.gridTruth = gridLines.checked;
});
