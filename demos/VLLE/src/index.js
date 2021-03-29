require("./style/style.scss");
require("bootstrap");
require("./style/slider.scss");
window.p5 = new require("./js/p5.min.js");

// GLOBAL VARIABLES OBJECT
window.gvs = {
    Tinit : 70,
    z : Number(document.getElementById("z-slider").value),
    heat : Number(document.getElementById("heat-slider").value),
    scale: 1
};

// JavaScript modules from /js/ folder
const { calcAll } = require("./js/calcs.js"); // contains all calculation-related functions
const { drawAll } = require("./js/draw.js"); // contains all drawing-related functionality

const containerElement = document.getElementById("p5-container");


const sketch = (p) => {

    let font;

    p.preload = function() {
        document.getElementById("loading").style.display = "none";
        font = p.loadFont('resources/OpenSans-Regular.ttf');
    };

    p.setup = function () {
        p.createCanvas(770, 450);
        p.textFont(font);
        p.noLoop();
        window.gvs.p = p;
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
const sizeIncrease = document.getElementById("size-increase");
const sizeDecrease = document.getElementById("size-decrease");

zSlider.addEventListener("input", () => {
    gvs.z = Number(Number(zSlider.value).toFixed(2));
    zValue.innerHTML = Number(zSlider.value).toFixed(2);
    P5.redraw();
});

heatSlider.addEventListener("input", () => {
    gvs.heat = Number(Number(heatSlider.value).toFixed(1));
    heatValue.innerHTML = Number(gvs.heat).toFixed(1);
    P5.redraw();
});

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
    zSlider.value = "0.50";
    gvs.z = Number(Number(zSlider.value).toFixed(2));
    zValue.innerHTML = Number(zSlider.value).toFixed(2);
    heatSlider.value = "0";
    gvs.heat = Number(Number(heatSlider.value).toFixed(1));
    heatValue.innerHTML = Number(gvs.heat).toFixed(1);
    P5.redraw();
};
