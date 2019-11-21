let dims, cnv, bc, barHeight, xLabel, xSlider, leftBarLabel, rightBarLabel, leftBarTop, leftBarBottom, rightBarTop, rightBarBottom, mainDiv, liquidColor, liquidLine, alphaLabel, molNumberSlider, molNumberLabel, evapFraction, condFraction;
let mol = [];
let liquidLevel = 0.15;
var mols = 80;
var Alpha = 1;
var fracLiq = 0.85;
var molsVapor = [0, 0, 0];//[total, A, B]
var molsLiquid = [0, 0, 0];//[total, A, B]
var xA = 0.5;
var xB = 0.5;
var yA = 0.5;
var yB = 0.5;
var zA = 0.5;
var xAtarget = 0.5;
var yAtarget = 0.5;

let Acolor = 'rgb(80, 0, 180)';
let Bcolor = 'rgb(130, 180, 0)';

// let checkbox;
var checked = false;

var timeNow = null;

var stop = false;
var frameCount = 0;
var fps, fpsInterval, startTime, now, then, elapsed;
var onoff = true;

function startAnimating(fps) {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    animate();
}

function animate() {
    if (stop) {
        return;
    }
    requestAnimationFrame(animate);
    now = Date.now();
    elapsed = now - then;
    if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);
        drawBarChart();
        //mol.forEach((m) => m.Draw());
        for(let i = onoff ? 0 : 1; i < mol.length; i+=2) {mol[i].Draw()}
        onoff = !onoff;
        while(mols < mol.length) {
            let removeThis = mol[mol.length - 1];
            if(removeThis.component == 'a') {if(removeThis.state == 'vapor'){molsVapor[0]--;molsVapor[1]--}else{molsLiquid[0]--;molsLiquid[1]--}}else{if(removeThis.state == 'vapor'){molsVapor[0]--;molsVapor[2]--}else{molsLiquid[0]--;molsLiquid[2]--}};
            mol.pop(); removeThis.div.remove();
        }
        while(mols > mol.length) {
            if(mol.length % 2 == 0) {mol.push(new Molecule({'component':'a'}))} else {mol.push(new Molecule({'component':'b'}))};
        }
    }
}

window.onload = (event) => {
    addBarChart();
    resize();
    mainDiv = document.getElementById('main');
    for(let i = 0; i < mols; i++) {
        if(i % 2 == 0) {mol.push(new Molecule({'component':'a'}))} else {mol.push(new Molecule({'component':'b'}))};
    }
    addSliders();
    startAnimating(120);
  };

function updateGlobals() {
    Alpha = Math.pow(10, volatilitySlider.value);
    alphaLabel.innerHTML = `relative volatility (&#945): ${Number.parseFloat(Alpha).toFixed(2)}`;
    mols = parseInt(molNumberSlider.value);
    molNumberLabel.innerText = `number of particles: ${mols}`;
    xLabel.innerHTML = `x<sub>A</sub>: ${xAtarget}`;
    xAtarget = parseFloat(xSlider.value);
    yAtarget = (Alpha*xAtarget)/(1 - xAtarget + Alpha*xAtarget);
    zA = xAtarget*fracLiq + (1 - fracLiq)*yAtarget;
    for(let i = 0; i < mol.length; i++) {if(i <= mols*zA){mol[i].ChangeComponent('a');}else{mol[i].ChangeComponent('b');}}
}

function addBarChart() {
    bc = document.createElement('div');
    bc.id = 'barchart';
    document.body.appendChild(bc);
    bc = document.getElementById('barchart');
    bc.style.display = 'block';
    bc.style.position = 'absolute';
    bc.style.background = `rgba(255, 255, 255, 1)`;
    //bc.style.border = `1px solid black`
    leftBarBottom = document.createElement('div');
    leftBarBottom.id = 'lbb';
    leftBarTop = document.createElement('div');
    leftBarTop.id = 'lbt';
    rightBarBottom = document.createElement('div');
    rightBarBottom.id = 'rbb';
    rightBarTop = document.createElement('div');
    rightBarTop.id = 'rbt';
    leftBarLabel = document.createElement('div');
    rightBarLabel = document.createElement('div');
    leftBarLabel.id= 'lbl';
    rightBarLabel.id = 'rbl';
    bc.appendChild(leftBarBottom);
    bc.appendChild(leftBarTop);
    bc.appendChild(rightBarBottom);
    bc.appendChild(rightBarTop);
    bc.appendChild(leftBarLabel);
    bc.appendChild(rightBarLabel);
    leftBarBottom = document.getElementById('lbb');
    leftBarTop = document.getElementById('lbt');
    rightBarBottom = document.getElementById('rbb');
    rightBarTop = document.getElementById('rbt');
    leftBarLabel = document.getElementById('lbl');
    rightBarLabel = document.getElementById('rbl');
    leftBarBottom.style.background = `${Acolor}`;
    rightBarBottom.style.background = `${Acolor}`;
    leftBarTop.style.background = `${Bcolor}`;
    rightBarTop.style.background = `${Bcolor}`;
    leftBarBottom.style.position = 'absolute';
    leftBarTop.style.position = 'absolute';
    rightBarBottom.style.position = 'absolute';
    rightBarTop.style.position = 'absolute';
    leftBarLabel.style.position = 'absolute';
    rightBarLabel.style.position = 'absolute';
    leftBarLabel.innerText = 'liquid';
    rightBarLabel.innerText = 'vapor';
    leftBarLabel.style.textAlign = 'center';
    rightBarLabel.style.textAlign = 'center';
    let transitionTime = 1;
    leftBarTop.style.transition = `height ${transitionTime}s`;
    rightBarTop.style.transition = `height ${transitionTime}s`;
}

