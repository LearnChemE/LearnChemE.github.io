import {ProblemController} from "../src/ProblemController.js";

const datalabel = "pressure = @P@ bar <br> saturation temperatures: T<sub>sat,W</sub> = @TsatW@ °C, T<sub>sat,@org@</sub> = @TsatO@ °C";

const watercolor = "blue";
const organiccolor = "orange";
const triplecolor = "green";
const textcolor = "black";
const graycolor = "#999999";
const answercolor = "green";
const Tmin = 100;
const Tmax = 250;
const Pmin = 5;
const Pmax = 15;

const graphinfo = {
    graphheight: 400,
    "graphwidth": 500,
    "padding": {"left":80, "bottom":60, "top":60, "right":30},
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
        "label": "temperature [°C]",
        "min": Tmin,
        "max": Tmax,
        "majortick": 15,
        "minortick": 5,
        "gridline": 10,
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

const pointtolerance = {"x":0.025, "y":4};

const normalcursor = {
    "format": "z<sub>@org@</sub> = ~x~, T = ~y~",
    "digits": {
        "x": 2,
        "y": 0,
    }
};

const secondarycursor = {
    "format": "T = ~x~, P = ~y~",
    "digits": {
        "x": 0,
        "y": 1,
    }
};

const sidegraphtext = {
    "type": "text",
    "label": "the saturation pressures for each component and the sum of the saturation pressures are plotted versus temperature",
    "class": "prompt"
};

const sidegraph = {
    "type": "graph",
    "graphinfo": {
        "graphheight": 350,
        "graphwidth": 350,
        "padding": {"left":80, "bottom":60, "top":30, "right":30},
        "graphbackground": "white",
        "axesbackground": "lightgray",
        "x": {
            "label": "temperature [°C]",
            "min": Tmin,
            "max": Tmax,
            "majortick": 30,
            "minortick": 10,
            "gridline": 12.5,
        },
        "y": {
            "label": "pressure [bar]",
            "min": 1,
            "max": Pmax,
            "majortick": 3,
            "minortick": 1,
            "gridline": 1,
        },
    },
    "mode": "move",
    "answercount": {
        "point": 0,
        "line": 0
    },
    "answer": {

    },
    "default": {
        "line": [
            {"equation": "Antoine(~x~, @AW@, @BW@, @CW@)",
             "label": {
                 "text": "water",
                 "independent": 180,
                 "indoffset": 3,
                 "depoffset": 0,
             },
             "independent": {
                 "symbol": "x",
                 "min": Tmin,
                 "max": Tmax
             },
             "dependent": {
                 "symbol": "y",
                 "min": 1,
                 "max": Pmax
             },
             "tension": 0.5,
             "steps": 50,
             "color": watercolor,
             "showpoints": false},

            {"equation": "Antoine(~x~, @A@org@@, @B@org@@, @C@org@@)",
             "label": {
                 "text": "@compound@",
                 "independent": 150,
                "indoffset": 3,
                "depoffset": 0,
             },
             "independent": {
                 "symbol": "x",
                 "min": Tmin,
                 "max": Tmax
             },
             "dependent": {
                 "symbol": "y",
                 "min": 1,
                 "max": Pmax
             },
             "tension": 0.5,
             "steps": 50,
             "color": organiccolor,
             "showpoints": false},

            {"equation": "Antoine(~x~, @AW@, @BW@, @CW@) + Antoine(~x~, @A@org@@, @B@org@@, @C@org@@)",
             "label": {
                 "text": "sum",
                 "independent": 150,
                 "indoffset": 3,
                 "depoffset": 0,
             },
             "independent": {
                 "symbol": "x",
                 "min": Tmin,
                 "max": Tmax
             },
             "dependent": {
                 "symbol": "y",
                 "min": 1,
                 "max": Pmax
             },
             "tension": 0.5,
             "steps": 50,
             "color": "purple",
             "showpoints": false},
        ],
    },
    "cursor": secondarycursor,
    "points": 0
}

const problem = {
    "pagetitle": "Construct a Temperature-Composition Diagram for Immiscible Liquids",
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
            "Tmin": 100,
            "Tmax": 250,
        },
        "random": {
            "P": {"min": Pmin,
                  "max": Pmax,
                  "digits": 1},
            "orgnum": {"min": 0,
                       "max": 2,
                       "digits": 0}
        },
        "calculated": {
            "org": "['B', 'T', 'H'][@orgnum@]",
            "compound": "['benzene', 'toluene', 'hexane'][@orgnum@]",
            "TsatW": "InvAntoine(@P@, @AW@, @BW@, @CW@).toFixed(0)",
            "TsatO": "InvAntoine(@P@, @A@org@@, @B@org@@, @C@org@@).toFixed(0)",
            "Tsum": "FindRoot({expression:'Antoine(T, @AW@, @BW@, @CW@) + Antoine(T, @A@org@@, @B@org@@, @C@org@@) - @P@', variable:'T', min:@Tmin@, max:@Tmax@, precision:0.001})",
            "PsatW": "Antoine(@Tsum@, @AW@, @BW@, @CW@)",
            "PsatO": "Antoine(@Tsum@, @A@org@@, @B@org@@, @C@org@@)",
            "Psum": "@PsatW@ + @PsatO@",
            "xc": "@PsatO@ / @Psum@",
            "x1": "@xc@ * 3/6",
            "x2": "@xc@ * 4/6",
            "x3": "@xc@ * 5/6",
            "x4": "@xc@ + (1-@xc@) * 1/6",
            "x5": "@xc@ + (1-@xc@) * 2/6",
            "x6": "@xc@ + (1-@xc@) * 3/6",

            "y1": "InvAntoine(@P@ * (1 - @x1@), @AW@, @BW@, @CW@)",
            "y2": "InvAntoine(@P@ * (1 - @x2@), @AW@, @BW@, @CW@)",
            "y3": "InvAntoine(@P@ * (1 - @x3@), @AW@, @BW@, @CW@)",
            "y4": "InvAntoine(@P@ * @x4@, @A@org@@, @B@org@@, @C@org@@)",
            "y5": "InvAntoine(@P@ * @x5@, @A@org@@, @B@org@@, @C@org@@)",
            "y6": "InvAntoine(@P@ * @x6@, @A@org@@, @B@org@@, @C@org@@)",
            "yvlabel": "@Tmax@ * .75 + .25 * @Tsum@",
            "yllabel": "@Tmin@ * .5 + .5 * @Tsum@",
            "ywlabel": "(@TsatW@+@Tsum@)/2",
            "yolabel": "(@TsatO@+@Tsum@)/2",
        }
    }, // variables
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
                            {"points":[{"x":"0", "y":"@Tsum@", "answer":true, "show":false},
                                       {"x":"1", "y":"@Tsum@", "show":false}], "tolerance":pointtolerance, "color":answercolor}
                        ]
                    },
                    "default": {
                        "line": [
                            {"points":[
                                {"x":0, "y":175, "movey":true, "show":false},
                                {"x":1, "y":175, "movey":true, "show":false}],
                             "color":"black",
                             "dashes": {
                                 "dash": 3,
                                 "space": 5
                             },
                             "answer":true,
                             "altcursor": {
                                 "format": "T = ~y~",
                                 "digits": {"y": 0}
                             }}
                        ],
                    },
                    "cursor": normalcursor,
                    "points": 10
                },
                {
                    "type": "text",
                    "label": "Hint: saturation pressures sum to the total pressure",
                    "class": "hiddentext hint"
                }],
                [{
                    "type": "text",
                    "label": "Drag the dotted line in the figure on the left to the temperature where three phases coexist. Use the P-T chart to determine the saturation pressure at a given temperature.",
                    "class": "prompt"
                },
                {
                    "type": "text",
                    "label": datalabel,
                    "class": "data"
                },
                sidegraph]],
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
                            {"points":[{"x":0, "y":"@Tsum@", "show":false},
                                       {"x":1, "y":"@Tsum@", "show":false}], "color":graycolor}
                        ],
                        "text": [
                            {"text":"region A", "position": {"x": 0.5, "y": "@yvlabel@"}, "align":"center", "color":"blue", "font":"sans-serif", "fontsize":20, "fontstyle":"bold"},
                            {"text":"region B", "position": {"x": 0.5, "y": "@yllabel@"}, "align":"center", "color":"blue", "font":"sans-serif", "fontsize":20, "fontstyle":"bold"},
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
                    "answer": "B",
                    "tolerance": 0,
                    "points": 10
                },
                {
                    "type": "text",
                    "label": "Hint: liquids are more stable at lower temperatures",
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
                            {"x":"0", "y":"@TsatW@", "tolerance":pointtolerance, "color":watercolor},
                            {"x":"1", "y":"@TsatO@", "tolerance":pointtolerance, "color":organiccolor}
                        ]
                    },
                    "default": {
                        "point": [
                            {"x":0.3, "y":175, "movex":true, "movey":true, "color":watercolor, "answer":true},
                            {"x":0.7, "y":175, "movex":true, "movey":true, "color":organiccolor, "answer":true}
                        ],
                        "line": [
                            {"points":[{"x":0, "y":"@Tsum@", "show":false},
                                       {"x":1, "y":"@Tsum@", "show":false}], "color":graycolor},
                        ],
                        "text": [
                            {"text":"vapor", "position": {"x": 0.5, "y": "@yvlabel@"}, "align":"center", "color":textcolor},
                            {"text":"liquid @compound@ + liquid water", "position": {"x": 0.5, "y": "@yllabel@"}, "align":"center", "color":textcolor}
                        ]
                    },
                    "cursor": normalcursor,
                    "points": 20
                }, // element
                {
                    "type": "text",
                    "label": "Hint: use the P-T diagram to determine saturation temperatures at this pressure",
                    "class": "hiddentext hint"
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
                sidegraph]], // element
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
                            {"x":"@xc@", "y":"@Tsum@", "tolerance":pointtolerance, "color":triplecolor}
                        ]
                    },
                    "default": {
                        "point": [
                            {"x":"0", "y":"@TsatW@", "color":watercolor},
                            {"x":"1", "y":"@TsatO@", "color":organiccolor},
                            {"x":0.5, "y":175, "color":triplecolor, "movex":true, "movey":true, "answer":true}
                        ],
                        "line": [
                            {"points":[{"x":0, "y":"@Tsum@", "show":false},
                                       {"x":1, "y":"@Tsum@", "show":false}], "color":graycolor},
                        ],
                        "text": [
                            {"text":"vapor", "position": {"x": 0.5, "y": "@yvlabel@"}, "align":"center", "color":textcolor},
                            {"text":"liquid @compound@ + liquid water", "position": {"x": 0.5, "y": "@yllabel@"}, "align":"center", "color":textcolor}
                        ]
                    },
                    "cursor": normalcursor,
                    "points": 10
                }, // element
                {
                    "type": "text",
                    "label": "Hint: calculate the mole fraction using the saturation pressures",
                    "class": "hiddentext hint"
                }], // element
                [{
                    "type": "text",
                    "label": "Drag the green point to where vapor is in equilibrium with two liquid phases.",
                    "class": "prompt"
                }, // element
                {
                    "type": "text",
                    "label": datalabel,
                    "class": "data"
                },
                sidegraph]], // element
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
                        "line":[{"points":[{"x":"0", "y":"@Tsum@", "show":false},
                                           {"x":"0", "y":"@TsatW@", "color":watercolor},
                                           {"x":"@x1@", "y":"@y1@", "answer":true, "show":false},
                                           {"x":"@x2@", "y":"@y2@", "answer":true, "show":false},
                                           {"x":"@x3@", "y":"@y3@", "answer":true, "show":false},
                                           {"x":"@xc@", "y":"@Tsum@"}], "tolerance":pointtolerance, "color":answercolor},
                                {"points":[{"x":"@xc@", "y":"@Tsum@", "color":"green"},
                                           {"x":"@x4@", "y":"@y4@", "answer":true, "show":false},
                                           {"x":"@x5@", "y":"@y5@", "answer":true, "show":false},
                                           {"x":"@x6@", "y":"@y6@", "answer":true, "show":false},
                                           {"x":"1", "y":"@TsatO@", "color":organiccolor},
                                           {"x":"1", "y":"@Tsum@", "show":false}],
                                 "tolerance":pointtolerance, "color":answercolor}
                                ]
                    },
                    "default": {
                        "line": [
                            {"points":[{"x":0, "y":"@Tsum@", "radius":1, "show":false},
                                       {"x":1, "y":"@Tsum@", "radius":1, "show":false}],
                             "color":graycolor},
                            {"points":[{"x":"0", "y":"@Tsum@", "show":false},
                                       {"x":"0", "y":"@TsatW@", "color":watercolor},
                                       {"x":"@x1@", "y":"@TsatW@", "movey":true},
                                       {"x":"@x2@", "y":"@TsatW@", "movey":true},
                                       {"x":"@x3@", "y":"@TsatW@", "movey":true},
                                       {"x":"@xc@", "y":"@Tsum@", "color":"green"}],
                             "color":graycolor,
                             "answer":true,
                             "fill":{"color":watercolor, "opacity":0.2}},
                            {"points":[{"x":"@xc@", "y":"@Tsum@", "color":"green"},
                                       {"x":"@x4@", "y":"@TsatO@", "movey":true},
                                       {"x":"@x5@", "y":"@TsatO@", "movey":true},
                                       {"x":"@x6@", "y":"@TsatO@", "movey":true},
                                       {"x":"1", "y":"@TsatO@", "color":organiccolor},
                                       {"x":"1", "y":"@Tsum@", "show":false}],
                             "color":graycolor,
                             "answer":true,
                             "fill":{"color":organiccolor, "opacity":0.2}}
                        ],
                        "text": [
                            {"text":"vapor", "position": {"x": 0.5, "y": "@yvlabel@"}, "align":"center", "color":textcolor},
                            {"text":"liquid @compound@ + liquid water", "position": {"x": 0.5, "y": "@yllabel@"}, "align":"center", "color":textcolor}
                        ]
                    },
                    "cursor": normalcursor,
                    "points": 20
                }, // element
                {
                    "type": "text",
                    "label": "Hint: the vapor mole fraction for component i, y<sub>i</sub> = P<sub>i</sub><sup>sat</sup> / P",
                    "class": "hiddentext hint"
                }], // element
                [{
                    "type": "text",
                    "label": "Drag each black point to the temperature where vapor with that mole fraction is in equilbrium with liquid. <br>",
                    "class": "prompt"
                }, // element
                {
                    "type": "text",
                    "label": datalabel,
                    "class": "data"
                },
                sidegraph]], // element
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
                        {"points":[{"x":0, "y":"@Tsum@", "radius":1, "show":false},
                                   {"x":1, "y":"@Tsum@", "radius":1, "show":false}], "color":graycolor},
                        {"points":[{"x":"0", "y":"@Tsum@", "show":false},
                                   {"x":"0", "y":"@TsatW@", "color":watercolor},
                                   {"x":"@x1@", "y":"@y1@", "show": false},
                                   {"x":"@x2@", "y":"@y2@", "show": false},
                                   {"x":"@x3@", "y":"@y3@", "show": false},
                                   {"x":"@xc@", "y":"@Tsum@", "color":"green"}], "color":graycolor,
                                   "fill":{"color":watercolor, "opacity":0.2}},
                        {"points":[{"x":"@xc@", "y":"@Tsum@", "color":"green"},
                                   {"x":"@x4@", "y":"@y4@", "show": false},
                                   {"x":"@x5@", "y":"@y5@", "show": false},
                                   {"x":"@x6@", "y":"@y6@", "show": false},
                                   {"x":"1", "y":"@TsatO@", "color":organiccolor},
                                   {"x":"1", "y":"@Tsum@", "show":false}],
                                   "color":graycolor,
                                   "fill":{"color":organiccolor, "opacity":0.2}}
                    ],
                    "text": [
                        {"text":"vapor", "position": {"x": 0.5, "y": "@yvlabel@"}, "align":"center", "color":textcolor},
                        {"text":"vapor + liquid water", "position": {"x": 0.01, "y": "@ywlabel@"}, "align":"left", "color":textcolor},
                        {"text":"vapor + liquid @compound@", "position": {"x": 0.99, "y": "@yolabel@"}, "align":"right", "color":textcolor},
                        {"text":"liquid @compound@ + liquid water", "position": {"x": 0.5, "y": "@yllabel@"}, "align":"center", "color":textcolor}
                    ]
                },
                "cursor": normalcursor,
            },
        ] // questionelements
    }, // finish

    "begin": {
        "variables": {
            "constants": {
                "P": "25",
                "org": "B",
            },
            "random": {},
            "calculated": {
                "TsatW": "InvAntoine(@P@, @AW@, @BW@, @CW@).toFixed(0)",
                "TsatO": "InvAntoine(@P@, @A@org@@, @B@org@@, @C@org@@).toFixed(0)",
                "Tsum": "FindRoot({expression:'Antoine(T, @AW@, @BW@, @CW@) + Antoine(T, @A@org@@, @B@org@@, @C@org@@) - @P@', variable:'T', min:@Tmin@, max:@Tmax@, precision:0.001})",
                "PsatW": "Antoine(@Tsum@, @AW@, @BW@, @CW@)",
                "PsatO": "Antoine(@Tsum@, @A@org@@, @B@org@@, @C@org@@)",
                "Psum": "@PsatW@ + @PsatO@",
                "xc": "@PsatO@ / @Psum@",
                "x1": "@xc@ * 3/6",
                "x2": "@xc@ * 4/6",
                "x3": "@xc@ * 5/6",
                "x4": "@xc@ + (1-@xc@) * 1/6",
                "x5": "@xc@ + (1-@xc@) * 2/6",
                "x6": "@xc@ + (1-@xc@) * 3/6",

                "y1": "InvAntoine(@P@ * (1 - @x1@), @AW@, @BW@, @CW@)",
                "y2": "InvAntoine(@P@ * (1 - @x2@), @AW@, @BW@, @CW@)",
                "y3": "InvAntoine(@P@ * (1 - @x3@), @AW@, @BW@, @CW@)",
                "y4": "InvAntoine(@P@ * @x4@, @A@org@@, @B@org@@, @C@org@@)",
                "y5": "InvAntoine(@P@ * @x5@, @A@org@@, @B@org@@, @C@org@@)",
                "y6": "InvAntoine(@P@ * @x6@, @A@org@@, @B@org@@, @C@org@@)",
            }
        },
        "questionelements": [
            [[{
                "type": "text",
                "label": `In this demonstration, the user is led through a step-by-step procedure to create a pressure-composition diagram for two immiscible liquids (water and an organic) at a fixed temperature. The organic can be benzene, toluene, or n-hexane.<br><br>After answering, the user clicks "Submit Answer" to check their answer, followed by "Next" to proceed with the question. The user can only move forward or select "Restart Problem" to start over at a different temperature and a different organic. For any step, click "Hint" for help.<br><br>In some steps, saturation pressures are calculated from Antoine's equation shown in a second graph. To begin, press the "Begin" button below.`,
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
