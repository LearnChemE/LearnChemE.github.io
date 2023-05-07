require("bootstrap");
require("./style/style.scss");
window.p5 = new require("./js/p5.js");

// TO DO:

// GLOBAL VARIABLES OBJECT
window.g = {
    venturi_outer : 20 * (250 / 120), // mm
    venturi_inner : 10 * (250 / 120), // mm
    pressure_1 : 100, // mmH2O
    pressure_2 : 0, // mmH2O
    pressure_3 : 0, // mmH2O
    pressure_4 : 0, // mmH2O
    pressure_5 : 0, // mmH2O
    velocity_1 : 0, // mm/s
    velocity_2 : 0, // mm/s
    velocity_3 : 0, // mm/s
    velocity_4 : 0, // mm/s
    velocity_5 : 0, // mm/s
    friction_loss : false,
};

const containerElement = document.getElementById("p5-container");

const sketch = (p) => {

    p.setup = function() {
        p.createCanvas(800, 530);
        p.noLoop();
        g.p = p;
        g.drawAll = require("./js/draw.js");
        require("./js/inputs.js");
        g.calcAll = require("./js/calcs.js");  
        p.windowResized = function() {

        }
    };

    p.draw = function() {
        p.background(253);
        g.calcAll();
        g.drawAll(p);
    };

};

const P5 = new p5(sketch, containerElement);