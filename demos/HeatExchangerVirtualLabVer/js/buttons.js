const pumpBtns = document.getElementById("pump-btns");
const hPumpBtn = document.getElementById("process-pump-btn");
const resetRandBtn = document.getElementById("reset-new-btn");
const resetKeepBtn = document.getElementById("reset-keep-btn");
const measureBtn = document.getElementById("measure-temps-btn");

let pumpsAreRunning = false;
hPumpBtn.addEventListener("click", () => {
    if (pumpsAreRunning) {
        stopPumps();
        toggleMeasureTempsButton(false);
    }
    else {
        startPumps();
        toggleMeasureTempsButton(true);
    }
});

function startPumps() {
    pumpsAreRunning = true;
    g.orngTime = millis();
    g.hIsFlowing = true;
    g.blueTime = millis();
    g.cIsFlowing = true;
    hPumpBtn.classList.remove("btn-primary");
    hPumpBtn.classList.add("btn-danger");
    hPumpBtn.innerHTML = `<i class="fa-solid fa-pause"></i><div>&nbsp stop pumps</div>`
}

function stopPumps() {
    pumpsAreRunning = false;
    g.orngTime = -1;
    g.hIsFlowing = false;
    g.blueTime = -1;
    g.cIsFlowing = false;
    hPumpBtn.classList.remove("btn-danger");
    hPumpBtn.classList.add("btn-primary");
    hPumpBtn.innerHTML = `<i class="fa-solid fa-play"></i><div>&nbsp start pumps</div>`
}

function mouseClicked(event) {
    if (g.state == 4 &&
        mouseX >= 72 && mouseX <= 142 &&
        mouseY >= 20 && mouseY <= 404) {
        g.dT1selected = true;
    }
    if (g.state == 4 &&
        mouseX >= 370 && mouseX <= 460 &&
        mouseY >= 20 && mouseY <= 404) {
        g.dT2selected = true;
    }

    if (g.dT1selected && g.dT2selected) {
        lmtdBtn.disabled = false;
        lmtdBtn.ariaDisabled = false;
    }
}

const hiTt = document.getElementById("hi-tooltip");
const hoTt = document.getElementById("ho-tooltip");
const ciTt = document.getElementById("ci-tooltip");
const coTt = document.getElementById("co-tooltip");
let tooltipIsShowingOnDiv = -1;
function updateTooltips() {
    if (tooltipIsShowingOnDiv === -1) return;
    var strTemp; //= (g.vols[0] > 0) ? g.Th_in.toFixed(1) : '-';
    var strVol;

    strTemp = g.T_measured[tooltipIsShowingOnDiv];
    strTemp = strTemp === -1 ? '--' : strTemp.toFixed(1);
    strVol = g.vols[tooltipIsShowingOnDiv].toFixed(0);

    var str = "temperature: " + strTemp + " °C, volume: " + strVol + " mL";

    displayedTooltip = document.getElementsByClassName("tooltip-inner");
    displayedTooltip.forEach((div) => {
        div.innerHTML = str;
    });

    str = "temperature: " + g.Th_out_observed.toFixed(1) + " °C, volume: " + g.vols[1].toFixed(1) + " mL";
    hoTt.setAttribute("data-bs-original-title", str);

    strTemp = (g.vols[2] > 0) ? g.Tc_in.toFixed(1) : '-';
    str = "temperature: " + strTemp + " °C, volume: " + g.vols[2].toFixed(1) + " mL";
    ciTt.setAttribute("data-bs-original-title", str);

    str = "temperature: " + g.Tc_out.toFixed(1) + " °C, volume: " + g.vols[3].toFixed(1) + " mL";
    coTt.setAttribute("data-bs-original-title", str);
}

hiTt.addEventListener("mouseover", () => {
    tooltipIsShowingOnDiv = 0;
})
hoTt.addEventListener("mouseover", () => {
    tooltipIsShowingOnDiv = 1;
})
ciTt.addEventListener("mouseover", () => {
    tooltipIsShowingOnDiv = 2;
})
coTt.addEventListener("mouseover", () => {
    tooltipIsShowingOnDiv = 3;
})

function mouseReleased() {
    g.dragging1 = false;
    g.dragging2 = false;
}

function mousePressed() {
    if (dist(90, 451, mouseX, mouseY) <= 50) {
        g.dragging1 = true;
    }
    else if (dist(415, 461, mouseX, mouseY) <= 50) {
        g.dragging2 = true;
    }
}

function drag() {
    if (g.dragging1) {
        angle = atan2(mouseY - 431, mouseX - 90);
        angle = constrain(angle, PI / 4, PI / 2);
        g.mDotH = map(angle, PI / 4, PI / 2, MIN_FLOWRATE, MAX_FLOWRATE);
    }
    else if (g.dragging2) {
        angle = atan2(mouseY - 461, mouseX - 415);
        angle = constrain(angle, PI / 4, PI / 2);
        g.mDotC = map(angle, PI / 4, PI / 2, MIN_FLOWRATE, MAX_FLOWRATE);
    }
}

resetRandBtn.addEventListener("click", () => {
    resetVols();
    randStartVals();
});
resetKeepBtn.addEventListener("click", () => {
    resetVols();
});

function resetVols() {
    g.vols = [1000, 0, 1000, 0];
    g.cIsFlowing = false;
    g.hIsFlowing = false;

    pumpsAreRunning = false;
    stopPumps();
    toggleMeasureTempsButton(false);
}

function toggleMeasureTempsButton(disableButton = true) {
    if (disableButton) {
        measureBtn.disabled = true;
        measureBtn.ariaDisabled = true;
        g.T_measured = [-1, -1, -1, -1];
    }
    else {
        measureBtn.disabled = false;
        measureBtn.ariaDisabled = false;
    }
}

measureBtn.addEventListener("click", () => {
    g.T_measured = [g.Th_in, g.Th_out_observed, g.Tc_in, g.Tc_out_observed];

    for (let i = 0; i < 4; i++) {
        if (g.vols[i] <= 0)
            g.T_measured[i] = -1;
    }
});