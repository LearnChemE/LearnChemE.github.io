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
    loc_H_1: [0.5, 80],
    loc_H_2: [0.5, 80],
    loc_H_3: [0.5, 80],
    loc_H_4_1: [0.4, 80],
    loc_H_4_2: [0.6, 80],
    loc_H_5: [0.5, 80],
    loc_H_7_B: [0, 80],
    loc_H_7_A: [1, 80],
    loc_S_1: [0.5, 50],
    loc_S_2: [0.5, 50],
    loc_S_3: [0.5, 50],
    loc_S_4: [0.5, 50],
    loc_S_5_B: [0, 50],
    loc_S_5_A: [1, 50],
    input_S_4_value: "",
    input_H_5_value: "",
    input_H_6_value: "",
    dragging_loc_1: false,
    dragging_loc_2: false,
    show_solution: false,
    answer_H_1: [0, 0],
    answer_H_2: [0, 0],
    answer_H_3: [0, 0],
    answer_H_4_B: [0, 0],
    answer_H_4_A: [0, 0],
    answer_H_5: [0, 0],
    answer_H_5_input: "",
    answer_H_6_input: "",
    answer_H_7_B: [0, 0],
    answer_H_7_A: [0, 0],
    answer_S_1: [0, 0],
    answer_S_2: [0, 0],
    answer_S_3: [0, 0],
    answer_S_4: [0, 0],
    answer_S_4_input: "",
    answer_S_5_B: [0, 0],
    answer_S_5_A: [0, 0],
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