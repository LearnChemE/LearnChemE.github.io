

// function shellTubeGraphic(w, h) {
//     let lx = 50, rx = 450;
//     let ty = 50, by = 350;
//     let wHex = rx - lx, hHex = by - ty;

//     let st = createGraphics(w, h);

//     st.push();

//     shellOrangeGraphic(bw, bh, bt, pad);
//     shellBlueGraphic(bw, bh, bt, pad);
//     shellOuterGraphic(bw, bh, bt, pad);

//     st.pop();

// }

// function shellOuterGraphic(bw, bh, bt, pad) {
//     fill(250, 250, 250, 50);
//     box(bw, bh, bt);

//     // pipes
//     push();
//     translate(-bw / 2 + bt / 2, -bh / 2 - 25, 0); noStroke();
//     cylinder(12 + pad, 52);
//     translate(bt, 0, 0);
//     cylinder(12 + pad, 52);
//     translate(-bt, bh + 50, 0);
//     cylinder(12 + pad, 52);
//     pop();
//     push();
//     translate(bw / 2 - 77, bh / 2 + 25, 0); noStroke();
//     cylinder(12 + pad, 52); // bottom right
//     pop();
// }

// function shellOrangeGraphic(bw, bh, bt, pad) {
//     push();
//     fill(g.orangeFluidColor); noStroke();

//     push();

//     translate(-bw / 2 + bt / 2, -bh / 4, 0);
//     box(bt - pad, bh / 2 - pad, bt - pad);
//     translate(0, bh / 2, 0);
//     box(bt - pad, bh / 2 - pad, bt - pad);


//     translate(0, -bh * 3 / 4 - 25, 0);
//     cylinder(12, 50);
//     translate(0, bh + 50, 0);
//     cylinder(12, 50);
//     pop();

//     push();
//     translate(bw / 2 - bt / 2, 0, 0);
//     box(bt - pad, bh - pad, bt - pad);
//     pop();

//     push();
//     translate(0, -100, 0);
//     rotateZ(radians(90));

//     for (let i = 0; i < 4; i++) {
//         cylinder(12, 408);
//         translate(bh / 4 + pad, 0, 0);
//     }
//     pop();

//     pop();
// }

// function shellBlueGraphic(bw, bh, bt, pad) {
//     push();
//     fill(g.blueFluidColor); noStroke();
//     translate(-bw / 2 + 3 * bt / 2, 0, 0);

//     // top left box and pipe
//     push();
//     translate(0, -bh / 8, 0);
//     box(bt - pad, bh * 3 / 4 - pad, bt - pad);
//     translate(0, -bh / 2 + 6, 0);
//     cylinder(12, 50);
//     pop();

//     // middle boxes
//     push();
//     // middle connecting boxes
//     for (let i = 0; i < 5; i++) {
//         translate(bt + 2 * pad, 0, 0);
//         box(bt - pad, bh / 2 - pad, bt - pad);
//     }
//     // bottom right box
//     translate(bt + 2 * pad, bh / 8, 0);
//     box(bt - pad, bh * 3 / 4 - pad, bt - pad);
//     translate(0, bh / 2 - 6, 0);
//     cylinder(12, 50);
//     pop();

//     push();
//     translate(bt / 2 + pad, 3 * bh / 8 - pad, 0);
//     for (let i = 0; i < 3; i++) {
//         box(2 * bt + pad, bh / 4, bt - pad);
//         translate(2 * bt + pad * 4, 0, 0);
//     }
//     pop();

//     push()
//     translate(bt * 3 / 2 + pad * 3, -3 * bh / 8 + 2, 0);
//     for (let i = 0; i < 3; i++) {
//         box(2 * bt + pad, bh / 4, bt - pad);
//         translate(2 * bt + pad * 4, 0, 0);
//     }
//     pop();

//     pop();
// }

// Dashed line function useful for creating lines in WEBGL mode
// function dashedLine(p1, p2, dashSettings) {
//     let dash = dashSettings[0];
//     let space = dash + dashSettings[1];

//     p1 = this.mapPoint(...p1);
//     p2 = this.mapPoint(...p2);

//     let dir = this.getDirection(p1, p2);
//     let dist = this.getMagnitude([p2[0] - p1[0], p2[1] - p1[1]]);

//     push();
//     let n = Math.floor(dist / space);
//     let i;
//     for (i = 0; i < n; i++) {
//         line(...p1, p1[0] + dir[0] * dash, p1[1] + dir[1] * dash);
//         p1 = [p1[0] + dir[0] * space, p1[1] + dir[1] * space];
//     }
//     line(...p1, ...p2);
//     pop();
// }

