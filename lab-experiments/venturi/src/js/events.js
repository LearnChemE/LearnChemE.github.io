// import "./animations.js";
import { switchLogic, valveLogic } from "./animations.js";

function setDefaults(elts) {
  elts.intakeLiquid.style.strokeDasharray = elts.intakeLiquidMaxLength;
  elts.intakeLiquid.style.strokeDashoffset = elts.intakeLiquidMaxLength;

  elts.tubeLiquid.style.strokeDasharray = elts.tubeLiquidMaxLength;
  elts.tubeLiquid.style.strokeDashoffset = elts.tubeLiquidMaxLength;

  elts.manometerLiquids.forEach((manometerLiquid) => {
    const manometerMaxHeight = Number(manometerLiquid.getTotalLength());
    manometerLiquid.style.strokeDasharray = manometerMaxHeight;
    manometerLiquid.style.strokeDashoffset = manometerMaxHeight;
  });

  state.switchOn = false;
  state.flowing = false;

  if (!state.initialized) {
    enableSvgZoom();
    enableSvgDrag(elts);
    state.initialized = true;
  } else {
    elts.switchElt.setAttribute("x", "-10.611537");
    elts.switchElt.setAttribute("y", "110.71905");
    elts.switchElt.setAttribute("transform", "rotate(-38.9859)")
  }

  elts.sourceLiquid.setAttribute("height", "26.25");
  elts.sourceLiquid.setAttribute("y", "212.8763");
  elts.wasteLiquid.setAttribute("height", "0");
  elts.wasteLiquid.setAttribute("y", `${212.91513 + 26.25}`);

  elts.tubeLiquid.style.strokeDashoffset = elts.tubeLiquidMaxLength;
  elts.intakeLiquid.style.strokeDashoffset = elts.intakeLiquidMaxLength;

}

function enableSvgZoom() {
  const svg = document.getElementById("canvas");
  const viewBox = svg.getAttribute("viewBox").split(" ").map(Number);
  state.maxViewBox = viewBox;
  state.viewBox = viewBox;

  svg.addEventListener("wheel", (e) => {
    e.preventDefault();
    // set the scaling factor (and make sure it's at least 10%)
    let scale = e.deltaY / 1000;
    scale =
      Math.abs(scale) < 0.1 ? (0.1 * e.deltaY) / Math.abs(e.deltaY) : scale;

    // get point in SVG space
    let pt = new DOMPoint(e.clientX, e.clientY);
    pt = pt.matrixTransform(svg.getScreenCTM().inverse());

    // get viewbox transform
    let [x, y, width, height] = svg
      .getAttribute("viewBox")
      .split(" ")
      .map(Number);
    const amountZoomed =
      width / (state.maxViewBox[2] - state.maxViewBox[0]);
    scale *= Math.max(0.1, amountZoomed);

    // get pt.x as a proportion of width and pt.y as proportion of height
    let [xPropW, yPropH] = [(pt.x - x) / width, (pt.y - y) / height];

    // calc new width and height, new x2, y2 (using proportions and new width and height)
    let [width2, height2] = [
      Math.min(state.maxViewBox[2], width + width * scale),
      Math.min(state.maxViewBox[3], height + height * scale),
    ];
    let x2 = Math.max(0, pt.x - xPropW * width2);
    let y2 = Math.max(0, pt.y - yPropH * height2);

    [width2, height2] = [
      Math.max(10, Math.min(state.maxViewBox[2] - x2, width2)),
      Math.max(10, Math.min(state.maxViewBox[3] - y2, height2)),
    ];

    if (
      Number.isNaN(x2) ||
      Number.isNaN(y2) ||
      Number.isNaN(width2) ||
      Number.isNaN(height2)
    ) {
      return;
    }

    svg.setAttribute("viewBox", `${x2} ${y2} ${width2} ${height2}`);
  });
}

