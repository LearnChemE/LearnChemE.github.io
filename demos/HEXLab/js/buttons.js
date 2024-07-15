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

// Input name box
inputName.addEventListener("input", () => {
    const input = inputName.value;
    g.name = input;
});

// Start / Reset button
startButton.addEventListener("click", () => {
    if (g.state == 0) {
        g.state = 1;
        startButton.innerHTML = `<i class="fa-solid fa-arrow-rotate-left"></i><div>reset</div>`;
    }
    else {
        g.state = 0;
        startButton.innerHTML = `<i class="fa-solid fa-play"></i><div>start</div>`;
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

