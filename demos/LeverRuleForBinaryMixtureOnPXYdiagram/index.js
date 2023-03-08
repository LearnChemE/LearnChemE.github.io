
window.g = {
    cnv: undefined,

    moleFrac: 0.5,
    pressure: 5,

    xbz: 0.5,
    ybz: 0.5,

    pStarA: 9.9,
    pStarB: 2.9,

    liquidLine: [0,0],

    // Graph edges
    lx: 75,
    rx: 475,
    by: 440,
    ty: 50,

    // Colors to be used repeatedly
    red: [100,0,0],
    blue: [0,70,250],

}

function setup(){
    g.cnv = createCanvas(700,500);
    g.cnv.parent("graphics-wrapper");
    document.getElementsByTagName("main")[0].remove();

}

function draw() {
    background(250);
    graphDraw();
    everythingElse();
    
}



const moleFrac = document.getElementById("mole-fraction");
const moleFracLabel = document.getElementById("mole-fraction-value");

const pressure = document.getElementById("pressure");
const pressureLabel = document.getElementById("pressure-value");

moleFrac.addEventListener("input", function (){
    const temp = Number(moleFrac.value);
    moleFracLabel.innerHTML = `${temp}`;
    g.moleFrac = temp;
});

pressure.addEventListener("input", function (){
    const temp = Number(pressure.value);
    pressureLabel.innerHTML = `${temp}`;
    g.pressure = temp; 
});