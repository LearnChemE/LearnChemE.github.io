import * as ChemFunction from './ChemFunctions.js';

const VAR = "@";
const SPVAR = "~";
const IDLENGTH = 16;
const GRABRADIUS = 10;

/**
    Calculates the straight-line distance between two 2D points
    @param {Point} pt1
    @param {Point} pt2
    @param {string} [mode] "cal" or "raw"
    @return {float} The distance between the points
*/
export function getDist(pt1, pt2, mode="cal") {
    if (mode === "cal") {
        return Math.pow(Math.pow(pt1.x - pt2.x, 2) + Math.pow(pt1.y - pt2.y, 2), 0.5);
    } else if (mode === "raw") {
        return Math.pow(Math.pow(pt1.rawx - pt2.rawx, 2) + Math.pow(pt1.rawy - pt2.rawy, 2), 0.5);
    }
}

/**
    Gets a random float between two values
    @param {float} low Lowest value
    @param {float} high Highest value
    @return {float} A float between high and low
*/
export function getRandom(low, high) {
    return Math.random() * (high - low) + low;
}

/**
 *
 * @param {*} start
 * @param {*} stop
 * @param {*} steps
 * @param {*} includelast
 */
export function linspace(start, stop, steps, includelast=true) {
    let a = [];
    let step = (stop - start) / (steps + (includelast ? -1 : 0));
    let val = start;
    for (let i = 0; i < steps; i++) {
        a.push(val + i * step);
    }
    return a;
}

/**
    Rounds a float to a given number of decimal places
    @param {float} num Number to round
    @param {int} digits Number of digits to round to
    @return {float} Rounded number
*/
export function roundTo(num, digits) {
    let mul = Math.pow(10, digits);
    return Math.round(num * mul) / mul;
}

/**
    Returns one of two results based on a condition
    @param {string} condition Condition to be tested
    @param {} iftrue Value to return if condition is true
    @param {} iffalse Value to return if condition is false
    @return {boolean} True or false
*/
export function ifTF(condition, iftrue, iffalse) {
    if (condition) {
        return iftrue;
    } else {
        return iffalse;
    }
}

/**
 * Numerically finds a root of an expression using Newton's method<br>
 * TODO: Generalize to multi-variable root finding using Jacobian
 * @param { string} args.expression  Equation that is set equal to 0
 * @param { string} args.variable    Variable name to replace in equation
 * @param { number} args.min     Minimum value to try
 * @param { number} args.max     Maximum value to try
 * @param { number} args.precision   Allowable error in the answer
 * @param { number} [args.initialguess]    Start guessing from here
 * @param { int} [args.maxloops=100] Maximum iterations to attempt
 * @return { number}     A root of the expression within the precision tolerance
 */
export function FindRoot(args) {
    const re = new RegExp(args.variable, "g");
    let loops = 0;
    let guess = args.guess ? args.guess : (args.min + args.max) / 2;
    let method = args.method ? args.method : "newton";
    let maxloops = args.maxloops ? args.maxloops : 100;
    let err = evalWithContext(args.expression.replace(re, guess));

    switch (method) {
        case "newton":
            let step = (args.max - args.min) / 1000;
            while (Math.abs(err) > args.precision) {
                let ss = "";
                for (let z=0; z<loops; z++) {
                    ss += " ";
                }
                // Find local derivative at guess
                const xp = guess + step;
                const xm = guess - step;
                const yp = evalWithContext(args.expression.replace(re, xp));
                const ym = evalWithContext(args.expression.replace(re, xm));
                const derivative = (yp - ym) / (2 * step);
                // Find intersection of tangent line
                if (derivative != 0) {
                    guess -= err / derivative;
                } else {
                    console.log('FindRoot: local minimum found, try a different initial guess.', args);
                    break;
                }
                // Check new guess
                err = evalWithContext(args.expression.replace(re, guess));
                // Escape if function does not converge in time
                loops++;
                if (loops > maxloops) {
                    console.log(`FindRoot exceeding max loops for arguments: ${args}`);
                    break;
                }
            }
            break;
        case "bisect":
            let low = args.min;
            let high = args.max;
            while (Math.abs(err) > args.precision) {
                const ylow = evalWithContext(args.expression.replace(re, low));
                const yhigh = evalWithContext(args.expression.replace(re, high));
                if (Math.abs(ylow) < Math.abs(yhigh)) {
                    guess = low;
                    err = ylow;
                    high -= ((low + high) / 2 - low);
                } else {
                    guess = high;
                    err = yhigh;
                    low += ((low + high) / 2 - low)
                }

                loops++;
                if (loops > maxloops) {
                    console.log(`FindRoot exceeding max loops for arguments: ${args}`);
                    break;
                }
            }
            break;
    }
    return guess;
}

