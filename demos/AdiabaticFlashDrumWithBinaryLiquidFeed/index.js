//°C
window.g = {
    cnv: undefined,

    // Slider inputs
    P: .25,
    T: 271,
    moleFrac: .5,

    // Colors to be used repeatedly
    blue: [0,100,200],
    green: [0,200,0],

    // Constants
    Tref: 25,
    cpL1: .11,
    cpL2: .076,
    cpV1: .052,
    cpV2: .034,
    dHvap1: 35.3,
    dHvap2: 40.656,
    nf: 10,
}

let data;
function preload(){
    data = loadJSON("solutions.json");
}
// Moles in feed
mf = {
    lx: 50,
    rx: 200,
    by: 310,
    ty: 190,
}

// Moles in vapor
mv = {
    lx: 500,
    rx: 650,
    by: 170,
    ty: 50,
}

// Moles in liquid
ml = {
    lx: 500,
    rx: 650,
    by: 450,
    ty: 330,    
}

function setup(){
    g.cnv = createCanvas(700,500);
    g.cnv.parent("graphics-wrapper");
    document.getElementsByTagName("main")[0].remove();
    //noLoop();
}

function draw(){
    background(250);
    frame();
    //console.log(data[1])
    //mathAndDisplay();
}

// Event listeners and such
const pressure = document.getElementById("drum-pressure");
const pressureLabel = document.getElementById("drum-pressure-value");
const temperature = document.getElementById("feed-temp");
const temperatureLabel = document.getElementById("feed-temp-value");
const moleFrac = document.getElementById("methanol-feed");
const moleFracLabel = document.getElementById("methanol-feed-value");

pressure.addEventListener("input", function(){
    const temp = Number(pressure.value);
    g.P = temp;
    pressureLabel.innerHTML = `${temp}`;
    setTimeout(redraw(),3000);
});

temperature.addEventListener("input", function(){
    const temp = Number(temperature.value);
    g.T = temp;
    temperatureLabel.innerHTML = `${temp}`;
    setTimeout(redraw(),2000);
});

moleFrac.addEventListener("input", function(){
    const temp = Number(moleFrac.value);
    g.moleFrac = temp;
    moleFracLabel.innerHTML = `${temp}`;
    setTimeout(redraw(),2000);
});