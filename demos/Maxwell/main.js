let choice, w, h, lnHt, fontSize;
let eqns = {
    'fundamentals':{"U":`dU=TdS-pdV`,"F":`dF=-SdT-pdV`,"H":`dH=TdS+Vdp`,"G":`dG=-SdT+Vdp`}
};
let domObjs = [];
let page = 1;
let update = false;
let effects = false;
let effect = [];

function setup() {
    let cnv = createCanvas(windowWidth, windowHeight);
    cnv.parent('main');
    
    /* define globals relative height and width (%) of canvas */
    window["wdRelative"] = windowWidth / 100;
    window["htRelative"] = windowHeight / 100;
    /* and again as local variables as shorthand */
    w = wdRelative;
    h = htRelative;

    /* default MathJax initialization */
    MathJax.startup.defaultReady();

    textAlign(LEFT, TOP);

    windowResized();
    background(180);
}

function draw() {
    if(update) {drawPage(page)};
    if(effects) {applyEffect(effect)};
}

function drawPage(p) {
    
    removeElements();
    background(180);

    switch(p) {
        case 1:
            text("Click an equation to get started.", 10, 10);
            let i;
            let k = Object.keys(eqns['fundamentals']);
            for(i = 0; i < k.length; i++) {
                domObjs.push(new Tex({"content":eqns['fundamentals'][k[i]], "position":[20, 10 + lnHt * (i + 1)], "name":`${k[i]}`}));
                domObjs[i].div.addClass('eq');
                domObjs[i].div.id(`eq${i}`);
                let id = `${i}`;
                document.getElementById(`eq${id}`).addEventListener("mousedown", () => {choice = parseInt(id); next(1, choice)});
            }
            break;
        case 2:
            break;
        case 3:
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
                let i;
                let event;
                for(i = 0; i < domObjs.length; i++) {
                    i != c ? event = "fade" : event = "expand";
                    let element = document.getElementById(`eq${i}`);
                    effect.push({"target":element, "effect":event});
                }
                console.log(effect);
                /* domObjs[i].div.remove(); */
                update = false;
                effects = true;
                page++;
                break;
        }
    }
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