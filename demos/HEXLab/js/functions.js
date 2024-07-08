/* ********************************************* */
/* *************** GRAPHICS ******************** */
/* ********************************************* */

function doubleTubeGraphic(w, h) {
    let lx = 50, rx = 450;
    let ty = 50, by = 350;
    let wHex = rx - lx, hHex = by - ty;

    dt = createGraphics(w, h);

    dt.push();
    dt.stroke('black'); dt.strokeWeight(2);
    dt.rect(lx, ty, wHex, hHex);

    drawArrow(dt, [rx - 50, ty], [rx - 50, ty - 50]);
    drawArrow(dt, [rx - 50, by + 50], [rx - 50, by]);
    drawArrow(dt, [w, ty + 48], [rx, ty + 48]);
    drawArrow(dt, [rx, by - 54], [w, by - 54]);
    dt.pop();

    let hPipe = horizontalPipe(wHex, hHex);

    dt.image(hPipe, lx + 1, ty + 30);
    dt.image(hPipe, lx + 1, ty + 96);
    dt.image(hPipe, lx + 1, ty + 162);
    dt.image(hPipe, lx + 1, ty + 228);

    dt.push();
    dt.fill(g.blueFluidColor); dt.stroke('black');
    dt.strokeWeight(1);
    dt.rect(lx + 40, ty + 66, 20, 31);
    dt.rect(lx + 40, ty + 198, 20, 31);
    dt.rect(rx - 60, ty, 20, 31);

    dt.rect(rx - 60, ty + 132, 20, 31);
    dt.rect(rx - 60, ty + 264, 20, 35);
    dt.pop();

    let cPipe = curvePipe();
    dt.image(cPipe, 0, 86);
    dt.image(cPipe, 0, 218);

    dt.push();
    dt.translate(rx + 51, 242);
    dt.rotate(radians(180));
    dt.image(cPipe, 0, 0);
    dt.pop();

    return dt;
}

function horizontalPipe(wHex, hHex) {
    hPipe = createGraphics(wHex, hHex);
    hPipe.fill(g.orangeFluidColor); hPipe.strokeWeight(2); hPipe.stroke('black');
    hPipe.rect(0, 8, wHex - 2, 20);
    hPipe.fill(g.blueFluidColor);
    hPipe.rect(wHex / 16, 0, wHex * 7 / 8, 36);

    return hPipe;
}

function curvePipe() {
    let cPipe = createGraphics(50, 90);
    cPipe.stroke('black'); cPipe.strokeWeight(2);
    cPipe.noFill();

    cPipe.circle(50, 45, 86);
    cPipe.push();
    cPipe.stroke(g.orangeFluidColor); cPipe.strokeWeight(19);
    cPipe.circle(50, 45, 65);
    cPipe.pop();
    cPipe.circle(50, 45, 47);


    return cPipe;
}

function drawArrow(graphicsObject, tail, head, options = {
    color: 'black',
    arrowSize: 12,
    dashed: false,
}) {
    let temp = { color: 'black', arrowSize: 12, dashed: false, };
    options = { ...temp, ...options };

    let p1 = tail;
    let p2 = head;
    let dir = getDirection(p2, p1);
    let perp = [dir[1], -dir[0]];
    let size = options.arrowSize;

    dt.push();
    dt.stroke(options.color); dt.strokeWeight(2);
    if (options.dashed) drawingContext.setLineDash([8, 5]);

    dt.line(p1[0], p1[1], p2[0], p2[1]);

    dt.noStroke(); dt.fill(options.color);
    dt.triangle(p2[0], p2[1],
        p2[0] + size * (dir[0] + perp[0] / 3), p2[1] + size * (dir[1] + perp[1] / 3),
        p2[0] + size * (dir[0] - perp[0] / 3), p2[1] + size * (dir[1] - perp[1] / 3));

    dt.pop();
}

function shellTubeGraphic(w, h) {
    background(250);
    push();
    rotateY(g.rotX);
    rotateX(-g.rotY);
    ambientLight(100);
    directionalLight(255, 255, 255, -1, -1, -1);

    let bw = 500;
    let bh = 250;
    let bt = 50;
    let pad = 4;

    shellOrangeGraphic(bw, bh, bt, pad);
    shellBlueGraphic(bw, bh, bt, pad);

    shellOuterGraphic(bw, bh, bt, pad);

    pop();

}

