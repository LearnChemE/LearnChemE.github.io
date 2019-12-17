let sliderWidth, nav, buttonHeight, about, details, directions, dims, cnv, bc, barHeight, xLabel, xSlider, leftBarLabel, rightBarLabel, leftBarTop, leftBarBottom, rightBarTop, rightBarBottom, mainDiv, liquidColor, liquidLine, alphaLabel, molNumberSlider, molNumberLabel, evapFraction, condFraction;
let mol = [];
let liquidLevel = 0.15;
var mols = 100;
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

let rowColumn = true;

var timeNow = null;

var stop = false;
var frameCount = 0;
var fps, fpsInterval, startTime, now, then, elapsed, yDims;
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
    mainDiv = document.getElementById('main');
    addButtons();
    addSliders();
    addBarChart();
    resize();
    for(let i = 0; i < mols; i++) {
        if(i % 2 == 0) {mol.push(new Molecule({'component':'a'}))} else {mol.push(new Molecule({'component':'b'}))};
    }
    updateGlobals();
    startAnimating(120);
  };

function updateGlobals() {
    Alpha = Math.pow(10, volatilitySlider.value / 100);
    alphaLabel.innerHTML = `relative volatility (&#945<sub>blue/green</sub>): ${Number.parseFloat(Alpha).toFixed(2)}`;
    mols = parseInt(molNumberSlider.value);
    molNumberLabel.innerText = `number of particles: ${mols}`;
    xLabel.innerHTML = `<i>x</i><sub>blue</sub>: ${Number.parseFloat(xAtarget).toFixed(2)}`;
    xAtarget = parseFloat(xSlider.value);
    yAtarget = (Alpha*xAtarget)/(1 - xAtarget + Alpha*xAtarget);
    zA = xAtarget*fracLiq + (1 - fracLiq)*yAtarget;
    for(let i = 0; i < mol.length; i++) {if(i <= mols*zA){mol[i].ChangeComponent('a');}else{mol[i].ChangeComponent('b');}}
    /* const liqCanv = document.getElementById('liqCanvas');
    const vapCanv = document.getElementById('vapCanvas');
    const bright1 = 255/180;
    const bright2 = 255/180;
    liqCanv.style.background = `rgba(${bright1 * (130 - (50 * xAtarget))}, ${bright1 * (180 - (180 * xAtarget))}, ${bright1 * (180 * xAtarget)}, 0.6)`;
    vapCanv.style.background = `rgba(${bright2 * (130 - (50 * yAtarget))}, ${bright2 * (180 - (180 * yAtarget))}, ${bright2 * (180 * yAtarget)}, 0.3)`;
    //let Acolor = 'rgb(80, 0, 180)';
    //let Bcolor = 'rgb(130, 180, 0)'; */
}

function addButtons() {
    nav = document.getElementById('nav');
    buttonHeight = 70;

    about = {"content": ""};
    directions = {"content" : ""};
    details = {"content" : ""}

    about["modal"] = new Modal({modalid:"modal-about",modalclass:"modal moveUp",headerstyle:"",header:"About",contentstyle:"",content:about.content,showing:false});    
    directions["modal"] = new Modal({modalid:"modal-directions",modalclass:"modal moveUp",headerstyle:"",header:"Directions",contentstyle:"",content:directions.content,showing:false});
    details["modal"] = new Modal({modalid:"modal-details",modalclass:"modal moveUp",headerstyle:"",header:"Details",contentstyle:"",content:details.content,showing:false});
    
    about["button"] = document.getElementById('about').addEventListener("click", () => about.modal.show());
    directions["button"] = document.getElementById('directions').addEventListener("click", () => directions.modal.show());
    details["button"] = document.getElementById('details').addEventListener("click", () => details.modal.show());
    
    var modalFiles = [];
    modalFiles.push(modalFill(about.modal,'aboutContent.html.txt'));
    modalFiles.push(modalFill(directions.modal,'directionsContent.html.txt'));
    modalFiles.push(modalFill(details.modal,'detailsContent.html.txt'));

    const error1 = details.modal;
    const error2 = directions.modal;
    Promise.all(modalFiles).then(function() {
        MathJax.Hub.Configured();
    }).catch(() => {
        console.log("MathJax Not Yet Loaded ...");
        let delay = 1000;
        setTimeout(function jax() {
            try {MathJax.Hub.Configured();}
            catch(error) {console.error(error); if(delay < 10000) {delay*= 1.5; setTimeout(jax, delay);} else {
                modalFill(error1,'errorText.html.txt');
                modalFill(error2,'errorText.html.txt');
            }}
        }, delay);
      });
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
    leftBarLabel.classList.add('label');
    rightBarLabel.innerText = 'vapor';
    rightBarLabel.classList.add('label');
    leftBarLabel.style.textAlign = 'center';
    rightBarLabel.style.textAlign = 'center';
    let transitionTime = 1;
    leftBarTop.style.transition = `height ${transitionTime}s`;
    rightBarTop.style.transition = `height ${transitionTime}s`;
}

