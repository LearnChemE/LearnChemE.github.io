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

    // Connecting pipes for blue
    dt.push();
    dt.stroke('black');
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

function doubleTubeBlue(w, h, lx, rx, ty) {
    let dtb = createGraphics(w, h);
    dtb.push();
    dtb.fill(g.blueFluidColor);
    dtb.strokeWeight(1);

    // v pipes
    dtb.rect(lx + 40, ty + 66, 20, 31);
    dtb.rect(lx + 40, ty + 198, 20, 31);
    dtb.rect(rx - 60, ty, 20, 31);
    dtb.rect(rx - 60, ty + 132, 20, 31);
    dtb.rect(rx - 60, ty + 264, 20, 35);

    // h pipes
    var wHex = rx - lx;
    dtb.rect(lx + wHex / 16 + 1, ty + 30, wHex * 7 / 8, 36);
    dtb.rect(lx + wHex / 16 + 1, ty + 96, wHex * 7 / 8, 36);
    dtb.rect(lx + wHex / 16 + 1, ty + 162, wHex * 7 / 8, 36);
    dtb.rect(lx + wHex / 16 + 1, ty + 228, wHex * 7 / 8, 36);
    dtb.pop();

    return dtb;
}

function doubleTubeOrng(w, h, lx, rx, ty) {
    let dto = createGraphics(w, h);
    let wHex = rx - lx;
    dto.push();
    dto.fill(g.orangeFluidColor); dto.noStroke();
    dto.rect(lx + 1, ty + 38, wHex - 2, 20);
    dto.rect(lx + 1, ty + 104, wHex - 2, 20);
    dto.rect(lx + 1, ty + 170, wHex - 2, 20);
    dto.rect(lx + 1, ty + 236, wHex - 2, 20);

    let orngArc = createGraphics(50, 90);
    orngArc.stroke(g.orangeFluidColor); orngArc.strokeWeight(20); orngArc.noFill();
    orngArc.circle(50, 45, 65);

    dto.image(orngArc, 0, 86);
    dto.image(orngArc, 0, 218);

    dto.push();
    dto.translate(rx + 51, 242);
    dto.rotate(radians(180));
    dto.image(orngArc, 0, 0);
    dto.pop();

    dto.pop();
    return dto;
}

function horizontalPipe(wHex, hHex) {
    hPipe = createGraphics(wHex, hHex);
    hPipe.noFill(); hPipe.strokeWeight(1); hPipe.stroke('black');
    hPipe.rect(0, 8, wHex - 2, 20);
    hPipe.noFill();
    hPipe.rect(wHex / 16, 0, wHex * 7 / 8, 36);

    return hPipe;
}

