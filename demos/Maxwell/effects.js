var glowList = [];
let running = false;
let prg = 0;
let x1, x2, y1, y2, negativeQ, xOrig, xNew;

function applyEffect(a) {
    let d = a["delete"] || null;
    let v = a["time"] || 0.5;

    for(i = 0; i < a.length; i++) {
        let t = a[i]['target'];
        let f = a[i]['effect'];
        let col = a[i]['color'] || null;
        /* option to specify between effects on DOM object or canvas object. Defaults to DOM. */
        let domQ = (a[i]['type'] || "DOM") == "cnvElement" ? false : true;
        
        if (domQ) {
            switch(f) {
                case 'fade':
                    t.style.opacity = "1";
                    t.style.transition = `opacity ${v}s`;
                    t.style.opacity = "0";
                    break;
                case 'expand':
                    t.style.fontSize = fontSize;
                    t.style.transition = "all 1s";
                    t.firstChild.style.transition = "all 1s";
                    t.firstChild.style.fontSize = `${largeFontSize}rem`;
                    t.style.top = `${texY + 1.2 * lnHt}px`;
                    break;
                case 'glow':
                    glow({
                        continuous: page == 2 ? true : false,
                        duration: 2000,  
                        element: t,
                        id: Math.floor(i / 2)
                    });
                    break;
                case 'color':
                    glow({
                        continuous: false,
                        duration: 1000,
                        element: t,
                        id: col
                    });
                    break;
                case 'zeroAndDelete':
                    let tStamps = [0, 0.8, 1.6, 2.4, 3.2, 4, 4.8];
                    //var animSpeeds = [0.04, 0.04, 0.04, 0.025, 0.025, 0.025];
                    var animSpeeds = [0.06, 0.04, 0.04, 0.05, 0.05, 0.05];
                    if(!running) {
                        prg = 0;
                        x1 = getCoords(t[0])["left"];
                        x2 = getCoords(t[1])["right"];
                        // not sure why, but these are consistently 10 pixels off??
                        y1 = getCoords(t[0])["bottom"] + 10 + 0.5*lnHt;
                        y2 = getCoords(t[1])["top"] + 10 - 0.5*lnHt;
                        running = true;
                        effects = true;
                        update = false;
                        for(i = 0; i < domObjs.length; i++) {
                            domObjs[i].div.style('z-index', '-1');
                        }
                        loop();
                    } else if(running && prg < tStamps[1]) {
                        prg += animSpeeds[0];
                        let dur = tStamps[1] - tStamps[0];
                        push();
                        strokeWeight(4);
                        line(x1, y1, (1-(prg/dur))*x1+(prg/dur)*x2, (1-(prg/dur))*y1+(prg/dur)*y2);
                        pop();
                    } else if(running && prg < tStamps[2]) {
                        prg += animSpeeds[1];
                        let dur = tStamps[2] - tStamps[1];
                        push();
                        noStroke();
                        fill(`rgba(0, 0, 0, ${(prg - tStamps[1])/dur})`);
                        text("0", x2, y2 - lnHt);
                        pop();
                    } else if(running && prg < tStamps[3]) {
                        prg += animSpeeds[2];
                    } else if(running && prg < tStamps[4]) {
                        prg += animSpeeds[3];
                        let dur = tStamps[4] - tStamps[3];
                        let k = Object.keys(eqns['fundamentals']);
                        let str = eqns['fundamentals'][k[choices[0]]];
                        selectItem(str, letters, choices[1]).forEach(function(elt) {elt.style.opacity = `${(tStamps[4]-prg)/dur}`});
                        
                        clear();
                        push();
                            noStroke();
                            fill(`rgba(0, 0, 0, ${Math.max((tStamps[4]-prg)/dur, 0)})`);
                            text("0", x2, y2 - lnHt);
                            stroke(`rgba(0, 0, 0, ${Math.max((tStamps[4]-prg)/dur, 0)})`);
                            strokeWeight(4);
                            line(x1, y1, x2, y2);
                        pop();
                        if((tStamps[4]-prg)/dur < 0.05) {selectItem(str, letters, choices[1]).forEach(function(elt) {elt.style.visibility="hidden"}); clear();}
                        /* for(let j=0; j<d.length; j++) {
                            d[j].style.opacity = (tStamps[4]-prg)/dur;
                        } */
                    } else if(running && prg < tStamps[5]){
                        if(prg < tStamps[4] + animSpeeds[4]) {
                            let dur = tStamps[5] - tStamps[4];
                            let slide = document.getElementById(`eq${choices[0]}`);
                            slide.style.transition = `all ${dur/animSpeeds[4]/fps}s`;
                            slide.style.top = `${texY}px`;
                            let distLeft = refLeft - getCoords(letters[2]).left
                            let curLeft = getCoords(letters[0]).left;
                            slide.style.left = `${curLeft + distLeft}px`;
                        }
                        prg += animSpeeds[4];
                    } else if(running && prg < tStamps[6]){
                        prg += animSpeeds[5];
                        let dur = tStamps[6] - tStamps[5];
                        if(choices[1] == 1) {
                            let k = Object.keys(eqns['fundamentals']);
                            let str = eqns['fundamentals'][k[choices[0]]];
                            xNew = getCoords(selectItem(str, letters, 1)[0]).left;
                            negativeQ = selectItem(str, letters, 2, true).charAt(0) == "+" ? false : true;
                            let move = selectItem(str, letters, 2); if(!negativeQ){move[0].style.visibility="hidden"; move.shift()}
                            xOrig = getCoords(move[0])["left"];
                            move.forEach(function(elt){elt.style.transition = `all ${dur/animSpeeds[5]/fps}s`; elt.style.transform = `translateX(${xNew-xOrig}px)`});
                        }
                        prg = tStamps[6];
                    } else if(running && prg >= tStamps[6]) {
                        running = false;
                        prg = 0;
                        return next(parseInt(`${page}`), null);
                    }
                    break;
            }            
        }
    }
}

function glow({continuous, duration, element, id}) {
    let frames = Math.floor(duration * fps/ 1000) ;
    let prog = (frameCount % frames) / frames;
    let x = continuous ? 0.5 + 0.5*Math.sin(prog*Math.PI) : 1;
    let rgb = id == 0 ? [0, 0, 0] : id == 1 ? [70, 200, 50] : id == 2 ? [100, 100, 255] : [0, 0, 0];
    let colr = `rgb(${rgb[0]*x},${rgb[1]*x},${rgb[2]*x})`;
    element.style.color = colr;
    if(continuous) {loop()};
}