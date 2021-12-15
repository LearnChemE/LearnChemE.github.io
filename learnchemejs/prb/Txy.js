import {ProblemController} from "../src/ProblemController.js";

const datalabel = "pressure = @P@ bar";

const octanecolor = "blue";
const hexanecolor = "orange";
const purplecolor = "fuchsia";
const yellowcolor = "yellow";
const textcolor = "black";
const graycolor = "#999999";
const answercolor = "green";
const linesteps = 15;
const Tmin = 40;
const Tmax = 160;
const Pmin = 0.4;
const Pmax = 2;

const graphinfo = {
    "graphheight": 400,
    "graphwidth": 500,
    "padding": {"left":80, "bottom":60, "top":60, "right":30},
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
        "label": "temperature [°C]",
        "min": Tmin,
        "max": Tmax,
        "majortick": 10,
        "minortick": 5,
        "gridline": 10,
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

const pointtolerance = {"x":0.025, "y":4};

const normalcursor = {
    "format": "z<sub>H</sub> = ~x~, T = ~y~",
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
    "label": "the saturation pressures for each component are plotted versus temperature",
    "class": "data"
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
            "majortick": 20,
            "minortick": 10,
            "gridline": 10,
        },
        "y": {
            "label": "pressure [bar]",
            "min": Pmin,
            "max": Pmax,
            "majortick": 0.2,
            "minortick": 0.1,
            "gridline": 0.1,
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
            {"equation": "Antoine(~x~, @AO@, @BO@, @CO@)",
             "independent": {
                 "symbol": "x",
                 "min": Tmin,
                 "max": Tmax
             },
             "dependent": {
                 "symbol": "y",
                 "min": Pmin,
                 "max": Pmax
             },
             "steps": 50,
             "label": {
                 "text": "n-octane",
                 "independent": 130,
                 "indoffset": 3,
                 "depoffset": 0,
             },
             "tension": 0.5,
             "color": octanecolor,
             "showpoints": false},

            {"equation": "Antoine(~x~, @AH@, @BH@, @CH@)",
              "independent": {
                 "symbol": "x",
                 "min": Tmin,
                 "max": Tmax
             },
             "dependent": {
                 "symbol": "y",
                 "min": Pmin,
                 "max": Pmax
             },
             "steps": 50,
             "label": {
                 "text": "n-hexane",
                 "independent": 70,
                "indoffset": 3,
                "depoffset": 0,
             },
             "tension": 0.5,
             "color": hexanecolor,
             "showpoints": false},

        ],
    },
    "cursor": secondarycursor,
    "points": 0
}

