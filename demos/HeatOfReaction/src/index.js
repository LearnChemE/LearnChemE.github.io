require("./style/style.scss");
require("bootstrap");
require("./style/slider.scss");
window.p5 = new require("./js/p5.js");

// GLOBAL VARIABLES OBJECT
window.gvs = {
    T: Number(document.getElementById("t-slider").value),
    X: Number(document.getElementById("x-slider").value),
    chemicals: {}
};

// JavaScript modules from /js/ folder
require("./js/addChemicals.js"); // adds chemicals and chemical properties to window.gvs.chemicals object
const { calcAll } = require("./js/calcs.js"); // contains all calculation-related functions
const { drawAll } = require("./js/draw.js"); // contains all drawing-related functionality

const containerElement = document.getElementById("p5-container");


const sketch = (p) => {

    p.setup = function () {
        p.createCanvas(600, 500);
        p.noLoop();
        gvs.p = p;
    };

    p.draw = function () {
        p.background(250);
        calcAll();
        drawAll(p);
    };

};

const P5 = new p5(sketch, containerElement);

const tSlider = document.getElementById("t-slider");
const xSlider = document.getElementById("x-slider");
const tValue = document.getElementById("t-value");
const xValue = document.getElementById("x-value");

tSlider.addEventListener("input", () => {
    gvs.T = Number(Number(tSlider.value).toFixed(0));
    tValue.innerHTML = Number(gvs.T).toFixed(0);
    P5.redraw();
});

xSlider.addEventListener("input", () => {
    gvs.X = Number(Number(xSlider.value).toFixed(2));
    xValue.innerHTML = Number(gvs.X).toFixed(2);
    P5.redraw();
});