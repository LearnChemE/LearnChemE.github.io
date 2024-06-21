window.g = {
    cnv: undefined,

    temp: 350,
    mr: .2,

    exo: true,
    deltaH: -83680, // J/(L pure A)
    Cp: 209, // J/(L K)
    k0: 1e5,
    Tm: 298,


    energyBalEqn: [0, 0],
}

function setup() {
    g.cnv = createCanvas(700, 420);
    g.cnv.parent("graphics-wrapper");
    graph.setBounds(700, 420);
    graph.setLabelRanges([300, 550], [0, 1]);


}

const graph = new P5_Graph({
    classList: [""],
    title: "A ⇌ B",
    titleFontSize: 20,
    padding: [
        [60, 20],
        [30, 50],
    ],
    parent: document.getElementById("graph-container"),
    xLabelPrecision: 0,
    yLabelPrecision: 1,
    xTitle: 'temperature (K)',
    yTitle: 'conversion',
})


function draw() {
    graph.on_draw();
    graph.drawLine(nrgBal(), 'blue');
    graph.drawFunction(eqmCurve, 'black', 50);

    drawArrowsAndLabels();

    push();
    fill('black'); noStroke();
    let pt = graph.mapPoint(450, 0);
    circle(pt[0], pt[1], 5);
    pop();
}

function nrgBal() {
    let k = (1 + g.mr) * g.Cp / g.deltaH;
    return [k * g.temp, -k];
}

function eqmCurve(T) {
    let k = g.k0 * Math.exp((g.deltaH / 8.314) * (1 / g.Tm - 1 / T));
    return k / (1 + k);
}

function eqmHelper(T) {
    let nrgBalEqn = nrgBal();
    let nrgBalXa = nrgBalEqn[0] + nrgBalEqn[1] * T;
    return nrgBalXa - eqmCurve(T);
}

function secantMethod(func, x1 = 300, x2 = 500, tol = .01) {
    let x0, n = 0, c;

    if (func(x1) * func(x2) < 0) {
        do {
            x0 = (x1 * func(x2) - x2 * func(x1)) / (func(x2) - func(x1));
            c = func(x1) * func(x0);
            x1 = x2;
            x2 = x0;
            n++;

            if (c == 0) break;
            xm = (x1 * func(x2) - x2 * func(x1)) / (func(x2) - func(x1));
        } while (Math.abs(xm - x0) >= tol);
    }

    return x0;
}

const tempElement = document.getElementById("temperature-slider");
const tempLabel = document.getElementById("temp-label");

const molElement = document.getElementById("molar-slider");
const molLabel = document.getElementById("molar-label");

const form = document.getElementById("myForm");

tempElement.addEventListener("input", function () {
    let tmp = Number(tempElement.value);
    g.temp = tmp;
    tempLabel.innerHTML = `${tmp}`
})

molElement.addEventListener("input", function () {
    let tmp = Number(molElement.value);
    g.mr = tmp;
    molLabel.innerHTML = `${tmp.toFixed(2)}`
})

function drawArrowsAndLabels() {
    options = {
        color: 'black',
        arrowSize: 15,
        dashed: true,
    }

    let eqTemp = secantMethod(eqmHelper);
    let eqConv = eqmCurve(eqTemp);

    graph.drawArrow([eqTemp, eqConv], [eqTemp, 0], options);
    graph.drawArrow([eqTemp, eqConv], [graph.xRange[0], eqConv], options);

    eqPt = graph.mapPoint(eqTemp, eqConv);

    let nrgT, nrgEq = nrgBal();
    if (g.exo) nrgT = 500;
    else nrgT = 380;

    let nrgM = nrgEq[0] + nrgEq[1] * nrgT;
    let nrgRef = graph.mapPoint(nrgT, nrgM);

    push();
    noStroke(); fill('black');
    circle(eqPt[0], eqPt[1], 10);
    pop();

    push();
    stroke('black'); strokeWeight(2);
    fill(250);

    rect(280, 40, 106, 52); // eqm conv
    rect(eqPt[0] - 50, graph.by - 56, 100, 30); // Te
    rect(graph.lx + 30, eqPt[1] - 15, 86, 30);
    rect(nrgRef[0] - 37, nrgRef[1] - 22, 73, 45);

    noStroke(); fill('black');
    textSize(20); textAlign(CENTER, CENTER);
    text('equilibrium\nconversion', 333, 66);
    text('T  = ' + eqTemp.toFixed(0) + ' K', eqPt[0], graph.by - 40);
    text('X  = ' + eqConv.toFixed(2), graph.lx + 73, eqPt[1] + 2);

    push();
    fill('blue'); textSize(18)
    text('energy\nbalance', nrgRef[0], nrgRef[1]);
    pop();

    textSize(14);
    text('e', eqPt[0] - 32, graph.by - 34);
    text('e', graph.lx + 50, eqPt[1] + 7);
    pop();
}

$(() => {
    // Update the constants of the graph based on which reaction button is clicked
    $("#exothermic-btn").click(() => {
        g.deltaH = -83680;
        g.Cp = 209;
        g.k0 = 1e5;
        g.Tm = 298;
        g.exo = true;

        graph.xRange = [300, 550];

        g.temp = 350;
        tempLabel.innerHTML = `350`;

        form.reset();

        // Change Min and Max of the slider
        $("#temperature-slider").attr({
            min: 300,
            max: 400,
            value: 350,
        });
        // toggleGraph();
    });
    $("#endothermic-btn").click(() => {
        g.deltaH = 65000;
        g.Cp = 175;
        g.k0 = 10;
        g.Tm = 398;
        g.exo = false;

        graph.xRange = [250, 500];

        g.temp = 475;
        tempLabel.innerHTML = `475`;

        // Change Min and Max of the slider
        form.reset();
        $("#temperature-slider").attr({
            min: 400,
            max: 500,
            value: 475,
        });
        // toggleGraph();
    });

    // Labels for lines on the graph
    const energyBalanceLabel = $("<text>energy balance</text>");
    energyBalanceLabel.css({
        x: 55,
        y: 85,
        color: "blue",
    });
    $("#equilibrium-conversion-from-ke-curve").append(energyBalanceLabel);
});