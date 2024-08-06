const HYDRAULIC_DIAMETER_ANNULAR = .00318; // m
const ANNULAR_CROSS_SECTION_AREA = 3.966e-5; // m^2
const INNER_TUBE_DIAMETER = .00457; // m
const OUTER_TUBE_DIAMETER = .00635; // m
const ANNULAR_DIAMETER = .00953; // m
const DYNAMIC_VISCOSITY_H = 5.5e-7; // m^2 / s
const DYNAMIC_VISCOSITY_C = 9e-5; // m^2 / s
const PR_COLD = 6.62; // kJ / kg / K
const PR_HOT = 3.42; // kJ / kg / K
const TUBE_LENGTH = .137 // m
const CONDUCTIVITY_COLD_WATER = .5984 // W / m / K
const CONDUCTIVITY_HOT_WATER = .6435 // W / m / K
const HEX_AREA = 109 // cm2

/* ********************************************************************* */
/* ** This file holds calculations for heat transfer and outlet temps ** */
/* ********************************************************************* */

// Randomize start values
function randStartVals() {
    g.Th_in = random(MIN_HOT_WATER_TEMP, MAX_HOT_WATER_TEMP);
    g.mDotH = random(MIN_HOT_FLOWRATE, MAX_HOT_FLOWRATE);
    g.Tc_in = random(MIN_COLD_WATER_TEMP, MAX_COLD_WATER_TEMP);
    g.mDotC = random(MIN_COLD_FLOWRATE, MAX_COLD_FLOWRATE);
}

// Finds effectiveness of heat exchanger for calculating amount of heat transferred
function effectiveness(cmin, cmax, UA) {
    let C = cmin / cmax;
    let NTU = UA / cmin;

    if (g.hexType == DOUBLE_TUBE) {
        if (C == 1) return NTU / (1 + NTU); // This is the limit so it doesnt become NaN
        else return (1 - Math.exp(-NTU * (1 - C))) / (1 - C * Math.exp(-NTU * (1 - C)));
    }
    else {
        let eterm = (1 + Math.exp(-NTU * Math.sqrt(1 + C ** 2))) / (1 - C * Math.exp(-NTU * Math.sqrt(1 + C ** 2)));
        return 2 / (1 + C + Math.sqrt(1 + C ** 2) * eterm);
    }
}

// Main calculations, calculates heat transferred and outlet temps
function heatTransferRate() {
    let cmin = g.cpH * g.mDotH;
    let cmax = g.cpC * g.mDotC;

    h_annular = calcAnnularHValue();
    h_tube = calcTubeHValue();
    Uo = 1 / (OUTER_TUBE_DIAMETER ** 2 / INNER_TUBE_DIAMETER ** 2 / h_annular + 1 / h_tube);
    UA = Uo * HEX_AREA / 10000;

    if (cmin > cmax) { // Swap if need be
        let tmp = cmin;
        cmin = cmax;
        cmax = tmp;
    }

    let epsilon = effectiveness(cmin, cmax, UA);
    let QdotMax = cmin * (g.Th_in - g.Tc_in);
    let Qdot = epsilon * QdotMax;

    g.Th_out = g.Th_in - Qdot / g.cpH / g.mDotH;
    g.Tc_out = g.Tc_in + Qdot / g.cpC / g.mDotC;

    // console.log(`Th out = ${g.Th_out}\nTc out = ${g.Tc_out}`); // Use this to debug true outlet values
}

// returns tube-side heat transfer coefficient
function calcTubeHValue() {
    let Re = calcTubeReynolds();

    if (Re > 2100) { // Transitional flow
        let f = (1.58 * Math.log(Re) - 3.28) ** -2
        Nu = f / 2 * (Re - 1000) * PR_HOT / (1 + 12.7 * (f / 2) ** .5 * (PR_HOT ** (2 / 3) - 1)) * (1 + (INNER_TUBE_DIAMETER / TUBE_LENGTH) ** (2 / 3));
    }
    else {
        // Laminar Regime
        let Gr = calcTubeGrashoff();
        Nu = 1.86 * (Re * PR_HOT * INNER_TUBE_DIAMETER / TUBE_LENGTH) ** (1 / 3) * (.87 * (1 + .015 * Gr ** (1 / 3)));
    }

    return Nu * CONDUCTIVITY_HOT_WATER / INNER_TUBE_DIAMETER;
}

