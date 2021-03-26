require("./style/style.scss");
require("bootstrap");
require("./style/slider.scss");
window.p5 = new require("./js/p5.min.js");

// GLOBAL VARIABLES OBJECT
window.gvs = {

};

// JavaScript modules from /js/ folder
const { calcAll } = require("./js/calcs.js"); // contains all calculation-related functions
const { drawAll } = require("./js/draw.js"); // contains all drawing-related functionality

const containerElement = document.getElementById("p5-container");


const sketch = (p) => {

    p.setup = function () {
        p.createCanvas(800, 500);
        p.noLoop();
        window.gvs.p = p;
        document.getElementById("loading").style.display = "none";
    };

    p.draw = function () {
        p.background(253);
        calcAll();
        drawAll(p);
    };

};

const P5 = new p5(sketch, containerElement);

const zSlider = document.getElementById("z-slider");
const heatSlider = document.getElementById("heat-slider");
const zValue = document.getElementById("z-value");
const heatValue = document.getElementById("heat-value");
const resetButton = document.getElementById("reset-button");

zSlider.addEventListener("input", () => {
    gvs.z = Number(Number(zSlider.value).toFixed(2));
    zValue.innerHTML = Number(zSlider.value).toFixed(2);
    P5.redraw();
});

heatSlider.addEventListener("input", () => {
    gvs.H = Number(Number(heatSlider.value).toFixed(1));
    heatValue.innerHTML = Number(gvs.H).toFixed(1);
    P5.redraw();
});

resetButton.addEventListener("change", () => {
    resetToInitialConditions();
    P5.redraw();
});

function  resetToInitialConditions() {

};
