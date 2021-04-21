/**
 * A simple function that takes a String or Number representation of an 
 * integer or float, and returns a Number rounded to the specified number  
 * of decimal places.  This is different from "Number(x).toPrecision(n)" 
 * because it returns a Number rather than a String, and because it accepts 
 * values less than 1.
 * 
 *  Example usage:
 *      const precision = require("./precision.js");
 * 
 *      const number_1 = -21.0538;
 *      console.log( precision( number_1, 3 ) ) // returns -21.054
 *      
 *      const number_2 = 1.32;
 *      console.log( precision( number_2, 0 ) ) // returns 1
 * 
 * @param {number | string} number Number or string representation of a floating-point number.
 * @param {number} precision Number of decimal places to round to, e.g. precision(2.537, 2) returns 2.54.
 * @returns {number}
 */

module.exports = function(number, precision) {

    let parsedNumber = number;
    let parsedPrecision = parseInt(precision);

    if (typeof(number) !== "number") {
        parsedNumber = Number.parseFloat(number);
    }

    if (isNaN(parsedNumber)) {
        throw "NaN passed to precision rounding function."
    }

    if (!isFinite(parsedNumber)) {
        throw "Infinite value passed to precision rounding function."
    }

    if (parsedPrecision === 0) {
        let result = Math.round(parsedNumber);
        if (result === -0) { return 0 } else { return result }
    } else if (parsedPrecision < 0 || isNaN(parsedPrecision) || !isFinite(parsedPrecision)) {
        throw "Invalid precision passed to precision rounding function"
    }

    let noDecimal = Math.round(parsedNumber * Math.pow(10, parsedPrecision)).toFixed(0);
    if (noDecimal[0] === "-") {
        noDecimal = "-000000000000000000000000000000".concat(noDecimal.slice(1, noDecimal.length));
    } else {
        noDecimal = "000000000000000000000000000000".concat(noDecimal);
    }

    const indexOfDecimal = noDecimal.length - parsedPrecision;

    let integerPart = noDecimal.slice(0, indexOfDecimal);
    let decimalPart = noDecimal.slice(indexOfDecimal, noDecimal.length);

    const floatStr = integerPart.concat(".").concat(decimalPart);

    let result = Number(floatStr);
    if (result === -0) { return 0 } else { return result }
}