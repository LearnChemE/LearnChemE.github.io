import { calcAll, setDefaults } from "./calcs";

export function handleInputs() {
  initializeHamburger();
  initializeSlider();
  initializeDropdown();
  initializeTankControls();
  initializeTakeSample();
  initializeInjectSample();
}

function initializeInjectSample() {
  const injectSample = document.getElementById("inject-sample");
  injectSample.addEventListener("click", (e) => {
    e.target.classList.add("clicked");
    setTimeout(() => {
      e.target.classList.remove("clicked");
    }, 50);
    const interval = setInterval(() => {
      if (state.gc.takingSample) {
        state.gc.takingSampleTime += 0.01667 / 4;
        if (state.gc.takingSampleTime >= 1) {
          state.gc.takingSampleTime = 1;
          clearInterval(interval);
        }
      }
    }, 16.67);
  });
}

function initializeTakeSample() {
  const takeSample = document.getElementById("take-sample");
  const injectSample = document.getElementById("inject-sample");
  const fillTank = document.getElementById("fill-tank");
  const emptyTank = document.getElementById("empty-tank");
  const zSlider = document.getElementById("z-slider");
  const mixtureDropdown = document.getElementById("mixture-dropdown");
  const controlsActiveLabel = document.getElementById("controls-active-label");
  const sliderContainer = document.getElementsByClassName("slider-container")[0];
  const dropdownContainer = document.getElementsByClassName("dropdown-container")[0];

  takeSample.addEventListener("click", (e) => {
    state.gc.takingSample = !state.gc.takingSample;
    state.gc.takingSampleFrame = frameCount;
    state.gc.takingSampleTime = 0;
    if (state.gc.takingSample) {
      fillTank.style.display = "none";
      emptyTank.style.display = "none";
      injectSample.style.display = "block";
      takeSample.style.left = "calc(10% + 150px)";
      takeSample.style.top = "2%";
      takeSample.innerHTML = "back to experiment"
      zSlider.setAttribute("disabled", "true");
      mixtureDropdown.setAttribute("disabled", "true");
      sliderContainer.classList.add("disabled");
      dropdownContainer.classList.add("disabled");
      controlsActiveLabel.style.color = "red";
      controlsActiveLabel.style.fontWeight = "bold";
      controlsActiveLabel.innerHTML = "Currently taking sample. Please wait before changing composition.";
    } else {
      e.target.classList.remove("clicked");
      fillTank.style.display = "block";
      emptyTank.style.display = "block";
      injectSample.style.display = "none";
      takeSample.style.left = "";
      takeSample.style.top = "";
      takeSample.innerHTML = "take sample";
      if (state.liquidHeight === 0) {
        zSlider.removeAttribute("disabled");
        mixtureDropdown.removeAttribute("disabled");
        sliderContainer.classList.remove("disabled");
        dropdownContainer.classList.remove("disabled");
        controlsActiveLabel.style.color = "black";
        controlsActiveLabel.style.fontWeight = "normal";
        controlsActiveLabel.innerHTML = "Tank is empty. You may now change the composition of the mixture.";
      } else {
        zSlider.setAttribute("disabled", "true");
        mixtureDropdown.setAttribute("disabled", "true");
        sliderContainer.classList.add("disabled");
        dropdownContainer.classList.add("disabled");
        controlsActiveLabel.style.color = "red";
        controlsActiveLabel.style.fontWeight = "bold";
        controlsActiveLabel.innerHTML = "Tank is full. Please empty the tank before changing composition.";
      }
    }
  });
}

