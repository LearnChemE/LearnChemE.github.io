// Import ProblemController class (which subsequently imports the classes it needs)
import {ProblemController} from "../src/ProblemController.js";

// Describe what graph looks like
const graphinfo = {
    "type": "xy",
    "graphheight": 500,
    "graphwidth": 500,
    "padding": {
        "left":60,
        "bottom":60,
        "top":30,
        "right":30
    },
    "graphbackground": "white",
    "axesbackground": "lightgray",
    "x": {
        "label": "x",
        "min": 0,
        "max": 10,
        "majortick": 1,
        "minortick": 0.2,
        "gridline": 0.2,
    },
    "y": {
        "label": "y",
        "min": 0,
        "max": 10,
        "majortick": 1,
        "minortick": 0.2,
        "gridline": 0.2,
    },
};

// How close to count answers as correct
const pointtolerance = {
    "x":0.25,
    "y":0.25
};

// Cursor display settings
const normalcursor = {
    "format": "z = ~x~, y = ~y~",
    "digits": {
        "x": 1,
        "y": 1,
    }
};

// The problem contents
const problem = {
    "pagetitle": "SimpleProblem",

    // list of variables used in the problem
    "variables": {
        // Constants never change
        "constants": {
            "one": 1,
            "two": 2,
            "three": 3,
        },
        // Random variables are re-rolled if the problem is restarted
        "random": {
            "x": {
                "min": 0,
                "max": 10,
                "digits": 0
            },
            "y": {
                "min": 0,
                "max": 10,
                "digits": 0
            }
        },
        // Calculated variables are recalculated if the problem is restarted
        "calculated": {
            "sum": "@x@ + @y@",
            "diff": "@x@ - @y@",
            "negdiff": "-@x@ + @y@",
        }
    },

    // list of questions in the problem
    "questions": [
        {
            // list of elements for the first question
            "questionelements": [

                // graph element
                // also note []'s around the graph element and the text element, this puts them on the same row
                [
                {
                    "type": "graph",
                    "graphinfo": graphinfo,
                    "mode": "move",
                    "answercount": {
                        "point": 1,
                        "line": 0
                    },
                    "answer": {
                        "point": [
                            {"x":"@x@", "y":"@y@", "tolerance":pointtolerance}
                        ]
                    },
                    "default": {
                        "point": [
                            {"x":"5", "y":"5", "movex":true, "movey":true, "color":"yellow", "answer":true}
                        ]
                    },
                    "cursor": normalcursor,
                    "points": 10
                },

                // text element
                {
                    "type": "text",
                    "label": `Find the point where <br> x + y = @sum@ <br> x - y = @diff@`,
                    "class": "text"
                }
                ]
            ], // questionelements

            // required score to pass this question (not working anymore)
            "requiredscore": 0.00
        }, // question

        {
            // list of elements for the second question
            "questionelements": [

                // text element
                {
                    "type": "text",
                    "label": `If x is @x@, and y is @y@, what is y - x?`,
                    "class": "text"
                },

                // textbox element
                {
                    "type": "textbox",
                    "placeholder": "x",
                    "answertype": "number",
                    "answer": "@negdiff@",
                    "tolerance": 0.25,
                    "points": 10
                },

            ], // questionelements

            // required score to pass this question (not working anymore)
            "requiredscore": 0.00
        }, // question
    ], // questions

    "begin": {
        "variables": {
        },
        "questionelements": [
            {
                "type": "text",
                "label": `This is the simple intro.`,
                "class": "prompt"
            } // element
        ] // questionelements
    }, // begin

    "finish": {
        "variables": {
        },
        "questionelements": [
            {
                "type": "text",
                "label": `This is the simple finish.`,
                "class": "prompt"
            } // element
        ] // questionelements
    }, // finish
};

// Create ProblemController, starting the problem
let problemController = new ProblemController(problem, document.getElementById("myscript").getAttribute("parentid"));