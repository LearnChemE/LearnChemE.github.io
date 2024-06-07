// Curve data
eqVertices = [[0.1, 360], [0.15, 369], [0.2, 379], [0.25, 387], [0.4, 398], [0.55, 400], [0.65, 395], [.7, 387], [0.8, 360]];

function frame() {
    push();
    fill(250);
    stroke('black'); strokeWeight(2);
    rect(g.lx, g.ty, g.w, g.h)
    pop();
}

function drawGraphTicks() {
    // Graph axes ticks \\
    // x-axis
    let ticks, count, xLabels, yLabels, xPos;
    let i;

    xLabels = [0, .2, .4, .6, .8, 1];
    ticks = 5;
    count = 1 / .04 - 1;
    push();
    stroke('black'); strokeWeight(1);
    for (i = 0; i < count; i++) {
        xPos = g.lx + (g.rx - g.lx) / count * i;

        if (i % ticks == 0) {
            line(xPos, g.by, xPos, g.by - 5);
            line(xPos, g.ty, xPos, g.ty + 5);
            push();
            noStroke(); textSize(14);
            if (i == 0) {
                text(xLabels[i / ticks].toFixed(1), xPos, g.by + 16);
            } else {
                text(xLabels[i / ticks].toFixed(1), xPos, g.by + 15);
            }
            pop();
        } else {
            line(xPos, g.by, xPos, g.by - 3);
            line(xPos, g.ty, xPos, g.ty + 3);
        }
    }
    push();
    noStroke(); textSize(14);
    text('1', g.rx, g.by + 15);
    pop();

    yLabels = [360, 400, 420, 440];
    ticks = 5;
    count = 18;

    for (i = 0; i < count; i++) {
        yPos = g.by - (g.by - g.ty) * i / count;

        if (i % ticks == 0) {
            line(g.lx, yPos, g.lx + 5, yPos);
            line(g.rx, yPos, g.rx - 5, yPos);

            push();
            noStroke(); textSize(14);
            text(yLabels[i / ticks].toFixed(0), g.lx - 28, yPos);
            pop();
        }
        else {
            line(g.lx, yPos, g.lx + 3, yPos);
            line(g.rx, yPos, g.rx - 3, yPos);
        }
    }

    pop();

    // Labels
    push();
    noStroke(); textSize(18);
    text('Mole fraction A', (g.rx - g.lx) / 2, g.by + 32);

    push();
    translate(35, (3 * g.by + g.ty) / 4);
    rotate(radians(-90));
    text('Temperature (K)', 0, 0);
    pop();

    textSize(14);
    fill(g.blue);
    text('Pure B', g.lx - 10, g.by + 32);
    fill(g.green);
    text('Pure A', g.rx - 30, g.by + 32);

    pop();
}

function drawEqFunction() {
    push();
    stroke(g.orange); strokeWeight(2); noFill();
    beginShape();
    vertex(134, 380);

    let i, xVert, yVert;
    for (i = 0; i < 6; i++) {
        xVert = map(eqVertices[i][0], 0, 1, g.lx, g.rx);
        yVert = map(eqVertices[i][1], 360, 452, g.by, g.ty);

        vertex(xVert, yVert);
    }
    vertex(xVert, yVert);
    endShape();

    stroke(g.pink);
    beginShape();
    vertex(xVert, yVert);
    for (i = 5; i < eqVertices.length; i++) {
        xVert = map(eqVertices[i][0], 0, 1, g.lx, g.rx);
        yVert = map(eqVertices[i][1], 360, 452, g.by, g.ty);

        vertex(xVert, yVert);
    }
    vertex(512, 380);
    endShape();
    pop();
}