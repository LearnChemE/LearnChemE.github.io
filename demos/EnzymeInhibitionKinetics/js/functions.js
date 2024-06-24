function findGraphAxesRange() {
    if (g.plotType == MICH_MENT) {
        graph.setLabelRanges([0, 10], [0, 2]);
        return;
    }

    let x = [-3, 3];
    let y = [0, 3];
    switch (g.mechType) {
        case COMPETITIVE:
            break;
        case UNCOMPETITIVE:
            x = [-7, 7];
            break;
        case NONCOMPETITIVE:
            // y = [0, 14];
            break;
        case SELF_INHIBITED:
            x = [0, 2];
            break;
    }
    graph.setLabelRanges(x, y);
    return;
}

function drawFunctions() {
    if (g.plotType == LINE_BURKE && g.mechType != SELF_INHIBITED) {
        let lineEqn = new Array(2), zeroEqn = new Array(2);
        switch (g.mechType) {
            case COMPETITIVE:
                lineEqn[0] = 1 / g.Vmax;
                zeroEqn[0] = lineEqn[0];
                zeroEqn[1] = g.KM / g.Vmax;
                lineEqn[1] = zeroEqn[1] * (1 + g.inhConc / g.KI);
                break;
            case UNCOMPETITIVE:
                zeroEqn[0] = 1 / g.Vmax;
                lineEqn[0] = zeroEqn[0] * (1 + g.inhConc / g.KI);
                zeroEqn[1] = g.KM / g.Vmax;
                lineEqn[1] = zeroEqn[1];
                break;
            case NONCOMPETITIVE:
                zeroEqn[0] = 1 / g.Vmax;
                lineEqn[0] = zeroEqn[0] * (1 + g.inhConc / g.KI);
                zeroEqn[1] = g.KM / g.Vmax;
                lineEqn[1] = zeroEqn[1] * (1 + g.inhConc / g.KI);
        }
        graph.drawLine(zeroEqn, 'black', 3);
        graph.drawLine(lineEqn, 'blue', 0);

        push();
        stroke('black'); strokeWeight(1);
        let zeroPt = graph.mapPoint(0, 0);
        line(...zeroPt, zeroPt[0], graph.ty);

        noStroke(); fill('black');
        circle(...graph.mapPoint(0, lineEqn[0]), 8)
        pop();
    }

    else {
        graph.drawFunction(rate, 'blue', 99);
    }
}

function rate(Cs) {
    switch (g.mechType) {
        case COMPETITIVE:
            return g.Vmax * Cs / (Cs + g.KM * (1 + g.inhConc / g.KI));
        case UNCOMPETITIVE:
            return g.Vmax * Cs / (g.KM + Cs * (1 + g.inhConc / g.KI));
        case NONCOMPETITIVE:
            return g.Vmax * Cs / (Cs + g.KM) / (1 + g.inhConc / g.KI);
        case SELF_INHIBITED:
            if (g.plotType == MICH_MENT)
                return g.Vmax * Cs / (g.KM + Cs + Cs ** 2 / g.KI);
            else {
                invCs = 1 / Cs;
                return g.KM / g.Vmax / invCs + (1 + invCs / g.KI) / g.Vmax;
            }
    }
    return NaN;
}