import Hamburger from "../assets/hamburger.svg";
import { setDefaults } from "./calcs";

const left25 = document.getElementById("left-25");
const left50 = document.getElementById("left-50");
const left100 = document.getElementById("left-100");
const right25 = document.getElementById("right-25");
const right50 = document.getElementById("right-50");
const right100 = document.getElementById("right-100");
const pressureSlider = document.getElementById("pressure-slider");
const pressureValue = document.getElementById("pressure-value");
const temperatureSlider = document.getElementById("temperature-slider");
const temperatureValue = document.getElementById("temperature-value");
const soundsButton = document.getElementById("sounds");
const soundOn = document.getElementById("sound-on");
const soundOff = document.getElementById("sound-off");
const canvas = document.querySelector("canvas");

function handleReset() {
  const resetButton = document.getElementById("reset");
  resetButton.addEventListener("click", () => {
    resetButton.style.backgroundColor = "rgb(255, 120, 120)";
    setTimeout(() => {
      resetButton.style.backgroundColor = "";
    }, 50);
    [left25, left50, left100, right25, right50, right100, pressureSlider, temperatureSlider].forEach((button) => {
      button.classList.remove("disabled");
    });
    const currentLeftTankSize = state.leftTank.volume;
    const currentRightTankSize = state.rightTank.volume;
    setDefaults();
    switch (currentLeftTankSize) {
      case 25:
        left25.click();
        break;
      case 50:
        left50.click();
        break;
      case 100:
        left100.click();
        break;
    }
    switch (currentRightTankSize) {
      case 25:
        right25.click();
        break;
      case 50:
        right50.click();
        break;
      case 100:
        right100.click();
        break;
    }
    if (!gasReleaseSound.paused || !gasTransferSound.paused) {
      gasReleaseSound.pause();
      gasTransferSound.pause();
      gasReleaseSound.currentTime = 0;
      gasTransferSound.currentTime = 0;
    }
  });
}

function handleSize() {
  left25.addEventListener("click", () => {
    left25.classList.add("clicked");
    removeActiveLeft();
    left25.classList.add("active");
    setTimeout(() => {
      left25.classList.remove("clicked");
    }, 50);
    state.leftTank.volume = 25;
    state.leftTank.width = 12;
    state.leftTank.height = 30;
    state.leftTank.xCoord = 34;
  });

  left50.addEventListener("click", () => {
    left50.classList.add("clicked");
    removeActiveLeft();
    left50.classList.add("active");
    setTimeout(() => {
      left50.classList.remove("clicked");
    }, 50);
    state.leftTank.volume = 50;
    state.leftTank.width = 15;
    state.leftTank.height = 60;
    state.leftTank.xCoord = 32.5;
  });

  left100.addEventListener("click", () => {
    left100.classList.add("clicked");
    removeActiveLeft();
    left100.classList.add("active");
    setTimeout(() => {
      left100.classList.remove("clicked");
    }, 50);
    state.leftTank.volume = 100;
    state.leftTank.width = 20;
    state.leftTank.height = 80;
    state.leftTank.xCoord = 30;
  });

  right25.addEventListener("click", () => {
    right25.classList.add("clicked");
    removeActiveRight();
    right25.classList.add("active");
    setTimeout(() => {
      right25.classList.remove("clicked");
    }, 50);
    state.rightTank.volume = 25;
    state.rightTank.width = 12;
    state.rightTank.height = 30;
    state.rightTank.xCoord = 104;
  });

  right50.addEventListener("click", () => {
    right50.classList.add("clicked");
    removeActiveRight();
    right50.classList.add("active");
    setTimeout(() => {
      right50.classList.remove("clicked");
    }, 50);
    state.rightTank.volume = 50;
    state.rightTank.width = 15;
    state.rightTank.height = 60;
    state.rightTank.xCoord = 102.5;
  });

  right100.addEventListener("click", () => {
    right100.classList.add("clicked");
    removeActiveRight();
    right100.classList.add("active");
    setTimeout(() => {
      right100.classList.remove("clicked");
    }, 50);
    state.rightTank.volume = 100;
    state.rightTank.width = 20;
    state.rightTank.height = 80;
    state.rightTank.xCoord = 100;
  });
}

