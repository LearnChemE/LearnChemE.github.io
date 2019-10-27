let w, h, instrX, instrY, texX, texY, sWidth, lnHt, fontSize, largeFontSize, i, k, str, constant, constantIndex, modify, m, restart, finalEq, topPartial, bottomPartial, constantText, finalEq2, topPartial2, bottomPartial2, constantText2, refLeft, rhs, cnst, cnst2, cnst3, cnst4, s, objt, objt2;
let eqns = {
    'fundamentals':{"U":`dU=TdS-PdV`,"A":`dA=-SdT-PdV`,"H":`dH=TdS+VdP`,"G":`dG=-SdT+VdP`,"Rand":`d§=▲d♫-♣dΩ`}
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
let ctc = false;
let textDelay = 2000;

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
            k = Object.keys(eqns['fundamentals']);
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
            domObjs.push(new Tex({"content":`\\left( \\frac{\\partial ${partials[0]}}{\\partial ${partials[1]}} \\right)_{\\scriptscriptstyle ${constant}}=${rhs}`,"position":[texX, texY], "name":"partial"}));

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
            text("With constant", instrX, instrY);
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
            text("With constant ", instrX, instrY);
            sWidth = textWidth("With constant ");
            cnst = new Tex({"content": `${constant},`, "position":[instrX + sWidth + 0.05*lnHt, instrY - 0.1*lnHt]});
            cnst.div.id('constantLetter'); effect.push({"target":document.getElementById('constantLetter'), "effect":"color", "color":`${choices[1] == 2 ? 2 : 1}`});
            effects = true;
            page++;
            window.setTimeout((e)=>{update = true}, textDelay);
            break;
        case 6:
            text("With constant", instrX, instrY);
            text(`therefore,`, instrX, texY + 2.5*lnHt);
            window.setTimeout((e)=>{update = true}, textDelay);
            page++;
            break;
        case 7:
            text("With constant", instrX, instrY);
            text(`therefore,`, instrX, texY + 2.5*lnHt);
            let obj = document.getElementById('final');
            obj.style.top = `${texY + 4*lnHt}px`;
            obj.style.opacity = "1";
            window.setTimeout((e)=>{update = true}, textDelay);
            page++;
            break;
        case 8:
            text("With constant", instrX, instrY);
            text(`therefore,`, instrX, texY + 2.5*lnHt);
            text("click anywhere to continue.", instrX, getCoords(document.getElementById('final')).bottom + lnHt);
            document.getElementsByClassName('p5Canvas')[0].addEventListener("mousedown", () => {next(8, null)});
            break;
        case 9:
            s = 2;
            selectItem(str, letters, choices[1]).forEach(function(elt) {elt.style.visibility = "visible"; elt.style.transition = `opacity ${s}s`; elt.style.opacity = "1";});
            if(choices[1] == 1) {
                let move = selectItem(str, letters, 2); if(!negativeQ){setTimeout(() => {move[0].style.visibility="visible"; move[0].style.opacity = "1"}, 1000*s)}
                move.forEach(function(elt){elt.style.transition = `all ${s}s`; elt.style.transform = `translateX(0px)`})}
            objt = document.getElementById('final');
            objt.style.transition = `all ${s}s`
            objt.style.top = `${90*h - 2*lnHt}px`;
            document.getElementById(`eq${choices[0]}`).style.top = `${texY + 1.2 * lnHt}px`;
            document.getElementById('constantLetter').remove();
            page++;
            window.setTimeout((e)=>{update = true}, 2000);
            break;
        case 10:
            choices[1] = choices[1] == 1 ? 2 : 1;
            effect = [];
            let txt = `Now, derive the other state function by holding \nconstant. Click `;
            sWidth = textWidth('Now, derive the other state function by holding ');
            let sWidth2 = textWidth('constant. Click ');
            let newThing = selectItem(str, letters, choices[1], true);
            constant = newThing[newThing.length - 1];
            partials = [str[1], choices[1] == 1 ? str[glowLetters[5]] : str[glowLetters[3]]];
            cnst2 = new Tex({"content": `d${constant}`, "position":[instrX + sWidth + 0.05*lnHt, instrY - 0.1*lnHt]});
            cnst3 = new Tex({"content": `d${constant}`, "position":[instrX + sWidth2 + 0.05*lnHt, instrY + lnHt - 0.1*lnHt]});
            cnst2.div.id('constantLetter2'); effect.push({"target":document.getElementById('constantLetter2'), "effect":"color", "color":`${choices[1] == 2 ? 2 : 1}`});
            cnst3.div.id('constantLetter3'); effect.push({"target":document.getElementById('constantLetter3'), "effect":"color", "color":`${choices[1] == 2 ? 2 : 1}`});
            text(txt, instrX, instrY);
            text('\n now.', getCoords(document.getElementById('constantLetter3')).right + 0.05*lnHt, instrY);
            for(i = 0; i < domObjs.length; i++) {
                domObjs[i].div.style('z-index', '1');
            }
            let newElements = choices[1] == 1 ? [2, 3] : [4, 5];
            let newListeners = [letters[glowLetters[newElements[0]]], letters[glowLetters[newElements[1]]]];
            newListeners.forEach((elm) => {elm.addEventListener("mousedown", () => {next(10, choices[1])})});
            break;
        case 11:
            cnst2.div.remove();
            cnst3.div.remove();
            domObjs.push(new Tex({"content":`\\left( \\frac{\\partial ${partials[0]}}{\\partial ${partials[1]}} \\right)_{\\scriptscriptstyle ${constant}}=${rhs}`,"position":[texX, texY], "name":"partial2"}));
            domObjs[domObjs.length - 1].div.id('final2');
            finalEq2 = document.getElementById('final2').firstChild.firstChild;
            finalEq2.style.fontSize = `${largeFontSize}rem`;
            topPartial2 = finalEq2.firstChild["childNodes"][0].childNodes[1].firstChild.childNodes[0];
            bottomPartial2 = finalEq2.firstChild["childNodes"][0].childNodes[1].firstChild.childNodes[1];
            constantText2 = finalEq2.firstChild["childNodes"][1];
            refLeft = getCoords(constantText2).right;
            domObjs[domObjs.length - 1].div.hide();
            effect.push({"target":[letters[constantIndex], letters[constantIndex + 1]], "effect":"zeroAndDelete"});
            effects = true;
            loop();
            break;
        case 12:
            text("With constant", instrX, instrY);
            let newTex2 = domObjs[domObjs.length - 1];
            newTex2.div.show();
            newTex2.div.style('opacity','0');
            effect.push({"target":topPartial2, "effect":"color", "color":0});
            effect.push({"target":bottomPartial2, "effect":"color", "color":`${choices[1] == 1 ? 2 : 1}`});
            effect.push({"target":constantText2, "effect":"color", "color":`${choices[1] == 2 ? 2 : 1}`});

            effects = true;
            next(12, null);
            break;
        case 13:
            text("With constant ", instrX, instrY);
            sWidth = textWidth("With constant ");
            cnst4 = new Tex({"content": `${constant},`, "position":[instrX + sWidth + 0.05*lnHt, instrY - 0.1*lnHt]});
            cnst4.div.id('constantLetter4'); effect.push({"target":document.getElementById('constantLetter4'), "effect":"color", "color":`${choices[1] == 2 ? 2 : 1}`});
            effects = true;
            page++;
            window.setTimeout((e)=>{update = true}, textDelay);
            break;
        case 14:
            text("With constant", instrX, instrY);
            text(`therefore,`, instrX, texY + 2.5*lnHt);
            window.setTimeout((e)=>{update = true}, textDelay);
            page++;
            break;
        case 15:
            text("With constant", instrX, instrY);
            text(`therefore,`, instrX, texY + 2.5*lnHt);
            let obj2 = document.getElementById('final2');
            obj2.style.top = `${texY + 4*lnHt}px`;
            obj2.style.opacity = "1";
            window.setTimeout((e)=>{update = true}, textDelay);
            page++;
            break;
        case 16:
            text("With constant", instrX, instrY);
            text(`therefore,`, instrX, texY + 2.5*lnHt);
            text("click anywhere to continue.", instrX, getCoords(document.getElementById('final2')).bottom + lnHt);
            document.getElementsByClassName('p5Canvas')[0].addEventListener("mousedown", () => {next(16, null)});
            break;
        case 17:
            s = 2;
            letters.forEach((elt) => {elt.style.visibility = "inherit"; elt.style.opacity = "0";  elt.style.transform = `translateX(0px)`});
            objt2 = document.getElementById('final2');
            objt2.style.transition = `all ${s}s`
            objt2.style.top = `${getCoords(objt).top - getCoords(objt2).height - lnHt}px`;
            //objt2.style.left = `${90*w - getCoords(objt2).width}px`
            document.getElementById(`eq${choices[0]}`).style.visibility = "hidden";
            document.getElementById('constantLetter4').remove();
            page++;
            window.setTimeout((e)=>{update = true}, 2000);
            break;
        case 18:
            text("(coming soon, the second derivative part ...)", instrX, instrY)
            break;
    }
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
                str = eqns['fundamentals'][k[choices[0]]];
                constant = str.charAt(glowLetters[2*c+1]);
                constantIndex = glowLetters[2 * c];
                modify = [];
                glowLetters.forEach((n) => {if(n != glowLetters[2*c] && n != glowLetters[2*c + 1]) {modify.push(n)}});
                m = str.charAt(modify[2] - 1);
                if(str.charAt(modify[2] - 2)=="-"){rhs=`-${m}`} else {rhs=`${m}`}
                partials = [];
                for(i = 0; i < modify.length / 2; i++) {
                    partials.push(str[modify[2*i+1]])
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
            case 8:
                update = true;
                page++;
                break;
            case 10:
                str = eqns['fundamentals'][k[choices[0]]];
                constant = str.charAt(glowLetters[2*c+1]);
                constantIndex = glowLetters[2 * c];
                modify = [];
                glowLetters.forEach((n) => {if(n != glowLetters[2*c] && n != glowLetters[2*c + 1]) {modify.push(n)}});
                m = str.charAt(modify[2] - 1);
                if(str.charAt(modify[2] - 2)=="-"){rhs=`-${m}`} else {rhs=`${m}`}
                update = true;
                page++;
                break;
            case 11:
                effect = [];
                effects = false;
                page++;
                drawPage(page);
                break;
            case 12:
                page++;
                drawPage(page);
                break;
            case 16:
                update = true;
                page++;
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
    lnHt = textAscent() * 1.5;
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
    let indices = [];
    let sel = [];
    if(c == 0) {indices = [0, 2]} else if(str.search("=-") != -1) {indices = c==1 ? [3, 7] : c==2 ? [7, 11] : c==3 ? [11, 15] : [0, 2]} else {indices = c==1 ? [3, 6] : c==2 ? [6, 10] : c==3 ? [10, 14] : [0, 2]}
    for (let i = indices[0]; i < indices[1]; i++) {sel.push(elt[i])}
    if(returnString) {return str.slice(indices[0],indices[1])} else {return sel}
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