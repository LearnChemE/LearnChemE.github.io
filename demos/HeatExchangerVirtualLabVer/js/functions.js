
function randStartVals() {
    g.Th_in = random(MIN_HOT_WATER_TEMP, MAX_HOT_WATER_TEMP);
    g.mDotH = random(MIN_FLOWRATE, MAX_FLOWRATE);
    g.Tc_in = random(MIN_COLD_WATER_TEMP, MAX_COLD_WATER_TEMP);
    g.mDotC = random(MIN_FLOWRATE, MAX_FLOWRATE);
}

function effectiveness(cmin, cmax) {
    let C = cmin / cmax;
    let NTU = g.UA / cmin;

    if (g.hexType == DOUBLE_TUBE) {
        if (C == 1) return NTU / (1 + NTU); // This is the limit so it doesnt become NaN
        else return (1 - Math.exp(-NTU * (1 - C))) / (1 - C * Math.exp(-NTU * (1 - C)));
    }
    else {
        let eterm = (1 + Math.exp(-NTU * Math.sqrt(1 + C ** 2))) / (1 - C * Math.exp(-NTU * Math.sqrt(1 + C ** 2)));
        return 2 / (1 + C + Math.sqrt(1 + C ** 2) * eterm);
    }
}

function heatTransferRate() {
    let cmin = g.cpH * g.mDotH;
    let cmax = g.cpC * g.mDotC;

    if (cmin > cmax) { // Swap if need be
        let tmp = cmin;
        cmin = cmax;
        cmax = tmp;
    }

    let epsilon = effectiveness(cmin, cmax);
    let QdotMax = cmin * (g.Th_in - g.Tc_in);
    g.Qdot = epsilon * QdotMax;
    g.eU = epsilon * g.UA;

    g.Th_out = g.Th_in - g.Qdot / g.cpH / g.mDotH;
    g.Tc_out = g.Tc_in + g.Qdot / g.cpC / g.mDotC;

    let dT1 = g.Th_in - g.Tc_out;
    let dT2 = g.Th_out - g.Tc_in;
    if (dT1 == dT2)
        g.lmtd = dT1;
    else
        g.lmtd = (dT2 - dT1) / Math.log(dT2 / dT1);
}



function outlineSelectionButtons(n) {
    for (let i = 0; i < 4; i++) {
        if (i == n) {
            tempSelectionBtns[i].classList.remove("btn-outline-success");
            tempSelectionBtns[i].classList.add("btn-success");
        }
        else {
            tempSelectionBtns[i].classList.add("btn-outline-success");
            tempSelectionBtns[i].classList.remove("btn-success");
        }
    }
}

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
function integrateTemps() {
    if (g.vols[1] == 0 || g.vols[3] == 0) return;
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