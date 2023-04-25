// Draws the general graph shape 
function frameDraw() {
    push();
    fill(250);
    rect(75, 50, 600, 400);
    pop();

    // Y-axis label
    push();
    translate(-20, height / 2 + 170);
    rotate(radians(-90));
    push();
    noStroke();
    textSize(18);
    text('compressibility factor', 50, 50)
    textStyle(ITALIC);
    text('Z =', 225, 50);
    textSize(15);
    text('P V', 260, 39);
    text('R T', 260, 60);
    pop();
    strokeWeight(1.5);
    line(257, 43, 290, 43);
    pop();

    // X-axis label
    push();
    noStroke();
    textSize(18);
    text('reduced pressure', width / 2 - 100, g.by + 40);
    textStyle(ITALIC);
    text('P  = P/P', width / 2 + 45, g.by + 40);
    textStyle(NORMAL);
    textSize(15);
    text('r', width / 2 + 57, g.by + 43);
    text('c', width / 2 + 111, g.by + 43);
    pop();

    // X-axis ticks
    let ticks = 5;
    let count = Math.round(5 / .2);
    let xLabel = [0, 1, 2, 3, 4, 5];
    for (let i = 0; i < count + 1; i++) {
        if (i % ticks == 0) {
            line(g.lx + (g.rx - g.lx) / count * (i), g.by, g.lx + (g.rx - g.lx) / count * (i), g.by - 6);
            line(g.lx + (g.rx - g.lx) / count * (i), g.ty, g.lx + (g.rx - g.lx) / count * (i), g.ty + 6);
            push();
            noStroke();
            textSize(17);
            text(xLabel[i / ticks], g.lx + (g.rx - g.lx) / count * i - 5, g.by + 20);
            pop();
        } else {
            line(g.lx + (g.rx - g.lx) / count * (i), g.by, g.lx + (g.rx - g.lx) / count * (i), g.by - 3);
            line(g.lx + (g.rx - g.lx) / count * (i), g.ty, g.lx + (g.rx - g.lx) / count * (i), g.ty + 3);
        }
    }

    // Y-axis ticks
    ticks = 4;
    count = Math.round(1.1 / .05);
    let yLabel = [0.0, 0.2, 0.4, 0.6, 0.8, 1.0];
    for (let i = 0; i < count + 1; i++) {
        if (i % ticks == 0) {
            line(g.lx, g.by - (g.by - g.ty) / count * i, g.lx + 6, g.by - (g.by - g.ty) / count * i);
            line(g.rx, g.by - (g.by - g.ty) / count * i, g.rx - 6, g.by - (g.by - g.ty) / count * i);
            push();
            noStroke();
            textSize(17);
            text(yLabel[i / ticks].toFixed(1), g.lx - 26, g.by - (g.by - g.ty) / count * i + 5);
            pop();
        } else {
            line(g.lx, g.by - (g.by - g.ty) / count * i, g.lx + 3, g.by - (g.by - g.ty) / count * i);
            line(g.rx, g.by - (g.by - g.ty) / count * i, g.rx - 3, g.by - (g.by - g.ty) / count * i);
        }
    }
}

