require("bootstrap");
require("./style/style.scss");
window.p5 = new require("./js/p5.min.js");

// TO DO:

// GLOBAL VARIABLES OBJECT
window.gvs = {
    work_type : "compression",
    P_final : 1.5e6,
    calculateFinalConditions : null,
    condition_1 : "reversible adiabatic",
    condition_2 : "reversible adiabatic",
    W_1 : 0,
    W_2 : 0,
    T_final_1 : 300,
    T_final_2 : 300,
    V_initial_1 : 1,
    V_initial_2 : 1,
    V_final_1 : 1,
    V_final_2 : 1,
    animation_fraction : 0,
    running : false,
};

const containerElement = document.getElementById("p5-container");

const sketch = (p) => {

    p.setup = function() {
        p.createCanvas(800, 530);
        p.noLoop();
        gvs.p = p;
        gvs.drawAll = require("./js/draw.js");
        require("./js/calcs.js");
        require("./js/inputs.js");
        
        p.windowResized = function() {

        }
    };

    p.draw = function() {
        p.background(253);
        if(gvs.running) {
            gvs.animation_fraction += 0.005;
            if(gvs.animation_fraction >= 1) {
                gvs.running = false;
                p.noLoop();
            }
        }
        gvs.drawAll(p);
    };

};

const P5 = new p5(sketch, containerElement);