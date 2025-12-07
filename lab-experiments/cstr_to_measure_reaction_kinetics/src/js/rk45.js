"use strict";
// Adaptive RK45 ODE solver for systems of equations
// --------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.rk45 = rk45;
/**
 * Integrate dy/dt = f(t, y) from t0 to tEnd using adaptive RK45 (Fehlberg). I anticipate this to be horribly inefficient, but benchmark first optimize later.
 * @param f rhs for dyi/dt = f(t, y)
 * @param y0 inital values for y
 * @param t0 initial time
 * @param tEnd final time to end integration
 * @param opts additional options for solver
 * @returns object containing solution { t, y } where y is an array containing each yi array to be matched with t array
 */
function rk45(f, y0, t0, tEnd, opts) {
    if (opts === void 0) { opts = {}; }
    var _a = opts.dt, dt = _a === void 0 ? (tEnd - t0) / 1000 : _a, _b = opts.atol, atol = _b === void 0 ? 1e-6 : _b, _c = opts.rtol, rtol = _c === void 0 ? 1e-3 : _c, _d = opts.dtMin, dtMin = _d === void 0 ? 1e-8 : _d, _e = opts.dtMax, dtMax = _e === void 0 ? Math.abs(tEnd - t0) / 5 : _e, _f = opts.safety, safety = _f === void 0 ? 0.9 : _f;
    // In progress: Use Dormand-Prince?
    // Ai in wikipedia page
    var c2 = 1 / 4, c3 = 3 / 8, c4 = 12 / 13, c5 = 1, c6 = 1 / 2;
    //   Bij in wikipedia page
    var a21 = 1 / 4;
    var a31 = 3 / 32, a32 = 9 / 32;
    var a41 = 1932 / 2197, a42 = -7200 / 2197, a43 = 7296 / 2197;
    var a51 = 439 / 216, a52 = -8, a53 = 3680 / 513, a54 = -845 / 4104;
    var a61 = -8 / 27, a62 = 2, a63 = -3544 / 2565, a64 = 1859 / 4104, a65 = -11 / 40;
    // Ci and Ci hat in wikipedia page
    var b1 = 16 / 135, b3 = 6656 / 12825, b4 = 28561 / 56430, b5 = -9 / 50, b6 = 2 / 55; // 5th order weights
    var b1s = 25 / 216, b3s = 1408 / 2565, b4s = 2197 / 4104, b5s = -1 / 5; // 6th order weights
    var t = t0;
    var y = y0.slice();
    var h = dt;
    var tVals = [t];
    var yVals = [y.slice()];
    var _loop_1 = function () {
        // console.log(`[RK45] h = ${h}`)
        if (h !== h)
            throw new Error("NaN encountered in h");
        if (t + h > tEnd)
            h = tEnd - t;
        // Compute Runge-Kutta stages
        var k1 = f(t, y.slice());
        var k2 = f(t + c2 * h, y.map(function (yi, i) { return yi + h * a21 * k1[i]; }));
        var k3 = f(t + c3 * h, y.map(function (yi, i) { return yi + h * (a31 * k1[i] + a32 * k2[i]); }));
        var k4 = f(t + c4 * h, y.map(function (yi, i) { return yi + h * (a41 * k1[i] + a42 * k2[i] + a43 * k3[i]); }));
        var k5 = f(t + c5 * h, y.map(function (yi, i) { return yi + h * (a51 * k1[i] + a52 * k2[i] + a53 * k3[i] + a54 * k4[i]); }));
        var k6 = f(t + c6 * h, y.map(function (yi, i) { return yi + h * (a61 * k1[i] + a62 * k2[i] + a63 * k3[i] + a64 * k4[i] + a65 * k5[i]); }));
        // 4th and 5th order estimates
        var y4 = y.map(function (yi, i) { return yi + h * (b1s * k1[i] + b3s * k3[i] + b4s * k4[i] + b5s * k5[i]); });
        var y5 = y.map(function (yi, i) { return yi + h * (b1 * k1[i] + b3 * k3[i] + b4 * k4[i] + b5 * k5[i] + b6 * k6[i]); });
        // Error estimate and tolerance check
        var err = Math.sqrt(y.map(function (_, i) { return Math.pow((y5[i] - y4[i]) / (atol + rtol * Math.abs(y[i])), 2); }).reduce(function (a, b) { return a + b; }, 0) / y.length);
        // Accept step if error small enough
        if (err <= 1.0) {
            t += h;
            y = y5;
            tVals.push(t);
            yVals.push(y.slice());
            // console.log(`[RK45] h accepted. New time is ${t}`)
        }
        // Adapt timestep
        var scale = safety * Math.pow(1.0 / Math.max(err, 1e-10), 0.25);
        h = Math.min(dtMax, h * Math.min(4, Math.max(0.1, scale)));
        if (h < dtMin && err > 1.0) {
            throw new Error("Step size underflow — integration failed");
            return "break";
        }
    };
    while (t < tEnd) {
        var state_1 = _loop_1();
        if (state_1 === "break")
            break;
    }
    return { t: tVals, y: yVals };
}
