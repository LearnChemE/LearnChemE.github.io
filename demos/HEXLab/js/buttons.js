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

inputName.addEventListener("input", () => {
    const input = inputName.value;
    g.name = input;
});

startButton.addEventListener("click", () => {
    if (g.state == 0) {
        g.state = 1;
        startButton.innerHTML = `<i class="fa-solid fa-backward-fast"></i><div>reset</div>`;
        inputName.classList.add("hidden");
    }
    else {
        g.state = 0;
        startButton.innerHTML = `<i class="fa-solid fa-play"></i><div>start</div>`;
        inputName.classList.remove("hidden");
    }
});

playBtn.addEventListener("click", () => {
    console.log('clicked')
    if (g.playS1) {
        g.playS1 = false;
        playBtn.classList.remove("btn-outline-danger");
        playBtn.classList.add("btn-outline-success");
        playBtn.innerHTML = `<i class="fa-solid fa-play"></i>`;
    }
    else if (g.s1time >= 15) {
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

timeSlider = document.getElementById("progress-bar");
timeLabel = document.getElementById("time-label");

function playTime() {
    time = Number(timeSlider.value);
    console.log(deltaTime);
    time = time + deltaTime / 1000;
    g.s1time = time;
    timeSlider.value = time;
    timeLabel.innerHTML = `${time.toFixed(1)}`;

    if (time >= 15) {
        g.playS1 = false;
        playBtn.classList.remove("btn-outline-danger");
        playBtn.classList.add("btn-outline-success");
        playBtn.innerHTML = `<i class="fa-solid fa-play"></i>`;
    }
}

timeSlider.addEventListener("input", () => {
    time = Number(timeSlider.value);
    g.s1time = time;
    g.playS1 = false;
    playBtn.classList.remove("btn-outline-danger");
    playBtn.classList.add("btn-outline-success");
    playBtn.innerHTML = `<i class="fa-solid fa-play"></i>`;
    timeLabel.innerHTML = `${time.toFixed(1)}`;
});