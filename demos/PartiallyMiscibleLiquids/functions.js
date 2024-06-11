// Curve data
const eqVerticesOrange = [[0.1, 360], [.12, 363.2], [.14, 366.8], [0.161, 371.2], [0.181, 375.3], [.2, 379.1], [.22, 382.4], [0.241, 385.7], [.26, 388.3], [.28, 390.5],
[.3, 392.5], [.342, 395.4], [.361, 396.4], [.38, 397.2], [0.4, 398], [.419, 398.6], [.44, 399.2], [.459, 399.6], [.481, 400], [.5, 400.1]];
const eqVerticesPurp = [[0.5, 400.1], [.52, 400.2], [.54, 400.1], [.58, 399.3], [.6, 398.6], [.62, 397.4], [.64, 395.9], [.66, 393.9], [.68, 391.4], [.7, 388.3],
[.72, 384.3], [.74, 379.6], [.76, 373.8], [.78, 367], [.8, 360]];

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

    yLabels = [360, 380, 400, 420];
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
    let n = eqVerticesOrange.length;
    for (i = 0; i < n; i++) {
        xVert = map(eqVerticesOrange[i][0], 0, 1, g.lx, g.rx);
        yVert = map(eqVerticesOrange[i][1], g.minY, g.maxY, g.by, g.ty);
        vertex(xVert, yVert);
    }
    endShape();

    stroke(g.pink);
    beginShape();
    vertex(xVert, yVert);
    n = eqVerticesPurp.length;
    for (i = 0; i < n; i++) {
        xVert = map(eqVerticesPurp[i][0], 0, 1, g.lx, g.rx);
        yVert = map(eqVerticesPurp[i][1], g.minY, g.maxY, g.by, g.ty);

        vertex(xVert, yVert);
    }
    endShape();
    pop();
}

function drawDot() {
    let T = map(g.temp, g.minY, g.maxY, g.by, g.ty);
    let x = map(g.xa, 0, 1, g.lx, g.rx);

    push();
    noStroke(); fill('black');
    circle(x, T, 7);
    pop();
}

function findPhaseComps() {
    let t = g.temp, thisTemp;
    if (t > 400.1) {
        singlePhaseOverlay();
        return;
    }

    let i, maxIdx;
    let n = eqVerticesOrange.length;
    // Find idx of largest orange line temp lower than current temp 
    for (i = 0; i < n; i++) {
        thisTemp = eqVerticesOrange[i][1];
        if (thisTemp > t) {
            break;
        }
        maxIdx = i;
    }

    xOrng = map(t, eqVerticesOrange[maxIdx][1], eqVerticesOrange[maxIdx + 1][1], eqVerticesOrange[maxIdx][0], eqVerticesOrange[maxIdx + 1][0])

    n = eqVerticesPurp.length;
    // Find idx of largest purple line temp lower than current temp 
    for (i = n - 1; i >= 0; i--) {
        thisTemp = eqVerticesPurp[i][1];
        if (thisTemp > t) {
            break;
        }
        maxIdx = i;
    }

    xPurp = map(t, eqVerticesPurp[maxIdx][1], eqVerticesPurp[maxIdx - 1][1], eqVerticesPurp[maxIdx][0], eqVerticesPurp[maxIdx - 1][0]);

    x = g.xa;
    if (x < xPurp && x > xOrng) {
        phasesOverlay(xOrng, xPurp);
        boxesOverlay(xOrng, xPurp);
    }
    else singlePhaseOverlay();
}

function phasesOverlay(xOrng, xPurp) {
    let x = map(g.xa, 0, 1, g.lx, g.rx), y = map(g.temp, g.minY, g.maxY, g.by, g.ty);
    let x1 = map(xOrng, 0, 1, g.lx, g.rx), x2 = map(xPurp, 0, 1, g.lx, g.rx);

    // Lines and dots
    push();
    noStroke(); fill(g.green);
    circle(x1, y, 8);
    fill(g.blue);
    circle(x2, y, 8);

    stroke(g.green); strokeWeight(2);
    drawingContext.setLineDash([5, 5]);
    line(x1, y, x, y);
    line(x1, g.by, x1, y);

    stroke(g.blue);
    line(x2, y, x, y);
    line(x2, g.by, x2, y);
    pop();

    push();
    stroke('black'); strokeWeight(2);
    rect(x1 - 30, g.by - 40, 60, 24); // left rectangle for label
    rect(x2 - 30, g.by - 40, 60, 24); // right rect

    textAlign(CENTER, CENTER); textSize(14);
    noStroke(); fill('black');
    text('x  = ' + xOrng.toFixed(2), x1, g.by - 26);
    text('x  = ' + xPurp.toFixed(2), x2, g.by - 26);

    textSize(11);
    text('A', x1 - 16, g.by - 22);
    text('β', x1 - 16, g.by - 32);

    text('A', x2 - 16, g.by - 22);
    text('α', x2 - 16, g.by - 32);
    pop();
}

function boxesOverlay(xOrng, xPurp) {
    let midline = (g.maxInputY + g.ty) / 2;
    let x1 = g.lx + 70, x2 = 300, x3 = g.rx - 170;
    let w = 100;
    let hmax = g.maxInputY - g.ty;

    let h1 = hmax * g.xa; h2 = hmax * (1 - g.xa);
    let h3 = map(g.xa, xPurp, xOrng, 0, hmax - 8);

    // Boxes
    push();
    stroke('black'); strokeWeight(2);
    rect(x1, midline - h1 / 2, w, h1);
    rect(x2, midline - h2 / 2, w, h2);


    rect(x3, g.ty + 2, w, h3);
    rect(x3, g.ty + h3 + 8, w, hmax - h3 - 8);

    pop();

    // Labels and text
    push();
    fill('black'); noStroke();
    textSize(24); textAlign(CENTER, CENTER);
    text('+', x2 - 25, midline);
    textSize(36);
    text('→', x3 - 25, midline - 4);
    pop();
    return;
}

function singlePhaseOverlay() {
    let x = map(g.xa, 0, 1, g.lx, g.rx), y = map(g.temp, g.minY, g.maxY, g.by, g.ty);
    push();
    stroke('black'); strokeWeight(2);
    drawingContext.setLineDash([5, 5]);
    line(x, g.by, x, y)
    pop();

    push();
    stroke('black'); strokeWeight(2);
    rect(x - 30, g.by - 40, 60, 24);

    textAlign(CENTER, CENTER); textSize(14);
    noStroke(); fill('black');
    text('x  = ' + g.xa.toFixed(2), x, g.by - 26);

    textSize(11);
    text('A', x - 16, g.by - 22);
    pop();
}