function drawBarChart() {
    if(checked) {
        leftBarTop.style.height = `${barHeight * (1 - xA)}px`;
        rightBarTop.style.height = `${barHeight * (1 - yA)}px`;
    } else {
        leftBarTop.style.height = `${barHeight * (1 - xAtarget)}px`;
        rightBarTop.style.height = `${barHeight * (1 - yAtarget)}px`;
    }
}

function resize() {
    let wHeight = window.innerWidth;
    let wWidth = window.innerHeight;

    dims = Math.min(400, Math.min(wWidth - 100, wHeight / 2 - 20));
    liquidLine = dims - liquidLevel * dims;
    evapFraction = ((1 - fracLiq) * (dims - liquidLine) / dims) / ((1 - fracLiq) * (dims - liquidLine) / dims + fracLiq * liquidLine / dims);
    condFraction = (fracLiq * liquidLine / dims) / ((1 - fracLiq) * (dims - liquidLine) / dims + fracLiq * liquidLine / dims);
    let canv = document.getElementById('canvas0');
    let subCanv = document.getElementById('subCanvas');
    canv.style.width = `${dims}px`;
    subCanv.style.width = `${dims}px`;
    canv.style.height = `${dims}px`;
    subCanv.style.height = `${dims * liquidLevel}px`;
    subCanv.style.top = `${dims * (1 - liquidLevel)}px`;

    bc.style.left = `${0}px`;
    bc.style.top = `${dims + 20}px`;
    bc.style.width = `${dims}px`;
    bc.style.height = `${dims}px`;
    
    let bMarg = 10;
    
    leftBarLabel.style.bottom = `0px`;
    rightBarLabel.style.bottom = `0px`;

    barHeight = dims - 2*bMarg - Math.max(getCoords('lbl').height, getCoords('rbl').height);

    leftBarBottom.style.width = `${dims / 2 - 2 * bMarg}px`;
    rightBarBottom.style.width = `${dims / 2 - 2 * bMarg}px`;
    leftBarTop.style.width = `${dims / 2 - 2 * bMarg}px`;
    rightBarTop.style.width = `${dims / 2 - 2 * bMarg}px`;
    leftBarLabel.style.width = `${getCoords('lbb').width}px`;
    rightBarLabel.style.width = `${getCoords('rbb').width}px`;

    leftBarBottom.style.height = `${barHeight}px`;
    rightBarBottom.style.height = `${barHeight}px`;
    
    leftBarBottom.style.top = `${(dims - barHeight)/3}px`;
    leftBarTop.style.top = `${(dims - barHeight)/3}px`;
    rightBarBottom.style.top = `${(dims - barHeight)/3}px`;
    rightBarTop.style.top = `${(dims - barHeight)/3}px`;


    leftBarBottom.style.left = `${bMarg}px`;
    leftBarTop.style.left = `${bMarg}px`;
    rightBarBottom.style.left = `${dims / 2 + bMarg}px`;
    rightBarTop.style.left = `${dims / 2 + bMarg}px`;
    leftBarLabel.style.left = `${getCoords('lbb').left}px`;
    rightBarLabel.style.left = `${getCoords('rbb').left}px`;

    if(typeof molNumberSlider == 'object') {
        molNumberLabel.position(getCoords('canvas0').right, getCoords('canvas0').top + 10);
        molNumberSlider.position(getCoords('canvas0').right, getCoords('mnl').bottom + 10);
        alphaLabel.position(getCoords('canvas0').right, getCoords('mns').top + 30);
        volatilitySlider.position(getCoords('canvas0').right, getCoords('al').bottom + 10);
        xSlider.position(getCoords('canvas0').right, getCoords('xl').bottom + 10);
        xLabel.position(getCoords('canvas0').right, getCoords('vs').bottom + 10);
        // checkbox.position(getCoords('canvas0').right, getCoords('barchart').top + 20);    
    }
}

