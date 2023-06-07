require("bootstrap");
require("./style/style.scss");
window.p5 = new require("./js/p5.min.js");

// TO DO:

// GLOBAL VARIABLES OBJECT
window.gvs = {
    plot : {
        margins: [[100, 50], [40, 80]],
        labels: [["vapor mole fraction", ""], ["", "liquid mole fraction"]],
        domain: [0, 1, 0.2, 0.05],
        range: [0, 1, 0.2, 0.05],
    },
    step : 1,
    substep : 1,
    q : 0.5,
    stage_inc : 0,
    z : 0.5,
    xD : 0.85,
    xB : 0.05,
};

require("./js/equilb.js");

const containerElement = document.getElementById("p5-container");

const sketch = (p) => {

    p.setup = function() {
        p.createCanvas(800, 530);
        p.noLoop();
        gvs.p = p;
        gvs.calcAll = require("./js/calcs.js");
        gvs.drawAll = require("./js/draw.js");
        require("./js/inputs.js");
        
        p.windowResized = function() {

        }
    };

    p.draw = function() {
        p.background(253);
        gvs.drawAll(p);
    };

};

const P5 = new p5(sketch, containerElement);