function curveDraw() {

    // Various curves
    for (let i = 0; i < g.vec.length; i++) {
        push();
        noFill();
        strokeWeight(1.5);
        beginShape();
        for (let j = 0; j < g.vec[i].length; j++) {
            vertex(map(g.vec[i][j][0], 0, 5, g.lx, g.rx), map(g.vec[i][j][1], 0, 1.1, g.by, g.ty));
        }
        endShape();
        pop();
    }

    // Ideal gas line
    push();
    strokeWeight(2);
    stroke(0, 150, 0);
    line(g.lx, map(1, 0, 1.1, g.by, g.ty), g.rx, map(1, 0, 1.1, g.by, g.ty));
    noStroke();
    fill(0, 150, 0);
    textSize(18);
    text('ideal gas behavior', 90, 80);
    pop();

    // Tr = 1.0 line
    let i = 0;
    push();
    noFill();
    strokeWeight(1.5);
    beginShape();
    while (Z10[i][0] < .8) {
        vertex(map(Z10[i][0], 0, 5, g.lx, g.rx), map(Z10[i][1], 0, 1.1, g.by, g.ty));
        i++;
    }
    for (let k = i; k < Z10.length; k++) {
        curveVertex(map(Z10[k][0], 0, 5, g.lx, g.rx), map(Z10[k][1], 0, 1.1, g.by, g.ty));
        if (k == Z10.length - 1) {
            curveVertex(map(Z10[k][0], 0, 5, g.lx, g.rx), map(Z10[k][1], 0, 1.1, g.by, g.ty));

        }
    }
    endShape();
    pop();
    push();
    noStroke();
    textSize(18);
    textStyle(ITALIC);
    translate(483, 267);
    rotate(-.34);
    noStroke();
    fill(250);
    rect(-2, -15, 72, 17);
    noStroke();
    fill(0);
    textSize(18);
    textStyle(ITALIC);
    text('T  =', 0, 0)
    textStyle(NORMAL);
    text('1.00', 33, 0);
    textSize(15);
    text('r', 10, 3);
    pop();

    // Tr labels
    for (let i = 0; i < g.vec.length; i++) {
        let x1, x2, y1, y2;
        let L = g.vec[i].length;
        let shift = defineShift();
        for (let j = 0; j < g.vec[i].length; j++) {
            if (j == Math.round(2 * L / 3) && (i == 1 || i == 3 || i == 5 || i == 7)) {
                x1 = map(g.vec[i][j - 5][0], 0, 5, g.lx, g.rx);
                y1 = map(g.vec[i][j - 5][1], 0, 1.1, g.by, g.ty);
                x2 = map(g.vec[i][j + 10][0], 0, 5, g.lx, g.rx);
                y2 = map(g.vec[i][j + 10][1], 0, 1.1, g.by, g.ty);
                let a = Math.abs(y2 - y1);
                let b = Math.abs(x2 - x1);
                push();
                translate(x1 + 20 * i, y1 + shift[i]);
                rotate(-Math.atan(a / b));
                noStroke();
                fill(250);
                rect(-2, -10, 62, 17);
                fill(0);
                textSize(18);
                textStyle(ITALIC);
                text('T  =' + (1.1 + i / 10).toFixed(1), 0, 5);
                textSize(15);
                textStyle(NORMAL);
                text('r', 10, 8)
                pop();
            }
        }
    }
}

function defineShift() {
    let arr;
    switch (g.element) {
        case 'n-hexane':
            arr = [0, 0, 0, 0, -1, -3, -6, -8];
            break;
        case 'carbon-dioxide':
            arr = [0, 0, 0, 0, -1, -3, -6, -8];
            break;
        case 'ethane':
            arr = [0, -1, 0, 0, -1, -3, -5, -6];
            break;
        case 'nitrogen':
            arr = [0, 0, 0, 0, -1, 0, 0, -4];
            break;
        case 'hydrogen':
            arr = [-5, -3, 0, 0, -1, 5, 0, 4];
            break;
    }
    return (arr);
}


// For determining if black dot is in between the curves
function boundaryTest() {
    let temp = g.points[0];

    // Higher test first checking dot is below Tr=1.8
    let Pr = map(temp.x, g.lx, g.rx, 0, 5);
    let Ztest;
    if (g.dragPoint) {
        Ztest = map(mouseY, g.by, g.ty, 0, 1.1);
    } else {
        Ztest = map(g.points[0].y, g.by, g.ty, 0, 1.1);
    }


    let Zhigher = find2D(Pr, g.vec[7]);
    if (Zhigher <= Ztest) {
        g.higherTest = false;
    } else {
        g.higherTest = true;
    }

    let Zlower = find2D(Pr, Z10);
    if (Zlower < Ztest) {
        g.lowerTest = true;
    } else {
        g.lowerTest = false;
    }
}

