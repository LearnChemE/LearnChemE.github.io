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

    push();
    translate(0, 0, 1);
    textSize(22);
    if (g.labels) {
        let bubble = map(g.Pb + g.Pw, 0, 7, graph.by, graph.ty);

        fill(250);
        rect(graph.rx - 100, bubble + 3, 88, 43);

        fill('black');
        text('+', graph.lx + 68, graph.ty + 23);
        text('+', graph.lx + 68, bubble + 23);
        text('+', graph.rx - 90, bubble + 43);

        fill(g.blue);
        text('water', graph.lx + 5, graph.ty + 23);
        text('water', graph.lx + 5, bubble + 23);

        fill(g.orange);
        text('benzene', graph.lx + 85, graph.ty + 23);
        text('benzene', graph.rx - 100, bubble + 23);

        fill(g.green);
        text('vapor', graph.rx - 80, graph.by - 8);
        text('vapor', graph.lx + 85, bubble + 23);
        text('vapor', graph.rx - 73, bubble + 43);
    }
    else {
        fill(100, 100, 100);
        text('two immiscible liquids', graph.lx + 5, graph.ty + 23);
        text('vapor', graph.rx - 80, graph.by - 8);
    }
    pop();
}

function drawEqm() {
    g.Pb = 10 ** (BENZ_ANT_A - BENZ_ANT_B / (g.temp + 273.15 + BENZ_ANT_C));
    g.Pw = 10 ** (WATER_ANT_A - WATER_ANT_B / (g.temp + 273.15 + WATER_ANT_C));

    graph.drawLine(liqLine());
    graph.drawFunction(eqmCurve, 'black');

    let pressure = getPressure();
    let tripleGuess = map(g.temp, 105, 125, .685, .61);
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

        if (pressure == g.Pw + g.Pb) {
            stroke(g.green);
            graph.dashedLine([tripleGuess, 1], [tripleGuess, pressure], [10, 10]);
            graph.drawArrow([tripleGuess, .4], [tripleGuess, 0], { color: g.green, arrowSize: 10 });
        }
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
    scale (1.25);

    const PIST_BASE = 100;
    let s = 1 - g.pistonHeight / g.pistonHeightMax;
    let pistCiel = (s * 180 - 75);
    let x;
    if (g.x_b != .85)
        x = (g.x_b - g.yb * g.vap) / (1 - g.vap);
    else
        x = (g.x_b - g.yb * g.vap) / (1 - g.vap);
    if (x < 0 || x != x) x = 0;
    let liq = 1 - g.vap;

    let liqHeight = liq / (liq + 10 * g.vap) * (PIST_BASE - pistCiel);
    let waterHeight = liqHeight * (1 - x);
    let benzHeight = liqHeight - waterHeight;
    let vapHeight = PIST_BASE - pistCiel - liqHeight;

    push();
    fill(100, 100, 100);
    // Piston arm
    rect(-10, -120, 20, s * 180 + 25);
    // Piston Cieling
    rect(-28, pistCiel -20, 56, 20);
    pop();

    push();
    translate(0, 100, 0);

    if (waterHeight > 0) {
        push();
        fill(g.blue);
        // Water
        rect(-28, -waterHeight, 56, waterHeight);
        pop();
    }
    if (benzHeight > 0) {
        push();
        fill(g.orange);
        translate(0, -waterHeight, 0);
        // Benzene
        rect(-28, -benzHeight, 56, benzHeight);
        pop();
    }
    if (vapHeight > 0) {
        push();
        fill(0, 200, 0, 150);
        translate(0, -waterHeight - benzHeight, 0);
        // Vapour
        rect(-28, -vapHeight, 56, vapHeight);
        pop();
    }

    pop();

    // outline 
    push();
    fill(255, 255, 255, 70);
    rect(-30, -100, 60, 200);
    pop();

    // rims
    push();
    translate(0, -100);
    noFill(); stroke(100, 100, 100); strokeWeight(2);
    line(-30, 0, 30, 0);
    translate(0, 200);
    fill(100, 100, 100);
    line(-30, 0, 30, 0);
    pop();

}

function drawBarGraph() {
    barGraph.on_draw();

    push();
    translate(660, 20, 1);
    fill('black'); textSize(20); textAlign(CENTER, CENTER);
    text('moles of each phase', 0, 0);

    translate(0, 410);
    push();
    translate(-70, 0, 0);
    rotate(radians(-60));
    text('water', 0, 0);
    fill(100, 100, 100);
    text('(liquid)', 0, 17);
    pop();

    push();
    translate(-5, 0, 0);
    rotate(radians(-60));
    text('benzene', -5, 0);
    fill(100, 100, 100);
    text('(liquid)', 0, 17);
    pop();

    push();
    translate(50, 0, 0);
    rotate(radians(-60));
    text('vapor', 0, 0);
    pop();

    pop();

    let x;
    if (g.x_b != .85)
        x = (g.x_b - g.yb * g.vap) / (1 - g.vap);
    else
        x = (g.x_b - g.yb * g.vap) / (1 - g.vap);

    let vapHeight = g.vap
    let benzHeight = x * (1 - vapHeight);
    let waterHeight = 1 - vapHeight - benzHeight;

    let blue = barGraph.mapPoint(.6, waterHeight);
    let orange = barGraph.mapPoint(1.6, benzHeight);
    let green = barGraph.mapPoint(2.6, vapHeight)
    let graphHeight = barGraph.by - barGraph.ty;

    push();
    // stroke('black'); strokeWeight(2);

    if (waterHeight > 0) {
        fill(g.blue);
        rect(...blue, 48, waterHeight * graphHeight);
    }

    if (benzHeight > 0) {
        fill(g.orange);
        rect(...orange, 48, benzHeight * graphHeight);
    }

    if (vapHeight > 0) {
        fill(g.green);
        rect(...green, 48, vapHeight * graphHeight);
    }
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