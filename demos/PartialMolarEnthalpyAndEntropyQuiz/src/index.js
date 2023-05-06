require("bootstrap");
require("./style/style.scss");
window.p5 = new require("./js/p5.js");

// TO DO:

// GLOBAL VARIABLES OBJECT
window.gvs = {
    step: 1,
    show_solution: false,
    HS: "enthalpy",
    plot : {
        margins: [[100, 50], [60, 80]],
        labels: [["molar enthalpy (kJ/mol)", ""], ["", "mole fraction A"]],
        domain: [0, 1, 0.1, 0.02],
        range: [30, 90, 10, 2],
    },
};

const containerElement = document.getElementById("p5-container");

const sketch = (p) => {

    p.setup = function() {
        p.createCanvas(800, 530);
        gvs.p = p;
        gvs.drawAll = require("./js/draw.js");
        require("./js/initialize.js");
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