function drawBarChart() {
    leftBarTop.style.height = `${barHeight * (1 - xAtarget)}px`;
    rightBarTop.style.height = `${barHeight * (1 - yAtarget)}px`;
}

function resize() {
    const wHeight = window.innerHeight;
    const wWidth = window.innerWidth;

    nav.style.height = `${buttonHeight}px`;

    dims = Math.min(Math.max(400, Math.min(wWidth, wHeight - 20)),800);
    if(rowColumn) {dims *= 0.6} else {dims -= 100}
    evapFraction = ((1 - fracLiq) * (dims - liquidLine) / dims) / ((1 - fracLiq) * (dims - liquidLine) / dims + fracLiq * liquidLine / dims);
    condFraction = (fracLiq * liquidLine / dims) / ((1 - fracLiq) * (dims - liquidLine) / dims + fracLiq * liquidLine / dims);
    
    const hMarg = 40;
    const vMarg = 20;

    if(rowColumn) {
        sliderWidth = (dims * 1.5) / 3 - 40;
        molNumberSlider.style.width = `${sliderWidth}px`;
        volatilitySlider.style.width = `${sliderWidth}px`;
        xSlider.style.width = `${sliderWidth}px`;

        molNumberLabel.position(10, getCoords('nav').bottom);
        molNumberSlider.position(0, getCoords('mnl').bottom + 10);
        alphaLabel.position(Math.max(getCoords('mnl').right,getCoords('mns').right) + hMarg, getCoords('mnl').top);
        volatilitySlider.position(Math.max(getCoords('mnl').right,getCoords('mns').right) + hMarg, getCoords('al').bottom + 10);
        let xPos = wWidth < Math.max(getCoords('al').right, getCoords('vs').right) + 200 ? getCoords('mnl').left : Math.max(getCoords('al').right, getCoords('vs').right) + hMarg; 
        let yPos = wWidth < Math.max(getCoords('al').right, getCoords('vs').right) + 200 ? getCoords('mns').bottom + vMarg : getCoords('al').top; 
        xLabel.position(xPos, yPos);
        xSlider.position(xPos, getCoords('xl').bottom + 7);
    } else {
        molNumberLabel.position(getCoords('canvas0').right, getCoords('nav').bottom);
        molNumberSlider.position(getCoords('canvas0').right, getCoords('mnl').bottom + 10);
        alphaLabel.position(getCoords('canvas0').right, getCoords('mns').bottom + 30);
        volatilitySlider.position(getCoords('canvas0').right, getCoords('al').bottom + 10);
        xLabel.position(getCoords('canvas0').right, getCoords('vs').bottom + 30);
        xSlider.position(getCoords('canvas0').right, getCoords('xl').bottom + 10);
    } 

    const canv = document.getElementById('canvas0');
    const liqCanv = document.getElementById('liqCanvas');
    const vapCanv = document.getElementById('vapCanvas');
    
    canv.style.width = `${dims}px`;
    liqCanv.style.width = `${dims}px`;
    vapCanv.style.width = `${dims}px`;
    canv.style.height = `${Math.min(Math.max(dims, wHeight - getCoords('xs').bottom - 30), 600)}px`;
    liqCanv.style.height = `${getCoords('canvas0').height * liquidLevel}px`;
    vapCanv.style.height = `${getCoords('canvas0').height - getCoords('liqCanvas').height - 4}px`;
    const ctop = rowColumn ? getCoords('xs').bottom + 20 : getCoords('nav').bottom + 20;
    canv.style.top = `${ctop}px`;
    vapCanv.style.top = `0px`;
    liqCanv.style.bottom = `0px`;

    liquidLine = (1 - liquidLevel) * getCoords('canvas0').height;
    yDims = getCoords('canvas0').height;

    let bcWidth;
    let bcLeft;
    let bcTop;
    const bcHeight = getCoords('canvas0').height;
    const bMarg = 10;
    barHeight = bcHeight - 2*bMarg - Math.max(getCoords('lbl').height, getCoords('rbl').height);

    if(rowColumn) {
        bcWidth = dims / 2;
        bcLeft = dims + 10;
        bcTop = getCoords('canvas0').top;
    } else {
        bcWidth = dims;
        bcLeft = 0;
        bcTop = getCoords('canvas0').bottom + 20;
    }

    leftBarBottom.style.width = `${bcWidth / 2 - 2 * bMarg}px`;
    rightBarBottom.style.width = `${bcWidth / 2 - 2 * bMarg}px`;
    leftBarTop.style.width = `${bcWidth / 2 - 2 * bMarg}px`;
    rightBarTop.style.width = `${bcWidth / 2 - 2 * bMarg}px`;
    leftBarLabel.style.width = `${getCoords('lbb').width}px`;
    rightBarLabel.style.width = `${getCoords('rbb').width}px`;

    leftBarBottom.style.height = `${barHeight}px`;
    rightBarBottom.style.height = `${barHeight}px`;
    
    leftBarBottom.style.top = `${(bcHeight - barHeight)/3}px`;
    leftBarTop.style.top = `${(bcHeight - barHeight)/3}px`;
    rightBarBottom.style.top = `${(bcHeight - barHeight)/3}px`;
    rightBarTop.style.top = `${(bcHeight - barHeight)/3}px`;

    leftBarBottom.style.left = `${bMarg}px`;
    leftBarTop.style.left = `${bMarg}px`;
    rightBarBottom.style.left = `${bcWidth / 2 + bMarg}px`;
    rightBarTop.style.left = `${bcWidth / 2 + bMarg}px`;
    leftBarLabel.style.left = `${getCoords('lbb').left - getCoords('barchart').left}px`;
    rightBarLabel.style.left = `${getCoords('rbb').left - getCoords('barchart').left}px`;

    bc.style.left = `${bcLeft}px`;
    bc.style.top = `${bcTop}px`;
    bc.style.width = `${bcWidth}px`;
    bc.style.height = `${bcHeight}px`;
    
    leftBarLabel.style.bottom = `0px`;
    rightBarLabel.style.bottom = `0px`;

    nav.style.width = `${bcLeft + bcWidth}px`;
}

