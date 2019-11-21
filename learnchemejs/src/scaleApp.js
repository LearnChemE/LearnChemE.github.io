/**
 * 
 * @param {Number} frac //scales the body of document by 'frac' and shifts it to the top-left  
 */
export function scale(frac) {
/*     document.body.style.transform = `translate(${(frac-1)*50}%, ${(frac-1)*50}%)`;
    document.body.style.transform += `scale(${frac})`;
    document.body.style.css("-webkit-transform", "scale(" + frac + ")"); */
    let style;
    if(!document.head.contains(document.getElementById('transformStyle'))) {
        style = document.createElement('style');
        style.id = 'transformStyle';
    } else {style = document.getElementById('transformStyle');}
    style.innerHTML =
        `body {` +
            `transform: translate(${(frac-1)*50}%, ${(frac-1)*50}%) scale(${frac});` +
            `-webkit-transform: translate(${(frac-1)*50}%, ${(frac-1)*50}%) scale(${frac});` +
            `}`;
    let ref = document.querySelector('script');
    ref.parentNode.insertBefore(style, ref);
    document.body.style.display = 'none';
    window.setTimeout(()=>{document.body.style.display = 'block';},50);
}
