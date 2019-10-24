let w, h, instrX, instrY, texX, texY, lnHt, fontSize, largeFontSize, i, constant, constantIndex, restart, finalEq, topPartial, bottomPartial, constantText, refLeft, rhs;
let eqns = {
    'fundamentals':{"U":`dU=TdS-PdV`,"F":`dF=-SdT-PdV`,"H":`dH=TdS+VdP`,"G":`dG=-SdT+VdP`,"Rand":`d§=▲d♫-♣dΩ`}
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
    /* creates reset button */
    let c = document.getElementById('main');
    let b = document.createElement('button');
    b.id = 'resetbutton';
    b.innerText = 'reset';
    b.onclick = reset;
    b.style.zIndex = 2;
    b.style.position ='absolute';
    b.style.top = '10px';
    c.appendChild(b);
    /* calls windowResized with "initialization" value as true to get window dimensions */
    let dims = windowResized(true);
    b.style.left = `${instrX}px`;

    let cnv = createCanvas(dims, dims);

    cnv.parent('main');
    cnv.position(0, 0);
    cnv.style('z-index', 0);

    frameRate(fps);
    /* define globals relative height and width (%) of canvas */
    w = dims / 100;
    h = dims / 100;
    
    /* default MathJax initialization */
    // MathJax.startup.defaultReady();

    textAlign(LEFT, TOP);

    windowResized();
    background(255, 255, 255);

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
            text("Click an equation to get started.", instrX, instrY);
            let k = Object.keys(eqns['fundamentals']);
            for(let i = 0; i < k.length; i++) {
                domObjs.push(new Tex({"content":eqns['fundamentals'][k[i]], "position":[texX, texY + lnHt * (i + 1)], "name":`${k[i]}`}));
                domObjs[i].div.addClass('eq');
                domObjs[i].div.id(`eq${i}`);
                let id = `${i}`;
                document.getElementById(`eq${id}`).addEventListener("mousedown", () => {if(page == 1) {choices.push(parseInt(id))}; next(1, choices[0])});
            }
            break;
        case 2:
            text("Click the differential term you would like held constant\n(options are colored)", instrX, instrY);
            for(let i = 0; i < domObjs.length; i++) {
                if (i != choices[0]) {domObjs[i].div.remove()}
            }
            effect = [];
            //console.log(document.querySelectorAll('mjx-container')[0].firstChild.classList.value);
            letters = document.querySelectorAll('mjx-container')[0].firstChild.childNodes;
            glowLetters = choices[0] == 0 || choices[0] == 2 ? [0,1,4,5,8,9] : choices[0] == 1 || choices[0] == 3 ? [0,1,5,6,9,10] : [0,1,4,5,8,9];
            for(let i = 0; i < glowLetters.length; i++) {
                let element = letters[glowLetters[i]];
                let id = `${Math.floor(i/2)}`;
                effect.push({"target":element, "effect":"color", "color":`${id}`});
                if(i >= 2) {element.addEventListener("mousedown", () => {next(2, id)})}
            }
            effects = true;
            break;
        case 3:
            domObjs.push(new Tex({"content":`\\left ( \\frac{\\partial ${partials[0]}}{\\partial ${partials[1]}} \\right )_{${constant}}=${rhs}`,"position":[texX, texY], "name":"partial"}));

            domObjs[domObjs.length - 1].div.id('final');
            finalEq = document.querySelectorAll('mjx-container')[1].firstChild;
            finalEq.style.fontSize = `${largeFontSize}rem`;
            topPartial = finalEq.firstChild["childNodes"][0].childNodes[1].firstChild.childNodes[0];
            bottomPartial = finalEq.firstChild["childNodes"][0].childNodes[1].firstChild.childNodes[1];
            constantText = finalEq.firstChild["childNodes"][1];
            refLeft = getCoords(constantText).right;
            domObjs[domObjs.length - 1].div.hide();
            effect.push({"target":[letters[constantIndex], letters[constantIndex + 1]], "effect":"zeroAndDelete"});
            effects = true;
            loop();
            //effect.push({"target":letters[3], "effect":"color", "color":choices[1]});
            break;
        case 4:
            text(`With constant ${constant},`, instrX, instrY);
            let newTex = domObjs[domObjs.length - 1];
            newTex.div.show();
            newTex.div.style('opacity','0');
            effect.push({"target":topPartial, "effect":"color", "color":0});
            effect.push({"target":bottomPartial, "effect":"color", "color":`${choices[1] == 1 ? 2 : 1}`});
            effect.push({"target":constantText, "effect":"color", "color":`${choices[1] == 2 ? 2 : 1}`});

            effects = true;
            next(4, null);
            break;
        case 5:
            text(`With constant ${constant},`, instrX, instrY);
            effects = true;
            page++;
            window.setTimeout((e)=>{update = true}, 2000);
            break;
        case 6:
            text(`With constant ${constant},`, instrX, instrY);
            text(`therefore,`, instrX, texY + 2.5*lnHt);
            window.setTimeout((e)=>{update = true}, 2000);
            page++;
            break;
        case 7:
            text(`With constant ${constant},`, instrX, instrY);
            text(`therefore,`, instrX, texY + 2.5*lnHt);
            let obj = document.getElementById('final');
            obj.style.top = `${texY + 4*lnHt}px`;
            obj.style.opacity = 1;
            noLoop();
            break;
    }
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
                let m = str.charAt(glowLetters[2] - 1);
                if(str.charAt(glowLetters[2] - 2)=="-"){rhs=`-${m}`} else {rhs=`${m}`}
                partials = [];
                for(i = 0; i < glowLetters.length / 2; i++) {
                    partials.push(str[glowLetters[2*i+1]])
                }
                update = true;
                page++;
                break;
            case 3:
                effect = [];
                effects = false;
                page++;
                drawPage(page);
                break;
            case 4:
                page++;
                drawPage(page);
                break;
        }
    }
}

function reset() {
    location.reload();
}

function resizeFont() {
    let fs = Number(window.getComputedStyle(document.getElementById('main')).getPropertyValue('font-size').replace(/[^\d.-]/g, ''));
    if(w*100 < 400) {fontSize = fs} else {fontSize = w*100 < 1200 ? w*100 / 28 : 1200/28}
    textSize(fontSize);
    lnHt = fontSize * 1.5;
    instrX = 5*w;
    instrY = lnHt + 10 + getCoords(document.getElementById('resetbutton'))['height'];
    texX = instrX;
    texY = instrY + lnHt;
    largeFontSize = fontSize * 2.2 / 10;
}

function windowResized(init) {

    let ww = windowWidth;
    let wh = windowHeight;
    let dims = Math.min(ww, wh);
    w = dims / 100;
    h = dims / 100;
    resizeFont();

    if (init == true) {return dims}

    resizeCanvas(dims, dims);
    update = true;

}

function selectItem(str, elt, c, returnString) {
    let out = [];
    let del = [];
    if(c == 0) {out = [0, 2]} else if(str.search("=-") != -1) {out = c==1 ? [3, 7] : c==2 ? [7, 11] : c==3 ? [11, 15] : [0, 2]} else {out = c==1 ? [3, 6] : c==2 ? [6, 10] : c==3 ? [10, 14] : [0, 2]}
    for (let i = out[0]; i < out[1]; i++) {del.push(elt[i])}
    if(returnString) {return str.slice(out[0],out[1])} else {return del}
}

function getCoords(elem) {
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

/* function mousePressed() {
    eqns["top"].div.remove();
} */