function getCoords(id) {
    const elem = document.getElementById(id);
    const box = elem.getBoundingClientRect();
  
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
    sliderWidth = 100;

    molNumberLabel = document.createElement('div');
    molNumberLabel.id = 'mnl';
    mainDiv.appendChild(molNumberLabel);
    molNumberLabel = document.getElementById('mnl');
    molNumberLabel.innerHTML = `number of particles: ${mols}`;
    molNumberLabel.classList.add('label');
    molNumberLabel.position = (x, y) => {molNumberLabel.style.left = `${x}px`; molNumberLabel.style.top = `${y}px`; };
    
    molNumberSlider = document.createElement('input');
    molNumberSlider.id = 'mns';
    mainDiv.appendChild(molNumberSlider);
    molNumberSlider = document.getElementById('mns');
    molNumberSlider.type = 'range';
    molNumberSlider.classList.add('slider');
    molNumberSlider.min = 50;
    molNumberSlider.max = 150;
    molNumberSlider.value = 100;
    molNumberSlider.step = 1;
    molNumberSlider.style.width = `${sliderWidth}px`;
    molNumberSlider.position = (x, y) => {molNumberSlider.style.left = `${x}px`; molNumberSlider.style.top = `${y}px`; };
    
    alphaLabel = document.createElement('div');
    alphaLabel.id = 'al';
    mainDiv.appendChild(alphaLabel);
    alphaLabel = document.getElementById('al');
    alphaLabel.innerHTML = `relative volatility (&#945<sub>blue/green</sub>): ${Number.parseFloat(Alpha).toFixed(2)}`;
    alphaLabel.classList.add('label');
    alphaLabel.position = (x, y) => {alphaLabel.style.left = `${x}px`; alphaLabel.style.top = `${y}px`; };

    volatilitySlider = document.createElement('input');
    volatilitySlider.id = 'vs';
    mainDiv.appendChild(volatilitySlider);
    volatilitySlider = document.getElementById('vs');
    volatilitySlider.type = 'range';
    volatilitySlider.classList.add('slider');
    volatilitySlider.min = -100;
    volatilitySlider.max = 100;
    volatilitySlider.value = 0;
    volatilitySlider.step = 1;
    volatilitySlider.style.width = `${sliderWidth}px`;
    volatilitySlider.position = (x, y) => {volatilitySlider.style.left = `${x}px`; volatilitySlider.style.top = `${y}px`; };

    xLabel = document.createElement('div');
    xLabel.id = 'xl';
    mainDiv.appendChild(xLabel);
    xLabel = document.getElementById('xl');
    xLabel.innerHTML = `<i>x</i><sub>blue</sub>: ${Number.parseFloat(xAtarget).toFixed(2)}`;
    xLabel.classList.add('label');
    xLabel.position = (x, y) => {xLabel.style.left = `${x}px`; xLabel.style.top = `${y}px`; };

    xSlider = document.createElement('input');
    xSlider.id = 'xs';
    mainDiv.appendChild(xSlider);
    xSlider = document.getElementById('xs');
    xSlider.type = 'range';
    xSlider.classList.add('slider');
    xSlider.min = 0.03;
    xSlider.max = 0.97;
    xSlider.step = 0.01;
    xSlider.value = 0.50;
    xSlider.style.width = `${sliderWidth}px`;
    xSlider.position = (x, y) => {xSlider.style.left = `${x}px`; xSlider.style.top = `${y}px`; };

    molNumberLabel.style.position = 'absolute';
    molNumberSlider.style.position = 'absolute';
    alphaLabel.style.position = 'absolute';
    volatilitySlider.style.position = 'absolute';
    xLabel.style.position = 'absolute';
    xSlider.style.position = 'absolute';

    document.getElementById('mns').oninput = updateGlobals;
    document.getElementById('vs').oninput = updateGlobals;
    document.getElementById('xs').oninput = updateGlobals;

/*     molNumberLabel.position(getCoords('canvas0').right, getCoords('canvas0').top + 10);
    molNumberSlider.position(getCoords('canvas0').right, getCoords('mnl').bottom + 10);
    alphaLabel.position(getCoords('canvas0').right, getCoords('mns').bottom + 10);
    volatilitySlider.position(getCoords('canvas0').right, getCoords('al').bottom + 10);
    xLabel.position(getCoords('canvas0').right, getCoords('vs').bottom + 10);
    xSlider.position(getCoords('canvas0').right, getCoords('xl').bottom + 10); */
}

/* function checkboxEvent() {
    checked = !checked;
} */