function currentComp() {
    let temp = g.points[0];
    let Pr = map(temp.x, g.lx, g.rx, 0, 5);
    let Z = map(temp.y, g.by, g.ty, 0, 1.1);
    let x1, y1, x2, y2;

    let zL, zU; // z lower and upper
    if (g.lowerTest && g.higherTest) {
        for (let i = -1; i < g.vec.length - 1; i++) {
            if (i == -1) {
                zL = find2D(Pr, Z10);
                zU = find2D(Pr, g.vec[0]);
                L = Z10.length;
                if (Z <= zU && Z >= zL) {
                    let dz, dc;
                    dz = Z - zL;
                    dc = zU - zL;
                    g.Tr = 1 * (1 - dz / dc) + 1.1 * (dz / dc);
                    push();
                    noFill();
                    strokeWeight(2);
                    stroke(g.blue);
                    beginShape();
                    for (let j = 0; j < Z10.length; j++) {
                        let x = Z10[j][0];
                        let t = find2D(x, g.vec[0]);
                        let y = t * (dz / dc) + Z10[j][1] * (1 - dz / dc);
                        vertex(map(x, 0, 5, g.lx, g.rx), map(y, 0, 1.1, g.by, g.ty));

                    }
                    endShape();
                    pop();
                    for (let j = 0; j < Z10.length; j++) {
                        let x = Z10[j][0];
                        let t = find2D(x, g.vec[0]);
                        let y = t * (dz / dc) + Z10[j][1] * (1 - dz / dc);
                        if (j == Math.round(2 * L / 3) + 2) {
                            x1 = map(x, 0, 5, g.lx, g.rx);
                            y1 = map(y, 0, 1.1, g.by, g.ty);
                            x2 = map(Z10[j + 5][0], 0, 5, g.lx, g.rx);
                            let k = find2D(Z10[j + 5][0], g.vec[0]);
                            y2 = map(k * dz / dc + Z10[j + 5][1] * (1 - dz / dc), 0, 1.1, g.by, g.ty);
                            let a = Math.abs(y2 - y1);
                            let b = Math.abs(x2 - x1);
                            push();
                            translate(x1, y1 + 7);
                            rotate(-Math.atan(a / b));
                            noStroke();
                            fill(250);
                            rect(-2, -15, 72, 17);
                            noStroke();
                            fill(g.blue);
                            textSize(18);
                            textStyle(ITALIC);
                            text('T  =', 0, 0)
                            textStyle(NORMAL);
                            text(g.Tr.toFixed(2), 33, 0);
                            textSize(15);
                            text('r', 10, 3);
                            pop();
                        }
                    }
                }
            } else {
                zL = find2D(Pr, g.vec[i]);
                zU = find2D(Pr, g.vec[i + 1]);
                L = g.vec[i].length;
                if (Z <= zU && Z >= zL) {
                    let dz, dc;
                    dz = Z - zL;
                    dc = zU - zL;
                    g.Tr = (1.1 + i / 10) * (1 - dz / dc) + (1.1 + (i + 1) / 10) * (dz / dc);
                    push();
                    noFill();
                    strokeWeight(2);
                    stroke(g.blue);
                    beginShape();
                    for (let j = 0; j < g.vec[i].length; j++) {
                        let x = g.vec[i][j][0];
                        let y = g.vec[i][j][1] * (1 - dz / dc) + g.vec[i + 1][j][1] * (dz / dc);
                        vertex(map(x, 0, 5, g.lx, g.rx), map(y, 0, 1.1, g.by, g.ty));
                    }
                    endShape();
                    pop();
                    for (let j = 0; j < g.vec[i].length; j++) {
                        let x = g.vec[i][j][0];
                        let y = g.vec[i][j][1] * (1 - dz / dc) + g.vec[i + 1][j][1] * (dz / dc);
                        if (j == Math.round(2 * L / 3)) {
                            x1 = map(x, 0, 5, g.lx, g.rx);
                            y1 = map(y, 0, 1.1, g.by, g.ty);
                            x2 = map(g.vec[i][j + 5][0], 0, 5, g.lx, g.rx);
                            y2 = map(g.vec[i][j + 5][1] * (1 - dz / dc) + g.vec[i + 1][j + 5][1] * (dz / dc), 0, 1.1, g.by, g.ty);
                            let a = Math.abs(y2 - y1);
                            let b = Math.abs(x2 - x1);
                            push();
                            translate(x1, y1 + 7);
                            rotate(-Math.atan(a / b));
                            noStroke();
                            fill(250);
                            rect(-2, -15, 72, 17);
                            noStroke();
                            fill(g.blue);
                            textSize(18);
                            textStyle(ITALIC);
                            text('T  =', 0, 0)
                            textStyle(NORMAL);
                            text(g.Tr.toFixed(2), 33, 0);
                            textSize(15);
                            text('r', 10, 3);
                            pop();
                        }
                    }
                }
            }
        }
    } else if (!g.lowerTest && g.higherTest) {
        push();
        noFill();
        strokeWeight(2);
        stroke(g.blue);
        beginShape();
        for (let i = 0; i < Z10.length; i++) {
            vertex(map(Z10[i][0], 0, 5, g.lx, g.rx), map(Z10[i][1], 0, 1.1, g.by, g.ty));
        }
        endShape();
        pop();
        push();
        translate(483, 267);
        rotate(-.34);
        push();
        noStroke();
        fill(250);
        rect(-2, -15, 72, 17);
        noStroke();
        fill(g.blue);
        textSize(18);
        textStyle(ITALIC);
        text('T  =', 0, 0)
        textStyle(NORMAL);
        text('1.00', 33, 0);
        textSize(15);
        text('r', 10, 3);
        pop();
        pop();
    } else if (g.lowerTest && !g.higherTest) {
        push();
        noFill();
        strokeWeight(2);
        stroke(g.blue);
        beginShape();
        for (let i = 0; i < g.vec[g.vec.length - 1].length; i++) {
            vertex(map(g.vec[g.vec.length - 1][i][0], 0, 5, g.lx, g.rx), map(g.vec[g.vec.length - 1][i][1], 0, 1.1, g.by, g.ty));
        }
        endShape();
        pop();
        let f = translations();
        push();
        translate(f[0], f[1]);
        rotate(f[2]);
        push();
        noStroke();
        fill(250);
        rect(-2, -15, 72, 17);
        noStroke();
        fill(g.blue);
        textSize(18);
        textStyle(ITALIC);
        text('T  =', 0, 0)
        textStyle(NORMAL);
        text('1.80', 33, 0);
        textSize(15);
        text('r', 10, 3);
        pop();
        pop();
    }

}

