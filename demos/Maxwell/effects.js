var glowList = [];
let running = false;
let prg = 0;
let x1, x2, y1, y2;

function applyEffect(a) {

    for(i = 0; i < a.length; i++) {
        let t = a[i]['target'];
        let f = a[i]['effect'];
        let col = a[i]['color'] || null;
        /* option to specify between effects on DOM object or canvas object. Defaults to DOM. */
        let domQ = (a[i]['type'] || "DOM") == "cnvElement" ? false : true;
        
        if (domQ) {
            switch(f) {
                case 'fade':
                    t.style.opacity = 1;
                    t.style.transition = "opacity 0.5s";
                    t.style.opacity = 0;
                    break;
                case 'expand':
                    t.style.fontSize = fontSize;
                    t.style.transition = "all 1s";
                    t.firstChild.style.transition = "all 1s";
                    t.firstChild.style.fontSize = `${fontSize * 2.5 / 10}rem`;
                    t.style.top = `${10 + 2 * lnHt}px`;
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
                    if(!running) {
                        prg = 0;
                        x1 = t[0].getClientRects()[0]["left"];
                        x2 = t[1].getClientRects()[0]["right"];
                        y1 = t[0].getClientRects()[0]["bottom"] + 25;
                        y2 = t[1].getClientRects()[0]["top"] - 25;
                        running = true;
                        effects = true;
                        update = false;
                        for(i = 0; i < domObjs.length; i++) {
                            domObjs[i].div.style('z-index', '-1');
                        }
                        loop();
                    } else if(running && prg < 0.5) {
                        prg += 0.025;
                        let dur = 0.5;
                        push();
                        strokeWeight(4);
                        line(x1, y1, (1-(prg/dur))*x1+(prg/dur)*x2, (1-(prg/dur))*y1+(prg/dur)*y2);
                        pop();
                    } else if(running && prg < 1) {
                        prg += 0.025;
                        let dur = 0.5;
                        push();
                        noStroke();
                        fill(`rgba(0, 0, 0, ${(prg-dur)/dur})`);
                        text("0", x2, y2 - lnHt);
                        pop();
                    } else if(running && prg >= 1) {
                        running = false;
                        effects = false;
                        prg = 0;
                        noLoop();
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
    let rgb = id == 0 ? [255, 100, 100] : id == 1 ? [100, 255, 100] : id == 2 ? [100, 100, 255] : [50, 128, 128];
    let colr = `rgb(${rgb[0]*x},${rgb[1]*x},${rgb[2]*x})`;
    element.style.color = colr;
    if(continuous) {loop()};
}