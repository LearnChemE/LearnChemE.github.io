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
            y = [0, 14];
            break;
        case SELF_INHIBITED:
            x = [0, 2];
            break;
    }
    graph.setLabelRanges(x, y);
    return;
}

function drawFunctions() {
    if (g.plotType == LINE_BURKE) {
        let lineEqn = new Array(2), zeroEqn = new Array(2);
        switch (g.mechType) {
            case SELF_INHIBITED:
                break;
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
}