import {ProblemController} from "../src/ProblemController.js";

const datalabel = "temperature = @T@ °C <br> saturation pressures: P<sub>W</sub><sup>sat</sup> = @PsatW@ bar, P<sub>@org@</sub><sup>sat</sup> = @PsatO@ bar";

const watercolor = "blue";
const organiccolor = "orange";
const triplecolor = "green";
const textcolor = "black";
const graycolor = "#999999";
const answercolor = "green";
const Pmin = 0;
const Pmax = 7;

const graphinfo = {
    "graphheight": 400,
    "graphwidth": 500,
    "padding": {
        "left":60,
        "bottom":60,
        "top":60,
        "right":30
    },
    "graphbackground": "white",
    "axesbackground": "lightgray",
    "x": {
        "label": "@compound@ mole fraction (z<sub>@org@</sub>)",
        "min": 0,
        "max": 1,
        "majortick": 0.1,
        "minortick": 0.05,
        "gridline": 0.05,
    },
    "y": {
        "label": "pressure [bar]",
        "min": Pmin,
        "max": Pmax,
        "majortick": 1,
        "minortick": 0.2,
        "gridline": 0.5,
    },
    "x2": {
        "label": "water mole fraction (z<sub>W</sub>)",
        "min": 1,
        "max": 0,
        "majortick": 0.1,
        "minortick": 0.05,
        "gridline": 0.05,
    },
};

const pointtolerance = {
    "x":0.025,
    "y":0.2
};

const normalcursor = {
    "format": "z<sub>@org@</sub> = ~x~, P = ~y~",
    "digits": {
        "x": 2,
        "y": 1,
    }
};

const detailedcursor = {
    "format": "z<sub>@org@</sub> = ~x~, P = ~y~",
    "digits": {
        "x": 2,
        "y": 2,
    }
};

