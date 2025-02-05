import Hamburger from "../assets/hamburger.svg";

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
        window.sessionStorage.setItem("hamburgerHasBeenClicked", "true");
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

export function initializeUnitsButton() {
  const units = document.getElementById("temp-units");
  units.addEventListener("click", () => {
    units.classList.add("clicked");
    setTimeout(() => {
      units.classList.remove("clicked");
    }, 100);
    if (state.temperatureUnits === "C") {
      state.temperatureUnits = "F";
    } else {
      state.temperatureUnits = "C";
    }
  });
}

export function initializeReset() {
  const reset = document.getElementById("reset");
  reset.addEventListener("click", () => {
    reset.classList.add("clicked");
    setTimeout(() => {
      reset.classList.remove("clicked");
    }, 100);
    state.flowState = new Array(16).fill(0);
    state.beakerWaterLevel = 1000;
    state.pumpOn = false;
    state.fanOn = false;
    state.airInletTemperature = 22;
    state.waterOutletTemperature = 22;
    state.beakerTemperature = 52;
    state.apparatusTemperatureTop = 22;
    state.apparatusTargetTemperatureTop = 22;
    state.airOutletTemperature = 22;
    state.airOutletTargetTemperature = 22;
    state.outletHumidity = 0.005;
    state.outletTargetHumidity = 0.005;
    state.ambientHumidity = 0.005;
    state.waterOnMesh = false;
    state.waterInReservoir = false;
    state.reservoirVolume = 0;
  });
}