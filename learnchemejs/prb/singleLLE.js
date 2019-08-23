import {ProblemController} from "../src/ProblemController.js";

const equilibriumdatalinecolor = "black";

const normalcursor = {
    //"format": "<color:red>x=~x~</color>, <color:blue>y=~y~</color>, <color:green>z=~z~</color>",
    "format": "(<color:red>~x~</color>, <color:blue>~y~</color>, <color:green>~z~</color>)",
    "showpoint": false,
    "digits": {
        "x": 2,
        "y": 2,
        "z": 2,
    }
};

const pointtolerance = {
    "x":0.05,
    "y":0.05
};

// g1 = 0 or 1, g2 is the other
const g1 = Math.round(Math.random());
const g2 = 1 - g1;

const graphinfos = [
    {
        "type": "equilateraltriangle",
        "graphheight": 380,
        "graphwidth": 400,
        "labellocation": "axis",
        "padding": {
            "left":40,
            "bottom":60,
            "top":40,
            "right":40
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
        "graphheight": 380,
        "graphwidth": 400,
        "labellocation": "axis",
        "padding": {
            "left":60,
            "bottom":60,
            "top":40,
            "right":40
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

const envelope = [
    {
        "points": [
            {"x": "@envelope0x@", "y": "@envelope0y@", "alpha":0.1, "show":false},
            {"x": "@envelope1x@", "y": "@envelope1y@", "alpha":0.1, "show":false},
            {"x": "@envelope2x@", "y": "@envelope2y@", "alpha":0.1, "show":false},
            {"x": "@envelope3x@", "y": "@envelope3y@", "alpha":0.1, "show":false},
            {"x": "@envelope4x@", "y": "@envelope4y@", "alpha":0.1, "show":false},
            {"x": "@envelope5x@", "y": "@envelope5y@", "alpha":0.1, "show":false},
            {"x": "@envelope6x@", "y": "@envelope6y@", "alpha":0.1, "show":false},
            {"x": "@envelope7x@", "y": "@envelope7y@", "alpha":0.1, "show":false},
        ],
        "tension": 0.3,
        "color": equilibriumdatalinecolor,
    },
    {
        "points": [
            {"x": "@ties00x@", "y": "@ties00y@", "show":false},
            {"x": "@ties01x@", "y": "@ties01y@", "show":false},
        ],
        "tension": 0.0,
        "color": equilibriumdatalinecolor,
    },
    {
        "points": [
            {"x": "@ties10x@", "y": "@ties10y@", "show":false},
            {"x": "@ties11x@", "y": "@ties11y@", "show":false},
        ],
        "tension": 0.0,
        "color": equilibriumdatalinecolor,
    },
    {
        "points": [
            {"x": "@ties20x@", "y": "@ties20y@", "show":false},
            {"x": "@ties21x@", "y": "@ties21y@", "show":false},
        ],
        "tension": 0.0,
        "color": equilibriumdatalinecolor,
    },
    {
        "points": [
            {"x": "@ties30x@", "y": "@ties30y@", "show":false},
            {"x": "@ties31x@", "y": "@ties31y@", "show":false},
        ],
        "tension": 0.0,
        "color": equilibriumdatalinecolor,
    },
    {
        "points": [
            {"x": "@ties40x@", "y": "@ties40y@", "show":false},
            {"x": "@ties41x@", "y": "@ties41y@", "show":false},
        ],
        "tension": 0.0,
        "color": equilibriumdatalinecolor,
    },
];
const envelope2 = JSON.parse(JSON.stringify(envelope));

const problem = {
    "pagetitle": "Construct Single-Stage Liquid-Liquid Extraction",
    "variables": {
        "constants": {
            "center": 0.3333,
            "F": 50,
            "allenvelope": `[
                [[0.09, 0.0], [0.105, 0.13], [0.13, 0.3], [0.19, 0.44], [0.335, 0.49], [0.49, 0.42], [0.7, 0.26], [0.98, 0.0]],
                [[0.0545, 0.0], [0.069, 0.134], [0.0925, 0.267], [0.1605, 0.36], [0.335, 0.398], [0.504, 0.338], [0.6765, 0.232], [0.956, 0.0]],
                [[0.098, 0.0], [0.12, 0.126], [0.15, 0.213], [0.253, 0.338], [0.374, 0.352], [0.5635, 0.284], [0.69, 0.205], [0.92, 0.0]],
                [[0.07, 0.0], [0.07, 0.14], [0.085, 0.35], [0.14, 0.56], [0.265, 0.59], [0.49, 0.425], [0.7, 0.24], [0.95, 0.0]],
                [[0.0, 0], [0.045, 0.15], [0.07, 0.32], [0.115, 0.45], [0.215, 0.519], [0.397, 0.482], [0.62, 0.3], [0.93, 0.0]]]`,
            "allties": `[
                [
                    [[0.094, 0.052], [0.9, 0.078]],
                    [[0.1, 0.104], [0.7935, 0.173]],
                    [[0.1135, 0.173], [0.7, 0.26]],
                    [[0.126, 0.268], [0.597, 0.346]],
                    [[0.15, 0.372], [0.463, 0.433]]
                ],
                [
                    [[0.065, 0.07], [0.855, 0.09]],
                    [[0.07, 0.12], [0.755, 0.17]],
                    [[0.075, 0.18], [0.645, 0.25]],
                    [[0.085, 0.23], [0.54, 0.32]],
                    [[0.1, 0.28], [0.46, 0.36]]
                ],
                [
                    [[0.105, 0.03], [0.855, 0.06]],
                    [[0.11, 0.09], [0.8, 0.11]],
                    [[0.125, 0.15], [0.735, 0.17]],
                    [[0.153, 0.216], [0.635, 0.245]],
                    [[0.189, 0.27], [0.505, 0.31]]
                ],
                [
                    [[0.07, 0.06], [0.85, 0.1]],
                    [[0.073, 0.15], [0.735, 0.21]],
                    [[0.078, 0.26], [0.575, 0.35]],
                    [[0.092, 0.37], [0.45, 0.46]],
                    [[0.115, 0.51], [0.32, 0.56]]
                ],
                [
                    [[0.02, 0.07], [0.815, 0.11]],
                    [[0.04, 0.13], [0.73, 0.2]],
                    [[0.055, 0.22], [0.6, 0.32]],
                    [[0.075, 0.33], [0.495, 0.41]],
                    [[0.11, 0.44], [0.35, 0.5]]
                ]
            ]`,
        },
        "random": {
            "equilibriumindex": {
                "min": 0,
                "max": 4,
                "digits": 0
            },
            "carrierfrac": {
                "min": .45,
                "max": .75,
                "digits": 2
            },
            "FS": {
                "min": .1,
                "max": 5,
                "digits": 2
            },
        },
        "calculated": {
            "envelope0x": "@allenvelope@[@equilibriumindex@][0][0]",
            "envelope0y": "@allenvelope@[@equilibriumindex@][0][1]",
            "envelope1x": "@allenvelope@[@equilibriumindex@][1][0]",
            "envelope1y": "@allenvelope@[@equilibriumindex@][1][1]",
            "envelope2x": "@allenvelope@[@equilibriumindex@][2][0]",
            "envelope2y": "@allenvelope@[@equilibriumindex@][2][1]",
            "envelope3x": "@allenvelope@[@equilibriumindex@][3][0]",
            "envelope3y": "@allenvelope@[@equilibriumindex@][3][1]",
            "envelope4x": "@allenvelope@[@equilibriumindex@][4][0]",
            "envelope4y": "@allenvelope@[@equilibriumindex@][4][1]",
            "envelope5x": "@allenvelope@[@equilibriumindex@][5][0]",
            "envelope5y": "@allenvelope@[@equilibriumindex@][5][1]",
            "envelope6x": "@allenvelope@[@equilibriumindex@][6][0]",
            "envelope6y": "@allenvelope@[@equilibriumindex@][6][1]",
            "envelope7x": "@allenvelope@[@equilibriumindex@][7][0]",
            "envelope7y": "@allenvelope@[@equilibriumindex@][7][1]",
            "ties00x": "@allties@[@equilibriumindex@][0][0][0]",
            "ties00y": "@allties@[@equilibriumindex@][0][0][1]",
            "ties01x": "@allties@[@equilibriumindex@][0][1][0]",
            "ties01y": "@allties@[@equilibriumindex@][0][1][1]",
            "ties10x": "@allties@[@equilibriumindex@][1][0][0]",
            "ties10y": "@allties@[@equilibriumindex@][1][0][1]",
            "ties11x": "@allties@[@equilibriumindex@][1][1][0]",
            "ties11y": "@allties@[@equilibriumindex@][1][1][1]",
            "ties20x": "@allties@[@equilibriumindex@][2][0][0]",
            "ties20y": "@allties@[@equilibriumindex@][2][0][1]",
            "ties21x": "@allties@[@equilibriumindex@][2][1][0]",
            "ties21y": "@allties@[@equilibriumindex@][2][1][1]",
            "ties30x": "@allties@[@equilibriumindex@][3][0][0]",
            "ties30y": "@allties@[@equilibriumindex@][3][0][1]",
            "ties31x": "@allties@[@equilibriumindex@][3][1][0]",
            "ties31y": "@allties@[@equilibriumindex@][3][1][1]",
            "ties40x": "@allties@[@equilibriumindex@][4][0][0]",
            "ties40y": "@allties@[@equilibriumindex@][4][0][1]",
            "ties41x": "@allties@[@equilibriumindex@][4][1][0]",
            "ties41y": "@allties@[@equilibriumindex@][4][1][1]",
            "solutefrac": "1 - @carrierfrac@",
            "carrierpct": "(100 * @carrierfrac@).toFixed(0)",
            "solutepct": "(100 * @solutefrac@).toFixed(0)",
            "S": "(@F@ / @FS@).toFixed(1)",
            "mixx": "(@carrierfrac@ * @F@ / (@F@ + @S@)).toFixed(2)",
            "mixy": "(@solutefrac@ * @F@ / (@F@ + @S@)).toFixed(2)",
            "mixz": "(@S@ / (@F@ + @S@)).toFixed(2)",
        }
    },
    "questions": [
        {
            "questionelements": [
                [{
                    "type": "text",
                    "label": "Click and drag the orange point to the feed composition.",
                    "class": "prompt"
                },
                {
                    "type": "text",
                    "label": "mass % in feed: <table><tr><td>carrier</td><td>@carrierpct@%</td></tr><tr><td>solute</td><td>@solutepct@%</td></tr><tr><td>solvent</td><td>0%</td></tr></table>",
                    "class": "data"
                }],
                [{
                    "type": "graph",
                    "graphinfo": graphinfos[g1],
                    "mode": "move",
                    "answercount": {
                        "point": 1,
                        "line": 0
                    },
                    "answer": {
                        "point": [
                            {"x":"@carrierfrac@", "y":"@solutefrac@", "tolerance":pointtolerance, "color":"orange"}
                        ],
                    },
                    "default": {
                        "point": [
                            {"x":"@center@", "y":"@center@", "movex":true, "movey":true, "answer":true, "color":"orange"},
                        ],
                        "line": [
                            ...envelope,
                        ],
                    },
                    "cursor": normalcursor,
                    "points": 10
                },
                {
                    "type": "graph",
                    "graphinfo": graphinfos[g2],
                    "mode": "move",
                    "answercount": {
                        "point": 1,
                        "line": 0
                    },
                    "answer": {
                        "point": [
                            {"x":"@carrierfrac@", "y":"@solutefrac@", "tolerance":pointtolerance, "color":"orange"}
                        ],
                    },
                    "default": {
                        "point": [
                            {"x":"@center@", "y":"@center@", "movex":true, "movey":true, "answer":true, "color":"orange"},
                        ],
                        "line": [
                            ...envelope2,
                        ],
                    },
                    "cursor": normalcursor,
                    "points": 10
                }],
                {
                    "type": "text",
                    "label": "Hint: hint",
                    "class": "hiddentext hint"
                },
            ],
            "requiredscore": 0.00
        }, // question
        {
            "questionelements": [
                [{
                    "type": "text",
                    "label": "Click and drag the green point to the solvent composition.",
                    "class": "prompt"
                },
                {
                    "type": "text",
                    "label": "mass % in solvent: <table><tr><td>carrier</td><td>0%</td></tr><tr><td>solute</td><td>0%</td></tr><tr><td>solvent</td><td>100%</td></tr></table>",
                    "class": "data"
                }],
                [{
                    "type": "graph",
                    "graphinfo": graphinfos[g1],
                    "mode": "move",
                    "answercount": {
                        "point": 1,
                        "line": 0
                    },
                    "answer": {
                        "point": [
                            {"x":"0", "y":"0", "tolerance":pointtolerance, "color":"green"}
                        ],
                    },
                    "default": {
                        "point": [
                            {"x":"@carrierfrac@", "y":"@solutefrac@", "color":"orange"},
                            {"x":"@center@", "y":"@center@", "movex":true, "movey":true, "answer":true, "color":"green"},
                        ],
                        "line": [
                            ...envelope,
                        ],
                    },
                    "cursor": normalcursor,
                    "points": 10
                },
                {
                    "type": "graph",
                    "graphinfo": graphinfos[g2],
                    "mode": "move",
                    "answercount": {
                        "point": 1,
                        "line": 0
                    },
                    "answer": {
                        "point": [
                            {"x":"0", "y":"0", "tolerance":pointtolerance, "color":"green"}
                        ],
                    },
                    "default": {
                        "point": [
                            {"x":"@carrierfrac@", "y":"@solutefrac@", "color":"orange"},
                            {"x":"@center@", "y":"@center@", "movex":true, "movey":true, "answer":true, "color":"green"},
                        ],
                        "line": [
                            ...envelope2,
                        ],
                    },
                    "cursor": normalcursor,
                    "points": 10
                }],
                {
                    "type": "text",
                    "label": "Hint: hint",
                    "class": "hiddentext hint"
                },
            ],
            "requiredscore": 0.00
        }, // question
        {
            "questionelements": [
                [{
                    "type": "text",
                    "label": "Draw a line connecting feed and solvent compositions.",
                    "class": "prompt"
                }],
                [{
                    "type": "graph",
                    "graphinfo": graphinfos[g1],
                    "mode": "move",
                    "answercount": {
                        "point": 0,
                        "line": 1
                    },
                    "answer": {
                        "line": [
                            {
                                "points":[
                                    {"x":"0", "y":"0", "answer":true, "show":false, "color":"green"},
                                    {"x":"@carrierfrac@", "y":"@solutefrac@", "answer":true, "show":false, "color":"orange"},
                                ],
                                "tolerance":pointtolerance,
                                "color":"gray",
                            }
                        ],
                    },
                    "default": {
                        "point": [
                            {"x":"@carrierfrac@", "y":"@solutefrac@", "color":"orange"},
                            {"x":"0", "y":"0", "color":"green"},
                        ],
                        "line": [
                            {"points":[
                                {"x":".05", "y":".6", "movex":true, "movey":true, "show":true, "color":"green"},
                                {"x":".35", "y":".6", "movex":true, "movey":true, "show":true, "color": "orange"}],
                            "color":"gray",
                            "answer":true},
                            ...envelope,
                        ]
                    },
                    "cursor": normalcursor,
                    "points": 10
                },
                {
                    "type": "graph",
                    "graphinfo": graphinfos[g2],
                    "mode": "move",
                    "answercount": {
                        "point": 0,
                        "line": 1
                    },
                    "answer": {
                        "line": [
                            {
                                "points":[
                                    {"x":"0", "y":"0", "answer":true, "show":false, "color":"green"},
                                    {"x":"@carrierfrac@", "y":"@solutefrac@", "answer":true, "show":false, "color":"orange"},
                                ],
                                "tolerance":pointtolerance,
                                "color":"gray",
                            }
                        ],
                    },
                    "default": {
                        "point": [
                            {"x":"@carrierfrac@", "y":"@solutefrac@", "color":"orange"},
                            {"x":"0", "y":"0", "color":"green"},
                        ],
                        "line": [
                            {"points":[
                                {"x":".05", "y":".6", "movex":true, "movey":true, "show":true, "color":"green"},
                                {"x":".35", "y":".6", "movex":true, "movey":true, "show":true, "color": "orange"}],
                            "color":"gray",
                            "answer":true},
                            ...envelope2,
                        ]
                    },
                    "cursor": normalcursor,
                    "points": 10
                }],
                {
                    "type": "text",
                    "label": "Hint: hint",
                    "class": "hiddentext hint"
                },
            ],
            "requiredscore": 0.00
        }, // question
        {
            "questionelements": [
                [{
                    "type": "text",
                    "label": "Click and drag the purple point to the mixing point composition.",
                    "class": "prompt"
                },
                {
                    "type": "text",
                    "label": "mass flow (kg/hr): <table><tr><td>feed</td><td>@F@</td></tr><tr><td>solvent</td><td>@S@</td></tr><tr><td>F/S</td><td>@FS@</td></tr></table>",
                    "class": "data"
                }],
                [{
                    "type": "graph",
                    "graphinfo": graphinfos[g1],
                    "mode": "move",
                    "answercount": {
                        "point": 1,
                        "line": 0
                    },
                    "answer": {
                        "point": [
                            {"x":"@mixx@", "y":"@mixy@", "tolerance":pointtolerance, "color":"purple"}
                        ],
                    },
                    "default": {
                        "point": [
                            {"x":"@center@", "y":"@center@", "movex":true, "movey":true, "answer":true, "color":"purple"},
                        ],
                        "line": [
                            {"points":[
                                {"x":"0", "y":"0", "show":true, "color":"green"},
                                {"x":"@carrierfrac@", "y":"@solutefrac@", "show":true, "color": "orange"}],
                            "color":"gray"},
                            ...envelope,
                        ]
                    },
                    "cursor": normalcursor,
                    "points": 10
                },
                {
                    "type": "graph",
                    "graphinfo": graphinfos[g2],
                    "mode": "move",
                    "answercount": {
                        "point": 1,
                        "line": 0
                    },
                    "answer": {
                        "point": [
                            {"x":"@mixx@", "y":"@mixy@", "tolerance":pointtolerance, "color":"purple"}
                        ],
                    },
                    "default": {
                        "point": [
                            {"x":"@center@", "y":"@center@", "movex":true, "movey":true, "answer":true, "color":"purple"},
                        ],
                        "line": [
                            {"points":[
                                {"x":"0", "y":"0", "show":true, "color":"green"},
                                {"x":"@carrierfrac@", "y":"@solutefrac@", "show":true, "color": "orange"}],
                            "color":"gray"},
                            ...envelope2,
                        ]
                    },
                    "cursor": normalcursor,
                    "points": 10
                }],
                {
                    "type": "text",
                    "label": "Hint: hint",
                    "class": "hiddentext hint"
                },
            ],
            "requiredscore": 0.00
        }, // question
        {
            "questionelements": [
                {
                    "type": "text",
                    "label": "Enter the mass %'s of the mixing point composition.",
                    "class": "prompt"
                },
                [[{
                    "type": "textbox",
                    "placeholder": "enter as a decimal (ie 0.45 for 45%)",
                    "answertype": "number",
                    "answer": "@mixx@",
                    "tolerance": .05,
                    "points": 10
                },
                {
                    "type": "textbox",
                    "placeholder": "enter as a decimal (ie 0.45 for 45%)",
                    "answertype": "number",
                    "answer": "@mixy@",
                    "tolerance": .05,
                    "points": 10
                },
                {
                    "type": "textbox",
                    "placeholder": "enter as a decimal (ie 0.45 for 45%)",
                    "answertype": "number",
                    "answer": "@mixz@",
                    "tolerance": .05,
                    "points": 10
                }],
                {
                    "type": "text",
                    "label": "mass flow (kg/hr): <table><tr><td>feed</td><td>@F@</td></tr><tr><td>solvent</td><td>@S@</td></tr><tr><td>F/S</td><td>@FS@</td></tr></table>",
                    "class": "data"
                }],
                [{
                    "type": "graph",
                    "graphinfo": graphinfos[g1],
                    "mode": "move",
                    "answercount": {
                        "point": 0,
                        "line": 0
                    },
                    "answer": {

                    },
                    "default": {
                        "point": [
                            {"x":"@mixx@", "z":"@mixz@", "color":"purple"},
                        ],
                        "line": [
                            {"points":[
                                {"x":"0", "y":"0", "show":true, "color":"green"},
                                {"x":"@carrierfrac@", "y":"@solutefrac@", "show":true, "color": "orange"}],
                            "color":"gray"},
                            ...envelope,
                        ]
                    },
                    "cursor": normalcursor,
                    "points": 10
                },
                {
                    "type": "graph",
                    "graphinfo": graphinfos[g2],
                    "mode": "move",
                    "answercount": {
                        "point": 0,
                        "line": 0
                    },
                    "answer": {

                    },
                    "default": {
                        "point": [
                            {"x":"@mixx@", "z":"@mixz@", "color":"purple"},
                        ],
                        "line": [
                            {"points":[
                                {"x":"0", "y":"0", "show":true, "color":"green"},
                                {"x":"@carrierfrac@", "y":"@solutefrac@", "show":true, "color": "orange"}],
                            "color":"gray"},
                            ...envelope2,
                        ]
                    },
                    "cursor": normalcursor,
                    "points": 10
                }],

                {
                    "type": "text",
                    "label": "Hint: hint",
                    "class": "hiddentext hint"
                },
            ],
            "requiredscore": 0.00
        }, // question
        {
            "questionelements": [
                {
                    "type": "text",
                    "label": "Click and drag the extract (red) and raffinate (light blue) points to their compositions.",
                    "class": "prompt"
                },
                [{
                    "type": "graph",
                    "graphinfo": graphinfos[g1],
                    "mode": "move",
                    "answercount": {
                        "point": 0,
                        "line": 1
                    },
                    "answer": {
                        "line":[
                            {"points":[
                                {"x":"@extractx@", "y":"@extracty@", "color":"red"},
                                {"x":"@raffinatex@", "y":"@raffinatey@", "color": "lightblue"}],
                            "tolerance":pointtolerance,
                            "color":"gray"},
                        ]
                    },
                    "default": {
                        "point": [
                            {"x":"@mixx@", "z":"@mixz@", "color":"purple"},
                        ],
                        "line": [
                            {"points":[
                                {"x":".1", "y":".3", "movex":true, "movey":true, "show":true, "color":"red"},
                                {"x":".6", "y":".3", "movex":true, "movey":true, "show":true, "color": "lightblue"}],
                            "answer":true,
                            "dashes":{"dash":3, "space":1},
                            "color":"gray"},
                            {"points":[
                                {"x":"0", "y":"0", "show":true, "color":"green"},
                                {"x":"@carrierfrac@", "y":"@solutefrac@", "show":true, "color": "orange"}],
                            "color":"gray"},
                            ...envelope,
                        ]
                    },
                    "cursor": normalcursor,
                    "points": 10
                },
                {
                    "type": "graph",
                    "graphinfo": graphinfos[g2],
                    "mode": "move",
                    "answercount": {
                        "point": 0,
                        "line": 1
                    },
                    "answer": {
                        "line":[
                            {"points":[
                                {"x":"@extractx@", "y":"@extracty@", "color":"red"},
                                {"x":"@raffinatex@", "y":"@raffinatey@", "color": "lightblue"}],
                            "tolerance":pointtolerance,
                            "color":"gray"},
                        ]
                    },
                    "default": {
                        "point": [
                            {"x":"@mixx@", "z":"@mixz@", "color":"purple"},
                        ],
                        "line": [
                            {"points":[
                                {"x":".1", "y":".3", "movex":true, "movey":true, "show":true, "color":"red"},
                                {"x":".6", "y":".3", "movex":true, "movey":true, "show":true, "color": "lightblue"}],
                            "answer":true,
                            "movex":false,
                            "dashes":{"dash":3, "space":1},
                            "color":"gray"},
                            {"points":[
                                {"x":"0", "y":"0", "show":true, "color":"green"},
                                {"x":"@carrierfrac@", "y":"@solutefrac@", "show":true, "color": "orange"}],
                            "color":"gray"},
                            ...envelope2,
                        ]
                    },
                    "cursor": normalcursor,
                    "points": 10
                }],
                {
                    "type": "text",
                    "label": "Hint: hint",
                    "class": "hiddentext hint"
                },
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
        "questionelements": [],
    } // begin
}



let problemController = new ProblemController(problem, document.getElementById("myscript").getAttribute("parentid"));
