import {ProblemController} from "../src/ProblemController.js";

const normalcursor = {
    "format": "x=~x~, y=~y~ z=~z~",
    "showpoint": true,
    "digits": {
        "x": 2,
        "y": 2,
        "z": 2,
    }
};

const graphinfos = [
    {
        "type": "equilateraltriangle",
        "graphheight": 450,
        "graphwidth": 430,
        "labellocation": "axis",
        "padding": {
            "left":60,
            "bottom":60,
            "top":60,
            "right":60
        },
        "graphbackground": "white",
        "axesbackground": "lightgray",
        "x": {
            "label": "carrier",
            "min": 0,
            "max": 1,
            "majortick": 0.1,
            "minortick": 0.1,
            "gridline": 0.1,
            "color": "red",
        },
        "y": {
            "label": "solute",
            "min": 0,
            "max": 1,
            "majortick": 0.1,
            "minortick": 0.1,
            "gridline": 0.1,
            "color": "blue",
        },
        "z": {
            "label": "solvent",
            "min": 0,
            "max": 1,
            "majortick": 0.1,
            "minortick": 0.1,
            "gridline": 0.1,
            "color": "green",
        },
    },
    {
        "type": "righttriangle",
        "graphheight": 450,
        "graphwidth": 430,
        "labellocation": "axis",
        "padding": {
            "left":60,
            "bottom":60,
            "top":60,
            "right":30
        },
        "graphbackground": "white",
        "axesbackground": "lightgray",
        "x": {
            "label": "carrier",
            "min": 0,
            "max": 1,
            "majortick": 0.1,
            "minortick": 0.1,
            "gridline": 0.1,
            "color": "red",
        },
        "y": {
            "label": "solute",
            "min": 0,
            "max": 1,
            "majortick": 0.1,
            "minortick": 0.1,
            "gridline": 0.1,
            "color": "blue",
        },
        "z": {
            "label": "solvent",
            "min": 0,
            "max": 1,
            "majortick": 0.1,
            "minortick": 0.1,
            "gridline": 0.1,
            "color": "green",
        },
    }
];

const problem = {
    "pagetitle": "Apply the Hunter-Nash Method to Liquid-Liquid Extraction",
    "variables": {
        "constants": {
            "AW": 5.0768,
        },
        "random": {
            "graphtype": {
                "min": 0,
                "max": 1,
                "digits": 0
            },
            "ptx": {
                "min": 0,
                "max": 1,
                "digits": 2
            },
            "ptyscale": {
                "min": 0,
                "max": 1,
                "digits": 2
            },
        },
        "calculated": {
            "graphtypes" : ["equilateraltriangle", "righttriangle"],
            "pty": "(1 - @ptx@) * @ptyscale@"
        }
    },
    "questions": [
        {
            "questionelements": [

            ],
            "requiredscore": 0.00
        }, // question
    ],
    "finish": {
        "variables": {
            "constants": {},
            "random": {},
            "calculated": {}
        },
        "questionelements": []
    }, // finish

    "begin": {
        "variables": {
            "constants": {},
            "random": {},
            "calculated": {}
        },
        "questionelements": [
            [{
                "type": "graph",
                "graphinfo": graphinfos[0],
                "mode": "move",
                "answercount": {
                    "point": 0,
                    "line": 0
                },
                "answer": {

                },
                "default": {
                    "point": [
                        {"x":"@ptx@", "y":"@pty@", "movex":true, "movey":true, "color":"red"},
                    ],
                },
                "cursor": normalcursor,
                "points": 10
            },
            {
                "type": "graph",
                "graphinfo": graphinfos[1],
                "mode": "move",
                "answercount": {
                    "point": 0,
                    "line": 0
                },
                "answer": {

                },
                "default": {
                    "point": [
                        {"x":"@ptx@", "y":"@pty@", "movex":true, "movey":true, "color":"red"},
                    ],
                },
                "cursor": normalcursor,
                "points": 10
            }]
        ]
    } // begin
}

let problemController = new ProblemController(problem, document.getElementById("myscript").getAttribute("parentid"));
