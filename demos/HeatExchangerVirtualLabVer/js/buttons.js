// const dtBtn = $("#double-tube-btn");
// const stBtn = $("#shell-tube-btn");

// $(() => {
//     dtBtn.click(() => {
//         dtBtn.addClass("btn-primary");
//         dtBtn.removeClass("btn-outline-primary");

//         stBtn.addClass("btn-outline-primary");
//         stBtn.removeClass("btn-primary");

//         g.hexType = DOUBLE_TUBE;
//     });
//     // stBtn.click(() => {
//     //     stBtn.addClass("btn-primary");
//     //     stBtn.removeClass("btn-outline-primary");

//     //     dtBtn.addClass("btn-outline-primary");
//     //     dtBtn.removeClass("btn-primary");

//     //     g.hexType = SHELL_TUBE;
//     // });
// });

const startButton = document.getElementById("start-reset-btn");
const inputName = document.getElementById("input-name");
const playBtn = document.getElementById("play-btn");
const measureBtn = document.getElementById("measure-btn");
const nextBtn = document.getElementById("next-btn");
const timeSlider = document.getElementById("progress-bar");
const timeLabel = document.getElementById("time-label");
const lmtdBtn = document.getElementById("calc-lmtd-btn");
const prevBtn = document.getElementById("prev-btn");
const pumpBtns = document.getElementById("pump-btns");
const hPumpBtn = document.getElementById("process-pump-btn");
const cPumpBtn = document.getElementById("service-pump-btn");

// Hides all controls but the start/reset button
function hideExtraControls() {
    startButton.style.width = "45px";
    inputName.classList.remove("hidden");
    prevBtn.classList.add("hidden");
    nextBtn.classList.add("hidden");
    document.getElementById("time-wrapper").classList.add("hidden");
    measureBtn.classList.add("hidden");
    inputName.classList.add("hidden");
    document.getElementById("t-selection-btn-wrapper").classList.add("hidden");
    lmtdBtn.classList.add("hidden");
    pumpBtns.classList.add("hidden");
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
            nextBtn.classList.remove("hidden");
            pumpBtns.classList.remove("hidden");
            hPumpBtn.disabled = false;
            hPumpBtn.ariaDisabled = false;
            cPumpBtn.disabled = false;
            cPumpBtn.ariaDisabled = false;
            break;
        case 2:
            nextBtn.classList.remove("hidden");
            prevBtn.classList.remove("hidden");
            break;
        case 3:
            nextBtn.classList.remove("hidden");
            prevBtn.classList.remove("hidden");
            measureBtn.classList.remove("hidden");
            document.getElementById("t-selection-btn-wrapper").classList.remove("hidden");
            break;
        case 4:
            nextBtn.classList.remove("hidden");
            prevBtn.classList.remove("hidden");
            lmtdBtn.classList.remove("hidden");
            break;
        case 5:
            nextBtn.classList.remove("hidden");
            prevBtn.classList.remove("hidden");
            document.getElementById("sim-sliders").classList.remove("hidden");
            lmtdBtn.classList.remove("hidden");
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
    if (g.blueTime != -1) enableNextBtn();
    hPumpBtn.disabled = true;
    hPumpBtn.ariaDisabled = true;
});
cPumpBtn.addEventListener("click", () => {
    g.blueTime = millis();
    if (g.orngTime != -1) enableNextBtn();
    cPumpBtn.disabled = true;
    cPumpBtn.ariaDisabled = true;
});

// Start / Reset button
startButton.addEventListener("click", () => {
    if (g.state == 0) {
        g.state = 1;
        startButton.innerHTML = `<i class="fa-solid fa-arrow-rotate-left"></i>`;
        startButton.title = "Restart";
    }
    else {
        g.state = 0;
        startButton.innerHTML = `<i class="fa-solid fa-play"></i><div>start</div>`;
        startButton.title = "Start Lab"
    }

    showSimulationControls();
});