function curvePipe() {
    let cPipe = createGraphics(50, 90);
    cPipe.stroke('black'); cPipe.strokeWeight(1);
    cPipe.noFill();

    cPipe.circle(50, 45, 86);
    cPipe.push();

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

function getDirection(p1, p2) {
    let dx = p2[0] - p1[0], dy = p2[1] - p1[1];
    let magnitude = Math.sqrt(dx ** 2 + dy ** 2);
    let ihat = dx / magnitude, jhat = dy / magnitude;
    return [ihat, jhat];
}

function createBeaker() {
    let b = createGraphics(120, 120);

    b.strokeWeight(5); b.stroke('black');
    // lip
    b.line(0, 2, 10, 2);
    b.line(110, 2, 120, 2);
    // sides
    b.line(10, 2, 10, 118);
    b.line(110, 2, 110, 118);
    // bottom
    b.line(10, 118, 110, 118);
    // measuring lines
    b.strokeWeight(2);
    for (let i = 0; i < 9; i++) {
        if (i % 2 == 0) {
            b.line(30, i * 10 + 20, 90, i * 10 + 20);
        }
        else {
            b.line(45, i * 10 + 20, 75, i * 10 + 20);
        }
    }
    return b;
}

function beakersAndTubes() {
    let bt = createGraphics(g.width, g.height);
    bt.push();
    bt.translate(0, 450);
    bt.scale(1.25);
    bt.image(b, 50, 0);
    bt.image(b, 180, 0);
    bt.image(b, 310, 0);
    bt.image(b, 450, 0);
    bt.pop();

    bt.push();
    bt.stroke('black'); bt.strokeWeight(2);
    bt.pop();

    bt.push();
    bt.stroke('black'); bt.strokeWeight(2);
    // thi tube
    bt.line(95, 580, 95, 400);
    bt.line(85, 580, 85, 410);
    bt.line(85, 410, 10, 410);
    bt.line(95, 400, 20, 400);
    bt.line(10, 410, 10, 80);
    bt.line(20, 400, 20, 90);
    bt.line(10, 80, 520, 80);
    bt.line(20, 90, 510, 90);
    bt.line(520, 80, 520, 130);
    bt.line(510, 90, 510, 115);
    bt.line(520, 132, 450, 132);
    bt.line(510, 115, 450, 115);

    // tho tube
    bt.line(258, 580, 258, 410);
    bt.line(248, 580, 248, 400);
    bt.line(258, 410, 520, 410);
    bt.line(248, 400, 510, 400);
    bt.line(520, 410, 520, 313);
    bt.line(510, 400, 510, 330);
    bt.line(520, 313, 450, 313);
    bt.line(510, 330, 450, 330);

    // tci tube
    bt.line(420, 580, 420, 430);
    bt.line(410, 580, 410, 440);
    bt.line(420, 430, 410, 430);
    bt.line(410, 440, 390, 440);
    bt.line(410, 430, 410, 300);
    bt.line(390, 440, 390, 300);

    // tco tube
    bt.line(593, 580, 593, 10);
    bt.line(583, 580, 583, 20);
    bt.line(593, 10, 390, 10);
    bt.line(583, 20, 410, 20);
    bt.line(390, 10, 390, 100);
    bt.line(410, 20, 410, 100);
    bt.pop();

    // thiTubes(bt);
    // thoTubes(bt);
    // tciTubes(bt);
    // tcoTubes(bt);

    return bt;
}

function thiTubes(bt) {
    bt.push();
    bt.fill(g.orangeFluidColor); bt.noStroke();
    bt.rect(85, 400, 10, 180);
    bt.rect(10, 400, 75, 10);
    bt.rect(10, 80, 10, 320);
    bt.rect(20, 80, 500, 10);
    bt.rect(510, 90, 10, 42);
    bt.rect(450, 115, 60, 17);
    bt.pop();
}

function thoTubes(bt) {
    bt.push();
    bt.fill(g.orangeFluidColor); bt.noStroke();
    bt.rect(248, 400, 10, 180);
    bt.rect(258, 400, 262, 10);
    bt.rect(510, 313, 10, 87);
    bt.rect(450, 313, 60, 17);
    bt.pop();
}

function tciTubes(bt) {
    bt.push();
    bt.fill(g.blueFluidColor); bt.noStroke();
    bt.rect(410, 430, 10, 150);
    bt.rect(390, 430, 20, 10);
    bt.rect(390, 300, 20, 130);
    bt.pop();
}

function tcoTubes(bt) {
    bt.push();
    bt.fill(g.blueFluidColor); bt.noStroke();
    bt.rect(583, 10, 10, 570);
    bt.rect(390, 10, 193, 10);
    bt.rect(390, 20, 20, 80);
    bt.pop();
}

function fillBeaker(x, vol, color = 'pink') {
    vol = vol / 10;
    push();
    fill(color); noStroke();
    translate(0, 450);
    scale(1.25);

    translate(x, 0);
    rect(10, 120 - vol, 100, vol);
    pop();
}

/* ********************************************* */
/* **************** DRAW DISPLAYS ************** */
/* ********************************************* */

function drawAll() {
    switch (g.state) {
        case -1: // dev mode
            image(thi, 0, 0);
            image(tho, 0, 0);
            image(tci, 0, 0);
            image(tco, 0, 0);

            image(bt, 0, 0);
            image(dt, 0, 25);
            image(dto, 0, 25);
            image(dtb, 0, 25);


            break;
        case 0: // name and landing page
            landingPage();
            break;
        case 1: // startup animation
            if (g.playS1) playTime();
            let to = (g.orngTime == -1) ? 0 : (millis() - g.orngTime) / 1000;
            let tb = (g.blueTime == -1) ? 0 : (millis() - g.blueTime) / 1000;

            image(bt, 0, 0);
            fillAnimationTubes(to, tb);
            image(dt, 0, 25);
            fillAnimationOrange(to, 0, 25);
            fillAnimationBlue(tb, 0, 25);
            break;
        case 2: // flows and temps
            changeVols();
            integrateTemps();
            push();
            fillBeaker(50, g.vols[0], g.orangeFluidColor);
            fillBeaker(180, g.vols[1], g.orangeFluidColor);
            fillBeaker(310, g.vols[2], g.blueFluidColor);
            fillBeaker(450, g.vols[3], g.blueFluidColor);
            pop();

            image(bt, 0, 0);
            if (g.hIsFlowing) {
                image(thi, 0, 0);
                image(tho, 0, 0);
            }
            if (g.cIsFlowing) {
                image(tci, 0, 0);
                image(tco, 0, 0);
            }
            image(dt, 0, 25);
            if (g.hIsFlowing) image(dto, 0, 25);
            if (g.cIsFlowing) image(dtb, 0, 25);

            updateTooltips();
            break;
    }
}

function landingPage() {
    push();
    fill('black'); noStroke();
    textAlign(CENTER, CENTER); textSize(18);
    const label1 = 'This is a virtual lab made for LearnChemE'
    const label2 = 'by Drew Smith'
    const label3 = 'Please input your name.';
    text(label1, g.width / 2, 90);
    text(label2, g.width / 2, 120);
    text(label3, g.width / 2, 150);
    text('name:', 260, 193);
    if (g.name != '') {
        stroke('green'); strokeWeight(2); noFill();
        rect(300, 180, 250, 30);
    }
    pop();
}

function fillAnimationBlue(t, x = 0, y = 0) {
    let s;
    let partBlue;

    push();
    translate(x, y);
    if (t <= 5) {
        s = 88 + t * 160
        partBlue = dtb.get(0, 450 - s, 500, 50 + s);
        image(partBlue, 0, 450 - s);
    }
    else {
        image(dtb, 0, 0);
    }
    pop();
}

function fillAnimationOrange(t, x = 0, y = 0) {
    let s;
    let partOrng;

    push();
    translate(x, y);
    if (t <= 7) {
        s = 88 + t * 160 - 100
        s = constrain(s, 1, 600);
        partOrng = dto.get(0, 0, 500, s);
        image(partOrng, 0, 0);
    }
    else {
        image(dto, 0, 0);
    }
    pop();
}

function fillAnimationTubes(tOrange, tBlue) {
    push();
    s = constrain(tOrange * 1000, 0, 255);
    tint(255, s);
    image(thi, 0, 0);
    s = constrain(tOrange * 1000 - 2000, 0, 255);
    tint(255, s);
    image(tho, 0, 0);

    s = constrain(tBlue * 1000, 0, 255);
    tint(255, s);
    image(tci, 0, 0);
    s = constrain(tBlue * 1000 - 2000, 0, 255);
    tint(255, s);
    image(tco, 0, 0);
    pop();
}

function stage3Labels() {
    let tco = (g.s3measure[0] == -1) ? ' -' : g.s3measure[0].toFixed(1) + ' °C';
    let thi = (g.s3measure[1] == -1) ? ' -' : g.s3measure[1].toFixed(1) + ' °C';
    let tho = (g.s3measure[2] == -1) ? ' -' : g.s3measure[2].toFixed(1) + ' °C';
    let tci = (g.s3measure[3] == -1) ? ' -' : g.s3measure[3].toFixed(1) + ' °C';

    push();
    textSize(22);
    text('T       :   ' + tco, 550, 50);
    text('T       :   ' + thi, 550, 130);
    text('T       :   ' + tho, 550, 330);
    text('T       :   ' + tci, 550, 440);

    textSize(16);
    text('c,out', 560, 55);
    text('h,in', 560, 135);
    text('h,out', 560, 335);
    text('c,in', 560, 445);

    push();
    noFill(); stroke('green'); drawingContext.setLineDash([10, 10]);
    switch (g.s3select) {
        case 0:
            rect(453, 105, 260, 40);
            break;
        case 1:
            rect(453, 305, 260, 40);
            break;
        case 2:
            rect(385, 380, 328, 75);
            break;
        case 3:
            rect(385, 20, 328, 50);
            break;
    }
    pop();

    pop();
}

function quizDeltaT(arrays) {
    push();
    textSize(22); fill('black'); noStroke();
    let dT1, dT2;

    if (!g.dT1selected) {
        text('Select ΔT', 580, 80);
        push(); textSize(14);
        text('1', 670, 85);
        pop();
        push();
        fill('green');
        text('click', 80, map((g.Th_in + g.Tc_out) / 2, 0, 50, lmtdGraph.by, lmtdGraph.ty));
        noFill(); stroke('green');
        drawingContext.setLineDash([10, 10]);
        rect(62, map(g.Th_in, 0, 50, lmtdGraph.by, lmtdGraph.ty) - 20, 100, map(g.Th_in - g.Tc_out, 0, 50, lmtdGraph.ty, lmtdGraph.by) + 20);
        pop();
    }
    else {
        dT1 = g.Th_in - g.Tc_out;
        text('ΔT  = ' + dT1.toFixed(1) + ' °C', 580, 80);
        push(); textSize(14);
        text('1', 605, 85);

        let thi = map(g.Th_in, 0, 50, lmtdGraph.by, lmtdGraph.ty);
        let tco = map(g.Tc_out, 0, 50, lmtdGraph.by, lmtdGraph.ty);
        stroke('black'); strokeWeight(2);
        fill(250); rect(lmtdGraph.lx + 15, (thi + tco) / 2 - 15, 50, 30);
        line(lmtdGraph.lx + 10, thi, lmtdGraph.lx + 10, tco);
        line(lmtdGraph.lx + 5, thi, lmtdGraph.lx + 10, thi);
        line(lmtdGraph.lx + 5, tco, lmtdGraph.lx + 10, tco);
        line(lmtdGraph.lx + 10, (thi + tco) / 2, lmtdGraph.lx + 15, (thi + tco) / 2);
        noStroke();
        fill('black');
        textSize(20);
        text('ΔT', lmtdGraph.lx + 20, (thi + tco) / 2 + 7);
        textSize(14);
        text('1', lmtdGraph.lx + 43, (thi + tco) / 2 + 12);
        pop();

    }
    if (!g.dT2selected) {
        text('Select ΔT', 580, 160);
        push(); textSize(14);
        text('2', 670, 165);
        pop();
        push();
        fill('green');
        text('click', 400, map((g.Th_out + g.Tc_in) / 2, 0, 50, lmtdGraph.by, lmtdGraph.ty));
        noFill(); stroke('green');
        drawingContext.setLineDash([10, 10]);
        rect(370, map(g.Th_out, 0, 50, lmtdGraph.by, lmtdGraph.ty) - 20, 100, map(g.Th_out - g.Tc_in, 0, 50, lmtdGraph.ty, lmtdGraph.by) + 20);
        pop();
    }
    else {
        dT2 = g.Th_out - g.Tc_in;
        text('ΔT  = ' + dT2.toFixed(1) + ' °C', 580, 160);
        push(); textSize(14);
        text('2', 605, 165);

        let tci = map(g.Tc_in, 0, 50, lmtdGraph.by, lmtdGraph.ty);
        let tho = map(g.Th_out, 0, 50, lmtdGraph.by, lmtdGraph.ty);
        stroke('black'); strokeWeight(2);
        fill(250); rect(lmtdGraph.rx - 65, (tho + tci) / 2 - 15, 50, 30);
        line(lmtdGraph.rx - 10, tho, lmtdGraph.rx - 10, tci);
        line(lmtdGraph.rx - 5, tho, lmtdGraph.rx - 10, tho);
        line(lmtdGraph.rx - 5, tci, lmtdGraph.rx - 10, tci);
        line(lmtdGraph.rx - 10, (tho + tci) / 2, lmtdGraph.rx - 15, (tho + tci) / 2);
        noStroke();
        fill('black');
        textSize(20);
        text('ΔT', lmtdGraph.rx - 60, (tho + tci) / 2 + 7);
        textSize(14);
        text('2', lmtdGraph.rx - 37, (tho + tci) / 2 + 12);
        pop();
    }

    if (mouseX >= 72 && mouseX <= 462 &&
        mouseY >= 22 && mouseY <= 402
    ) {
        // circle(mouseX - 2, mouseY - 2, 8);
        showDeltaT(map(mouseX - 2, 70, 460, 0, 1), arrays);
    }
    pop();
}

function showDeltaT(x, arrays) {
    let i, j, yLo, yHi;
    for (i = 0; i < 200; i++) {
        if (arrays.x[i] > x) {
            j = i;
            break;
        }
    }
    yLo = map(x, arrays.x[j], arrays.x[j + 1], arrays.y1[j], arrays.y1[j + 1]);
    yHi = map(x, arrays.x[j], arrays.x[j + 1], arrays.y2[j], arrays.y2[j + 1]);
    pLo = lmtdGraph.mapPoint(x, yLo);
    pHi = lmtdGraph.mapPoint(x, yHi);

    push();
    circle(...pLo, 8);
    circle(...pHi, 8);
    drawingContext.setLineDash([10, 10]);
    stroke('black'); strokeWeight(2);
    line(...pLo, ...pHi);
    pop();
}

// This wasn't fun to make
function lmtdAnimation() {
    let t = millis() - g.animationStartTime;
    push();
    fill('black'); textSize(20);
    text('ΔT    = ', 550, 320);
    push(); textSize(14);
    text('lm', 572, 325);
    pop();

    text('ΔT   - ΔT', 620, 305);
    text(`ln(        )`, 620, 345);
    push(); textSize(14);
    text('1', 643, 310);
    text('2', 693, 310);
    stroke('black'); strokeWeight(2);
    line(620, 315, 700, 315);
    strokeWeight(1);
    line(648, 339, 674, 339);
    pop();
    textSize(16);
    text('ΔT\nΔT', 648, 333);
    textSize(14);
    text('2\n1', 667, 338);

    textSize(20);
    translate(-10, 60);

    text('ΔT    = ', 550, 350);
    push(); textSize(14);
    text('lm', 572, 355);
    pop();

    dT1 = (g.Th_in - g.Tc_out).toFixed(1);
    dT2 = (g.Th_out - g.Tc_in).toFixed(1);
    text(dT1 + ' - ' + dT2, 620, 335);
    text(`ln(        )`, 620, 375);
    push();
    stroke('black'); strokeWeight(2);
    line(620, 345, 710, 345);
    strokeWeight(1);
    line(648, 369, 674, 369);
    pop();
    textSize(16);
    text(dT1 + '\n' + dT2, 646, 363);

    textSize(20);
    text('= ' + g.lmtd.toFixed(1) + ' °C', 720, 350);

    pop();
}