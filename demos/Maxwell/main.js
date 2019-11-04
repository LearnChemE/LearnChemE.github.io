let stateFunc1, stateFunc2, sym, symmetryText, w, h, instrX, instrY, texX, texY, sWidth, lnHt, fontSize, largeFontSize, i, k, str, constant, constantIndex, partialsIndex, m, restart, topPartial1, topPartial2, bottomPartial1, bottomPartial2, constantText1, constantText2, refLeft, rhs, cnst, cnst2, cnst3, cnst4, s, symmetry, hidePartial1, hidePartial2, showPartial1, showPartial2, motionText1, motionText2, endSolution, endSolutionDOMobj;
let eqns = {
    'fundamentals':{"U":`dU=TdS-PdV`,"A":`dA=-SdT-PdV`,"H":`dH=TdS+VdP`,"G":`dG=-SdT+VdP`}
};

let choices = [];
let domObjs = [];
let page = 1;
let update = false;
let effects = false;
let effect = [];
let eqnLetterObjs = [];
let coloredLetters = [];
let fps = 30;
let partials = [];
let ctc = false;
let animSpeedMult = 0.9;
let textDelay = 2000/animSpeedMult;

//let symmetryText = "\\Big( \\frac{\\partial}{\\partial X} \\Big( \\frac{\\partial Z}{\\partial Y} \\Big)_{\\scriptscriptstyle X} \\Big)_{\\scriptscriptstyle Y } = \\Big( \\frac{\\partial}{\\partial Y} \\Big( \\frac{\\partial Z}{\\partial X} \\Big)_{\\scriptscriptstyle Y} \\Big)_{\\scriptscriptstyle X} = \\frac{\\partial^{2} Z}{\\partial X \\partial Y}";

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
            text("Click a fundamental equation to get started.", instrX, instrY);
            k = Object.keys(eqns['fundamentals']);
            for(let i = 0; i < k.length; i++) {
                domObjs.push(new Tex({"content":eqns['fundamentals'][k[i]], "position":[texX, eval(`${texY + lnHt * (i + 1)}+${i == 4 ? 3 * lnHt : 0}`)], "name":`${k[i]}`}));
                domObjs[i].div.addClass('eq');
                domObjs[i].div.id(`eq${i}`);
                let id = `${i}`;
                document.getElementById(`eq${id}`).addEventListener("mousedown", () => {if(page == 1) {choices.push(parseInt(id))}; next(1, choices[0])});
            }
            break;
        case 2:
            text(`Click the state variable you would like held constant\n(options are colored)`, instrX, instrY);
            for(let i = 0; i < domObjs.length; i++) {
                if (i != choices[0]) {domObjs[i].div.remove()}
            }
            effect = [];
            //console.log(document.querySelectorAll('mjx-container')[0].firstChild.classList.value);
            eqnLetterObjs = document.querySelectorAll('mjx-container')[0].firstChild.childNodes;
            coloredLetters = choices[0] == 0 || choices[0] == 2 ? [5,9] : choices[0] == 1 || choices[0] == 3 ? [6,10] : [0, 1];
            for(let i = 0; i < coloredLetters.length; i++) {
                let element = eqnLetterObjs[coloredLetters[i]];
                let id = `${i}`;
                effect.push({"target":element, "effect":"color", "color":`${id}`});
                element.addEventListener("mousedown", () => {next(2, id)})
            }
            effects = true;
            break;
        case 3:
            domObjs.push(new Tex({"content":`\\left( \\frac{\\partial ${partials[0]}}{\\partial ${partials[1]}} \\right)_{\\scriptscriptstyle ${constant}}=${rhs}`,"position":[texX, texY], "name":"partial"}));
            domObjs[domObjs.length - 1].div.id('stateFunc1');
            stateFunc1 = document.getElementById('stateFunc1');
            stateFunc1.style.fontSize = `${largeFontSize}rem`;
            topPartial1 = stateFunc1.firstChild.firstChild.firstChild["childNodes"][0].childNodes[1].firstChild.childNodes[0];
            bottomPartial1 = stateFunc1.firstChild.firstChild.firstChild["childNodes"][0].childNodes[1].firstChild.childNodes[1].firstChild.childNodes[1];
            constantText1 = stateFunc1.firstChild.firstChild.firstChild["childNodes"][1];
            refLeft = getCoords(constantText1).right;
            domObjs[domObjs.length - 1].div.hide();
            effect.push({"target":[eqnLetterObjs[constantIndex - 1], eqnLetterObjs[constantIndex]], "effect":"zeroAndDelete"});
            effects = true;
            loop();
            break;
        case 4:
            text("With constant", instrX, instrY);
            let newTex = domObjs[domObjs.length - 1];
            newTex.div.show();
            newTex.div.style('opacity','0');
            effect.push({"target":topPartial1, "effect":"color", "color": '2'});
            effect.push({"target":bottomPartial1, "effect":"color", "color":`${choices[1] == 0 ? 1 : 0}`});
            effect.push({"target":constantText1, "effect":"color", "color":`${choices[1] == 1 ? 1 : 0}`});

            effects = true;
            next(4, null);
            break;
        case 5:
            text("With constant ", instrX, instrY);
            sWidth = textWidth("With constant ");
            cnst = new Tex({"content": `${constant},`, "position":[instrX + sWidth + 0.05*lnHt, instrY - 0.1*lnHt]});
            cnst.div.id('constantLetter'); effect.push({"target":document.getElementById('constantLetter'), "effect":"color", "color":`${choices[1] == 1 ? 1 : 0}`});
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
            stateFunc1.style.top = `${texY + 4*lnHt}px`;
            stateFunc1.style.opacity = "1";
            window.setTimeout((e)=>{update = true}, textDelay);
            page++;
            break;
        case 8:
            text("With constant", instrX, instrY);
            text(`therefore,`, instrX, texY + 2.5*lnHt);
            text("click anywhere to continue.", instrX, getCoords(stateFunc1).bottom + lnHt);
            document.getElementsByClassName('p5Canvas')[0].addEventListener("mousedown", () => {next(8, null)});
            break;
        case 9:
            s = 2/animSpeedMult;
            selectItem(str, eqnLetterObjs, choices[1]).forEach(function(elt) {elt.style.visibility = "visible"; elt.style.transition = `opacity ${s}s`; elt.style.opacity = "1";});
            if(choices[1] == 0) {
                let move = selectItem(str, eqnLetterObjs, 1); if(!negativeQ){setTimeout(() => {move[0].style.visibility="visible"; move[0].style.opacity = "1"}, 1000*s)}
                move.forEach(function(elt){elt.style.transition = `all ${s}s`; elt.style.transform = `translateX(0px)`})}
            stateFunc1.style.transition = `all ${s}s`
            stateFunc1.style.top = `${90*h - 2*lnHt}px`;
            document.getElementById(`eq${choices[0]}`).style.top = `${texY + 1.2 * lnHt}px`;
            document.getElementById('constantLetter').remove();
            page++;
            window.setTimeout((e)=>{update = true}, textDelay);
            break;
        case 10:
            choices[1] = choices[1] == 0 ? 1 : 0;
            effect = [];

            let txtTop = `Now, the other state function must be derived. `;
            let txtBottom = `Click `;

            sWidth = textWidth(txtTop);
            let sWidth2 = textWidth(txtBottom);
            
            let click = selectItem(str, eqnLetterObjs, choices[1], true);
            constant = click[click.length - 1];
            //cnst2 = new Tex({"content": `${constant}`, "position":[instrX + sWidth + 0.05*lnHt, instrY - 0.1*lnHt]});
            cnst3 = new Tex({"content": `${constant}`, "position":[instrX + sWidth2 + 0.05*lnHt, instrY + lnHt - 0.1*lnHt]});
            //cnst2.div.id('constantLetter2'); effect.push({"target":document.getElementById('constantLetter2'), "effect":"color", "color":`${choices[1] == 1 ? 1 : 0}`});
            cnst3.div.id('constantLetter3'); effect.push({"target":document.getElementById('constantLetter3'), "effect":"color", "color":`${choices[1] == 1 ? 1 : 0}`});
            
            text(`${txtTop}\n${txtBottom}`, instrX, instrY);
            text('\n to hold it constant.', getCoords(document.getElementById('constantLetter3')).right + 0.05*lnHt, instrY);
            
            for(i = 0; i < domObjs.length; i++) {
                domObjs[i].div.style('z-index', '1');
            }
            let newElement = choices[1] == 0 ? 0 : 1;
            let newListener = eqnLetterObjs[coloredLetters[newElement]];
            newListener.addEventListener("mousedown", () => {next(10, choices[1])});
            break;
        case 11:
            //cnst2.div.remove();
            cnst3.div.remove();
            domObjs.push(new Tex({"content":`\\left( \\frac{\\partial ${partials[0]}}{\\partial ${partials[1]}} \\right)_{\\scriptscriptstyle ${constant}}=${rhs}`,"position":[texX, texY], "name":"partial2"}));
            domObjs[domObjs.length - 1].div.id('stateFunc2');
            stateFunc2 = document.getElementById('stateFunc2');
            stateFunc2.style.fontSize = `${largeFontSize}rem`;
            topPartial2 = stateFunc2.firstChild.firstChild.firstChild["childNodes"][0].childNodes[1].firstChild.childNodes[0];
            bottomPartial2 = stateFunc2.firstChild.firstChild.firstChild["childNodes"][0].childNodes[1].firstChild.childNodes[1].firstChild.childNodes[1];
            constantText2 = stateFunc2.firstChild.firstChild.firstChild["childNodes"][1];
            refLeft = getCoords(constantText2).right;
            domObjs[domObjs.length - 1].div.hide();
            effect.push({"target":[eqnLetterObjs[constantIndex - 1], eqnLetterObjs[constantIndex]], "effect":"zeroAndDelete"});
            effects = true;
            loop();
            break;
        case 12:
            text("With constant", instrX, instrY);
            let newTex2 = domObjs[domObjs.length - 1];
            newTex2.div.show();
            newTex2.div.style('opacity','0');
            effect.push({"target":topPartial2, "effect":"color", "color": '2'});
            effect.push({"target":bottomPartial2, "effect":"color", "color":`${choices[1] == 0 ? 1 : 0}`});
            effect.push({"target":constantText2, "effect":"color", "color":`${choices[1] == 1 ? 1 : 0}`});

            effects = true;
            next(12, null);
            break;
        case 13:
            text("With constant ", instrX, instrY);
            sWidth = textWidth("With constant ");
            cnst4 = new Tex({"content": `${constant},`, "position":[instrX + sWidth + 0.05*lnHt, instrY - 0.1*lnHt]});
            cnst4.div.id('constantLetter4'); effect.push({"target":document.getElementById('constantLetter4'), "effect":"color", "color":`${choices[1] == 1 ? 1 : 0}`});
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
            stateFunc2.style.top = `${texY + 4*lnHt}px`;
            stateFunc2.style.opacity = "1";
            window.setTimeout((e)=>{update = true}, textDelay);
            page++;
            break;
        case 16:
            text("With constant", instrX, instrY);
            text(`therefore,`, instrX, texY + 2.5*lnHt);
            text("click anywhere to continue.", instrX, getCoords(stateFunc2).bottom + lnHt);
            document.getElementsByClassName('p5Canvas')[0].addEventListener("mousedown", () => {next(16, null)});
            break;
        case 17:
            eqnLetterObjs.forEach((elt) => {elt.style.visibility = "inherit"; elt.style.opacity = "0";  elt.style.transform = `translateX(0px)`});
            stateFunc2.style.transition = `all ${s}s`
            stateFunc2.style.top = `${getCoords(stateFunc1).top - getCoords(stateFunc2).height - lnHt}px`;

            symmetryText = `\\Big( \\frac{\\partial}{\\partial ${constant}} \\Big( \\frac{\\partial ${partials[0]}}{\\partial ${partials[1]}} \\Big)_{\\scriptscriptstyle ${constant}} \\Big)_{\\scriptscriptstyle ${partials[1]} } = \\Big( \\frac{\\partial}{\\partial ${partials[1]}} \\Big( \\frac{\\partial ${partials[0]}}{\\partial ${constant}} \\Big)_{\\scriptscriptstyle ${partials[1]}} \\Big)_{\\scriptscriptstyle ${constant}} = \\frac{\\partial^{2} ${partials[0]}}{\\partial ${constant} \\partial ${partials[1]}}`;

            domObjs.push(new Tex({"content":symmetryText,"position":[texX, texY + 1.5*lnHt], "name":"symmetry"}));
            symmetry = domObjs[domObjs.length - 1];
            symmetry.div.style('font-size', `${largeFontSize / 1.5}rem`);
            symmetry.div.style('opacity', '0');
            symmetry.div.id('symmetry');
            symmetry.div.style('visibility', 'hidden');

            //objt2.style.left = `${90*w - getCoords(objt2).width}px`
            document.getElementById(`eq${choices[0]}`).style.visibility = "hidden";
            document.getElementById('constantLetter4').remove();
            page++;
            window.setTimeout((e)=>{update = true}, textDelay);
            break;
        case 18:
            text("The order of differentiation does not matter for second\n derivatives. So:", instrX, instrY);
            symmetry.div.style('visibility', 'visible');

            sym = document.getElementById('symmetry');
            let xItems = [
                sym.firstChild.firstChild.childNodes[1].firstChild.childNodes[1].firstChild.childNodes[1], 
                sym.firstChild.firstChild.childNodes[4].childNodes[1],
                sym.firstChild.firstChild.childNodes[10].firstChild.childNodes[1].firstChild.childNodes[1],
                sym.firstChild.firstChild.childNodes[12].childNodes[1],
                sym.firstChild.firstChild.childNodes[14].firstChild.childNodes[1].firstChild.childNodes[1].firstChild.childNodes[1].childNodes[0],
                sym.firstChild.firstChild.childNodes[14].firstChild.childNodes[1].firstChild.childNodes[1].firstChild.childNodes[1].childNodes[1]];
            let yItems = [    
                sym.firstChild.firstChild.childNodes[3].firstChild.childNodes[1].firstChild.childNodes[1],
                sym.firstChild.firstChild.childNodes[5].childNodes[1],
                sym.firstChild.firstChild.childNodes[8].firstChild.childNodes[1].firstChild.childNodes[1],
                sym.firstChild.firstChild.childNodes[11].childNodes[1],
                sym.firstChild.firstChild.childNodes[14].firstChild.childNodes[1].firstChild.childNodes[1].firstChild.childNodes[1].childNodes[2],
                sym.firstChild.firstChild.childNodes[14].firstChild.childNodes[1].firstChild.childNodes[1].firstChild.childNodes[1].childNodes[3]];
            let zItems = [
                sym.firstChild.firstChild.childNodes[3].firstChild.childNodes[0],
                sym.firstChild.firstChild.childNodes[10].firstChild.childNodes[0],
                sym.firstChild.firstChild.childNodes[14].firstChild.childNodes[0]];
            
            let xColor = choices[1] == 0 ? "rgb(70, 200, 50)" : "rgb(100, 100, 255)"
            let yColor = choices[1] == 1 ? "rgb(70, 200, 50)" : "rgb(100, 100, 255)"
            let zColor = "rgb(0, 0, 0)"
            
            xItems.forEach((itm) => {itm.style.color = xColor});
            yItems.forEach((itm) => {itm.style.color = yColor});
            zItems.forEach((itm) => {itm.style.color = zColor});

            symmetry.div.style('transition', `all ${1/animSpeedMult}s`);
            symmetry.div.style('opacity', '1');

            window.setTimeout(() => {
                text("click on one of the state functions below\nto substitute it into the equation above.", instrX, getCoords(sym).bottom + 2 * lnHt);
                stateFunc1.style.zIndex = "1";
                stateFunc1.addEventListener("mousedown", () => {next(18, 0)});
                stateFunc2.style.zIndex = "1";
                stateFunc2.addEventListener("mousedown", () => {next(18, 1)});
            }, textDelay);
            break;
        case 19:
            window.setTimeout(() => {
                text("now, click the other state function to substitute it.", instrX, getCoords(sym).bottom + 2 * lnHt);
                if(choices[2] == 0) {
                stateFunc2.addEventListener("mousedown", () => {next(19, 1)});
                } else {
                stateFunc1.addEventListener("mousedown", () => {next(19, 0)});
                }
            }, textDelay * 1.5);
            break;
        case 20:
            
            endSolution = `${motionText2[0] == "-" ? motionText1[0] == "-" ? " " : "-" : " "}\\Big( \\frac{\\partial ${motionText2[0] == "-" || motionText2[0] == "+" ? motionText2[1] : motionText2[0]}}{\\partial ${constant}} \\Big)_{\\scriptscriptstyle ${partials[1]} } = ${motionText1[0] == "-" ? motionText2[0] == "-" ? " " : "-" : " "} \\Big( \\frac{\\partial ${motionText1[0] == "-" || motionText1[0] == "+" ? motionText1[1] : motionText1[0]}}{\\partial ${partials[1]}} \\Big)_{\\scriptscriptstyle ${constant}}`;
            domObjs.push(new Tex({"content":endSolution,"position":[texX + 1.5 * lnHt, getCoords(sym).bottom + 3 * lnHt], "name":"es"}));
            domObjs[domObjs.length - 1].div.id('endSolution');
            endSolutionDOMobj = document.getElementById('endSolution');
            endSolutionDOMobj.style.fontSize = `${largeFontSize}rem`;
            endSolutionDOMobj.style.opacity = "0";
            window.setTimeout(() => {
                text("The equation above simplifies to a Maxwell Relation!", instrX, getCoords(sym).bottom + 1.25*lnHt);
                window.setTimeout(() => {    
                    endSolutionDOMobj.style.transition = `all ${1/animSpeedMult}s`;
                    endSolutionDOMobj.style.opacity = "1";
                    text("press the reset button to try another.", instrX, getCoords(endSolutionDOMobj).bottom + 1.5*lnHt);
                }, textDelay/2);
            }, textDelay);
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
                // calculates the constant
                constantIndex = coloredLetters[c];
                constant = str.charAt(constantIndex);
                // calculates the indices of the differential terms
                partialsIndex = [0, 1];
                partialsIndex.push(c == 0 ? coloredLetters[1] - 1 : coloredLetters[0] - 1);
                partialsIndex.push(c == 0 ? coloredLetters[1] : coloredLetters[0]);
                // calculates the right-hand side of the state function e.g. '-T', 'V'
                m = str.charAt(partialsIndex[2] - 1);
                if(str.charAt(partialsIndex[2] - 2)=="-"){rhs=`-${m}`} else {rhs=`${m}`}
                // the string array of the differential terms is called 'partials'
                partials = [];
                for(i = 0; i < partialsIndex.length; i++) {partials.push(str[partialsIndex[2 * i + 1]])}
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
                constantIndex = coloredLetters[c];
                constant = str.charAt(constantIndex);
                partialsIndex = [];
                partialsIndex = [0, 1];
                partialsIndex.push(c == 0 ? coloredLetters[1] - 1 : coloredLetters[0] - 1);
                partialsIndex.push(c == 0 ? coloredLetters[1] : coloredLetters[0]);
                m = str.charAt(partialsIndex[2] - 1);
                if(str.charAt(partialsIndex[2] - 2)=="-"){rhs=`-${m}`} else {rhs=`${m}`}
                partials = [];
                for(i = 0; i < partialsIndex.length; i++) {partials.push(str[partialsIndex[2 * i + 1]])}
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
            case 18:
                update = true;
                choices.push(c);
                replacePartials(c);
                page++;
                break;
            case 19:
                update = true;
                replacePartials(c);
                page++;
                break;
        }
    }
}

