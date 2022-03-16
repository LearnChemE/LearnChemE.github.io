require("bootstrap");
require("./style/style.scss");
window.p5 = new require("./js/p5.min.js");

// TO DO:

// GLOBAL VARIABLES OBJECT
window.gvs = {
    show_constant_temperature : true,
    show_constant_enthalpy: true,
    show_constant_quality: true,
    show_constant_entropy: true,
};

const containerElement = document.getElementById("p5-container");

const sketch = (p) => {

    p.setup = function() {
        p.createCanvas(800, 530);
        p.noLoop();
        gvs.p = p;
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