// returns tube-side reynolds number
function calcTubeReynolds() {
    let u = g.mDotH * 4 / Math.PI / INNER_TUBE_DIAMETER ** 2 / 1000000;
    return u * INNER_TUBE_DIAMETER / DYNAMIC_VISCOSITY_H;
}

// returns tube-side grashoff number
function calcTubeGrashoff() {
    var T = g.Th_in;
    var Tc = g.Tc_in;
    return 9.81 * (T - Tc) / (T + Tc) * INNER_TUBE_DIAMETER ** 3 / DYNAMIC_VISCOSITY_H ** 2;
}

// returns annular-side heat transfer coefficient
function calcAnnularHValue() {
    let Gr = calcGrashoffNumber();
    let Re = calcAnnularReynoldsNumber();
    let Nu = 1.02 * Re ** .45 * PR_COLD ** (1 / 3) * (HYDRAULIC_DIAMETER_ANNULAR / TUBE_LENGTH) ** .4 *
        (ANNULAR_DIAMETER / OUTER_TUBE_DIAMETER) ** .8 * Gr ** .05;
    return Nu * CONDUCTIVITY_COLD_WATER / HYDRAULIC_DIAMETER_ANNULAR;
}

// returns annular-side reynolds number
function calcAnnularReynoldsNumber() {
    let u = g.mDotC / ANNULAR_CROSS_SECTION_AREA / 10000; // m / s
    return u * HYDRAULIC_DIAMETER_ANNULAR / DYNAMIC_VISCOSITY_C;
}

// returns annular-side grashoff number
function calcGrashoffNumber() {
    let deltaT = Math.abs(g.Th_in - g.Tc_in) / 2.0;
    let beta = 2.0 / (g.Th_in + g.Th_out + 546.3);
    return 9.81 * beta * deltaT * HYDRAULIC_DIAMETER_ANNULAR ** 3 / DYNAMIC_VISCOSITY_C ** 2
}

// iterate the volumes in the g.vols array based on flowrates
function changeVols() {
    let dV;
    if (g.vols[0] > 0 && g.hIsFlowing) {
        dV = g.mDotH * deltaTime / 1000;
        g.vols[0] -= dV;
        g.vols[1] += dV;
    }
    else if (g.vols[0] <= 0) {
        g.vols[0] = 0.0; g.vols[1] = 1000.0;
        g.hIsFlowing = false;
    }
    if (g.vols[2] > 0 && g.cIsFlowing) {
        dV = g.mDotC * deltaTime / 1000;
        g.vols[2] -= dV;
        g.vols[3] += dV;
    }
    else if (g.vols[2] <= 0) {
        g.vols[2] = 0.0; g.vols[3] = 1000.0;
        g.cIsFlowing = false;
    }
}

const UA_ROOM = 1e-3;
const T_ROOM = 25;
const V_BUFFER = 50; // mL
// Integrates temperatures to find observed temps
function integrateTemps() {
    // if (g.vols[1] == 0 || g.vols[3] == 0) return;
    var dV, vol, dTdV;

    if (g.hIsFlowing) {
        dV = g.mDotH * deltaTime / 1000;
        vol = g.vols[1] + V_BUFFER;
        dTdV = g.cIsFlowing ? g.Th_out : g.Th_in;
        g.Th_out_observed = (g.Th_out_observed * (vol - dV) + dTdV * dV) / vol;
    }

    if (g.cIsFlowing) {
        dV = g.mDotC * deltaTime / 1000;
        vol = g.vols[3] + V_BUFFER;
        dTdV = g.hIsFlowing ? g.Tc_out : g.Tc_in;
        g.Tc_out_observed = (g.Tc_out_observed * (vol - dV) + dTdV * dV) / vol;
    }

    // Q lost to room
    var h = UA_ROOM / g.cpH * deltaTime / 1000;
    g.Th_in += h * (T_ROOM - g.Th_in);
    g.Th_out += h * (T_ROOM - g.Th_out);
    g.Tc_in += h * (T_ROOM - g.Tc_in);
    g.Tc_out += h * (T_ROOM - g.Tc_out);
}