function replacePartials(c) {
    hidePartial1 = [sym.firstChild.firstChild.childNodes[7], sym.firstChild.firstChild.childNodes[10], sym.firstChild.firstChild.childNodes[11], stateFunc1.firstChild.firstChild.childNodes[0], stateFunc1.firstChild.firstChild.childNodes[1]];
    hidePartial2 = [sym.firstChild.firstChild.childNodes[0], sym.firstChild.firstChild.childNodes[3], sym.firstChild.firstChild.childNodes[4], stateFunc2.firstChild.firstChild.childNodes[0], stateFunc2.firstChild.firstChild.childNodes[1]];
    motionText1 = selectItem(str, eqnLetterObjs, choices[1], true);
    motionText2 = selectItem(str, eqnLetterObjs, choices[1] == 0 ? 1 : 0, true);
    showPartial1 = motionText1[0] == "-" ? [stateFunc1.firstChild.firstChild.childNodes[2], stateFunc1.firstChild.firstChild.childNodes[3]] : [stateFunc1.firstChild.firstChild.childNodes[2]];
    showPartial2 = motionText2[0] == "-" ? [stateFunc2.firstChild.firstChild.childNodes[2], stateFunc2.firstChild.firstChild.childNodes[3]] : [stateFunc2.firstChild.firstChild.childNodes[2]];

    if(c == 0) {
        hidePartial1.forEach((elm) => {
            elm.style.transition = `all ${2/animSpeedMult}s`;
            elm.style.opacity = "0";
        });
        for(let i = 0; i < showPartial1.length; i++) {
            let elm = showPartial1[i];
            elm.style.transition = `all ${2/animSpeedMult}s`;
            //elm.style.fontSize = `${largeFontSize * 0.5}rem`;
            elm.style.transform = `translate(
                ${getCoords(hidePartial1[1]).left - (getCoords(showPartial1[0]).left + getCoords(showPartial1[showPartial1.length - 1]).left) / 2 + 0.75 * lnHt}px,
                ${(getCoords(hidePartial1[0]).top + getCoords(hidePartial1[0]).bottom) / 2 - (getCoords(elm).bottom + getCoords(elm).top) / 2}px
                )`;
        }; 
    } else {
        hidePartial2.forEach((elm) => {
            elm.style.transition = `all ${2/animSpeedMult}s`;
            elm.style.opacity = "0";
        });
        for(let i = 0; i < showPartial2.length; i++) {
            let elm = showPartial2[i];
            elm.style.transition = `all ${2/animSpeedMult}s`;
            //elm.style.fontSize = `${largeFontSize * 0.5}rem`;
            let j = `translate(
                ${getCoords(hidePartial2[1]).left - (getCoords(showPartial2[0]).left + getCoords(showPartial2[showPartial2.length - 1]).left) / 2 + 0.75 * lnHt}px,
                ${(getCoords(hidePartial2[0]).top + getCoords(hidePartial2[0]).bottom) / 2 - (getCoords(elm).bottom + getCoords(elm).top) / 2}px
                )`;
            elm.style.transform = j;
            console.log(j);
        }; 
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
    // selects the indices of letters that will "vanish" during the 'click the state variable to hold constant' step. Returns the nodes or string based on "returnString" boolean parameter
    if(str.search("=-") != -1) {indices = c == 0 ? [3, 7] : [7, 11]} else {indices = c == 0 ? [3, 6] : [6, 10]}
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