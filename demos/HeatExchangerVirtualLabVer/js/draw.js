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

    // drawArrow(dt, [rx - 50, ty], [rx - 50, ty - 50]);
    // drawArrow(dt, [rx - 50, by + 50], [rx - 50, by]);
    // drawArrow(dt, [w, ty + 48], [rx, ty + 48]);
    // drawArrow(dt, [rx, by - 54], [w, by - 54]);
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

// function drawArrow(graphicsObject, tail, head, options = {
//     color: 'black',
//     arrowSize: 12,
//     dashed: false,
// }) {
//     let temp = { color: 'black', arrowSize: 12, dashed: false, };
//     options = { ...temp, ...options };

//     let p1 = tail;
//     let p2 = head;
//     let dir = getDirection(p2, p1);
//     let perp = [dir[1], -dir[0]];
//     let size = options.arrowSize;

//     dt.push();
//     dt.stroke(options.color); dt.strokeWeight(2);
//     if (options.dashed) drawingContext.setLineDash([8, 5]);

//     dt.line(p1[0], p1[1], p2[0], p2[1]);

//     dt.noStroke(); dt.fill(options.color);
//     dt.triangle(p2[0], p2[1],
//         p2[0] + size * (dir[0] + perp[0] / 3), p2[1] + size * (dir[1] + perp[1] / 3),
//         p2[0] + size * (dir[0] - perp[0] / 3), p2[1] + size * (dir[1] - perp[1] / 3));

//     dt.pop();
// }

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
            b.line(30, i * 10 + 20, 80, i * 10 + 20);
        }
        else {
            b.line(45, i * 10 + 20, 75, i * 10 + 20);
        }
    }
    b.noStroke(); b.textSize(10);
    b.text('mL', 90, 11);
    b.text('1000', 83, 23);
    b.text('800', 83, 43);
    b.text('600', 83, 63);
    b.text('400', 83, 83);
    b.text('200', 83, 103);
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
    bt.line(95, 440, 95, 400);
    bt.line(85, 440, 85, 410);
    bt.line(85, 410, 10, 410);
    bt.line(95, 400, 20, 400);
    bt.line(10, 410, 10, 80);
    bt.line(20, 400, 20, 90);
    bt.line(10, 80, 520, 80);
    bt.line(20, 90, 510, 90);
    bt.line(520, 80, 520, 128);
    bt.line(510, 90, 510, 118);
    bt.line(520, 128, 450, 128);
    bt.line(510, 118, 450, 118);

    // tho tube
    bt.line(258, 580, 258, 410);
    bt.line(248, 580, 248, 400);
    bt.line(258, 410, 520, 410);
    bt.line(248, 400, 510, 400);
    bt.line(520, 410, 520, 315);
    bt.line(510, 400, 510, 325);
    bt.line(520, 315, 450, 315);
    bt.line(510, 325, 450, 325);

    // tci tube
    bt.line(420, 450, 420, 430);
    bt.line(410, 450, 410, 420);
    bt.line(420, 430, 430, 430);
    bt.line(410, 420, 420, 420);
    bt.line(430, 430, 430, 300);
    bt.line(420, 420, 420, 300);

    // tco tube
    bt.line(593, 580, 593, 10);
    bt.line(583, 580, 583, 20);
    bt.line(593, 10, 420, 10);
    bt.line(583, 20, 430, 20);
    bt.line(420, 10, 420, 100);
    bt.line(430, 20, 430, 100);
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
    bt.rect(83, 450, 13, 100);
    bt.rect(85, 400, 10, 50);
    bt.rect(10, 400, 75, 10);
    bt.rect(10, 80, 10, 320);
    bt.rect(20, 80, 500, 10);
    bt.rect(510, 90, 10, 38);
    bt.rect(450, 118, 60, 10);
    bt.pop();
}

function thoTubes(bt) {
    bt.push();
    bt.fill(g.orangeFluidColor); bt.noStroke();
    bt.rect(248, 400, 10, 180);
    bt.rect(258, 400, 262, 10);
    bt.rect(510, 315, 10, 85);
    bt.rect(450, 315, 60, 10);
    bt.pop();
}

function tciTubes(bt) {
    bt.push();
    bt.fill(g.blueFluidColor); bt.noStroke();
    bt.rect(408, 470, 13, 80);
    bt.rect(410, 420, 10, 50);
    bt.rect(420, 300, 10, 130);
    bt.pop();
}