/**
 * TODO: use Jacobian to find optimal solution
 */
export function FindRootMulti(expressions, variables, maxloops = 100) {
    for (let expression of expressions) {
        expression.err = expression.precision + 1; // Arbitrary number greater than 0 to initialize
    }
    for (let variable of variables) {
        variable.guess = variable.guess ? variable.guess : (variable.min + variable.max) / 2;
        variable.step = Math.min(variable.max - variable.guess, variable.guess - variable.min);
        variable.re = new RegExp(variable.symbol, "g");
    }
    let loops = 0;

    let systemvalid = false;
    while (!systemvalid) {
        loops++;
        // Assume true
        systemvalid = true;
        // Check each equation
        for (let expression of expressions) {
            let eqn = expression.equation;
            for (let variable of variables) {
                eqn = eqn.replace(variable.re, variable.guess);
            }
            // Evaluate expression
            expression.err = Math.abs(evalWithContext(eqn)); // 0 err is perfect accuracy

            expression.valid = expression.err <= expression.precision;
            systemvalid = systemvalid && expression.valid;
        }
        if (loops > maxloops) {
            console.log(`FindRootMulti exceeding max loops (${maxloops}) for arguments: (${expressions}, ${variables})`);
            break;
        }
    }

    return variables;
}

/**
    Generates a string of random digits
    @param {int} digits Number of digits in ID
    @return {string} A string of random digits
*/
export function randomID(digits=16) {
    let str = ""
    // Math.random() generates a 17 digit number between 0 and 1
    while (digits > 17) {
        str += String(Math.random()*10**17);
        digits -= 17;
    }
    str += String(Math.round(Math.random()*10**digits));
    while (str.length < digits) {
        str = "0" + str;
    }
    return str;
}

/**
    Determines whether or not an object is iterable
    @param {object} Object to test for iterability
    @return {boolean} True or False
*/
export function isIterable(obj) {
    if (obj == null) {
        return false;
    }
    return typeof obj[Symbol.iterator] === 'export function';
}

/**
    Performs a replacement on all strings contained in an object
    @param {object} obj Object to replace in
    @param {string} pattern String to find
    @param {string} replacement String to insert
    @return {object} Post-replacement object
*/
export function recursiveReplace(obj, pattern, replacement) {
    if (typeof(obj) === "string") {
        while (obj.indexOf(pattern) != -1) {
            obj = obj.replace(pattern, replacement);
        }
    } else if (typeof(obj) === "object"){
        for (let child of Object.keys(obj)) {
            obj[child] = recursiveReplace(obj[child], pattern, replacement);
        }
    }
    return obj;
}

/**
    Recursively converts all number-like strings in an object into numbers
    @param {object} obj Object to numberfy
    @return {object} Post-conversion object
*/
export function recursiveNumberfy(obj) {
    if (typeof(obj) === "string" && !isNaN(obj)) {
        obj = parseFloat(obj);
    } else if (typeof(obj) === "object"){
        for (let child of Object.keys(obj)) {
            obj[child] = recursiveNumberfy(obj[child]);
        }
    }
    return obj;
}

/**
    Tests if a pattern exists on any string contained in an object
    @param {object} obj Object to replace in
    @param {string} pattern String to find
    @return {boolean} True or false
*/
export function recursiveExists(obj, pattern) {

    if (typeof(obj) === "string") {
        while (obj.indexOf(pattern) != -1) {
            return true;
        }
    } else if (typeof(obj) === "object"){
        for (let child of Object.keys(obj)) {
            if (recursiveExists(obj[child], pattern)) {
                return true;
            }
        }
    }
    return false;
}

/**
    Attempts to find a pattern in any string contained in an object
    @param {object} obj Object to replace in
    @param {string} pattern String to find
    @return {list} List of strings containing specified string inside object somewhere
*/
export function recursiveFind(obj, pattern) {
    let findlist = [];
    if (typeof(obj) === "string") {
        while (obj.indexOf(pattern) != -1) {
            return obj;
        }
    } else if (typeof(obj) === "object"){
        for (let child of Object.keys(obj)) {
            let f = recursiveFind(obj[child], pattern);
            if (f) {
                if (Array.isArray(f)) {
                    for (let i of f) {
                        findlist.push(i);
                    }
                } else {
                    findlist.push(f);
                }
            }
        }
    }
    return findlist;
}