function translations() {

    let arr;
    switch (g.element) {
        case 'n-hexane':
            arr = [483, 88, -.1];
            break;
        case 'carbon-dioxide':
            arr = [483, 94, -.06];
            break;
        case 'ethane':
            arr = [483, 108, -.04];
            break;
        case 'nitrogen':
            arr = [483, 115, -.03];
            break;
        case 'hydrogen':
            arr = [483, 153, -.017];
            break;
    }
    return (arr);

}

function legs() {
    let temp = g.points[0];
    push();
    stroke(g.blue);
    drawingContext.setLineDash([5, 5]);
    line(temp.x, temp.y, temp.x, g.by);
    line(temp.x, temp.y, g.lx, temp.y);
    pop();

    push();
    fill(250);
    noStroke();
    rect(temp.x - 21, g.by - 45, 67, 18);
    rect(g.lx + 29, temp.y - 9, 61, 18);
    pop();

    push();
    noStroke();
    textSize(16);
    fill(g.blue);
    textStyle(ITALIC);
    text('P  = ', temp.x - 20, g.by - 30);
    text('Z = ', g.lx + 30, temp.y + 6);

    textStyle(NORMAL);
    text(map(temp.x, g.lx, g.rx, 0, 5).toFixed(2), temp.x + 11, g.by - 30);
    text(map(temp.y, g.by, g.ty, 0, 1.1).toFixed(2), g.lx + 57, temp.y + 6);
    textSize(13);
    text('r', temp.x - 8, g.by - 28);
    pop();
}

function defineVecs() {
    g.vec = [];
    switch (g.element) {
        case "n-hexane":
            g.vec.push(xZ11, xZ12, xZ13, xZ14, xZ15, xZ16, xZ17, xZ18);
            break;
        case "carbon-dioxide":
            g.vec.push(cZ11, cZ12, cZ13, cZ14, cZ15, cZ16, cZ17, cZ18);
            break;
        case "ethane":
            g.vec.push(eZ11, eZ12, eZ13, eZ14, eZ15, eZ16, eZ17, eZ18);
            break;
        case "nitrogen":
            g.vec.push(nZ11, nZ12, nZ13, nZ14, nZ15, nZ16, nZ17, nZ18);
            break;
        case "hydrogen":
            g.vec.push(hZ11, hZ12, hZ13, hZ14, hZ15, hZ16, hZ17, hZ18);
            break;
    }
}

function find2D(x, arr) {
    let y;
    for (let i = 0; i < arr.length - 1; i++) {
        if (x >= arr[i][0] && x <= arr[i + 1][0]) {
            y = arr[i][1] + (x - arr[i][0]) * (arr[i + 1][1] - arr[i][1]) / (arr[i + 1][0] - arr[i][0]);
        }
    }
    return (y);
}