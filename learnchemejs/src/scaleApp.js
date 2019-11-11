/**
 * 
 * @param {Number} frac //scales the body of document by 'frac' and shifts it to the top-left  
 */
export function scale(frac) {
    document.body.style.transform = `translate(${(frac-1)*50}%, ${(frac-1)*50}%)`;
    document.body.style.transform += `scale(${frac})`;
}