function removeActiveLeft() {
  [left25, left50, left100].forEach((button) => {
    button.classList.remove("active");
  });
}

function removeActiveRight() {
  [right25, right50, right100].forEach((button) => {
    button.classList.remove("active");
  });
}

function handleSliders() {
  pressureSlider.addEventListener("input", () => {
    const P = Number(pressureSlider.value);
    state.leftTank.pressure = P * 1e6;
    pressureValue.innerHTML = P.toFixed(1);
  });
  temperatureSlider.addEventListener("input", () => {
    const T = Number(temperatureSlider.value);
    state.leftTank.temperature = T;
    temperatureValue.innerHTML = T;
  });
}

function handleSounds() {
  soundsButton.addEventListener("click", () => {
    if (state.sounds) {
      state.sounds = false;
      gasReleaseSound.volume = 0;
      gasTransferSound.volume = 0;
      soundOn.style.display = "block";
      soundOff.style.display = "none";
      window.localStorage.setItem("sounds", "false");
    } else {
      state.sounds = true;
      gasReleaseSound.volume = 1;
      gasTransferSound.volume = 1;
      soundOn.style.display = "none";
      soundOff.style.display = "block";
      window.localStorage.setItem("sounds", "true");
    }
  });
}

export function handleInputs() {
  handleReset();
  handleSize();
  handleSliders();
  handleSounds();
}

function handleHamburger() {
  const hamburger = document.getElementById("hamburger");
  const hamburgerIcon = document.getElementById("hamburger-icon");
  const buttons = document.getElementById("buttons");

  hamburgerIcon.style.transitionProperty = "background-color";
  hamburgerIcon.style.transitionDuration = "0.5s";
  const glowInterval = setInterval(() => {
    if (!state.hamburgerHasBeenClicked) {
      hamburgerIcon.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
      setTimeout(() => {
        hamburgerIcon.style.backgroundColor = "";
      }, 800);
    } else {
      hamburgerIcon.style.backgroundColor = "";
      hamburgerIcon.style.transitionProperty = "";
      hamburgerIcon.style.transitionDuration = "";
      clearInterval(glowInterval);
    }
  }, 1600);

  hamburger.addEventListener("click", (e) => {
    if (
      e.target.id !== "controls" &&
      e.target.id !== "buttons" &&
      !e.target.classList.contains("btn")
    ) {
      if (state.showButtons) {
        buttons.style.display = "none";
        state.showButtons = false;
        hamburgerIcon.classList.remove("active");
      } else {
        buttons.style.display = "grid";
        state.showButtons = true;
        hamburgerIcon.classList.add("active");
        state.hamburgerHasBeenClicked = true;
        window.localStorage.setItem("hamburgerHasBeenClicked", "true");
      }
    }
  });

  document.addEventListener("click", (e) => {
    if (
      e.target.id !== "controls" &&
      e.target.id !== "buttons" &&
      !e.target.classList.contains("btn") &&
      e.target.id !== "hamburger" &&
      e.target.id !== "hamburger-icon" &&
      e.target.id !== "hamburger-svg" &&
      e.target.tagName !== "path" &&
      !e.target.classList.contains("modal") &&
      !e.target.classList.contains("modal-dialog") &&
      !e.target.classList.contains("modal-content") &&
      !e.target.classList.contains("modal-body") &&
      !e.target.classList.contains("modal-header")
    ) {
      if (e.target.tagName !== "HTML") {
        if (!e.target.parentElement.classList.contains("modal-body") &&
          !e.target.parentElement.classList.contains("modal-header")
        ) {
          buttons.style.display = "none";
          state.showButtons = false;
          hamburgerIcon.classList.remove("active");
        }
      } else {
        buttons.style.display = "none";
        state.showButtons = false;
        hamburgerIcon.classList.remove("active");
      }
    }
  });
}

export function initializeHamburger() {
  const hamburgerContainer = document.getElementById("hamburger-icon");
  hamburgerContainer.innerHTML = Hamburger;
  handleHamburger();
}