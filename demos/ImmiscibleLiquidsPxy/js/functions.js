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
    push();
    strokeWeight(2);
    if (pressure >= g.Pw + g.Pb) { // 2 liq phases
        g.vap = 0;

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
            g.yb = secantMethod(ybHelper, .61, 1);

            stroke(g.orange);
            graph.dashedLine([g.yb, pressure], [g.x_b, pressure], [10, 10]);
            graph.dashedLine([1, 0], [1, pressure], [10, 10]);

            stroke(g.green);
            graph.dashedLine([1, pressure], [g.x_b, pressure], [10, 10]);
            graph.dashedLine([g.yb, 0], [g.yb, pressure], [10, 10]);
        }
        else {
            g.yb = secantMethod(ybHelper, 0, .6);
            console.log(g.yb);
        }
    }
    else { // vapour only
        g.vap = 1;
        g.yb = g.x_b;

    }
    pop();


    push();
    noStroke(); fill('black');
    let pt = graph.mapPoint(g.x_b, pressure)
    circle(...pt, 8);
    pop();
}

function drawPiston() {
    push();
    noStroke();
    translate(250, 0, 0);
    ambientLight(25);
    directionalLight(255, 255, 255, 0, 0, -1);

    let s = 1 - g.pistonHeight / g.pistonHeightMax;
    // Piston arm
    push();
    translate(0, s * 80 - 100, 0);
    fill(100, 100, 100);
    cylinder(10, s * 160 + 50, 24, 1);

    translate(0, s * 80 + 20, 0);
    cylinder(28, 18, 24, 1);
    pop();

    // outline needs to be drawn last
    push();
    fill(255, 255, 255, 100);
    cylinder(30, 200, 24, 1, false, true);
    pop();

    pop();
}

