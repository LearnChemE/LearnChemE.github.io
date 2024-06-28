function drawExtraGraphLabels() {
    push();
    textSize(22); fill(g.orange);
    text('benzene', 175, 30);
    fill('black');
    text('+', 270, 30);
    fill(g.blue);
    text('water', 295, 30);

    textAlign(CENTER, CENTER);
    textSize(20); fill(g.orange);
    text('X  = 0', graph.lx, graph.by + 60);
    text('X  = 1', graph.rx, graph.by + 35);

    fill(g.blue);
    text('X  = 0', graph.rx, graph.by + 60);
    text('X  = 1', graph.lx, graph.by + 35);

    textSize(14);
    text('w', graph.rx - 8, graph.by + 67);
    text('w', graph.lx - 8, graph.by + 42);
    fill(g.orange);
    text('b', graph.lx - 8, graph.by + 67);
    text('b', graph.rx - 8, graph.by + 42);
    pop();
}

function drawEqm() {
    g.Pb = 10 ** (BENZ_ANT_A - BENZ_ANT_B / (g.temp + 273.15 + BENZ_ANT_C));
    g.Pw = 10 ** (WATER_ANT_A - WATER_ANT_B / (g.temp + 273.15 + WATER_ANT_C));

    graph.drawLine(liqLine());
    graph.drawFunction(eqmCurve, 'black');

    let pressure = getPressure();
    let tripleGuess = map(g.temp, 105, 125, .68, .62);
    push();
    strokeWeight(2);
    if (pressure >= g.Pw + g.Pb) { // 2 liq phases
        g.yb = tripleGuess;

        stroke(g.orange);
        graph.dashedLine([0, pressure], [g.x_b, pressure], [10, 10]);
        graph.dashedLine([1, 0], [1, pressure], [10, 10]);

        stroke(g.blue);
        graph.dashedLine([1, pressure], [g.x_b, pressure], [10, 10]);
        graph.dashedLine([0, 0], [0, pressure], [10, 10]);
    }
    else if (pressure >= eqmCurve(g.x_b)) { // 1 liq 1 vap phase
        function ybHelper(y) { return eqmCurve(y) - pressure };

        if (g.x_b == .85) {
            if ((g.yb = secantMethod(ybHelper, map(g.temp, 105, 125, .68, .62), 1)) == undefined) g.yb = tripleGuess;

            g.vap = .15 / (1 - g.yb);

            stroke(g.orange);
            graph.dashedLine([g.yb, pressure], [g.x_b, pressure], [10, 10]);
            graph.dashedLine([1, 0], [1, pressure], [10, 10]);

            stroke(g.green);
            graph.dashedLine([1, pressure], [g.x_b, pressure], [10, 10]);
            graph.dashedLine([g.yb, 1], [g.yb, pressure], [10, 10]);
            graph.drawArrow([g.yb, .4], [g.yb, 0], { color: g.green, arrowSize: 10 });

        }
        else {
            tripleGuess -= .01;
            if ((g.yb = secantMethod(ybHelper, 0, tripleGuess)) == undefined) g.yb = tripleGuess;

            g.vap = g.x_b / g.yb;

            stroke(g.blue);
            graph.dashedLine([g.yb, pressure], [g.x_b, pressure], [10, 10]);
            graph.dashedLine([0, 0], [0, pressure], [10, 10]);

            stroke(g.green);
            graph.dashedLine([0, pressure], [g.x_b, pressure], [10, 10]);
            graph.dashedLine([g.yb, 1], [g.yb, pressure], [10, 10]);
            graph.drawArrow([g.yb, .4], [g.yb, 0], { color: g.green, arrowSize: 10 });
        }
    }
    else { // vapour only
        g.vap = 1;
        g.yb = g.x_b;

        stroke(g.green);
        graph.dashedLine([g.yb, 1], [g.yb, pressure], [10, 10]);
        graph.drawArrow([g.yb, .4], [g.yb, 0], { color: g.green, arrowSize: 10 });
    }
    pop();

}

function drawPiston() {
    push();
    noStroke();
    translate(250, 0, 0);
    ambientLight(25);
    directionalLight(255, 255, 255, 0, 0, -1);

    const PIST_BASE = 100;
    let s = 1 - g.pistonHeight / g.pistonHeightMax;
    let pistCiel = (s * 180 - 75);
    let x;
    if (g.x_b != .85)
        x = g.x_b - g.vap * (g.x_b + g.yb);
    else
        x = g.x_b - g.vap * (g.x_b + g.yb);
    if (x < 0) x = 0;
    let liq = 1 - g.vap;

    let liqHeight = liq / (liq + 10 * g.vap) * (PIST_BASE - pistCiel);
    let waterHeight = liqHeight * (1 - x);
    let benzHeight = liqHeight - waterHeight;
    let vapHeight = PIST_BASE - pistCiel - liqHeight;

    // Piston arm
    push();
    translate(0, s * 90 - 100, 0);
    fill(100, 100, 100);
    cylinder(10, s * 180 + 48, 24, 1);
    pop();

    push();
    translate(0, pistCiel - 10, 0);
    cylinder(28, 20, 24, 1);
    pop();

    push();
    translate(0, 100, 0);
    ambientLight(100);


    if (waterHeight > 0) {
        push();
        translate(0, -waterHeight / 2, 0);
        fill(g.blue);
        cylinder(28, waterHeight);
        pop();
    }
    if (benzHeight > 0) {
        push();
        fill(g.orange);
        translate(0, -waterHeight - benzHeight / 2, 0);
        cylinder(28, benzHeight);
        pop();
    }
    if (vapHeight > 0) {
        push();
        fill(0, 200, 0, 150);
        translate(0, -waterHeight - benzHeight - vapHeight / 2, 0);
        cylinder(28, vapHeight);
        pop();
    }

    pop();

    // outline needs to be drawn last
    push();
    fill(255, 255, 255, 100);
    cylinder(30, 200, 24, 1, false, true);
    pop();

    // rims
    push();
    translate(0, -100);
    noFill(); stroke(100, 100, 100); strokeWeight(2);
    cylinder(31, 0, 24, 1);
    translate(0, 200);
    fill(100, 100, 100);
    cylinder(31, 0);
    pop();

}

function drawBarGraph() {
    barGraph.on_draw();

    push();
    translate(660, 20, 1)
    fill('black'); textSize(20); textAlign(CENTER, CENTER);
    text('moles of each phase', 0, 0);
    pop();
}

function ybLabel() {
    let u = map(g.yb, 0, 1, graph.lx, graph.rx);
    push();

    stroke('black'); strokeWeight(2); fill(250);
    rect(u - 40, graph.by - 50, 80, 28);

    noStroke(); fill('black');
    textAlign(CENTER, CENTER); textSize(18);
    text('y  = ' + g.yb.toFixed(2), u, graph.by - 40);
    textSize(14);
    text('b', u - 20, graph.by - 32);

    pop();
}