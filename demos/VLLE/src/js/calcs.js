

function cplA(T) { return 0.3; };
function cplB(T) { return 0.3; };
function cpvA(T) { return 0.3; };
function cpvB(T) { return 0.3; };
function HvA(T) { return 12; };
function HvB(T) { return 12; };
function f1(z) { return 77.3; };
// bottom-left - alpha liquid phase bottom line
function f2(z) { return -179.43*(z**2) + 112.39*z + 59.96; };
// bottom right - beta liquid phase bottom line
function f3(z) { return -506.61*(z**2) + 815.78*z - 251.09; };
// top left- alpha phase bubble point
function f4(z) { return -382.08*(z**3) + 253.87*(z**2) - 113.1*z + 97.252 };
// alpha phase dew point
function f5(z) { return -32.008*(z**2) - 13.96*z + 97.312; };
// beta phase dew point
function f6(z) { return -30*(z**2) + 86.675*z + 36.095; };
// top right- beta phase bubble point
function f7(z) { return 294.89*(z**2) - 451.53*z + 249.41; };

function calcAll() {

};

module.exports = { calcAll };