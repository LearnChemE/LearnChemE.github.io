require("bootstrap");
require("./style/style.scss");
window.p5 = new require("./js/p5.min.js");

// TO DO:

// GLOBAL VARIABLES OBJECT
window.gvs = {
    liquid_level: 0, // 0-1 value of how high liquid is in tank
    background_color: [253, 253, 253], // RGB color
    liquid_color: [150, 150, 255], // RGB color
    vapor_density: 0, // 0-1 value of how dark the vapor color is
    P: 15, // Pressure, bar
    V: 0, // moles of vapor in tank
    L: 0, // moles of liquid in tank
    T_initial: 35, // Initial temperature (deg. C)
    n: 1.0, // moles to inject (moles)
    chemical: "propane", // chemical to inject
    syringe_initial: 0.5, // The initial value for how far the syringe is pushed in. Dictated by moles to inject (n)
    syringe_fraction: 0.5, // How far pushed in the syringe is, 0-1
    is_running: false, // Whether the simulation is currently running
    is_finished: false, // Whether the animation has finished running
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
        p.background.apply(this, gvs.background_color);
        gvs.drawAll(p);
    };

};

const P5 = new p5(sketch, containerElement);