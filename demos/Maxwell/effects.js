function applyEffect(a) {
    let i = 0;
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
                    break;
                case 'expand':
                    t.style.fontSize = fontSize;
                    t.style.transition = "all 1s";
                    t.style.transform = "scale(4)";
                    t.style.transform += "translateX(calc(50% - 10px))";
                    t.style.top = `${10 * htRelative}px`;
                    break;
            }            
        }
    }
}