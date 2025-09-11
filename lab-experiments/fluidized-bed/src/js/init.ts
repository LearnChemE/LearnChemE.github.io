
/* ************************** */
/* **** Create SVG Image ****/
/* ************************** */

// Insert an svg image 
function insertSVG(svg: string): HTMLDivElement {
    const div = document.createElement("div");
  
    // Set basic attributes
    div.id = "apparatus-wrapper";
    div.innerHTML = svg;
    return div;
}

// Create div containing svg
const svg = require("../media/Fluidized-bed-graphics.svg");
const apparatus = insertSVG(svg) as unknown as SVGAElement;

// Find wrapper and append svg div
const wrapper = document.getElementById("graphics-wrapper");
wrapper.appendChild(apparatus);
console.log("svg created");
