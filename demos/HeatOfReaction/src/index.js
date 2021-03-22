require("./style/style.scss");
require("bootstrap");
require("./style/slider.scss");
window.p5 = new require("./js/p5.min.js");

// GLOBAL VARIABLES OBJECT
window.gvs = {
    T: Number(document.getElementById("t-slider").value) + 273.15,
    X: Number(document.getElementById("x-slider").value),
    reaction: "acetylene hydrogenation",
    H: function(T, X) {},
    Hrxn: 0,
    currentH: 0,
    xRange: [0, 1],
    yRange: [0, 1],
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
        changeReaction("1");
        document.getElementById("loading").style.display = "none";
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
const selectReaction = document.getElementById("select-reaction");

tSlider.addEventListener("input", () => {
    gvs.T = Number(Number(tSlider.value).toFixed(0)) + 273.15;
    tValue.innerHTML = Number(Number(tSlider.value).toFixed(0));
    P5.redraw();
});

xSlider.addEventListener("input", () => {
    gvs.X = Number(Number(xSlider.value).toFixed(2));
    xValue.innerHTML = Number(gvs.X).toFixed(2);
    P5.redraw();
});

selectReaction.addEventListener("change", () => {
    changeReaction(selectReaction.value);
    gvs.p.redraw();
});

function changeReaction(rxn) {
    switch( rxn ) {
        case "1":
            gvs.reaction = "acetylene hydrogenation";
            gvs.xRange = [0, 350];
            gvs.yRange = [25, 1000];
            tSlider.setAttribute("min", "30");
            tSlider.setAttribute("max", "900");
            tSlider.setAttribute("step", "10");
            gvs.H = function(T, X) {
                const H0 = gvs.chemicals.hydrogen.enthalpy(T) + gvs.chemicals.acetylene.enthalpy(T);
                const H1 = gvs.chemicals.ethylene.enthalpy(T);
                return H0 + X * (H1 - H0);
            }
            gvs.Hrxn = gvs.H(gvs.T, 1) - gvs.H(gvs.T, 0);
        break;

        case "2":

        break;
        
        case "3":

        break;
    };
}