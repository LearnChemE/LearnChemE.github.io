require("./style/style.scss");
require("bootstrap");
require("./style/slider.scss");
window.p5 = new require("./js/p5.min.js");

// GLOBAL VARIABLES OBJECT
window.gvs = {
    scale: 1,
    cnv: undefined,
    flasks: [],
    still: undefined,
};

// JavaScript modules from /js/ folder
const { calcAll } = require("./js/calcs.js"); // contains all calculation-related functions
const { importSVG, addStill } = require("./js/importSVG.js"); // adds inline-SVG to the document
const { resizeFlasks, updateImage } = require("./js/update.js");

const containerElement = document.getElementById("svg-container");
const p5container = document.getElementById("p5-container");

const sketch = (p) => {

    p.setup = function () {
        document.getElementById("loading").style.display = "none";
        p.noLoop();
        importSVG();
        addStill();
        window.gvs.addFlask();
        p.windowResized();
        window.gvs.p = p;
    };

    p.draw = function () {
        p.background(252);
        calcAll();
        updateImage();
    };

    p.windowResized = function() {
        const svgCnvElt = document.getElementById("canvas-rect");
        const rect = svgCnvElt.getBoundingClientRect();
        const w = rect.width;
        const h = rect.height;
        const top = rect.top;
        const left = rect.left;
        window.gvs.cnv = p.createCanvas(w, h);
        p5container.style.top = `${top}px`;
        p5container.style.left = `${left}px`;
        resizeFlasks();
    }

};

const P5 = new p5(sketch, p5container);

// const oneSlider = document.getElementById("one-slider");
// const oneValue = document.getElementById("one-value");

const resetButton = document.getElementById("reset-button");
const sizeIncrease = document.getElementById("size-increase");
const sizeDecrease = document.getElementById("size-decrease");

// oneSlider.addEventListener("input", () => {
//     oneValue.innerHTML = Number(oneSlider.value).toFixed(2);
//     P5.redraw();
// });

resetButton.addEventListener("click", () => {
    resetToInitialConditions();
    P5.redraw();
});

sizeDecrease.addEventListener("click", () => {
    gvs.scale *= 0.9;
    document.body.style.transform = `translate(${-1 * (1 - gvs.scale) * 500}px, ${-1 * (1 - gvs.scale) * 250}px) scale(${gvs.scale})`;
});

sizeIncrease.addEventListener("click", () => {
    gvs.scale *= 1.1;
    document.body.style.transform = `translate(${-1 * (1 - gvs.scale) * 500}px, ${-1 * (1 - gvs.scale) * 250}px) scale(${gvs.scale})`;
});

function  resetToInitialConditions() {

};
