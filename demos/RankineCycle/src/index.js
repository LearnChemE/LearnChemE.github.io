require("bootstrap");
require("./style/style.scss");
window.p5 = new require("./js/p5.min.js");

// TO DO:

// GLOBAL VARIABLES OBJECT
window.gvs = {
    display: "P-H diagram",
    turbine_efficiency: 0.75,
    inlet_p3_pressure: 2.00,
    outlet_p4_pressure: 0.01,
    plot : {
        margins: [[100, 50], [40, 80]],
        labels: [["pressure (MPa)", ""], ["", "enthalpy (kJ/kg)"]],
        domain: [-200, 4000, 1000, 200],
        range: [0.001, 100],
    },
};

const containerElement = document.getElementById("p5-container");

const sketch = (p) => {

    p.setup = function() {
        p.createCanvas(800, 530);
        p.noLoop();
        gvs.p = p;
        gvs.drawAll = require("./js/draw.js");
        require("./js/initialize.js");
        gvs.calcAll = require("./js/calcs.js");
        require("./js/inputs.js");
        
        p.windowResized = function() {

        }
    };

    p.draw = function() {
        p.background(253);
        gvs.calcAll();
        gvs.drawAll(p);
    };

};

const P5 = new p5(sketch, containerElement);