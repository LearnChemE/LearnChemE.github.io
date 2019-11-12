let dims, cnv, mainDiv, liquidColor, liquidLine, molNumberSlider, evapFraction, condFraction;
let mol = [];
let liquidLevel = 0.2;
var mols = 50;
var Alpha = 1;
var fracLiq = 0.85;
var molsVapor = [0, 0, 0];//[total, A, B]
var molsLiquid = [0, 0, 0];//[total, A, B]
var xA = 0.5;
var xB = 0.5;
var yA = 0.5;
var yB = 0.5;

function setup() {
    windowResized();
    cnv = createCanvas(dims, dims);
    cnv.parent('main');
    mainDiv = document.getElementById('main');
    background(240);
    liquidColor = color(200, 200, 240);
    frameRate(30);
    for(let i = 0; i < mols; i++) {
        if(i % 2 == 0) {mol.push(new Molecule({'component':'a'}))} else {mol.push(new Molecule({'component':'b'}))};
    }
    molNumberSlider = createSlider(10, 200, 50, 1);
    molNumberSlider.position(dims, 10);
    molNumberSlider.style('width', '100px');
    molNumberSlider.changed(assignGlobals);

    volatilitySlider = createSlider(-1, 1, 0, 0.1);
    volatilitySlider.position(dims, 100);
    volatilitySlider.style('width', '100px');
    volatilitySlider.changed(assignGlobals);
}

function assignGlobals() {
    mols = molNumberSlider.value();
    Alpha = Math.pow(10, volatilitySlider.value());
}

function draw() {
    background(240);
    drawLiquid();
    mol.forEach((m) => m.Draw());
    while(mols < mol.length) {
        let removeThis = mol[mol.length - 1];
        if(removeThis.component == 'a') {if(removeThis.state == 'vapor'){molsVapor[0]--;molsVapor[1]--}else{molsLiquid[0]--;molsLiquid[1]--}}else{if(removeThis.state == 'vapor'){molsVapor[0]--;molsVapor[2]--}else{molsLiquid[0]--;molsLiquid[2]--}};
        mol.pop(); removeThis.div.remove();
    }
    while(mols > mol.length) {
        if(mol.length % 2 == 0) {mol.push(new Molecule({'component':'a'}))} else {mol.push(new Molecule({'component':'b'}))};
    }
}

function drawLiquid(){
    push();
    rectMode(CORNER);
    noStroke();
    fill(liquidColor);
    rect(0, liquidLine, dims, dims);
    pop();
}

function windowResized() {
    dims = Math.min(400, Math.min(windowWidth - 100, windowHeight - 100));
    liquidLine = dims - liquidLevel * dims;
    evapFraction = ((1 - fracLiq) * (dims - liquidLine) / dims) / ((1 - fracLiq) * (dims - liquidLine) / dims + fracLiq * liquidLine / dims);
    condFraction = (fracLiq * liquidLine / dims) / ((1 - fracLiq) * (dims - liquidLine) / dims + fracLiq * liquidLine / dims);
    resizeCanvas(dims, dims);
}