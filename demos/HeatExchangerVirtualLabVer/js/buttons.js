const startButton = document.getElementById("start-reset-btn");
const inputName = document.getElementById("input-name");
const nextBtn = document.getElementById("next-btn");
const prevBtn = document.getElementById("prev-btn");
const pumpBtns = document.getElementById("pump-btns");
const hPumpBtn = document.getElementById("process-pump-btn");
const cPumpBtn = document.getElementById("service-pump-btn");
const resetRandBtn = document.getElementById("reset-new-btn");
const resetKeepBtn = document.getElementById("reset-keep-btn");

// Hides all controls but the start/reset button
function hideExtraControls() {
    inputName.classList.remove("hidden");
    inputName.classList.add("hidden");
    pumpBtns.classList.add("hidden");
    document.getElementById("reset-modal-btn").classList.add("hidden");
}

// Determine what html elements are unhidden
function showSimulationControls() {
    hideExtraControls();
    switch (g.state) {
        case -1:
            break;
        case 0:
            inputName.classList.remove("hidden");
            startButton.style.width = "max-content";
            break;
        case 1:
            pumpBtns.classList.remove("hidden");

            document.getElementById("reset-modal-btn").classList.remove("hidden");
            break;
    }
}

// Input name box
inputName.addEventListener("input", () => {
    const input = inputName.value;
    g.name = input;
});

hPumpBtn.addEventListener("click", () => {
    g.orngTime = millis();
    g.hIsFlowing = true;
    hPumpBtn.disabled = true;
    hPumpBtn.ariaDisabled = true;
});
cPumpBtn.addEventListener("click", () => {
    g.blueTime = millis();
    g.cIsFlowing = true;
    cPumpBtn.disabled = true;
    cPumpBtn.ariaDisabled = true;
});

// Start / Reset button
startButton.addEventListener("click", () => {
    if (g.state == 0) {
        g.state = 1;
        startButton.innerHTML = `<i class="fa-solid fa-arrow-rotate-left"></i><div>back</div>`;
        startButton.title = "Restart";
    }
    else {
        g.state = 0;
        startButton.innerHTML = `<i class="fa-solid fa-play"></i><div>start</div>`;
        startButton.title = "Start Lab"
    }

    showSimulationControls();
});

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
function updateTooltips() {
    var strTemp = (g.vols[0] > 0) ? g.Th_in.toFixed(1) : '-';
    var str = "temperature: " + strTemp + " °C, volume: " + g.vols[0].toFixed(1) + " mL";
    hiTt.setAttribute("data-bs-original-title", str);

    str = "temperature: " + g.Th_out_observed.toFixed(1) + " °C, volume: " + g.vols[1].toFixed(1) + " mL";
    hoTt.setAttribute("data-bs-original-title", str);

    strTemp = (g.vols[2] > 0) ? g.Tc_in.toFixed(1) : '-';
    str = "temperature: " + strTemp + " °C, volume: " + g.vols[2].toFixed(1) + " mL";
    ciTt.setAttribute("data-bs-original-title", str);

    str = "temperature: " + g.Tc_out.toFixed(1) + " °C, volume: " + g.vols[3].toFixed(1) + " mL";
    coTt.setAttribute("data-bs-original-title", str);
}

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
        g.mDotH = map(angle, PI / 4, PI / 2, 1, 10);
    }
    else if (g.dragging2) {
        angle = atan2(mouseY - 461, mouseX - 415);
        angle = constrain(angle, PI / 4, PI / 2);
        g.mDotC = map(angle, PI / 4, PI / 2, 1, 10);
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

    hPumpBtn.disabled = false;
    hPumpBtn.ariaDisabled = false;
    cPumpBtn.disabled = false;
    cPumpBtn.ariaDisabled = false;
}