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
    let hline = liqLine();
    graph.drawLine(hline);
    graph.drawFunction(eqmCurve);

    push();
    noStroke(); fill('black');
    let pt = graph.mapPoint(g.x_b, getPressure())
    circle(pt[0], pt[1], 8);
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