const problem = {
    "pagetitle": "Construct a Pressure-Composition Diagram for Immiscible Liquids",
    "variables": {
        "constants": {
            "AW": 5.0768,
            "BW": 1659.793,
            "CW": 227.1,
            "AB": 4.72583,
            "BB": 1660.652,
            "CB": 271.5,
            "AT": 4.07827,
            "BT": 1343.943,
            "CT": 219.227,
            "AH": 4.00266,
            "BH": 1171.53,
            "CH": 224.216,
            "Pmin": Pmin,
            "Pmax": Pmax,
        },
        "random": {
            "T": {
                "min": 105,
                "max": 125,
                "digits": 0
            },
            "orgnum": {
                "min": 0,
                "max": 2,
                "digits": 0
            },
        },
        "calculated": {
            "org": "['B', 'T', 'H'][@orgnum@]",
            "compound": "['benzene', 'toluene', 'hexane'][@orgnum@]",
            "PsatW": "Antoine(@T@, @AW@, @BW@, @CW@).toFixed(1)",
            "PsatO": "Antoine(@T@, @A@org@@, @B@org@@, @C@org@@).toFixed(1)",
            "Psum": "@PsatW@ + @PsatO@",
            "xc": "@PsatO@ / @Psum@",
            "x1": "@xc@ * 3/6",
            "x2": "@xc@ * 4/6",
            "x3": "@xc@ * 5/6",
            "x4": "@xc@ + (1-@xc@) * 1/6",
            "x5": "@xc@ + (1-@xc@) * 2/6",
            "x6": "@xc@ + (1-@xc@) * 3/6",
            "y1": "@PsatW@ / (1 - @x1@)",
            "y2": "@PsatW@ / (1 - @x2@)",
            "y3": "@PsatW@ / (1 - @x3@)",
            "y4": "@PsatO@ / @x4@",
            "y5": "@PsatO@ / @x5@",
            "y6": "@PsatO@ / @x6@",
            "yllabel": "@Pmax@ * .5 + .5 * @Psum@",
            "yvlabel": "@Pmin@ * .75 + .25 * @Psum@",
            "ywlabel": "(@PsatW@+@Psum@)/2",
            "yolabel": "(@PsatO@+@Psum@)/2",
        }
    },
    "questions": [
        {
            "questionelements": [
                [[{
                    "type": "graph",
                    "graphinfo": graphinfo,
                    "mode": "move",
                    "answercount": {
                        "point": 0,
                        "line": 1
                    },
                    "answer": {
                        "line": [
                            {"points":[{"x":"0", "y":"@Psum@", "answer":true, "show":false},
                                       {"x":"1", "y":"@Psum@", "show":false}], "tolerance":pointtolerance, "color":answercolor}
                        ]
                    },
                    "default": {
                        "line": [
                            {"points":[{"x":0, "y":4, "movey":true, "show":false},
                                       {"x":1, "y":4, "movey":true, "show":false}],
                             "color":"black",
                             "dashes":{
                                 "dash": 3,
                                 "space": 3,
                             },
                             "answer":true,
                             "altcursor": {
                                 "format": "P = ~y~",
                                 "digits": {"y": 1}
                             }
                            },
                        ],

                    },
                    "cursor": normalcursor,
                    "points": 10
                }],
                [{
                    "type": "text",
                    "label": "Drag the dotted line to the pressure where three phases coexist.",
                    "class": "prompt"
                },
                {
                    "type": "text",
                    "label": datalabel,
                    "class": "data"
                },
                {
                    "type": "text",
                    "label": "Hint: sum the saturation pressures",
                    "class": "hiddentext hint"
                }]]
            ],
            "requiredscore": 0.00
        }, // question
        {
            "questionelements": [
                [[{
                    "type": "graph",
                    "graphinfo": graphinfo,
                    "mode": "move",
                    "answercount": {
                        "point": 0,
                        "line": 0
                    },
                    "answer": {

                    },
                    "default": {
                        "line": [
                            {"points":[{"x":0, "y":"@Psum@", "show":false},
                                       {"x":1, "y":"@Psum@", "show":false}],
                             "color":graycolor
                            },
                        ],
                        "text": [
                            {"text":"region A", "position": {"x": 0.5, "y": "@yllabel@"}, "font":"sans-serif", "fontsize":20, "fontstyle":"bold", "align":"center", "color":"blue"},
                            {"text":"region B", "position": {"x": 0.5, "y": "@yvlabel@"}, "font":"sans-serif", "fontsize":20, "fontstyle":"bold", "align":"center", "color":"blue"}
                        ]
                    },
                    "cursor": normalcursor,
                    "points": 0
                }],
                [{
                    "type": "text",
                    "label": "Which region has two liquids in equilibrium and no vapor?",
                    "class": "prompt"
                },
                {
                    "type": "text",
                    "label": datalabel,
                    "class": "data"
                },
                 {
                    "type": "textbox",
                    "placeholder": "type A or B",
                    "answertype": "text",
                    "answer": "A",
                    "tolerance": 0,
                    "points": 10
                },
                {
                    "type": "text",
                    "label": "Hint: liquids are more stable at higher pressures",
                    "class": "hiddentext hint"
                }]],
            ],
            "requiredscore": 0.00
        }, // question
        {
            "questionelements": [
                [[{
                    "type": "graph",
                    "graphinfo": graphinfo,
                    "mode": "move",
                    "answercount": {
                        "point": 2,
                        "line": 0
                    },
                    "answer": {
                        "point": [
                            {"x":"0", "y":"@PsatW@", "tolerance":pointtolerance, "color":watercolor},
                            {"x":"1", "y":"@PsatO@", "tolerance":pointtolerance, "color":organiccolor}
                        ]
                    },
                    "default": {
                        "point": [
                            {"x":0.3, "y":4, "movex":true, "movey":true, "color":watercolor, "answer":true},
                            {"x":0.7, "y":4, "movex":true, "movey":true, "color":organiccolor, "answer":true}
                        ],
                        "line": [
                            {"points":[{"x":0, "y":"@Psum@", "show":false},
                                       {"x":1, "y":"@Psum@", "show":false}], "color":graycolor},
                        ],
                        "text": [
                            {"text":"liquid @compound@ + liquid water", "position": {"x": 0.5, "y": "@yllabel@"}, "align":"center", "color":textcolor},
                            {"text":"vapor", "position": {"x": 0.5, "y": "@yvlabel@"}, "align":"center", "color":textcolor}
                        ]
                    },
                    "cursor": normalcursor,
                    "points": 20
                }], // element
                [{
                    "type": "text",
                    "label": "Drag the blue point to where pure water is in VLE (vapor-liquid equilibrium), and drag the orange point to where pure @compound@ is in VLE. <br>",
                    "class": "prompt"
                }, // element
                {
                    "type": "text",
                    "label": datalabel,
                    "class": "data"
                },
                {
                    "type": "text",
                    "label": "Hint: pure component saturation pressures",
                    "class": "hiddentext hint"
                }]],
            ], // questionelements
            "requiredscore": 0.00
        }, // question
        {
            "questionelements": [
                [[{
                    "type": "graph",
                    "graphinfo": graphinfo,
                    "mode": "move",
                    "answercount": {
                        "point": 1,
                        "line": 0
                    },
                    "answer": {
                        "point": [
                            {"x":"@xc@", "y":"@Psum@", "tolerance":pointtolerance, "color":triplecolor}
                        ]
                    },
                    "default": {
                        "point": [
                            {"x":"0", "y":"@PsatW@", "color":watercolor},
                            {"x":"1", "y":"@PsatO@", "color":organiccolor},
                            {"x":0.5, "y":4, "color":triplecolor, "movex":true, "movey":true, "answer":true}
                        ],
                        "line": [
                            {"points":[{"x":0, "y":"@Psum@", "show":false},
                                       {"x":1, "y":"@Psum@", "show":false}], "color":graycolor},
                        ],
                        "text": [
                            {"text":"liquid @compound@ + liquid water", "position": {"x": 0.5, "y": "@yllabel@"}, "align":"center", "color":textcolor},
                            {"text":"vapor", "position": {"x": 0.5, "y": "@yvlabel@"}, "align":"center", "color":textcolor}
                        ]
                    },
                    "cursor": normalcursor,
                    "points": 10
                }], // element
                [{
                    "type": "text",
                    "label": "Drag the green point to where vapor is in equilibrium with two liquid phases. <br>",
                    "class": "prompt"
                }, // element
                {
                    "type": "text",
                    "label": datalabel,
                    "class": "data"
                },
                {
                    "type": "text",
                    "label": "Hint: each liquid exerts its saturation pressure",
                    "class": "hiddentext hint"
                }]], // element
            ], // questionelements
            "requiredscore": 0.00
        }, // question
        {
            "questionelements": [
                [[{
                    "type": "graph",
                    "graphinfo": graphinfo,
                    "mode": "move",
                    "answercount": {
                        "point": 0,
                        "line": 2
                    },
                    "answer": {
                        "line":[{"points":[{"x":"0", "y":"@Psum@", "show":false},
                                           {"x":"0", "y":"@PsatW@", "color":watercolor},
                                           {"x":"@x1@", "y":"@y1@", "answer":true, "show":false},
                                           {"x":"@x2@", "y":"@y2@", "answer":true, "show":false},
                                           {"x":"@x3@", "y":"@y3@", "answer":true, "show":false},
                                           {"x":"@xc@", "y":"@Psum@"}], "tolerance":pointtolerance, "color":answercolor},
                                {"points":[{"x":"@xc@", "y":"@Psum@", "color":"green"},
                                           {"x":"@x4@", "y":"@y4@", "answer":true, "show":false},
                                           {"x":"@x5@", "y":"@y5@", "answer":true, "show":false},
                                           {"x":"@x6@", "y":"@y6@", "answer":true, "show":false},
                                           {"x":"1", "y":"@PsatO@", "color":organiccolor},
                                           {"x":"1", "y":"@Psum@", "show":false}], "tolerance":pointtolerance, "color":answercolor}
                                ]
                    },
                    "default": {
                        "line": [
                            {"points":[{"x":0, "y":"@Psum@", "radius":1, "show":false},
                                       {"x":1, "y":"@Psum@", "radius":1, "show":false}],
                             "color":graycolor},
                            {"points":[{"x":"0", "y":"@Psum@", "show":false},
                                       {"x":"0", "y":"@PsatW@", "color":watercolor},
                                       {"x":"@x1@", "y":"@PsatW@", "movey":true},
                                       {"x":"@x2@", "y":"@PsatW@", "movey":true},
                                       {"x":"@x3@", "y":"@PsatW@", "movey":true},
                                       {"x":"@xc@", "y":"@Psum@", "color":"green"}],
                             "color":graycolor,
                             "answer":true,
                             "fill":{"color":watercolor, "opacity":0.2}},
                            {"points":[{"x":"@xc@", "y":"@Psum@", "color":"green"},
                                       {"x":"@x4@", "y":"@PsatO@", "movey":true},
                                       {"x":"@x5@", "y":"@PsatO@", "movey":true},
                                       {"x":"@x6@", "y":"@PsatO@", "movey":true},
                                       {"x":"1", "y":"@PsatO@", "color":organiccolor},
                                       {"x":"1", "y":"@Psum@", "show":false}],
                             "color":graycolor,
                             "answer":true,
                             "fill":{"color":organiccolor, "opacity":0.2}}
                        ],
                        "text": [
                            {"text":"liquid @compound@ + liquid water", "position": {"x": 0.5, "y": "@yllabel@"}, "align":"center", "color":textcolor},
                            {"text":"vapor", "position": {"x": 0.5, "y": "@yvlabel@"}, "align":"center", "color":textcolor}
                        ]
                    },
                    "cursor": detailedcursor,
                    "points": 20
                }], // element
                [{
                    "type": "text",
                    "label": "Drag each black point to the pressure where vapor with that mole fraction is in equilbrium with liquid. <br>",
                    "class": "prompt"
                }, // element
                {
                    "type": "text",
                    "label": datalabel,
                    "class": "data"
                },
                {
                    "type": "text",
                    "label": "Hint: the vapor mole fraction for component i is P<sub>i</sub><sup>sat</sup> / P",
                    "class": "hiddentext hint"
                }]], // element
            ], // questionelements
            "requiredscore": 0.00
        }, // question
    ], // questions

    "finish": {
        "questionelements": [
            {
                "type": "graph",
                "graphinfo": graphinfo,
                "mode": "move",
                "answercount": {
                    "point": 0,
                    "line": 0
                },
                "answer": {},
                "default": {
                    "point": [],
                    "line": [
                        {"points":[{"x":0, "y":"@Psum@", "radius":1, "show":false},
                                   {"x":1, "y":"@Psum@", "radius":1, "show":false}], "color":graycolor},
                        {"points":[{"x":"0", "y":"@Psum@", "show":false},
                                   {"x":"0", "y":"@PsatW@", "color":watercolor},
                                   {"x":"@x1@", "y":"@y1@", "show": false},
                                   {"x":"@x2@", "y":"@y2@", "show": false},
                                   {"x":"@x3@", "y":"@y3@", "show": false},
                                   {"x":"@xc@", "y":"@Psum@", "color":"green"}], "color":graycolor,
                                   "fill":{"color":watercolor, "opacity":0.2}},
                        {"points":[{"x":"@xc@", "y":"@Psum@", "color":"green"},
                                   {"x":"@x4@", "y":"@y4@", "show": false},
                                   {"x":"@x5@", "y":"@y5@", "show": false},
                                   {"x":"@x6@", "y":"@y6@", "show": false},
                                   {"x":"1", "y":"@PsatO@", "color":organiccolor},
                                   {"x":"1", "y":"@Psum@", "show":false}],
                                   "color":graycolor,
                                   "fill":{"color":organiccolor, "opacity":0.2}}
                    ],
                    "text": [
                        {"text":"liquid @compound@ + liquid water", "position": {"x": 0.5, "y": "@yllabel@"}, "align":"center", "color":textcolor},
                        {"text":"vapor + liquid water", "position": {"x": 0.01, "y": "@ywlabel@"}, "align":"left", "color":textcolor},
                        {"text":"vapor + liquid @compound@", "position": {"x": 0.99, "y": "@yolabel@"}, "align":"right", "color":textcolor},
                        {"text":"vapor", "position": {"x": 0.5, "y": "@yvlabel@"}, "align":"center", "color":textcolor}
                    ]
                },
                "cursor": detailedcursor,
            },
        ] // questionelements
    }, // finish

    "begin": {
        "variables": {
            "constants": {
                "PsatW": "2.5",
                "PsatO": "2.5",
            },
            "random": {},
            "calculated": {
                "Psum": "@PsatW@ + @PsatO@",
                "xc": "@PsatO@ / @Psum@",
                "x1": "@xc@ * 3/6",
                "x2": "@xc@ * 4/6",
                "x3": "@xc@ * 5/6",
                "x4": "@xc@ + (1-@xc@) * 1/6",
                "x5": "@xc@ + (1-@xc@) * 2/6",
                "x6": "@xc@ + (1-@xc@) * 3/6",
                "y1": "@PsatW@ / (1 - @x1@)",
                "y2": "@PsatW@ / (1 - @x2@)",
                "y3": "@PsatW@ / (1 - @x3@)",
                "y4": "@PsatO@ / @x4@",
                "y5": "@PsatO@ / @x5@",
                "y6": "@PsatO@ / @x6@",
            }
        },
        "questionelements": [
            [[{
                "type": "text",
                "label": `In this demonstration, the user is led through a step-by-step procedure to create a temperature-composition diagram for two immiscible liquids (water and an organic) at a fixed pressure. The organic can be benzene, toluene, or n-hexane.<br><br>After answering, the user clicks "Submit Answer" to check their answer, followed by "Next" to proceed with the question. The user can only move forward or select "Restart Problem" to start over at a different temperature and a different organic. For any step, click "Hint" for help.`,
                "class": "prompt"
            },
            {
                "type": "text",
                "label": "Hint: click 'Begin' to start the problem",
                "class": "hiddentext hint"
            }]], // element
        ] // questionelements
    } // begin
};

let problemController = new ProblemController(problem, document.getElementById("myscript").getAttribute("parentid"));