function initializeTankControls() {
  const fillTank = document.getElementById("fill-tank");
  const emptyTank = document.getElementById("empty-tank");
  const zSlider = document.getElementById("z-slider");
  const mixtureDropdown = document.getElementById("mixture-dropdown");
  const controlsActiveLabel = document.getElementById("controls-active-label");
  const sliderContainer = document.getElementsByClassName("slider-container")[0];
  const dropdownContainer = document.getElementsByClassName("dropdown-container")[0];

  fillTank.addEventListener("click", (e) => {
    e.target.classList.add("clicked");
    setTimeout(() => {
      e.target.classList.remove("clicked");
    }, 50);
    zSlider.setAttribute("disabled", "true");
    mixtureDropdown.setAttribute("disabled", "true");
    sliderContainer.classList.add("disabled");
    dropdownContainer.classList.add("disabled");
    controlsActiveLabel.style.color = "red";
    controlsActiveLabel.style.fontWeight = "bold";
    controlsActiveLabel.innerHTML = "Tank is full. Please empty the tank before changing composition.";
    setDefaults();
    state.liquidHeight = 1;
    calcAll();
  });

  emptyTank.addEventListener("click", (e) => {
    e.target.classList.add("clicked");
    setTimeout(() => {
      e.target.classList.remove("clicked");
    }, 50);
    state.liquidHeight = 0;
    state.pump.on = false;
    zSlider.removeAttribute("disabled");
    mixtureDropdown.removeAttribute("disabled");
    sliderContainer.classList.remove("disabled");
    dropdownContainer.classList.remove("disabled");
    controlsActiveLabel.style.color = "black";
    controlsActiveLabel.style.fontWeight = "normal";
    controlsActiveLabel.innerHTML = "Tank is empty. You may now change the composition of the mixture.";
    calcAll();
  });
}

function initializeSlider() {
  const zSlider = document.getElementById("z-slider");
  const zValue = document.getElementById("z-value");
  zSlider.addEventListener("input", (e) => {
    const value = Number(e.target.value);
    zValue.innerHTML = value.toFixed(2);
    state.xF = value;
    setDefaults();
    calcAll();
  });
}