const problem = {
    "pagetitle": "Construct a Temperature-Composition Diagram for VLE",
    "variables": {
        "constants": {
            "AO": 4.04847,
            "BO": 1355.126,
            "CO": 209.517,
            "AH": 4.00266,
            "BH": 1171.53,
            "CH": 224.366,
            "Tmin": Tmin,
            "Tmax": Tmax,
            "Tinit": 70,

            "P": Pmin,
        },
        "random": {
            "P": {
                "min": Pmin,
                "max": Pmax,
                "digits": 1
            },
            "q5": {
                "min": 0,
                "max": 1,
                "digits": 0
            },
            "q6x": {
                "min": 0.2,
                "max": 0.8,
                "digits": 2
            },
            "q6yscale": {
                "min": 0.2,
                "max": 0.8,
                "digits": 2
            },
        },
        "calculated": {
            "TsatO": "InvAntoine(@P@, @AO@, @BO@, @CO@).toFixed(0)",
            "TsatH": "InvAntoine(@P@, @AH@, @BH@, @CH@).toFixed(0)",
            "Tsum": "FindRoot({expression:'Antoine(T, @AO@, @BO@, @CO@) + Antoine(T, @AH@, @BH@, @CH@) - @P@', variable:'T', min:@Tmin@, max:@Tmax@, precision:0.001})",
            "PsatO": "Antoine(@Tsum@, @AO@, @BO@, @CO@)",
            "PsatH": "Antoine(@Tsum@, @AH@, @BH@, @CH@)",
            "Psum": "@PsatH@ + @PsatH@",

            "Tinit": "55",
            "x1": "0",
            "x2": "0.25",
            "x3": "0.5",
            "x4": "0.75",
            "x5": "1",

            // calculate real bubble and dew points
            "by2": "FindRoot({expression:'@x2@ * Antoine(T, @AH@, @BH@, @CH@) + (1 - @x2@) * Antoine(T, @AO@, @BO@, @CO@) - @P@', variable:'T', min:@Tmin@, max:@Tmax@, precision:0.1})",
            "by3": "FindRoot({expression:'@x3@ * Antoine(T, @AH@, @BH@, @CH@) + (1 - @x3@) * Antoine(T, @AO@, @BO@, @CO@) - @P@', variable:'T', min:@Tmin@, max:@Tmax@, precision:0.1})",
            "by4": "FindRoot({expression:'@x4@ * Antoine(T, @AH@, @BH@, @CH@) + (1 - @x4@) * Antoine(T, @AO@, @BO@, @CO@) - @P@', variable:'T', min:@Tmin@, max:@Tmax@, precision:0.1})",

            "dy2": "FindRoot({expression:'@x2@ / Antoine(T, @AH@, @BH@, @CH@) + (1 - @x2@) / Antoine(T, @AO@, @BO@, @CO@) - 1 / @P@', variable:'T', min:@Tmin@, max:@Tmax@, precision:0.01})",
            "dy3": "FindRoot({expression:'@x3@ / Antoine(T, @AH@, @BH@, @CH@) + (1 - @x3@) / Antoine(T, @AO@, @BO@, @CO@) - 1 / @P@', variable:'T', min:@Tmin@, max:@Tmax@, precision:0.01})",
            "dy4": "FindRoot({expression:'@x4@ / Antoine(T, @AH@, @BH@, @CH@) + (1 - @x4@) / Antoine(T, @AO@, @BO@, @CO@) - 1 / @P@', variable:'T', min:@Tmin@, max:@Tmax@, precision:0.01})",

            "yvlabel": "(@Tmax@ - @Tmin@) * .9 + @Tmin@",
            "yvllabel": "(@by3@ + @dy3@) / 2",
            "yllabel": "(@Tmax@ - @Tmin@) * .1 + @Tmin@",

            "q5text": "['vapor', 'liquid'][@q5@]",
            "q5ans": "['A', 'C'][@q5@]",

            "q6ly": "FindRoot({expression:'@q6x@ * Antoine(T, @AH@, @BH@, @CH@) + (1 - @q6x@) * Antoine(T, @AO@, @BO@, @CO@) - @P@', variable:'T', min:@Tmin@, max:@Tmax@, precision:0.1})",
            "q6vy": "FindRoot({expression:'@q6x@ / Antoine(T, @AH@, @BH@, @CH@) + (1 - @q6x@) / Antoine(T, @AO@, @BO@, @CO@) - 1 / @P@', variable:'T', min:@Tmin@, max:@Tmax@, precision:0.1})",
            "q6y": "(@q6vy@ - @q6ly@) * @q6yscale@ + @q6ly@",

            "q6lx": "FindRoot({expression:'x * Antoine(@q6y@, @AH@, @BH@, @CH@) + (1 - x) * Antoine(@q6y@, @AO@, @BO@, @CO@) - @P@', variable:'x', min:0, max:1, precision:0.01})",
            "q6vx": "FindRoot({expression:'x / Antoine(@q6y@, @AH@, @BH@, @CH@) + (1 - x) / Antoine(@q6y@, @AO@, @BO@, @CO@) - 1 / @P@', variable:'x', min:0, max:1, precision:0.01})",

            "q7ans": "roundTo((@q6x@ - @q6lx@) / (@q6vx@ - @q6lx@), 2)",
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
                        "point": 1,
                        "line": 0
                    },
                    "answer": {
                        "point": [
                            {"x":1, "y":"@TsatH@", "tolerance":pointtolerance, "color":"orange"}
                        ]
                    },
                    "default": {
                        "point": [
                            {"x":0.5, "y":Tmax / 2, "movex":true, "movey":true, "color":"orange", "answer":true}
                        ],
                    },
                    "cursor": normalcursor,
                    "points": 10
                },
                {
                    "type": "text",
                    "label": "Hint: determine saturation temperature using the P-T graph",
                    "class": "hiddentext hint"
                }],
                [{
                    "type": "text",
                    "label": "Click and drag the orange point to the location where pure n-hexane is in vapor-liquid equilibrium.",
                    "class": "prompt"
                },
                {
                    "type": "text",
                    "label": datalabel,
                    "class": "data"
                },
                sidegraphtext,
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
                        "point": 1,
                        "line": 0
                    },
                    "answer": {
                        "point": [
                            {"x":0, "y":"@TsatO@", "tolerance":pointtolerance, "color":octanecolor}
                        ]
                    },
                    "default": {
                        "point": [
                            {"x":1, "y":"@TsatH@", "color":"orange"},
                            {"x":0.5, "y":Tmax / 2, "movex":true, "movey":true, "color":octanecolor, "answer":true},
                        ],
                    },
                    "cursor": normalcursor,
                    "points": 10
                },
                {
                    "type": "text",
                    "label": "Hint: determine saturation temperature using the P-T graph",
                    "class": "hiddentext hint"
                }],
                [{
                    "type": "text",
                    "label": "Click and drag the blue point to the location where pure n-octane is in vapor-liquid equilibrium.",
                    "class": "prompt"
                },
                {
                    "type": "text",
                    "label": datalabel,
                    "class": "data"
                },
                sidegraphtext,
                sidegraph]],
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
                            {"points":[{"x":"@x1@", "y":"@TsatO@", "show":false},
                                       {"x":"@x2@", "y":"@by2@", "show":false, "answer":true},
                                       {"x":"@x3@", "y":"@by3@", "show":false, "answer":true},
                                       {"x":"@x4@", "y":"@by4@", "show":false, "answer":true},
                                       {"x":"@x5@", "y":"@TsatH@", "show":false},],
                             "tolerance":pointtolerance,
                             "color":answercolor},
                        ]
                    },
                    "default": {
                        "line": [
                            {"points":[{"x":"@x1@", "y":"@TsatO@", "color":octanecolor},
                                       {"x":"@x2@", "y":"@Tinit@", "movey":true},
                                       {"x":"@x3@", "y":"@Tinit@", "movey":true},
                                       {"x":"@x4@", "y":"@Tinit@", "movey":true},
                                       {"x":"@x5@", "y":"@TsatH@", "color":hexanecolor},],
                             "color":graycolor,
                             "answer":true,},
                        ],

                    },
                    "cursor": normalcursor,
                    "points": 10
                },
                {
                    "type": "text",
                    "label": "Hint:<br>K<sub>i</sub> = P<sup>sat</sup><sub>i</sub> / P<br>Σ (K<sub>i</sub> · x<sub>i</sub>) = 1",
                    "class": "hiddentext hint"
                }],
                [{
                    "type": "text",
                    "label": "Click and drag the black points to draw the bubble-point curve.",
                    "class": "prompt"
                },
                {
                    "type": "text",
                    "label": datalabel,
                    "class": "data"
                },
                sidegraphtext,
                sidegraph]]
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
                            {"points":[{"x":"@x1@", "y":"@TsatO@", "show":false},
                                       {"x":"@x2@", "y":"@dy2@", "show":false, "answer":true},
                                       {"x":"@x3@", "y":"@dy3@", "show":false, "answer":true},
                                       {"x":"@x4@", "y":"@dy4@", "show":false, "answer":true},
                                       {"x":"@x5@", "y":"@TsatH@", "show":false},],
                             "tolerance":pointtolerance,
                             "color":answercolor},
                        ]
                    },
                    "default": {
                        "line": [
                            {"equation": "FindRoot({expression:'~x~ * Antoine(T, @AH@, @BH@, @CH@) + (1 - ~x~) * Antoine(T, @AO@, @BO@, @CO@) - @P@', variable:'T', min:@Tmin@, max:@Tmax@, precision:0.001})",
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
                             "steps": linesteps,
                             "tension": 0.5,
                             "color": graycolor,
                             "showpoints": false},

                            {"points":[{"x":"@x1@", "y":"@TsatO@", "color":octanecolor},
                                       {"x":"@x2@", "y":"@Tinit@", "movey":true},
                                       {"x":"@x3@", "y":"@Tinit@", "movey":true},
                                       {"x":"@x4@", "y":"@Tinit@", "movey":true},
                                       {"x":"@x5@", "y":"@TsatH@", "color":hexanecolor},],
                             "color":graycolor,
                             "answer":true,},
                        ],

                    },
                    "cursor": normalcursor,
                    "points": 10
                },
                {
                    "type": "text",
                    "label": "Hint:<br>K<sub>i</sub> = P<sup>sat</sup><sub>i</sub> / P<br>Σ (y<sub>i</sub> / K<sub>i</sub>) = 1",
                    "class": "hiddentext hint"
                }],
                [{
                    "type": "text",
                    "label": "Click and drag the black points to draw the dew-point curve.",
                    "class": "prompt"
                },
                {
                    "type": "text",
                    "label": datalabel,
                    "class": "data"
                },
                sidegraphtext,
                sidegraph]]
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
                        "point": [
                            {"x":"@x1@", "y":"@TsatO@", "color":octanecolor},
                            {"x":"@x5@", "y":"@TsatH@", "color":hexanecolor},
                        ],
                        "line": [
                            {"equation": "FindRoot({expression:'~x~ * Antoine(T, @AH@, @BH@, @CH@) + (1 - ~x~) * Antoine(T, @AO@, @BO@, @CO@) - @P@', variable:'T', min:@Tmin@, max:@Tmax@, precision:0.001})",
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
                             "steps": linesteps,
                             "tension": 0.5,
                             "color": graycolor,
                             "showpoints": false},

                            {"equation": "FindRoot({expression:'~x~ / Antoine(T, @AH@, @BH@, @CH@) + (1 - ~x~) / Antoine(T, @AO@, @BO@, @CO@) - 1 / @P@', variable:'T', min:@Tmin@, max:@Tmax@, precision:0.001})",
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
                             "steps": linesteps,
                             "tension": 0.5,
                             "color": graycolor,
                             "showpoints": false},
                        ],
                        "text": [
                            {"text":"region A", "position": {"x": 0.5, "y": "@yvlabel@"}, "font":"sans-serif", "fontsize":20, "fontstyle":"bold", "align":"center", "color":textcolor},
                            {"text":"region B", "position": {"x": 0.5, "y": "@yvllabel@"}, "font":"sans-serif", "fontsize":20, "fontstyle":"bold", "align":"center", "color":textcolor},
                            {"text":"region C", "position": {"x": 0.5, "y": "@yllabel@"}, "font":"sans-serif", "fontsize":20, "fontstyle":"bold", "align":"center", "color":textcolor},
                        ]

                    },
                    "cursor": normalcursor,
                    "points": 0
                }],
                [{
                    "type": "text",
                    "label": datalabel,
                    "class": "data"
                },
                [[{
                    "type": "text",
                    "label": "Which region has pure @q5text@?",
                    "class": "prompt"
                },
                {
                    "type": "textbox",
                    "placeholder": "type A, B, or C",
                    "answertype": "text",
                    "answer": "@q5ans@",
                    "tolerance": 0,
                    "points": 10
                },
                {
                    "type": "text",
                    "label": "Hint: liquids are more stable at lower temperatures",
                    "class": "hiddentext hint"
                }]]]]
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
                            {"points":[{"x":"@q6lx@", "y":"@q6y@","color":purplecolor, "answer":true},
                                       {"x":"@q6x@", "y":"@q6y@", "show":false},
                                       {"x":"@q6vx@", "y":"@q6y@","color":yellowcolor, "answer":true},],
                             "color":"black",
                             "tolerance":pointtolerance,
                             "color":answercolor}
                        ]
                    },
                    "default": {
                        "point":[
                            {"x":"@x1@", "y":"@TsatO@", "color":octanecolor},
                            {"x":"@x5@", "y":"@TsatH@", "color":hexanecolor}
                        ],
                        "line": [
                            {"equation": "FindRoot({expression:'~x~ * Antoine(T, @AH@, @BH@, @CH@) + (1 - ~x~) * Antoine(T, @AO@, @BO@, @CO@) - @P@', variable:'T', min:@Tmin@, max:@Tmax@, precision:0.001})",
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
                             "steps": linesteps,
                             "tension": 0.5,
                             "color": graycolor,
                             "showpoints": false},

                            {"equation": "FindRoot({expression:'~x~ / Antoine(T, @AH@, @BH@, @CH@) + (1 - ~x~) / Antoine(T, @AO@, @BO@, @CO@) - 1 / @P@', variable:'T', min:@Tmin@, max:@Tmax@, precision:0.001})",
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
                             "steps": linesteps,
                             "tension": 0.5,
                             "color": graycolor,
                             "showpoints": false},

                            {"points":[{"x":0.1, "y":"@Tinit@", "movex":true, "movey":true, "color":purplecolor},
                                       {"x":"@q6x@", "y":"@q6y@"},
                                       {"x":0.9, "y":"@Tinit@", "movex":true, "movey":true, "color":yellowcolor},],
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
                    "label": "Click and drag the pink (liquid) and yellow (vapor) points to the compositions that are in equilibrium for the mixture indicated by the black point.",
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
                        "point":[
                            {"x":"@x1@", "y":"@TsatO@", "color":octanecolor},
                            {"x":"@x5@", "y":"@TsatH@", "color":hexanecolor}
                        ],
                        "line": [
                            {"equation": "FindRoot({expression:'~x~ * Antoine(T, @AH@, @BH@, @CH@) + (1 - ~x~) * Antoine(T, @AO@, @BO@, @CO@) - @P@', variable:'T', min:@Tmin@, max:@Tmax@, precision:0.001})",
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
                             "steps": linesteps,
                             "tension": 0.5,
                             "color": graycolor,
                             "showpoints": false},

                            {"equation": "FindRoot({expression:'~x~ / Antoine(T, @AH@, @BH@, @CH@) + (1 - ~x~) / Antoine(T, @AO@, @BO@, @CO@) - 1 / @P@', variable:'T', min:@Tmin@, max:@Tmax@, precision:0.001})",
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
                             "steps": linesteps,
                             "tension": 0.5,
                             "color": graycolor,
                             "showpoints": false},

                            {"points":[{"x":"@q6lx@", "y":"@q6y@", "color":purplecolor},
                                       {"x":"@q6x@", "y":"@q6y@"},
                                       {"x":"@q6vx@", "y":"@q6y@", "color":yellowcolor},],
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
                    "answer": "@q7ans@",
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
                "mode": "view",
                "answercount": {
                    "point": 0,
                    "line": 0
                },
                "answer": {},
                "default": {
                    "point":[
                        {"x":"@x1@", "y":"@TsatO@", "color":octanecolor},
                        {"x":"@x5@", "y":"@TsatH@", "color":hexanecolor}
                    ],
                    "line": [
                        {"equation": "FindRoot({expression:'~x~ * Antoine(T, @AH@, @BH@, @CH@) + (1 - ~x~) * Antoine(T, @AO@, @BO@, @CO@) - @P@', variable:'T', min:@Tmin@, max:@Tmax@, precision:0.001})",
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
                         "steps": linesteps,
                         "tension": 0.5,
                         "color": graycolor,
                         "showpoints": false},

                        {"equation": "FindRoot({expression:'~x~ / Antoine(T, @AH@, @BH@, @CH@) + (1 - ~x~) / Antoine(T, @AO@, @BO@, @CO@) - 1 / @P@', variable:'T', min:@Tmin@, max:@Tmax@, precision:0.001})",
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
                         "steps": linesteps,
                         "tension": 0.5,
                         "color": graycolor,
                         "showpoints": false},

                        {"points":[{"x":"@q6lx@", "y":"@q6y@", "color":purplecolor},
                                   {"x":"@q6x@", "y":"@q6y@", "label": {
                                       "text": "fraction vapor: @q7ans@",
                                       "align": "center",
                                       "offset": {"rawx":0, "rawy":20}}},
                                   {"x":"@q6vx@", "y":"@q6y@", "color":yellowcolor},],
                         "color":graycolor}

                    ],
                    "text": [
                        {"text":"liquid", "position": {"x": 0.5, "y": "@yllabel@"}, "align":"center", "color":textcolor},
                        {"text":"vapor", "position": {"x": 0.5, "y": "@yvlabel@"}, "align":"center", "color":textcolor},
                    ]
                },
                "cursor": normalcursor,
            },
        ] // questionelements
    }, // finish

    "begin": {
        "variables": {
            "constants": {
                "P": 1,
                "q6x": 0.4,
                "q6yscale": 0.5,
            },
            "random": {},
            "calculated": {
                "TsatO": "InvAntoine(@P@, @AO@, @BO@, @CO@).toFixed(0)",
                "TsatH": "InvAntoine(@P@, @AH@, @BH@, @CH@).toFixed(0)",
                "Tsum": "FindRoot({expression:'Antoine(T, @AO@, @BO@, @CO@) + Antoine(T, @AH@, @BH@, @CH@) - @P@', variable:'T', min:@Tmin@, max:@Tmax@, precision:0.001})",
                "PsatO": "Antoine(@Tsum@, @AO@, @BO@, @CO@)",
                "PsatH": "Antoine(@Tsum@, @AH@, @BH@, @CH@)",
                "Psum": "@PsatH@ + @PsatH@",

                "Tinit": "55",
                "x1": "0",
                "x2": "0.25",
                "x3": "0.5",
                "x4": "0.75",
                "x5": "1",

                // calculate real bubble and dew points
                "by2": "FindRoot({expression:'@x2@ * Antoine(T, @AH@, @BH@, @CH@) + (1 - @x2@) * Antoine(T, @AO@, @BO@, @CO@) - @P@', variable:'T', min:@Tmin@, max:@Tmax@, precision:0.1})",
                "by3": "FindRoot({expression:'@x3@ * Antoine(T, @AH@, @BH@, @CH@) + (1 - @x3@) * Antoine(T, @AO@, @BO@, @CO@) - @P@', variable:'T', min:@Tmin@, max:@Tmax@, precision:0.1})",
                "by4": "FindRoot({expression:'@x4@ * Antoine(T, @AH@, @BH@, @CH@) + (1 - @x4@) * Antoine(T, @AO@, @BO@, @CO@) - @P@', variable:'T', min:@Tmin@, max:@Tmax@, precision:0.1})",

                "dy2": "FindRoot({expression:'@x2@ / Antoine(T, @AH@, @BH@, @CH@) + (1 - @x2@) / Antoine(T, @AO@, @BO@, @CO@) - 1 / @P@', variable:'T', min:@Tmin@, max:@Tmax@, precision:0.01})",
                "dy3": "FindRoot({expression:'@x3@ / Antoine(T, @AH@, @BH@, @CH@) + (1 - @x3@) / Antoine(T, @AO@, @BO@, @CO@) - 1 / @P@', variable:'T', min:@Tmin@, max:@Tmax@, precision:0.01})",
                "dy4": "FindRoot({expression:'@x4@ / Antoine(T, @AH@, @BH@, @CH@) + (1 - @x4@) / Antoine(T, @AO@, @BO@, @CO@) - 1 / @P@', variable:'T', min:@Tmin@, max:@Tmax@, precision:0.01})",

                "q6ly": "FindRoot({expression:'@q6x@ * Antoine(T, @AH@, @BH@, @CH@) + (1 - @q6x@) * Antoine(T, @AO@, @BO@, @CO@) - @P@', variable:'T', min:@Tmin@, max:@Tmax@, precision:0.1})",
                "q6vy": "FindRoot({expression:'@q6x@ / Antoine(T, @AH@, @BH@, @CH@) + (1 - @q6x@) / Antoine(T, @AO@, @BO@, @CO@) - 1 / @P@', variable:'T', min:@Tmin@, max:@Tmax@, precision:0.1})",
                "q6y": "(@q6vy@ - @q6ly@) * @q6yscale@ + @q6ly@",

                "q6lx": "FindRoot({expression:'x * Antoine(@q6y@, @AH@, @BH@, @CH@) + (1 - x) * Antoine(@q6y@, @AO@, @BO@, @CO@) - @P@', variable:'x', min:0, max:1, precision:0.01})",
                "q6vx": "FindRoot({expression:'x / Antoine(@q6y@, @AH@, @BH@, @CH@) + (1 - x) / Antoine(@q6y@, @AO@, @BO@, @CO@) - 1 / @P@', variable:'x', min:0, max:1, precision:0.01})",
            }
        },
        "questionelements": [
            [[{
                "type": "text",
                "label": `This demonstration leads the user through the construction of a temperature-composition (T-x-y) diagram step-by-step for vapor-liquid equilibrium of an n-hexane/n-octane ideal mixture.<br><br>After answering, the user clicks "Submit Answer" to check their answer, followed by "Next" to proceed with the question. The user can only move forward or select "Restart Problem" to start over at a different pressure. At any step, click "Hint" for help.<br><br>In some steps, saturation pressures are calculated from Antoine's equation shown in a second graph. To begin, press the "Begin" button below.`,
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