// Green Play Animation Button 
playBtn.addEventListener("click", () => {
    if (g.playS1) {
        g.playS1 = false;
        playBtn.classList.remove("btn-outline-danger");
        playBtn.classList.add("btn-outline-success");
        playBtn.innerHTML = `<i class="fa-solid fa-play"></i>`;
    }
    else if (g.s1time >= 16.0) {
        g.s1time = 0;
        timeSlider.value = 0;
        timeLabel.innerHTML = `0.0`;
        g.playS1 = true;
        playBtn.classList.add("btn-outline-danger");
        playBtn.classList.remove("btn-outline-success");
        playBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`;
    }
    else {
        g.playS1 = true;
        playBtn.classList.add("btn-outline-danger");
        playBtn.classList.remove("btn-outline-success");
        playBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`;
    }
})

// Take Measurement Button
measureBtn.addEventListener("click", () => {
    switch (g.state) {
        case 1:
            let time;
            if ((time = g.s1time) >= 1.5) {
                g.s1measure = time;
                enableNextBtn();
            }
            break;
        case 3:
            switch (g.s3select) {
                case 0:
                    g.s3measure[1] = randomGaussian(g.Th_in, .1);
                    break;
                case 1:
                    g.s3measure[2] = randomGaussian(g.Th_out, .1);
                    break;
                case 2:
                    g.s3measure[3] = randomGaussian(g.Tc_in, .1);
                    break;
                case 3:
                    g.s3measure[0] = randomGaussian(g.Tc_out, .1);
                    break;
            }
            let allMeasured = true;
            for (let i = 0; i < 4; i++) {
                allMeasured = allMeasured && (g.s3measure[i] != -1);
            }
            if (allMeasured) {
                nextBtn.ariaDisabled = false;
                nextBtn.disabled = false;
            }
            break;
    }
});

// Next Button
nextBtn.addEventListener("click", () => {
    g.state++;
    g.animationStartTime = millis();


    nextBtn.ariaDisabled = true;
    nextBtn.disabled = true;
    showSimulationControls();
});



prevBtn.addEventListener("click", () => {
    g.state--;
    showSimulationControls();
});

lmtdBtn.addEventListener("click", () => {
    g.showLmtd = true;
    g.animationStartTime = millis();
    enableNextBtn();
});

// Enables the next button
function enableNextBtn() {
    nextBtn.ariaDisabled = false;
    nextBtn.disabled = false;
}

// Syncs the time slider to the time of the animation
function playTime() {
    time = Number(timeSlider.value);
    time = time + deltaTime / 1000;
    g.s1time = time;
    timeSlider.value = time;
    timeLabel.innerHTML = `${time.toFixed(1)}`;

    if (time >= 16.0) {
        g.playS1 = false;
        playBtn.classList.remove("btn-outline-danger");
        playBtn.classList.add("btn-outline-success");
        playBtn.innerHTML = `<i class="fa-solid fa-play"></i>`;
    }
}

// Time slider inputs
timeSlider.addEventListener("input", () => {
    time = Number(timeSlider.value);
    g.s1time = time;
    g.playS1 = false;
    playBtn.classList.remove("btn-outline-danger");
    playBtn.classList.add("btn-outline-success");
    playBtn.innerHTML = `<i class="fa-solid fa-play"></i>`;
    timeLabel.innerHTML = `${time.toFixed(1)}`;
});

// Stage 3 buttons
const tempSelectionBtns = [document.getElementById("thi-btn"),
document.getElementById("tho-btn"),
document.getElementById("tci-btn"),
document.getElementById("tco-btn")];

tempSelectionBtns[0].addEventListener("click", () => {
    g.s3select = 0;
    outlineSelectionButtons(0);
});
tempSelectionBtns[1].addEventListener("click", () => {
    g.s3select = 1;
    outlineSelectionButtons(1);
});
tempSelectionBtns[2].addEventListener("click", () => {
    g.s3select = 2;
    outlineSelectionButtons(2);
});
tempSelectionBtns[3].addEventListener("click", () => {
    g.s3select = 3;
    outlineSelectionButtons(3);
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