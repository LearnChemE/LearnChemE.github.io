
function randStartVals() {
    g.Th_in = random(30, 45);
    g.mDotH = random(1, 2);
    g.Tc_in = random(0, 20);
    g.mDotC = random(2, 4);
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

// Plot Diff Eq. 
function calcEulersFuncs(graph, x0, y01, y02, n = 1000) {
    let dx = .02;
    let i, dy1dx, dy2dx, xFinal = 1;
    let y1 = new Array(n), y2 = new Array(n), x = new Array(n);
    y1[0] = y01;
    y2[0] = y02;
    x[0] = x0;

    i = 0;
    do {
        i++;
        dy1dx = -g.eU * (y2[i - 1] - y1[i - 1]) / g.cpC / g.mDotC;
        dy2dx = -g.eU * (y2[i - 1] - y1[i - 1]) / g.cpH / g.mDotH;

        x[i] = x[i - 1] + dx;
        y1[i] = y1[i - 1] + dy1dx * dx;
        y2[i] = y2[i - 1] + dy2dx * dx;

    } while (y1[i] > g.Tc_in && i < n)

    xFinal = x[i - 1];
    n = i;

    // Resize x
    for (i = 0; i <= n; i++) {
        x[i] /= xFinal;
    }

    push();
    noFill(); strokeWeight(2);
    push(); stroke(g.orangeFluidColor);
    beginShape();
    for (i = 0; i < n; i++) {
        vertex(...graph.mapPoint(x[i], y2[i]));
    }
    endShape();
    // arrows
    let a = Math.floor(n / 3);
    let b = 2 * a;
    pop();
    push();
    lmtdGraph.drawArrow([x[a], y2[a]], [x[a + 1], y2[a + 1]], { color: g.orangeFluidColor, arrowSize: 15 });
    lmtdGraph.drawArrow([x[b], y2[b]], [x[b + 1], y2[b + 1]], { color: g.orangeFluidColor, arrowSize: 15 });
    pop();

    stroke(g.blueFluidColor);
    beginShape();
    for (i = 0; i < n; i++) {
        vertex(...graph.mapPoint(x[i], y1[i]));
    }
    endShape();
    pop();
    push();

    lmtdGraph.drawArrow([x[a + 1], y1[a + 1]], [x[a], y1[a]], { color: g.blueFluidColor, arrowSize: 15 });
    lmtdGraph.drawArrow([x[b + 1], y1[b + 1]], [x[b], y1[b]], { color: g.blueFluidColor, arrowSize: 15 });
    pop();

    return { x: x, y1: y1, y2: y2 };
}
