const pumpBtns = document.getElementById("pump-btns");
const hPumpBtn = document.getElementById("process-pump-btn");
const resetRandBtn = document.getElementById("reset-new-btn");
const resetKeepBtn = document.getElementById("reset-keep-btn");
const measureBtn = document.getElementById("measure-temps-btn");

/* **************************************************************** */
/* ** This file manages DOM-related info and handles user inputs ** */
/* **************************************************************** */

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

// Starts pumps when button is pressed
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

// Stops pumps when button is pressed
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

const hiTt = document.getElementById("hi-tooltip");
const hoTt = document.getElementById("ho-tooltip");
const ciTt = document.getElementById("ci-tooltip");
const coTt = document.getElementById("co-tooltip");
let tooltipIsShowingOnDiv = -1;
// Updates the tooltips. This is very hard because bootstrap and jQuery tooltips weren't designed to be updated in real-time.
// What this does is everytime the tooltip should be updated, it searches for the tooltip in the DOM by its '.tooltip-inner' css class
// Then it updates that tooltip with the correct text. This is only good for displaying one tooltip at a time, because you can't identify which tooltip is which this way.
function updateTooltips() {
    if (tooltipIsShowingOnDiv === -1) return;
    var strTemp; //= (g.vols[0] > 0) ? g.Th_in.toFixed(1) : '-';
    // var strVol;

    strTemp = g.T_measured[tooltipIsShowingOnDiv];
    strTemp = strTemp === -1 ? '--' : strTemp.toFixed(1);
    // strVol = g.vols[tooltipIsShowingOnDiv].toFixed(0);

    var str = "temperature: " + strTemp + " °C"; //, volume: " + strVol + " mL";

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

// Determines which tooltip is being displayed
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

// Cancel dragging
function mouseReleased() {
    g.dragging1 = false;
    g.dragging2 = false;
}

// determine if user is dragging a valve
function mousePressed() {
    if (dist(90, 451, mouseX, mouseY) <= 50) {
        g.dragging1 = true;
    }
    else if (dist(415, 461, mouseX, mouseY) <= 50) {
        g.dragging2 = true;
    }
}

// handle dragging 
function drag() {
    if (g.dragging1) {
        theta = atan2(mouseY - 431, mouseX - 90);
        prevTheta = atan2(pmouseY - 431, pmouseX - 90);
        dTheta = Math.sign(theta * prevTheta) === -1 ? 0 : theta - prevTheta;
        dmDot = map(dTheta, 0, PI / 4, 0, MAX_HOT_FLOWRATE);

        g.mDotH += dmDot;
        g.mDotH = constrain(g.mDotH, MIN_HOT_FLOWRATE, MAX_HOT_FLOWRATE);
    }
    else if (g.dragging2) {
        theta = atan2(mouseY - 461, mouseX - 415);
        prevTheta = atan2(pmouseY - 461, pmouseX - 415);
        dTheta = Math.sign(theta * prevTheta) === -1 ? 0 : theta - prevTheta;
        dmDot = map(dTheta, 0, PI / 4, 0, MAX_COLD_FLOWRATE);

        g.mDotC += dmDot;
        g.mDotC = constrain(g.mDotC, MIN_COLD_FLOWRATE, MAX_COLD_FLOWRATE);
    }
}

// listeners for the buttons in the reset modal
resetRandBtn.addEventListener("click", () => {
    resetVols();
    randStartVals();
});
resetKeepBtn.addEventListener("click", () => {
    resetVols();
});

// reset volumes to initial
function resetVols() {
    g.vols = [1000, 0, 1000, 0];
    g.cIsFlowing = false;
    g.hIsFlowing = false;

    pumpsAreRunning = false;
    stopPumps();
    toggleMeasureTempsButton(false);
}

// toggles html for whether the 'measure temperatures' button is disabled
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