function shellOuterGraphic(bw, bh, bt, pad) {
    fill(250, 250, 250, 50);
    box(bw, bh, bt);

    // pipes
    push();
    translate(-bw / 2 + bt / 2, -bh / 2 - 25, 0); noStroke();
    cylinder(12 + pad, 52);
    translate(bt, 0, 0);
    cylinder(12 + pad, 52);
    translate(-bt, bh + 50, 0);
    cylinder(12 + pad, 52);
    pop();
    push();
    translate(bw / 2 - 77, bh / 2 + 25, 0); noStroke();
    cylinder(12 + pad, 52); // bottom right
    pop();
}

function shellOrangeGraphic(bw, bh, bt, pad) {
    push();
    fill(g.orangeFluidColor); noStroke();

    push();

    translate(-bw / 2 + bt / 2, -bh / 4, 0);
    box(bt - pad, bh / 2 - pad, bt - pad);
    translate(0, bh / 2, 0);
    box(bt - pad, bh / 2 - pad, bt - pad);


    translate(0, -bh * 3 / 4 - 25, 0);
    cylinder(12, 50);
    translate(0, bh + 50, 0);
    cylinder(12, 50);
    pop();

    push();
    translate(bw / 2 - bt / 2, 0, 0);
    box(bt - pad, bh - pad, bt - pad);
    pop();

    push();
    translate(0, -100, 0);
    rotateZ(radians(90));

    for (let i = 0; i < 4; i++) {
        cylinder(12, 408);
        translate(bh / 4 + pad, 0, 0);
    }
    pop();

    pop();
}

function shellBlueGraphic(bw, bh, bt, pad) {
    push();
    fill(g.blueFluidColor); noStroke();
    translate(-bw / 2 + 3 * bt / 2, 0, 0);

    // top left box and pipe
    push();
    translate(0, -bh / 8, 0);
    box(bt - pad, bh * 3 / 4 - pad, bt - pad);
    translate(0, -bh / 2 + 6, 0);
    cylinder(12, 50);
    pop();

    // middle boxes
    push();
    // middle connecting boxes
    for (let i = 0; i < 5; i++) {
        translate(bt + 2 * pad, 0, 0);
        box(bt - pad, bh / 2 - pad, bt - pad);
    }
    // bottom right box
    translate(bt + 2 * pad, bh / 8, 0);
    box(bt - pad, bh * 3 / 4 - pad, bt - pad);
    translate(0, bh / 2 - 6, 0);
    cylinder(12, 50);
    pop();

    push();
    translate(bt / 2 + pad, 3 * bh / 8 - pad, 0);
    for (let i = 0; i < 3; i++) {
        box(2 * bt + pad, bh / 4, bt - pad);
        translate(2 * bt + pad * 4, 0, 0);
    }
    pop();

    push()
    translate(bt * 3 / 2 + pad * 3, -3 * bh / 8 + 2, 0);
    for (let i = 0; i < 3; i++) {
        box(2 * bt + pad, bh / 4, bt - pad);
        translate(2 * bt + pad * 4, 0, 0);
    }
    pop();

    pop();
}

// Dashed line function useful for creating lines in WEBGL mode
function dashedLine(p1, p2, dashSettings) {
    let dash = dashSettings[0];
    let space = dash + dashSettings[1];

    p1 = this.mapPoint(...p1);
    p2 = this.mapPoint(...p2);

    let dir = this.getDirection(p1, p2);
    let dist = this.getMagnitude([p2[0] - p1[0], p2[1] - p1[1]]);

    push();
    let n = Math.floor(dist / space);
    let i;
    for (i = 0; i < n; i++) {
        line(...p1, p1[0] + dir[0] * dash, p1[1] + dir[1] * dash);
        p1 = [p1[0] + dir[0] * space, p1[1] + dir[1] * space];
    }
    line(...p1, ...p2);
    pop();
}

function getDirection(p1, p2) {
    let dx = p2[0] - p1[0], dy = p2[1] - p1[1];
    let magnitude = Math.sqrt(dx ** 2 + dy ** 2);
    let ihat = dx / magnitude, jhat = dy / magnitude;
    return [ihat, jhat];
}