function initializeDropdown() {
  const mixtureDropdown = document.getElementById("mixture-dropdown");
  const zSliderLabel = document.getElementById("z-slider-label");
  const chemical1label = document.getElementById("chemical-1");
  const chemical2label = document.getElementById("chemical-2");
  const A1 = document.getElementById("a1");
  const B1 = document.getElementById("b1");
  const C1 = document.getElementById("c1");
  const MW1 = document.getElementById("mw1");
  const A2 = document.getElementById("a2");
  const B2 = document.getElementById("b2");
  const C2 = document.getElementById("c2");
  const MW2 = document.getElementById("mw2");
  mixtureDropdown.addEventListener("change", (e) => {
    const selectedOption = e.target.value;
    switch (selectedOption) {
      case "a":
        zSliderLabel.innerHTML = `x<sub>F</sub> (${state.chemicals.chemical1.name})`;
        chemical1label.innerHTML = state.chemicals.chemical1.name;
        chemical2label.innerHTML = state.chemicals.chemical2.name;
        A1.innerHTML = state.chemicals.chemical1.A.toFixed(3);
        B1.innerHTML = state.chemicals.chemical1.B.toFixed(0);
        C1.innerHTML = state.chemicals.chemical1.C.toFixed(1);
        MW1.innerHTML = state.chemicals.chemical1.MW.toFixed(0);
        A2.innerHTML = state.chemicals.chemical2.A.toFixed(3);
        B2.innerHTML = state.chemicals.chemical2.B.toFixed(0);
        C2.innerHTML = state.chemicals.chemical2.C.toFixed(1);
        MW2.innerHTML = state.chemicals.chemical2.MW.toFixed(0);
        window.mixture = [state.chemicals.chemical1, state.chemicals.chemical2];
        break;
      case "b":
        zSliderLabel.innerHTML = `x<sub>F</sub> (${state.chemicals.chemical3.name})`;
        chemical1label.innerHTML = state.chemicals.chemical3.name;
        chemical2label.innerHTML = state.chemicals.chemical4.name;
        A1.innerHTML = state.chemicals.chemical3.A.toFixed(3);
        B1.innerHTML = state.chemicals.chemical3.B.toFixed(0);
        C1.innerHTML = state.chemicals.chemical3.C.toFixed(1);
        MW1.innerHTML = state.chemicals.chemical3.MW.toFixed(0);
        A2.innerHTML = state.chemicals.chemical4.A.toFixed(3);
        B2.innerHTML = state.chemicals.chemical4.B.toFixed(0);
        C2.innerHTML = state.chemicals.chemical4.C.toFixed(1);
        MW2.innerHTML = state.chemicals.chemical4.MW.toFixed(0);
        window.mixture = [state.chemicals.chemical3, state.chemicals.chemical4];
        break;
      case "c":
        zSliderLabel.innerHTML = `x<sub>F</sub> (${state.chemicals.chemical5.name})`;
        chemical1label.innerHTML = state.chemicals.chemical5.name;
        chemical2label.innerHTML = state.chemicals.chemical6.name;
        A1.innerHTML = state.chemicals.chemical5.A.toFixed(3);
        B1.innerHTML = state.chemicals.chemical5.B.toFixed(0);
        C1.innerHTML = state.chemicals.chemical5.C.toFixed(1);
        MW1.innerHTML = state.chemicals.chemical5.MW.toFixed(0);
        A2.innerHTML = state.chemicals.chemical6.A.toFixed(3);
        B2.innerHTML = state.chemicals.chemical6.B.toFixed(0);
        C2.innerHTML = state.chemicals.chemical6.C.toFixed(1);
        MW2.innerHTML = state.chemicals.chemical6.MW.toFixed(0);
        window.mixture = [state.chemicals.chemical5, state.chemicals.chemical6];
        break;
      case "d":
        zSliderLabel.innerHTML = `x<sub>F</sub> (${state.chemicals.chemical7.name})`;
        chemical1label.innerHTML = state.chemicals.chemical7.name;
        chemical2label.innerHTML = state.chemicals.chemical8.name;
        A1.innerHTML = state.chemicals.chemical7.A.toFixed(3);
        B1.innerHTML = state.chemicals.chemical7.B.toFixed(0);
        C1.innerHTML = state.chemicals.chemical7.C.toFixed(1);
        MW1.innerHTML = state.chemicals.chemical7.MW.toFixed(0);
        A2.innerHTML = state.chemicals.chemical8.A.toFixed(3);
        B2.innerHTML = state.chemicals.chemical8.B.toFixed(0);
        C2.innerHTML = state.chemicals.chemical8.C.toFixed(1);
        MW2.innerHTML = state.chemicals.chemical8.MW.toFixed(0);
        window.mixture = [state.chemicals.chemical7, state.chemicals.chemical8];
        break;
      default:
        zSliderLabel.innerHTML = `x<sub>F</sub> (${state.chemicals.chemical1.name})`;
        chemical1label.innerHTML = state.chemicals.chemical1.name;
        chemical2label.innerHTML = state.chemicals.chemical2.name;
        A1.innerHTML = state.chemicals.chemical1.A.toFixed(3);
        B1.innerHTML = state.chemicals.chemical1.B.toFixed(0);
        C1.innerHTML = state.chemicals.chemical1.C;
        MW1.innerHTML = state.chemicals.chemical1.MW;
        A2.innerHTML = state.chemicals.chemical2.A.toFixed(3);
        B2.innerHTML = state.chemicals.chemical2.B.toFixed(0);
        C2.innerHTML = state.chemicals.chemical2.C;
        MW2.innerHTML = state.chemicals.chemical2.MW;
        window.mixture = [state.chemicals.chemical1, state.chemicals.chemical2];
        break;
    }
    setDefaults();
    calcAll();
  });
}

function handleHamburger() {
  const hamburger = document.getElementById("hamburger");
  const hamburgerIcon = document.getElementById("hamburger-btn");;
  const buttons = document.getElementById("controls");

  hamburger.addEventListener("click", (e) => {
    if (
      !buttons.contains(e.target) || e.target.classList.contains("btn-close")
    ) {
      if (state.showButtons) {
        console.log("hiding from 1")
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

  // Make the DIV element draggable:
  dragElement(buttons, document.getElementById("button-header"));
}

function initializeHamburger() {
  handleHamburger();
}

function dragElement(elmnt, header) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (header) {
    // if present, the header is where you move the DIV from:
    header.onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}