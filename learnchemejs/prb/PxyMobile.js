import {ProblemController} from "../src/ProblemController.js";

const octanecolor = "blue";
const hexanecolor = "orange";
const purplecolor = "fuchsia";
const yellowcolor = "yellow";
const textcolor = "black";
const graycolor = "#999999";
const answercolor = "green";
const Pmin = 0;
const Pmax = 5;

const graphinfo = {
    "graphheight": 250,
    "graphwidth": 300,
    "fontsize": 12,
    "padding": {
        "left":60,
        "bottom":60,
        "top":60,
        "right":30
    },
    "graphbackground": "white",
    "axesbackground": "lightgray",
    "x": {
        "label": "n-hexane mole fraction (z<sub>H</sub>)",
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
        "label": "n-octane mole fraction (z<sub>O</sub>)",
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
    "format": "z<sub>H</sub> = ~x~, P = ~y~",
    "digits": {
        "x": 2,
        "y": 2,
    }
};

const problem = {
    "pagetitle": "Construct a Pressure-Composition Diagram for VLE",
    "variables": {
        "constants": {
            "AO": 4.04847,
            "BO": 1355.126,
            "CO": 209.517,
            "AH": 4.00266,
            "BH": 1171.53,
            "CH": 224.366,
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
            "q3": {
                "min": 0,
                "max": 1,
                "digits": 0
            },
            "q4x": {
                "min": 0.2,
                "max": 0.8,
                "digits": 2
            },
            "q4yscale": {
                "min": 0.2,
                "max": 0.8,
                "digits": 2
            },
        },
        "calculated": {
            "PsatO": "Antoine(@T@, @AO@, @BO@, @CO@).toFixed(1)",
            "PsatH": "Antoine(@T@, @AH@, @BH@, @CH@).toFixed(1)",
            "Pinit": "0.5",
            "x1": "0",
            "x2": "0.25",
            "x3": "0.5",
            "x4": "0.75",
            "x5": "1",
            "by2": "BubblePoint(@x2@, @PsatH@, @PsatO@)",
            "by3": "BubblePoint(@x3@, @PsatH@, @PsatO@)",
            "by4": "BubblePoint(@x4@, @PsatH@, @PsatO@)",
            "dy2": "DewPoint(@x2@, @PsatH@, @PsatO@)",
            "dy3": "DewPoint(@x3@, @PsatH@, @PsatO@)",
            "dy4": "DewPoint(@x4@, @PsatH@, @PsatO@)",
            "yllabel": "(@Pmax@ - @Pmin@) * .9 + @Pmin@",
            "yvlabel": "(@Pmax@ - @Pmin@) * .1 + @Pmin@",
            "yvllabel": "(BubblePoint(0.5, @PsatH@, @PsatO@) + DewPoint(0.5, @PsatH@, @PsatO@)) / 2",
            "q3text": "['liquid', 'vapor'][@q3@]",
            "q3ans": "['A', 'C'][@q3@]",
            "q4ly": "BubblePoint(@q4x@, @PsatH@, @PsatO@)",
            "q4vy": "DewPoint(@q4x@, @PsatH@, @PsatO@)",
            "q4y": "(@q4ly@ - @q4vy@) * @q4yscale@ + @q4vy@",
            "q4lx": "FindRoot({expression:'BubblePoint(x, @PsatH@, @PsatO@) - @q4y@', variable:'x', min:0, max:1, precision:0.001})",
            "q4vx": "FindRoot({expression:'DewPoint(x, @PsatH@, @PsatO@) - @q4y@', variable:'x', min:0, max:1 , precision:.001})",
            "q5ans": "roundTo((@q4x@ - @q4lx@) / (@q4vx@ - @q4lx@), 2)",
        }
    },
    "questions": [
        { // question
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
                            {"points":[{"x":"@x1@", "y":"@PsatO@", "show":false},
                                       {"x":"@x2@", "y":"@by2@", "show":false, "answer":true},
                                       {"x":"@x3@", "y":"@by3@", "show":false, "answer":true},
                                       {"x":"@x4@", "y":"@by4@", "show":false, "answer":true},
                                       {"x":"@x5@", "y":"@PsatH@", "show":false},],
                             "tolerance":pointtolerance,
                             "color":answercolor},
                        ]
                    },
                    "default": {
                        "line": [
                            {"points":[{"x":"@x1@", "y":"@PsatO@", "color":octanecolor},
                                       {"x":"@x2@", "y":"@Pinit@", "movey":true},
                                       {"x":"@x3@", "y":"@Pinit@", "movey":true},
                                       {"x":"@x4@", "y":"@Pinit@", "movey":true},
                                       {"x":"@x5@", "y":"@PsatH@", "color":hexanecolor},],
                             "color":graycolor,
                             "answer":true,},
                        ],

                    },
                    "cursor": normalcursor,
                    "points": 10
                },
                ],
                [{
                    "type": "text",
                    "label": "Click and drag the black points to draw the bubble-point curve.",
                    "class": "prompt"
                },
                {
                    "type": "text",
                    "label": "Hint: use Raoult's law for each component",
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
                        "line": 1
                    },
                    "answer": {
                        "line": [
                            {"points":[{"x":"@x1@", "y":"@PsatO@", "show":false},
                                       {"x":"@x2@", "y":"@dy2@", "show":false, "answer":true},
                                       {"x":"@x3@", "y":"@dy3@", "show":false, "answer":true},
                                       {"x":"@x4@", "y":"@dy4@", "show":false, "answer":true},
                                       {"x":"@x5@", "y":"@PsatH@", "show":false}],
                             "color":"black",
                             "tolerance":pointtolerance,
                             "color":answercolor},
                        ]
                    },
                    "default": {
                        "line": [
                            {"points":[{"x":"@x1@", "y":"@PsatO@", "color":octanecolor},
                                       {"x":"@x2@", "y":"@by2@", "show":false},
                                       {"x":"@x3@", "y":"@by3@", "show":false},
                                       {"x":"@x4@", "y":"@by4@", "show":false},
                                       {"x":"@x5@", "y":"@PsatH@", "color":hexanecolor}],
                             "color":graycolor},
                            {"points":[{"x":"@x1@", "y":"@PsatO@", "color":octanecolor},
                                       {"x":"@x2@", "y":"@Pinit@", "movey":true},
                                       {"x":"@x3@", "y":"@Pinit@", "movey":true},
                                       {"x":"@x4@", "y":"@Pinit@", "movey":true},
                                       {"x":"@x5@", "y":"@PsatH@", "color":hexanecolor}],
                             "color":graycolor,
                             "answer":true},
                        ],
                    },
                    "cursor": normalcursor,
                    "points": 10
                },
                ],
                [{
                    "type": "text",
                    "label": "Click and drag the black points to draw the dew-point curve.",
                    "class": "prompt"
                },
                {
                    "type": "text",
                    "label": "Hint: use Raoult's law for each component",
                    "class": "hiddentext hint"
                }]]
            ],
            "requiredscore": 0.00
        }, // question

        { // question
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
                            {"points":[{"x":"@x1@", "y":"@PsatO@", "color":octanecolor},
                                       {"x":"@x2@", "y":"@by2@", "show":false},
                                       {"x":"@x3@", "y":"@by3@", "show":false},
                                       {"x":"@x4@", "y":"@by4@", "show":false},
                                       {"x":"@x5@", "y":"@PsatH@", "color":hexanecolor}],
                             "color":graycolor},

                            {"equation": "Math.pow(~x~ / @PsatH@ + (1 - ~x~) / @PsatO@, -1)",
                             "independent": {
                                 "symbol": "x",
                                 "min": 0,
                                 "max": 1
                             },
                             "dependent": {
                                 "symbol": "y",
                                 "min": Pmin,
                                 "max": Pmax
                             },
                             "steps": 60,
                             "tension": 0.5,
                             "color": graycolor,
                             "showpoints": false},
                        ],
                        "text": [
                            {"text":"region A", "position": {"x": 0.5, "y": "@yllabel@"}, "font":"sans-serif", "fontsize":20, "fontstyle":"bold", "align":"center", "color":textcolor},
                            {"text":"region B", "position": {"x": 0.5, "y": "@yvllabel@"}, "font":"sans-serif", "fontsize":20, "fontstyle":"bold", "align":"center", "color":textcolor},
                            {"text":"region C", "position": {"x": 0.5, "y": "@yvlabel@"}, "font":"sans-serif", "fontsize":20, "fontstyle":"bold", "align":"center", "color":textcolor},
                        ]
                    },
                    "cursor": normalcursor,
                    "points": 0
                }],
                [{
                    "type": "text",
                    "label": "Which region has pure @q3text@?",
                    "class": "prompt"
                },
                 {
                    "type": "textbox",
                    "placeholder": "type A, B, or C",
                    "answertype": "text",
                    "answer": "@q3ans@",
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

        { // question
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
                            {"points":[{"x":"@q4lx@", "y":"@q4y@","color":purplecolor, "answer":true},
                                       {"x":"@q4x@", "y":"@q4y@", "show":false},
                                       {"x":"@q4vx@", "y":"@q4y@","color":yellowcolor, "answer":true},],
                             "color":"black",
                             "tolerance":pointtolerance,
                             "color":answercolor}
                        ]
                    },
                    "default": {
                        "line": [
                            {"points":[{"x":"@x1@", "y":"@PsatO@", "color":octanecolor},
                                       {"x":"@x2@", "y":"@by2@", "show":false},
                                       {"x":"@x3@", "y":"@by3@", "show":false},
                                       {"x":"@x4@", "y":"@by4@", "show":false},
                                       {"x":"@x5@", "y":"@PsatH@", "color":hexanecolor}],
                             "color":graycolor},

                            {"equation": "Math.pow(~x~ / @PsatH@ + (1 - ~x~) / @PsatO@, -1)",
                             "independent": {
                                 "symbol": "x",
                                 "min": 0,
                                 "max": 1
                             },
                             "dependent": {
                                 "symbol": "y",
                                 "min": Pmin,
                                 "max": Pmax
                             },
                             "steps": 60,
                             "tension": 0.5,
                             "color": graycolor,
                             "showpoints": false},

                            {"points":[{"x":0.1, "y":"@Pinit@", "movex":true, "movey":true, "color":purplecolor},
                                       {"x":"@q4x@", "y":"@q4y@"},
                                       {"x":0.9, "y":"@Pinit@", "movex":true, "movey":true, "color":yellowcolor},],
                             "color":"black",
                             "answer":true}
                        ],
                        "text": [
                            {"text":"liquid", "position": {"x": 0.5, "y": "@yllabel@"}, "align":"center", "color":textcolor},
                            {"text":"vapor", "position": {"x": 0.5, "y": "@yvlabel@"}, "align":"center", "color":textcolor},
                        ]
                    },
                    "cursor": normalcursor,
                    "points": 10
                },
                ],
                [{
                    "type": "text",
                    "label": "Click and drag the purple (liquid) and yellow (vapor) points to the compositions that are in equilibrium for the mixture indicated by the black point.",
                    "class": "prompt"
                },
                {
                    "type": "text",
                    "label": "Hint: draw a tie line",
                    "class": "hiddentext hint"
                }]]
            ],
            "requiredscore": 0.00
        }, // question

        { // question
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
                            {"points":[{"x":"@x1@", "y":"@PsatO@", "color":octanecolor},
                                       {"x":"@x2@", "y":"@by2@", "show":false},
                                       {"x":"@x3@", "y":"@by3@", "show":false},
                                       {"x":"@x4@", "y":"@by4@", "show":false},
                                       {"x":"@x5@", "y":"@PsatH@", "color":hexanecolor}],
                             "color":graycolor},

                            {"equation": "Math.pow(~x~ / @PsatH@ + (1 - ~x~) / @PsatO@, -1)",
                             "independent": {
                                 "symbol": "x",
                                 "min": 0,
                                 "max": 1
                             },
                             "dependent": {
                                 "symbol": "y",
                                 "min": Pmin,
                                 "max": Pmax
                             },
                             "steps": 60,
                             "tension": 0.5,
                             "color": graycolor,
                             "showpoints": false},

                            {"points":[{"x":"@q4lx@", "y":"@q4y@", "color":purplecolor},
                                       {"x":"@q4x@", "y":"@q4y@"},
                                       {"x":"@q4vx@", "y":"@q4y@", "color":yellowcolor},],
                             "color":graycolor}
                        ],
                        "text": [
                            {"text":"liquid", "position": {"x": 0.5, "y": "@yllabel@"}, "align":"center", "color":textcolor},
                            {"text":"vapor", "position": {"x": 0.5, "y": "@yvlabel@"}, "align":"center", "color":textcolor},
                        ]
                    },
                    "cursor": normalcursor,
                    "points": 0
                },
                ],
                [{
                    "type": "text",
                    "label": "What is fraction of vapor of a mixture located at the black point?",
                    "class": "prompt"
                },
                {
                    "type": "textbox",
                    "placeholder": "type a number",
                    "answertype": "number",
                    "answer": "@q5ans@",
                    "tolerance": 0.05,
                    "points": 10
                },
                {
                    "type": "text",
                    "label": "Hint: use the lever rule",
                    "class": "hiddentext hint"
                }]]
            ],
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
                "answer": {

                },
                "default": {
                    "line": [
                        {"points":[{"x":"@x1@", "y":"@PsatO@", "color":octanecolor},
                                   {"x":"@x2@", "y":"@by2@", "show":false},
                                   {"x":"@x3@", "y":"@by3@", "show":false},
                                   {"x":"@x4@", "y":"@by4@", "show":false},
                                   {"x":"@x5@", "y":"@PsatH@", "color":hexanecolor}],
                         "color":graycolor},

                        {"equation": "Math.pow(~x~ / @PsatH@ + (1 - ~x~) / @PsatO@, -1)",
                         "independent": {
                                 "symbol": "x",
                                 "min": 0,
                                 "max": 1
                             },
                             "dependent": {
                                 "symbol": "y",
                                 "min": Pmin,
                                 "max": Pmax
                             },
                             "steps": 60,
                             "tension": 0.5,
                         "color": graycolor,
                         "showpoints": false},

                        {"points":[{"x":"@q4lx@", "y":"@q4y@", "color":purplecolor},
                                   {"x":"@q4x@", "y":"@q4y@", "label": {
                                       "text": "fraction vapor: @q5ans@",
                                       "align": "center",
                                       "offset": {"rawx":0, "rawy":20}}},
                                   {"x":"@q4vx@", "y":"@q4y@", "color":yellowcolor},],
                         "color":graycolor}
                    ],
                    "text": [
                        {"text":"liquid", "position": {"x": 0.5, "y": "@yllabel@"}, "align":"center", "color":textcolor},
                        {"text":"vapor", "position": {"x": 0.5, "y": "@yvlabel@"}, "align":"center", "color":textcolor},
                    ]
                },
                "cursor": normalcursor,
                "points": 0
            }
        ] // questionelements
    }, // finish

    "begin": {
        "variables": {
            "constants": {
                "T": 120,
                "q4x": 0.6,
                "q4yscale": 0.5,
            },
            "random": {},
            "calculated": {
                "PsatO": "Antoine(@T@, @AO@, @BO@, @CO@).toFixed(1)",
                "PsatH": "Antoine(@T@, @AH@, @BH@, @CH@).toFixed(1)",
                "Pinit": "0.5",
                "x1": "0",
                "x2": "0.25",
                "x3": "0.5",
                "x4": "0.75",
                "x5": "1",
                "by2": "BubblePoint(@x2@, @PsatH@, @PsatO@)",
                "by3": "BubblePoint(@x3@, @PsatH@, @PsatO@)",
                "by4": "BubblePoint(@x4@, @PsatH@, @PsatO@)",
                "dy2": "DewPoint(@x2@, @PsatH@, @PsatO@)",
                "dy3": "DewPoint(@x3@, @PsatH@, @PsatO@)",
                "dy4": "DewPoint(@x4@, @PsatH@, @PsatO@)",
                "yllabel": "(@Pmax@ - @Pmin@) * .9 + @Pmin@",
                "yvlabel": "(@Pmax@ - @Pmin@) * .1 + @Pmin@",
                "yvllabel": "(BubblePoint(0.5, @PsatH@, @PsatO@) + DewPoint(0.5, @PsatH@, @PsatO@)) / 2",
                "q3text": "['liquid', 'vapor'][@q3@]",
                "q3ans": "['A', 'C'][@q3@]",
                "q4ly": "BubblePoint(@q4x@, @PsatH@, @PsatO@)",
                "q4vy": "DewPoint(@q4x@, @PsatH@, @PsatO@)",
                "q4y": "(@q4ly@ - @q4vy@) * @q4yscale@ + @q4vy@",
                "q4lx": "FindRoot({expression:'BubblePoint(x, @PsatH@, @PsatO@) - @q4y@', variable:'x', min:0, max:1, precision:0.001})",
                "q4vx": "FindRoot({expression:'DewPoint(x, @PsatH@, @PsatO@) - @q4y@', variable:'x', min:0, max:1, precision:0.001})",
                "q5ans": "roundTo((@q4x@ - @q4lx@) / (@q4vx@ - @q4lx@), 2)",
            },
        },
        "questionelements": [
            [{
                "type": "graph",
                "graphinfo": graphinfo,
                "mode": "view",
                "default": {
                    "line": [
                        {"points":[{"x":"@x1@", "y":"@PsatO@", "color":octanecolor},
                                   {"x":"@x2@", "y":"@by2@", "show":false},
                                   {"x":"@x3@", "y":"@by3@", "show":false},
                                   {"x":"@x4@", "y":"@by4@", "show":false},
                                   {"x":"@x5@", "y":"@PsatH@", "color":hexanecolor}],
                         "color":graycolor},

                        {"equation": "Math.pow(~x~ / @PsatH@ + (1 - ~x~) / @PsatO@, -1)",
                         "independent": {
                             "symbol": "x",
                             "min": 0,
                             "max": 1
                         },
                         "dependent": {
                             "symbol": "y",
                             "min": Pmin,
                             "max": Pmax
                         },
                         "steps": 60,
                         "tension": 0.5,
                         "color": graycolor,
                         "showpoints": false},

                        {"points":[{"x":"@q4lx@", "y":"@q4y@", "color":purplecolor},
                                   {"x":"@q4x@", "y":"@q4y@"},
                                   {"x":"@q4vx@", "y":"@q4y@", "color":yellowcolor},],
                         "color":graycolor}
                    ],
                },
                "cursor": normalcursor,
                "points": 0
            },
            [{
                "type": "text",
                "label": `This demonstration leads the user through the construction of a pressure-composition (P-x-y) diagram step-by-step for vapor-liquid equilibrium of an n-hexane/n-octane ideal mixture (Raoult's law).<br><br>After answering, the user clicks "Submit Answer" to check their answer, followed by "Next" to proceed with the question. The user can only move forward or select "Restart Problem" to start over at a different temperature. At any step, click "Hint" for help.`,
                "class": "prompt"
            }, // element
            {
                "type": "text",
                "label": "Hint: click 'Begin' to start the problem",
                "class": "hiddentext hint"
            }]],
        ] // questionelements
    } // begin
};
try {document.documentElement.style.setProperty('--fontsize', 8 + "px")} catch(e) {console.log("couldn't set font size: ",String(e))}
let problemController = new ProblemController(problem, document.getElementById("myscript").getAttribute("parentid"));
