"use strict";

/*
    Structure:
    
    ProblemController
        Question[]
            QuestionElement[]
*/

/*
TODO:
GraphElement
    add support for drawing:
        multisegment line (length n)
        multisegment straight line (length n)
        point slope line drawing

    add alpha option to elements
    add region element (defined by lines?)
    
    graph/axis making page
    
    allow multiple answers in textboxes
    boolean to set case sensitivity
    allow line construction with a function instead of points
    allow region based on set of inequalities
    add user score submission at the end
*/


// var p = JSON.parse(json_string);


// ##### Constants (default values) #####

const VAR = "@";
const SPVAR = "~";
const IDLENGTH = 16;
const GRABRADIUS = 10;
