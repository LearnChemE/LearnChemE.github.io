require("./style/style.scss");
require("bootstrap");
require("./style/slider.scss");
window.p5 = new require("./js/p5.min.js");

// GLOBAL VARIABLES OBJECT
window.gvs = {
    scale: 1,
};

// JavaScript modules from /js/ folder
const { calcAll } = require("./js/calcs.js"); // contains all calculation-related functions
const { importSVG } = require("./js/importSVG.js"); // adds inline-SVG to the document
const { updateSVG } = require("./js/updateSVG.js");

const containerElement = document.getElementById("svg-container");

const sketch = (p) => {

    p.setup = function () {
        document.getElementById("loading").style.display = "none";
        p.noLoop();
        p.noCanvas();
        importSVG();
        window.gvs.p = p;
    };

    p.draw = function () {
        p.background(253);
        calcAll();
        updateSVG();
    };

};

const P5 = new p5(sketch, containerElement);

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