/**
    Generate hash from string <br>
    Bad, need to redo
*/
String.prototype.hashCode = function() {
    let hash = 0;
    if (this.length > 0) {
        for (let i = 0; i < this.length; i++) {
            const char = this.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
    }
    return hash;
}

/**
    Returns true if x is between a and b
    @param {num} x Test number
    @param {num} a First boundary
    @param {num} b Second boundary
    @param {boolean} [inclusive=true] Include boundaries
    @return {boolean} True or false
*/
export function isBetween(x, a, b, inclusive = true) {
    if (inclusive) {
        return (a <= x && x <= b) || (a >= x && x >= b)
    } else {
        return (a < x && x < b) || (a > x && x > b)
    }
}

/**
    Returns x if between a and b, otherwise whichever boundary is closer
    @param {float} x Test number
    @param {float} a First boundary
    @param {float} b Second boundary
    @return {float} A number between a and b
*/
export function constrain(x, a, b) {
    const min = Math.min(a, b);
    const max = Math.max(a, b);
    return Math.max(Math.min(x, max), min);
}

/**
    Generates a object of variable values from a object of parameters. Example:<br>
    {"constants": {"x": 1, "y": 2},<br>
    "random": {"z": {"min": -3, "max": 3, "digits": 1}},<br>
    "calculated": {"sum": "@x@+@y@", "f": "myexport function(@z@)"}}<br>
    @param {object} variables
    @param {object} variables.constants Constant values
    @param {object} variables.random Linear random variables
    @param {num} variables.random.min Minimum value
    @param {num} variables.random.max Maximum value
    @param {num} variables.random.digits Digits of precision
    @param {object} variables.calculated Variables calculated from other variables, referenced by surrounding in @ symbols
    @return {object} Objectionary of variable names and values
*/
export function generateVariables(variables) {
    let variablevalues = {};
    // Assign constants
    for (let name of Object.keys(variables.constants)) {
        variablevalues[name] = variables.constants[name];
    }
    // Generate and assign random variables
    for (let name of Object.keys(variables.random)) {
        let low = variables.random[name].min;
        let high = variables.random[name].max;
        let digits = variables.random[name].digits;
        let r = getRandom(low, high);
        variablevalues[name] = roundTo(r, digits);
    }
    // Assign calculated variables
    for (let name of Object.keys(variables.calculated)) {
        // Construct expression, fill in variable values
        let exp = variables.calculated[name];
        // Keep replacing until no variables remain
        let maxloops = 10;
        let loops = 0;
        while (exp.indexOf(`${VAR}`) != -1 && loops < maxloops) {
            for (let variable of Object.keys(variablevalues)) {
                exp = exp.replace(`${VAR}${variable}${VAR}`, variablevalues[variable]);
            }
            loops++;
        }
        if (loops >= maxloops) {
            console.log("Error, maximum loops exceeded, cannot resolve", name, "=", exp);
        }
        // Evaluate expression (trusted code provided by the question-creator)
        //console.log("Evaluating",exp);
        variablevalues[name] = evalWithContext(exp);
    }
    // Numberfy strings
    for (let name of Object.keys(variables.calculated)) {
        if (typeof(variablevalues[name]) === "string" && !isNaN(variablevalues[name])) {
            variablevalues[name] = parseFloat(variablevalues[name]);
        }
    }
    return variablevalues;
}

/**
    Creates a new cookie for this page
    @param {string} cname Name of the cookie
    @param {string} cvalue Value of the cookie
    @param {int} milliseconds Lifespan of cookie in ms
*/
export function setCookie(cname, cvalue, milliseconds) {
    var d = new Date();
    d.setTime(d.getTime() + milliseconds);
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

/**
    Retrieves a cookie for this page
    @param {string} cname Name of the cookie
*/
export function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return undefined;
}

/**
    Example export function for creating/checking a cookie
*/
export function checkCookie() {
    var user=getCookie("username");
    if (user != "") {
        alert("Welcome again " + user);
    } else {
       user = prompt("Please enter your name:","");
       if (user != "" && user != null) {
           setCookie("username", user, 5*1000);
       }
    }
}

/**
 * Calculates theta
 * @param {number} x1  Base point
 * @param {number} y1  Base point
 * @param {number} x2  Target point
 * @param {number} y2  Target point
 * @return {float}  Angle between base and target point
 */
export function getAngle(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    let theta = Math.atan(dy / dx);
    if (dx < 0) {
        theta += Math.PI;
    }
    if (theta < 0) {
        theta += 2 * Math.PI;
    } else if (theta > 2 * Math.PI) {
        theta -= 2 * Math.PI;
    }
    return theta;
}

export function evalWithContext(code) {
// Really need to redo this
    var Antoine = ChemFunction.Antoine;
    var InvAntoine = ChemFunction.InvAntoine;
    var BubblePoint = ChemFunction.BubblePoint;
    var DewPoint = ChemFunction.DewPoint;
    return eval(code);
}