function tcoTubes(bt) {
    bt.push();
    bt.fill(g.blueFluidColor); bt.noStroke();
    bt.rect(583, 10, 10, 570);
    bt.rect(420, 10, 163, 10);
    bt.rect(420, 20, 10, 80);
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

function valve() {
    let v = createGraphics(50, 50);
    v.push();
    v.fill('blue'); v.stroke('black'); v.strokeWeight(2);
    v.circle(25, 25, 48);
    v.rect(18, 0, 14, 50);
    v.pop();
    return v;
}

function pumpAssembly() {
    pa = createGraphics(50, 150);
    pa.push();
    // pa.background('yellow');

    pa.push();
    pa.fill(0);
    pa.rect(10, 120, 30, 30);
    pa.rect(20, 110, 10, 10);
    pa.pop();

    pa.push();
    pa.stroke('black'); pa.strokeWeight(3);
    pa.noFill();
    pa.line(17, 120, 17, 0);
    pa.line(32, 120, 32, 0);
    pa.pop();

    pa.pop();
    return pa;
}

function displayValve(x, y, flow) {
    push();
    angle = map(flow, MIN_HOT_FLOWRATE, MAX_COLD_FLOWRATE, 3 * PI / 4, PI);
    imageMode(CENTER);
    translate(x, y);
    scale(.8);
    rotate(angle);

    image(v, 0, 0);
    pop();
}

/* ********************************************* */
/* **************** DRAW DISPLAYS ************** */
/* ********************************************* */

function drawAll() {
    let to, tb;
    switch (g.state) {
        case 0: // name and landing page
            landingPage();
            break;
        case 1: // flows and temps
            to = (g.orngTime == -1) ? 0 : (millis() - g.orngTime) / 1000;
            tb = (g.blueTime == -1) ? 0 : (millis() - g.blueTime) / 1000;

            changeVols();
            integrateTemps();

            image(pa, 65, 440);
            image(pa, 390, 440);

            push();
            fillBeaker(50, g.vols[0], g.orangeFluidColor);
            fillBeaker(180, g.vols[1], g.orangeFluidColor);
            fillBeaker(310, g.vols[2], g.blueFluidColor);
            fillBeaker(450, g.vols[3], g.blueFluidColor);
            pop();

            image(bt, 0, 0);
            fillAnimationTubes(to, tb);
            image(dt, 25, 25);
            fillAnimationOrange(to, 0, 25);
            fillAnimationBlue(tb, 0, 25);

            drag();
            displayValve(90, 431, g.mDotH);
            displayValve(415, 451, g.mDotC);
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
    if (!g.cIsFlowing) return;
    let s;
    let partBlue;

    push();
    translate(x, y);
    if (t <= 5) {
        s = 88 + t * 160
        partBlue = dtb.get(0, 450 - s, 500, 50 + s);
        image(partBlue, 25, 450 - s);
    }
    else {
        image(dtb, 25, 0);
    }
    pop();
}

function fillAnimationOrange(t, x = 0, y = 0) {
    if (!g.hIsFlowing) return;
    let s;
    let partOrng;

    push();
    translate(x, y);
    if (t <= 7) {
        s = 88 + t * 160 - 100
        s = constrain(s, 1, 600);
        partOrng = dto.get(0, 0, 500, s);
        image(partOrng, 25, 0);
    }
    else {
        image(dto, 25, 0);
    }
    pop();
}

// The tint function multiplies every pixel on your cpu, so it is a very costy solution. Better would be use a shader :)
function fillAnimationTubes(tOrange, tBlue) {
    push();
    if (tOrange < 7 && g.hIsFlowing) {
        s = constrain(tOrange * 1000, 0, 255);
        tint(255, s);
        image(thi, 0, 0);
        s = constrain(tOrange * 1000 - 2000, 0, 255);
        tint(255, s);
        image(tho, 0, 0);
    }
    else if (g.hIsFlowing) {
        image(thi, 0, 0);
        image(tho, 0, 0);
    }

    if (tBlue < 7 && g.cIsFlowing) {
        s = constrain(tBlue * 1000, 0, 255);
        tint(255, s);
        image(tci, 0, 0);
        s = constrain(tBlue * 1000 - 2000, 0, 255);
        tint(255, s);
        image(tco, 0, 0);
    }
    else if (g.cIsFlowing) {
        image(tci, 0, 0);
        image(tco, 0, 0);
    }

    pop();
}
