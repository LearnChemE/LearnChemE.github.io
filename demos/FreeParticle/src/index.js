require("bootstrap");
require("./style/style.scss");
window.p5 = new require("./js/p5.min.js");
window.math = require("./js/math.js");

// TO DO:

// GLOBAL VARIABLES OBJECT
window.gvs = {
    mass : 1,
    coefficients : {},
    individual_p_states_arrays : [],
    real_component_array : [],
    imaginary_component_array : [],
    product_array : [],
    t : 0,
    playing : false,
    colors : [],
    populate_quantity : 100,
};

const containerElement = document.getElementById("p5-container");

const sketch = (p) => {

    p.setup = function() {
        p.createCanvas(800, 700);
        p.noLoop();
        gvs.p = p;
        gvs.drawAll = require("./js/draw.js");
        require("./js/inputs.js");
        require("./js/initialization.js");
        gvs.calcAll = require("./js/calcs.js");
        p.windowResized = function() {

        }
    };

    p.draw = function() {
        p.background(253);
        gvs.calcAll();
        gvs.drawAll(p);
        if(gvs.playing) {
            gvs.t += 0.003;
        }
    };

};

const P5 = new p5(sketch, containerElement);