function getCoords(id) {
    let elem = document.getElementById(id);
    let box = elem.getBoundingClientRect();
  
    return {
      top: box.top + pageYOffset,
      left: box.left + pageXOffset,
      bottom: box.top + pageYOffset + box.height,
      right: box.left + pageXOffset + box.width,
      height: box.height,
      width: box.width
    };
  }

function addSliders() {
    molNumberLabel = document.createElement('div');
    molNumberLabel.id = 'mnl';
    mainDiv.appendChild(molNumberLabel);
    molNumberLabel = document.getElementById('mnl');
    molNumberLabel.innerHTML = `number of particles: ${mols}`;
    molNumberLabel.position = (x, y) => {molNumberLabel.style.left = `${x}px`; molNumberLabel.style.top = `${y}px`; };
    
    molNumberSlider = document.createElement('input');
    molNumberSlider.id = 'mns';
    mainDiv.appendChild(molNumberSlider);
    molNumberSlider = document.getElementById('mns');
    molNumberSlider.type = 'range';
    molNumberSlider.min = 10;
    molNumberSlider.max = 500;
    molNumberSlider.value = 80;
    molNumberSlider.step = 1;
    molNumberSlider.style.width = '100px';
    molNumberSlider.position = (x, y) => {molNumberSlider.style.left = `${x}px`; molNumberSlider.style.top = `${y}px`; };
    
    alphaLabel = document.createElement('div');
    alphaLabel.id = 'al';
    mainDiv.appendChild(alphaLabel);
    alphaLabel = document.getElementById('al');
    alphaLabel.innerHTML = `relative volatility (&#945): ${Alpha}`;
    alphaLabel.position = (x, y) => {alphaLabel.style.left = `${x}px`; alphaLabel.style.top = `${y}px`; };

    volatilitySlider = document.createElement('input');
    volatilitySlider.id = 'vs';
    mainDiv.appendChild(volatilitySlider);
    volatilitySlider = document.getElementById('vs');
    volatilitySlider.type = 'range';
    volatilitySlider.min = -1;
    volatilitySlider.max = 1;
    volatilitySlider.value = 0;
    volatilitySlider.step = 0.1;
    volatilitySlider.style.width = '100px';
    volatilitySlider.position = (x, y) => {volatilitySlider.style.left = `${x}px`; volatilitySlider.style.top = `${y}px`; };

    xLabel = document.createElement('div');
    xLabel.id = 'xl';
    mainDiv.appendChild(xLabel);
    xLabel = document.getElementById('xl');
    xLabel.innerHTML = `x<sub>A</sub>: ${xAtarget}`;
    xLabel.position = (x, y) => {xLabel.style.left = `${x}px`; xLabel.style.top = `${y}px`; };

    xSlider = document.createElement('input');
    xSlider.id = 'xs';
    mainDiv.appendChild(xSlider);
    xSlider = document.getElementById('xs');
    xSlider.type = 'range';
    xSlider.min = 0.03;
    xSlider.max = 0.97;
    xSlider.step = 0.01;
    xSlider.value = 0.50;
    xSlider.style.width = '100px';
    xSlider.position = (x, y) => {xSlider.style.left = `${x}px`; xSlider.style.top = `${y}px`; };

    /* checkbox = createCheckbox('show values in real-time', false);
    checkbox.changed(checkboxEvent); */

    molNumberLabel.style.position = 'absolute';
    molNumberSlider.style.position = 'absolute';
    alphaLabel.style.position = 'absolute';
    volatilitySlider.style.position = 'absolute';
    xLabel.style.position = 'absolute';
    xSlider.style.position = 'absolute';

    document.getElementById('mns').oninput = updateGlobals;
    document.getElementById('vs').oninput = updateGlobals;
    document.getElementById('xs').oninput = updateGlobals;

    molNumberLabel.position(getCoords('canvas0').right, getCoords('canvas0').top + 10);
    molNumberSlider.position(getCoords('canvas0').right, getCoords('mnl').bottom + 10);
    alphaLabel.position(getCoords('canvas0').right, getCoords('mns').bottom + 10);
    volatilitySlider.position(getCoords('canvas0').right, getCoords('al').bottom + 10);
    xLabel.position(getCoords('canvas0').right, getCoords('vs').bottom + 10);
    xSlider.position(getCoords('canvas0').right, getCoords('xl').bottom + 10);
    // checkbox.position(getCoords('canvas0').right, getCoords('barchart').top + 20);

}

/* function checkboxEvent() {
    checked = !checked;
} */