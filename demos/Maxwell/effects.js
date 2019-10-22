var glowList = [];

function applyEffect(a) {
    for(i = 0; i < a.length; i++) {
        let t = a[i]['target'];
        let f = a[i]['effect'];
        /* option to specify between effects on DOM object or canvas object. Defaults to DOM. */
        let domQ = (a[i]['type'] || "DOM") == "cnvElement" ? false : true;
        
        if (domQ) {
            switch(f) {
                case 'fade':
                    t.style.opacity = 1;
                    t.style.transition = "opacity 0.5s";
                    t.style.opacity = 0;
                    effects = false;
                    break;
                case 'expand':
                    t.style.fontSize = fontSize;
                    t.style.transition = "all 1s";
                    t.firstChild.style.transition = "all 1s";
                    t.firstChild.style.fontSize = `${fontSize * 2.5 / 10}rem`;
                    t.style.top = `${10 + 2 * lnHt}px`;
                    effects = false;
                    break;
                case 'glow':
                    glow({
                        duration: 2000,  
                        element: t,
                        id: Math.floor(i / 2)
                    });
                    effects = true;
                    break;
            }            
        }
    }
    
    setTimeout(function(){ update = true; }, 1000);
}

function glow({duration, element, id}) {
    let frames = Math.floor(duration * fps/ 1000) ;
    let prog = (frameCount % frames) / frames;
    let x = 0.5 + 0.5*Math.sin(prog*Math.PI);
    let rgb = id == 0 ? [255, 100, 100] : id == 1 ? [100, 255, 100] : id == 2 ? [100, 100, 255] : [50, 128, 128];
    let colr = `rgb(${rgb[0]*x},${rgb[1]*x},${rgb[2]*x})`;
    element.style.color = colr;
    if(window["lalala"] == true) {console.log(colr); window["lalala"] = false;}
}