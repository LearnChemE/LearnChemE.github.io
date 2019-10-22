let w, h, lnHt, fontSize, i, constant, constantIndex, restart;
let eqns = {
    'fundamentals':{"U":`dU=TdS-pdV`,"F":`dF=-SdT-pdV`,"H":`dH=TdS+Vdp`,"G":`dG=-SdT+Vdp`}
};
let choices = [];
let domObjs = [];
let page = 1;
let update = false;
let effects = false;
let effect = [];
let letters = [];
let glowLetters = [];
let fps = 20;
let partials = [];

function setup() {
    let cnv = createCanvas(windowWidth, windowHeight);
    cnv.parent('main');
    cnv.position(0, 0);
    cnv.style('z-index', 0);

    frameRate(fps);
    /* define globals relative height and width (%) of canvas */
    window["wdRelative"] = windowWidth / 100;
    window["htRelative"] = windowHeight / 100;
    /* and again as local variables as shorthand */
    w = wdRelative;
    h = htRelative;

    let c = document.getElementById('main');
    let b = document.createElement('button');
    b.id = 'resetbutton'; b.innerText = 'reset'; b.onclick = reset; b.style.zIndex = 2; b.style.position ='absolute'; b.style.left = `${50*w}px`; b.style.top = '10px';
    c.appendChild(b);

    restart = createButton('click me');
    restart.position(100*w - 50, 10);
    restart.mousePressed(reset);
    restart.show();

    /* default MathJax initialization */
    MathJax.startup.defaultReady();

    textAlign(LEFT, TOP);

    windowResized();
    background(255, 255, 255);
    noLoop();
}

function draw() {
    if(update) {drawPage(page)};
    if(effects) {applyEffect(effect)};
    update = false;
}

function drawPage(p) {
    
    clear();

    switch(p) {
        case 1:
            removeElements();
            choices = [];
            domObjs = [];
            effect = [];
            text("Click an equation to get started.", 10, 10);
            let k = Object.keys(eqns['fundamentals']);
            for(i = 0; i < k.length; i++) {
                domObjs.push(new Tex({"content":eqns['fundamentals'][k[i]], "position":[20, 10 + lnHt * (i + 1)], "name":`${k[i]}`}));
                domObjs[i].div.addClass('eq');
                domObjs[i].div.id(`eq${i}`);
                let id = `${i}`;
                document.getElementById(`eq${id}`).addEventListener("mousedown", () => {choices.push(parseInt(id)); next(1, choices[0])});
            }
            break;
        case 2:
            text("Click the differential term you would like held constant", 10, 10);
            for(i = 0; i < domObjs.length; i++) {
                if (i != choices[0]) {domObjs[i].div.remove()}
            }
            effect = [];
            //console.log(document.querySelectorAll('mjx-container')[0].firstChild.classList.value);
            letters = document.querySelectorAll('mjx-container')[0].firstChild.childNodes;
            glowLetters = choices[0] == 0 || choices[0] == 2 ? [0,1,4,5,8,9] : choices[0] == 1 || choices[0] == 3 ? [0,1,5,6,9,10] : [];
            for(i = 0; i < glowLetters.length; i++) {
                let element = letters[glowLetters[i]];
                effect.push({"target":element, "effect":"glow"});
                let id = `${Math.floor(i/2)}`;
                element.addEventListener("mousedown", () => {next(2, id)});
            }
            effects = true;
            break;
        case 3:
            domObjs.push(new Tex({"content":`(\\frac{${partials[0]}}{${partials[1]}})_{${constant}}`,"position":[20, 10 + 4 * lnHt], "name":"partial"}));
            domObjs[domObjs.length - 1].div.hide();
            for(i = 0; i < effect.length; i++) {effect[i]["effect"] = "color";effect[i]["color"] = Math.floor(i/2)}
            effect.push({"target":[letters[constantIndex], letters[constantIndex + 1]], "effect":"zeroAndDelete"});
            effects = true;
            loop();
            //effect.push({"target":letters[3], "effect":"color", "color":choices[1]});
            break;
        case 4:
            break;
        default:
            break;
    }
    MathJax.typeset();
    update = false;
}

function next(p, c) {
    if(p == page) {
        switch(page) {
            case 1:
                let event;
                for(i = 0; i < domObjs.length; i++) {
                    i != c ? event = "fade" : event = "expand";
                    let element = document.getElementById(`eq${i}`);
                    effect.push({"target":element, "effect":event});
                }
                /* domObjs[i].div.remove(); */
                effects = true;
                redraw();
                update = true;
                page++;
                break;
            case 2:
                choices.push(c);
                let k = Object.keys(eqns['fundamentals']);
                let str = eqns['fundamentals'][k[choices[0]]];
                constant = str.charAt(glowLetters[2*c+1]);
                constantIndex = glowLetters[2 * c];
                glowLetters.splice(2*c, 2);
                partials = [];
                for(i = 0; i < glowLetters.length / 2; i++) {
                    partials.push(str.substring(glowLetters[2*i], glowLetters[2*i+1] + 1))
                }
                update = true;
                page++;
                break;
        }
        redraw();
    }
}

function reset() {
    location.reload();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    fontSize = Number(window.getComputedStyle(document.getElementById('main')).getPropertyValue('font-size').replace(/[^\d.-]/g, ''));
    textSize(fontSize);
    lnHt = fontSize * 1.5;
    update = true;
}

/* function mousePressed() {
    eqns["top"].div.remove();
} */