function enableSvgDrag(elts) {
  const svg = document.getElementById("canvas");
  let isDragging = false;
  let prevX = 0;
  let prevY = 0;
  let rulerTransformX = 0;
  let rulerTransformY = 0;

  let onRuler = false;
  const ruler = elts.ruler;

  ruler.addEventListener("mouseover", () => {
    onRuler = true;
  });

  ruler.addEventListener("mouseout", () => {
    if (!window.mousedown) {
      onRuler = false;
    }
  });

  svg.addEventListener("mousedown", (e) => {
    window.mousedown = true;
    if (
      e.target === elts.switchElt ||
      e.target === elts.switchG ||
      e.target === elts.valve ||
      e.target === elts.valveCircle ||
      e.target === elts.valveRect
    ) {
      return;
    }
    isDragging = true;
    prevX = e.clientX;
    prevY = e.clientY;
    const currentTransform = ruler.getAttribute("transform");
    rulerTransformX = Number(currentTransform.match(/translate\(([^,]+),/)[1]);
    rulerTransformY = Number(currentTransform.match(/,([^)]+)\)/)[1]);
  });

  // Hold mouse to move the camera around
  svg.addEventListener("mousemove", (e) => {
    if (isDragging && !onRuler) {
      const [x, y, width, height] = svg
        .getAttribute("viewBox")
        .split(" ")
        .map(Number);
      const dx = ((prevX - e.clientX) * width) / svg.clientWidth;
      const dy = ((prevY - e.clientY) * height) / svg.clientHeight;
      let viewX = Math.max(0, x + dx);
      let viewY = Math.max(0, y + dy);
      let viewWidth = Math.min(state.maxViewBox[2], width);
      let viewHeight = Math.min(state.maxViewBox[3], height);
      if (viewX + viewWidth >= state.maxViewBox[2]) {
        viewX = state.maxViewBox[2] - viewWidth;
      }
      if (viewY + viewHeight >= state.maxViewBox[3]) {
        viewY = state.maxViewBox[3] - viewHeight;
      }
      svg.setAttribute(
        "viewBox",
        `${viewX} ${viewY} ${viewWidth} ${viewHeight}`
      );
      prevX = e.clientX;
      prevY = e.clientY;
    } else if (isDragging && onRuler) {
      const [x, y, width, height] = svg
        .getAttribute("viewBox")
        .split(" ")
        .map(Number);
      const dx = ((prevX - e.clientX) * width) / svg.clientWidth;
      const dy = ((prevY - e.clientY) * height) / svg.clientHeight;
      ruler.setAttribute("transform", `translate(${rulerTransformX - dx}, ${rulerTransformY - dy})`);
    }
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    window.mousedown = false;
  });
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

function handleReset(elts) {
  const resetButton = document.getElementById("reset");
  resetButton.addEventListener("click", () => {
    resetButton.classList.add("clicked");
    state.resetting = true;
    setTimeout(() => {
      resetButton.classList.remove("clicked");
      state.resetting = false;
    }, 100);
    setDefaults(elts);
  });
}

export default function addEvents() {
  const elts = {
    intakeLiquid: document.getElementById("intake-liquid"),
    tubeLiquid: document.getElementById("tube-liquid"),
    manometerLiquids: [
      document.getElementById("manometer-liquid-1"),
      document.getElementById("manometer-liquid-2"),
      document.getElementById("manometer-liquid-3"),
      document.getElementById("manometer-liquid-4"),
      document.getElementById("manometer-liquid-5"),
    ],
    switchElt: document.getElementById("switch"),
    switchG: document.getElementById("power-switch"),
    valve: document.getElementById("valve"),
    valveCircle: document.getElementById("valve-circle"),
    valveRect: document.getElementById("valve-rect"),
    ruler: document.getElementById("ruler"),
    sourceLiquid: document.getElementById("source-liquid"),
    wasteLiquid: document.getElementById("waste-liquid"),
    resetButton: document.getElementById("reset"),
  };

  elts.intakeLiquidMaxLength = Number(elts.intakeLiquid.getTotalLength());
  elts.tubeLiquidMaxLength = Number(elts.tubeLiquid.getTotalLength());

  setDefaults(elts);
  switchLogic(elts);
  valveLogic(elts);
  handleReset(elts);
  handleHamburger();
}