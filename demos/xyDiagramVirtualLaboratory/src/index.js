require("bootstrap");
require("./style/style.scss");
window.p5 = new require("./js/p5.min.js");

// TO DO:

// GLOBAL VARIABLES OBJECT

window.gvs = {
    yA : function(xA) {return 1},
    volume_A : 50,
    MW_A : undefined,
    MW_B : undefined,
    density_A : undefined,
    density_B : undefined,
    molar_density_A : undefined,
    molar_density_B : undefined,
    xA_flask : undefined,
    volume_A_remaining : 1000,
    volume_B_remaining : 1000,
    yA_sample : NaN,
    temperature_flask : undefined,
    not_enough_liquid : false,
    submission_stage : 1,
    A12_submission : undefined,
    A12_CI_submission : undefined,
    A21_submission : undefined,
    A21_CI_submission : undefined,
    names : "no names specified",
    measurements : [],
};

require("./js/initialize.js");
const VLE_apparatus_svg = require("./assets/VLE_Apparatus.svg");

const containerElement = document.getElementById("p5-container");

containerElement.innerHTML = VLE_apparatus_svg;

const sketch = (p) => {

    p.setup = function() {
        p.createCanvas(800, 530);
        p.noLoop();
        gvs.p = p;

        gvs.drawAll = require("./js/draw.js");
        require("./js/inputs.js");
        document.getElementById("tspan850").innerHTML = `${gvs.temperature_flask.toFixed(1)}°C`;
        p.windowResized = function() {

        }
    };

    p.draw = function() {
        p.background(253);
        gvs.drawAll(p);
    };

};

const P5 = new p5(sketch, containerElement);