function effectiveness(cmin, cmax) {
    let C = cmin / cmax;
    let NTU = g.UA / cmin;

    if (g.hexType == DOUBLE_TUBE) {
        if (C == 1) return NTU / (1 + NTU); // This is the limit so it doesnt become NaN
        else return (1 - Math.exp(-NTU * (1 - C))) / (1 - C * Math.exp(-NTU * (1 - C)));
    }
    else {
        let eterm = (1 + Math.exp(-NTU * Math.sqrt(1 + C ** 2))) / (1 - C * Math.exp(-NTU * Math.sqrt(1 + C ** 2)));
        return 2 / (1 + C + Math.sqrt(1 + C ** 2) * eterm);
    }
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

function showSimulationControls() {
    hideExtraControls();
    switch (g.state) {
        case 0:
            inputName.classList.remove("hidden");
            break;
        case 1:
            nextBtn.classList.remove("hidden");
            document.getElementById("time-wrapper").classList.remove("hidden");
            measureBtn.classList.remove("hidden");
            break;
        case 2:
            nextBtn.classList.remove("hidden");
            break;
        case 3:
            nextBtn.classList.remove("hidden");
            measureBtn.classList.remove("hidden");
            document.getElementById("t-selection-btn-wrapper").classList.remove("hidden");
            break;
    }
}

// Hides all controls but the start/reset button
function hideExtraControls() {
    inputName.classList.remove("hidden");
    nextBtn.classList.add("hidden");
    document.getElementById("time-wrapper").classList.add("hidden");
    measureBtn.classList.add("hidden");
    inputName.classList.add("hidden");
    document.getElementById("t-selection-btn-wrapper").classList.add("hidden");
}

function outlineSelectionButtons(n) {
    for (let i = 0; i < 4; i++) {
        if (i == n) {
            tempSelectionBtns[i].classList.remove("btn-outline-success");
            tempSelectionBtns[i].classList.add("btn-success");
        }
        else {
            tempSelectionBtns[i].classList.add("btn-outline-success");
            tempSelectionBtns[i].classList.remove("btn-success");
        }
    }
}

// function shellTubeLabels() {
//     let bounds;

//     rotateY(g.rotX);
//     rotateX(-g.rotY);

//     push();
//     translate(-220, -95, 0);
//     textSize(20);
//     stroke('black'); strokeWeight(2); fill(250);

//     bounds = font.textBounds('T    = ' + g.Th_in.toFixed(1) + ' °C', 0, 0, 20);
//     rect(bounds.x - 4, bounds.y - 2, bounds.w + 8, bounds.h + 68);

//     push();
//     translate(0, 0, 1);
//     fill('black'); noStroke();
//     text('T    = ' + g.Th_in.toFixed(1) + ' °C', 0, 0);
//     text('m  = ' + g.mDotH.toFixed(1) + ' g/s', 0, 20);
//     text('.', 6, 8);
//     text('T    = ' + g.Tc_in.toFixed(1) + ' °C', 0, 40);
//     text('m  = ' + g.mDotC.toFixed(1) + ' g/s', 0, 60);
//     text('.', 6, 48);
//     textSize(12);
//     text('h,in', 10, 3);
//     text('h', 17, 23);
//     text('c,in', 10, 43);
//     text('c', 17, 63);
//     pop();

//     translate(0, 195, 0);
//     bounds = font.textBounds('T      = ' + g.Th_in.toFixed(1) + ' °C', 0, 0, 20);
//     rect(bounds.x - 4, bounds.y - 2, bounds.w + 8, bounds.h + 10);

//     push();
//     translate(0, 0, 1);
//     fill('black'); noStroke();
//     text('T      = ' + g.Th_out.toFixed(1) + ' °C', 0, 0);
//     textSize(12);
//     text('h,out', 10, 3);
//     pop();

//     translate(300, 0, 0);
//     bounds = font.textBounds('T      = ' + g.Th_in.toFixed(1) + ' °C', 0, 0, 20);
//     rect(bounds.x - 4, bounds.y - 2, bounds.w + 8, bounds.h + 10);

//     push();
//     translate(0, 0, 1);
//     fill('black'); noStroke();
//     text('T      = ' + g.Tc_out.toFixed(1) + ' °C', 0, 0);
//     textSize(12);
//     text('c,out', 10, 3);
//     pop();

//     translate(8, -180, 0);
//     bounds = font.textBounds('Q = ' + g.Qdot.toFixed(1) + ' W', 0, 0, 20);
//     rect(bounds.x - 4, bounds.y - 6, bounds.w + 8, bounds.h + 10);

//     push();
//     translate(0, 0, 1);
//     fill('black'); noStroke();
//     text('Q = ' + g.Qdot.toFixed(1) + ' W', 0, 0);
//     text('.', 5, -15);
//     pop();

//     pop();
// }