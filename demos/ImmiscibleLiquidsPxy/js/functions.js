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