function effectiveness(cmin, cmax) {
    let C = cmin / cmax;
    let NTU = g.UA / cmin;

    if (C == 1) return NTU / (1 + NTU); // This is the limit so it doesnt become NaN
    else return (1 - Math.exp(-NTU * (1 - C))) / (1 - C * Math.exp(-NTU * (1 - C)));
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

    g.Th_out = g.Th_in - g.Qdot / g.cpH / g.mDotH;
    g.Tc_out = g.Tc_in + g.Qdot / g.cpC / g.mDotC;
}

function extraLabels() {
    l = createGraphics(600, 450);
    l.push();

    l.textSize(20);
    l.text('T    = ' + g.Th_in.toFixed(1) + ' K', 456, 120);
    l.text('ṁ  = ' + g.mDotH.toFixed(1) + ' g / s', 463, 145);
    l.text('T     = ' + g.Th_out.toFixed(1) + ' K', 452, 320);

    l.text('T      = ' + g.Tc_out.toFixed(1) + ' K', 266, 40);
    l.text('T    = ' + g.Tc_in.toFixed(1) + ' K', 270, 370);
    l.text('ṁ  = ' + g.mDotC.toFixed(1) + ' g / s', 277, 395);

    l.text('Q̇ = ' + g.Qdot.toFixed(1) + ' W', 100, 385);

    l.textSize(14);
    l.text('h,in', 466, 125);
    l.text('h', 480, 150);
    l.text('h,out', 461, 325);
    l.text('c,out', 277, 45);
    l.text('c,in', 280, 375);
    l.text('c', 294, 400);

    l.pop();

    return l;
}

function shellTubeLabels() {
    let bounds;

    rotateY(g.rotX);
    rotateX(-g.rotY);

    push();
    translate(-220, -95, 0);
    textSize(20);
    stroke('black'); strokeWeight(2); fill(250);

    bounds = font.textBounds('T    = ' + g.Th_in.toFixed(1), 0, 0, 20);
    rect(bounds.x - 4, bounds.y - 2, bounds.w + 8, bounds.h + 68);

    push();
    translate(0, 0, 1);
    fill('black'); noStroke();
    text('T    = ' + g.Th_in.toFixed(1), 0, 0);
    text('m  = ' + g.mDotH.toFixed(1), 0, 20);
    text('.', 6, 8);
    text('T    = ' + g.Tc_in.toFixed(1), 0, 40);
    text('m  = ' + g.mDotC.toFixed(1), 0, 60);
    text('.', 6, 48);
    textSize(12);
    text('h,in', 10, 3);
    text('h', 17, 23);
    text('c,in', 10, 43);
    text('c', 17, 63);
    pop();

    translate(0, 195, 0);
    bounds = font.textBounds('T      = ' + g.Th_in.toFixed(1), 0, 0, 20);
    rect(bounds.x - 4, bounds.y - 2, bounds.w + 8, bounds.h + 10);

    push();
    translate(0, 0, 1);
    fill('black'); noStroke();
    text('T      = ' + g.Th_out.toFixed(1), 0, 0);
    textSize(12);
    text('h,out', 10, 3);
    pop();

    translate(300, 0, 0);
    bounds = font.textBounds('T      = ' + g.Th_in.toFixed(1), 0, 0, 20);
    rect(bounds.x - 4, bounds.y - 2, bounds.w + 8, bounds.h + 10);

    push();
    translate(0, 0, 1);
    fill('black'); noStroke();
    text('T      = ' + g.Tc_out.toFixed(1), 0, 0);
    textSize(12);
    text('c,out', 10, 3);
    pop();

    translate(8, -180, 0);
    bounds = font.textBounds('Q = ' + g.Qdot.toFixed(1), 0, 0, 20);
    rect(bounds.x - 4, bounds.y - 6, bounds.w + 8, bounds.h + 10);

    push();
    translate(0, 0, 1);
    fill('black'); noStroke();
    text('Q = ' + g.Qdot.toFixed(1), 0, 0);
    text('.', 5, -15);
    pop();

    pop();
}