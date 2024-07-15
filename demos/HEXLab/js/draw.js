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

function fillBeaker(b, vol, color = 'pink') {
    let newb = createGraphics(120, 120);
    newb.fill(color); newb.noStroke();
    newb.rect(10, 120 - vol, 100, vol);
    newb.image(b, 0, 0);
    return newb;
}

/* ********************************************* */
/* **************** DRAW DISPLAYS ************** */
/* ********************************************* */

function drawAll() {
    switch (g.state) {
        case -1: // dev mode
            break;
        case 0:
            landingPage();
            break;
        case 1:
            // labels = extraLabels();
            image(dt, 0, 25);
            fillAnimation(0, 25);
            placeBeakers();
            if (g.playS1) playTime();
            break;
        case 2:
            flowAnimation();
            break;
        case 3:
            image(dt, 0, 25);
            image(dto, 0, 25);
            image(dtb, 0, 25);
            stage3Labels();
    }
}

function landingPage() {
    push();
    fill('black'); noStroke();
    textAlign(CENTER, CENTER); textSize(18);
    const label1 = 'This is a virtual lab made for LearnChemE'
    const label2 = 'by Drew Smith :3'
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

function fillAnimation(x = 0, y = 0) {
    let s;
    let partOrng;

    push();
    translate(x, y);
    if ((time = g.s1time) <= 1.5) {
        s = 88 + g.s1time * 218
        partOrng = dto.get(0, 0, 500, s);
        partBlue = dtb.get(0, 450 - s, 500, 50 + s);
        image(partOrng, 0, 0);
        image(partBlue, 0, 450 - s);
    }
    else {
        image(dto, 0, 0);
        image(dtb, 0, 0);
    }
    pop();
}

function placeBeakers() {
    let volumeH0 = map(g.s1time, 0, 16, 100, 20);
    let volumeH1 = map(g.s1time, 0, 16, 20, 100);
    let volumeC0 = map(g.s1time, 0, 16, 100, 20);
    let volumeC1 = map(g.s1time, 0, 16, 20, 100);

    bh0 = fillBeaker(b, volumeH0, g.orangeFluidColor);
    bh1 = fillBeaker(b, volumeH1, g.orangeFluidColor);
    bc0 = fillBeaker(b, volumeC0, g.blueFluidColor);
    bc1 = fillBeaker(b, volumeC1, g.blueFluidColor);

    image(bh0, 500, 110);
    image(bh1, 500, 250);
    image(bc1, 640, 40);
    image(bc0, 640, 330);

    push();
    fill('black'); noStroke(); textSize(18);
    text('volume = ' + volumeC1.toFixed(1) + ' mL', 630, 30);
    text('volume = ' + volumeH0.toFixed(1) + ' mL', 490, 100);
    text('volume = ' + volumeC0.toFixed(1) + ' mL', 630, 470);
    text('volume = ' + volumeH1.toFixed(1) + ' mL', 490, 390);

    text('initial: 100.0 mL', 640, 200);
    text('at: 0.0 s', 670, 225);

    let m;
    if ((m = g.s1measure) != -1) {
        text('measured: ' + (100 - m * 5).toFixed(1) + ' mL', 640, 265);
        text('at: ' + m.toFixed(1) + ' s', 670, 290);
    }
    pop();

    bh0.remove();
    bh1.remove();
    bc0.remove();
    bc1.remove();
}

// state 2
function flowAnimation() {
    push();
    tint(255, 100);
    image(dt, 0, 25);
    image(dto, 0, 25);
    image(dtb, 0, 25);
    pop();

    t = millis() - g.animationStartTime;
    _flowAnimationHelper(t);

    if (t > 5000) {
        enableNextBtn();
    }
}

function _flowAnimationHelper(t) {
    push();
    // translate(-frame, 0);
    textSize(18);

    let x1 = 640, y1 = 200;
    let x2 = 500, y2 = 100;
    let s = t / 1000; s = constrain(s, 0, 1);
    let x = lerp(x1, x2, s);
    let y = lerp(y1, y2, s);

    text('initial: 100.0 mL', x, y);
    text('at: 0.0 s', x + 30, y + 25);
    text('measured: ' + (100 - g.s1measure * 5).toFixed(1) + ' mL', x, y + 65);
    text('at: ' + g.s1measure.toFixed(1) + ' s', x + 30, y + 90);

    s = t / 500 - 2; s = constrain(s, 0, 1);
    fill(0, 0, 0, s * 255);
    text('flowrate: ', x, 250);

    // delta V / delta t
    s = t / 500 - 4; s = constrain(s, 0, 1);
    fill(0, 0, 0, s * 255);
    text('ΔV', x + 90, 240);
    text('Δt', x + 90, 260);

    push();
    stroke(0, 0, 0, s * 255);
    line(x + 90, 245, x + 112, 245);
    pop();

    // eqn
    s = t / 500 - 6; s = constrain(s, 0, 1);
    fill(0, 0, 0, s * 255);
    text('=', x + 122, 250);
    text('(100 mL - ' + (100 - g.s1measure * 5).toFixed(1) + ' mL)', x + 140, 240);
    text(g.s1measure.toFixed(1) + ' s', x + 190, 260);

    push();
    stroke(0, 0, 0, s * 255);
    line(x + 140, 245, x + 290, 245);
    pop();

    s = t / 500 - 8; s = constrain(s, 0, 1);
    fill(0, 0, 0, s * 255); textSize(20);
    text('Q = 5.0 mL / s', x + 90, 310);
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